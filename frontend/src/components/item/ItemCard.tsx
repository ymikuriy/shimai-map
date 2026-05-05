import React from 'react';
import { ChevronRight, Package } from 'lucide-react';
import type { Item } from '../../types';

interface ItemCardProps {
  item: Item & { location?: string };
  onClick: (item: Item) => void;
  style?: React.CSSProperties;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, style }) => {
  return (
    <div className="item-card glass" onClick={() => onClick(item)} style={{ minHeight: '80px', ...style }}>
      <div className="item-icon-wrapper">
        <Package size={24} className="item-icon" />
      </div>
      <div className="item-content">
        <h3 className="item-title">{item.name}</h3>
        <p className="item-location">
          {item.location || '場所が設定されていません'}
        </p>
      </div>
      <ChevronRight size={20} className="item-chevron" />
    </div>
  );
};
