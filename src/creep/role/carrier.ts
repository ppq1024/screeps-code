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

import { functions } from '@/creep/functions';
import { RoleBehavior } from '@/creep/role/RoleBehavior';

/**
 * 定点运输
 */
class RoleCarrier extends RoleBehavior {
    run(creep: Creep, description: CreepDescription, _room?: Room): void {
        var resource = description['resource'];
        var station = functions.check.checkStation(creep, resource);
        var source = Game.getObjectById(description['sourceID'] as Id<AnyStoreStructure>);
        var target = Game.getObjectById(description['targetID'] as Id<AnyStoreStructure>);
        if (target.store.getFreeCapacity(resource) == 0) {
            return;
        }
        target = station.working ? target : source;
        if (functions.moveTo(creep, target, 1)) {
            station.working ? creep.transfer(target, resource) : creep.withdraw(target, resource);
        }
    }
}

export const carrier = new RoleCarrier();