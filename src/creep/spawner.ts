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

var worker_300 = [WORK, CARRY, CARRY, MOVE, MOVE];
var worker_500 = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
var worker_800 = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];

function spawn(spawner: StructureSpawn, worker: BodyPartConstant[], roleName: string): ScreepsReturnCode {
    var newName = roleName + Game.time;
    var result = spawner.spawnCreep(worker, newName, { memory: { role: roleName } });
    if (result != OK) {
        console.log('failed to create ' + roleName + ' with error code: ' + result);
        return result;
    }
    console.log('create new ' + roleName + '.');
    return OK;
}

export const spawner = {
    run: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        var spawner = Game.spawns['DEFAULT_SPAWN'];
        if (spawner.spawning) {
            return;
        }

        var worker_count: {[name: string]: number} = {
            'harvester': 0,
            'builder': 0,
        };
        _.forEach(Game.creeps, (creep) => {
            worker_count[creep.memory.role]++
        });

        var worker = worker_800;

        if (worker_count['harvester'] < 2) {
            spawn(spawner, worker, 'harvester');
        }
        else if (worker_count['builder'] < 1) {
            spawn(spawner, worker, 'builder');
        }
    }
};