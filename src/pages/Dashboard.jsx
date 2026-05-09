import { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaHeartbeat,
  FaSmile,
  FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

  const [adulto, setAdulto] = useState(null);
  const [cuidador, setCuidador] = useState(null);

  const [recordatoriosHoy, setRecordatoriosHoy] = useState([]);
  const [sintomas, setSintomas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [estadoAnimo, setEstadoAnimo] = useState("Sin registro");

  const [mostrarRecordatorios, setMostrarRecordatorios] = useState(false);

  const navigate = useNavigate();

  /* =========================
     FUNCION CARGAR DATOS
  ========================= */

  const cargarDatos = async () => {
  try {
    const adultoLS = JSON.parse(localStorage.getItem("adultoSeleccionado")) || JSON.parse(localStorage.getItem("adulto"));
    const cuidadorLS = JSON.parse(localStorage.getItem("cuidador"));

    setAdulto(adultoLS);
    if (adultoLS) localStorage.setItem("adulto", JSON.stringify(adultoLS));
    setCuidador(cuidadorLS);

    if (!adultoLS) return;

    if (adultoLS.id_adulto) {
      localStorage.setItem("id_adulto", adultoLS.id_adulto);
    }

    // Cambio de fetch a api.get
    const res = await api.get(`/dashboard-datos/${adultoLS.id_adulto}`);
    const data = res.data;

    if (data.recordatorios) setRecordatoriosHoy(data.recordatorios);
    if (data.sintomas) setSintomas(data.sintomas.map(s => s.sintoma));
    if (data.actividades) setActividades(data.actividades);
    if (data.estado_animo) setEstadoAnimo(data.estado_animo);

  } catch (error) {
    console.error("Error cargando datos:", error);
  }
};

  /* =========================
     CARGA INICIAL + REFRESH
  ========================= */

  useEffect(() => {

    cargarDatos();

    const intervalo = setInterval(() => {
      cargarDatos();
    }, 30000);

    return () => clearInterval(intervalo);

  }, []);

  /* =========================
     PROGRESO ACTIVIDADES
  ========================= */

  const totalActividades = actividades.length;

  const completadas = actividades.filter(a => a.realizada).length;

  const progreso =
    totalActividades > 0
      ? Math.round((completadas / totalActividades) * 100)
      : 0;

  /* =========================
     ALERTAS
  ========================= */

  const recordatoriosPendientes =
    recordatoriosHoy.filter(r => r.estado !== "Completado");

  const hayAlerta = recordatoriosPendientes.length > 0;

  if (!adulto) {
  return (
    <div className="p-6 text-center">
      <p className="text-gray-500 mb-4">
        No hay un adulto seleccionado
      </p>

      <button
        onClick={() => navigate("/dashboard/adultos")}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Seleccionar adulto
      </button>
    </div>
  );
}

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#eef5ff] to-[#f4f9f4] p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Hola {cuidador?.nombre || "Cuidador"} 👋
        </h1>

        <p className="text-gray-500">
          Bienvenido a tu panel de cuidado
        </p>

      </div>

      {/* ALERTA */}
      {hayAlerta && (

        <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 mb-6 flex items-center gap-3">

          <FaExclamationTriangle className="text-red-500 text-xl"/>

          <div>

            <p className="font-semibold">
              Atención
            </p>

            <p className="text-sm">
              Hay {recordatoriosPendientes.length} recordatorio(s) pendientes
            </p>

          </div>

        </div>

      )}

      {/* ADULTO */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

        <p className="text-gray-500 text-sm">
          Gracias por estar pendiente de
        </p>

        <h2 className="text-2xl font-bold text-indigo-600 mt-1">
          {adulto.nombre}
        </h2>

      </div>

      {/* PROGRESO */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">

        <h3 className="font-semibold text-gray-700 mb-3">
          Actividades realizadas hoy
        </h3>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progreso}%` }}
          />

        </div>

        <p className="text-sm text-gray-500 mt-2">
          {completadas} de {totalActividades} actividades realizadas
        </p>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">

        {/* RECORDATORIOS */}
        <div
          onClick={() => setMostrarRecordatorios(!mostrarRecordatorios)}
          className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg transition"
        >

          <FaBell className="text-indigo-500 text-2xl mb-3"/>

          <p className="font-semibold text-gray-700">
            Recordatorios de hoy
          </p>

          <p className="text-xs text-gray-400">
            {recordatoriosHoy.length} recordatorios
          </p>

        </div>

        {/* CALENDARIO */}
        <div
          onClick={() => navigate("/dashboard/calendario")}
          className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg transition"
        >

          <FaCalendarAlt className="text-indigo-500 text-2xl mb-3"/>

          <p className="font-semibold text-gray-700">
            Calendario
          </p>

          <p className="text-xs text-gray-400">
            Ver todos los recordatorios
          </p>

        </div>

        {/* ESTADO ANIMO */}
        <div className="bg-white rounded-2xl shadow-md p-5">

          <FaSmile className="text-yellow-400 text-2xl mb-3"/>

          <p className="font-semibold text-gray-700">
            Estado de ánimo
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {estadoAnimo}
          </p>

        </div>

        {/* SINTOMAS */}
        <div className="bg-white rounded-2xl shadow-md p-5">

          <FaHeartbeat className="text-red-400 text-2xl mb-3"/>

          <p className="font-semibold text-gray-700">
            Síntomas
          </p>

          {sintomas.length === 0 && (
            <p className="text-xs text-gray-400">
              Sin síntomas registrados
            </p>
          )}

          {sintomas.map((s,i)=>(
            <p key={i} className="text-xs text-gray-500">
              • {s}
            </p>
          ))}

        </div>

      </div>

      {/* DETALLE RECORDATORIOS */}
{mostrarRecordatorios && (
  <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
    <h3 className="font-semibold text-gray-700 mb-4">
      Recordatorios de hoy
    </h3>

    {recordatoriosHoy.length === 0 && (
      <p className="text-gray-400 text-sm">
        No hay recordatorios hoy
      </p>
    )}

    {recordatoriosHoy.length > 0 && (
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-left">
            <th>Recordatorio</th>
            <th>Hora</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>

          {recordatoriosHoy.map((r, i) => {
            const estado = r.estado;

            // Colores según estado
            let colorEstado = "text-gray-400";
            if (estado === "Completado") colorEstado = "text-green-500";
            if (estado === "Retrasado") colorEstado = "text-red-500";
            if (estado === "Pendiente") colorEstado = "text-yellow-500";

            return (
              <tr key={i} className="border-t">
                <td className="py-2">{r.titulo}</td>
                <td className="py-2">{r.hora}</td>
                <td className={`py-2 font-semibold ${colorEstado}`}>
                  {estado}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
)}

      {/* ACTIVIDADES */}
      <div className="bg-white rounded-3xl shadow-md p-6 mt-6">

        <h3 className="font-semibold text-gray-700 mb-4">
          Registro de actividades
        </h3>

        {actividades.length === 0 && (
          <p className="text-gray-400 text-sm">
            No hay actividades registradas
          </p>
        )}

        {actividades.length > 0 && (

          <table className="w-full text-sm">

            <thead>
              <tr className="text-gray-500 text-left">
                <th>Actividad</th>
                <th>Estado</th>
                <th>Hora</th>
              </tr>
            </thead>

            <tbody>

              {actividades.map((a,i)=>(

                <tr key={i} className="border-t">

                  <td className="py-2">{a.nombre}</td>

                  <td className={`py-2 font-semibold
                    ${a.realizada ? "text-green-500" : "text-gray-400"}
                  `}>
                    {a.realizada ? "Realizada" : "No registrada"}
                  </td>

                  <td className="py-2">
                    {a.hora || "-"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* INFO ADULTO */}
      <div className="bg-white rounded-3xl shadow-md p-6 mt-6">

        <h3 className="font-semibold text-gray-700 mb-3">
          Información del adulto
        </h3>

        <p className="text-sm text-gray-600">
          <strong>Nombre:</strong> {adulto.nombre}
        </p>

        <p className="text-sm text-gray-600">
          <strong>ID:</strong> {adulto.id_adulto}
        </p>

      </div>

    </div>

  );

}

export default Dashboard;