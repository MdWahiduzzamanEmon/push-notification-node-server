const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("web-push");

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:"push@notification.com"',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// post vapidKeys.publicKey to client
app.get("/notify/publicKey", (req, res) => {
  if (vapidKeys.publicKey) {
    res
      .status(200)
      .json({ success: true, data: vapidKeys.publicKey, message: "success" });
  } else {
    res
      .status(400)
      .json({ success: false, data: {}, message: "Vapid key not found" });
  }
});

app.post("/notify/subscribe", (req, res) => {
  const subscription = req.body.subscription;
  console.log(subscription);

  //get payload from data from database
  const payload = JSON.stringify(req.body.data);

  webpush
    .sendNotification(subscription, payload)
    .then((result) => console.log(result))
    .catch((e) => console.log(e.stack));
  res
    .status(200)
    .json({ success: true, data: req.body.data, message: "success" });
});

app.get("/", (req, res) => {
  res.send("Push Notification Server Running");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
