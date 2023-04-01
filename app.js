require("dotenv").config();
const cors = require("cors");
const express = require("express");
const qrcode = require("qrcode");
const fs = require("fs"); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QR Code Generator");
});

app.get("/qrcode", (req, res) => {
  console.log(req);
  const { data, width = 300, height = 300 } = req.query;

  if (!data) {
    res.status(400).send("Missing text parameter");
    return;
  }

  const options = {
    width: parseInt(width), 
    height: parseInt(height), 
  };

  qrcode.toFile("image.png", [{ data, mode: "byte" }], options, (err, url) => {
    if (err) {
      res.status(500).send("Error generating QR code");
      return;
    }

   
    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", 'attachment; filename="image.png"');

    
    res.download("./image.png", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error generating QR code");
      }

    
      fs.unlink("./image.png", (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});