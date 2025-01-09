const mongoose = require('mongoose');
const crypto = require('crypto');
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
    role: {
        type : String,
        enum : ['user' , 'guide' , 'lead-guid' , 'admin'],
        default : 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please Confirm Your Password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "Passwod do not match"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken : String,
    passwordExpires : Date,
    active : {
        type : Boolean,
        default : true,
        select : false
    }

});

userSchema.pre(/^find/ , function(next){

this.find({active : true});
next();

});

userSchema.pre('save', async function (next) {
   
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {

    return await bcrypt.compare(candidatePassword, userPassword);

};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {

    if (this.passwordChangedAt) {
        const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimeStamp < changeTimeStamp;
    }

    return false;
}

userSchema.methods.createPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordExpires = Date.now() + 10 * 60 * 1000;

    console.log({resetToken} , this.passwordResetToken);
    return resetToken;
}

const User = new mongoose.model("User", userSchema);

module.exports = User;