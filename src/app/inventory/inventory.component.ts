import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';

@Component({
  selector: 'app-inventory',
  template: `
    <ScrollView>
      <StackLayout class="p-4">
        <Label text="Inventario de Equipos" class="text-2xl font-bold mb-4"></Label>
        
        <TextField [(ngModel)]="equipment.name" hint="Nombre del Equipo" class="mb-2 p-2 border rounded"></TextField>
        <TextField [(ngModel)]="equipment.serialNumber" hint="Número de Serie" class="mb-2 p-2 border rounded"></TextField>
        <TextField [(ngModel)]="equipment.macAddress" hint="Dirección MAC" class="mb-2 p-2 border rounded"></TextField>
        
        <Button text="Agregar Equipo" (tap)="addEquipment()" class="mb-2 bg-green-500 text-white p-2 rounded"></Button>
        
        <Label text="Equipos Registrados:" class="text-xl font-bold mt-4 mb-2"></Label>
        <ListView [items]="equipmentList" class="mb-4">
          <ng-template let-item="item">
            <StackLayout class="p-2 border-b">
              <Label [text]="'Nombre: ' + item.name" class="font-bold"></Label>
              <Label [text]="'Serie: ' + item.serialNumber"></Label>
              <Label [text]="'MAC: ' + item.macAddress"></Label>
            </StackLayout>
          </ng-template>
        </ListView>
        
        <Button text="Generar Reporte" (tap)="generateReport()" class="bg-blue-500 text-white p-2 rounded"></Button>
      </StackLayout>
    </ScrollView>
  `
})
export class InventoryComponent {
  equipment = {
    name: '',
    serialNumber: '',
    macAddress: ''
  };
  equipmentList = [];

  constructor(private routerExtensions: RouterExtensions) {
    this.loadEquipment();
  }

  async loadEquipment() {
    try {
      const db = firebase().firestore();
      const snapshot = await db.collection('equipment').get();
      this.equipmentList = snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error loading equipment:', error);
      alert('Failed to load equipment. Please try again.');
    }
  }

  async addEquipment() {
    try {
      const db = firebase().firestore();
      await db.collection('equipment').add(this.equipment);
      this.equipmentList.push(this.equipment);
      this.equipment = { name: '', serialNumber: '', macAddress: '' };
      alert('Equipo agregado exitosamente.');
    } catch (error) {
      console.error('Error adding equipment:', error);
      alert('Failed to add equipment. Please try again.');
    }
  }

  generateReport() {
    this.routerExtensions.navigate(['/report']);
  }
}