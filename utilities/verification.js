require('dotenv').config()
const {verificationRequest, getVerificationParams} = require('./request.js')
const {checkVerificationStatus, getRequestVerificationStatusParams} = require('./status.js')
const {delay} = require('./tools.js')
const {TIMEDELTA, WAITINGTIMESTEPS, INITIALWAITINGTIME, RETRIES, VERBOSE, INFO} = require('./config.js')


async function verify(params) {

    const verificationParams = getVerificationParams(params)
    const result = await verificationRequest(verificationParams)
    
    if (result.status==0) {
      if (INFO) {
        console.log('guid: ', result.guid)
      } else if (VERBOSE) {
        console.log(result)
        console.log('guid: ', result.guid)
      } 
      return false
    } 

    if (VERBOSE) {
      console.log(result)
    }


    const requestVerificationStatusParams = getRequestVerificationStatusParams(
      params.network,
      params.module,
      result.guid)


    let checkResult = new Object()
    
    // give etherscan some time to check the contract verification status
    await delay(INITIALWAITINGTIME * TIMEDELTA, '' + INITIALWAITINGTIME); 
    for (let time_index=0; time_index<RETRIES; time_index++) {

      // check the contract status repeatedly.
      checkResult = await checkVerificationStatus(requestVerificationStatusParams)

      // information to the user about status of the verification
      if (VERBOSE) {console.log(checkResult)}
      
      // breaks if contract succeeded or failed verification
      if (checkResult.status==1) {
        break
      } else if (checkResult.status==0 && checkResult.message.toLowerCase().includes('fail')) {
        break
      }
      
      // otherwise wait
      await delay(WAITINGTIMESTEPS * TIMEDELTA, '' + WAITINGTIMESTEPS);
    }
  
    console.log('guid: ', result.guid)
    if (checkResult.status==1){
      if (checkResult.message=='OK'){
        return true
      } else {
        return false
      }
    } else {
      return false
    }
    
  }
  

  module.exports = {
    verify
  };