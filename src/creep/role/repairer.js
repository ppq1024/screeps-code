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

import { actions } from "../actions";

export const repairer = {
    run: function(creep) {

        //look for construction to repaire
        var targets = Game.rooms[Memory['home']].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });

        if (targets.length > 0) {
            if (creep.store.getUsedCapacity() == 0) {
                targets = Game.rooms[Memory['home']].find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    actions.withdraw(creep, targets[0], RESOURCE_ENERGY);
                }
                else {
                    var sources = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    actions.harvest(creep, sources);
                }
                return;
            }
            actions.repair(creep, targets[0]);
        }
	}
};