import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <PackageOpen size={64} strokeWidth={1.5} />
      </div>
      <h2 className="empty-state-title">まだ何もありません</h2>
      <p className="empty-state-desc">
        おうちの中のモノを登録して、<br />
        すぐに見つけられるようにしましょう！
      </p>
      <button className="btn-primary" onClick={onAddClick}>
        最初のアイテムを登録する
      </button>
    </div>
  );
};
