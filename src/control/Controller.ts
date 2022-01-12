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
 * 三级控制单元，一般对应单一的游戏对象，但有时也对应联合行动的多个游戏对象，如四人小队等
 */
abstract class Controller<O extends RoomObject, D extends Description<O>> implements ControlUnit {

    object: O;
    description: D;


    constructor(description: D) {
        this.description = description;
        this.object = this.getObject(this.description);
    }
    process(): void {
        throw new Error("Method not implemented.");
    }

    protected abstract getObject(description: D): O;

    run(): void {

    }
}