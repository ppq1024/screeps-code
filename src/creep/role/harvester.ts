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

export const harvester = {
    run: function (creep: Creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var sourceID = creep.memory['source'];
            if (!sourceID) {
                var sources: any[] = Memory['source'];
                var sourceMessage = sources.find((source) => {
                    var harvester = source.harvester;
                    return !harvester || !Game.creeps[harvester];
                });
                sourceMessage.harvester = creep.name;
                creep.memory['source'] = sourceMessage.id;
                sourceID = sourceMessage.id;
            }

            var source = Game.getObjectById<Source>(creep.memory['source']);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            return;
        }

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}