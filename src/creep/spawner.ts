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

var spawnQueue = (spawner: StructureSpawn, queue: SpawnRequest[]) => {
    if (!queue.length) {
        return false;
    }

    var request = queue[0];
    var body = request.body;
    if (spawner.spawnCreep(body, request.name, {dryRun: true}) == OK) {
        spawner.spawnCreep(body, request.name);
        queue.shift();
        console.log('Respawned creep:', request.name);
        return true;
    }

    return false;
}

export const spawner = {
    run: function () {
        _.forEach(Game.spawns, (spawner) => {
            if (!spawner.memory.priorQueue) spawner.memory.priorQueue = []
            if (!spawner.memory.queue) spawner.memory.queue = []

            if (spawner.spawning) {
                return;
            }
    
            if (spawnQueue(spawner, spawner.memory.priorQueue)) {
                return;
            }
    
            spawnQueue(spawner, spawner.memory.queue);
        });

        if (!(Game.time & 0xff)) {
            _.forEach(Memory.creeps, (_memory, name) => {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                }
            })
        }
    }
};