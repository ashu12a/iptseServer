const axios = require('axios');

 const sendOtp = (phone, otp) =>{
    new Promise(async (resolve, reject) => {
    //   if (!phone) return resolve();
      console.log("*** Sending Otp to ", phone);
      axios({
        method: "GET",
        url: `http://46.4.104.219/vb/apikey.php?apikey=29mdihyHVItU3mRU&senderid=IPEOLY&number=${phone}&message=Welcome to the IPTSE family. Your OTP for logging into the IPTSE Candidate portal is ${otp}. -- Team IPTSE`,
        headers: {
          "Content-Type": "application/json"
          // Cookie: "PHPSESSID=k7sqrc14mlu1235h4821mfbvsj",
        }
      })
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      return resolve();
    })
  }
  module.exports = sendOtp;
