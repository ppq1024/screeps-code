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
import { carrier } from '@/creep/role/carrier';
import { cleaner } from '@/creep/role/cleaner';
import { supplier } from '@/creep/role/supplier';
import Team from '@/team/Team'
import { bodyParts, getBodyparts } from '@/team/Utils';

const roleBehaviors = {
    carrier: carrier,
    supplier: supplier,
    cleaner: cleaner
}

class Transport extends Team {

    doTask(creep: Creep, description: CreepDescription, room?: Room): void {
        //这里有个问题，原carrier, supplier和cleaner都在这边搞
        // var resource = description['resource'];
        // var station = functions.check.checkStation(creep, resource);
        // var source = Game.getObjectById(description['sourceID'] as Id<AnyStoreStructure>);
        // var target = Game.getObjectById(description['targetID'] as Id<AnyStoreStructure>);
        // if (target.store.getFreeCapacity(resource) == 0) {
        //     return;
        // }
        // target = station.working ? target : source;
        // if (functions.moveTo(creep, target, 1)) {
        //     station.working ? creep.transfer(target, resource) : creep.withdraw(target, resource);
        // }

        roleBehaviors[description.role].run(creep, description, room);
    }

    getBodyparts(costMax?: number): BodyPartConstant[] {
        costMax = costMax ? costMax : this.defaultSpawn.room.energyCapacityAvailable;
        return getBodyparts(bodyParts.carrierUnit, bodyParts.carrierUnitCost, costMax);
    }
    
}

export default Transport;