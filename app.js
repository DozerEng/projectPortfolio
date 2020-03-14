const express = require("express");
const app = express();
const morgan = require("morgan"); //outputs REST requests to console
const bodyParser = require("body-parser"); //parses json
const mongoose = require("mongoose");//Database
 

const contentRoutes = require("./api/routes/content");
const devicesRoutes = require("./api/routes/devices");
const smartHomeRoutes = require("./api/routes/smartHome");
const otherProjectsRoutes = require("./api/routes/otherProjects");
const printsRoutes = require("./api/routes/prints");
const userRoutes = require("./api/routes/user");

mongoose.connect("mongodb+srv://BBBServer:" + process.env.MONGO_ATLAS_PW + "@bbbserver-fybr1.mongodb.net/test?retryWrites=true&w=majority", 
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    },
    function(err, client) {
        if (err) {
          console.log(err);
        } else {
            console.log('Connected to MongoDB');
        }
    }
);


//app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.use(morgan("dev")); //dev is output type, command line logging of HTTP words
app.use("/uploads", express.static('uploads')); //url now requires /uploads/filename rather than just /filename
app.use("/images", express.static('images')); //url now requires /images/filename rather than just /filename
app.use(bodyParser.urlencoded({extended: false})); //handling simple bodies
app.use(bodyParser.json());
app.use(express.static("public"));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");//handler for CORS errors, change "*" to restrict access 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authroization");//acceptable headers, should be adjusted 
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); 
        return res.status(200).json({});
    }
    next();
});

//Routes to be handled
app.use("/content", contentRoutes);
app.use("/devices", devicesRoutes);
app.use("/otherProjects", otherProjectsRoutes);
app.use("/prints", printsRoutes);
app.use("/smartHome", smartHomeRoutes);
app.use("/user", userRoutes);

//Hanlding errors that make it past routes
app.use((req, res, next) => {   
    const error = new Error("Not found"); //message for error
    error.status = 404; //404 handler
    next(error);
});

//Handling of all errors
app.use((error, req, res, next) => {
    res.status(error.status || 500); //sending the error code
    res.json({
        error: {
            message: error.message //sending the error message
        }
    });
});

module.exports = app;
