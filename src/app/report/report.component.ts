import { Component, OnInit } from '@angular/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import * as pdfGeneration from 'nativescript-pdf-generation';
import { File, Folder, knownFolders, path } from '@nativescript/core';

@Component({
  selector: 'app-report',
  template: `
    <StackLayout class="p-4">
      <Label text="Generación de Reporte" class="text-2xl font-bold mb-4"></Label>
      <Button text="Generar Reporte PDF" (tap)="generatePDF()" class="bg-blue-500 text-white p-2 rounded"></Button>
    </StackLayout>
  `
})
export class ReportComponent implements OnInit {
  evaluations = [];
  equipment = [];

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const db = firebase().firestore();
    const evaluationsSnapshot = await db.collection('evaluations').get();
    this.evaluations = evaluationsSnapshot.docs.map(doc => doc.data());
    const equipmentSnapshot = await db.collection('equipment').get();
    this.equipment = equipmentSnapshot.docs.map(doc => doc.data());
  }

  async generatePDF() {
    const htmlContent = this.generateHTMLContent();
    try {
      const pdfPath = path.join(knownFolders.documents().path, "reporte.pdf");
      await pdfGeneration.generatePdf(htmlContent, pdfPath);
      alert(`Reporte PDF generado exitosamente. Guardado en: ${pdfPath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  generateHTMLContent(): string {
    let html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            h1, h2 { color: #333; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Reporte de Evaluación de Cuartos de Comunicaciones</h1>
          
          <h2>Evaluaciones</h2>
          <table>
            <tr>
              <th>Nombre del Cuarto</th>
              <th>Condiciones</th>
            </tr>
            ${this.evaluations.map(eval => `
              <tr>
                <td>${eval.roomName}</td>
                <td>${eval.conditions}</td>
              </tr>
            `).join('')}
          </table>
          
          <h2>Inventario de Equipos</h2>
          <table>
            <tr>
              <th>Nombre</th>
              <th>Número de Serie</th>
              <th>Dirección MAC</th>
            </tr>
            ${this.equipment.map(eq => `
              <tr>
                <td>${eq.name}</td>
                <td>${eq.serialNumber}</td>
                <td>${eq.macAddress}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    return html;
  }
}