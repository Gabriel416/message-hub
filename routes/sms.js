const express = require("express");
const Nexmo = require("nexmo");
const phoneUtil = require("phone");
const router = express.Router();

/* send sms */
router.post("/", (req, res, next) => {
  let { phone, message } = req.body;

  const formattedPhone = phoneUtil(phone)[0];
  if (!formattedPhone) {
    //   validation fails
    res.status(500).send("Invalid phone number");
  }

  const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_KEY,
    apiSecret: process.env.NEXMO_SECRET,
  });

  const to = formattedPhone;
  const text = message;

  nexmo.message.sendSms(process.env.NEXMO_VIRTUAL_NUMBER, to, text, (error, response) => {
    if (error) {
      res.status(500).send({ Error: error });
      throw error;
    } else if (response.messages[0].status != "0") {
      res.json("Server returned back a non-zero status");
      throw "Nexmo returned back a non-zero status";
    } else {
      res.json({ Success: response });
    }
  });
});

module.exports = router;
