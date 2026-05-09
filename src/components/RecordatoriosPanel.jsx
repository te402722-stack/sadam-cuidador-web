import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import EditarRecordatorioModal from "./EditarRecordatorioModal";

export default function RecordatoriosPanel({ idAdulto, refresh, irACrear }) {

  const [recordatorios, setRecordatorios] = useState([]);
  const [editar, setEditar] = useState(null);
  const [filtroFecha, setFiltroFecha] = useState("todos");

  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [modoEliminar, setModoEliminar] = useState(null);

  const cargar = async () => {
  try {
    const res = await api.get(`/recordatorios/${idAdulto}`);
    setRecordatorios(res.data);
  } catch (error) {
    console.error("Error al cargar recordatorios:", error);
  }
};

  useEffect(() => {
    cargar();
  }, [refresh]);

  /* =========================
     UTIL
  ========================= */

  const esPasado = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    const f = new Date(fecha);
    f.setHours(0,0,0,0);

    return f < hoy;
  };

  /* =========================
     ELIMINAR PRO
  ========================= */

  const preguntarEliminar = (r) => {

    if (esPasado(r.fecha)) return;

    setConfirmEliminar(r);

    if (r.intervalo && r.intervalo !== "una_vez") {
      setModoEliminar("serie");
    } else {
      setModoEliminar("simple");
    }
  };

  const eliminar = async (modo) => {
  if (!confirmEliminar) return;

  try {
    if (modo === "simple" || modo === "uno") {
      // Cambio a la instancia 'api'
      await api.delete(`/recordatorios/${confirmEliminar.id_recordatorio}`);
    }

    if (modo === "todos") {
      // Cambio a la instancia 'api'
      await api.post("/recordatorios/eliminar-serie", {
        fecha_inicio: confirmEliminar.fecha_inicio,
        fecha_fin: confirmEliminar.fecha_fin,
        intervalo: confirmEliminar.intervalo,
        id_cuidador: confirmEliminar.id_cuidador
      });
    }

    setConfirmEliminar(null);
    setModoEliminar(null);
    cargar();
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
};
  /* =========================
     FILTRO
  ========================= */

  const normalizar = (fecha) => {
    const f = new Date(fecha);
    f.setHours(0,0,0,0);
    return f.getTime();
  };

  const hoy = normalizar(new Date());

  const recordatoriosFiltrados = recordatorios.filter((r) => {
    const f = normalizar(r.fecha);

    if (filtroFecha === "hoy") return f === hoy;
    if (filtroFecha === "proximos") return f >= hoy;
    if (filtroFecha === "pasados") return f < hoy;

    return true;
  });

  /* =========================
     MENSAJES VACÍOS PRO
  ========================= */

  const mensajeVacio = () => {
    switch (filtroFecha) {
      case "hoy":
        return "No hay recordatorios para hoy 📅";
      case "proximos":
        return "No hay próximos recordatorios ⏳";
      case "pasados":
        return "No hay recordatorios pasados 🕰";
      default:
        return "No hay recordatorios 📭";
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Recordatorios
        </h2>

        <button
          onClick={irACrear}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md"
        >
          + Crear
        </button>
      </div>

      {/* FILTRO */}
      <select
        value={filtroFecha}
        onChange={(e) => setFiltroFecha(e.target.value)}
        className="mb-6 px-4 py-2 rounded-xl border shadow-sm"
      >
        <option value="todos">Todos</option>
        <option value="hoy">Hoy</option>
        <option value="proximos">Próximos</option>
        <option value="pasados">Pasados</option>
      </select>

      {/* LISTA */}
      <div className="grid gap-4">

        {recordatoriosFiltrados.length === 0 && (
          <div className="text-center text-gray-400 mt-16 text-lg">
            {mensajeVacio()}
          </div>
        )}

        {recordatoriosFiltrados.map(r => {

          const bloqueado = esPasado(r.fecha);

          return (
            <div
              key={r.id_recordatorio}
              className={`p-4 rounded-2xl shadow transition
                ${bloqueado ? "bg-gray-100 opacity-60" : "bg-white hover:shadow-lg"}
              `}
            >

              <div className="flex justify-between items-center">

                <div>
                  <p className="font-semibold text-gray-800">
                    {r.tipo}
                  </p>

                  <p className="text-sm text-gray-500">
                    {r.fecha.split("T")[0]} • {r.hora}
                  </p>
                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => setEditar(r)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => preguntarEliminar(r)}
                    disabled={bloqueado}
                    className={`px-3 py-1 rounded-lg text-white
                      ${bloqueado
                        ? "bg-gray-300"
                        : "bg-red-500 hover:bg-red-600"}
                    `}
                  >
                    🗑
                  </button>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* MODAL ELIMINAR */}
      {confirmEliminar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-2xl shadow-xl w-[320px]">

            <h3 className="font-bold mb-4">
              Eliminar recordatorio
            </h3>

            {modoEliminar === "simple" && (
              <button
                onClick={() => eliminar("simple")}
                className="w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Confirmar eliminación
              </button>
            )}

            {modoEliminar === "serie" && (
              <>
                <button
                  onClick={() => eliminar("uno")}
                  className="w-full mb-2 bg-yellow-500 text-white py-2 rounded-lg"
                >
                  Solo este
                </button>

                <button
                  onClick={() => eliminar("todos")}
                  className="w-full bg-red-500 text-white py-2 rounded-lg"
                >
                  Toda la serie
                </button>
              </>
            )}

            <button
              onClick={() => setConfirmEliminar(null)}
              className="w-full mt-3 border py-2 rounded-lg"
            >
              Cancelar
            </button>

          </div>

        </div>
      )}

      {/* MODAL EDITAR */}
      <EditarRecordatorioModal
        recordatorio={editar}
        cerrar={() => setEditar(null)}
        actualizar={cargar}
      />

    </div>
  );
}