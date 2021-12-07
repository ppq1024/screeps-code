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

import { errorMapper } from '@/modules/errorMapper';
import { controller } from '@/creep/controllor';
import { spawner } from '@/creep/spawner';
import { tower } from '@/tower';
import { stateScanner } from '@/modules/stateScanner';


function loopUnit() {
    tower.run();
    spawner.run(Game.spawns['DEFAULT_SPAWN']);
    controller.run();

    stateScanner();
}

export const loop = errorMapper(loopUnit);
