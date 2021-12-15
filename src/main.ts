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

import { errorMapper } from '@/modules/errorMapper';
import { teamController } from '@/team/teamController';
import { spawner } from '@/creep/spawner';
import { tower } from '@/tower';
import { link } from '@/link';
import { exportStats } from '@/modules/stats'
import { command } from '@/command';

var loopUnit = () => {
    command.init();
    tower.run();
    link.run();
    _.forEach(Game.teams, (team) => team.run());
    spawner.run();

    if (Game.resources.length) {
        if (Game.cpu.bucket >= 10000) {
            Game.cpu.generatePixel();
        }
    
        if (!(Game.time & 0x3ff) && Game.resources[PIXEL] > 10) {
            var order = Game.market.getAllOrders((order) => 
                    order.resourceType == PIXEL &&
                    order.type == ORDER_BUY &&
                    order.remainingAmount > 0
            ).sort((a, b) => b.price - a.price)[0];
            console.log('Order price: ', order.price);
            var result = Game.market.deal(order.id, Math.min(order.remainingAmount, Game.resources[PIXEL]));
            console.log('Order result: ', result);
        }
    }

    exportStats();
}

export const loop = errorMapper(loopUnit);
