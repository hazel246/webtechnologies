let express = require("express");
let app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", function (req, res) {
  return res.render("homepage");
});

app.listen(3000, function () {
  console.log("Server Started at http://localhost:3000");
});
