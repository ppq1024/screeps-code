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
import { RoleBehavior } from '@/creep/role/RoleBehavior';

/**
 * 资源回收
 */
class RoleCleaner extends RoleBehavior {
    run(creep: Creep, description: CreepDescription, room?: Room): void {
        room = room ? room : creep.room;
        var station = creep.memory.station;
        if (!station) station = creep.memory.station = {};
        var targetsID = description['targetsID'] as Id<AnyStoreStructure>[];
        if (!targetsID) targetsID = description['targetsID'] = [];

        station.working = (station.working ? !creep.store.getFreeCapacity() : !creep.store.getUsedCapacity()) ?
                !station.working : station.working;

        if (!station.working) {
            this.store(creep, room);
            return;
        }

        

        var target = Game.getObjectById(station['targetID'] as Id<Resource | Tombstone | Ruin>);
        if (!target || !(target instanceof Resource) && !(target as Tombstone | Ruin).store.getUsedCapacity()) {
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
    
        if(_.any(targetsID, (targetID) => {
            var target = Game.getObjectById(targetID);
            if (target.store.getUsedCapacity() > 1000) {
                if (functions.moveTo(creep, target, 1)) {
                    _.forEach(target.store, (_count, resource: ResourceConstant) => 
                        creep.withdraw(target, resource))
                }
                return true;
            }
            return false;
        })) return;
    
        this.store(creep, room);
    }

    store(creep: Creep, room: Room): void {
        if (functions.moveTo(creep, room.storage, 1))
            creep.transfer(room.storage, Object.keys(creep.store)[0] as ResourceConstant);
    }
}

export const cleaner = new RoleCleaner();