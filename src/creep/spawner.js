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

 var worker_300 = [WORK,CARRY,CARRY,MOVE,MOVE];
 var worker_500 = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
 
 function spawn(spawner, worker, roleName, max) {
     var workers = _.filter(Game.creeps, (creep) => creep.memory['role'] == roleName);
     
     if(workers.length < max) {
         var newName = roleName + Game.time;
         var result = spawner.spawnCreep(worker, newName, {memory: {role: roleName}});
         if (result != OK && result != ERR_NOT_ENOUGH_ENERGY) {
             console.log('failed to create ' + roleName + ' with error code: ' + result);
         }
         if (result == OK) {
             console.log('create new ' + roleName + '.');
         }
     }
 }

export const spawner = {
    run: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        // var targets = creep.room.find(FIND_STRUCTURES, {
        //     filter: (structure) => {
        //         return (structure.structureType == STRUCTURE_EXTENSION ||
        //                 structure.structureType == STRUCTURE_SPAWN);
        //     }
        // });
        // var total = 0;
        var spawner = Game.spawns['DEFAULT_SPAWN'];

        if (spawner.spawning) {
            return;
        }

        var worker = worker_500;
    
        spawn(spawner, worker, 'harvester', 4);
        spawn(spawner, worker, 'builder', 2);
        spawn(spawner, worker, 'upgrader', 1);
        spawn(spawner, worker, 'repairer', 1);
        // spawn(worker, 'collector', 1);
	}
};