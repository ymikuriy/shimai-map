import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { ItemCard } from '../../components/item/ItemCard';
import type { Item } from '../../types';
import { searchItems } from '../../lib/searchLogic';
import { Settings, Plus } from 'lucide-react'; 
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAppData } from '../../contexts/AppDataContext';

export const MainScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { currentStep, nextStep } = useOnboarding();
  const { items, rooms, storages, areas } = useAppData();

  // スクロール時にキーボードを閉じる
  useEffect(() => {
    const handleScroll = () => {
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredItems = searchItems(items, searchQuery);

  const handleAddClick = () => {
    if (currentStep === 'OG-STEP-07') nextStep();
    navigate('/add');
  };
  const handleSettingsClick = () => {
    if (currentStep === 'OG-STEP-01') nextStep();
    navigate('/management');
  };
  const handleItemClick = (item: Item) => {
    if (currentStep === 'OG-STEP-09') nextStep();
    navigate(`/location/${item.id}`);
  };

  return (
    <div className="main-layout" style={{ position: 'relative' }}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddClick}
        onSettingsClick={handleSettingsClick}
      />
      
      <main className="main-content">
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', border: '1px dashed #cbd5e1', borderRadius: '16px', background: '#fafafa', fontSize: '14px', marginTop: '20px' }}>
            アイテムはまだ登録されていません
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="no-results" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
            <p>「{searchQuery}」は見つかりませんでした</p>
          </div>
        ) : (
          <div className="item-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredItems.map(item => {
              const room = rooms.find(r => r.id === item.roomId);
              const storage = storages.find(s => s.id === item.storageId);
              const area = areas.find(a => a.id === item.areaId);
              
              let locationStr = `${room ? room.name : '不明な部屋'} ＞ ${storage ? storage.name : '不明な収納'}`;
              if (area) {
                locationStr += ` ＞ ${area.name}`;
              }
              
              const modifiedItem = { ...item, location: locationStr } as any;

              // オンボーディング中の強調スタイル
              const highlightStyle = currentStep === 'OG-STEP-09' ? { 
                position: 'relative' as const, 
                zIndex: 102, 
                border: '2px solid var(--primary)', 
                boxShadow: '0 0 0 4px rgba(37,99,235,.22)',
                background: '#fff'
              } : {};

              return (
                <ItemCard 
                  key={item.id} 
                  item={modifiedItem} 
                  onClick={() => handleItemClick(modifiedItem)} 
                  style={highlightStyle}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-01) */}
      {currentStep === 'OG-STEP-01' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 101 }}>
            <button className="icon-btn ghost" onClick={handleSettingsClick} style={{ backgroundColor: '#fff', color: 'var(--color-primary)', border: '2px solid var(--color-primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)', cursor: 'pointer' }}>
              <Settings size={24} />
            </button>
          </div>
          <div style={{ position: 'absolute', top: '70px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', right: '18px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            まず、部屋と収納を作成します。<br />右上の設定アイコンをタップしてください。
          </div>
        </div>
      )}

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-07) */}
      {currentStep === 'OG-STEP-07' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '16px', right: '68px', zIndex: 101 }}>
            <button className="icon-btn ghost" onClick={handleAddClick} style={{ backgroundColor: '#fff', color: 'var(--color-primary)', border: '2px solid var(--color-primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)', cursor: 'pointer' }}>
              <Plus size={24} />
            </button>
          </div>
          <div style={{ position: 'absolute', top: '70px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', right: '70px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            部屋と収納ができたので、次に探したいモノを1つ登録します。<br />＋アイコンをタップしてください。
          </div>
        </div>
      )}

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-09) */}
      {currentStep === 'OG-STEP-09' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '80px', left: '16px', right: '16px', zIndex: 101, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredItems.slice(0,1).map(item => (
               <div key={item.id} style={{ border: '2px solid var(--color-primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)', borderRadius: '16px', backgroundColor: '#fff' }}>
                  <ItemCard item={item} onClick={() => handleItemClick(item)} />
               </div>
            ))}
          </div>
          <div style={{ position: 'absolute', top: '165px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            登録したアイテムをタップして場所を確認します。
          </div>
        </div>
      )}
    </div>
  );
};
