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

/**
 * Creep使用的函数分为三大类，工作准备、工作执行、状态检查。
 * 还有一些额外的工具函数。
 */
export const functions = {

    /////////////////
    // preparation //
    /////////////////
    preparation: {
        /**
         * 从仓库（StructureStorage）或容器（StructureContainer）中获取指定资源
         * 
         * @param creep 需要补充资源的Creep
         * @param resource 需要补充的资源类型
         * @param room 资源所在的房间，未指定则为Creep所在房间
         * @returns 是否被成功执行，向仓库或容器移动也被认为是成功执行，
         *     通常只有所有仓库或容器都没有指定资源才会执行失败
         */
        getResource(creep: Creep, resource: ResourceConstant, room?: Room): boolean {
            room = room ? room : creep.room;
            var store = room.storage;
            var from = (store && store.store[resource] > 0) ? store :
                    creep.room == room ? creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[resource] > 0
                    }) : room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[resource] > 0
                    })[0];
            
            if (from && functions.moveTo(creep, from, 1)) {
                creep.withdraw(from, resource);
            }

            return from ? true : false;
        }
    },

    //////////
    // work //
    //////////
    work: {
        /**
         * 为指定类型的建筑提供能量
         * 
         * @param creep 执行任务的creep
         * @param type 需要提供能量的建筑类型
         * @returns 是否被成功执行，向建筑移动也被认为是成功执行，
         *     通常只有所有指定类型的建筑都充满能量才会执行失败
         */
        supply(creep: Creep, ...type: StructureConstant[]): boolean {
            if (!creep.memory.station.target) creep.memory.station.target = {type: undefined}
            var target = functions.check.checkTarget(creep.memory.station.target, creep.pos, ...type);
            if (target) {
                if (functions.moveTo(creep, target, 1)) {
                    var result = creep.transfer(target, RESOURCE_ENERGY)
                    if (result != OK && result != ERR_NOT_IN_RANGE) {
                        console.log('Cannot give energy with error code:', result);
                    }
                }
                return true;
            }
            return false;
        },
        /**
         * 执行维修任务，包括建筑维修和刷墙
         * 
         * @param creep 执行维修任务的creep
         * @returns 是否被成功执行，向建筑移动也被认为是成功执行，
         *     通常只有没有需要维修的建筑时才会执行失败
         */
        repair(creep: Creep): boolean {
            var target = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER}).length ?
                    freshWallTarget(creep) : repairTarget(creep);

            if (target && functions.moveTo(creep, target, 3)) {
                if (functions.moveTo(creep, target, 3)) {
                    creep.repair(target);
                }
                return true;
            }
            return false;
        }
    },

    ///////////
    // check //
    ///////////
    check: {
        /**
         * 根据指定的资源类型检查并更新Creep的工作状态
         * 
         * @param creep 需要检查的Creep
         * @param resource 需要检查的资源
         * @returns Creep的工作状态，其中的working成员可能被更新
         */
        checkStation: (creep: Creep, resource: ResourceConstant) => {
            var station = creep.memory.station;
            if (!station) station = creep.memory.station = {}
            // (是否工作 ? 对应转换状态条件是否满足) ? 转换状态
            station.working = (station.working ? !creep.store[resource] : !creep.store.getFreeCapacity(resource)) ?
                    !station.working : station.working;
            return station;
        },
    
        /**
         * 检查是否需要更换目标
         * 
         * @param structureTarget 目标对象
         * @param pos 寻找新目标的基准点
         * @param type 允许的目标建筑类型
         * @returns 解析后的目标对象，检查过程中原对象中的数据可能会被更新
         */
        checkTarget: (structureTarget: StructureTarget, pos: RoomPosition, ...type: StructureConstant[]) => {
            if (type && type.includes(structureTarget.type) ||
                    !(target = functions.getTarget(structureTarget)) ||
                    !target.store.getFreeCapacity()
            ) {
                var target = pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure: AnyStoreStructure) => type.includes(structure.structureType) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });
                structureTarget.type = target ? target.structureType : undefined;
                structureTarget.description = target ? target.id : undefined;
            }
    
            return functions.getTarget(structureTarget);
        }

    },
    
    /**
     * 将StructureTarget对象解析为AnyStoreStructure对象
     * 
     * @param target StructureTarget对象
     * @returns 对应的AnyStoreStructure对象，或undefined
     */
    getTarget: (target: StructureTarget) => target && target.type ? target.type == STRUCTURE_STORAGE ?
        Game.rooms[target.description].storage :
        Game.getObjectById(target.description as Id<AnyStoreStructure>) : undefined,
    
    /**
     * 向指定目标移动Creep
     * 
     * @param creep 需要移动的Creep
     * @param target Creep移动的目标
     * @param range 需要的最大距离
     * @returns Creep是否已在目标的指定距离内
     */
    moveTo: (creep: Creep, target: RoomPosition | {pos: RoomPosition}, range?: number) => {
        range = range ? range : 0;
        if (creep.pos.getRangeTo(target) <= range) {
            return true;
        }

        var result = creep.moveTo(target, {range: range});
        return result == OK && creep.pos.getRangeTo(target) <= range;
    },

    /**
     * 主要用于前期或没有能量储备时开采资源
     * 
     * @param creep 执行任务的Creep
     */
    rawHarvest: (creep: Creep) => {
        var source = Game.getObjectById(creep.memory.station['sourceID'] as Id<Source>);
        if (!source || source.energy == 0) {
            source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (!source) {
                return;
            }
            creep.memory.station['sourceID'] = source.id;
        }
        if (functions.moveTo(creep, source, 1)) {
            creep.harvest(source);
        }
    },
}

var freshWallTarget = (creep: Creep) => {
    var station = creep.memory.station;
    var lastFresh = station['lastFresh'] as number;
    lastFresh = lastFresh ? lastFresh : 0;
    if ((Game.time - lastFresh > 0x100) || !station['targetID']) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_WALL ||
                    structure.structureType == STRUCTURE_RAMPART) &&
                    structure.hits < structure.hitsMax 
        });

        var hitsMin = targets[0];
        targets.forEach((wall) => hitsMin = hitsMin.hits < wall.hits ? hitsMin : wall);
        if (!hitsMin) {
            return undefined;
        }
        station['targetID'] = hitsMin.id;
        station['lastFresh'] = Game.time;
        return hitsMin;
    }
    return Game.getObjectById(station['targetID'] as Id<StructureWall | StructureRampart>);
}

var repairTarget = (creep: Creep) => {
    var station = creep.memory.station;
    var target = Game.getObjectById(station['targetID'] as Id<AnyStructure>);
    if (!target || target.hits == target.hitsMax) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType != STRUCTURE_WALL &&
                    structure.structureType != STRUCTURE_RAMPART &&
                    structure.hits < structure.hitsMax
        });
    }
    return target;
}