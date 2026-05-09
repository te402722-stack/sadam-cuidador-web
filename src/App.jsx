import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Adultos from "./pages/Adultos";
import Recordatorios from "./pages/Recordatorios";
import Sintomas from "./pages/Sintomas";
import Historial from "./pages/Historial";
import Alertas from "./pages/Alertas";
import Calendario from "./pages/Calendario";
import DetalleAdulto from "./pages/DetalleAdulto";
import RegistroCuidador from "./pages/RegistroCuidador";


import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registro-cuidador" element={<RegistroCuidador />} />

        {/* layout del panel */}
        <Route path="/dashboard" element={<DashboardLayout />}>
<Route path="inicio/:id" element={<Dashboard />} />
  <Route
  index
  element={
    JSON.parse(localStorage.getItem("adultoSeleccionado"))
      ? (
        <Navigate
          to={`/dashboard/inicio/${
            JSON.parse(localStorage.getItem("adultoSeleccionado")).id_adulto
          }`}
        />
      )
      : <Navigate to="/dashboard/adultos" />
  }
/>

          <Route path="adultos" element={<Adultos />} />
          <Route path="recordatorios" element={<Recordatorios />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="sintomas" element={<Sintomas />} />
          <Route path="historial" element={<Historial />} />
          <Route path="alertas" element={<Alertas />} />
          <Route path="adulto/:id" element={<DetalleAdulto />} />
          

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;