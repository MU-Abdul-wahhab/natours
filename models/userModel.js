const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please Tell Us Your Name'],
    },
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
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please Confirm Your Password'],
        validate : {
            validator : function (el){
                return el === this.password
            },
            message : "Passwod do not match"
        }
    }

});

userSchema.pre('save' , async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password , 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword){

return await bcrypt.compare(candidatePassword, userPassword)

};

const User = new mongoose.model("User", userSchema);

module.exports = User;