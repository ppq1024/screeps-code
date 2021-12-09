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

import { functions } from "../functions";

var freshWallTarget = (creep: Creep) => {
    if (Game.time % 64 == 0 || !creep.memory.station['targetID']) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_WALL ||
                    structure.structureType == STRUCTURE_RAMPART) &&
                    structure.hits < structure.hitsMax 
        });

        var hitsMin = targets[0];
        targets.forEach((wall) => hitsMin = hitsMin.hits < wall.hits ? hitsMin : wall);
        creep.memory.station['targetID'] = hitsMin.id;
        return hitsMin;
    }
    return Game.getObjectById(<Id<StructureWall | StructureRampart>>creep.memory.station['targetID']);
}

var repairTarget = (creep: Creep) => {
    var target: AnyStructure;
    if (!creep.memory.station['targetID'] ||
            (target = Game.getObjectById(<Id<AnyStructure>>creep.memory.station['targetID'])).hits == target.hitsMax
    ) {
        target = Game.rooms[Memory.home].find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType != STRUCTURE_WALL &&
                    structure.structureType != STRUCTURE_RAMPART &&
                    structure.hits < structure.hitsMax
        })[0];
    }
    return target;
}

export const repairer = {
    run: function(creep: Creep) {
        var station = functions.check.checkStation(creep, RESOURCE_ENERGY);

        var target = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER}).length ?
                freshWallTarget(creep) : repairTarget(creep);

        if (station.working) {
            if (target) {
                if (creep.pos.getRangeTo(target) > 3) {
                    creep.moveTo(target);
                }
                creep.repair(target);
            }

            return;
        }

        if (functions.preparation.getResource(creep, RESOURCE_ENERGY)) {
            return;
        }

        functions.rawHarvest(creep);
    }
}