// ユーザー・ホーム関連
export interface UserProfile {
  id: string; // auth_user_id
  email: string;
  displayName: string;
  createdAt: string;
}

export interface HomeSpace {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
}

// レイアウト要素共通
export interface LayoutPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 部屋・収納・エリア
export interface Room {
  id: string;
  homeId: string;
  name: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Storage {
  id: string;
  roomId: string;
  name: string;
  position: LayoutPosition; // 部屋内の相対位置
  createdAt: string;
}

export interface Area {
  id: string;
  storageId: string;
  name: string;
  position: LayoutPosition; // 収納内の相対位置
  createdAt: string;
}

export interface Landmark {
  id: string;
  roomId: string;
  name: string;
  position: LayoutPosition; // 部屋内の相対位置（部屋枠外も許容）
  createdAt: string;
}

// アイテム関連
export interface Item {
  id: string;
  homeId: string;
  name: string;
  roomId: string; // 仕様上「Room + Storage」は必須セット
  storageId: string;
  areaId?: string;
  categoryId?: string;
  personLabelIds?: string[];
  imageUrl?: string;
  memo?: string;
  searchTokens?: string[]; // AIが生成する検索補助語（表記ゆれ等）
  createdAt: string;
  updatedAt: string;
}

// タグ・カテゴリ
export interface Category {
  id: string;
  homeId: string;
  name: string;
}

export interface PersonLabel {
  id: string;
  homeId: string;
  name: string;
  color?: string;
}
