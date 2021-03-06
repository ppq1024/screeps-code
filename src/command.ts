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

import { Team } from "@/team/Team"
import { Roomer } from "@/team/Roomer";
import { Immigrant } from "@/team/Immigrant";
import { Outer } from "@/team/Outer";

var teamTypes: {[name: string]: {new (memory: TeamMemory): Team}} = {
    roomer: Roomer,
    immigrant: Immigrant,
    outer: Outer
}

var loadTeamsFromMemory = () => {
    Game.teams = {};
    var teams = Memory.teams;
    if (!teams) Memory.teams = {}

    _.forEach(teams, (memory, name) => {
        Game.teams[name] = new teamTypes[memory.type](memory);
    })
}

var loadCommands = () => {
    //TODO
}

export const command =  {
    init: () => {
        loadTeamsFromMemory();
        loadCommands();
    }
}