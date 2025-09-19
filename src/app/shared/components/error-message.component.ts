import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <StackLayout *ngIf="error" class="error-container">
      <Label text="⚠️" class="error-icon"></Label>
      <Label [text]="error" class="error-text"></Label>
      <Button *ngIf="showRetry" text="Reintentar" (tap)="onRetry()" class="retry-button"></Button>
    </StackLayout>
  `,
  styles: [`
    .error-container {
      padding: 20px;
      margin: 10px;
      background-color: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      text-align: center;
    }
    .error-icon {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .error-text {
      color: #c33;
      font-size: 16px;
      margin-bottom: 15px;
    }
    .retry-button {
      background-color: #667eea;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() error: string | null = null;
  @Input() showRetry: boolean = false;

  onRetry() {
    // Emit retry event or call parent method
  }
}
