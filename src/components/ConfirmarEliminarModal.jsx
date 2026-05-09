import { FaTrash, FaTimes } from "react-icons/fa";

export default function ConfirmarEliminarModal({
  visible,
  mensaje,
  onConfirmar,
  onCancelar
}) {

  if (!visible) return null;

  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[320px] rounded-3xl shadow-2xl p-6 text-center">

        {/* ICONO */}
        <div className="bg-red-100 text-red-500 w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-4">
          <FaTrash />
        </div>

        {/* TEXTO */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Confirmar eliminación
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          {mensaje || "¿Seguro que deseas eliminar esto?"}
        </p>

        {/* BOTONES */}
        <div className="flex gap-3">

          <button
            onClick={onConfirmar}
            className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2"
          >
            <FaTrash />
            Eliminar
          </button>

          <button
            onClick={onCancelar}
            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <FaTimes />
            Cancelar
          </button>

        </div>

      </div>

    </div>

  );
}