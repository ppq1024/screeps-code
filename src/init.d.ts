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

interface Game {
    teams: {[name: string]: Team}
    groups: Record<string, Group>
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

interface Group {
    memory: GroupMemory
    name: string
    type: GroupType
    teams: Record<string, Team>
    structureGroups: Record<string, StructureGroup>

    process(): void
    run(): void
}

interface Team {
    memory: TeamMemory
    name: string
    type: TeamType
    creeps: Record<string, Creep>
    spawner: StructureSpawn
    room: Room
    roleBehaviors: Record<Role, RoleBehavior>
    run(): void
}

interface Description<O> {}

interface CreepDescription extends Description<Creep> {
    name: string
    role: Role
    alive: string
    body: BodyPartConstant[]
    task?: Task
    autoRespawn?: boolean
    respawned?: boolean
    important?: boolean
    boost?: boolean
    labID?: Id<StructureLab>
    spawner?: string
}

interface StructureDescription extends Description<Structure> {

}

interface TeamConstructor extends MemorialConstructor<Team, TeamMemory> {}

interface StructureGroupConstructor extends MemorialConstructor<StructureGroup, StructureGroupMemory> {}

interface LinkTask {
    sourceID: Id<StructureLink>
    targetID: Id<StructureLink>
    emptyOnly: boolean
}



interface productDescription {
    level?: number
    amount: number
    cooldown: number
    components: Record<RawMaterial, number>
}

