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

import { functions } from '@/creep/functions';
import { builder } from '@/creep/role/builder';
import { repairer } from '@/creep/role/repairer';
import { RoleBehavior } from '@/creep/role/RoleBehavior';

import { Team } from '@/team/Team'

var roleBehaviors: {[role: string]: RoleBehavior} = {
    claimer: new RoleBehavior((creep) => {
        var target = creep.room.controller;
        if (target.my) {
            return;
        }

        if (functions.moveTo(creep, target, 1)) {
            creep.claimController(target);
        }
    }),
    worker: builder,
    repairer: repairer
}

export class Immigrant extends Team {
    init(): boolean {
        this.memory.creeps.claimer1 = {
            name: 'claimer1',
            role: 'claimer',
            alive: {},
            body: [{
                unit: [CLAIM, MOVE],
                repeat: 1
            }],
            autoRespawn: true
        };
        this.memory.creeps.worker1 = {
            name: 'worker1',
            role: 'worker',
            alive: {},
            body:[{
                unit: [WORK, CARRY, MOVE],
                repeat: 4
            }],
            autoRespawn: true
        }
        return this.memory.inited = true;
    }

    doTask(): void {
        _.forEach(this.memory.creeps, (description) => {
            var flag = Game.flags[this.name];
            var creep = this.creeps[description.name];
            if (!creep) {
                return;
            }
    
            var room = flag.room;
            if (!room || room != creep.room) {
                creep.moveTo(flag, {
                    reusePath: 16,
                    ignoreCreeps: true
                })
    
                return;
            }
    
            roleBehaviors[description.role].run(creep);
    
            if (room.controller.my && description.role == 'claimer') {
                description.autoRespawn = false;
            }
    
            if (room.controller.level >= 4) {
                description.autoRespawn = false;
            }
        });
    }
}