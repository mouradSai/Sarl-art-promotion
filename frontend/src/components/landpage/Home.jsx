
import React from 'react';
import beton from './assets/beton.jpeg';
import stock from './assets/stock.png';
import logo from './assets/logo-white.png';

import "./landpage.css";

const Home = () => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.4.0/fonts/remixicon.css"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="landpage.css" />
      <title>Web Design Mastery | Explore Destinations</title>
    </head>
    <body>
    <div class="body">
      <div class="containerr">

        <div class="destination__containerr">
        
          <div class="content">
        
                    <h1>Sarl Art <span> Promotion</span></h1>
                 <img class="logo-text" src="${logo}" alt="logo" />

             </div>
          <div class="destination__grid">

          <a href="/stock" class="destination__card">
              <img src="${stock}" alt="ART Promotion" />
              <div class="card__content">
                <h4>Gestion de stock</h4>
              </div>
           </a>

            <a href="/" class="destination__card">
              <img src="${beton}" alt="destination" />
              <div class="card__content">
                <h4>Gestion de production</h4>
            </div>
            </a>

          </div>
        </div>
      </div>
    </div>
    </body>
  </html>
        

  `;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};


export default Home