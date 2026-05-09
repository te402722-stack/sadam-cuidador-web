import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaUsers, FaPlus } from "react-icons/fa";
import API_URL from "../services/api";

function Adultos() {

  const [adultos, setAdultos] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const cargarAdultos = async () => {
  const cuidador = JSON.parse(localStorage.getItem("cuidador"));
  if (!cuidador) return;

  try {
    const res = await api.get(`/adultos-cuidador/${cuidador.id_cuidador}`);
    setAdultos(res.data);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    cargarAdultos();
  }, []);

  // 🔥 VINCULAR ADULTO
  // 🔥 VINCULAR ADULTO (Versión optimizada para producción)
const vincularAdulto = async () => {
  if (!codigo.trim()) {
    alert("Ingresa un código");
    return;
  }

  const cuidador = JSON.parse(localStorage.getItem("cuidador"));
  if (!cuidador) {
    alert("Error: No se encontró información del cuidador");
    return;
  }

  try {
    setLoading(true);

    // Usamos 'api' en lugar de 'fetch'. 
    // Ya no necesitas poner la URL completa ni los headers de JSON, api.js lo hace por ti.
    const res = await api.post("/vincular", {
      codigo: codigo,
      id_cuidador: cuidador.id_cuidador
    });

    // Con axios (nuestro 'api'), la respuesta exitosa llega directamente en res.data
    alert("Adulto vinculado correctamente");

    setCodigo("");
    cargarAdultos(); // 🔥 Recargar lista para ver al nuevo adulto

  } catch (error) {
    // Si el servidor responde con un error (ej. código inválido), axios lo atrapa aquí
    const mensajeError = error.response?.data?.error || "Error al vincular";
    console.error("Error en vinculación:", error);
    alert(mensajeError);
  } finally {
    setLoading(false);
  }
};

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <FaUsers className="text-3xl text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">
            Adultos mayores
          </h1>
          <p className="text-gray-500">
            Gestiona y visualiza la información de tus adultos
          </p>
        </div>
      </div>

      {/* 🔥 NUEVO: VINCULAR ADULTO */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6 border border-gray-100">

        <p className="text-sm text-gray-500 mb-2">
          Vincular nuevo adulto con código
        </p>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Ej: SADAM-ABC123"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={vincularAdulto}
            disabled={loading}
            className="bg-blue-500 text-white px-5 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <FaPlus />
            {loading ? "Vinculando..." : "Agregar"}
          </button>

        </div>

      </div>

      {/* RESUMEN */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-gray-700">
          Total de adultos vinculados:
          <span className="font-bold text-blue-600 ml-2">
            {adultos.length}
          </span>
        </p>
      </div>

      {/* SIN DATOS */}
      {adultos.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No hay adultos vinculados
        </div>
      )}

      {/* LISTA */}
      <div className="grid md:grid-cols-2 gap-5">

        {adultos.map((a) => (

          <div
            key={a.id_adulto}
            onClick={() => {
              localStorage.setItem("adultoSeleccionado", JSON.stringify(a));
              navigate(`/dashboard/inicio/${a.id_adulto}`);
            }}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all border border-gray-100 flex justify-between items-center cursor-pointer hover:scale-[1.01] hover:bg-blue-50"
          >

            {/* INFO */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-500 p-3 rounded-full">
                <FaUserAlt />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  {a.nombre}
                </h2>

                <p className="text-gray-500 text-sm">
                  Edad: {a.edad} años
                </p>
              </div>
            </div>

            {/* BOTÓN */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                localStorage.setItem("adultoSeleccionado", JSON.stringify(a));
                navigate(`/dashboard/inicio/${a.id_adulto}`);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Ver
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Adultos;