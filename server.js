const express = require('express')
const dbConnect = require('./database/index');
const {PORT} = require('./config/index');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
// app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ limit: '100mb' , extended: true }));

app.use('/uploads', express.static('uploads/'));

// Import all routes
app.use(routes);

app.use(errorHandler);


// Connect to Database
dbConnect();


// Server is running at port 5000
app.listen(PORT,console.log(`Server is Started at Port : 5000`));


