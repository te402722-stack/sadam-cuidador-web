
import { useEffect, useState } from "react";
import api from "../services/api";

function Sintomas() {

  const [sintomas, setSintomas] = useState([]);
  const [adulto, setAdulto] = useState(null);

  useEffect(() => {
  const adultoLS = JSON.parse(localStorage.getItem("adulto"));
  if (!adultoLS) return;

  setAdulto(adultoLS);

  // Cargamos los síntomas usando la API centralizada
  api.get(`/sintomas/${adultoLS.id_adulto}`)
    .then(res => setSintomas(res.data))
    .catch(err => console.error("Error cargando síntomas:", err));
}, []);

  return (

    <div>

      <h1 className="text-3xl font-bold mb-8">
        Síntomas reportados
      </h1>

      {sintomas.length === 0 && (
        <p className="text-gray-500">
          No hay síntomas registrados
        </p>
      )}

      <div className="space-y-4">

        {sintomas.map((s, i) => (

          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow"
          >

            <h2 className="font-semibold">
              {adulto?.nombre}
            </h2>

            <p className="text-gray-600">
              {s.descripcion}
            </p>

            {s.intensidad && (
              <p className="text-sm text-orange-500">
                Intensidad: {s.intensidad}
              </p>
            )}

            <p className="text-sm text-gray-400">
              {new Date(s.fecha).toLocaleDateString()}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}

export default Sintomas;
