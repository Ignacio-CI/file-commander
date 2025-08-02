const fs = require('fs/promises');

(async function app() {
    // commands
    const CREATE_FILE = 'create a file';
    const DELETE_FILE = 'delete the file';
    const RENAME_FILE = 'rename the file';
    const ADD_TO_FILE = 'add to the file';

    // command handlers
    async function createFile(path) {
        try {
            // check whether or not we already have the file
            const existingFileHandle = await fs.open(path, 'r');
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

    async function deleteFile(path) {
        try {
            await fs.unlink(path);
            console.log('File succesfully removed.');
        } catch (error) {
            if (error.code == 'ENOENT') {
                console.log('No file at this path to remove.');
            } else {
                console.error('An error ocurred while attempting to remove the file.');
            }
        }
    }

    async function renameFile(oldPath, newPath) {
        try {
            await fs.rename(oldPath, newPath);
            console.log('File succesfully renamed.');
        } catch (error) {
            if (error.code == 'ENOENT') {
                console.log('No file at this path to rename, or the destination does not exist.');
            } else {
                console.error('An error ocurred while attempting to rename the file.');
            }
        }
    }

    let addedContent;

    async function addToFile(path, content) {
        if (addedContent == content) return;

        try {
            const fileHandle = await fs.open(path, 'a');
            await fileHandle.write(content + ' ');
            addedContent = content;
            console.log(`${content} was successfully added to the file.`);
        } catch (error) {
            console.log(error);
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
        // How many bytes we wan tto read
        const length = buff.byteLength;
        // The position that we want to start reading the file from
        const position = 0;
        // Read the whole content
        await commandFileHandler.read(buff, offset, length, position);

        const command = buff.toString('utf-8');

        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1);
            createFile(filePath);
        }

        // delete a file
        // delete the file <path>
        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1);
            deleteFile(filePath);
        }

        // rename the file
        // rename the file <path> to <new-path>
        if (command.includes(RENAME_FILE)) {
            const _idx = command.indexOf(' to ');
            const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
            const newFilePath = command.substring(_idx + 4);

            renameFile(oldFilePath, newFilePath);
        }

        // add to file
        // add to the file <path> this content: <content>
        if (command.includes(ADD_TO_FILE)) {
            const _idx = command.indexOf(' this content: ');
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
            const content = command.substring(_idx + 15);

            addToFile(filePath, content);
        }
    });

    const watcher = fs.watch('./command.txt');

    for await (const event of watcher) {
        if (event.eventType == 'change') {
            commandFileHandler.emit('change');
        }
    }
})();
