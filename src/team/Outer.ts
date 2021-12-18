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
import { RoleBehavior } from '@/creep/role/RoleBehavior';
import { Team } from '@/team/Team'

// 目前使用硬编码
var roleBehaviors: {[role: string]: RoleBehavior} = {
    worker: {
        run(creep): void {
            var station = functions.check.checkStation(creep, RESOURCE_ENERGY);
            if (station.working) {
                var roads = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: (structure) => structure.structureType == STRUCTURE_ROAD &&
                            structure.hits < structure.hitsMax
                });
                if (roads.length) {
                    creep.repair(roads[0]);
                }

                if (creep.room != Game.rooms.E24S53) {
                    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    if (target) {
                        if (functions.moveTo(creep, target, 3)) {
                            creep.build(target);
                        }
                        return;
                    }
                }

                var store = Game.rooms.E24S53.storage;
                if (functions.moveTo(creep, store, 1)) {
                    creep.transfer(store, RESOURCE_ENERGY)
                }

                return;
            }

            if (creep.room != Game.rooms.E23S53) {
                creep.moveTo(Game.flags.entrance)
                return
            }
            var source = Game.getObjectById('5bbcae4b9099fc012e638b55' as Id<Source>);
            if (functions.moveTo(creep, source, 1)) {
                creep.harvest(source);
            }
        }
    },
    claimer: {
        run(creep): void {
            if (creep.room != Game.rooms.E23S53) {
                creep.moveTo(Game.flags.entrance)
                return
            }
            if (functions.moveTo(creep, Game.rooms.E23S53.controller, 1)) {
                creep.reserveController(Game.rooms.E23S53.controller);
            }
        }
    }
}

export class Outer extends Team {
    init(): boolean {
        //TODO
        return this.memory.inited = true;
    }

    doTask(): void {
        //TODO
        _.forEach(this.memory.creeps, (description, name) => {
            var creep = this.creeps[name];
            if (!creep) {
                return;
            }
            roleBehaviors[description.role].run(creep, description);
        });
    }

    getBodyparts(role: Role, costMax?: number): BodyPartConstant[] {
        throw new Error('Method not implemented.');
    }

    update(): void {
        throw new Error('Method not implemented.');
    }
}
