import { Injectable } from '@angular/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import * as pdfGeneration from 'nativescript-pdf-generation';
import { File, Folder, knownFolders, path } from '@nativescript/core';
import { Report, ReportType, ReportData, ReportStatistics, ReportFilters } from '../models/report.model';
import { Evaluation } from '../models/evaluation.model';
import { Equipment } from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  async generateReport(type: ReportType, filters?: ReportFilters): Promise<string> {
    try {
      const reportData = await this.collectReportData(type, filters);
      const htmlContent = this.generateHTMLContent(type, reportData);
      
      const fileName = `reporte_${type}_${this.formatDate(new Date())}.pdf`;
      const pdfPath = path.join(knownFolders.documents().path, fileName);
      
      await pdfGeneration.generatePdf(htmlContent, pdfPath);
      
      // Guardar metadatos del reporte
      await this.saveReportMetadata(type, reportData, pdfPath, filters);
      
      return pdfPath;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async getReportHistory(): Promise<Report[]> {
    try {
      const db = firebase().firestore();
      const snapshot = await db.collection('reports')
        .orderBy('generatedAt', 'desc')
        .limit(50)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
    } catch (error) {
      console.error('Error getting report history:', error);
      throw error;
    }
  }

  async deleteReport(reportId: string): Promise<void> {
    try {
      const db = firebase().firestore();
      await db.collection('reports').doc(reportId).delete();
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  private async collectReportData(type: ReportType, filters?: ReportFilters): Promise<ReportData> {
    const db = firebase().firestore();
    let evaluations: Evaluation[] = [];
    let equipment: Equipment[] = [];

    // Obtener evaluaciones
    if (type === 'evaluation_summary' || type === 'comprehensive') {
      let evalQuery = db.collection('evaluations');
      
      if (filters?.dateRange) {
        evalQuery = evalQuery
          .where('evaluatedAt', '>=', filters.dateRange.start)
          .where('evaluatedAt', '<=', filters.dateRange.end);
      }
      
      if (filters?.locations && filters.locations.length > 0) {
        evalQuery = evalQuery.where('location', 'in', filters.locations);
      }
      
      const evalSnapshot = await evalQuery.get();
      evaluations = evalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Evaluation));
    }

    // Obtener equipos
    if (type === 'equipment_inventory' || type === 'comprehensive') {
      let equipQuery = db.collection('equipment');
      
      if (filters?.categories && filters.categories.length > 0) {
        equipQuery = equipQuery.where('category', 'in', filters.categories);
      }
      
      if (filters?.status && filters.status.length > 0) {
        equipQuery = equipQuery.where('status', 'in', filters.status);
      }
      
      const equipSnapshot = await equipQuery.get();
      equipment = equipSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
    }

    // Calcular estadísticas
    const statistics = this.calculateStatistics(evaluations, equipment);

    return {
      evaluations,
      equipment,
      statistics
    };
  }

  private calculateStatistics(evaluations: Evaluation[], equipment: Equipment[]): ReportStatistics {
    const totalEvaluations = evaluations.length;
    const totalEquipment = equipment.length;
    
    const criticalIssues = evaluations.filter(e => e.priority === 'critical').length;
    
    const maintenanceDue = equipment.filter(e => {
      if (!e.nextMaintenance) return false;
      const now = new Date();
      return e.nextMaintenance <= now && e.status !== 'retired';
    }).length;

    // Calcular puntuación promedio de evaluaciones
    const averageScore = evaluations.length > 0 
      ? evaluations.reduce((sum, eval) => {
          let score = 0;
          if (eval.powerSupply === 'stable') score += 10;
          else if (eval.powerSupply === 'backup') score += 8;
          else if (eval.powerSupply === 'unstable') score += 5;

          if (eval.ventilation === 'adequate') score += 10;
          else if (eval.ventilation === 'excessive') score += 7;
          else if (eval.ventilation === 'insufficient') score += 3;

          if (eval.security === 'excellent') score += 10;
          else if (eval.security === 'good') score += 8;
          else if (eval.security === 'fair') score += 5;
          else if (eval.security === 'poor') score += 2;

          if (eval.cleanliness === 'excellent') score += 10;
          else if (eval.cleanliness === 'good') score += 8;
          else if (eval.cleanliness === 'fair') score += 5;
          else if (eval.cleanliness === 'poor') score += 2;

          return sum + score;
        }, 0) / evaluations.length
      : 0;

    return {
      totalEvaluations,
      totalEquipment,
      criticalIssues,
      maintenanceDue,
      averageScore: Math.round(averageScore * 10) / 10
    };
  }

  private generateHTMLContent(type: ReportType, data: ReportData): string {
    const currentDate = new Date().toLocaleDateString('es-ES');
    const currentTime = new Date().toLocaleTimeString('es-ES');

    let html = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background-color: #f5f5f5;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              margin-bottom: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 300;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h2 { 
              color: #333; 
              border-bottom: 2px solid #667eea;
              padding-bottom: 10px;
              margin-top: 30px;
            }
            h3 {
              color: #555;
              margin-top: 25px;
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 20px 0;
              background: white;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: left; 
            }
            th { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-weight: 600;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 20px 0;
            }
            .stat-card {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
            }
            .stat-number {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 14px;
              opacity: 0.9;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            .priority-critical { color: #dc3545; font-weight: bold; }
            .priority-high { color: #fd7e14; font-weight: bold; }
            .priority-medium { color: #ffc107; font-weight: bold; }
            .priority-low { color: #28a745; font-weight: bold; }
            .status-active { color: #28a745; font-weight: bold; }
            .status-maintenance { color: #ffc107; font-weight: bold; }
            .status-faulty { color: #dc3545; font-weight: bold; }
            .status-retired { color: #6c757d; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Evaluación de Infraestructura de Red</h1>
            <p>Generado el ${currentDate} a las ${currentTime}</p>
          </div>
          
          <div class="content">
    `;

    // Estadísticas generales
    if (data.statistics) {
      html += `
        <h2>📊 Resumen Ejecutivo</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${data.statistics.totalEvaluations}</div>
            <div class="stat-label">Evaluaciones</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.statistics.totalEquipment}</div>
            <div class="stat-label">Equipos</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.statistics.criticalIssues}</div>
            <div class="stat-label">Problemas Críticos</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.statistics.maintenanceDue}</div>
            <div class="stat-label">Mantenimientos Pendientes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.statistics.averageScore}/40</div>
            <div class="stat-label">Puntuación Promedio</div>
          </div>
        </div>
      `;
    }

    // Evaluaciones
    if (data.evaluations && data.evaluations.length > 0) {
      html += `
        <h2>🏢 Evaluaciones de Cuartos de Comunicaciones</h2>
        <table>
          <thead>
            <tr>
              <th>Cuarto</th>
              <th>Ubicación</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Evaluador</th>
            </tr>
          </thead>
          <tbody>
            ${data.evaluations.map(eval => `
              <tr>
                <td>${eval.roomName}</td>
                <td>${eval.location}</td>
                <td><span class="priority-${eval.priority}">${this.getPriorityLabel(eval.priority)}</span></td>
                <td>${this.getStatusLabel(eval.status)}</td>
                <td>${eval.evaluatedAt.toLocaleDateString('es-ES')}</td>
                <td>${eval.evaluatedBy}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Equipos
    if (data.equipment && data.equipment.length > 0) {
      html += `
        <h2>🔧 Inventario de Equipos</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Marca/Modelo</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Ubicación</th>
              <th>Serie</th>
            </tr>
          </thead>
          <tbody>
            ${data.equipment.map(eq => `
              <tr>
                <td>${eq.name}</td>
                <td>${eq.brand} ${eq.model}</td>
                <td>${this.getCategoryLabel(eq.category)}</td>
                <td><span class="status-${eq.status}">${this.getStatusLabel(eq.status)}</span></td>
                <td>${eq.location}</td>
                <td>${eq.serialNumber}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    html += `
          </div>
          
          <div class="footer">
            <p>Reporte generado automáticamente por el Sistema de Evaluación de Infraestructura de Red</p>
            <p>© ${new Date().getFullYear()} - Todos los derechos reservados</p>
          </div>
        </body>
      </html>
    `;

    return html;
  }

  private async saveReportMetadata(type: ReportType, data: ReportData, filePath: string, filters?: ReportFilters): Promise<void> {
    try {
      const db = firebase().firestore();
      const report: Report = {
        title: this.getReportTitle(type),
        type,
        description: this.getReportDescription(type),
        generatedBy: 'current_user', // TODO: Get from auth service
        generatedAt: new Date(),
        data,
        filters,
        filePath,
        status: 'completed'
      };

      await db.collection('reports').add(report);
    } catch (error) {
      console.error('Error saving report metadata:', error);
    }
  }

  private getReportTitle(type: ReportType): string {
    const titles = {
      'evaluation_summary': 'Resumen de Evaluaciones',
      'equipment_inventory': 'Inventario de Equipos',
      'maintenance_schedule': 'Cronograma de Mantenimiento',
      'comprehensive': 'Reporte Integral'
    };
    return titles[type] || 'Reporte';
  }

  private getReportDescription(type: ReportType): string {
    const descriptions = {
      'evaluation_summary': 'Reporte detallado de todas las evaluaciones realizadas',
      'equipment_inventory': 'Inventario completo de equipos de red',
      'maintenance_schedule': 'Cronograma de mantenimientos programados',
      'comprehensive': 'Reporte integral con evaluaciones e inventario'
    };
    return descriptions[type] || 'Reporte del sistema';
  }

  private getPriorityLabel(priority: string): string {
    const labels = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'critical': 'Crítica'
    };
    return labels[priority] || priority;
  }

  private getStatusLabel(status: string): string {
    const labels = {
      'draft': 'Borrador',
      'completed': 'Completada',
      'archived': 'Archivada',
      'active': 'Activo',
      'inactive': 'Inactivo',
      'maintenance': 'Mantenimiento',
      'retired': 'Retirado',
      'faulty': 'Defectuoso'
    };
    return labels[status] || status;
  }

  private getCategoryLabel(category: string): string {
    const labels = {
      'router': 'Router',
      'switch': 'Switch',
      'server': 'Servidor',
      'firewall': 'Firewall',
      'ups': 'UPS',
      'cable': 'Cable',
      'access_point': 'Punto de Acceso',
      'modem': 'Módem',
      'other': 'Otro'
    };
    return labels[category] || category;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }
}
