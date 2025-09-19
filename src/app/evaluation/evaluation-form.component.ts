import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../services/evaluation.service';
import { AuthService } from '../services/auth.service';
import { Evaluation, EvaluationCriteria } from '../models/evaluation.model';
import * as camera from '@nativescript/camera';

@Component({
  selector: 'app-evaluation-form',
  template: `
    <ScrollView>
      <StackLayout class="evaluation-container">
        <!-- Header -->
        <StackLayout class="header">
          <Label text="📋" class="header-icon"></Label>
          <Label text="Evaluación de Cuarto de Comunicaciones" class="header-title"></Label>
          <Label text="Documenta las condiciones del cuarto de red" class="header-subtitle"></Label>
        </StackLayout>

        <!-- Form -->
        <StackLayout class="form-container">
          <!-- Basic Information -->
          <Label text="Información Básica" class="section-title"></Label>
          
          <TextField 
            [(ngModel)]="evaluationForm.get('roomName')?.value"
            (ngModelChange)="evaluationForm.patchValue({roomName: $event})"
            hint="Nombre del Cuarto" 
            class="form-input"
            [class.error]="evaluationForm.get('roomName')?.invalid && evaluationForm.get('roomName')?.touched">
          </TextField>
          <Label *ngIf="evaluationForm.get('roomName')?.invalid && evaluationForm.get('roomName')?.touched" 
                 text="El nombre del cuarto es requerido" class="error-message"></Label>

          <TextField 
            [(ngModel)]="evaluationForm.get('location')?.value"
            (ngModelChange)="evaluationForm.patchValue({location: $event})"
            hint="Ubicación (Edificio, Piso)" 
            class="form-input"
            [class.error]="evaluationForm.get('location')?.invalid && evaluationForm.get('location')?.touched">
          </TextField>

          <TextField 
            [(ngModel)]="evaluationForm.get('building')?.value"
            (ngModelChange)="evaluationForm.patchValue({building: $event})"
            hint="Edificio" 
            class="form-input">
          </TextField>

          <TextField 
            [(ngModel)]="evaluationForm.get('floor')?.value"
            (ngModelChange)="evaluationForm.patchValue({floor: $event})"
            hint="Piso" 
            class="form-input">
          </TextField>

          <!-- Environmental Conditions -->
          <Label text="Condiciones Ambientales" class="section-title"></Label>
          
          <StackLayout orientation="horizontal" class="measurement-row">
            <TextField 
              [(ngModel)]="evaluationForm.get('temperature')?.value"
              (ngModelChange)="evaluationForm.patchValue({temperature: $event})"
              hint="Temperatura (°C)" 
              keyboardType="number"
              class="form-input measurement-input">
            </TextField>
            <TextField 
              [(ngModel)]="evaluationForm.get('humidity')?.value"
              (ngModelChange)="evaluationForm.patchValue({humidity: $event})"
              hint="Humedad (%)" 
              keyboardType="number"
              class="form-input measurement-input">
            </TextField>
          </StackLayout>

          <!-- Evaluation Criteria -->
          <Label text="Criterios de Evaluación" class="section-title"></Label>
          
          <StackLayout *ngFor="let criteria of evaluationCriteria" class="criteria-section">
            <Label [text]="criteria.name" class="criteria-title"></Label>
            <Label [text]="criteria.description" class="criteria-description"></Label>
            
            <StackLayout orientation="horizontal" class="criteria-options">
              <Button *ngFor="let option of criteria.options" 
                      [text]="option.description"
                      [class]="getCriteriaButtonClass(criteria.id, option.value)"
                      (tap)="selectCriteriaOption(criteria.id, option.value)"
                      class="criteria-option">
              </Button>
            </StackLayout>
          </StackLayout>

          <!-- Priority and Status -->
          <Label text="Prioridad y Estado" class="section-title"></Label>
          
          <StackLayout orientation="horizontal" class="priority-row">
            <Label text="Prioridad:" class="priority-label"></Label>
            <Button *ngFor="let priority of priorities" 
                    [text]="priority.label"
                    [class]="getPriorityButtonClass(priority.value)"
                    (tap)="selectPriority(priority.value)"
                    class="priority-option">
            </Button>
          </StackLayout>

          <!-- Photos Section -->
          <Label text="Fotografías" class="section-title"></Label>
          
          <StackLayout class="photos-section">
            <Button text="📷 Tomar Foto 1" (tap)="takePicture(1)" class="photo-button"></Button>
            <Image [src]="evaluation.photos[0]" *ngIf="evaluation.photos[0]" class="photo-preview"></Image>
            
            <Button text="📷 Tomar Foto 2" (tap)="takePicture(2)" class="photo-button"></Button>
            <Image [src]="evaluation.photos[1]" *ngIf="evaluation.photos[1]" class="photo-preview"></Image>
            
            <Button text="📷 Tomar Foto 3" (tap)="takePicture(3)" class="photo-button"></Button>
            <Image [src]="evaluation.photos[2]" *ngIf="evaluation.photos[2]" class="photo-preview"></Image>
          </StackLayout>

          <!-- Notes -->
          <Label text="Notas Adicionales" class="section-title"></Label>
          <TextView 
            [(ngModel)]="evaluationForm.get('notes')?.value"
            (ngModelChange)="evaluationForm.patchValue({notes: $event})"
            hint="Observaciones adicionales sobre la evaluación..." 
            class="notes-input"
            height="100">
          </TextView>

          <!-- Action Buttons -->
          <StackLayout class="action-buttons">
            <Button text="💾 Guardar Borrador" 
                    (tap)="saveDraft()" 
                    [isEnabled]="!isLoading"
                    class="draft-button">
            </Button>
            
            <Button text="✅ Completar Evaluación" 
                    (tap)="completeEvaluation()" 
                    [isEnabled]="!isLoading && evaluationForm.valid"
                    class="complete-button">
            </Button>
            
            <Button text="📊 Ver Reportes" 
                    (tap)="goToReports()" 
                    class="reports-button">
            </Button>
          </StackLayout>
        </StackLayout>

        <!-- Loading -->
        <app-loading [isLoading]="isLoading" [message]="loadingMessage"></app-loading>
        
        <!-- Error Message -->
        <app-error-message [error]="errorMessage" [showRetry]="true" (retry)="retryOperation()"></app-error-message>
      </StackLayout>
    </ScrollView>
  `,
  styles: [`
    .evaluation-container {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100%;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-top: 20px;
    }
    .header-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    .header-title {
      color: white;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .header-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 16px;
    }
    .form-container {
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 25px 0 15px 0;
      padding-bottom: 5px;
      border-bottom-width: 2px;
      border-bottom-color: #667eea;
    }
    .form-input {
      padding: 15px;
      border-width: 2px;
      border-color: #e0e0e0;
      border-radius: 10px;
      margin-bottom: 10px;
      font-size: 16px;
      background-color: #f8f9fa;
    }
    .form-input.error {
      border-color: #dc3545;
      background-color: #fff5f5;
    }
    .error-message {
      color: #dc3545;
      font-size: 14px;
      margin-bottom: 15px;
      margin-left: 5px;
    }
    .measurement-row {
      margin-bottom: 10px;
    }
    .measurement-input {
      flex: 1;
      margin: 0 5px;
    }
    .criteria-section {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 10px;
    }
    .criteria-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .criteria-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    .criteria-options {
      flex-wrap: wrap;
    }
    .criteria-option {
      flex: 1;
      margin: 5px;
      padding: 10px;
      border-radius: 8px;
      font-size: 12px;
      text-align: center;
      background-color: #e9ecef;
      color: #495057;
    }
    .criteria-option.selected {
      background-color: #667eea;
      color: white;
    }
    .priority-row {
      align-items: center;
      margin-bottom: 20px;
    }
    .priority-label {
      font-weight: bold;
      color: #333;
      margin-right: 15px;
    }
    .priority-option {
      flex: 1;
      margin: 0 5px;
      padding: 10px;
      border-radius: 8px;
      font-size: 12px;
      text-align: center;
      background-color: #e9ecef;
      color: #495057;
    }
    .priority-option.selected {
      background-color: #dc3545;
      color: white;
    }
    .priority-option.selected.medium {
      background-color: #ffc107;
      color: #333;
    }
    .priority-option.selected.low {
      background-color: #28a745;
      color: white;
    }
    .priority-option.selected.high {
      background-color: #fd7e14;
      color: white;
    }
    .photos-section {
      margin-bottom: 20px;
    }
    .photo-button {
      background-color: #17a2b8;
      color: white;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .photo-preview {
      width: 100%;
      height: 150px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .notes-input {
      padding: 15px;
      border-width: 2px;
      border-color: #e0e0e0;
      border-radius: 10px;
      font-size: 16px;
      background-color: #f8f9fa;
    }
    .action-buttons {
      margin-top: 30px;
    }
    .draft-button {
      background-color: #6c757d;
      color: white;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .complete-button {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .reports-button {
      background-color: #6f42c1;
      color: white;
      padding: 15px;
      border-radius: 10px;
      font-weight: bold;
    }
  `]
})
export class EvaluationFormComponent implements OnInit {
  evaluationForm: FormGroup;
  evaluation: Evaluation;
  evaluationCriteria: EvaluationCriteria[] = [];
  priorities = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' }
  ];
  
  isLoading: boolean = false;
  errorMessage: string | null = null;
  loadingMessage: string = 'Procesando...';

  constructor(
    private routerExtensions: RouterExtensions,
    private evaluationService: EvaluationService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.evaluation = this.initializeEvaluation();
    this.evaluationForm = this.createForm();
  }

  ngOnInit() {
    this.evaluationCriteria = this.evaluationService.getEvaluationCriteria();
  }

  private initializeEvaluation(): Evaluation {
    const currentUser = this.authService.getCurrentUser();
    return {
      roomName: '',
      location: '',
      building: '',
      floor: '',
      conditions: '',
      temperature: undefined,
      humidity: undefined,
      powerSupply: 'stable',
      ventilation: 'adequate',
      security: 'excellent',
      cleanliness: 'excellent',
      photos: [],
      notes: '',
      evaluatedBy: currentUser?.uid || '',
      evaluatedAt: new Date(),
      status: 'draft',
      priority: 'medium'
    };
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      roomName: ['', [Validators.required]],
      location: ['', [Validators.required]],
      building: [''],
      floor: [''],
      temperature: [''],
      humidity: [''],
      notes: ['']
    });
  }

  selectCriteriaOption(criteriaId: string, value: string) {
    this.evaluation[criteriaId as keyof Evaluation] = value as any;
  }

  selectPriority(priority: string) {
    this.evaluation.priority = priority as any;
  }

  getCriteriaButtonClass(criteriaId: string, value: string): string {
    const currentValue = this.evaluation[criteriaId as keyof Evaluation];
    return currentValue === value ? 'criteria-option selected' : 'criteria-option';
  }

  getPriorityButtonClass(priority: string): string {
    const baseClass = this.evaluation.priority === priority ? 'priority-option selected' : 'priority-option';
    return priority === 'critical' ? `${baseClass} critical` : baseClass;
  }

  async takePicture(photoIndex: number) {
    try {
      this.isLoading = true;
      this.loadingMessage = 'Preparando cámara...';

      const options = {
        width: 800,
        height: 600,
        keepAspectRatio: true,
        saveToGallery: false
      };
      
      const imageAsset = await camera.takePicture(options);
      
      this.loadingMessage = 'Subiendo foto...';
      const photoUrl = await this.evaluationService.uploadPhoto(imageAsset, 'temp', photoIndex);
      
      // Ensure photos array has enough elements
      while (this.evaluation.photos.length <= photoIndex) {
        this.evaluation.photos.push('');
      }
      
      this.evaluation.photos[photoIndex] = photoUrl;
      
    } catch (error) {
      console.error('Error taking picture:', error);
      this.errorMessage = 'Error al tomar la foto. Intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  async saveDraft() {
    try {
      this.isLoading = true;
      this.loadingMessage = 'Guardando borrador...';
      this.errorMessage = null;

      this.evaluation.status = 'draft';
      await this.evaluationService.createEvaluation(this.evaluation);
      
      alert('Borrador guardado exitosamente');
    } catch (error) {
      console.error('Error saving draft:', error);
      this.errorMessage = 'Error al guardar el borrador';
    } finally {
      this.isLoading = false;
    }
  }

  async completeEvaluation() {
    if (this.evaluationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    try {
      this.isLoading = true;
      this.loadingMessage = 'Completando evaluación...';
      this.errorMessage = null;

      this.evaluation.status = 'completed';
      this.evaluation.evaluatedAt = new Date();
      
      await this.evaluationService.createEvaluation(this.evaluation);
      
      alert('Evaluación completada exitosamente');
      this.resetForm();
    } catch (error) {
      console.error('Error completing evaluation:', error);
      this.errorMessage = 'Error al completar la evaluación';
    } finally {
      this.isLoading = false;
    }
  }

  goToReports() {
    this.routerExtensions.navigate(['/report']);
  }

  retryOperation() {
    this.errorMessage = null;
  }

  private resetForm() {
    this.evaluation = this.initializeEvaluation();
    this.evaluationForm.reset();
  }

  private markFormGroupTouched() {
    Object.keys(this.evaluationForm.controls).forEach(key => {
      const control = this.evaluationForm.get(key);
      control?.markAsTouched();
    });
  }
}