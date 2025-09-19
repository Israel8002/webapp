import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import '@nativescript/firebase-storage';
import { Equipment, EquipmentCategory, EquipmentStatus, EquipmentFilter } from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private equipmentSubject = new BehaviorSubject<Equipment[]>([]);
  public equipment$ = this.equipmentSubject.asObservable();

  constructor() {
    this.loadEquipment();
  }

  async createEquipment(equipment: Equipment): Promise<string> {
    try {
      const db = firebase().firestore();
      const equipmentData = {
        ...equipment,
        id: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await db.collection('equipment').add(equipmentData);
      await this.loadEquipment();
      return docRef.id;
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw error;
    }
  }

  async updateEquipment(id: string, equipment: Partial<Equipment>): Promise<void> {
    try {
      const db = firebase().firestore();
      await db.collection('equipment').doc(id).update({
        ...equipment,
        updatedAt: new Date()
      });
      await this.loadEquipment();
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }
  }

  async deleteEquipment(id: string): Promise<void> {
    try {
      const db = firebase().firestore();
      await db.collection('equipment').doc(id).delete();
      await this.loadEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      throw error;
    }
  }

  async getEquipment(id: string): Promise<Equipment | null> {
    try {
      const db = firebase().firestore();
      const doc = await db.collection('equipment').doc(id).get();
      
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as Equipment;
      }
      return null;
    } catch (error) {
      console.error('Error getting equipment:', error);
      throw error;
    }
  }

  async searchEquipment(filter: EquipmentFilter): Promise<Equipment[]> {
    try {
      let query = firebase().firestore().collection('equipment');

      if (filter.category) {
        query = query.where('category', '==', filter.category);
      }

      if (filter.status) {
        query = query.where('status', '==', filter.status);
      }

      if (filter.location) {
        query = query.where('location', '==', filter.location);
      }

      const snapshot = await query.get();
      let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));

      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        results = results.filter(equipment => 
          equipment.name.toLowerCase().includes(searchTerm) ||
          equipment.model.toLowerCase().includes(searchTerm) ||
          equipment.brand.toLowerCase().includes(searchTerm) ||
          equipment.serialNumber.toLowerCase().includes(searchTerm) ||
          (equipment.macAddress && equipment.macAddress.toLowerCase().includes(searchTerm))
        );
      }

      return results;
    } catch (error) {
      console.error('Error searching equipment:', error);
      throw error;
    }
  }

  async getEquipmentByCategory(category: EquipmentCategory): Promise<Equipment[]> {
    try {
      const db = firebase().firestore();
      const snapshot = await db.collection('equipment')
        .where('category', '==', category)
        .orderBy('name')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
    } catch (error) {
      console.error('Error getting equipment by category:', error);
      throw error;
    }
  }

  async getEquipmentByStatus(status: EquipmentStatus): Promise<Equipment[]> {
    try {
      const db = firebase().firestore();
      const snapshot = await db.collection('equipment')
        .where('status', '==', status)
        .orderBy('name')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
    } catch (error) {
      console.error('Error getting equipment by status:', error);
      throw error;
    }
  }

  async getMaintenanceDue(): Promise<Equipment[]> {
    try {
      const now = new Date();
      const db = firebase().firestore();
      const snapshot = await db.collection('equipment')
        .where('nextMaintenance', '<=', now)
        .where('status', '!=', 'retired')
        .orderBy('nextMaintenance')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
    } catch (error) {
      console.error('Error getting maintenance due equipment:', error);
      throw error;
    }
  }

  async uploadPhoto(imageAsset: any, equipmentId: string): Promise<string> {
    try {
      const storage = firebase().storage();
      const fileName = `equipment_${equipmentId}_${Date.now()}.jpg`;
      const ref = storage.ref().child(`equipment/${fileName}`);
      
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

  async getEquipmentStatistics(): Promise<any> {
    try {
      const equipment = this.equipmentSubject.value;
      const total = equipment.length;
      const active = equipment.filter(e => e.status === 'active').length;
      const maintenance = equipment.filter(e => e.status === 'maintenance').length;
      const faulty = equipment.filter(e => e.status === 'faulty').length;
      const retired = equipment.filter(e => e.status === 'retired').length;

      const maintenanceDue = equipment.filter(e => {
        if (!e.nextMaintenance) return false;
        const now = new Date();
        const maintenanceDate = e.nextMaintenance;
        return maintenanceDate <= now && e.status !== 'retired';
      }).length;

      const categories = equipment.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      return {
        total,
        active,
        maintenance,
        faulty,
        retired,
        maintenanceDue,
        categories,
        activePercentage: total > 0 ? (active / total) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting equipment statistics:', error);
      throw error;
    }
  }

  getEquipmentCategories(): { value: EquipmentCategory; label: string }[] {
    return [
      { value: 'router', label: 'Router' },
      { value: 'switch', label: 'Switch' },
      { value: 'server', label: 'Servidor' },
      { value: 'firewall', label: 'Firewall' },
      { value: 'ups', label: 'UPS' },
      { value: 'cable', label: 'Cable' },
      { value: 'access_point', label: 'Punto de Acceso' },
      { value: 'modem', label: 'Módem' },
      { value: 'other', label: 'Otro' }
    ];
  }

  getEquipmentStatuses(): { value: EquipmentStatus; label: string }[] {
    return [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'maintenance', label: 'Mantenimiento' },
      { value: 'retired', label: 'Retirado' },
      { value: 'faulty', label: 'Defectuoso' }
    ];
  }

  private async loadEquipment(): Promise<void> {
    try {
      const db = firebase().firestore();
      const snapshot = await db.collection('equipment')
        .orderBy('name')
        .get();
      
      const equipment = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Equipment));
      
      this.equipmentSubject.next(equipment);
    } catch (error) {
      console.error('Error loading equipment:', error);
    }
  }
}
