import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  Search, 
  Filter, 
  Activity, 
  Heart, 
  Stethoscope, 
  Bell, 
  Calendar, 
  Clock 
} from "lucide-react"; // Instala lucide-react si no lo tienes

function Historial() {
  const [historial, setHistorial] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const adulto = JSON.parse(localStorage.getItem("adultoSeleccionado"));
    if (!adulto) return;

    api.get(`/historial/${adulto.id_adulto}`)
      .then(res => setHistorial(res.data))
      .catch(err => console.error(err));
  }, []);

  // Configuración de estilos por tipo
  const configTipo = {
    Sintoma: { color: "bg-red-100 text-red-600", icon: <Stethoscope size={16} /> },
    Animo: { color: "bg-pink-100 text-pink-600", icon: <Heart size={16} /> },
    Actividad: { color: "bg-green-100 text-green-600", icon: <Activity size={16} /> },
    Recordatorio: { color: "bg-blue-100 text-blue-600", icon: <Bell size={16} /> },
  };

  const historialFiltrado = historial.filter(h => {
    const coincideTipo = filtroTipo === "Todos" || h.tipo === filtroTipo;
    const coincideBusqueda = h.detalle.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      
      {/* HEADER PRO */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Historial
            </h1>
            <p className="text-slate-500 mt-1">
              Registro detallado de actividades y síntomas
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
            <Calendar className="text-blue-500" size={20} />
            <span className="text-slate-600 font-medium">Hoy: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* FILTROS MEJORADOS */}
        <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por detalle (ej: Paracetamol, Caminata...)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="pl-10 pr-8 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 appearance-none cursor-pointer"
            >
              <option>Todos</option>
              <option>Sintoma</option>
              <option>Animo</option>
              <option>Actividad</option>
              <option>Recordatorio</option>
            </select>
          </div>
        </div>

        {/* LISTADO TIPO TIMELINE / TARJETAS */}
        {historialFiltrado.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={32} />
            </div>
            <p className="text-slate-500 text-xl font-medium">No encontramos registros</p>
            <p className="text-slate-400">Intenta cambiando el filtro o la búsqueda</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {historialFiltrado.map((h, i) => {
              const config = configTipo[h.tipo] || { color: "bg-gray-100 text-gray-600", icon: <Bell size={16} /> };
              
              return (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:translate-x-1 transition-all flex flex-col md:flex-row md:items-center gap-4"
                >
                  {/* ICONO Y TIPO */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                    {config.icon}
                  </div>

                  {/* INFO PRINCIPAL */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${config.color}`}>
                        {h.tipo}
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Clock size={14} />
                        {h.hora.substring(0, 5)}
                      </div>
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg leading-tight">
                      {h.detalle}
                    </h3>
                  </div>

                  {/* FECHA LATERAL */}
                  <div className="md:text-right shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
                    <p className="text-slate-800 font-semibold">
                      {new Date(h.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-slate-400 text-xs uppercase tracking-tighter">
                      {new Date(h.fecha).toLocaleDateString('es-ES', { year: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Historial;
