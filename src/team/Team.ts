/* Copyright(c) PPQ, 2021-2022
 * 
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

import { carrier } from '@/creep/role/carrier';
import { RoleBehavior } from '@/creep/role/RoleBehavior';
import { cleaner } from '@/creep/role/cleaner';
import { supplier } from '@/creep/role/supplier';
import { functions } from '@/creep/functions';
import AbstractMemorial from '@/memory/AbstractMemorial';

const roleBehaviors: Record<Role, RoleBehavior> = {
    harvester: undefined,
    carrier: carrier,
    builder: undefined,
    upgrader: undefined,
    cleaner: cleaner,
    supplier: supplier,
    worker: undefined,
    claimer: undefined,//不同地方可能不太一样
    observer: undefined
}

function boost(creep: Creep, lab: StructureLab): boolean {
    if (lab.store[lab.mineralType] < 30) return false; //没有东西就不要强化了好吧
    if (creep.body.some((bodyPart, _index, _array) => bodyPart.boost == lab.mineralType)) return false;
    if (lab && functions.moveTo(creep, lab, 1)) {
        return lab.boostCreep(creep) == OK;
    }

    return true;
}

abstract class Team extends AbstractMemorial<TeamMemory> implements ControlUnit {
    memory: TeamMemory;

    name: string;
    type: TeamType;
    creeps: Record<string, Creep>;
    defaultSpawn: StructureSpawn;
    room: Room;
    group: Group;

    constructor(memory: TeamMemory, group?: Group) {
        super(memory);

        this.name = memory.name;
        this.type = memory.type;
        this.defaultSpawn = Game.spawns[memory.spawner];
        this.room = Game.rooms[memory.room];
        this.group = group;
        this.creeps = {}
        _.forEach(memory.creeps, (description, name) =>
            this.creeps[name] = Game.creeps[description.alive]
        );
    }

    process(): void {
        throw new Error('Method not implemented.');
    }

    run(): void {
        if (!this.memory.inited && !this.init()) {
            console.log('Cannot init this team: ', this.name);
            return;
        }
        
        _.forEach(this.memory.creeps, (description) => {
            var creep = this.creeps[description.name];

            if (!creep) return;

            if (description.boost) {
                var lab = Game.getObjectById(description.labID);
                if (lab && boost(creep, lab)) return;
            }

            this.preDo(creep);
    
            this.doTask(creep, description);
        });
        this.spawn();
    }

    init(): boolean {
        return this.memory.inited = true;
    }

    abstract doTask(creep: Creep, description: CreepDescription, room?: Room): void;

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

    createCreep(name: string, opts?: {}): boolean {
        if (this.memory.creeps[name]) {
            console.log('This creep already exists.');
            return false;
        }

        if (!opts) opts = {}

        var description = opts['description'] as CreepDescription;
        if (!description) description = {} as CreepDescription;
        var creepName = this.group.name + '_' + this.name + '_' + name;
        description.name = name;
        description.alive = creepName;
        description.body = description.body ? description.body : this.getBodyparts(opts['costMax']);
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

    abstract getBodyparts(costMax?: number): BodyPartConstant[];
}

export default Team;