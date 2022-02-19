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
    Game.functions.createGroup = createGroup;
    //TODO
}

export const command =  {
    init: () => {
        loadGroupsFromMemory();
        loadCommands();
    }
}

export function loadGroups() {
    Game.groups = {};
    var groups = Memory.groups;
    if (!groups) groups = Memory.groups = {};

    _.forEach(groups, (memory, name) => Game.groups[name] = new groupTypes[memory.type](memory));
}

/**
 * 创建新的工作组
 * 
 * 此函数会创建并初始化组内存，在下一个tick会由加载器自动加载，
 * 也可以手动调用loadGroups函数加载
 * 
 * @param name 组名称
 * @param type 组类型，包括develop, expansion, industry, army, power
 * @param room 工作房间名
 * @param opts 其他可选参数，可能被忽略
 * @returns 
 * @see Group
 */
export function createGroup(name: string, type: GroupType, room: string, ...opts: any): boolean {
    if (Memory.groups[name]) {
        console.log('This group already exists.');
        return false;
    }

    Memory.groups[name] = groupMemoryInits[type].create(name, type, room, ...opts);
    return true;
}