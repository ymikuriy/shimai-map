import type { Item } from '../types';

export function searchItems(items: Item[], keyword: string): Item[] {
  const trimmedKeyword = keyword.trim().toLowerCase();
  
  if (!trimmedKeyword) {
    return items;
  }
  
  return items.filter(item => {
    // 1. 名前での部分一致
    if (item.name.toLowerCase().includes(trimmedKeyword)) {
      return true;
    }
    
    // 2. メモでの部分一致
    if (item.memo && item.memo.toLowerCase().includes(trimmedKeyword)) {
      return true;
    }
    
    // 3. AI補助語 (searchTokens) での部分一致
    if (item.searchTokens && item.searchTokens.some(token => token.toLowerCase().includes(trimmedKeyword))) {
      return true;
    }
    
    return false;
  });
}
