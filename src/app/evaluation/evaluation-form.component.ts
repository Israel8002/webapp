import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import * as camera from '@nativescript/camera';

@Component({
  selector: 'app-evaluation-form',
  template: `
    <ScrollView>
      <StackLayout class="p-4">
        <Label text="Evaluación de Cuarto de Comunicaciones" class="text-2xl font-bold mb-4"></Label>
        
        <TextField [(ngModel)]="evaluation.roomName" hint="Nombre del Cuarto" class="mb-2 p-2 border rounded"></TextField>
        <TextView [(ngModel)]="evaluation.conditions" hint="Condiciones del Cuarto" class="mb-2 p-2 border rounded" height="100"></TextView>
        
        <Button text="Tomar Foto 1" (tap)="takePicture(1)" class="mb-2 bg-blue-500 text-white p-2 rounded"></Button>
        <Image [src]="evaluation.photo1" *ngIf="evaluation.photo1" class="mb-2 w-full h-40"></Image>
        
        <Button text="Tomar Foto 2" (tap)="takePicture(2)" class="mb-2 bg-blue-500 text-white p-2 rounded"></Button>
        <Image [src]="evaluation.photo2" *ngIf="evaluation.photo2" class="mb-2 w-full h-40"></Image>
        
        <Button text="Guardar Evaluación" (tap)="saveEvaluation()" class="mb-2 bg-green-500 text-white p-2 rounded"></Button>
        <Button text="Ir al Inventario" (tap)="goToInventory()" class="bg-gray-300 p-2 rounded"></Button>
      </StackLayout>
    </ScrollView>
  `
})
export class EvaluationFormComponent {
  evaluation = {
    roomName: '',
    conditions: '',
    photo1: '',
    photo2: ''
  };

  constructor(private routerExtensions: RouterExtensions) {}

  async takePicture(photoNumber: number) {
    try {
      const options = {
        width: 300,
        height: 300,
        keepAspectRatio: true,
        saveToGallery: false
      };
      const imageAsset = await camera.takePicture(options);
      this.evaluation[`photo${photoNumber}`] = imageAsset;
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Failed to take picture. Please try again.');
    }
  }

  async saveEvaluation() {
    try {
      const db = firebase().firestore();
      await db.collection('evaluations').add(this.evaluation);
      alert('Evaluación guardada exitosamente.');
      this.evaluation = { roomName: '', conditions: '', photo1: '', photo2: '' };
    } catch (error) {
      console.error('Error saving evaluation:', error);
      alert('Failed to save evaluation. Please try again.');
    }
  }

  goToInventory() {
    this.routerExtensions.navigate(['/inventory']);
  }
}