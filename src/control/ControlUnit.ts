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

/**
 * 控制单元绝大多数逻辑执行的基本单位，它隐藏了内部的逻辑并暴露入口函数，
 * 在每个tick都会执行
 */
interface ControlUnit {

    /**
     * 控制单元自身逻辑的处理，不包括下级单元
     */
    process(): void;

    /**
     * 控制单元每个tick执行的任务
     */
    run(): void;
}