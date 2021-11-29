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


 function remoteAction(creep, target, action) {
    var result = action(creep, target);
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    return result;
}

export const actions = {
    harvest: function(creep, target) {
        var action = (creep, target) => creep.harvest(target);
        return remoteAction(creep, target, action);
    },
    transfer: function(creep, target, type) {
        var action = (creep, target) => creep.transfer(target, type);
        return remoteAction(creep, target, action);
    },
    withdraw: function(creep, target, type) {
        var action = (creep, target) => creep.withdraw(target, type);
        return remoteAction(creep, target, action);
    },
    upgrad: function(creep, controller) {
        var action = (creep, controller) => creep.upgrad(controller);
        return remoteAction(creep, controller, action);
    },
    build: function(creep, constructionSite) {
        var action = (creep, constructionSite) => creep.build(constructionSite);
        return remoteAction(creep, constructionSite, action);
    },
    repair: function(creep, structure) {
        var action = (creep, structure) => creep.repair(structure);
        return remoteAction(creep, structure, action);
    }
};

