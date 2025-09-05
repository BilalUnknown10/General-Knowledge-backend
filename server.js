require('dotenv').config();
const express = require('express');
const cors = require("cors");
const app = express();
const userRoutes = require('./routes/User_routes');
const adminRoutes = require('./Routes/Admin_routes')
const dataBaseConnection = require('./db_Connection/conn');
const PORT = process.env.PORT;


// middlewares setup
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
    origin : process.env.FRONTEND_URI,
    methods : ["POST","GET","PATCH","DELETE"],
    credentials : true
}));


// database connection
dataBaseConnection();

// Routing setup
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.use('/',(req, res) => {
    res.send("Hello This from gk server");
});



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});
