import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.png";
import api from "../services/api";

function Login({ onLogin }) {

  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
  // 1. Validaciones iniciales (cliente)
  if (!correo || !password) {
    alert("Debes completar todos los campos");
    return;
  }

  if (!validarEmail(correo)) {
    alert("Ingresa un correo válido");
    return;
  }

  setCargando(true);

  try {
    // 2. Petición al servidor usando nuestra instancia de API
    // Nota: Ya no necesitamos la URL completa ni los headers de JSON
    const res = await api.post("/login-cuidador", { 
      correo, 
      password 
    });

    // 3. Manejo de respuesta exitosa
    // Axios pone la respuesta del servidor automáticamente en res.data
    const { cuidador, adulto, usuario } = res.data;

    // Guardamos en LocalStorage para mantener la sesión activa
    localStorage.setItem("cuidador", JSON.stringify(cuidador));
    
    // Si el login devuelve un adulto vinculado, lo guardamos de una vez
    if (adulto) {
      localStorage.setItem("adulto", JSON.stringify(adulto));
      localStorage.setItem("id_adulto", adulto.id_adulto);
    }

    // 4. Redirección
    navigate("/dashboard");

    // Ejecutar callback si existe
    if (onLogin) onLogin(usuario);

  } catch (error) {
    // 5. Manejo de errores inteligente
    // Si el servidor respondió con un error (401, 404, 500)
    const mensajeError = error.response?.data?.mensaje || "Error de conexión con el servidor";
    
    console.error("Error en Login:", error);
    alert(mensajeError);

  } finally {
    // Apagar el estado de carga siempre (éxito o error)
    setCargando(false);
  }
};

  return (

    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#e9edff] to-white">

      <div className="w-[380px] bg-white p-8 rounded-3xl shadow-xl">

        {/* LOGO */}

        <div className="flex flex-col items-center mb-6">

          <img src={logo} alt="logo" className="w-20 mb-2"/>

          <h1 className="text-2xl font-bold text-[#6C63FF]">
            SADAM
          </h1>

          <p className="text-gray-500 text-sm text-center">
            Sistema de acompañamiento
          </p>

        </div>

        {/* CORREO */}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-3 border rounded-xl mb-3"
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4"
        />

        {/* LOGIN */}

        <button
          onClick={handleLogin}
          disabled={cargando}
          className="w-full bg-[#6C63FF] text-white py-3 rounded-xl font-semibold mb-3"
        >
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>

        {/* CREAR CUENTA */}

        <button
          onClick={() => navigate("/registro-cuidador")}
          className="w-full border-2 border-[#6C63FF] text-[#6C63FF] py-3 rounded-xl font-semibold mb-4"
        >
          Crear cuenta
        </button>

      </div>

    </div>

  );

}

export default Login;