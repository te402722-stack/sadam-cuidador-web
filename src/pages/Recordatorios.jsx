import { useState } from "react";
import CrearRecordatorio from "../components/CrearRecordatorio";
import RecordatoriosPanel from "../components/RecordatoriosPanel";

export default function RecordatoriosPage({ idCuidador }) {

  // 🔥 obtener adulto desde localStorage (CLAVE)
  const adulto = JSON.parse(localStorage.getItem("adulto"));
  const idAdulto = adulto?.id_adulto;

  const [refresh, setRefresh] = useState(false);
  const [vista, setVista] = useState("panel");

  const actualizar = () => {
    setRefresh(!refresh);
    setVista("panel");
  };

  // 🔐 protección (evita errores)
  if (!idAdulto) {
    return (
      <div className="p-6 text-gray-600">
        Cargando datos del adulto...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* PANEL */}
      {vista === "panel" && (
        <RecordatoriosPanel
          idAdulto={idAdulto}
          refresh={refresh}
          irACrear={() => setVista("crear")}
        />
      )}

      {/* CREAR */}
      {vista === "crear" && (
        <CrearRecordatorio
          idCuidador={idCuidador}
          onCreado={actualizar}
          volver={() => setVista("panel")}
        />
      )}

    </div>
  );
}