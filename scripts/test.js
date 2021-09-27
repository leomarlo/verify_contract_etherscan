const qs = require('qs')

const params = {
    a: 'hallo',
    b: 'ciao'
}

console.log(qs.stringify(params))