import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaBell,
  FaPills,
  FaTint,
  FaHeartbeat,
  FaWalking
} from "react-icons/fa";
import api from "../services/api";

function CalendarioCuidador() {

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [recordatorios, setRecordatorios] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("es-MX", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  /* =========================
     ICONOS
  ========================= */

  const iconoTipo = (tipo) => {

    if (tipo === "medicamento") return <FaPills className="text-red-500"/>;
    if (tipo === "agua") return <FaTint className="text-blue-500"/>;
    if (tipo === "cita") return <FaHeartbeat className="text-green-500"/>;
    if (tipo === "actividad") return <FaWalking className="text-purple-500"/>;

  };

  /* =========================
     ESTADO AUTOMÁTICO
  ========================= */
const estadoRecordatorio = (r) => {
  if (r.completado) return "completado";

  const ahora = new Date();

  const [year, month, day] = r.fecha.split("-").map(Number);
  const [hora, minuto] = r.hora.split(":").map(Number);

  const fechaHora = new Date(year, month - 1, day, hora, minuto);

  const diferenciaMin = (ahora - fechaHora) / (1000 * 60);

  if (diferenciaMin < 0) return "activo"; // aún no llega
  if (diferenciaMin >= 0 && diferenciaMin <= 10) return "activo";
  if (diferenciaMin > 10 && diferenciaMin <= 30) return "retraso";
  if (diferenciaMin > 30) return "no_cumplido";
};

const textoEstado = (estado) => {
  if (estado === "activo") return "Programado";
  if (estado === "retraso") return "Retraso";
  if (estado === "no_cumplido") return "No cumplido";
  if (estado === "completado") return "Completado";
};
  const estiloEstado = (estado) => {

    if (estado === "activo")
      return "bg-green-100 text-green-700";

    if (estado === "retraso")
      return "bg-yellow-100 text-yellow-700";

    if (estado === "no_cumplido")
      return "bg-red-100 text-red-700";

  };

  /* =========================
     CARGAR RECORDATORIOS
  ========================= */
useEffect(() => {
  const cargarRecordatorios = async () => {
    try {
      const id_adulto = localStorage.getItem("id_adulto");
      // Cambiamos fetch por api.get
      const response = await api.get(`/recordatorios/${id_adulto}`);
      setRecordatorios(response.data);
    } catch (error) {
      console.error("Error cargando recordatorios", error);
    }
  };
  cargarRecordatorios();
}, []);

  /* =========================
     FILTRAR DÍA
  ========================= */

  const recordatoriosDelDia = recordatorios.filter((r) => {

    const fecha = new Date(r.fecha);

    return (
      fecha.getDate() === selectedDay &&
      fecha.getMonth() === month &&
      fecha.getFullYear() === year
    );

  });

  /* =========================
     DETECTAR ALERTAS
  ========================= */

  useEffect(() => {

    recordatorios.forEach((r) => {

      const estado = estadoRecordatorio(r);

      if (estado === "no_cumplido") {

        console.log(
          "🚨 ALERTA: El adulto no cumplió el recordatorio:",
          r.tipo
        );

      }

    });

  }, [recordatorios]);

  /* =========================
     NAVEGAR
  ========================= */

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  return (

    <div className="w-full h-full bg-gray-100 flex flex-col">

      <div className="bg-[#8FAEE6] p-5 text-white shadow-md">
        <h1 className="text-xl font-semibold">
          Calendario del adulto
        </h1>
      </div>

      {/* MES */}

      <div className="flex items-center justify-between px-6 pt-5">

        <button onClick={prevMonth} className="text-gray-600 text-xl">
          <FaChevronLeft />
        </button>

        <h2 className="text-lg font-semibold capitalize">
          {monthName} {year}
        </h2>

        <button onClick={nextMonth} className="text-gray-600 text-xl">
          <FaChevronRight />
        </button>

      </div>

      {/* CALENDARIO */}

      <div className="p-5">

        <div className="bg-white rounded-2xl shadow-lg p-4">

          <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-3">
            <p>L</p><p>M</p><p>Mi</p><p>J</p><p>V</p><p>S</p><p>D</p>
          </div>

          <div className="grid grid-cols-7 gap-2">

            {days.map((day, index) => {

              if (!day) return <div key={index}></div>;

              const recordatoriosDia = recordatorios.filter((r) => {

                const fecha = new Date(r.fecha);

                return (
                  fecha.getDate() === day &&
                  fecha.getMonth() === month &&
                  fecha.getFullYear() === year
                );

              });

              return (

                <button
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  className={`h-12 rounded-xl flex items-center justify-center text-sm relative transition
                  ${selectedDay === day
                    ? "bg-[#8FAEE6] text-white"
                    : "hover:bg-gray-100"}`}
                >

                  {day}

                  {recordatoriosDia.length > 0 && (

                    <div className="absolute bottom-1 flex gap-1">

                      {recordatoriosDia.slice(0,3).map((r,i) => (

                        <span key={i} className="text-xs">
                          {iconoTipo(r.tipo)}
                        </span>

                      ))}

                    </div>

                  )}

                </button>

              );

            })}

          </div>

        </div>

      </div>

      {/* RECORDATORIOS */}

      <div className="flex-1 p-5 overflow-y-auto">

        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FaBell className="text-[#8FAEE6]" />
          Recordatorios del día
        </h3>

        <div className="space-y-3">

          {recordatoriosDelDia.map((r) => {

            const estado = estadoRecordatorio(r);

            return (

              <div
                key={r.id_recordatorio}
                className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
              >

                <div className="flex items-center gap-3">

                  {iconoTipo(r.tipo)}

                  <div>

                    <p className="text-sm text-gray-500">
                      {r.hora}
                    </p>

                    <p className="font-medium capitalize">
                      {r.tipo}
                    </p>

                  </div>

                </div>

                <div className={`px-3 py-1 rounded-full text-xs ${estiloEstado(estado)}`}>
                  {estado}
                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}

export default CalendarioCuidador;