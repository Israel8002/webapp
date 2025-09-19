import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <StackLayout *ngIf="visible" class="dialog-overlay">
      <StackLayout class="dialog-container">
        <Label text="⚠️" class="dialog-icon"></Label>
        <Label [text]="title" class="dialog-title"></Label>
        <Label [text]="message" class="dialog-message"></Label>
        <StackLayout orientation="horizontal" class="dialog-buttons">
          <Button [text]="cancelText" (tap)="onCancel()" class="cancel-button"></Button>
          <Button [text]="confirmText" (tap)="onConfirm()" class="confirm-button"></Button>
        </StackLayout>
      </StackLayout>
    </StackLayout>
  `,
  styles: [`
    .dialog-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .dialog-container {
      background-color: white;
      padding: 30px;
      border-radius: 15px;
      margin: 20px;
      min-width: 300px;
      text-align: center;
    }
    .dialog-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    .dialog-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    .dialog-message {
      font-size: 16px;
      color: #666;
      margin-bottom: 25px;
    }
    .dialog-buttons {
      flex-direction: row;
      justify-content: space-around;
    }
    .cancel-button {
      background-color: #6c757d;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      margin: 0 5px;
    }
    .confirm-button {
      background-color: #dc3545;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      margin: 0 5px;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible: boolean = false;
  @Input() title: string = 'Confirmar';
  @Input() message: string = '¿Estás seguro?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.visible = false;
  }

  onCancel() {
    this.cancel.emit();
    this.visible = false;
  }
}
