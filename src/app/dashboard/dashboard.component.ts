import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { EvaluationService } from '../services/evaluation.service';
import { EquipmentService } from '../services/equipment.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <ScrollView>
      <StackLayout class="dashboard-container">
        <!-- Header -->
        <StackLayout class="header">
          <Label text="📊 Dashboard" class="header-title"></Label>
          <Label [text]="'Bienvenido, ' + (currentUser?.displayName || 'Usuario')" class="header-subtitle"></Label>
        </StackLayout>

        <!-- Quick Actions -->
        <StackLayout class="quick-actions">
          <Label text="Acciones Rápidas" class="section-title"></Label>
          <StackLayout orientation="horizontal" class="action-buttons">
            <Button text="➕ Nueva Evaluación" (tap)="goToEvaluation()" class="action-button primary"></Button>
            <Button text="🔧 Agregar Equipo" (tap)="goToInventory()" class="action-button secondary"></Button>
          </StackLayout>
          <StackLayout orientation="horizontal" class="action-buttons">
            <Button text="📋 Ver Reportes" (tap)="goToReports()" class="action-button tertiary"></Button>
            <Button text="⚙️ Configuración" (tap)="goToSettings()" class="action-button quaternary"></Button>
          </StackLayout>
        </StackLayout>

        <!-- Statistics Cards -->
        <StackLayout class="stats-section">
          <Label text="Estadísticas Generales" class="section-title"></Label>
          
          <!-- Evaluations Stats -->
          <StackLayout class="stats-card">
            <Label text="📋 Evaluaciones" class="stats-title"></Label>
            <StackLayout orientation="horizontal" class="stats-row">
              <StackLayout class="stat-item">
                <Label [text]="evaluationStats.total" class="stat-number"></Label>
                <Label text="Total" class="stat-label"></Label>
              </StackLayout>
              <StackLayout class="stat-item">
                <Label [text]="evaluationStats.completed" class="stat-number completed"></Label>
                <Label text="Completadas" class="stat-label"></Label>
              </StackLayout>
              <StackLayout class="stat-item">
                <Label [text]="evaluationStats.critical" class="stat-number critical"></Label>
                <Label text="Críticas" class="stat-label"></Label>
              </StackLayout>
            </StackLayout>
            <Label [text]="'Tasa de finalización: ' + evaluationStats.completionRate + '%'" class="completion-rate"></Label>
          </StackLayout>

          <!-- Equipment Stats -->
          <StackLayout class="stats-card">
            <Label text="🔧 Equipos" class="stats-title"></Label>
            <StackLayout orientation="horizontal" class="stats-row">
              <StackLayout class="stat-item">
                <Label [text]="equipmentStats.total" class="stat-number"></Label>
                <Label text="Total" class="stat-label"></Label>
              </StackLayout>
              <StackLayout class="stat-item">
                <Label [text]="equipmentStats.active" class="stat-number active"></Label>
                <Label text="Activos" class="stat-label"></Label>
              </StackLayout>
              <StackLayout class="stat-item">
                <Label [text]="equipmentStats.maintenanceDue" class="stat-number maintenance"></Label>
                <Label text="Mantenimiento" class="stat-label"></Label>
              </StackLayout>
            </StackLayout>
            <Label [text]="'Activos: ' + equipmentStats.activePercentage + '%'" class="completion-rate"></Label>
          </StackLayout>
        </StackLayout>

        <!-- Recent Activity -->
        <StackLayout class="recent-activity">
          <Label text="Actividad Reciente" class="section-title"></Label>
          <StackLayout class="activity-list">
            <StackLayout *ngFor="let activity of recentActivities" class="activity-item">
              <Label [text]="activity.icon" class="activity-icon"></Label>
              <StackLayout class="activity-content">
                <Label [text]="activity.title" class="activity-title"></Label>
                <Label [text]="activity.description" class="activity-description"></Label>
                <Label [text]="activity.time" class="activity-time"></Label>
              </StackLayout>
            </StackLayout>
          </StackLayout>
        </StackLayout>

        <!-- Alerts -->
        <StackLayout class="alerts-section" *ngIf="alerts.length > 0">
          <Label text="⚠️ Alertas" class="section-title"></Label>
          <StackLayout *ngFor="let alert of alerts" class="alert-item" [class]="'alert-' + alert.type">
            <Label [text]="alert.message" class="alert-message"></Label>
            <Button *ngIf="alert.action" [text]="alert.actionText" (tap)="handleAlert(alert)" class="alert-action"></Button>
          </StackLayout>
        </StackLayout>

        <!-- Loading -->
        <app-loading [isLoading]="isLoading" message="Cargando dashboard..."></app-loading>
      </StackLayout>
    </ScrollView>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      background-color: #f8f9fa;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px;
      border-radius: 15px;
      margin-bottom: 20px;
      text-align: center;
    }
    .header-title {
      color: white;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .header-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin: 20px 0 15px 0;
    }
    .quick-actions {
      margin-bottom: 20px;
    }
    .action-buttons {
      margin-bottom: 10px;
    }
    .action-button {
      flex: 1;
      margin: 0 5px;
      padding: 15px;
      border-radius: 10px;
      font-weight: bold;
      text-align: center;
    }
    .action-button.primary {
      background-color: #28a745;
      color: white;
    }
    .action-button.secondary {
      background-color: #17a2b8;
      color: white;
    }
    .action-button.tertiary {
      background-color: #6f42c1;
      color: white;
    }
    .action-button.quaternary {
      background-color: #6c757d;
      color: white;
    }
    .stats-section {
      margin-bottom: 20px;
    }
    .stats-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .stats-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
    }
    .stats-row {
      justify-content: space-around;
      margin-bottom: 10px;
    }
    .stat-item {
      text-align: center;
    }
    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .stat-number.completed { color: #28a745; }
    .stat-number.critical { color: #dc3545; }
    .stat-number.active { color: #17a2b8; }
    .stat-number.maintenance { color: #ffc107; }
    .stat-label {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    .completion-rate {
      font-size: 14px;
      color: #666;
      text-align: center;
      margin-top: 10px;
    }
    .recent-activity {
      margin-bottom: 20px;
    }
    .activity-list {
      background: white;
      border-radius: 10px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .activity-item {
      flex-direction: row;
      padding: 10px 0;
      border-bottom-width: 1px;
      border-bottom-color: #eee;
    }
    .activity-icon {
      font-size: 20px;
      margin-right: 15px;
      width: 30px;
    }
    .activity-content {
      flex: 1;
    }
    .activity-title {
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .activity-description {
      color: #666;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .activity-time {
      color: #999;
      font-size: 12px;
    }
    .alerts-section {
      margin-bottom: 20px;
    }
    .alert-item {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .alert-warning {
      border-left-width: 4px;
      border-left-color: #ffc107;
      background-color: #fff3cd;
    }
    .alert-danger {
      border-left-width: 4px;
      border-left-color: #dc3545;
      background-color: #f8d7da;
    }
    .alert-info {
      border-left-width: 4px;
      border-left-color: #17a2b8;
      background-color: #d1ecf1;
    }
    .alert-message {
      flex: 1;
      color: #333;
      font-weight: 500;
    }
    .alert-action {
      background-color: #667eea;
      color: white;
      padding: 8px 16px;
      border-radius: 5px;
      font-size: 12px;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  evaluationStats: any = {};
  equipmentStats: any = {};
  recentActivities: any[] = [];
  alerts: any[] = [];
  isLoading: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private routerExtensions: RouterExtensions,
    private authService: AuthService,
    private evaluationService: EvaluationService,
    private equipmentService: EquipmentService
  ) {}

  async ngOnInit() {
    try {
      this.isLoading = true;
      
      // Load current user
      this.currentUser = this.authService.getCurrentUser();
      
      // Load statistics
      await this.loadStatistics();
      
      // Load recent activities
      this.loadRecentActivities();
      
      // Load alerts
      this.loadAlerts();
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private async loadStatistics() {
    try {
      this.evaluationStats = await this.evaluationService.getEvaluationStatistics();
      this.equipmentStats = await this.equipmentService.getEquipmentStatistics();
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  private loadRecentActivities() {
    // Mock data - in real app, this would come from a service
    this.recentActivities = [
      {
        icon: '📋',
        title: 'Nueva evaluación completada',
        description: 'Cuarto de Comunicaciones - Piso 3',
        time: 'Hace 2 horas'
      },
      {
        icon: '🔧',
        title: 'Equipo agregado al inventario',
        description: 'Router Cisco 2960 - Serie ABC123',
        time: 'Hace 4 horas'
      },
      {
        icon: '📊',
        title: 'Reporte generado',
        description: 'Reporte integral de infraestructura',
        time: 'Ayer'
      }
    ];
  }

  private loadAlerts() {
    this.alerts = [];
    
    // Check for critical evaluations
    if (this.evaluationStats.critical > 0) {
      this.alerts.push({
        type: 'danger',
        message: `${this.evaluationStats.critical} evaluaciones críticas requieren atención`,
        action: 'viewCritical',
        actionText: 'Ver'
      });
    }
    
    // Check for maintenance due
    if (this.equipmentStats.maintenanceDue > 0) {
      this.alerts.push({
        type: 'warning',
        message: `${this.equipmentStats.maintenanceDue} equipos requieren mantenimiento`,
        action: 'viewMaintenance',
        actionText: 'Ver'
      });
    }
  }

  handleAlert(alert: any) {
    switch (alert.action) {
      case 'viewCritical':
        this.routerExtensions.navigate(['/evaluation'], { queryParams: { filter: 'critical' } });
        break;
      case 'viewMaintenance':
        this.routerExtensions.navigate(['/inventory'], { queryParams: { filter: 'maintenance' } });
        break;
    }
  }

  goToEvaluation() {
    this.routerExtensions.navigate(['/evaluation']);
  }

  goToInventory() {
    this.routerExtensions.navigate(['/inventory']);
  }

  goToReports() {
    this.routerExtensions.navigate(['/report']);
  }

  goToSettings() {
    // TODO: Implement settings page
    alert('Configuración próximamente disponible');
  }
}
