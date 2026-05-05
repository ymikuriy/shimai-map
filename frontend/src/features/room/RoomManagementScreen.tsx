import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAppData } from '../../contexts/AppDataContext';

export const RoomManagementScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentStep, nextStep } = useOnboarding();
  const { rooms, storages, items } = useAppData();

  const handleAddClick = () => {
    if (currentStep === 'OG-STEP-03') nextStep();
    navigate('/management/rooms/edit');
  };

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate(-1)} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>部屋管理</h2>
        <button 
          className="text-btn" 
          style={currentStep === 'OG-STEP-03' ? { position: 'relative', zIndex: 102, padding: '6px 12px', background: 'var(--primary)', color: '#fff', borderRadius: '999px', fontSize: '12px', fontWeight: 800, border: '2px solid #fff', boxShadow: '0 0 0 4px rgba(37,99,235,.22)', cursor: 'pointer' } : { padding: '6px 12px', background: 'var(--primary)', color: '#fff', borderRadius: '999px', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }} 
          onClick={handleAddClick}
        >
          追加
        </button>
      </header>

      <main className="main-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {rooms.map(room => {
            const roomStoragesCount = storages.filter(s => s.roomId === room.id).length;
            const roomItemsCount = items.filter(i => i.roomId === room.id).length;
            
            return (
              <div key={room.id} className="list-row glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '16px', cursor: 'pointer' }} onClick={() => navigate(`/management/rooms/edit/${room.id}`)}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>{room.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>
                    収納{roomStoragesCount}件 / アイテム{roomItemsCount}件
                  </div>
                </div>
                <ChevronRight size={20} color="var(--muted)" />
              </div>
            );
          })}

        </div>
      </main>

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-03) */}
      {currentStep === 'OG-STEP-03' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '70px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', right: '28px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            最初の部屋を追加します。例：玄関、リビングなど。
          </div>
        </div>
      )}
    </div>
  );
};
