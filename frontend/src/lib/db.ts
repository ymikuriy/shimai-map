import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import type { Room, Storage, Area, Landmark, Item, Category, PersonLabel } from '../types';

// コレクション名
export const COLLECTIONS = {
  ROOMS: 'rooms',
  STORAGES: 'storages',
  AREAS: 'areas',
  ITEMS: 'items',
  CATEGORIES: 'categories',
  PERSON_LABELS: 'personLabels',
  LANDMARKS: 'landmarks',
} as const;

// 汎用データ取得（homeIdで絞り込み）
export const fetchByHomeId = async <T>(collectionName: string, homeId: string): Promise<T[]> => {
  const q = query(collection(db, collectionName), where("homeId", "==", homeId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
};

// StorageやAreaなどhomeIdを直接持たないものは、関連するroomIdなどを元に取得するか、
// 簡易化のために全件取得するなどの工夫が必要ですが、MVPとしてStorage/AreaもhomeIdを持たせるか、全件取得します。
// 今回の型定義では Storage/Area は homeId を持っていません。
// しかし、MVP（1ユーザー1家）なので、一旦全件取得する関数も用意します。
export const fetchAll = async <T>(collectionName: string): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
};

// ドキュメント追加（IDは自動生成ではなく、指定されたIDを使用。アプリ側のDate.now()などを使うため）
export const addDocument = async (collectionName: string, id: string, data: any): Promise<void> => {
  await setDoc(doc(db, collectionName, id), data);
};

// ドキュメント更新
export const updateDocument = async (collectionName: string, id: string, data: any): Promise<void> => {
  await updateDoc(doc(db, collectionName, id), data);
};

// ドキュメント削除
export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  await deleteDoc(doc(db, collectionName, id));
};
