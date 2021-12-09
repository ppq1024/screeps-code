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

import { builder } from "@/creep/role/builder";
import { harvester } from "@/creep/role/harvester";
import { carrier } from "@/creep/role/carrier";
import { repairer } from "@/creep/role/repairer";
import { upgrader } from "@/creep/role/upgrader";

// hash表可比if-else和switch-case效率高多了
// 但不太确定内存占用的问题
// 因为对JS底层不太熟
var roleFunctions = {
    harvester: harvester.run,
    carrier: carrier.run,
    builder: builder.run,
    repairer: repairer.run,
    upgrader: upgrader.run
}

export const controller = {
    run: function () {
        _.filter(Game.creeps, (creep) => creep.memory.controlled && !creep.spawning).forEach((creep) => roleFunctions[creep.memory.role](creep));
    }
};