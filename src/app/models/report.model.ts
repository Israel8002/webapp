export interface Report {
  id?: string;
  title: string;
  type: ReportType;
  description: string;
  generatedBy: string;
  generatedAt: Date;
  data: ReportData;
  filters?: ReportFilters;
  filePath?: string;
  status: 'generating' | 'completed' | 'failed';
}

export type ReportType = 
  | 'evaluation_summary' 
  | 'equipment_inventory' 
  | 'maintenance_schedule' 
  | 'comprehensive';

export interface ReportData {
  evaluations?: any[];
  equipment?: any[];
  statistics?: ReportStatistics;
}

export interface ReportStatistics {
  totalEvaluations: number;
  totalEquipment: number;
  criticalIssues: number;
  maintenanceDue: number;
  averageScore: number;
}

export interface ReportFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  locations?: string[];
  categories?: string[];
  status?: string[];
}
