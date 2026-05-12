import { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaHeartbeat,
  FaSmile,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserCircle,
  FaClock
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
      setCuidador(cuidadorLS);

      if (!adultoLS) return;

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

  if (!adulto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm">
          <FaUserCircle className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-6">No hay un adulto seleccionado para monitorear.</p>
          <button
            onClick={() => navigate("/dashboard/adultos")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-indigo-200"
          >
            Seleccionar Adulto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* TOP BAR / HEADER */}
      <div className="bg-white px-6 py-8 rounded-b-[3rem] shadow-sm mb-8 border-b border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Panel de Control</h1>
            <h2 className="text-2xl font-black text-slate-800 mt-1">
              Hola, <span className="text-indigo-600">{cuidador?.nombre || "Cuidador"}</span> 👋
            </h2>
          </div>
          <div className="bg-indigo-50 p-3 rounded-2xl">
             <FaBell className="text-indigo-500 text-xl" />
          </div>
        </div>

        {/* TARJETA ADULTO (Destacada) */}
        <div className="mt-8 bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="relative z-10">
            <p className="opacity-80 text-sm font-light">Monitoreando a:</p>
            <h3 className="text-2xl font-bold">{adulto.nombre}</h3>
            <div className="mt-4 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">ID: {adulto.id_adulto}</span>
              <span className="bg-green-400/20 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> En línea
              </span>
            </div>
          </div>
          {/* Círculos decorativos de fondo */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
        </div>
      </div>

      <div className="px-6 max-w-2xl mx-auto">
        
        {/* ALERTAS */}
        {recordatoriosPendientes.length > 0 && (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-4 mb-8 flex items-center gap-4 animate-bounce-subtle">
            <div className="bg-rose-500 p-3 rounded-2xl shadow-lg shadow-rose-200">
              <FaExclamationTriangle className="text-white" />
            </div>
            <div>
              <p className="text-rose-900 font-bold text-sm">Recordatorios Pendientes</p>
              <p className="text-rose-700 text-xs font-medium">Tienes {recordatoriosPendientes.length} tareas sin completar.</p>
            </div>
          </div>
        )}

        {/* PROGRESO DE ACTIVIDADES */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-bold text-slate-800 px-1">Actividades de Hoy</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{progreso}%</span>
          </div>
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs mt-3 flex items-center gap-2 font-medium">
              <FaCheckCircle className="text-green-500" /> {completadas} de {totalActividades} completadas
            </p>
          </div>
        </section>

        {/* GRID DE ACCIONES RÁPIDAS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <QuickCard 
            icon={<FaBell className="text-indigo-500" />} 
            label="Pendientes" 
            value={`${recordatoriosHoy.length} hoy`}
            onClick={() => setMostrarRecordatorios(!mostrarRecordatorios)}
            active={mostrarRecordatorios}
          />
          <QuickCard 
            icon={<FaCalendarAlt className="text-emerald-500" />} 
            label="Calendario" 
            value="Ver agenda"
            onClick={() => navigate("/dashboard/calendario")}
          />
          <QuickCard 
            icon={<FaSmile className="text-amber-400" />} 
            label="Ánimo" 
            value={estadoAnimo} 
          />
          <QuickCard 
            icon={<FaHeartbeat className="text-rose-400" />} 
            label="Síntomas" 
            value={sintomas.length > 0 ? sintomas[0] : "Todo bien"} 
          />
        </div>

        {/* TABLA DE RECORDATORIOS (LISTA MODERNA) */}
        {mostrarRecordatorios && (
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 mb-8 overflow-hidden animate-fade-in">
            <h3 className="font-bold text-slate-800 mb-4">Detalle de Recordatorios</h3>
            <div className="space-y-3">
              {recordatoriosHoy.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No hay tareas programadas.</p>
              ) : (
                recordatoriosHoy.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-10 bg-indigo-500 rounded-full"></div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{r.titulo}</p>
                        <p className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                          <FaClock /> {r.hora}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      r.estado === "Completado" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      {r.estado}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* REGISTRO DE ACTIVIDADES (LISTA MODERNA) */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 mb-8">
            <h3 className="font-bold text-slate-800 mb-4">Registro de Actividades</h3>
            <div className="space-y-4">
              {actividades.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">Sin actividades recientes.</p>
              ) : (
                actividades.map((a, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-slate-700 text-sm">{a.nombre}</p>
                      <p className="text-slate-400 text-xs tracking-tight">{a.hora || "--:--"}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                      a.realizada ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                    }`}>
                      {a.realizada ? "Listo" : "Pendiente"}
                    </span>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

/* Componente pequeño para las tarjetas del grid */
function QuickCard({ icon, label, value, onClick, active }) {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-[2rem] transition-all cursor-pointer border ${
        active 
        ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100" 
        : "bg-white border-slate-50 shadow-sm hover:shadow-md hover:-translate-y-1"
      }`}
    >
      <div className={`${active ? "bg-white/20" : "bg-slate-50"} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors`}>
        {icon}
      </div>
      <p className={`text-xs font-bold uppercase tracking-tight ${active ? "text-indigo-100" : "text-slate-400"}`}>{label}</p>
      <p className={`text-sm font-black mt-1 ${active ? "text-white" : "text-slate-700"}`}>{value}</p>
    </div>
  );
}

export default Dashboard;