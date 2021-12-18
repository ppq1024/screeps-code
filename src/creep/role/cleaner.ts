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
 * 资源回收
 */
class RoleCleaner extends RoleBehavior {
    run(creep: Creep, _description: CreepDescription, room?: Room): void {
        room = room ? room : creep.room;
        var station = creep.memory.station;
        if (!station) station = creep.memory.station = {}


        if (!creep.store.getFreeCapacity()) {
            this.store(creep, room);
            return;
        }

        var target = Game.getObjectById(station['targetID'] as Id<Resource | Tombstone | Ruin>);
        if (!target) {
            station['targetID'] = undefined;
            if ((target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)) ||
                (target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                    filter: (tombstone) => tombstone.store.getUsedCapacity()
                })) ||
                (target = creep.pos.findClosestByPath(FIND_RUINS, {
                    filter: (ruin) => ruin.store.getUsedCapacity()
                }))
            ) {
                station['targetID'] = target.id;
            }
        }

        if (target) {
            if (functions.moveTo(creep, target, 1)) {
                target instanceof Resource ? creep.pickup(target) :
                    _.forEach(target.store, (_count, resource: ResourceConstant) => 
                    creep.withdraw(target as Tombstone | Ruin, resource))
            }
            return;
        }
    
        if (room == Game.rooms.E24S53) {
            var container = Game.getObjectById('61b36bc1b711e1750170f9e1' as Id<StructureContainer>);
            if (container.store.getUsedCapacity() > 0) {
                if (functions.moveTo(creep, container, 1)) {
                    for (var resource in container.store) {
                        if (creep.store.getFreeCapacity() == 0) break;
                        creep.withdraw(container, resource as ResourceConstant);
                    }
                }
                
                return;
            }
        }
    
        this.store(creep, room);
    }

    store(creep: Creep, room: Room): void {
        if (functions.moveTo(creep, room.storage, 1))
            creep.transfer(room.storage, Object.keys(creep.store)[0] as ResourceConstant);
    }
}

export const cleaner = new RoleCleaner();