require("dotenv").config();
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const Provider = require ("./models/provider");
const providersRoute = require ("./routes/providersRoute");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req)
    return res.status(234).send('bonjour ')
});

app.use('/providers', providersRoute);
// database connection
connection();

// middlewares
app.use(cors());


// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));

