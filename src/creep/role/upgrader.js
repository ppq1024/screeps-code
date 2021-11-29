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

export const upgrader = {
    run: function(creep) {
        if(creep.memory['upgrading'] && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory['upgrading'] = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory['upgrading'] && creep.store.getFreeCapacity() == 0) {
	        creep.memory['upgrading'] = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory['upgrading']) {
            if(creep.upgradeController(Game.rooms[Memory['home']].controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.rooms[Memory['home']].controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var targets = Game.rooms[Memory['home']].find(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_CONTAINER &&
							structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
				}
			});
			if (targets.length > 0) {
				var result = creep.withdraw(targets[0], RESOURCE_ENERGY);
				if (result == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
			else {
				var sources = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
				if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
        }
    }
}