import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <StackLayout *ngIf="isLoading" class="loading-container">
      <ActivityIndicator [busy]="true" class="loading-spinner"></ActivityIndicator>
      <Label [text]="message" class="loading-message"></Label>
    </StackLayout>
  `,
  styles: [`
    .loading-container {
      padding: 40px;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 10px;
    }
    .loading-spinner {
      color: #667eea;
      width: 50;
      height: 50;
    }
    .loading-message {
      margin-top: 15px;
      color: #666;
      font-size: 16px;
    }
  `]
})
export class LoadingComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Cargando...';
}
