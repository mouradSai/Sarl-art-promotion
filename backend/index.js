require("dotenv").config();
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const providersRoute = require ("./routes/providersRoute");
const clientsRoute = require ("./routes/clientsRoute");
const productsRoute = require ("./routes/productsRoute");
const ordersRoute =require ("./routes/ordersRoute");
const orderssellRoute=require("./routes/orderssellRoute");
const categoriesRoute =require ("./routes/categoriesRoute")

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    console.log(req)
    return res.status(234).send('bonjour ')
});

// database connection
connection();

// middlewares
app.use(cors({
    origin:'http://localhost:3000',
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type'],
}));


// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/providers', providersRoute);
app.use('/clients', clientsRoute);
app.use('/products', productsRoute);
app.use('/orders',ordersRoute);
app.use('/sells',orderssellRoute);
app.use('/categories',categoriesRoute);


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));


