# Verify on Etherscan

If you want to verify a deployed contract or library, called **Test**, then you first need to create a single file, say **All.sol**, where the contract itself and all of its dependences are stored. Make sure to place it into the contracts folder and that it compiles (see below). If **Test** is a contract that uses another contract **MotherTest** and another interface **InterTest** and a library **LibTest**, then all of these should be included into **All.sol**. If **Test** is a library, then **All.sol** contains just that library, since libraries cannot inherit anything by construction. The choice of name for the single composite file is arbitrary and you can choose it to your liking. However, you would then need to adjust the name in the *verification-parameters.json* file (see below).

Then you should initialize the node packages with 
```shell
npm i
```

Then you should create the file **All.sol** and place it into contracts folder. Then either check ``` "npx hardhat compile" ```
to see whether it compiles and make sure that it agrees with the deployed contract or directly proceed to the next step.

Paste your Etherscan API key into the *.env* file. Create the file, if you don't have it in this directory. Paste it like so:
```
ETHERSCAN_APIKEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
If you don't have an etherscan API key, then generate one. Just go to etherscan.io, create a user account and generate an api-key.

Then you need to open the *verification-parameters.json* and paste all the known details about your contract into it:
```js
{
    "module": "contract",  // can be "library"
    "network": "rinkeby",  // can be mainnet, kovan, rinkeby, any network for which etherscan has an api
    "address": "0xbabababababababababababababababababababa",  // deployed address of contract or library
    "contractName": "Test",
    "solidityFileName": "All.sol",
    "compilerversion":"v0.8.4+commit.c7e474f2",
    "licenseType": "5",
    "libraries": [  // this array may also be empty, if there are none, e.g. libraries: [].
        {
            "name": "Test",
            "adddress": "0xabababababababababababababababababababab"
        }
    ]
}
```

Then run the verification of the composite file with either of the first two commands (or compile and verify with the last command):
```shell
npm run verify
node verify.js  // alternatively
npm run compile_and_verify  // compile and verify and 
```

Wait for the output and see whether it got verified.

## Options

You may change some global config options in the *utilities/config.js*:

```js
module.exports = {
    TIMEDELTA: 1000,  // milliseconds
    WAITINGTIMESTEPS: 17,  // in seconds
    INITIALWAITINGTIME: 15,  // in seconds
    RETRIES: 3,  // number of retry attempts for status requests.
    VERBOSE: true,
    INFO: true
}
```

# ABOUT

Author: Leonhard Horstmeyer

Email: leonhard.horstmeyer@gmail.com


