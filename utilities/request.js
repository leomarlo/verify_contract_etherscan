const axios = require('axios')
require('dotenv').config()
// const fs = require('fs')
const qs = require('qs')
const { getAPIUrl } = require('./tools')


function getVerificationParams (params) {
  const returnParams = {
    network:params.network,
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
    returnParams[librarynameKey + (lib_index+1)] = params.libraries[lib_index].name
    returnParams[libraryaddressKey + (lib_index+1)] = params.libraries[lib_index].address
  }

  return returnParams
}

async function verificationRequest (params) {

  const returnObject = {
    status: 0,
    guid: '',
    message: ''
  }
  const apiUrl = getAPIUrl(params.network)
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

module.exports = {
  verificationRequest,
  getVerificationParams
};