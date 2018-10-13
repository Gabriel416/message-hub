const express = require("express");
const router = express.Router();
const sendgrid = require("@sendgrid/mail");
const validator = require("validator");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

sendgrid.setApiKey(process.env.SENDGRID_SECRET);

/* Send general email. */
router.post("/", function(req, res, next) {
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

  const source = fs.readFileSync(
    path.join(__dirname, "../") + "/public/email/general.html",
    "utf8"
  );

  const template = handlebars.compile(source);
  const result = template({ text });

  const email = {
    to,
    from: sender,
    subject,
    html: result,
  };

  sendgrid
    .send(email)
    .then(response => {
      res.send({ Success: response });
    })
    .catch(err => {
      console.log(err, "err");
      res.status(500).send({ Error: err });
    });
});

module.exports = router;
