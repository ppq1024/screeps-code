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
 * 建筑、前期维修和刷墙
 */
class RoleBuilder extends RoleBehavior {
    run(creep: Creep, description: CreepDescription, room?: Room): void {
        var station = functions.check.checkStation(creep, RESOURCE_ENERGY);
        room = room ? room : creep.room;
    
        if (station.working) {
            var target = Game.getObjectById(station['targetID'] as Id<ConstructionSite>);
            if (!target || !(target instanceof ConstructionSite)) {
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            }

            if (target) {
                station['targetID'] = target.id;
                if (functions.moveTo(creep, target, 3)) creep.build(target);
                return;
            }

            functions.work.repair(creep);
            return;
        }
    
        functions.preparation.getResource(creep, RESOURCE_ENERGY)
    }
}

export const builder = new RoleBuilder();