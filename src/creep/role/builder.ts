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

export const builder = {
    run: function (creep: Creep) {

        if (creep.memory['building'] && creep.store.energy == 0) {
            creep.memory['building'] = false;
        }
        if (!creep.memory['building'] && creep.store.getFreeCapacity() == 0) {
            creep.memory['building'] = true;
        }

        if (creep.memory['building']) {
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }

            if (creep.upgradeController(Game.rooms[Memory['home']].controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.rooms[Memory['home']].controller);
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

        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}