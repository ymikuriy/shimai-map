import { describe, it, expect } from 'vitest';
import { searchItems } from './searchLogic';
import type { Item } from '../types';

const mockItems: Item[] = [
  {
    id: '1', homeId: 'h1', roomId: 'r1', storageId: 's1',
    name: 'レインコート', memo: '赤いポンチョ', searchTokens: ['雨具', 'カッパ'],
    createdAt: '2026-05-01T00:00:00Z', updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: '2', homeId: 'h1', roomId: 'r1', storageId: 's1',
    name: '折り畳み傘', memo: '黒色', searchTokens: ['雨具', 'アンブレラ'],
    createdAt: '2026-05-01T00:00:00Z', updatedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: '3', homeId: 'h1', roomId: 'r2', storageId: 's2',
    name: '防災バッグ', memo: '水と非常食', searchTokens: ['避難', '地震'],
    createdAt: '2026-05-01T00:00:00Z', updatedAt: '2026-05-01T00:00:00Z'
  }
];

describe('searchItems', () => {
  it('キーワードが空の場合は全件返す', () => {
    const result = searchItems(mockItems, '');
    expect(result.length).toBe(3);
  });

  it('スペースのみのキーワードでも全件返す', () => {
    const result = searchItems(mockItems, '   ');
    expect(result.length).toBe(3);
  });

  it('アイテム名で部分一致検索できる (大文字小文字無視)', () => {
    const result = searchItems(mockItems, 'レイン');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('メモで検索できる', () => {
    const result = searchItems(mockItems, '赤い');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('AI補助語 (searchTokens) で検索できる', () => {
    const result = searchItems(mockItems, 'カッパ');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('複数の項目がヒットする場合、すべて返す (雨具で2件ヒット)', () => {
    const result = searchItems(mockItems, '雨具');
    expect(result.length).toBe(2);
    expect(result.map(i => i.id)).toEqual(['1', '2']);
  });

  it('ヒットしない場合は空配列を返す', () => {
    const result = searchItems(mockItems, '存在しないアイテム');
    expect(result.length).toBe(0);
  });
});
