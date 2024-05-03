require("dotenv").config();
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const providersRoute = require ("./routes/providersRoute");
const clientsRoute = require ("./routes/clientsRoute");
const productsRoute = require ("./routes/productsRoute");
const categoriesRoute =require ("./routes/categoriesRoute");
const entrepotsRoute = require ("./routes/entrepotsRoute");
const commandeRoute =require("./routes/commandeRoute");
const commande_achatRoute = require("./routes/commande_achatRoute");
const commande_venteRoute =require("./routes/commande_venteRoute");

//les dossier de generate pdfs 
const generatePdfcommande = require ("./generatePdf/generatePdfcommande");
const generatePdfachat = require ("./generatePdf/generatePdfachat");
const generatePdfvente = require ("./generatePdf/generatePdfvente");

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
app.use('/categories',categoriesRoute);
app.use('/entrepots',entrepotsRoute);
app.use('/commandes',commandeRoute);
app.use('/commandes_achat',commande_achatRoute);
app.use('/commandes_vente',commande_venteRoute);
app.use ('/generatePdfcommande',generatePdfcommande);
app.use ('/generatePdfachat',generatePdfachat);
app.use ('/generatePdfvente',generatePdfvente);




const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));






