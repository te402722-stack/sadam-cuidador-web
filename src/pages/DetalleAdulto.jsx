import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserAlt, FaNotesMedical } from "react-icons/fa";

function DetalleAdulto() {

  const { id } = useParams();

  const [adulto, setAdulto] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
  api.get(`/adulto/${id}`)
    .then(res => setAdulto(res.data))
    .catch(err => console.error(err));
}, [id]);

  const handleChange = (e) => {

    setAdulto({
      ...adulto,
      [e.target.name]: e.target.value
    });

  };

  const guardarCambios = () => {
  api.put(`/adulto/${id}`, adulto)
    .then(() => {
      setEditando(false);
      alert("Datos actualizados correctamente");
    })
    .catch(err => console.error(err));
};

  if (!adulto) {
    return <div className="p-6">Cargando perfil...</div>;
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f6f9ff] to-[#e8f0ff] p-8">

      {/* PERFIL */}

      <div className="bg-white p-8 rounded-2xl shadow-sm mb-10 flex items-center justify-between">

        <div className="flex items-center gap-6">

          <div className="w-20 h-20 bg-[#7FA8FF] rounded-full flex items-center justify-center text-white text-3xl">
            <FaUserAlt />
          </div>

          <div>

            <h1 className="text-2xl font-semibold text-gray-800">
              {adulto.nombre}
            </h1>

            <p className="text-gray-500">
              Edad: {adulto.edad || "No registrada"} años
            </p>

          </div>

        </div>

        {!editando ? (

          <button
            onClick={() => setEditando(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Editar datos
          </button>

        ) : (

          <button
            onClick={guardarCambios}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Guardar cambios
          </button>

        )}

      </div>

      {/* INFORMACIÓN */}

      <div className="bg-white p-8 rounded-2xl shadow-sm">

        <h2 className="font-medium text-gray-700 mb-6">
          Información médica
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-gray-700">

          <div>
            <strong>Fecha de nacimiento:</strong>

            {editando ? (
              <input
                type="date"
                name="fecha_nacimiento"
                value={adulto.fecha_nacimiento || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p>
                {adulto.fecha_nacimiento
                  ? new Date(adulto.fecha_nacimiento).toLocaleDateString()
                  : "No registrada"}
              </p>
            )}

          </div>

          <div>
            <strong>Peso (kg):</strong>

            {editando ? (
              <input
                type="number"
                name="peso"
                value={adulto.peso || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p>{adulto.peso || "No registrado"}</p>
            )}

          </div>

          <div>
            <strong>Altura (cm):</strong>

            {editando ? (
              <input
                type="number"
                name="altura"
                value={adulto.altura || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p>{adulto.altura || "No registrada"}</p>
            )}

          </div>

          <div>
            <strong>Tipo de sangre:</strong>

            {editando ? (
              <input
                type="text"
                name="tipo_sangre"
                value={adulto.tipo_sangre || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p>{adulto.tipo_sangre || "No registrado"}</p>
            )}

          </div>

          <div>
            <strong>Dirección:</strong>

            {editando ? (
              <input
                type="text"
                name="direccion"
                value={adulto.direccion || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p>{adulto.direccion || "No registrada"}</p>
            )}

          </div>

          <div>
            <strong>Contacto de emergencia:</strong>

            {editando ? (
              <input
                type="text"
                name="contacto_emergencia"
                value={adulto.contacto_emergencia || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p>{adulto.contacto_emergencia || "No registrado"}</p>
            )}

          </div>

        </div>

      </div>

      {/* NOTAS */}

<div className="bg-white p-6 rounded-2xl shadow-sm mt-8">

  <div className="flex items-center gap-3 mb-4">
    <FaNotesMedical className="text-green-400"/>
    <h2 className="font-medium text-gray-700">
      Notas médicas
    </h2>
  </div>

  {editando ? (

    <textarea
      name="notas_medicas"
      value={adulto.notas_medicas || ""}
      onChange={handleChange}
      placeholder="Agregar observaciones médicas, alergias, enfermedades, tratamientos..."
      className="border p-3 rounded w-full h-32"
    />

  ) : (

    <p className="text-gray-600 text-sm">
      {adulto.notas_medicas || "Sin observaciones médicas registradas"}
    </p>

  )}

</div>

    </div>

  );
}

export default DetalleAdulto;