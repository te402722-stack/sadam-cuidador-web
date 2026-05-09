import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBell,
  FaClipboardList,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {

  const navigate = useNavigate();

  const adulto = JSON.parse(localStorage.getItem("adultoSeleccionado"));

  return (

    <div className="w-64 bg-blue-600 text-white min-h-screen p-6 flex flex-col justify-between">

      <div>

        {/* LOGO */}
        <h1 className="text-2xl font-bold mb-8">
          SADAM
        </h1>

        {/* 👤 ADULTO ACTIVO */}
        {adulto && (
          <div className="bg-blue-500 p-3 rounded-xl mb-8">
            <p className="text-xs text-blue-100">
              Adulto seleccionado
            </p>
            <p className="font-semibold">
              {adulto.nombre}
            </p>
          </div>
        )}

        {/* NAV */}
        <nav className="space-y-5">

          <NavLink
            to={`/dashboard/inicio/${adulto?.id_adulto}`}
            className="flex items-center gap-3 hover:opacity-80"
          >
            <FaHome />
            Inicio
          </NavLink>

          <NavLink
            to="/dashboard/recordatorios"
            className="flex items-center gap-3 hover:opacity-80"
          >
            <FaBell />
            Recordatorios
          </NavLink>

          <NavLink
            to="/dashboard/historial"
            className="flex items-center gap-3 hover:opacity-80"
          >
            <FaClipboardList />
            Historial
          </NavLink>

          <NavLink
  to={`/dashboard/adulto/${adulto?.id_adulto}`}
  className="flex items-center gap-3 hover:opacity-80"
>
  <FaUser />
  Información
</NavLink>

        </nav>

      </div>

      {/* 🔻 ACCIONES */}
      <div className="space-y-4">

        {/* CAMBIAR ADULTO */}
        <button
          onClick={() => {
            localStorage.removeItem("adultoSeleccionado");
            navigate("/dashboard/adultos");
          }}
          className="flex items-center gap-3 text-sm text-blue-100 hover:text-white"
        >
          <FaUser />
          Cambiar adulto
        </button>

        {/* OPCIONAL: cerrar sesión */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center gap-3 text-sm text-blue-100 hover:text-white"
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>

      </div>

    </div>

  );

}

export default Sidebar;
