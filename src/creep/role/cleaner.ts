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

var cleanDroppedResources = (creep: Creep) => {
    var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
        if (functions.moveTo(creep, target, 1)) {
            creep.pickup(target);
        }
        return true;
    }

    return false;
}

var cleanTombstones = (creep: Creep) => {
    var target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
        filter: (tombstone) => tombstone.store.getUsedCapacity() > 0
    });
    if (target) {
        if (functions.moveTo(creep, target, 1)) {
            _.forEach(target.store, (_count, resource: ResourceConstant) => creep.withdraw(target, resource));
        }
        return true;
    }

    return false;
}

var cleanRuins = (creep: Creep) => {
    var target = creep.pos.findClosestByPath(FIND_RUINS, {
        filter: (ruin) => ruin.store.getUsedCapacity() > 0
    });
    if (target) {
        if (functions.moveTo(creep, target, 1)) {
            _.forEach(target.store, (_count, resource: ResourceConstant) => creep.withdraw(target, resource));
        }
        return true;
    }

    return false;
}

var store = (creep: Creep, room: Room) => {
    if (functions.moveTo(creep, room.storage, 1)) {
        _.forEach(creep.store, (_count, resource: ResourceConstant) => creep.transfer(room.storage, resource)); 
    }
}

var run = (creep: Creep, room?: Room) => {
    room = room ? room : creep.room;
    if (creep.store.getFreeCapacity() == 0) {
        store(creep, room);
        return;
    }

    if (cleanDroppedResources(creep)) {
        return;
    }

    if (cleanTombstones(creep)) {
        return;
    }

    if (cleanRuins(creep)) {
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

    store(creep, room);
}

export const cleaner = new RoleBehavior(run);