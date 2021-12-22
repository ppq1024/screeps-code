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

export const market = {
    run() {
        var terminal = Game.rooms.E24S53.terminal;
        var remaining = 2000 - terminal.store.GH2O;
        if (remaining > 0 && !terminal.cooldown) { 
            var order = Game.market.getAllOrders({
                type: ORDER_SELL,
                resourceType: 'GH2O'
            }).sort((a, b) => a.price - b.price)[0];
            console.log('Order price: ', order.price);
            var result = Game.market.deal(order.id, Math.min(order.remainingAmount, 2000), 'E24S53');
            console.log('Order result: ', result);
        }
    
        var energyOrder = Game.market.getOrderById('61c29aa6145569c2dac0c14f');
        if (terminal.store.energy < 100000 && energyOrder.remainingAmount < 50000) {
            Game.market.extendOrder(energyOrder.id, 50000);
        }
    
        var terminal = Game.rooms.E23S52.terminal;
        var remaining = 2000 - terminal.store.GH2O;
        if (remaining > 0 && !terminal.cooldown) { 
            var order = Game.market.getAllOrders({
                type: ORDER_SELL,
                resourceType: 'GH2O'
            }).sort((a, b) => a.price - b.price)[0];
            console.log('Order price: ', order.price);
            var result = Game.market.deal(order.id, Math.min(order.remainingAmount, 2000), 'E23S52');
            console.log('Order result: ', result);
        }
        
        var energyOrder = Game.market.getOrderById('61c2cb6e1455693a7ad10818');
        if (terminal.store.energy < 100000 && energyOrder.remainingAmount < 50000) {
            Game.market.extendOrder(energyOrder.id, 50000);
        }
    }
}