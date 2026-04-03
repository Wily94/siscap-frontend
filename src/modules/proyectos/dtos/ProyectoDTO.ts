export interface ProyectoDTO {
  idProyecto: number;
  nombre: string;
  idEmpresa?: number;
  nombreEmpresa?: string;
  ubicacion: string;
  estado: string;
  responsable?: string;
}