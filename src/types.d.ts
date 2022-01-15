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

type GroupType = 'develop' | 'expansion' | 'industry' | 'army' | 'power'
// type TeamType = 'roomer' | 'outer' | 'immigrant'
type TeamType = 'exploit' | 'construct' | 'transport' | 'upgrade' | 'work'
type StructureGroupType = 'spawn' | 'tower' | 'store' | 'terminal' | 'link' | 'lab' | 'factory'
type TaskType = 'harvest' | 'carry' | 'observe'
type Role = 'harvester' | 'builder' | 'carrier' | 'upgrader' | 'observer' | 'worker' | 'claimer' | 'cleaner' | 'supplier'

type ExploitTarget = Source | Mineral | Deposit

type Product = CommodityConstant | MineralConstant | RESOURCE_GHODIUM | RESOURCE_ENERGY
type RawMaterial = CommodityConstant | MineralConstant | RESOURCE_GHODIUM | RESOURCE_ENERGY | DepositConstant

interface GroupConstructor extends MemorialConstructor<Group, GroupMemory> {}
interface TeamConstructor extends MemorialConstructor<Team, TeamMemory> {}
interface StructureGroupConstructor extends MemorialConstructor<StructureGroup, StructureGroupMemory> {}