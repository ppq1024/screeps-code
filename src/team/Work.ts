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

import { functions } from '@/creep/functions';
import Team from '@/team/Team'
import { bodyParts, getBodyparts } from '@/team/utils';

class Work extends Team {

    doTask(creep: Creep, description: CreepDescription, room?: Room): void {
        var station = functions.check.checkStation(creep, RESOURCE_ENERGY);
        room = room ? room : creep.room;
    
        if (station.working) {
            if (room.controller.ticksToDowngrade > 1000) {
                if (functions.work.supply(creep, STRUCTURE_SPAWN, STRUCTURE_EXTENSION)) return;

                var target = Game.getObjectById(station['targetID'] as Id<ConstructionSite>);

                if (!target || !(target instanceof ConstructionSite)) {
                    target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                }
    
                if (target) {
                    station['targetID'] = target.id;
                    if (functions.moveTo(creep, target, 3)) creep.build(target);
                    return;
                }

                if (functions.work.repair(creep)) return;
            }

            if (functions.moveTo(creep, room.controller, 3)) creep.upgradeController(room.controller);
            return;
        }
    
        if (!description['alwaysHarvest'] && functions.preparation.getResource(creep, RESOURCE_ENERGY)) return;
    
        functions.rawHarvest(creep);
    }

    getBodyparts(costMax?: number): BodyPartConstant[] {
        costMax = costMax ? costMax : this.defaultSpawn.room.energyCapacityAvailable;
        return getBodyparts(bodyParts.workerUnit, bodyParts.workerUnitCost, costMax);
    }
    
}

export default Work;