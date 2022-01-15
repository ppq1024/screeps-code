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

import { groupTypes, groupMemoryInits } from "./group/groupTypes";

function loadGroupsFromMemory() {
    Game.groups = {};
    var groups = Memory.groups;
    if (!groups) groups = Memory.groups = {};

    _.forEach(groups, (memory, name) => Game.groups[name] = new groupTypes[memory.type](memory));
}

var loadCommands = () => {
    Game.functions = {}
    Game.functions.createGroup = (name: string, type: GroupType, room: string, ...opts: any): boolean => {
        if (Memory.groups[name]) {
            console.log('This group already exists.');
            return false;
        }

        Memory.groups[name] = groupMemoryInits[type].create(name, type, room, ...opts);
        return true;
    }
    //TODO
}

export const command =  {
    init: () => {
        loadGroupsFromMemory();
        loadCommands();
    }
}