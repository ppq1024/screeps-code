/* Copyright(c) PPQ, 2021-2022
 * 
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

import { structureGroupTypes } from '@/structures/StructureGroupTypes';
import { teamTypes } from '@/team/TeamTypes'

/**
 * 一级控制单元
 * 
 * Group包括Development, Expansion, Industry, Trade, Army, Power,
 * 每种对应不同的逻辑和功能
 * 
 * 在控制单元初始化的过程中只需要显式初始化一级控制单元，
 * 下及控制单元的初始化由上级控制单元调用
 */
abstract class Group extends AbstractMemorial<GroupMemory> implements ControlUnit {
    
    name: string;
    type: GroupType;
    teams: Record<string, Team>;
    structureGroups: Record<string, StructureGroup>;

    constructor(memory: GroupMemory) {
        super(memory);
        this.name = this.memory.name;
        this.type = this.memory.type;
        _.forEach(this.memory.teams, (memory, name) =>
            this.teams[name] = new teamTypes[this.memory.type][memory.type](memory));
        _.forEach(this.memory.structureGroups, (memory, name) =>
            this.structureGroups[name] = new structureGroupTypes[this.memory.type][memory.type](memory));
    }

    abstract process(): void;

    run(): void {
        this.process();
        _.forEach(this.teams, (team) => team.run());
        _.forEach(this.structureGroups, (structureGroup) => structureGroup.run());
    }
}