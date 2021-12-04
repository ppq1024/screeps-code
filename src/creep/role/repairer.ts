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

export const repairer = {
    run: function(creep: Creep) {
        if (creep.memory['repairing'] && creep.store.energy == 0) {
            creep.memory['repairing'] = false;
        }
        if (!creep.memory['repairing'] && creep.store.getFreeCapacity() == 0) {
            creep.memory['repairing'] = true;
        }

        if (Game.time % 128 == 0 || !creep.memory['targetID']) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_WALL && structure.hits < 30000000 || // 30M
                        structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax

            });

            var hitsMin = targets[0];
            targets.forEach((wall) => hitsMin = hitsMin.hits < wall.hits ? hitsMin : wall);
            creep.memory['targetID'] = hitsMin.id;
        }

        if (creep.memory['repairing']) {
            var target = Game.getObjectById<StructureRampart | StructureWall>(creep.memory['targetID']);

            if (target) {
                if (creep.pos.getRangeTo(target) > 3) {
                    creep.moveTo(target);
                }
                creep.repair(target);
            }

            return;
        }

        var store = Game.rooms[Memory['home']].storage;
        if (store && store.store.energy > 0) {
            var result = creep.withdraw(store, RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(store);
            }
            return;
        }
        
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (container) {
            var result = creep.withdraw(container, RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            return;
        }
    }
}