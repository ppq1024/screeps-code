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

import { functions } from "@/creep/functions";
import { TaskExcutor } from "@/creep/task/TaskExcutor";

var run = (creep: Creep, task: HarvestTask) => {
    var source = Game.getObjectById(<Id<Source>> task.sourceID);
    var target = functions.getTarget(task.target);
    var flag = Game.flags[task.flag];

    if (!functions.moveTo(creep, flag)) {
        return;
    }

    var result: ScreepsReturnCode;
    if (creep.store.getFreeCapacity() == 0) {
        result = creep.transfer(target, RESOURCE_ENERGY);
        if (result == ERR_FULL) {
            return;
        }
    }

    result = creep.harvest(source);
    if (result != OK) {
        console.log('Cannot harvest energy with error code:', result);
    }
}

export const harvest = new TaskExcutor(run);