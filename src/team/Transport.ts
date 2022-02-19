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

import { carrier } from '@/creep/role/carrier';
import { cleaner } from '@/creep/role/cleaner';
import { supplier } from '@/creep/role/supplier';
import Team from '@/team/Team'
import { bodyParts, getBodyparts } from '@/team/utils';

const roleBehaviors = {
    carrier: carrier,
    supplier: supplier,
    cleaner: cleaner
}

class Transport extends Team {

    doTask(creep: Creep, description: CreepDescription, room?: Room): void {
        roleBehaviors[description.role].run(creep, description, room);
    }

    getBodyparts(costMax?: number): BodyPartConstant[] {
        costMax = costMax ? costMax : this.defaultSpawn.room.energyCapacityAvailable;
        return getBodyparts(bodyParts.carrierUnit, bodyParts.carrierUnitCost, costMax);
    }
    
}

export default Transport;