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

import { develop } from "@/develop/Utils";

export const bodyParts = {
    workerUnit: [WORK, CARRY, MOVE],
    workerUnitCost: 200,
    fullHarvester: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    fullHarvesterCost: 650,
    carrierUnit: [CARRY, CARRY, MOVE],
    carrierUnitCost: 150,
    halfUpgrader: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    halfUpgraderCost: 700,
    fullUpgrader: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    fullUpgraderCost: 1300,
    claimer1: [CLAIM, MOVE],
    claimer1Cost: 650,
    claimer2: [CLAIM, CLAIM, MOVE],
    claimer2Cost: 1250
}

export function getBodyparts(unit: BodyPartConstant[], unitCost: number, costMax: number): BodyPartConstant[] {
    var unitCount = Math.floor(costMax / unitCost);
    var bodyparts: BodyPartConstant[] = []
    for (var i = 0; i < unitCount; i++) {
        bodyparts.push(...unit);
    }
    return bodyparts;
}

export const teamTypes: Record<GroupType, Record<TeamType, TeamConstructor>> = {
    develop: develop.teamTypes,
    expansion: undefined,
    industry: undefined,
    army: undefined,
    power: undefined
}

// const roleBodyparts: Record<Role, (costMax: number) => BodyPartConstant[]> = {
//     worker: undefined,
//     harvester: undefined,
//     carrier: (costMax) => getBodyparts(carrierUnit, carrierUnitCost, costMax),
//     supplier: (costMax) => getBodyparts(carrierUnit, carrierUnitCost, costMax),
//     builder: undefined,
//     upgrader: (costMax) => costMax < halfUpgraderCost ?
//         getBodyparts(workerUnit, workerUnitCost, costMax) :
//         costMax < fullUpgraderCost ? halfUpgrader : fullUpgrader,
//     cleaner: (costMax) => getBodyparts(cleanerUnit, cleanerUnitCost, costMax),
//     claimer: (costMax) => costMax < claimer1Cost ? [] :
//         costMax < claimer2Cost ? claimer1 : claimer2,
//     observer: (_) => [MOVE]
// }