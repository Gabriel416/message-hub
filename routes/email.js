const express = require("express");
const router = express.Router();
const sendgrid = require("@sendgrid/mail");
const validator = require("validator");

sendgrid.setApiKey(process.env.SENDGRID_SECRET);

/* Send general email. */
router.post("/", function(req, res, next) {
  console.log(req.body, "req");
  let { to, sender, subject, text } = req.body;

  if (!validator.isEmail(sender)) {
    res.status(500).send("Invalid sender email");
  }

  const areEmailsValid = to.every(email => {
    return validator.isEmail(email);
  });

  if (!areEmailsValid) {
    res.status(500).send("Invalid recipient emails");
  }

  const email = {
    to,
    from: sender,
    subject,
    text,
  };

  sendgrid
    .send(email)
    .then(response => {
      // console.log(response, "response");
      res.send({ Success: response });
    })
    .catch(err => {
      console.log(err, "err");
      res.status(500).send(err);
    });
});

module.exports = router;
