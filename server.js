const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on('uncaughtException' , err =>{
  console.log(err.name, err.message);
    process.exit(1);
});

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

const server = app.listen(port, () => {
  console.log(`App Running On Port On ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});


