import { useEffect, useState } from "react";

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

  /* =========================
     FILTRADO
  ========================= */

  const historialFiltrado = historial.filter(h => {

    const coincideTipo =
      filtroTipo === "Todos" || h.tipo === filtroTipo;

    const coincideBusqueda =
      h.detalle.toLowerCase().includes(busqueda.toLowerCase());

    return coincideTipo && coincideBusqueda;

  });

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Historial del adulto
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Consulta todos los registros
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">

        {/* SELECT TIPO */}
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option>Todos</option>
          <option>Sintoma</option>
          <option>Animo</option>
          <option>Actividad</option>
          <option>Recordatorio</option>
        </select>

        {/* BUSQUEDA */}
        <input
          type="text"
          placeholder="Buscar detalle..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />

      </div>

      {/* EMPTY */}
      {historialFiltrado.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <p className="text-gray-400 text-lg">
            No hay resultados
          </p>
        </div>
      )}

      {/* TABLA */}
      {historialFiltrado.length > 0 && (

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
              <tr className="text-left">
                <th className="py-3 px-6">Fecha</th>
                <th className="px-6">Hora</th>
                <th className="px-6">Tipo</th>
                <th className="px-6">Detalle</th>
              </tr>
            </thead>

            <tbody>

              {historialFiltrado.map((h, i) => (

                <tr
                  key={i}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >

                  <td className="py-4 px-6 text-gray-500">
                    {new Date(h.fecha).toLocaleDateString()}
                  </td>

                  <td className="px-6 text-gray-500">
                    {h.hora || "-"}
                  </td>

                  <td className="px-6">
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {h.tipo}
                    </span>
                  </td>

                  <td className="px-6 text-gray-700">
                    {h.detalle}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default Historial;
