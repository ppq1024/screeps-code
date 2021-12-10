// Call this function at the end of your main loop

export const exportStats = () => {
    Memory.stats = {
        gcl: {
            progress: Game.gcl.progress,
            progressTotal: Game.gcl.progressTotal,
            level: Game.gcl.level,
        },
        rooms: {},
        cpu: {
            bucket: Game.cpu.bucket,
            limit: Game.cpu.limit,
            used: Game.cpu.getUsed()
        },
        time: Game.time
    };

    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var isMyRoom = (room.controller ? room.controller.my : false);
        if (isMyRoom) {
            Memory.stats.rooms[roomName] = {
                storageEnergy: (room.storage ? room.storage.store.energy : 0),
                terminalEnergy: (room.terminal ? room.terminal.store.energy : 0),
                energyAvailable: room.energyAvailable,
                energyCapacityAvailable: room.energyCapacityAvailable,
                controllerProgress: room.controller.progress,
                controllerProgressTotal: room.controller.progressTotal,
                controllerLevel: room.controller.level
            };
        }
    }
}
