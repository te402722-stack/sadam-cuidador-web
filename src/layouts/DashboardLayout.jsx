import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {

  const location = useLocation();
  const navigate = useNavigate();

  const adulto = JSON.parse(localStorage.getItem("adultoSeleccionado"));
  const esRutaAdultos = location.pathname.includes("/dashboard/adultos");

  // ✅ REDIRECCIÓN CORRECTA
  useEffect(() => {
    if (!adulto && !esRutaAdultos) {
      navigate("/dashboard/adultos");
    }
  }, [adulto, esRutaAdultos, navigate]);

  // 🔴 evitar render mientras redirige
  if (!adulto && !esRutaAdultos) {
    return null;
  }

  return (
    <div className="flex min-h-screen">

      {/* Sidebar solo si hay adulto */}
      {adulto && <Sidebar />}

      <div className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </div>

    </div>
  );
}

export default DashboardLayout;
