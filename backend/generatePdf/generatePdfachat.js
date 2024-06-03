const puppeteer = require('puppeteer');
const express = require("express");

const router = express.Router();

router.post('/', async (req, res) => {
  const { providerName, codeCommande, date, versement, modePaiement, codeCheque, observation_com, commandes } = req.body;

  // Fonction pour calculer le total de la commande principale
  const calculateTotalCommandePrincipale = () => {
    let totalCommandePrincipale = 0;
    commandes.forEach(item => {
      totalCommandePrincipale += parseFloat(item.totalLigne);
    });
    return totalCommandePrincipale.toFixed(2);
  };

  let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bon de Commande</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;800;900;&display=swap');

        body {
          font-family: 'Libre Franklin', sans-serif;
          background: #f9f9f9;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-bottom:0;
        }

        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .header img {
          max-width: 100px;
        }

        .header h1 {
          font-size: 2rem;
          color: #b31217;
          text-shadow: 0 4px 4px #a5a5a4, 0 5px 5px #a5a5a5;
        }

        .details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .details div {
          width: 48%;
        }

        .details p {
          margin: 5px 0;
        }

        .title {
          color: #b31217;
          font-size: 1.25rem;
          text-align: center;
          margin: 20px 0;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .items-table th,
        .items-table td {
          border: 1px solid #e5e7eb;
          padding: 8px; /* Reduced padding for smaller height */
          text-align: left;
        }

        .items-table th {
          background-color: #b31217;
          color: #fff;
          font-size: 1rem;
        }

        .items-table td {
          font-size: 0.875rem;
        }

        .items-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .items-table th,
        .items-table td {
          border: 1px solid #ddd;
        }

        .items-table th:hover,
        .items-table td:hover {
          border-color: #b31217;
        }

        .signatures {
          display: flex;
          flex-direction: column;
        }

        .signatures .titles {
          display: flex;
          justify-content: space-between;
        }

        .signatures .boxes {
          display: flex;
          justify-content: space-between;
        }

        .signature-section {
          width: 30%;
          text-align: center;
        }

        .signature-box {
          border: 2px solid #b31217;
          padding: 20px;
          border-radius: 8px;
          height: 50px; /* Reduced height */
          width: 80%; /* Reduced width */
        }

        .footer {
          font-size: 0.875rem;
          color: #525252;
          text-align: center;
          padding-top: 10px;
          border-top: 1px solid #e5e7eb;
          margin-top: 20px;
        }

        .text-right {
          text-align: right;
        }

        .text-center {
          text-align: center;
        }

        .font-bold {
          font-weight: 700;
        }

        .text-main {
          color: #b31217;
        }

        .text-neutral-600 {
          color: #525252;
        }

        .signature-box {
          height: 60px; /* Adjust height as needed */
        }

        .signature-section {
          display: inline-block;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div>
          <div class="header">
            <img src="https://elmouchir.caci.dz/assets/images/entreprise/1707902288.jpg" alt="Logo de l'entreprise" />
            <h1>Commande d'achat</h1>
          </div>

          <div class="details">
            <div>
              <p class="font-bold text-neutral-600">Fournisseur</p>
              <p class="text-neutral-600">${providerName}</p>
              <p class="font-bold text-neutral-600">Observation</p>
              <p class="text-neutral-600">${observation_com}</p>
             
            </div>
            <div>
           
            <p class="font-bold text-neutral-600">Mode de paiement</p>
            <p class="text-neutral-600">${modePaiement}</p>
            <p class="font-bold text-neutral-600">Code chèque</p>
            <p class="text-neutral-600">${codeCheque}</p>
           
          </div>
            <div>
              <p class="font-bold text-neutral-600 text-right">Date</p>
              <p class="text-right text-main">${date}</p>
              <p class="font-bold text-neutral-600 text-right">Code commande</p>
              <p class="text-right text-main">${codeCommande}</p>
             
            </div>
          </div>

          <div class="title">Détails des Produits</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Produits</th>
                <th class="text-center">Quantités</th>
                <th class="text-center">Prix unitaire</th>
                <th class="text-center">Total ligne</th>
              </tr>
            </thead>
            <tbody>
              ${commandes.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.product_name}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-center">${item.prixUnitaire} DA</td>
                  <td class="text-center">${item.totalLigne} DA</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="text-right">
          <p class="font-bold text-neutral-600">Versement: ${versement}</p>
       
            <p class="font-bold">Net total: ${calculateTotalCommandePrincipale()} DA</p>
          </div>
        </div>

        <div class="signatures">
          <div class="titles">
            <div class="signature-section">
              <p class="font-bold">Signature de demandeur</p>
            </div>
            <div class="signature-section">
              <p class="font-bold">Visa du responsable hiérarchique</p>
            </div>
            <div class="signature-section">
              <p class="font-bold">Visa du service technique</p>
            </div>
          </div>
          <div class="boxes">
            <div class="signature-section">
              <div class="signature-box"></div>
            </div>
            <div class="signature-section">
              <div class="signature-box"></div>
            </div>
            <div class="signature-section">
              <div class="signature-box"></div>
            </div>
          </div>
        </div>

        <footer class="footer">
          <p>Fournisseur | Sarl Art Groupe | +1-202-555-0106</p>
          <p>Bureau Dellys: Résidence Jolie Vue Oued Taza - Dellys, Tel: +213 (0) 560 92 46 58</p>
          <p>Bureau Boumerdès: Cité 11 Décembre 1960 Bloc C Apt 39 Deriche - Boumerdès, Tel: +213 (0) 24 75 00 88, +213 (0) 561 78 83 87</p>
          <p>Email: sarlartpromotion-dellys@gmail.com</p>
        </footer>
      </div>
    </body>
    </html>`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;