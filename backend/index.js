require("dotenv").config();
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const providersRoute = require ("./routes/providersRoute");
const clientsRoute = require ("./routes/clientsRoute");
const productsRoute = require ("./routes/productsRoute");
const categoriesRoute =require ("./routes/categoriesRoute")
const entrepotsRoute = require ("./routes/entrepotsRoute");
const commandeRoute =require("./routes/commandeRoute");
const commande_achatRoute = require("./routes/commande_achatRoute");
const commande_venteRoute =require("./routes/commande_venteRoute");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());



const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const pdfTemplate = require('./documents/index');


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
app.use('/categories',categoriesRoute);
app.use('/entrepots',entrepotsRoute);
app.use('/commandes',commandeRoute);
app.use('/commandes_achat',commande_achatRoute);
app.use('/commandes_vente',commande_venteRoute);
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));





app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
});

app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/result.pdf`)
})



