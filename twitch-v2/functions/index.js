const fs = require('node:fs');
const path = require('node:path');

const data = {};

const functionsPath = path.join(__dirname, '.');
const functionsFolder = fs.readdirSync(functionsPath);
for (const file of functionsFolder) {
	const functionName = path.parse(file).name;

	// skip this file
	if (functionName !== 'index') {
		const filePath = path.join(functionsPath, file);
		const functionData = require(filePath);
		data[functionName] = functionData.function;
	}
}

module.exports = {
	content: function() {
		return data;
	},
};