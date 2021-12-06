/**
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

 import { functions } from "@/creep/functions";

export const harvester = {
    run: function (creep: Creep) {
        if (creep.spawning) {
            return;
        }

        var task = <HarvesterTask> creep.memory.task;
        if (task) {
            if (task.static) {
                task = <HarvesterTask> Memory.staticTask[task.name];
            }

            var source = Game.getObjectById<Source>(task.sourceID);
            var target = functions.getTarget(task.target);
            var flag = Game.flags[task.flag];

            if (creep.pos.getRangeTo(flag) > 0) {
                creep.moveTo(flag);
            }

            var result: ScreepsReturnCode;
            if (creep.store.getFreeCapacity() == 0) {
                result = creep.transfer(target, RESOURCE_ENERGY);
                if (result != OK && result != ERR_NOT_IN_RANGE) {
                    if (result == ERR_FULL) {
                        return;
                    }
                    console.log('Cannot give energy with error code:', result);
                }
            }

            result = creep.harvest(source);
            if (result != OK && result != ERR_NOT_IN_RANGE) {
                console.log('Cannot harvest energy with error code:', result);
            }
            return;
        }

        if (creep.store.getFreeCapacity() == 0) {
            var target = Game.getObjectById<AnyStoreStructure>(creep.memory['targetID']);

            if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (target) {
                    creep.memory['targetID'] = target.id;
                }
            }

            if (target) {
                if (creep.pos.getRangeTo(target) > 1) {
                    creep.moveTo(target);
                }
                var result = creep.transfer(target, RESOURCE_ENERGY)
                if (result != OK && result != ERR_NOT_IN_RANGE) {
                    console.log('Cannot give energy with error code:', result);
                }
                return;
            }

            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (target) {
                if (creep.pos.getRangeTo(target) > 1) {
                    creep.moveTo(target);
                }
                var result = creep.transfer(target, RESOURCE_ENERGY)
                if (result != OK && result != ERR_NOT_IN_RANGE) {
                    console.log('Cannot give energy with error code:', result);
                }
            }
            return;
        }

        var source = Game.getObjectById<Source>(creep.memory['sourceID']);
        if (!source) {
            source = creep.pos.findClosestByPath(FIND_SOURCES);
            creep.memory['sourceID'] = source.id;
        }
        if (creep.pos.getRangeTo(source) > 1) {
            creep.moveTo(source);
        }
        creep.harvest(source);
    }
}