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

class Upgrade extends Team {

    doTask(creep: Creep, description: CreepDescription, room?: Room): void {
        var station = creep.memory.station;
        if (!station) station =  creep.memory.station = {};
        room = room ? room : creep.room;
    
        if (creep.store.energy) {
            if (functions.moveTo(creep, room.controller, 3)) creep.upgradeController(room.controller);
        }
    
        var source = Game.getObjectById(description['sourceID'] as Id<AnyStoreStructure>);
    
        if (functions.moveTo(creep, source, 1)) creep.withdraw(source, RESOURCE_ENERGY);
    }

    getBodyparts(costMax?: number): BodyPartConstant[] {
        costMax = costMax ? costMax : this.defaultSpawn.room.energyCapacityAvailable;
        return costMax < bodyParts.halfUpgraderCost ?
            getBodyparts(bodyParts.workerUnit, bodyParts.workerUnitCost, costMax) :
            costMax < bodyParts.fullUpgraderCost ? bodyParts.halfUpgrader : bodyParts.fullUpgrader;
    }
    
}

export default Upgrade;