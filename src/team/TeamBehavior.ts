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

import { builder } from '@/creep/role/builder';
import { carrier } from '@/creep/role/carrier';
import { harvester } from '@/creep/role/harvester';
import { repairer } from '@/creep/role/repairer';
import { upgrader } from '@/creep/role/upgrader';
import { harvest } from '@/creep/task/harvest';
import { carry } from '@/creep/task/carry';
import { TaskExcutor } from '@/creep/task/TaskExcutor';
import { RoleBehavior } from '@/creep/role/RoleBehavior';
import { cleaner } from '@/creep/role/cleaner';

const roleBehaviors: {[role: string]: RoleBehavior} = {
    harvester: harvester,
    carrier: carrier,
    builder: builder,
    repairer: repairer,
    upgrader: upgrader,
    cleaner: cleaner
}

var tasks: {[type: string]: TaskExcutor} = {
    harvest: harvest,
    carry: carry
}

var defaultInit = (team: Team) => {
    //Do nothing
    return team.inited = true;
}

var defaultDoTask = (team: Team) => {
    _.forEach(team.creeps, (description) => {
        var work = Game.creeps[description.alive.work];
        var substitute = Game.creeps[description.alive.substitute];
        var task = description.task;

        if (task) {
            if (work) {
                tasks[task.type].run(work, task);
            }
            if (substitute) {
                tasks[task.type].run(substitute, task);
            }
            return;
        }

        if (work) {
            roleBehaviors[description.role].run(work);
        }
        if (substitute) {
            roleBehaviors[description.role].run(substitute);
        }
    });
}

var defaultSpawn = (team: Team) => {
    _.forEach(team.creeps, (description) => {
        var creep = Game.creeps[description.alive.work];
        if (description.autoRespawn && 
            !(creep || description.advance && creep.ticksToLive > description.advance) &&
            !description.alive.substitute
        ) {
            //添加到队列
            var creepName = team.name + '_' + description.name + '_' + Game.time;
            Memory.spawns[team.spawner][description.important ? 'priorQueue' : 'queue'].push({name:creepName,body:description.body});
            description.alive.substitute = creepName;
            console.log('Prepare to respawn creep:', creepName);
        }

        var substitute = Game.creeps[description.alive.substitute];
        if (!creep && substitute) {
            delete Memory.creeps[description.alive.work];
            description.alive.work = description.alive.substitute;
            description.alive.substitute = undefined;
        }
    });
}

export class TeamBehavior {
    constructor(behavior?: {
        init?: (team: Team) => boolean,
        doTask?: (team: Team) => void,
        spawn?: (team: Team) => void
    }) {
        this.init = behavior && behavior.init ? behavior.init : defaultInit;
        this.doTask = behavior && behavior.doTask ? behavior.doTask : defaultDoTask;
        this.spawn = behavior && behavior.spawn ? behavior.spawn : defaultSpawn;
    }

    run(team: Team)  {
        if (!team.inited && !this.init(team)) {
            console.log('Cannot init this team: ', team.name);
            return;
        }

        this.spawn(team);
        this.doTask(team);
    }

    init: (team: Team) => boolean

    doTask: (team: Team) => void

    spawn: (team: Team) => void
}