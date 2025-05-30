const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors());

app.use("/proxy", (req, res) => {
  const url = req.query.url || "https://www.turismodecordoba.org/";

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.set("Content-Type", "text/html");
      res.set("X-Frame-Options", "ALLOWALL"); // Permitir iframe
      res.set("Content-Security-Policy", "frame-ancestors *");
      res.send(body);
    } else {
      res.status(500).send("Error al cargar la página");
    }
  });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Proxy corriendo en http://localhost:${PORT}/proxy`));
