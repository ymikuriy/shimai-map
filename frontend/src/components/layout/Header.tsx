import React from 'react';
import { Search, Plus, Settings } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  onSettingsClick,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.blur();
  };

  return (
    <header className="glass header-container">
      <div className="header-top">
        <h1 className="header-title">しまいマップ</h1>
        <div className="header-actions">
          <button className="icon-btn primary" onClick={onAddClick} aria-label="アイテム追加">
            <Plus size={24} />
          </button>
          <button className="icon-btn ghost" onClick={onSettingsClick} aria-label="設定">
            <Settings size={24} />
          </button>
        </div>
      </div>
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="アイテムを探す..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            enterKeyHint="search"
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={handleClear}
              aria-label="検索クリア"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
