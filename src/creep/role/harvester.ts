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
 * 严格遵守挖运分离
 */
class RoleHarvester extends RoleBehavior {
    run(creep: Creep, description: CreepDescription, _room?: Room): void {

        var source = Game.getObjectById(<Id<Source | Mineral>> description['sourceID']);
        var target = Game.getObjectById(<Id<AnyStoreStructure>> description['targetID']);

        var resource = source instanceof Source ? RESOURCE_ENERGY : source.mineralType;

        if (creep.store.getFreeCapacity() == 0) {
            if (!functions.moveTo(creep, target, 1)) {
                return;
            }
            var result = creep.transfer(target, resource);
            if (result == ERR_FULL) {
                return;
            }
        }

        if (functions.moveTo(creep, source, 1)) {
            creep.harvest(source);
        }
    }
}

export const harvester = new RoleHarvester();