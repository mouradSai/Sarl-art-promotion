import { Route, Routes, Navigate } from "react-router-dom";

//components imports 
import Stock from "./components/Main/index";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Landpage from "./components/landpage/Home";




//pages imports 
import Product from "./pages/Products/product";
import Customer from"./pages/customers/customer";
import Provider from "./pages/provider/provider";
{/*import Buy from "./pages/buy/buy";
import Sell from "./pages/sell/sell";
import Historiqueachat from "./pages/Historique/historiqueAchat/historiqueachat";
import Historiquevente from "./pages/Historique/historiquevente/historiquevente";*/}
import Historique from "./pages/Historique/historique"
import Categorie from "./pages/categorie/categorie";
import Entrepot from "./pages/entrepots/entrepot";
import Orderpage from "./pages/orderPage/orderpage";
import Orderbuypage from "./pages/orderbuyPage/orderbuypage";
import Users from "./pages/users/users";
import Ordersellpage from "./pages/ordersellPage/ordersellpage";

//Historique_commande
import Historique_commande from "./pages/Historique/historique_commande/historique_commande"; 
import Historique_commande_achat from "./pages/Historique/historique-commande_achat/historique_commande_achat";
import Historique_commande_vente from "./pages/Historique/historique_commande_vente/historique_commande_vente";


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
		<Route path="/signup" element={<Signup />} />
		<Route path="/login" element={<Login />} />
	  </Routes>
	);
}

export default App;