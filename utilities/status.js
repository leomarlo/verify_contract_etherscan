const axios = require('axios')
require('dotenv').config()
const qs = require('qs')
const {getAPIUrl} = require('./tools')


function getRequestVerificationStatusParams(network, contractType, guid) {
  const requestVerificationStatusParams = {
    network: network,
    apikey: process.env.ETHERSCAN_APIKEY, 
    guid: guid, 
    module: contractType,
    action: "checkverifystatus"
  }
  return requestVerificationStatusParams
}


async function checkVerificationStatus(params) {
  const returnObject = {
    status: 0,
    result: '',
    message: ''
  }

  const apiUrl = getAPIUrl(params.network)
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
    // console.log(res)
    returnObject.status = parseInt(res.data.status)
    returnObject.result = res.data.result
    returnObject.message = res.data.message
  } catch (err) {
    console.log(err)
    returnObject.status = 0
    returnObject.result = ''
    returnObject.message = err
  }
  // console.log(returnObject)
  return returnObject
}


module.exports = {
  checkVerificationStatus,
  getRequestVerificationStatusParams
};