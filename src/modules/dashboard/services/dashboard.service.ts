// 1. Importa la instancia 'api' personalizada
import api from '../../../core/api/axios'; 

export interface ActividadResumenDTO {
    nombreActividad: string;
    porcentajeActividad: number;
    nombreUnidad: string | number;
    estado?: string;
}

export interface DashboardDTO {
    idProyecto: number;
    nombreProyecto: string;
    ubicacion: string;
    estadoProyecto: string;
    porcentajeAvance: number;
    totalActividades: number;
    avancesRegistrados: number;
    actividades: ActividadResumenDTO[]; // Lista para el desglose
}

/**
 * Obtiene los datos consolidados usando la instancia configurada 'api'
 */
export const obtenerResumenDashboard = async () => {
    try {
        // La instancia 'api' ya maneja el Token y la BaseURL
        const response = await api.get<DashboardDTO[]>('dashboard/resumen');
        return response.data;
    } catch (error) {
        console.error("Error al obtener el resumen del dashboard:", error);
        throw error;
    }
};