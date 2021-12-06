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

export const functions = {
    getTarget: (target: StructureTarget) => target.type == STRUCTURE_STORAGE ?
        Game.rooms[target.description].storage :
        Game.getObjectById<AnyStoreStructure>(target.description),
    
    getEnergy: (creep: Creep) => {
        var store = Game.rooms[Memory['home']].storage;
        if (store && store.store.energy > 0) {
            var result = creep.withdraw(store, RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(store);
            }
            return true;
        }
        
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.energy > 0;
            }
        });
        if (container) {
            var result = creep.withdraw(container, RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            return true;
        }

        return false;
    }
}