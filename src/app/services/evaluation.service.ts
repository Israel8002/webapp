import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import '@nativescript/firebase-storage';
import { Evaluation, EvaluationCriteria } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private evaluationsSubject = new BehaviorSubject<Evaluation[]>([]);
  public evaluations$ = this.evaluationsSubject.asObservable();

  constructor() {
    this.loadEvaluations();
  }

  async createEvaluation(evaluation: Evaluation): Promise<string> {
    try {
      const db = firebase().firestore();
      const evaluationData = {
        ...evaluation,
        id: undefined,
        evaluatedAt: new Date(),
        status: 'draft'
      };
      
      const docRef = await db.collection('evaluations').add(evaluationData);
      await this.loadEvaluations();
      return docRef.id;
    } catch (error) {
      console.error('Error creating evaluation:', error);
      throw error;
    }
  }

  async updateEvaluation(id: string, evaluation: Partial<Evaluation>): Promise<void> {
    try {
      const db = firebase().firestore();
      await db.collection('evaluations').doc(id).update({
        ...evaluation,
        updatedAt: new Date()
      });
      await this.loadEvaluations();
    } catch (error) {
      console.error('Error updating evaluation:', error);
      throw error;
    }
  }

  async deleteEvaluation(id: string): Promise<void> {
    try {
      const db = firebase().firestore();
      await db.collection('evaluations').doc(id).delete();
      await this.loadEvaluations();
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      throw error;
    }
  }

  async getEvaluation(id: string): Promise<Evaluation | null> {
    try {
      const db = firebase().firestore();
      const doc = await db.collection('evaluations').doc(id).get();
      
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as Evaluation;
      }
      return null;
    } catch (error) {
      console.error('Error getting evaluation:', error);
      throw error;
    }
  }

  async uploadPhoto(imageAsset: any, evaluationId: string, photoIndex: number): Promise<string> {
    try {
      const storage = firebase().storage();
      const fileName = `evaluation_${evaluationId}_photo_${photoIndex}_${Date.now()}.jpg`;
      const ref = storage.ref().child(`evaluations/${fileName}`);
      
      const response = await fetch(imageAsset.android || imageAsset.ios);
      const blob = await response.blob();
      
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  async getEvaluationsByLocation(location: string): Promise<Evaluation[]> {
    try {
      const db = firebase().firestore();
      const snapshot = await db.collection('evaluations')
        .where('location', '==', location)
        .orderBy('evaluatedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Evaluation));
    } catch (error) {
      console.error('Error getting evaluations by location:', error);
      throw error;
    }
  }

  async getEvaluationsByStatus(status: string): Promise<Evaluation[]> {
    try {
      const db = firebase().firestore();
      const snapshot = await db.collection('evaluations')
        .where('status', '==', status)
        .orderBy('evaluatedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Evaluation));
    } catch (error) {
      console.error('Error getting evaluations by status:', error);
      throw error;
    }
  }

  async getEvaluationStatistics(): Promise<any> {
    try {
      const evaluations = this.evaluationsSubject.value;
      const total = evaluations.length;
      const completed = evaluations.filter(e => e.status === 'completed').length;
      const critical = evaluations.filter(e => e.priority === 'critical').length;
      const thisMonth = evaluations.filter(e => {
        const now = new Date();
        const evalDate = e.evaluatedAt;
        return evalDate.getMonth() === now.getMonth() && evalDate.getFullYear() === now.getFullYear();
      }).length;

      return {
        total,
        completed,
        critical,
        thisMonth,
        completionRate: total > 0 ? (completed / total) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting evaluation statistics:', error);
      throw error;
    }
  }

  private async loadEvaluations(): Promise<void> {
    try {
      const db = firebase().firestore();
      const snapshot = await db.collection('evaluations')
        .orderBy('evaluatedAt', 'desc')
        .get();
      
      const evaluations = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Evaluation));
      
      this.evaluationsSubject.next(evaluations);
    } catch (error) {
      console.error('Error loading evaluations:', error);
    }
  }

  getEvaluationCriteria(): EvaluationCriteria[] {
    return [
      {
        id: 'power_supply',
        name: 'Suministro Eléctrico',
        description: 'Calidad y estabilidad del suministro eléctrico',
        weight: 25,
        options: [
          { value: 'stable', score: 10, description: 'Estable con respaldo' },
          { value: 'unstable', score: 5, description: 'Inestable sin respaldo' },
          { value: 'backup', score: 8, description: 'Con respaldo limitado' }
        ]
      },
      {
        id: 'ventilation',
        name: 'Ventilación',
        description: 'Adecuación del sistema de ventilación',
        weight: 20,
        options: [
          { value: 'adequate', score: 10, description: 'Adecuada' },
          { value: 'insufficient', score: 3, description: 'Insuficiente' },
          { value: 'excessive', score: 7, description: 'Excesiva' }
        ]
      },
      {
        id: 'security',
        name: 'Seguridad',
        description: 'Nivel de seguridad del cuarto',
        weight: 20,
        options: [
          { value: 'excellent', score: 10, description: 'Excelente' },
          { value: 'good', score: 8, description: 'Buena' },
          { value: 'fair', score: 5, description: 'Regular' },
          { value: 'poor', score: 2, description: 'Mala' }
        ]
      },
      {
        id: 'cleanliness',
        name: 'Limpieza',
        description: 'Estado de limpieza y orden',
        weight: 15,
        options: [
          { value: 'excellent', score: 10, description: 'Excelente' },
          { value: 'good', score: 8, description: 'Buena' },
          { value: 'fair', score: 5, description: 'Regular' },
          { value: 'poor', score: 2, description: 'Mala' }
        ]
      }
    ];
  }
}
