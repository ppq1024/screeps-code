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
 * 主要为spawn、extension和tower进行能量供应
 */
class RoleSupplier extends RoleBehavior {
    run(creep: Creep, description: CreepDescription, _room?: Room): void {
        var station = functions.check.checkStation(creep, RESOURCE_ENERGY);
        var target = description['target'] as StructureConstant[];
        if (!target || !target.length) target = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]

        if (station.working) {
            functions.work.supply(creep, ...target);
            return;
        }

        functions.preparation.getResource(creep, RESOURCE_ENERGY);
    }
}

export const supplier = new RoleSupplier();