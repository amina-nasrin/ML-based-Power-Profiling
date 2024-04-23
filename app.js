const { spawn } = require('child_process');

const a = 4;
const b = 4;

// Spawn a Python process and pass integer parameters
const pythonProcess = spawn('python', ['script.py', a.toString(), b.toString()]);

// Collect data from the Python process
pythonProcess.stdout.on('data', (data) => {
    console.log(`Result from Python script: ${data}`);
});
/*
// Handle error event
pythonProcess.on('error', (error) => {
    console.error(`Error executing Python script: ${error}`);
});

// Handle close event
pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
});
*/