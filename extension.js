const vscode = require('vscode');
const fs = require('fs');
const csv = require('csv-parser');
const os = require('os');

let time_start;
let firstTimestamp;
let time_end = 0;
let lastTimestamp;
let t_model = vscode.window.createTerminal("Power Meter");

const fileName = `Power-Report.csv`;

function runPowerMeter() {
    let py_cmd = __dirname + "/PowerModel.py";
		py_cmd = `"${py_cmd}"`
		if(os.platform() === 'win32')
			t_model.sendText("python "+ py_cmd);
		else t_model.sendText("python3 "+ py_cmd);
}

function processcommand(userInput){
    let cmd_userInput;
		let dest_path;
		let path_withcmd;
		if((userInput.substring(0, 7) === "python ")){
			cmd_userInput = userInput.substring(7, userInput.length);
			dest_path = cmd_userInput;
			cmd_userInput = "python " + `"${cmd_userInput}"`;
		} else if((userInput.substring(0, 8) === "python3 ")){
			cmd_userInput = userInput.substring(8, userInput.length);
			dest_path = cmd_userInput;
			cmd_userInput = "python3 " + `"${cmd_userInput}"`;
		} else if((userInput.substring(0, 5) === "node ")){
			cmd_userInput = userInput.substring(5, userInput.length);
			dest_path = cmd_userInput;
			cmd_userInput = "node " + `"${cmd_userInput}"`;
		} else if((userInput.substring(0, 9) === "java -cp ")){
			cmd_userInput = userInput.substring(9, userInput.length);
			path_withcmd = userInput.substring(9, userInput.length);
			let last_space_index =  path_withcmd.lastIndexOf(' ');
			let file_path = path_withcmd.slice(0, last_space_index);
			cmd_userInput = path_withcmd.slice(last_space_index + 1);
			cmd_userInput = "java -cp " + `"${file_path}"`+ " " + cmd_userInput;
			dest_path = file_path;
		} else if((userInput.substring(0, 5) === "java ")){
			cmd_userInput = userInput.substring(5, userInput.length);
			dest_path = cmd_userInput;
			cmd_userInput = "java " + `"${cmd_userInput}"`;
		}
		else {
			cmd_userInput = `"${userInput}"`;
			dest_path = cmd_userInput;
		}
		return {dest_path, cmd_userInput};
}

async function createoutputfile(filteredCsvData, destfileAddr){
	const currentDate = new Date();

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 because January is 0
	const day = String(currentDate.getDate()).padStart(2, '0');

	const hours = String(currentDate.getHours()).padStart(2, '0');
	const minutes = String(currentDate.getMinutes()).padStart(2, '0');
	const seconds = String(currentDate.getSeconds()).padStart(2, '0');
	const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

	const localCurrentTime = `${year}-${month}-${day}T:${hours}:${minutes}:${seconds}Z`;
	const outputfilename = `Power-Report-${localCurrentTime}.csv`;
	const outputfilename_withpath = __dirname + '//' + outputfilename;
	vscode.window.showInformationMessage(outputfilename_withpath);

	//await fs.writeFileSync(destfileAddr, filteredCsvData, 'utf8');
	//vscode.window.showInformationMessage('Test 2', filteredCsvData);
}

async function commandtointerminal(cmd_userInput, destfileAddr){
	await vscode.commands.executeCommand('workbench.action.terminal.sendSequence', {
		text: `${cmd_userInput}\r`
	})
	const {exec} = require('child_process');
	await exec(`${cmd_userInput}`, async (error, stdout, stderr)=>{
		if(error){
			vscode.window.showInformationMessage('Input Error!', String(error));
			vscode.window.showInformationMessage('Input String...', cmd_userInput);
			return;
		}
		if(stderr){
			vscode.window.showInformationMessage('stderr');
			return;
		}
	
		let k_end = fs.createReadStream(__dirname + "/power_log1.csv");
		k_end.pipe(csv())
		.on('data', (row) => {
			lastTimestamp = row.timestamp;
		})
		.on('end', async() => {
			time_end = lastTimestamp;
		});
		
		const csvData = fs.readFileSync(__dirname + "/power_log1.csv", 'utf8');
		const rows = csvData.trim().split('\n').map(row => {
			const [timestamp, CPU_utilization, power] = row.split(',').map(Number);
			return { timestamp, CPU_utilization, power };
		  });

		const filteredRows = rows.filter(row => row.timestamp >= firstTimestamp);
		const filteredCsvData = filteredRows.map(row => `${row.timestamp},${row.CPU_utilization},${row.power}`).join('\n');
		
		await fs.writeFileSync(destfileAddr, filteredCsvData, 'utf8');
		vscode.window.showInformationMessage('Test 2', filteredCsvData);
		//copy a file
		createoutputfile(filteredCsvData);
		
		vscode.window.showInformationMessage('Your Power Report is available at ', destfileAddr);
	})
}
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	let disposable = vscode.commands.registerCommand('g', async function () {
		runPowerMeter();
		const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

		let power_log_error_check = __dirname + "/power_log1.csv";
		let k = fs.createReadStream(power_log_error_check);
		
		var userInput = await vscode.window.showInputBox({
			//prompt: 'Enter Command...'
		});
		let outputofexecutioncmd,  dest_path, cmd_userInput;
		outputofexecutioncmd = processcommand(userInput);
		dest_path =  outputofexecutioncmd.dest_path;
		cmd_userInput = outputofexecutioncmd.cmd_userInput;
		
		const file_name = dest_path.replace(/^.*[\\/]/, '');
		const destfilepath = dest_path.replace(file_name, '');
		const destfileAddr = destfilepath + '//' + fileName;
		vscode.window.showInformationMessage('Measurement Running...');

		await delay(10000);

		k.pipe(csv())
    	.on('data', (row) => {
        	firstTimestamp = row.timestamp;
    	})
	    .on('end', () => {
    	    time_start = firstTimestamp;
    	});

		commandtointerminal(cmd_userInput, destfileAddr);
	
		await delay(30000);
		t_model.sendText('\x03');
	});
		
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}