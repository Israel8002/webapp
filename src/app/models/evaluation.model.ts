export interface Evaluation {
  id?: string;
  roomName: string;
  location: string;
  building: string;
  floor: string;
  conditions: string;
  temperature?: number;
  humidity?: number;
  powerSupply: 'stable' | 'unstable' | 'backup';
  ventilation: 'adequate' | 'insufficient' | 'excessive';
  security: 'excellent' | 'good' | 'fair' | 'poor';
  cleanliness: 'excellent' | 'good' | 'fair' | 'poor';
  photos: string[];
  notes?: string;
  evaluatedBy: string;
  evaluatedAt: Date;
  status: 'draft' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  options: {
    value: string;
    score: number;
    description: string;
  }[];
}
