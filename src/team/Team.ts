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
import { repairer } from '@/creep/role/repairer';
import { upgrader } from '@/creep/role/upgrader';
import { harvest } from '@/creep/task/harvest';
import { carry } from '@/creep/task/carry';
import { TaskExcutor } from '@/creep/task/TaskExcutor';
import { RoleBehavior } from '@/creep/role/RoleBehavior';
import { cleaner } from '@/creep/role/cleaner';

const roleBehaviors: {[role: string]: RoleBehavior} = {
    harvester: harvester,
    carrier: carrier,
    builder: builder,
    repairer: repairer,
    upgrader: upgrader,
    cleaner: cleaner
}

const tasks: {[type: string]: TaskExcutor} = {
    harvest: harvest,
    carry: carry
}

export class Team {
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
            this.creeps[name] = Game.creeps[description.alive.work];
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
    
            if (task) {
                tasks[task.type].run(creep, task);
                return;
            }
    
            roleBehaviors[description.role].run(creep);
        });
    }

    spawn(): void {
        _.forEach(this.memory.creeps, (description) => {
            var creep = Game.creeps[description.alive.work];
            if (description.autoRespawn && 
                !(creep || description.advance && creep.ticksToLive > description.advance) &&
                !description.alive.substitute
            ) {
                //添加到队列
                var creepName = this.name + '_' + description.name + '_' + Game.time;
                Memory.spawns[this.memory.spawner][description.important ? 'priorQueue' : 'queue'].push({name:creepName,body:description.body});
                description.alive.substitute = creepName;
                console.log('Prepare to respawn creep:', creepName);
            }
    
            var substitute = Game.creeps[description.alive.substitute];
            if (!creep && substitute) {
                delete Memory.creeps[description.alive.work];
                description.alive.work = description.alive.substitute;
                description.alive.substitute = undefined;
            }
        });
    }

    createCreep(name: string, role: Role, opts?: {}): void {
        var creepName = this.name + '_' + role + '_' + name;
        this.memory.creeps[creepName] = {
            name: creepName,
            role: role,
            alive: {},
            body:[]
        }
    }
}