const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please Tell Us Your Name'],
        email: {
            type: String,
            required: [true, 'Please Provide Your Email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please Provide a validate Email'],

        },
        photo: String,
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minLength: 8,
        },
        passwordConfirm : {
            type : String,
            required : [true, 'Please Confirm Your Password']
        }
    }

});

const User = new mongoose.model("User", userSchema);

module.exports = User;