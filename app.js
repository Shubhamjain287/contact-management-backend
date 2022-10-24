const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require("cors");

dotenv.config({path:'./config.env'});
require('./server/database/connection');

const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 2800;

// Accepting Request From all Route
app.use(cors());

app.use(cookieParser());

// Converting RAW JSON Data to Normal Data USing Middleware
app.use(express.json());

//We Link the router file to make our route easy
const routes = require('./Server/routes/routes');
app.use(routes);

app.listen(PORT , () => {
    console.log(`Server is Running at Port : ${PORT}`);
});