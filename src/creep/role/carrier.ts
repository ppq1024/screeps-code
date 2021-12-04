/**
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

import { functions } from "@/creep/functions";

export const carrier = {
    run: function(creep: Creep) {
        if (creep.spawning) {
            return;
        }

        // 有任务则执行任务，否则执行默认配置
        var task = <CarrierTask> creep.memory.task;
        if (task) {
            if (task.static) {
                task = <CarrierTask> Memory.staticTask[task.name];
            }
            
            // station未定义意味着creep刚被生成
            var station = creep.memory.station;
            if (!creep.memory.station) {
                creep.memory['path'] = creep.pos.findPathTo(functions.getTarget(task.from), {range: 1});
                station = creep.memory.station = 'from';
            }

            // 目前carrier的station只有from和to两种
            // 实际上完整的名称应该是to fromTarget和to toTarget
            var target = functions.getTarget(task[station]);
            if (creep.pos.getRangeTo(target) > 1) {
                var pos = creep.memory['pos'];
                var current_pos = {x:creep.pos.x, y:creep.pos.y};
                if (!pos || pos.x != current_pos.x || pos.y != current_pos.y) {
                    creep.memory['path'] = creep.pos.findPathTo(target, {range: 1});
                }

                var result_ = creep.moveByPath(creep.memory['path']);
                if (result_ != OK) {
                    console.log('Cannot move with error code:', result_);
                }
                creep.moveByPath(creep.memory['path']);
            }
            var result: ScreepsReturnCode;
            switch (station) {
            case 'from':
                result = creep.withdraw(target, RESOURCE_ENERGY);
                break;
            case 'to':
                result = creep.transfer(target, RESOURCE_ENERGY);
                break;
            }

            if (result == OK) {
                switch (station) {
                case 'from':
                    creep.memory.station = 'to';
                    // creep.memory['path'] = task.defaultPath.to;
                    creep.memory['path'] = creep.pos.findPathTo(functions.getTarget(task.to), {range: 1});
                    break;
                case 'to':
                    creep.memory.station = 'from';
                    // creep.memory['path'] = task.defaultPath.from;
                    creep.memory['path'] = creep.pos.findPathTo(functions.getTarget(task.from), {range: 1});
                    break;
                }
                return;
            }

            if (result != ERR_NOT_IN_RANGE && result != ERR_NOT_ENOUGH_RESOURCES) {
                console.log('Cannot work with error code:', result);
            }
            return;
        }
        
        var store = Game.rooms[Memory['home']].storage;

        if (creep.store.energy == 0) {
            var from = store && store.store.energy > 0 ? store :
                    creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType == STRUCTURE_CONTAINER &&
                                structure.store.energy > 0
                    });

            if (from) {
                if (creep.pos.getRangeTo(from) > 1) {
                    creep.moveTo(from);
                }
                var result = creep.withdraw(from, RESOURCE_ENERGY)
                if (result != OK && result != ERR_NOT_IN_RANGE) {
                    console.log('Cannot get energy with error code:', result);
                }
            }
            return;
        }

        var target = Game.getObjectById<AnyStoreStructure>(creep.memory['targetID']);

        if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target) {
                creep.memory['targetID'] = target.id;
            }
        }

        if (target) {
            if (creep.pos.getRangeTo(target) > 1) {
                creep.moveTo(target);
            }
            var result = creep.transfer(target, RESOURCE_ENERGY)
            if (result != OK && result != ERR_NOT_IN_RANGE) {
                console.log('Cannot give energy with error code:', result);
            }
        }  
    }
}