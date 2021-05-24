//require mongoose package
const mongoose = require('mongoose');

//creating a schema for user i.e how your database should look like
const userSchema = mongoose.Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        jobRole: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    })
    //create a model for the schema created
const User = mongoose.model('User', userSchema);

module.exports = User;