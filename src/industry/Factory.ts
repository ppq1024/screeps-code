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

class Factory {
    memory: FactoryMemory

    factory: StructureFactory


    run(): void {
        var description: ProductDescription = COMMODITIES[this.memory.product]
        if (!description) return;

        this.produce(description);
    }

    produce(description: ProductDescription): void {
        if (!this.checkRawMaterial(description) || this.factory.cooldown) return;

        this.factory.produce(this.memory.product);
    }

    checkRawMaterial(description: ProductDescription): boolean {
        return _.every(description.components, (number, rawMaterial) => this.factory.store[rawMaterial] >= number);
    }
}