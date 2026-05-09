import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RegistroCuidador() {

  const navigate = useNavigate();

  const [codigo, setCodigo] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    parentesco: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codigoURL = params.get("codigo");
    if (codigoURL) setCodigo(codigoURL);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // limpiar error al escribir
    setErrors({ ...errors, [name]: "" });
  };

  const validar = () => {
    const newErrors = {};

    // Nombre
    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    // Correo
    if (!form.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      newErrors.correo = "Correo inválido";
    }

    // Teléfono
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{10}$/.test(form.telefono)) {
      newErrors.telefono = "Debe tener 10 dígitos";
    }

    // Password
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    // Parentesco
    if (!form.parentesco) {
      newErrors.parentesco = "Selecciona una relación";
    }

    // Código
    if (!codigo.trim()) {
      newErrors.codigo = "El código de invitación es obligatorio";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const registrar = async () => {
  if (!validar()) return;

  try {
    setLoading(true);

    // Usamos nuestra instancia 'api'
    const res = await api.post("/registro-cuidador", { ...form, codigo });

    // Con axios, la respuesta exitosa está en res.data
    localStorage.setItem("cuidador", JSON.stringify(res.data.cuidador));
    
    setExito(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

  } catch (error) {
    const msg = error.response?.data?.mensaje || "Error al conectar con el servidor";
    setErrors({ general: msg });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 p-6">

      {exito && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold">Cuenta creada</h2>
            <p className="text-gray-500">Redirigiendo...</p>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Registro de Cuidador
        </h1>

        {/* NOMBRE */}
        <div className="mb-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
            <FaUser />
            <input
              name="nombre"
              placeholder="Nombre"
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <InputError msg={errors.nombre} />
        </div>

        {/* CORREO */}
        <div className="mb-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
            <FaEnvelope />
            <input
              name="correo"
              placeholder="Correo"
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <InputError msg={errors.correo} />
        </div>

        {/* TELEFONO */}
        <div className="mb-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
            <FaPhone />
            <input
              name="telefono"
              placeholder="Teléfono"
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              maxLength={10}
            />
          </div>
          <InputError msg={errors.telefono} />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
            <FaLock />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <InputError msg={errors.password} />
        </div>

        {/* PARENTESCO */}
        <div className="mb-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3">
            <FaUsers />
            <select
              name="parentesco"
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            >
              <option value="">Relación</option>
              <option>Hijo</option>
              <option>Hija</option>
              <option>Nieto</option>
              <option>Esposo</option>
              <option>Enfermero</option>
            </select>
          </div>
          <InputError msg={errors.parentesco} />
        </div>

        {/* CODIGO */}
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código de invitación"
          className="w-full mb-2 p-3 rounded-xl bg-gray-100 text-center font-semibold"
        />
        <InputError msg={errors.codigo} />

        {/* ERROR GENERAL */}
        {errors.general && (
          <p className="text-red-500 text-center mt-3">{errors.general}</p>
        )}

        <button
          onClick={registrar}
          className="w-full bg-indigo-500 text-white py-3 rounded-xl mt-4"
        >
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>

      </div>
    </div>
  );
}

export default RegistroCuidador;