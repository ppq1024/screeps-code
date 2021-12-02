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

var worker_unit = [WORK, CARRY, MOVE];
var carrier_unit = [CARRY, CARRY, MOVE];

function spawn(spawner: StructureSpawn, unit: BodyPartConstant[], unit_count: number, roleName: string): ScreepsReturnCode {
    var newName = roleName + Game.time;
    var creep = [];
    for (var i = 0; i < unit_count; i++) {
        creep.push(...unit);
    }
    var result = spawner.spawnCreep(creep, newName, { memory: { role: roleName } });
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
            'carrier': 0,
            'builder': 0
        };
        _.forEach(Game.creeps, (creep) => {
            worker_count[creep.memory.role]++
        });

        var roleName;
        var unit;
        var count = 4;
        if (worker_count['harvester'] < 2) {
            roleName = 'harvester';
            unit = worker_unit;
        }
        else if (worker_count['carrier'] < 2) {
            roleName = 'carrier';
            unit = carrier_unit;
            count = 2;
        }
        else if (worker_count['builder'] < 2) {
            roleName = 'builder';
            unit = worker_unit;
        }

        if (roleName) {
            spawn(spawner, unit, count, roleName);
        }
    }
};