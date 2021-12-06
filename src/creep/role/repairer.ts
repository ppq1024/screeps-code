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
    if (Game.time % 128 == 0 || !creep.memory['targetID']) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_WALL && structure.hits < 30000000 || // 30M
                    structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax

        });

        var hitsMin = targets[0];
        targets.forEach((wall) => hitsMin = hitsMin.hits < wall.hits ? hitsMin : wall);
        creep.memory['targetID'] = hitsMin.id;
        return hitsMin;
    }
    return Game.getObjectById<StructureRampart | StructureWall>(creep.memory['targetID']);
}

var repairTarget = (creep: Creep) => {
    var target: AnyStructure;
    if (!creep.memory['targetID'] || (target = Game.getObjectById<AnyStructure>(creep.memory['targetID'])).hits == target.hitsMax) {
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
        if (creep.memory.working && creep.store.energy == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }

        var target = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER}).length ?
                freshWallTarget(creep) : repairTarget(creep);

        if (creep.memory.working) {
            if (target) {
                if (creep.pos.getRangeTo(target) > 3) {
                    creep.moveTo(target);
                }
                creep.repair(target);
            }

            return;
        }

        if (functions.getEnergy(creep)) {
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