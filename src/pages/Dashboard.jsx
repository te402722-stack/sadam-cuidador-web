import { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaHeartbeat,
  FaSmile,
  FaExclamationTriangle,
  FaUserCircle,
  FaCheckCircle
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

  const cargarDatos = async () => {
    try {
      const adultoLS = JSON.parse(localStorage.getItem("adultoSeleccionado")) || JSON.parse(localStorage.getItem("adulto"));
      const cuidadorLS = JSON.parse(localStorage.getItem("cuidador"));

      setAdulto(adultoLS);
      if (adultoLS) localStorage.setItem("adulto", JSON.stringify(adultoLS));
      setCuidador(cuidadorLS);

      if (!adultoLS) return;
      if (adultoLS.id_adulto) localStorage.setItem("id_adulto", adultoLS.id_adulto);

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

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const totalActividades = actividades.length;
  const completadas = actividades.filter(a => a.realizada).length;
  const progreso = totalActividades > 0 ? Math.round((completadas / totalActividades) * 100) : 0;
  const recordatoriosPendientes = recordatoriosHoy.filter(r => r.estado !== "Completado");
  const hayAlerta = recordatoriosPendientes.length > 0;

  if (!adulto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm border border-slate-100">
          <FaUserCircle className="text-6xl text-slate-200 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-6">No hay un adulto seleccionado</p>
          <button
            onClick={() => navigate("/dashboard/adultos")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Seleccionar adulto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Hola, <span className="text-indigo-600">{cuidador?.nombre || "Cuidador"}</span> 👋
            </h1>
            <p className="text-slate-500 font-medium">Bienvenido a tu panel de cuidado profesional</p>
          </div>
          <button 
            onClick={() => navigate("/dashboard/calendario")}
            className="bg-white text-slate-600 px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <FaCalendarAlt className="text-indigo-500" /> Calendario General
          </button>
        </div>

        {/* ALERTA */}
        {hayAlerta && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-[2rem] p-5 mb-8 flex items-center gap-4 animate-pulse-subtle shadow-sm">
            <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-200">
              <FaExclamationTriangle size={20} />
            </div>
            <div>
              <p className="font-black text-lg">Atención</p>
              <p className="text-sm font-medium opacity-80 italic">
                Hay {recordatoriosPendientes.length} recordatorio(s) pendientes por atender.
              </p>
            </div>
          </div>
        )}

        {/* SECCIÓN PRINCIPAL: ADULTO & PROGRESO (Lado a lado en PC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2.5rem] shadow-xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-1">Paciente</p>
              <h2 className="text-4xl font-black">{adulto.nombre}</h2>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> MONITOREO ACTIVO
              </div>
            </div>
            <FaUserCircle className="absolute -right-4 -bottom-4 text-white/10 text-9xl group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-black text-slate-700 uppercase text-xs tracking-wider">Actividades de hoy</h3>
              <span className="text-indigo-600 font-black text-xl">{progreso}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-1000 shadow-inner"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" /> {completadas} de {totalActividades} completadas
            </p>
          </div>
        </div>

        {/* GRID DE BOTONES / INFO RÁPIDA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setMostrarRecordatorios(!mostrarRecordatorios)}
            className={`p-6 rounded-[2rem] transition-all text-left border ${
              mostrarRecordatorios ? "bg-indigo-600 text-white shadow-indigo-200 shadow-xl" : "bg-white text-slate-700 border-slate-100 shadow-sm hover:shadow-md"
            }`}
          >
            <FaBell className={`text-2xl mb-4 ${mostrarRecordatorios ? "text-white" : "text-indigo-500"}`} />
            <p className="font-black text-sm uppercase tracking-tight">Recordatorios</p>
            <p className={`text-[10px] font-bold ${mostrarRecordatorios ? "text-indigo-100" : "text-slate-400"}`}>
              {recordatoriosHoy.length} PROGRAMADOS
            </p>
          </button>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <FaSmile className="text-amber-400 text-2xl mb-4" />
            <p className="font-black text-sm uppercase tracking-tight text-slate-700">Ánimo</p>
            <p className="font-bold text-slate-500 text-sm mt-1">{estadoAnimo}</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 col-span-2 md:col-span-2">
            <FaHeartbeat className="text-rose-500 text-2xl mb-4" />
            <p className="font-black text-sm uppercase tracking-tight text-slate-700">Síntomas</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {sintomas.length === 0 ? (
                <p className="text-xs font-bold text-slate-400 italic underline decoration-slate-200">Todo normal</p>
              ) : (
                sintomas.map((s, i) => (
                  <span key={i} className="text-[10px] bg-rose-50 text-rose-600 px-2 py-1 rounded-lg font-black border border-rose-100">
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* DETALLE RECORDATORIOS (Si se activa) */}
        {mostrarRecordatorios && (
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-8 border border-indigo-50 animate-fade-in">
            <h3 className="font-black text-slate-800 mb-6 text-xl">Detalle de Recordatorios</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase tracking-widest text-left">
                    <th className="pb-4">Actividad</th>
                    <th className="pb-4">Hora</th>
                    <th className="pb-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recordatoriosHoy.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="py-4 font-bold text-slate-700">{r.titulo}</td>
                      <td className="py-4 font-bold text-indigo-500 text-sm">{r.hora}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          r.estado === "Completado" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {r.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTIVIDADES & INFO ADULTO (En dos columnas en Web) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
              <FaCheckCircle className="text-indigo-500" /> Registro de Actividades
            </h3>
            <div className="space-y-4">
              {actividades.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <p className="font-bold text-slate-700">{a.nombre}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                      {a.hora || "--:--"}
                    </span>
                    <span className={`text-[10px] font-black uppercase ${a.realizada ? "text-emerald-500" : "text-slate-300"}`}>
                      {a.realizada ? "COMPLETADO" : "PENDIENTE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 h-fit">
            <h3 className="font-black text-slate-800 mb-6">Info del Paciente</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-indigo-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Nombre Completo</p>
                <p className="font-bold text-slate-700">{adulto.nombre}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Identificador</p>
                <p className="font-bold text-slate-700 text-sm"># {adulto.id_adulto}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;