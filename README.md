# Command-Based File Manager

A Node.js application that watches a command file and executes file operations based on text commands written to it.

## Overview

This application monitors a `command.txt` file for changes and executes file system operations based on the commands written to it. It provides a simple text-based interface for creating, deleting, renaming, and adding content to files.

## Features

-   **File Creation**: Create new files at specified paths
-   **File Deletion**: Remove files from the file system
-   **File Renaming**: Rename or move files to new locations
-   **Content Addition**: Append content to existing files
-   **Real-time Monitoring**: Automatically detects changes to the command file
-   **Error Handling**: Graceful handling of common file system errors

## Prerequisites

-   Node.js (version 14 or higher recommended)
-   File system read/write permissions in the application directory

## Installation

1. Save the application code to a file (e.g., `app.js`)
2. Ensure Node.js is installed on your system
3. Create a `command.txt` file in the same directory as the application

## Usage

### Starting the Application

```bash
node app.js
```

The application will start monitoring the `command.txt` file for changes.

### Command Syntax

Write commands to the `command.txt` file using the following formats:

#### Create a File

```
create a file <file-path>
```

**Example:** `create a file ./documents/newfile.txt`

#### Delete a File

```
delete the file <file-path>
```

**Example:** `delete the file ./documents/oldfile.txt`

#### Rename a File

```
rename the file <old-path> to <new-path>
```

**Example:** `rename the file ./old-name.txt to ./new-name.txt`

#### Add Content to a File

```
add to the file <file-path> this content: <content>
```

**Example:** `add to the file ./notes.txt this content: Hello, World!`

### How It Works

1. The application continuously watches the `command.txt` file
2. When the file is modified, it reads the entire content
3. It parses the command and extracts the necessary parameters
4. The appropriate file operation is executed
5. Results are logged to the console

## Example Workflow

1. Start the application: `node app.js`
2. Open `command.txt` in a text editor
3. Write a command: `create a file ./test.txt`
4. Save the file
5. Check the console for confirmation: "A new file was successfully created"

## Error Handling

The application handles common scenarios:

-   **File Already Exists**: When trying to create a file that already exists
-   **File Not Found**: When trying to delete, rename, or modify a non-existent file
-   **Permission Errors**: When lacking proper file system permissions
-   **Invalid Paths**: When provided paths are invalid or inaccessible

## Important Notes

-   **Content Addition**: The application prevents adding the same content consecutively to avoid duplication
-   **File Watching**: Uses Node.js's built-in `fs.watch()` for efficient file monitoring
-   **Asynchronous Operations**: All file operations are performed asynchronously for better performance
-   **Buffer Management**: Dynamically allocates buffers based on file size for memory efficiency

## Limitations

-   Commands must follow the exact syntax patterns
-   Only one command per file modification is processed
-   The application runs continuously until manually stopped (Ctrl+C)
-   File paths are relative to the application's working directory

## Troubleshooting

**Application not responding to commands:**

-   Ensure `command.txt` exists in the same directory
-   Verify file permissions allow read/write access
-   Check that commands follow the exact syntax

**File operations failing:**

-   Verify file paths are correct and accessible
-   Ensure sufficient disk space for file operations
-   Check directory permissions for create/delete operations

## Security Considerations

-   The application can perform file operations anywhere the Node.js process has permissions
-   Be cautious with file paths to avoid unintended file system modifications
-   Consider running in a restricted environment for production use

## Stopping the Application

Press `Ctrl+C` in the terminal to stop the application gracefully.
