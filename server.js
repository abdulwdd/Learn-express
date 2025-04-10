require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
require("dotenv");
const PORT = process.env.PORT || 3500;
const cors = require('cors');
const cookieparser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyMyJWT");
const mongoose = require ("mongoose");
const connectDB = require ("./config/db_connect")

connectDB();


const whitelist = [
    'https://www.thewebsitedomain.com',
    'http://devwebsite:portnumber',
    'http://localhost:3500',
    'https://claude.ai',
    'https://localhost:5173'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error(`CORS error: Origin ${origin} is not allowed.`));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());
app.use(express.static(path.join(__dirname, '/public')));


const registerUserRoute = require("./routes/registerUser");
const loginUserRoute = require("./routes/loginMyUser");

app.use("/register", registerUserRoute);  
app.use("/login", loginUserRoute);  

app.use('/employees', verifyJWT, require("./routes/api/employees"));
app.use("/refresh", require("./routes/refreshToken"));
app.use("/logout", require("./routes/logoutUser"));
app.use('/', require("./routes/root"));


mongoose.connection.once("open", () => {
    console.log("Connection to DB successful");
    app.listen(PORT, () => console.log(`The server is running on port http://localhost:${PORT}`));
})

