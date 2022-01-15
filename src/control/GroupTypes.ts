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

import Develop from "@/develop/Develop";
import { develop } from "@/develop/Utils";

export const groupTypes: Record<GroupType, GroupConstructor> = {
    develop: Develop,
    expansion: undefined,
    industry: undefined,
    army: undefined,
    power: undefined
}

export const groupMemoryInit: Record<GroupType, (name: string, opts?: any) => GroupMemory> = {
    develop: develop.groupMemoryInit,
    expansion: undefined,
    industry: undefined,
    army: undefined,
    power: undefined
}