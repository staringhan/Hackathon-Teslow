import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import "./components/navbar.css";
import Accueil from "./pages/accueil.jsx";
import Classement from "./pages/classement.jsx";
import Reserver from "./pages/reserver.jsx";
import Parties from "./pages/parties.jsx";
import Utilisateurs from "./pages/utilisateurs.jsx";
import EnCours from "./pages/encours.jsx";
import PrivateUserRoute from "./auth/privateRouteUser.js";
import PrivateAdminRoute from "./auth/privateRouteAdmin.js";


function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/classement" element={<Classement />} />
        <Route path="/encours" element={<PrivateUserRoute><EnCours /></PrivateUserRoute>} />
        <Route path="/reserver" element={<PrivateUserRoute><Reserver /></PrivateUserRoute>} />
        <Route path="/parties" element={<PrivateAdminRoute><Parties /></PrivateAdminRoute>} />
        <Route path="/utilisateurs" element={<PrivateAdminRoute><Utilisateurs /></PrivateAdminRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;
