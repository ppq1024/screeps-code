/*
 * This file is part of PPQ's Screeps Code (ppq.screeps.code).
 *
 * ppq.screeps.code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ppq.screeps.code is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ppq.screeps.code.  If not, see <https://www.gnu.org/licenses/>.
 */

import { builder } from '@/creep/role/builder';
import { carrier } from '@/creep/role/carrier';
import { harvester } from '@/creep/role/harvester';
import { upgrader } from '@/creep/role/upgrader';
import { harvest } from '@/creep/task/harvest';
import { carry } from '@/creep/task/carry';
import { TaskExcutor } from '@/creep/task/TaskExcutor';
import { RoleBehavior } from '@/creep/role/RoleBehavior';
import { cleaner } from '@/creep/role/cleaner';
import { supplier } from '@/creep/role/supplier';
import { worker } from '@/creep/role/worker'
import { functions } from '@/creep/functions';

const roleBehaviors: Record<Role, RoleBehavior> = {
    harvester: harvester,
    carrier: carrier,
    builder: builder,
    upgrader: upgrader,
    cleaner: cleaner,
    supplier: supplier,
    worker: worker,
    claimer: undefined,//不同地方可能不太一样
    observer: undefined
}

const tasks: Record<TaskType, TaskExcutor> = {
    harvest: harvest,
    carry: carry,
    observe: undefined
}

const workerUnit = [WORK, CARRY, MOVE];
const workerUnitCost = 200;
const fullHarvester = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
const fullHarvesterCost = 700;
const carrierUnit = [CARRY, CARRY, MOVE];
const carrierUnitCost = 150;
const halfUpgrader = fullHarvester;
const halfUpgraderCost = fullHarvesterCost;
const fullUpgrader = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
const fullUpgraderCost = 1300;
const cleanerUnit = carrierUnit;
const cleanerUnitCost = carrierUnitCost;
const claimer1 = [CLAIM, MOVE];
const claimer1Cost = 650;
const claimer2 = [CLAIM, CLAIM, MOVE];
const claimer2Cost = 1250;

const getBodyparts = (unit: BodyPartConstant[], unitCost: number, costMax: number) => {
    var unitCount = Math.floor(costMax / unitCost);
    var bodyparts: BodyPartConstant[] = []
    for (var i = 0; i < unitCount; i++) {
        bodyparts.push(...unit);
    }
    return bodyparts;
}

const roleBodyparts: Record<Role, (costMax: number) => BodyPartConstant[]> = {
    worker: (costMax) => getBodyparts(workerUnit, workerUnitCost, costMax),
    harvester: (costMax) => costMax < fullHarvesterCost ?
        getBodyparts(workerUnit, workerUnitCost, costMax) :
        fullHarvester,
    carrier: (costMax) => getBodyparts(carrierUnit, carrierUnitCost, costMax),
    supplier: (costMax) => getBodyparts(carrierUnit, carrierUnitCost, costMax),
    builder: (costMax) => getBodyparts(workerUnit, workerUnitCost, costMax),
    upgrader: (costMax) => costMax < halfUpgraderCost ?
        getBodyparts(workerUnit, workerUnitCost, costMax) :
        costMax < fullUpgraderCost ? halfUpgrader : fullUpgrader,
    cleaner: (costMax) => getBodyparts(cleanerUnit, cleanerUnitCost, costMax),
    claimer: (costMax) => costMax < claimer1Cost ? [] :
        costMax < claimer2Cost ? claimer1 : claimer2,
    observer: (_) => [MOVE]
}

function boost(creep: Creep, lab: StructureLab): boolean {
    if (lab.store[lab.mineralType] < 30) return false; //没有东西就不要强化了好吧
    if (creep.body.some((bodyPart, _index, _array) => bodyPart.boost == lab.mineralType)) return false;
    if (lab && functions.moveTo(creep, lab, 1)) {
        lab.boostCreep(creep) == OK;
    }

    return true;
}

export abstract class Team {
    memory: TeamMemory

    name: string
    type: TeamType
    creeps: {
        [name: string]: Creep
    }
    spawner: StructureSpawn
    room: Room

    protected roleBehaviors: Record<Role, RoleBehavior> = roleBehaviors
    protected tasks: Record<TaskType, TaskExcutor> = tasks

    constructor(memory: TeamMemory) {
        this.memory = memory;

        this.name = memory.name;
        this.spawner = Game.spawns[memory.spawner];
        this.room = Game.rooms[memory.room];
        this.creeps = {}
        _.forEach(memory.creeps, (description, name) => {
            this.creeps[name] = Game.creeps[description.alive];
        });
    }

    run(): void {
        if (!this.memory.inited && !this.init()) {
            console.log('Cannot init this team: ', this.name);
            return;
        }

        if (this.checkUpdate()) this.update();

        this.spawn();
        this.doTask();
    }

    init(): boolean {
        return this.memory.inited = true;
    }

    doTask(): void {
        _.forEach(this.memory.creeps, (description) => {
            var creep = this.creeps[description.name];
            var task = description.task;

            if (!creep) return;

            if (description.boost) {
                var lab = Game.getObjectById(description.labID);
                if (lab && boost(creep, lab)) return;
            }

            this.preDo(creep);
    
            if (task) {
                this.tasks[task.type].run(creep, task);
                return;
            }
    
            this.roleBehaviors[description.role].run(creep, description);
        });
    }

    protected preDo(creep: Creep): void {
        //Default do nothing
    }

    spawn(): void {
        _.forEach(this.memory.creeps, (description) => {
            var creep = Game.creeps[description.alive];
            if (description.autoRespawn && !creep && !description.respawned) {
                var spawnerName = description.spawner ? description.spawner : this.memory.spawner;
                Memory.spawns[spawnerName][description.important ? 'priorQueue' : 'queue']
                        .push({name: description.alive, body: description.body});
                description.respawned = true;
                console.log('Prepare to respawn creep:', description.alive);
                return;
            }
            if (creep && description.respawned) {
                description.respawned = false;
            }
        });
    }

    createCreep(name: string, role: Role, opts?: {}): boolean {
        if (this.memory.creeps[name]) {
            console.log('This creep already exists.')
            return false;
        }

        if (!opts) opts = {}

        var description = opts['description'] as CreepDescription;
        if (!description) description = {} as CreepDescription;
        var creepName = this.name + '_' + role + '_' + name;
        description.name = name;
        description.role = role;
        description.alive = creepName;
        description.body = description.body ? description.body : this.getBodyparts(role, opts['costMax']);
        description.autoRespawn = true;
        this.memory.creeps[name] = description;

        console.log('Add creep: ', creepName);
        return true;
    }

    deleteCreep(name: string): boolean {
        var description = this.memory.creeps[name];
        if (!description) return false;
        var creepName = this.name + '_' + description.role + '_' + name;
        var creep = this.creeps[name];
        if (creep) creep.suicide();
        delete this.memory.creeps[name];
        
        console.log('Delete creep: ', creepName);
        return true;
    }

    getBodyparts(role: Role, costMax?: number): BodyPartConstant[] {
        costMax = costMax ? costMax : this.spawner.room.energyCapacityAvailable;
        return roleBodyparts[role](costMax);
    }

    abstract checkUpdate(): boolean

    /**
     * 更新team状态
     * 
     * 主要是静态任务搜索和creep升级
     */
    abstract update(): void
}