import { useState, useEffect } from "react";
import API_URL from "../services/api";
import { FaTimes, FaSave } from "react-icons/fa";

export default function EditarRecordatorioModal({
  recordatorio,
  cerrar,
  actualizar
}) {

  const [form, setForm] = useState({
    tipo: "",
    fecha: "",
    hora: ""
  });

  useEffect(() => {

    if (recordatorio) {
      setForm({
        tipo: recordatorio.tipo,
        fecha: recordatorio.fecha.split("T")[0],
        hora: recordatorio.hora
      });
    }

  }, [recordatorio]);

  const guardar = async () => {
    try {

      await api.put(`/recordatorios/${recordatorio.id_recordatorio}`, form);
      actualizar();
      cerrar();

    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  if (!recordatorio) return null;

  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[350px] rounded-3xl shadow-2xl p-6 animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">

          <h2 className="text-lg font-semibold text-gray-800">
            Editar recordatorio
          </h2>

          <button
            onClick={cerrar}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <FaTimes />
          </button>

        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* TIPO */}
          <div>
            <label className="text-sm text-gray-500">
              Tipo
            </label>

            <input
              value={form.tipo}
              onChange={e =>
                setForm({ ...form, tipo: e.target.value })
              }
              className="w-full mt-1 border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Ej: Medicamento, Agua..."
            />
          </div>

          {/* FECHA */}
          <div>
            <label className="text-sm text-gray-500">
              Fecha
            </label>

            <input
              type="date"
              value={form.fecha}
              onChange={e =>
                setForm({ ...form, fecha: e.target.value })
              }
              className="w-full mt-1 border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* HORA */}
          <div>
            <label className="text-sm text-gray-500">
              Hora
            </label>

            <input
              type="time"
              value={form.hora}
              onChange={e =>
                setForm({ ...form, hora: e.target.value })
              }
              className="w-full mt-1 border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

        </div>

        {/* BOTONES */}
        <div className="flex gap-3 mt-6">

          <button
            onClick={guardar}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
          >
            <FaSave />
            Guardar
          </button>

          <button
            onClick={cerrar}
            className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>

  );

}