const axios = require('axios')
require('dotenv').config()
const fs = require('fs')
const qs = require('qs')


const apiUrl = 'https://api-rinkeby.etherscan.io/api'


solidityfile = 'Test.sol'
ContractAddress = '0x89aa57471e0f47b18ac8fcb0da0f88b40eb346a8'
contractName = 'Test'
licenseType = 5  // GNU General Public License v3.0 (GNU GPLv3)
libName = 'Libra'
libAddress = '0x4b6eb3149fbb0be692c6daf81f5e51cff847aca9'
// let SolidityFileText = fs.readFileSync('./contracts/' + solidityfile ).toString();
// console.log(process.env.ETHERSCAN_APIKEY)
// const params = {
//     apikey:process.env.ETHERSCAN_APIKEY,
//     module:'contract',
//     action:'verifysourcecode',
//     sourceCode:SolidityFileText,
//     contractaddress:ContractAddress,
//     codeformat:'solidity-single-file',
//     contractname:contractName,
//     compilerversion:'v0.8.4+commit.c7e474f2',
//     optimizationused:0,
//     licenseType:licenseType,
//     libraryname1:libName,
//     libraryaddress1:libAddress}


async function verificationRequest (params) {

  const returnObject = {
    status: 0,
    guid: '',
    message: ''
  }
  try {
    const res = await axios(
      {
        url: apiUrl,
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
        data: qs.stringify(params)
      })
    
    returnObject.status = parseInt(res.data.status)
    returnObject.guid = res.data.result
    returnObject.message = res.data.message

  } catch (err) {
    returnObject.status = 0
    returnObject.guid = ''
    returnObject.message = err
  }

  return returnObject
    
}

async function checkVerificationStatus(params) {
  const returnObject = {
    status: 0,
    guid: '',
    message: ''
  }
  try {
    const res = await axios(
      {
        url: apiUrl,
        method: 'get',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
        data: qs.stringify(params)
      })
    console.log(res)
    returnObject.status = parseInt(res.data.status)
    returnObject.result = res.data.result
    returnObject.message = res.data.message
  } catch (err) {
    console.log(err)
    returnObject.status = 0
    returnObject.result = ''
    returnObject.message = err
  }
  return returnObject
}


async function verify(params) {

  const TimeDelta = 1000  // milliseconds
  const WaitingTimeSteps = 17
  const verificationParams = {
    apikey:process.env.ETHERSCAN_APIKEY,
    module:params.module,
    action:'verifysourcecode',
    sourceCode:params.sourceCodeText,
    contractaddress:params.address,
    codeformat:'solidity-single-file',
    contractname:params.contractName,
    compilerversion:params.compilerversion, //'v0.8.4+commit.c7e474f2',
    optimizationused:'0',
    licenseType:params.licenseType}
  
  const librarynameKey = 'libraryname'
  const libraryaddressKey = 'libraryaddress'

  for (let lib_index=0; lib_index<params.libraries.length; lib_index++) {
    verificationParams[librarynameKey + (lib_index+1)] = params.libraries[lib_index].name
    verificationParams[libraryaddressKey + (lib_index+1)] = params.libraries[lib_index].address
  }
  console.log(verificationParams)
  const result = await checkVerificationStatus(verificationParams)
  
  if (result.status==0) {
    console.log(result.data)
    return false
  } 

  const times = {elapsed: 0};
  const initialWaitingTime = 4 // in seconds
  setTimeout(()=>{times.elapsed += initialWaitingTime; console.log('Waiting for Verification for ' + times.elapsed + ' seconds');}, initialWaitingTime * TimeDelta);
  
  const requestVerificationStatusParams = {
    apikey: process.env.ETHERSCAN_APIKEY, 
    guid: result.guid, 
    module: params.module,
    action: "checkverifystatus"
  }

  for (let lib_index=0; lib_index<params.libraries.length; lib_index++) {
    const checkResult = await checkVerificationStatus(params)
    if (checkResult.status==1) {
      console.log(checkResult)
      break
    }
    setTimeout(()=>{times.elapsed += WaitingTimeSteps; console.log('Waiting for Verification for ' + times.elapsed + ' seconds.');}, WaitingTimeSteps * TimeDelta);
  }

  if (checkResult.status==1){
    if (checkResult.message=='OK'){
      console.log(checkResult.result)
      return true
    } else {
      return false
    }
  } else {
    return false
  }
  
}

// verifyRequest()

// const guid = 'tehpxddtvhukigc94qezhvuqh86sjrcv6drusqncwnec5vbbzw'
// const statusParams = 
//   {
//     apikey: process.env.ETHERSCAN_APIKEY, 
//     guid: guid, //Replace with your Source Code GUID receipt above
//     module: "contract",
//     action: "checkverifystatus"
//   }


// checkVerificationStatus(statusParams)

let SolidityFileText = fs.readFileSync('./contracts/' + solidityfile ).toString();

const params = {
  module: 'contract',
  sourceCodeText: SolidityFileText,
  address: '0x2adcb0df7273d22ec3c8f8e0c272b9b7e5cddd0b',
  contractName: 'Test',
  compilerversion:'v0.8.4+commit.c7e474f2',
  licenseType: '5',
  libraries: [
    {
      name: 'Libra',
      address: '0x01983302d05d7820f40975f5b798517309982287'
    }
  ]
}




let verified = verify(params)

console.log('verified', verified)

