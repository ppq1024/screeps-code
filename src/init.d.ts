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

interface Creep {
    doTask: () => ScreepsReturnCode | void
}

interface CreepMemory {
    role: string
    controlled: boolean,
    task?: Task,
    station?: string,
    body?: BodyPartConstant[]
    respawn?: boolean
}

interface RoomMemory {
    sources: Source[]
}

interface SpawnMemory {
    queue: string[]
}

interface Memory {
    home: string,
    staticTask: { [name: string]: Task }
}

interface Team {
    [role: string]: Creep[]
}

interface Task {
    name: string,
    static: boolean,
    roleLimit: string
}

interface CarrierTask extends Task {
    roleLimit: 'carrier',
    from?: StructureTarget,
    to?: StructureTarget,
    defaultPath?: {
        from: PathStep[],
        to: PathStep[]
    }
}

interface HarvesterTask extends Task {
    roleLimit: 'harvester',
    flag: string,
    sourceID: string,
    target: StructureTarget
}

interface StructureTarget {
    type: StructureConstant,
    description: string
}

interface WorkerTask extends Task {
    name: string,
    source: Source | Mineral | Deposit | Structure,
    target: Structure | ConstructionSite | Creep
}