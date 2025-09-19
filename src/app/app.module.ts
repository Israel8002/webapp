import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular';
import { NativeScriptFormsModule } from '@nativescript/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Auth Components
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Evaluation Components
import { EvaluationFormComponent } from './evaluation/evaluation-form.component';

// Inventory Components
import { InventoryComponent } from './inventory/inventory.component';

// Report Components
import { ReportComponent } from './report/report.component';

// Shared Components
import { LoadingComponent } from './shared/components/loading.component';
import { ErrorMessageComponent } from './shared/components/error-message.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog.component';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    EvaluationFormComponent,
    InventoryComponent,
    ReportComponent,
    LoadingComponent,
    ErrorMessageComponent,
    ConfirmDialogComponent,
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}