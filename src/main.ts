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

import { errorMapper } from '@/modules/errorMapper';
import { exportStats } from '@/modules/stats'
import { command } from '@/command';

var loopUnit = () => {
    command.init();
    _.forEach(Game.groups, (group) => group.run());
    

    if (Game.resources.pixel != undefined) {
        if (Game.cpu.bucket >= 10000) {
            Game.cpu.generatePixel();
        }
    
        if (!(Game.time & 0x3fff) && Game.resources[PIXEL] > 100) {
            var order = Game.market.getAllOrders({
                type: ORDER_BUY,
                resourceType: PIXEL
            }).sort((a, b) => b.price - a.price)[0];
            console.log('Order price: ', order.price);
            var result = Game.market.deal(order.id, Math.min(order.remainingAmount, Game.resources[PIXEL]));
            console.log('Order result: ', result);
        }
    }

    exportStats();
}

export const loop = errorMapper(loopUnit);
