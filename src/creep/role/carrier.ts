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

import { functions } from "@/creep/functions";

export const carrier = {
    run: function(creep: Creep) {
        var task = <CarrierTask> creep.memory.task;
        if (task) {
            carrier.doTask(creep, task);
            return;
        }

        var station = functions.check.checkStation(creep, RESOURCE_ENERGY);
        if (!(station.working && (
                functions.work.supply(creep, STRUCTURE_SPAWN, STRUCTURE_EXTENSION) || 
                functions.work.supply(creep, STRUCTURE_TOWER)
        ))) {
            functions.preparation.getResource(creep, RESOURCE_ENERGY);
        }
    },

    doTask: (creep: Creep, task: CarrierTask) => {
        if (task.static) {
            task = <CarrierTask> Memory.staticTask[task.name];
        }
        
        // station未定义意味着creep刚被生成
        var station = functions.check.checkStation(creep, RESOURCE_ENERGY);
        var target = functions.getTarget(station.working ? task.to : task.from);
        if (functions.moveTo(creep, target, 1)) {
            var result = station.working ? creep.transfer(target, RESOURCE_ENERGY) : creep.withdraw(target, RESOURCE_ENERGY);
            if (result != OK) {
                console.log('carrier with error code: ', result);
            }
            return;
        }
    }
}