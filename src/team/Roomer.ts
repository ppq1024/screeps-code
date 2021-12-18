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

import { Team } from '@/team/Team'

const workerUnit = [WORK, CARRY, MOVE];
const workerUnitCost = 200;
const fullHarvester = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
const fullHarvesterCost = 700;
const carrierUnit = [CARRY, CARRY, MOVE];
const carrierUnitCost = 150;
const halfUpgrader = fullHarvester;
const halfUpgraderCost = fullHarvesterCost;
const fullUpgrader = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
const fullUpgraderCost = 1300;
const cleanerUnit = carrierUnit;
const cleanerUnitCost = carrierUnitCost;

const getBodyparts = (unit: BodyPartConstant[], unitCost: number, costMax: number) => {
    var unitCount = Math.floor(costMax / unitCost);
    var bodyparts: BodyPartConstant[] = []
    for (var i = 0; i < unitCount; i++) {
        bodyparts.push(...unit);
    }
    return bodyparts;
}

const roleBodyparts: {[role: string]: (costMax: number) => BodyPartConstant[]} = {
    worker: (costMax) => getBodyparts(workerUnit, workerUnitCost, costMax),
    harvester: (costMax) => costMax < fullHarvesterCost ?
            getBodyparts(workerUnit, workerUnitCost, costMax) :
            fullHarvester,
    carrier: (costMax) => getBodyparts(carrierUnit, carrierUnitCost, costMax),
    supplier: (costMax) => getBodyparts(carrierUnit, carrierUnitCost, costMax),
    builder: (costMax) => getBodyparts(workerUnit, workerUnitCost, costMax),
    upgrader: (costMax) => costMax < halfUpgraderCost ?
            getBodyparts(workerUnit, workerUnitCost, costMax) :
            costMax < fullUpgraderCost ? halfUpgrader : fullUpgrader,
    cleaner: (costMax) => getBodyparts(cleanerUnit, cleanerUnitCost, costMax),
}

export class Roomer extends Team {

    doTask(): void {
        //TODO 自动状态更新
        super.doTask();
    }

    getBodyparts(role: Role, costMax?: number): BodyPartConstant[] {
        costMax = costMax ? costMax : this.spawner.room.energyCapacityAvailable;
        return roleBodyparts[role](costMax);
    }

    update(): void {
        
    }
}
