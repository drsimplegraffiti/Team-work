//require an express package
const express = require('express');


//create an app variable to use the express variable
const app = express();

//require the model
const User = require('./user.model.js/usermodel')

//require  auth token...created middle ware
const { authenticateUser } = require('./auth');

//json middle-ware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//require bcrypt for hashing
const bcrypt = require('bcrypt');

//require json authentication
const jwt = require('jsonwebtoken');

//require mongoose package
const mongoose = require('mongoose');

//create a local database connection string
const connectionString = 'mongodb://localhost:27017/teamwork';


//connection string using .then way
mongoose.connect(connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: true,
    })
    .then(() => console.log('Database Connected'))
    .catch(() => console.log('Database not connected'));


//create a port and assigned any option to it
const PORT = 3001;
//the app variable will listen to the express server application

//Get request
app.get('/auth', (req, res) => {
    console.log('get request working');
})

//saving to the database i.e posting
app.post('/auth/create-user', async(req, res) => {
    try {
        const { firstName, lastName, email, password, gender, jobRole, department, address } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                message: "user already exist",
            });
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            gender,
            jobRole,
            department,
            address
        });
        await newUser.save();
        //create our token
        const token = await jwt.sign({ id: newUser._id }, 'token', { expiresIn: '2d' })

        return res.status(200).json({
            status: 'success',
            data: {
                newUser,
                token
            }

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error',
        })
    }
})

app.post('/auth/signin', authenticateUser, async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 'error',
            });
        } else {
            const confirmPassword = await bcrypt.compare(password, user.password);
            if (!confirmPassword) {
                return res.status(400).json({
                    message: `user password doesn't exist`,
                })
            }
            return res.status(200).json({
                message: 'user login successfully',
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
        })

    }
})

app.listen(PORT, () => {
    console.log(`the server app is running on PORT ${PORT}`);
})