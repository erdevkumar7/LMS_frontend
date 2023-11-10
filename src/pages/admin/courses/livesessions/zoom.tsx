const KJUR = require('jsrsasign')

export default function handler() {

    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2
  
    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
        sdkKey: 'vtHGuMMOSiuh0fp1G7i9qg',
        mn: 85320471254,
        role: 0,
        iat: iat,
        exp: exp,
        appKey: 'vtHGuMMOSiuh0fp1G7i9qg',
        tokenExp: iat + 60 * 60 * 2
      }

      const sHeader = JSON.stringify(oHeader)
      const sPayload = JSON.stringify(oPayload)
      const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, 'lRDmYm7sCNq6Dmip3OqDed47n6gAfV5l')
    //   console.log(signature);
     return  signature

}



// require('dotenv').config()
// const express = require('express')
// const bodyParser = require('body-parser')
// const crypto = require('crypto')
// const cors = require('cors')
// const KJUR = require('jsrsasign')

// const app = express()
// const port = process.env.PORT || 4000

// app.use(bodyParser.json(), cors())
// app.options('*', cors())

// app.post('/', (req, res) => {

//   const iat = Math.round(new Date().getTime() / 1000) - 30;
//   const exp = iat + 60 * 60 * 2

//   const oHeader = { alg: 'HS256', typ: 'JWT' }

//   const oPayload = {
//     sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
//     mn: req.body.meetingNumber,
//     role: req.body.role,
//     iat: iat,
//     exp: exp,
//     appKey: process.env.ZOOM_MEETING_SDK_KEY,
//     tokenExp: iat + 60 * 60 * 2
//   }

//   const sHeader = JSON.stringify(oHeader)
//   const sPayload = JSON.stringify(oPayload)
//   const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_MEETING_SDK_SECRET)

//   res.json({
//     signature: signature
//   })
// })

// app.listen(port, () => console.log(`Zoom Meeting SDK Auth Endpoint Sample Node.js listening on port ${port}!`))
