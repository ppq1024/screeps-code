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

/**
 * 只进行控制器升级
 */
class RoleUpgrader extends RoleBehavior {
    run(creep: Creep, _description: CreepDescription, room?: Room): void {
        var station = creep.memory.station;
        if (!station) station =  creep.memory.station = {};
        room = room ? room : creep.room;
    
        if (creep.store.energy) {
            if (functions.moveTo(creep, room.controller, 3)) creep.upgradeController(room.controller);
        }
    
        var target = functions.getTarget(station.target);
        if (!target || !target.store.energy) {
            target = <AnyStoreStructure> room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
                filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_LINK ||
                        structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store.energy > 0
            })[0];
            if (!target) {
                return;
            }
            station.target = {
                type: target.structureType,
                description: target.structureType == STRUCTURE_STORAGE ? target.room.name : target.id
            }
        }
    
        if (functions.moveTo(creep, target, 1)) creep.withdraw(target, RESOURCE_ENERGY);
    }
}

export const upgrader = new RoleUpgrader();