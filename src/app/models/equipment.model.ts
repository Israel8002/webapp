export interface Equipment {
  id?: string;
  name: string;
  model: string;
  brand: string;
  serialNumber: string;
  macAddress?: string;
  ipAddress?: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  location: string;
  roomId?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  notes?: string;
  photos: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EquipmentCategory = 
  | 'router' 
  | 'switch' 
  | 'server' 
  | 'firewall' 
  | 'ups' 
  | 'cable' 
  | 'access_point' 
  | 'modem' 
  | 'other';

export type EquipmentStatus = 
  | 'active' 
  | 'inactive' 
  | 'maintenance' 
  | 'retired' 
  | 'faulty';

export interface EquipmentFilter {
  category?: EquipmentCategory;
  status?: EquipmentStatus;
  location?: string;
  searchTerm?: string;
}
