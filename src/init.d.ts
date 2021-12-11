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

interface CreepMemory {
    station?: WorkStation
}

interface WorkStation {
    working?: boolean
    target?: StructureTarget
}

interface RoomMemory {
    sources: Source[]
}

interface SpawnMemory {
    priorQueue: SpawnRequest[]
    queue: SpawnRequest[]
}

interface SpawnRequest {
    name: string
    body: BodyUnit[]
}

interface Memory {
    home: string
    staticTask: { [name: string]: Task }
    links: LinkTask[]
    teams: {
        [name: string]: Team
    }
    stats: Stats
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

interface Team {
    name: string
    type: TeamType
    inited?: boolean
    room?: string
    spawner: string
    creeps: {
        [name: string]: CreepDescription
    }
}

interface CreepDescription {
    name: string
    role: Role
    alive: {
        work?: string
        substitute?: string
    }
    body: BodyUnit[]
    task?: Task
    autoRespawn?: boolean
    advance?: number
    important?: boolean
}

type TeamType = 'roomer' | 'outer' | 'immigrant'
type TaskType = 'harvest' | 'carry' | 'observe'
type Role = 'harvester' | 'builder' | 'carrier' | 'repairer' | 'upgrader' | 'observer' | 'worker' | 'claimer'

interface StructureTarget {
    type: StructureConstant
    description?: string
}

interface WorkerTask extends Task {
    name: string
    source: Source | Mineral | Deposit | Structure
    target: Structure | ConstructionSite | Creep
}

interface BodyUnit {
    unit: BodyPartConstant[]
    repeat: number
}

interface LinkTask {
    sourceID: string
    targetID: string
}