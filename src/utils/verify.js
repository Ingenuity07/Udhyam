const accountSid = process.env.accountSid
const authToken = process.env.authToken
const verifySid = process.env.verifySid
const client = require("twilio")(accountSid, authToken);

const startVerification = (to)=> (new Promise(async (resolve,reject) =>{
    
    console.log("verifiction")
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to:'+91'+to, channel: "sms" })
      .then(() => resolve())
      .catch(er => {console.log(er)
                    reject()})
}))

const verifyOTP = (to, code) => (new Promise((resolve,reject)=>{
   
    client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to:'+91'+to, code })
    .then((verification_check) => console.log(verification_check))
    .then(() => resolve())
    .catch((er)=>reject())
}));





module.exports = {startVerification,verifyOTP}


// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+917905346684", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+917905346684", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });

