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

var run = (creep: Creep, task: CarryTask) => {
    var resource = task.resource;
    var station = functions.check.checkStation(creep, resource);
    var target = functions.getTarget(station.working ? task.to : task.from);
    if (functions.moveTo(creep, target, 1)) {
        station.working ? creep.transfer(target, resource) : creep.withdraw(target, resource);
    }
}

export const carry = new TaskExcutor(run);