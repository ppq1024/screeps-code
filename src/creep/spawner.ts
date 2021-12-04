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

var expand = (bodyUnit: BodyUnit, dest?: BodyPartConstant[]) => {
    dest = dest ? dest : [];
    for (var i = 0; i < bodyUnit.repeat; i++) {
        dest.push(...bodyUnit.unit);
    }
    return dest;
}

var parseBody = (body: BodyUnit[]) => {
    var result: BodyPartConstant[] = [];
    body.forEach((bodyUnit) => expand(bodyUnit, result));
    return result;
}

var spawnQueue = (spawner: StructureSpawn, queue: string[]) => {
    var name = queue[0];
    if (!name) {
        return false;
    }

    var body = parseBody(Memory.creeps[name].body);
    if (spawner.spawnCreep(body, name, {dryRun: true}) == OK) {
        spawner.spawnCreep(body, name);
        Memory.creeps[name].respawn = false;
        queue.shift();
        console.log('Respawned creep:', name);
        return true;
    }

    return false;
}

export const spawner = {
    run: function (spawner: StructureSpawn) {
        _.forEach(Memory.creeps, (creep_memory, name) => {
            if (!Game.creeps[name] && !creep_memory.respawn) {
                if (creep_memory['important']) {
                    spawner.memory.priorQueue.push(name);
                }
                else {
                    spawner.memory.queue.push(name);
                }
                creep_memory.respawn = true;
                delete creep_memory.station;
                console.log('Prepare to respawn creep:', name);
            }
        });

        if (spawner.spawning) {
            return;
        }

        if (spawnQueue(spawner, spawner.memory.priorQueue)) {
            return;
        }

        spawnQueue(spawner, spawner.memory.queue);
    }
};