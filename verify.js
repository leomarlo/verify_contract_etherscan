const fs = require('fs')
const {verify} = require('./utilities/verification.js');
const {INFO} = require('./utilities/config.js')


// retrieve the parameters as a json object and add the source code text to it.
const parameters_raw = fs.readFileSync('./verification-parameters.json').toString();
const parameters = JSON.parse(parameters_raw)  // check https://etherscan.io/contract-license-types
const SolidityFileText = fs.readFileSync('./contracts/' + parameters.solidityFileName ).toString();
parameters["sourceCodeText"] = SolidityFileText

// verify the contract
verify(parameters) 
  .then((res)=>{if(INFO){console.log('verification successful? ', res)}})
  .catch(console.log)


