
'use strict'

/*
 * Sample code to make DNS over HTTPS request using POST
 * AUTHOR: Tom Pusateri <pusateri@bangj.com>
 * DATE: March 17, 2018
 * LICENSE: MIT
 */

const packet = require('dns-packet')
const https = require('https')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const buf = packet.encode({
  type: 'query',
  id: getRandomInt(1, 65534),
  flags: packet.RECURSION_DESIRED,
  questions: [{
    type: 'A',
    name: 'google.com'
  }]
})

const options = {
  hostname: 'dns.google.com',
  port: 443,
  path: '/experimental',
  method: 'POST',
  headers: {
    'Content-Type': 'application/dns-message',
    'Content-Length': Buffer.byteLength(buf)
  }
}

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode)
  console.log('headers:', res.headers)

  res.on('data', (d) => {
    console.log(packet.decode(d))
  })
})

req.on('error', (e) => {
  console.error(e)
})
req.write(buf)
req.end()

