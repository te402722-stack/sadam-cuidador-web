import { useState, useRef, useEffect } from "react";
import Picker from "react-mobile-picker";
import {
  FaClock,
  FaTint,
  FaPills,
  FaCalendarCheck,
  FaBell,
  FaCalendarAlt
} from "react-icons/fa";
import RegistroExitoso from "../components/RegistroExitoso";
import API_URL from "../services/api";

function CrearRecordatorio({ volver, onCreado }) {

  const now = new Date();

const diaActual = now.getDate();
const mesActual = now.getMonth() + 1;
const anioActual = now.getFullYear();

const pickerRef = useRef(null);
const fechaRef = useRef(null);

const [guardando, setGuardando] = useState(false);
const [guardado, setGuardado] = useState(false);
const [error, setError] = useState("");
const [mostrarHora, setMostrarHora] = useState(false);
const [mostrarFecha, setMostrarFecha] = useState(null);
const [tipo, setTipo] = useState("medicamento");
const [duracionValor, setDuracionValor] = useState(1);
const [cadaXHoras, setCadaXHoras] = useState(2);

const [form, setForm] = useState({
  nombre: "",
  dosis: "",
  doctor: "",
  lugar: "",
  especialidad: "",
  vasos: "",
  especificaciones: ""
});

// 🔥 NUEVO SISTEMA PRO DE FRECUENCIA
const [intervaloTipo, setIntervaloTipo] = useState("diario"); // diario | semanal | cadaXDias | mensual
const [cadaXDias, setCadaXDias] = useState(2);

// 🔥 FECHA INICIO
const [fechaInicio, setFechaInicio] = useState({
  dia: diaActual,
  mes: mesActual,
  anio: anioActual
});

// 🔥 FECHA TERMINO
const [fechaTermino, setFechaTermino] = useState({
  dia: diaActual,
  mes: mesActual,
  anio: anioActual
});

// 🔥 DURACIÓN EN DÍAS
const [duracionDias, setDuracionDias] = useState(1);

// 🔥 MODO DURACIÓN
const [modoDuracion, setModoDuracion] = useState("dias"); 

// 🔥 HORA PRINCIPAL
const [hora, setHora] = useState({
  hora: now.getHours(),
  minuto: now.getMinutes()
});

// 🔥 MÚLTIPLES HORARIOS
const [horasMultiples, setHorasMultiples] = useState([]);

// 🔥 DÍAS SEMANA (por si lo usas después)
const [diasSemana, setDiasSemana] = useState([]);

// 🔥 LISTAS
const meses = Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => {
  if (fechaInicio.anio === anioActual) return m >= mesActual;
  return true;
});

const dias = Array.from({ length: 31 }, (_, i) => i + 1).filter((d) => {
  if (fechaInicio.anio === anioActual && fechaInicio.mes === mesActual) {
    return d >= diaActual;
  }
  return true;
});

const anios = Array.from({ length: 10 }, (_, i) => anioActual + i);

const horas = Array.from({ length: 24 }, (_, i) => i);
const minutos = Array.from({ length: 60 }, (_, i) => i);

// 🔥 SINCRONIZA DURACIÓN → FECHA TERMINO
useEffect(() => {
  if (modoDuracion === "dias") {
    const inicio = new Date(fechaInicio.anio, fechaInicio.mes - 1, fechaInicio.dia);
    inicio.setDate(inicio.getDate() + duracionDias - 1);

    setFechaTermino({
      dia: inicio.getDate(),
      mes: inicio.getMonth() + 1,
      anio: inicio.getFullYear()
    });
  }
}, [duracionDias, fechaInicio, modoDuracion]);

// 🔥 SINCRONIZA FECHA TERMINO → DURACIÓN
useEffect(() => {
  if (modoDuracion === "fecha") {
    const inicio = new Date(fechaInicio.anio, fechaInicio.mes - 1, fechaInicio.dia);
    const fin = new Date(fechaTermino.anio, fechaTermino.mes - 1, fechaTermino.dia);

    const diff = Math.ceil((fin - inicio) / 86400000) + 1;

    if (diff > 0) setDuracionDias(diff);
  }
}, [fechaTermino, fechaInicio, modoDuracion]);

// 🔥 HANDLERS
const handleChange = (e) =>
  setForm({ ...form, [e.target.name]: e.target.value });

const handleHoraChange = (value) => {
  setHora(value);
};

// 🔥 AGREGAR HORA (SIN DUPLICADOS)
const agregarHora = () => {
  const existe = horasMultiples.some(
    h => h.hora === hora.hora && h.minuto === hora.minuto
  );

  if (!existe) {
    setHorasMultiples([
      ...horasMultiples,
      { hora: hora.hora, minuto: hora.minuto }
    ]);
  }
};

// 🔥 TEMAS
const temas = {
  agua: {
    fondo: "#dff6fb",
    header: "#a7e8f1",
    boton: "#7fd6e6",
    texto: "#16708c"
  },
  medicamento: {
    fondo: "#fff9db",
    header: "#ffe066",
    boton: "#ffd43b",
    texto: "#8a6d00"
  },
  cita: {
    fondo: "#e6f7e6",
    header: "#b2f2bb",
    boton: "#69db7c",
    texto: "#2b8a3e"
  },
  otro: {
    fondo: "#fff3e6",
    header: "#ffc078",
    boton: "#ffa94d",
    texto: "#a15c00"
  }
};

// 🔥 ICONOS
const iconos = {
  agua: <FaTint size={22} />,
  medicamento: <FaPills size={22} />,
  cita: <FaCalendarCheck size={22} />,
  otro: <FaBell size={22} />
};

/*//////////////////////////////////////////////////////
              GENERAR RECORDATORIOS PRO
//////////////////////////////////////////////////////*/
const generarRecordatorios = () => {

  const recordatorios = [];

  const inicio = new Date(fechaInicio.anio, fechaInicio.mes - 1, fechaInicio.dia);
  const fin = new Date(fechaTermino.anio, fechaTermino.mes - 1, fechaTermino.dia);
  inicio.setHours(0,0,0,0);
  fin.setHours(23,59,59,999);

  // 🔥 SI NO HAY HORAS MÚLTIPLES, USA LA PRINCIPAL
  const listaHoras = horasMultiples.length > 0
    ? horasMultiples
    : [hora];

  // 🔥 RECORRER POR DÍAS
  let actual = new Date(inicio);

if (intervaloTipo === "cadaXHoras") {

  listaHoras.forEach(h => {
    let iterador = new Date(inicio);
    iterador.setHours(h.hora, h.minuto, 0, 0);

    while (iterador <= fin) {
      recordatorios.push(new Date(iterador));
      iterador.setHours(iterador.getHours() + cadaXHoras);
    }
  });

  return recordatorios;
}

  while (actual <= fin) {

    let agregar = false;

    switch (intervaloTipo) {

      case "diario":
        agregar = true;
        break;

      case "semanal":
        agregar = actual.getDay() === inicio.getDay();
        break;

      case "cadaXDias": {
        const diffDias = Math.floor((actual - inicio) / 86400000);
        agregar = diffDias % cadaXDias === 0;
        break;
      }

      case "mensual":
        agregar = actual.getDate() === inicio.getDate();
        break;

      default:
        agregar = true;
    }

    if (agregar) {
      listaHoras.forEach(h => {
        const nuevaFecha = new Date(actual);
        nuevaFecha.setHours(h.hora, h.minuto, 0, 0);
        recordatorios.push(nuevaFecha);
      });
    }

    actual.setDate(actual.getDate() + 1);
  }

  return recordatorios;
};

 /*//////////////////////////////////////////////////////
              GUARDAR RECORDATORIOS PRO
//////////////////////////////////////////////////////*/
const guardarRecordatorio = async () => {

  if (guardando) return;

  setGuardando(true);
  setError("");

  try {

    const inicio = new Date(fechaInicio.anio, fechaInicio.mes - 1, fechaInicio.dia);
    const fin = new Date(fechaTermino.anio, fechaTermino.mes - 1, fechaTermino.dia);

    if (fin < inicio) {
      setError("La fecha final no puede ser menor a la inicial");
      return;
    }

    const cuidador = JSON.parse(localStorage.getItem("cuidador"));
    if (!cuidador) {
      setError("No se encontró el cuidador");
      return;
    }

    let frecuenciaFinal = "Diario";
    if (intervaloTipo === "semanal") frecuenciaFinal = "Semanal";
    if (intervaloTipo === "cadaXDias") frecuenciaFinal = `Cada ${cadaXDias} días`;
    if (intervaloTipo === "mensual") frecuenciaFinal = "Mensual";

    if (!form.nombre && tipo === "medicamento") {
      setError("El medicamento necesita un nombre");
      return;
    }

    const listaHoras = horasMultiples.length > 0 ? horasMultiples : [hora];

    if (listaHoras.length === 0) {
      setError("Debes agregar al menos una hora");
      return;
    }

    const fechas = generarRecordatorios();

    for (const fechaObj of fechas) {

      const fechaFinal =
        fechaObj.getFullYear() +
        "-" +
        String(fechaObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(fechaObj.getDate()).padStart(2, "0");

      const horaFinal =
        String(fechaObj.getHours()).padStart(2, "0") +
        ":" +
        String(fechaObj.getMinutes()).padStart(2, "0");

      let dataFinal = {
        tipo,
        frecuencia: frecuenciaFinal,
        intervalo: intervaloTipo,
        fecha_inicio: `${fechaInicio.anio}-${String(fechaInicio.mes).padStart(2,"0")}-${String(fechaInicio.dia).padStart(2,"0")}`,
        fecha_fin: `${fechaTermino.anio}-${String(fechaTermino.mes).padStart(2,"0")}-${String(fechaTermino.dia).padStart(2,"0")}`,
        fecha: fechaFinal,
        hora: horaFinal,
        id_cuidador: cuidador.id_cuidador
      };

      if (tipo === "medicamento") {
        dataFinal.nombre = form.nombre;
        dataFinal.dosis = form.dosis;
        dataFinal.especificaciones = form.especificaciones;
      }

      if (tipo === "agua") {
        dataFinal.vasos = form.vasos;
        dataFinal.especificaciones = form.especificaciones;
      }

      if (tipo === "cita") {
        dataFinal.nombre = form.nombre;
        dataFinal.especialidad = form.especialidad;
        dataFinal.lugar = form.lugar;
      }

      if (tipo === "otro") {
        dataFinal.nombre = form.nombre;
        dataFinal.especificaciones = form.especificaciones;
      }

      const res = await fetch(`${API_URL}/recordatorios`, {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true" // Por si acaso sigues usando ngrok un poco más
  },
  body: JSON.stringify(dataFinal)
});

      if (!res.ok) {
        throw new Error("Error al guardar recordatorio");
      }
    }

    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);

    setHorasMultiples([]);
    setDiasSemana([]);

    if (onCreado) onCreado();

  } catch (error) {
    console.error(error);
    setError("No se pudo conectar con el servidor");
  } finally {
    setGuardando(false);
  }
};

  useEffect(() => {
  const handleClickOutside = (event) => {

    const clickFueraHora =
      pickerRef.current &&
      !pickerRef.current.contains(event.target);

    const clickFueraFecha =
      fechaRef.current &&
      !fechaRef.current.contains(event.target);

    if (clickFueraHora) setMostrarHora(false);
    if (clickFueraFecha) setMostrarFecha(false);
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const tema = temas[tipo];

  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  };

  const inputStyle = {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "1px solid #ddd"
  };

  useEffect(() => {
  const inicio = new Date(fechaInicio.anio, fechaInicio.mes - 1, fechaInicio.dia);
  const fin = new Date(inicio);

  switch (intervaloTipo) {
    case "cadaXHoras":
  fin.setDate(inicio.getDate() + duracionValor - 1);
  break;

    case "diario":
      fin.setDate(inicio.getDate() + duracionValor - 1);
      break;

    case "semanal":
      fin.setDate(inicio.getDate() + (duracionValor * 7) - 1);
      break;

    case "cadaXDias":
      fin.setDate(inicio.getDate() + (duracionValor * cadaXDias) - 1);
      break;

    case "mensual":
      fin.setMonth(inicio.getMonth() + duracionValor);
      fin.setDate(inicio.getDate() - 1); // para cerrar el ciclo
      break;

    default:
      break;
  }

  setFechaTermino({
    dia: fin.getDate(),
    mes: fin.getMonth() + 1,
    anio: fin.getFullYear()
  });

}, [duracionValor, intervaloTipo, cadaXDias, fechaInicio]);

useEffect(() => {
  setDuracionDias(duracionValor);
}, [duracionValor]);

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: tema.fondo, display: "flex", flexDirection: "column" }}>

      <div style={{ backgroundColor: tema.header, padding: "20px", display: "flex", alignItems: "center", gap: "12px", color: tema.texto }}>
        <button onClick={volver} className="mb-4 text-[#8a6d00] text-2xl font-bold">←</button>
        {iconos[tipo]}
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Crear Recordatorio</h1>
      </div>

      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

        <div style={cardStyle}>
          <label>Tipo de recordatorio</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle}>
            <option value="medicamento">💊 Medicamento</option>
            <option value="agua">💧 Agua</option>
            <option value="cita">🏥 Cita</option>
            <option value="otro">🔔 Otro</option>
          </select>
        </div>

        {tipo === "medicamento" && (
          <div style={cardStyle}>
            <input name="nombre" placeholder="Nombre del medicamento" onChange={handleChange} style={inputStyle}/>
            <input name="dosis" placeholder="Dosis" onChange={handleChange} style={inputStyle}/>
            <input name="especificaciones" placeholder="Especificaciones" onChange={handleChange} style={inputStyle}/>
          </div>
        )}

        {tipo === "cita" && (
          <div style={cardStyle}>
            <input name="nombre" placeholder="Titulo de la cita" onChange={handleChange} style={inputStyle}/>
            <input name="especialidad" placeholder="Especialidad" onChange={handleChange} style={inputStyle}/>
            <input name="lugar" placeholder="Nombre de la clinica" onChange={handleChange} style={inputStyle}/>
          </div>
        )}

        {tipo === "otro" && (
          <div style={cardStyle}>
            <input name="nombre" placeholder="Titulo" onChange={handleChange} style={inputStyle}/>
            <input name="especificaciones" placeholder="Especificaciones" onChange={handleChange} style={inputStyle}/>
            
          </div>
        )}

{/* ================== HORA ================== */}
<div style={{
  background:"white",
  borderRadius:"20px",
  overflow:"hidden",
  boxShadow:"0 6px 20px rgba(0,0,0,0.08)"
}} ref={pickerRef}>

  {/* HEADER HORA */}
  <div
    onClick={() => setMostrarHora(!mostrarHora)}
    style={{
      padding:"18px",
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      cursor:"pointer"
    }}
  >
    <span style={{fontSize:"18px", fontWeight:"bold"}}>Hora</span>

    <span style={{color:"#1217b1", fontWeight:"bold"}}>
      {String(hora.hora).padStart(2,"0")}:
      {String(hora.minuto).padStart(2,"0")} <FaClock/>
    </span>
  </div>

  {/* PICKER DESPLEGABLE */}
  {mostrarHora && (
    <div style={{padding:"15px", borderTop:"1px solid #eee"}}>
      <Picker value={hora} onChange={handleHoraChange} height={180} itemHeight={48}>
        <Picker.Column name="hora">
          {horas.map((h)=>(
            <Picker.Item key={h} value={h}>
              {String(h).padStart(2,"0")}
            </Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name="minuto">
          {minutos.map((m)=>(
            <Picker.Item key={m} value={m}>
              {String(m).padStart(2,"0")}
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
    </div>
  )}
</div>


{/* ================== FRECUENCIA ================== */}
<div style={{
  background:"white",
  borderRadius:"20px",
  overflow:"hidden",
  boxShadow:"0 6px 20px rgba(0,0,0,0.08)",
  marginTop:"20px"
}} ref={fechaRef}>

  {/* ====== FECHA INICIO ====== */}
  <div
    onClick={()=>setMostrarFecha(m => m === "inicio" ? null : "inicio")}
    style={{
      padding:"18px",
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      cursor:"pointer"
    }}
  >
    <span style={{fontWeight:"bold"}}>Fecha de inicio</span>

    <span style={{color:"#1217b1", fontWeight:"bold"}}>
      {fechaInicio.dia} / {fechaInicio.mes} / {fechaInicio.anio}
    </span>
  </div>

  {mostrarFecha === "inicio" && (
    <div style={{padding:"15px", borderTop:"1px solid #eee"}}>
      <Picker
        value={fechaInicio}
        onChange={setFechaInicio}
        height={180}
        itemHeight={40}
      >
        <Picker.Column name="anio">
          {anios.map(a => <Picker.Item key={a} value={a}>{a}</Picker.Item>)}
        </Picker.Column>

        <Picker.Column name="mes">
          {meses.map(m => <Picker.Item key={m} value={m}>{m}</Picker.Item>)}
        </Picker.Column>

        <Picker.Column name="dia">
          {dias.map(d => <Picker.Item key={d} value={d}>{d}</Picker.Item>)}
        </Picker.Column>
      </Picker>
    </div>
  )}

  {/* ====== INTERVALO ====== */}
  <div
    onClick={()=>setMostrarFecha(m => m === "intervalo" ? null : "intervalo")}
    style={{
      padding:"18px",
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      borderTop:"1px solid #eee",
      cursor:"pointer"
    }}
  >
    <span style={{fontWeight:"bold"}}>Intervalo</span>

    <span style={{color:"#1217b1", fontWeight:"bold"}}>
      {intervaloTipo === "cadaXHoras" && `Cada ${cadaXHoras} horas`}
      {intervaloTipo === "diario" && "Cada día"}
      {intervaloTipo === "semanal" && "Semanal"}
      {intervaloTipo === "cadaXDias" && `Cada ${cadaXDias} días`}
      {intervaloTipo === "mensual" && "Mensual"}
    </span>
  </div>

  {mostrarFecha === "intervalo" && (
    <div style={{padding:"15px", borderTop:"1px solid #eee"}}>

      <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
        {
          [
  {id:"cadaXHoras", label:"Cada X horas"},
  {id:"diario", label:"Diario"},
  {id:"semanal", label:"Semanal"},
  {id:"cadaXDias", label:"Cada X días"},
  {id:"mensual", label:"Mensual"}
].map(op => (
          <button
            key={op.id}
            onClick={()=>setIntervaloTipo(op.id)}
            style={{
              padding:"10px 14px",
              borderRadius:"20px",
              border:"none",
              background:intervaloTipo===op.id?"#357aa8":"#eee",
              color:intervaloTipo===op.id?"white":"black",
              fontWeight:"bold"
            }}
          >
            {op.label}
          </button>
        ))}
      </div>


{intervaloTipo === "cadaXHoras" && (
  <div style={{
    display:"flex",
    justifyContent:"space-between",
    marginTop:"10px"
  }}>
    <button onClick={()=>setCadaXHoras(Math.max(1,cadaXHoras-1))}>-</button>
    <span style={{fontWeight:"bold"}}>{cadaXHoras} horas</span>
    <button onClick={()=>setCadaXHoras(cadaXHoras+1)}>+</button>
  </div>
)}
      {intervaloTipo === "cadaXDias" && (
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          marginTop:"10px"
        }}>
          <button onClick={()=>setCadaXDias(Math.max(1,cadaXDias-1))}>-</button>
          <span style={{fontWeight:"bold"}}>{cadaXDias} días</span>
          <button onClick={()=>setCadaXDias(cadaXDias+1)}>+</button>
        </div>
      )}
    </div>
  )}

  {/* ====== DURACIÓN ====== */}
  <div
    onClick={()=>setMostrarFecha(m => m === "duracion" ? null : "duracion")}
    style={{
      padding:"18px",
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      borderTop:"1px solid #eee",
      cursor:"pointer"
    }}
  >
    <span style={{fontWeight:"bold"}}>Duración</span>

    <span style={{color:"#1217b1", fontWeight:"bold"}}>
      {intervaloTipo === "cadaXHoras" && `${duracionValor} ciclos`}
  {intervaloTipo === "diario" && `${duracionValor} días`}
  {intervaloTipo === "semanal" && `${duracionValor} semanas`}
  {intervaloTipo === "cadaXDias" && `${duracionValor} ciclos`}
  {intervaloTipo === "mensual" && `${duracionValor} meses`}
</span>
  </div>

  {mostrarFecha === "duracion" && (
    <div style={{padding:"15px", borderTop:"1px solid #eee"}}>


      {modoDuracion === "dias" && (
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          marginTop:"10px"
        }}>
          <button onClick={()=>setDuracionValor(Math.max(1,duracionValor-1))}>-</button>
          <span style={{fontWeight:"bold"}}>
  {duracionValor} {
    intervaloTipo === "cadaXHoras" ? "ciclos" :
    intervaloTipo === "diario" ? "días" :
    intervaloTipo === "semanal" ? "semanas" :
    intervaloTipo === "cadaXDias" ? "ciclos" :
    "meses"
  }
</span>
          <button onClick={()=>setDuracionValor(duracionValor+1)}>+</button>
        </div>
      )}

      {modoDuracion === "fecha" && (
        <Picker
          value={fechaTermino}
          onChange={setFechaTermino}
          height={180}
          itemHeight={40}
        >
          <Picker.Column name="anio">
            {anios.map(a => <Picker.Item key={a} value={a}>{a}</Picker.Item>)}
          </Picker.Column>

          <Picker.Column name="mes">
            {meses.map(m => <Picker.Item key={m} value={m}>{m}</Picker.Item>)}
          </Picker.Column>

          <Picker.Column name="dia">
            {dias.map(d => <Picker.Item key={d} value={d}>{d}</Picker.Item>)}
          </Picker.Column>
        </Picker>
      )}
    </div>
  )}

</div>

{error && (
  <div style={{
    background: "#ffe3e3",
    color: "#c92a2a",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "bold",
    textAlign: "center"
  }}>
    ⚠️ {error}
  </div>
)}

        <button onClick={guardarRecordatorio} style={{padding:"16px",fontSize:"20px",fontWeight:"bold",borderRadius:"16px",backgroundColor:tema.boton,border:"none"}}>
          Guardar Recordatorio
        </button>
      </div>

      {guardado && <RegistroExitoso mensaje="Recordatorio creado correctamente"/>}
    </div>
  );
}

export default CrearRecordatorio;
