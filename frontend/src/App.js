import { Route, Routes, Navigate } from "react-router-dom";

//components imports 
import Stock from "./components/Main/index";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Landpage from "./components/landpage/Home";




//pages imports stock
import Product from "./pages/Products/product";
import Customer from"./pages/customers/customer";
import Provider from "./pages/provider/provider";
import Historique from "./pages/Historique/historique"
import Categorie from "./pages/categorie/categorie";
import Entrepot from "./pages/entrepots/entrepot";
import Orderpage from "./pages/orderPage/orderpage";
import Orderbuypage from "./pages/orderbuyPage/orderbuypage";
import Users from "./pages/users/users";
import Ordersellpage from "./pages/ordersellPage/ordersellpage";



//pages credit de achat 
import Credit_achat from "./pages/credit/credit_achat/credit_achat";
import Credit_vente from "./pages/credit/credit_vente/credit_vente"
import Credit from "./pages/credit/credit"
//Historique_commande stock
import Historique_commande from "./pages/Historique/historique_commande/historique_commande"; 
import Historique_commande_achat from "./pages/Historique/historique-commande_achat/historique_commande_achat";
import Historique_commande_vente from "./pages/Historique/historique_commande_vente/historique_commande_vente";
import Historique_creditachat from "./pages/Historique/historique_credit/historique_creditachat";
import Historique_creditvente from "./pages/Historique/historique_credit/historique_creditvente";

//Import pages production 
import Production_beton from "./pages/production/production_beton";
import Bon_production_beton from "./pages/production/bon_production_beton";

//protection de routes 
import ProtectedRoute from "./components/protection/ProtectedRoute";

function App() {
	
	const user = localStorage.getItem("token");

	return (
		<Routes>
		{/* Utilisation d'un ternaire pour déterminer si on affiche la page ou redirige vers login */}
		<Route path="/" element={user ? <ProtectedRoute><Landpage/></ProtectedRoute> : <Navigate replace to="/login" />} />
  
		{/* Routes qui nécessitent la protection */}
			<Route path="/provider" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Provider />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/customer" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Customer />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/product" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Product />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/historique" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Historique />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/categorie" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Categorie />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/entrepot" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Entrepot />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/orderpage" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Orderpage />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/orderbuypage" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Orderbuypage />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/ordersellpage" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Ordersellpage />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/historique_commande" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Historique_commande />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/historique_commande_achat" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Historique_commande_achat />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
			<Route path="/historique_commande_vente" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Historique_commande_vente />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>

            <Route path="/historique_creditachat" element={
    localStorage.getItem("token") && (localStorage.getItem("role") === "superadmin" || localStorage.getItem("role") === "admin") ? (
        <ProtectedRoute>
            <Historique_creditachat />
        </ProtectedRoute>
    ) : (
        <Navigate replace to="/login" />
    )
			}/>
            {/* Ajoutez la vérification du rôle pour l'accès à la route stock */}
		    <Route path="/stock" element={
		             localStorage.getItem("token") && localStorage.getItem("role") === "superadmin" ||localStorage.getItem("role") === "admin"  ? (

						<ProtectedRoute>
							<Stock />
						</ProtectedRoute> ) : (
                        <Navigate replace to="/login" />
                    )
                }
			  />

                {/* Ajoutez la vérification du rôle pour l'accès à la route credit_achat */}
		    <Route path="/credit_achat" element={
		             localStorage.getItem("token") && localStorage.getItem("role") === "superadmin" ||localStorage.getItem("role") === "admin"  ? (

						<ProtectedRoute>
							<Credit_achat />
						</ProtectedRoute> ) : (
                        <Navigate replace to="/login" />
                    )
                }
			  />
               <Route path="/historique_creditvente" element={
		             localStorage.getItem("token") && localStorage.getItem("role") === "superadmin" ||localStorage.getItem("role") === "admin"  ? (

						<ProtectedRoute>
							<Historique_creditvente />
						</ProtectedRoute> ) : (
                        <Navigate replace to="/login" />
                    )
                }
			  />
                 {/* Ajoutez la vérification du rôle pour l'accès à la route credit_vente */}
		    <Route path="/credit_vente" element={
		             localStorage.getItem("token") && localStorage.getItem("role") === "superadmin" ||localStorage.getItem("role") === "admin"  ? (

						<ProtectedRoute>
							<Credit_vente />
						</ProtectedRoute> ) : (
                        <Navigate replace to="/login" />
                    )
                }
			  />

            <Route path="/credit" element={
		             localStorage.getItem("token") && localStorage.getItem("role") === "superadmin" ||localStorage.getItem("role") === "admin"  ? (

						<ProtectedRoute>
							<Credit />
						</ProtectedRoute> ) : (
                        <Navigate replace to="/login" />
                    )
                }
			  />



            {/* Ajoutez la vérification du rôle pour l'accès à la route Users */}
            <Route path="/users" element={
                    localStorage.getItem("token") && localStorage.getItem("role") === "superadmin"  ? (
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    ) : (
                        <Navigate replace to="/login" />
                    )
                }
            />  
		{/* Routes sans protection */}
		<Route path="/production_beton" element={
                    localStorage.getItem("token")    ? (
                        <ProtectedRoute>
                            <Production_beton />
                        </ProtectedRoute>
                    ) : (
                        <Navigate replace to="/login" />
                    )
                }
            />  

            <Route path="/bon_production_beton" element={
                    localStorage.getItem("token")    ? (
                        <ProtectedRoute>
                            <Bon_production_beton />
                        </ProtectedRoute>
                    ) : (
                        <Navigate replace to="/login" />
                    )
                }
            />  


		<Route path="/signup" element={<Signup />} />
		<Route path="/login" element={<Login />} />
	  </Routes>
	);
}

export default App;