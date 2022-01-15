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

interface Memory {
    groups: Record<string, GroupMemory>
    links: LinkTask[]
    stats: Stats
}

interface CreepMemory {
    station?: WorkStation
}

interface SpawnMemory {
    priorQueue: SpawnRequest[]
    queue: SpawnRequest[]
}

interface Memorial<U extends MemoryUnit<any>> {
    memory: U
}

interface MemoryUnit<M extends Memorial<any>> {}

interface MemorialConstructor<M extends Memorial<U>, U extends MemoryUnit<M>> {
    new (memory: U, opt?: any): M;
}

interface MemoryInit<U extends MemoryUnit<any>> {
    create(name: string, ...opts: any): U
}

interface GroupMemory extends MemoryUnit<Group> {
    name: string
    type: GroupType
    room: string
    teams: Record<string, TeamMemory>
    structureGroups: Record<string, StructureGroupMemory>
}

interface TeamMemory extends MemoryUnit<Team> {
    name: string
    type: TeamType
    inited?: boolean
    room?: string
    spawner: string
    creeps: Record<string, CreepDescription>
}

interface StructureGroupMemory extends MemoryUnit<StructureGroup> {
    name: string
    type: StructureGroupType
    structures: Record<string, StructureDescription>
}