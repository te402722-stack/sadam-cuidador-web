import { useEffect, useState } from "react";
import {
  FaBell, FaCalendarAlt, FaHeartbeat, FaSmile,
  FaExclamationTriangle, FaCheckCircle, FaUserCircle,
  FaClock, FaChevronRight, FaInfoCircle
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
  
  const navigate = useNavigate();

  const cargarDatos = async () => {
    try {
      const adultoLS = JSON.parse(localStorage.getItem("adultoSeleccionado")) || JSON.parse(localStorage.getItem("adulto"));
      const cuidadorLS = JSON.parse(localStorage.getItem("cuidador"));
      setAdulto(adultoLS);
      setCuidador(cuidadorLS);

      if (!adultoLS) return;
      const res = await api.get(`/dashboard-datos/${adultoLS.id_adulto}`);
      const data = res.data;
      setRecordatoriosHoy(data.recordatorios || []);
      setSintomas(data.sintomas?.map(s => s.sintoma) || []);
      setActividades(data.actividades || []);
      setEstadoAnimo(data.estado_animo || "Sin registro");
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
  const pendientes = recordatoriosHoy.filter(r => r.estado !== "Completado");

  if (!adulto) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg">
          <FaUserCircle className="text-8xl text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No hay paciente seleccionado</h2>
          <p className="text-slate-500 mb-8">Para comenzar a gestionar los cuidados, primero debes elegir a un adulto mayor de tu lista.</p>
          <button onClick={() => navigate("/dashboard/adultos")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg">
            Ir a Selección de Adultos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* HEADER WEB */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Bienvenido, <span className="text-indigo-600">{cuidador?.nombre}</span>
            </h1>
            <p className="text-slate-500 font-medium">Panel de control de salud y cuidados</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/dashboard/calendario")} className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
              <FaCalendarAlt /> Agenda Completa
            </button>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-indigo-600 shadow-sm relative">
              <FaBell />
              {pendientes.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 w-4 h-4 rounded-full border-2 border-white"></span>}
            </div>
          </div>
        </header>

        {/* TOP ROW: ALERTA & RESUMEN PACIENTE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card Paciente */}
          <div className="lg:col-span-2 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
            <div className="relative z-10 text-center md:text-left">
              <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">Paciente Actual</span>
              <h2 className="text-4xl font-black mt-2">{adulto.nombre}</h2>
              <div className="flex gap-4 mt-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                  <FaInfoCircle /> <span className="text-sm font-medium">ID: {adulto.id_adulto}</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-400/20 px-4 py-2 rounded-xl backdrop-blur-md border border-emerald-400/30">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-emerald-100">Estado: Estable</span>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-6 md:mt-0">
              <div className="bg-white/10 p-6 rounded-[2rem] backdrop-blur-xl border border-white/20 text-center">
                <p className="text-xs font-bold uppercase opacity-70 mb-1">Progreso Diario</p>
                <div className="text-3xl font-black">{progreso}%</div>
                <div className="w-32 bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-white h-full" style={{ width: `${progreso}%` }}></div>
                </div>
              </div>
            </div>
            {/* Círculo decorativo */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full"></div>
          </div>

          {/* Card Alerta Rapida */}
          <div className={`${pendientes.length > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100'} border rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center shadow-sm`}>
            {pendientes.length > 0 ? (
              <>
                <div className="bg-rose-500 p-4 rounded-2xl shadow-lg shadow-rose-200 mb-4 animate-bounce-subtle text-white">
                  <FaExclamationTriangle size={24} />
                </div>
                <h3 className="text-rose-900 font-bold text-lg">Tareas Pendientes</h3>
                <p className="text-rose-600 text-sm mt-1">Hay {pendientes.length} recordatorios esperando acción inmediata.</p>
              </>
            ) : (
              <>
                <div className="bg-emerald-100 p-4 rounded-2xl mb-4 text-emerald-600">
                  <FaCheckCircle size={24} />
                </div>
                <h3 className="text-slate-800 font-bold text-lg">Todo al día</h3>
                <p className="text-slate-500 text-sm mt-1">No hay alertas críticas en este momento.</p>
              </>
            )}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* COLUMNA IZQUIERDA: STATUS RAPIDO (1/4) */}
          <div className="xl:col-span-1 space-y-6">
            <StatusCard icon={<FaSmile className="text-amber-400" />} title="Ánimo" value={estadoAnimo} color="bg-amber-50" />
            <StatusCard icon={<FaHeartbeat className="text-rose-500" />} title="Último Síntoma" value={sintomas.length > 0 ? sintomas[0] : "Sin reportes"} color="bg-rose-50" />
            
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaClock className="text-indigo-500" /> Historial Reciente
              </h3>
              <div className="space-y-4">
                {sintomas.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5"></div>
                    <p className="text-sm text-slate-600">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA CENTRAL: TABLAS DE GESTION (3/4) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Recordatorios Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Planificación de Hoy</h3>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
                  {recordatoriosHoy.length} Eventos
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50">
                      <th className="pb-4 font-bold">Actividad / Medicamento</th>
                      <th className="pb-4 font-bold text-center">Hora</th>
                      <th className="pb-4 font-bold text-center">Estado</th>
                      <th className="pb-4 font-bold text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recordatoriosHoy.length === 0 ? (
                      <tr><td colSpan="4" className="py-10 text-center text-slate-400 italic">No hay recordatorios registrados para hoy</td></tr>
                    ) : (
                      recordatoriosHoy.map((r, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-bold text-slate-700">{r.titulo}</td>
                          <td className="py-4 text-center text-slate-500 font-medium">
                            <span className="bg-slate-100 px-3 py-1 rounded-lg">{r.hora}</span>
                          </td>
                          <td className="py-4 text-center">
                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${
                              r.estado === "Completado" ? "bg-emerald-100 text-emerald-600" : 
                              r.estado === "Pendiente" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                            }`}>
                              {r.estado}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                              <FaChevronRight />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actividades Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Registro de Actividades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actividades.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${a.realizada ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                        <FaCheckCircle size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{a.nombre}</p>
                        <p className="text-xs text-slate-400 uppercase font-bold">{a.hora || 'Sin hora'}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${a.realizada ? 'bg-emerald-500 text-white' : 'text-slate-400 bg-slate-200'}`}>
                      {a.realizada ? 'Hecho' : 'Falta'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Componente para las tarjetas pequeñas de estado
function StatusCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div className={`${color} p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{title}</p>
        <p className="text-lg font-black text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default Dashboard;