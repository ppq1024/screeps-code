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

import { functions } from "@/creep/functions";
import { groupMemoryInit } from "@/group/utils";
import Construct from "@/team/Construct";
import Exploit from "@/team/Exploit";
import Transport from "@/team/Transport";
import Upgrade from "@/team/Upgrade";
import Work from "@/team/Work";

class Soldier extends Work {
    doTask(creep: Creep, description: CreepDescription, room?: Room): void {
        room = room ? room : creep.room;

        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile && functions.moveTo(creep, closestHostile, 1)) {
            creep.attack(closestHostile);
        }
    }

    getBodyparts(costMax?: number): BodyPartConstant[] {
        return [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE];
    }
}

export const army: GroupDescription = {
    teamTypes: {
        exploit: Exploit,
        construct: Construct,
        transport: Transport,
        upgrade: Upgrade,
        work: Soldier
    },
    structureTypes: undefined,
    memoryInit: groupMemoryInit
}