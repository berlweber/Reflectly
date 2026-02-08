const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }, 
    displayName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false,
        }, //still need to check if validation is working and if package installation needed.
    },
    hashedPassword: {
        type: String,
        required: true,
    },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;