const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB Connection Sucessfull");
});



const app = require("./app");
console.log(app.get("env"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App Running On Port On ${port}`);
});
