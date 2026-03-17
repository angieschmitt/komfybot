import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function(){
    const data = {};

    const functionsPath = path.join(__dirname, '.');
    const functionsFolder = fs.readdirSync(functionsPath);
    for (const file of functionsFolder) {
    	const functionName = path.parse(file).name;

    	// skip this file
    	if (functionName !== 'index' && functionName !== 'archived') {
    		const filePath = path.join(functionsPath, file);
    		const functionData = require(filePath);
    		// data[functionName] = functionData.default;

    		const keys = Object.keys(functionData);
    		for (const key of keys) {
    			if (typeof functionData[key] == 'function') {
    				data[key] = functionData[key];
    			}
    		}

    	}
    }

    return data;
}