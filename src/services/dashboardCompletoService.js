import api from "./api";

export const obtenerDashboardCompleto = async (idCuidador) => {
  try {
    // 1. Usamos la instancia 'api' que ya sabe cuál es la URL base
    const res = await api.get(`/dashboard-completo/${idCuidador}`);

    // 2. Con Axios, los datos ya vienen en la propiedad 'data'
    return res.data;

  } catch (error) {
    // 3. Manejo de errores más descriptivo
    console.error("Error al obtener dashboard:", error.response?.data || error.message);
    throw new Error(error.response?.data?.mensaje || "No se pudo cargar el dashboard");
  }
};