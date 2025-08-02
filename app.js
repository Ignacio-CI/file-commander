const fs = require('fs/promises');

(async () => {
    // commands
    const CREATE_FILE = 'create a file';

    // command handlers
    async function createFile(path) {
        try {
            // check whether or not we already have the file
            let existingFileHandle = await fs.open(path, 'r');
            existingFileHandle.close();
            // the file already exists...
            return console.log(`The file ${path} already exists.`);
        } catch (error) {
            // the file does not exist yet, it should be created
            const newFile = await fs.open(path, 'w');
            console.log('A new file was successfully created');
            newFile.close();
        }
    }

    const commandFileHandler = await fs.open('./command.txt', 'r');

    commandFileHandler.on('change', async () => {
        // Get the size of the file
        const size = (await commandFileHandler.stat()).size;
        // Allocate the buffer with the size of the file
        const buff = Buffer.alloc(size);
        // The location at which we want to start filling the buffer
        const offset = 0;
        // how many bytes we wan tto read
        const length = buff.byteLength;
        // the position that we want to start reading the file from
        const position = 0;
        // we always want to read the whole content (from beginning all the way to the end)
        await commandFileHandler.read(buff, offset, length, position);

        const command = buff.toString('utf-8');
        if (command.includes(CREATE_FILE)) {
            const filetPath = command.substring(CREATE_FILE.length + 1);
            createFile(filetPath);
        }
    });

    const watcher = fs.watch('./command.txt');

    for await (const event of watcher) {
        if (event.eventType == 'change') {
            commandFileHandler.emit('change');
        }
    }
})();
