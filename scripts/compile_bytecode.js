// scripts/compile_bytecode.js
// Reads Hardhat's artifact for Compliance and writes the raw bytecode hex to contracts/ComplianceBytecode.hex


const fs = require('fs');
const path = require('path');


async function main(){
const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'Compliance.sol', 'Compliance.json');
if(!fs.existsSync(artifactPath)){
console.error('Artifact not found. Run `npm run compile:hardhat` first.');
process.exit(1);
}


const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const bytecode = artifact.deployedBytecode || artifact.bytecode;
if(!bytecode || bytecode.length === 0){
console.error('Bytecode empty in artifact. Did the compilation succeed?');
process.exit(1);
}


// remove optional 0x
const hex = bytecode.startsWith('0x') ? bytecode.slice(2) : bytecode;
const outPath = path.join(__dirname, '..', 'contracts', 'ComplianceBytecode.hex');
fs.writeFileSync(outPath, hex, { encoding: 'utf8' });
console.log('Wrote bytecode hex to', outPath);
}


main().catch(err => { console.error(err); process.exit(1); });