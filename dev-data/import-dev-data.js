const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("./../models/tourModel");
const Review = require("./../models/reviewModel");
const User = require("./../models/userModel");


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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));

const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, {validateBeforeSave : false});
        await Review.create(reviews);
        console.log("Data Successfully Loaded");
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data Successfully Deleted");
        process.exit();
    } catch (error) {
        console.log(error);
    }


};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);