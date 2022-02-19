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

interface Game {
    teams: {[name: string]: Team}
    groups: Record<string, Group>
    functions: Record<string, Function>
}

interface WorkStation {
    working?: boolean
}

interface SpawnRequest {
    name: string
    body: BodyPartConstant[]
}

interface Stats {
    gcl: {
        progress: number
        progressTotal: number
        level: number
    }
    rooms: {
        [name: string]: RoomStats
    }
    cpu: {
        bucket: number
        limit: number
        used: number
    }
    time: number
}

interface RoomStats {
    storageEnergy: number
    terminalEnergy: number
    energyAvailable: number
    energyCapacityAvailable: number
    controllerProgress: number
    controllerProgressTotal: number
    controllerLevel: number
}

interface RoleBehavior {
    run(creep: Creep): void
}

interface StructureTarget {
    type: StructureConstant
    id: Id<AnyStoreStructure>
}

interface Group {
    memory: GroupMemory
    name: string
    type: GroupType
    room: string
    teams: Record<string, Team>
    structureGroups: Record<string, StructureGroup>

    process(): void
    run(): void
}

interface GroupDescription {
    teamTypes: Record<TeamType, TeamConstructor>
    structureTypes: Record<StructureGroupType, StructureGroupConstructor>
    memoryInit: MemoryInit<GroupMemory>
}

interface Team {
    memory: TeamMemory
    name: string
    type: TeamType
    creeps: Record<string, Creep>
    defaultSpawn: StructureSpawn
    room: Room
    run(): void
}

interface StructureGroup {
    memory: StructureGroupMemory
    run(): void
}

interface CreepDescription {
    name: string
    role: Role
    alive: string
    body: BodyPartConstant[]
    autoRespawn?: boolean
    respawned?: boolean
    important?: boolean
    boost?: boolean
    labID?: Id<StructureLab>
    spawner?: string
}

interface StructureDescription {

}

interface StructureGroupConstructor {
    new (memory: StructureGroupMemory, group: Group): StructureGroup
}

interface LinkTask {
    sourceID: Id<StructureLink>
    targetID: Id<StructureLink>
    emptyOnly: boolean
}

interface ProductDescription {
    level?: number
    amount: number
    cooldown: number
    components: Record<RawMaterial, number>
}

interface ExploitPoint {
    targetID: Id<ExploitTarget>
    position: RoomPosition
}
