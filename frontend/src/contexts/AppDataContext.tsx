import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Room, Storage, Area, Landmark, Item, Category, PersonLabel } from '../types';
import { fetchByHomeId, fetchAll, addDocument, updateDocument, deleteDocument, COLLECTIONS } from '../lib/db';

interface AppDataContextType {
  rooms: Room[];
  storages: Storage[];
  areas: Area[];
  landmarks: Landmark[];
  items: Item[];
  categories: Category[];
  personLabels: PersonLabel[];
  loading: boolean;
  addRoom: (room: Omit<Room, 'id' | 'homeId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateRoom: (id: string, room: Partial<Room>) => Promise<void>;
  addItem: (item: Omit<Item, 'id' | 'homeId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addStorage: (storage: Omit<Storage, 'id' | 'createdAt'>) => Promise<string>;
  updateStorage: (id: string, storage: Partial<Storage>) => Promise<void>;
  deleteStorage: (id: string) => Promise<void>;
  addLandmark: (landmark: Omit<Landmark, 'id' | 'createdAt'>) => Promise<string>;
  updateLandmark: (id: string, landmark: Partial<Landmark>) => Promise<void>;
  deleteLandmark: (id: string) => Promise<void>;
  // TODO: 必要に応じて updateItem, deleteItem 等を追加
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [storages, setStorages] = useState<Storage[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [personLabels, setPersonLabels] = useState<PersonLabel[]>([]);
  const [loading, setLoading] = useState(true);

  // MVPでは「1ユーザー=1家」として固定IDを使用
  const homeId = 'h1';

  const loadData = async () => {
    try {
      setLoading(true);
      // homeIdでフィルタリングするもの
      const [fetchedRooms, fetchedItems, fetchedCategories, fetchedPersonLabels] = await Promise.all([
        fetchByHomeId<Room>(COLLECTIONS.ROOMS, homeId),
        fetchByHomeId<Item>(COLLECTIONS.ITEMS, homeId),
        fetchByHomeId<Category>(COLLECTIONS.CATEGORIES, homeId),
        fetchByHomeId<PersonLabel>(COLLECTIONS.PERSON_LABELS, homeId),
      ]);

      // StorageとArea、LandmarkはMVPでは全件取得（必要に応じてRoomId等でフィルタリング）
      const [fetchedStorages, fetchedAreas, fetchedLandmarks] = await Promise.all([
        fetchAll<Storage>(COLLECTIONS.STORAGES),
        fetchAll<Area>(COLLECTIONS.AREAS),
        fetchAll<Landmark>(COLLECTIONS.LANDMARKS),
      ]);

      setRooms(fetchedRooms);
      setItems(fetchedItems);
      setCategories(fetchedCategories);
      setPersonLabels(fetchedPersonLabels);
      setStorages(fetchedStorages);
      setAreas(fetchedAreas);
      setLandmarks(fetchedLandmarks);
    } catch (error) {
      console.error("Failed to load data from Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addRoom = async (roomData: Omit<Room, 'id' | 'homeId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `r${Date.now()}`;
    const newRoom: Room = {
      ...roomData,
      id,
      homeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const storageId = `s${Date.now()}`;
    const newStorage: Storage = {
      id: storageId,
      roomId: id,
      name: '収納1',
      position: { x: 10, y: 10, width: 80, height: 60 },
      createdAt: new Date().toISOString()
    };
    
    // 楽観的UI更新（先にローカルを更新）
    setRooms(prev => [...prev, newRoom]);
    setStorages(prev => [...prev, newStorage]);
    
    try {
      await addDocument(COLLECTIONS.ROOMS, id, newRoom);
      await addDocument(COLLECTIONS.STORAGES, storageId, newStorage);
      return id;
    } catch (error) {
      console.error("Failed to add room or storage:", error);
      // エラー時はローカルを元に戻す等の処理が必要だが今回は省略
      await loadData();
      throw error;
    }
  };

  const addItem = async (itemData: Omit<Item, 'id' | 'homeId' | 'createdAt' | 'updatedAt'>) => {
    const id = `i${Date.now()}`;
    const newItem: Item = {
      ...itemData,
      id,
      homeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setItems(prev => [...prev, newItem]);

    try {
      await addDocument(COLLECTIONS.ITEMS, id, newItem);
    } catch (error) {
      console.error("Failed to add item:", error);
      await loadData();
    }
  };

  const updateRoom = async (id: string, roomData: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...roomData, updatedAt: new Date().toISOString() } : r));
    try {
      await updateDocument(COLLECTIONS.ROOMS, id, { ...roomData, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Failed to update room:", error);
      await loadData();
    }
  };

  const addStorage = async (storageData: Omit<Storage, 'id' | 'createdAt'>): Promise<string> => {
    const id = `s${Date.now()}`;
    const newStorage: Storage = {
      ...storageData,
      id,
      createdAt: new Date().toISOString()
    };
    setStorages(prev => [...prev, newStorage]);
    try {
      await addDocument(COLLECTIONS.STORAGES, id, newStorage);
      return id;
    } catch (error) {
      console.error("Failed to add storage:", error);
      await loadData();
      throw error;
    }
  };

  const updateStorage = async (id: string, storageData: Partial<Storage>) => {
    setStorages(prev => prev.map(s => s.id === id ? { ...s, ...storageData } : s));
    try {
      await updateDocument(COLLECTIONS.STORAGES, id, storageData);
    } catch (error) {
      console.error("Failed to update storage:", error);
      await loadData();
    }
  };

  const deleteStorage = async (id: string) => {
    setStorages(prev => prev.filter(s => s.id !== id));
    try {
      await deleteDocument(COLLECTIONS.STORAGES, id);
    } catch (error) {
      console.error("Failed to delete storage:", error);
      await loadData();
    }
  };

  const addLandmark = async (landmarkData: Omit<Landmark, 'id' | 'createdAt'>): Promise<string> => {
    const id = `l${Date.now()}`;
    const newLandmark: Landmark = {
      ...landmarkData,
      id,
      createdAt: new Date().toISOString()
    };
    setLandmarks(prev => [...prev, newLandmark]);
    try {
      await addDocument(COLLECTIONS.LANDMARKS, id, newLandmark);
      return id;
    } catch (error) {
      console.error("Failed to add landmark:", error);
      await loadData();
      throw error;
    }
  };

  const updateLandmark = async (id: string, landmarkData: Partial<Landmark>) => {
    setLandmarks(prev => prev.map(l => l.id === id ? { ...l, ...landmarkData } : l));
    try {
      await updateDocument(COLLECTIONS.LANDMARKS, id, landmarkData);
    } catch (error) {
      console.error("Failed to update landmark:", error);
      await loadData();
    }
  };

  const deleteLandmark = async (id: string) => {
    setLandmarks(prev => prev.filter(l => l.id !== id));
    try {
      await deleteDocument(COLLECTIONS.LANDMARKS, id);
    } catch (error) {
      console.error("Failed to delete landmark:", error);
      await loadData();
    }
  };

  return (
    <AppDataContext.Provider value={{ rooms, storages, areas, landmarks, items, categories, personLabels, loading, addRoom, updateRoom, addItem, addStorage, updateStorage, deleteStorage, addLandmark, updateLandmark, deleteLandmark }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
