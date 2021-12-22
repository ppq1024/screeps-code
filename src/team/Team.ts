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
import { functions } from '@/creep/functions';

const roleBehaviors: {[role: string]: RoleBehavior} = {
    harvester: harvester,
    carrier: carrier,
    builder: builder,
    upgrader: upgrader,
    cleaner: cleaner,
    supplier: supplier
}

const tasks: {[type: string]: TaskExcutor} = {
    harvest: harvest,
    carry: carry
}

function boost(creep: Creep, lab: StructureLab): boolean {
    if (!lab.store[lab.mineralType]) return false; //没有东西就不要强化了好吧
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
    
            if (task) {
                tasks[task.type].run(creep, task);
                return;
            }
    
            roleBehaviors[description.role].run(creep, description);
        });
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

    abstract getBodyparts(role: Role, costMax?: number): BodyPartConstant[]

    /**
     * 更新team状态
     * 
     * 主要是静态任务搜索和creep升级
     */
    abstract update(): void
}