import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Plus, ChevronRight } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAppData } from '../../contexts/AppDataContext';

export const RoomEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId?: string }>();
  const { currentStep, nextStep } = useOnboarding();
  const { addRoom, updateRoom, rooms, storages, items } = useAppData();

  const [roomName, setRoomName] = useState('');
  const [memo, setMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (roomId) {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        setRoomName(room.name);
        setMemo(room.memo || '');
      }
    }
  }, [roomId, rooms]);

  const roomStorages = storages.filter(s => s.roomId === roomId);

  const isSaveEnabled = roomName.trim().length > 0 && !isSaving;

  const handleSaveClick = async () => {
    if (!isSaveEnabled) return;
    
    setIsSaving(true);
    try {
      if (roomId) {
        await updateRoom(roomId, {
          name: roomName.trim(),
          memo: memo.trim()
        });
      } else {
        await addRoom({
          name: roomName.trim(),
          memo: memo.trim()
        });
      }
      
      if (currentStep === 'OG-STEP-04') {
        nextStep();
      } else {
        navigate(-1);
      }
    } catch (e) {
      console.error(e);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLayoutEditClick = () => {
    if (!roomId) return; // 新規作成時は保存してから
    if (currentStep === 'OG-STEP-05') {
      nextStep();
    }
    navigate(`/management/rooms/layout/${roomId}`);
  };

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate(-1)} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>部屋登録/編集</h2>
        <button 
          className="text-btn" 
          disabled={!isSaveEnabled}
          style={currentStep === 'OG-STEP-04' ? { position: 'relative', zIndex: 102, padding: '6px 12px', background: '#fff', color: isSaveEnabled ? 'var(--primary)' : '#cbd5e1', borderRadius: '999px', fontSize: '14px', fontWeight: 800, border: '2px solid var(--primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)', cursor: isSaveEnabled ? 'pointer' : 'default' } : { padding: '6px 12px', background: 'none', color: isSaveEnabled ? 'var(--primary)' : '#cbd5e1', borderRadius: '999px', fontSize: '14px', fontWeight: 800, border: 'none', cursor: isSaveEnabled ? 'pointer' : 'default' }} 
          onClick={handleSaveClick}
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
      </header>

      <main className="main-content" style={{ padding: '16px' }}>
        <div style={currentStep === 'OG-STEP-04' ? { marginBottom: '16px', position: 'relative', zIndex: 102, backgroundColor: '#fff', padding: '8px', borderRadius: '16px', border: '2px solid var(--primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)' } : { marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>部屋名 <span style={{ color: 'var(--red)' }}>*</span></label>
          <input 
            type="text" 
            placeholder="例：玄関" 
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{ width: '100%', minHeight: '46px', background: '#fff', border: '1px solid var(--line)', borderRadius: '14px', padding: '11px 16px', fontSize: '14px', fontWeight: 800 }} 
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
            メモ <span style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 800, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '2px 6px' }}>任意</span>
          </label>
          <textarea 
            placeholder="部屋に対するメモを入力" 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ width: '100%', minHeight: '70px', background: '#fff', border: '1px solid var(--line)', borderRadius: '14px', padding: '11px 16px', fontSize: '14px', resize: 'vertical' }} 
          />
        </div>

        <div style={currentStep === 'OG-STEP-05' ? { marginBottom: '16px', position: 'relative', zIndex: 102, backgroundColor: '#fff', padding: '8px', borderRadius: '16px', border: '2px solid var(--primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)' } : { marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>部屋のレイアウト</label>
            <button 
              onClick={handleLayoutEditClick} 
              disabled={!roomId}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: roomId ? 'var(--primary-soft)' : '#f1f5f9', color: roomId ? 'var(--primary)' : '#cbd5e1', border: `1px solid ${roomId ? '#bad0ff' : '#e2e8f0'}`, padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: roomId ? 'pointer' : 'default' }}
            >
              <Edit3 size={14} /> 編集する
            </button>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'center' }}>
             {!roomId ? (
               <div style={{ padding: '20px', color: 'var(--muted)', fontSize: '12px', fontWeight: 800, textAlign: 'center' }}>
                 まずは部屋の名前を入力して保存してください。
               </div>
             ) : (
               <div style={{ width: '160px', height: '120px', border: '3px solid var(--ink)', position: 'relative', background: '#fafafa' }}>
                 {roomStorages.map(storage => (
                   <div key={storage.id} style={{ position: 'absolute', top: `${storage.position.y / 2}px`, left: `${storage.position.x / 2}px`, width: `${storage.position.width / 2}px`, height: `${storage.position.height / 2}px`, border: '2px solid var(--primary)', background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                     {storage.name}
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>収納リスト ({roomStorages.length}件)</label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {roomStorages.map(storage => {
              const storageItemCount = items.filter(i => i.storageId === storage.id).length;
              return (
                <div key={storage.id} className="list-row glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '16px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{storage.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>アイテム{storageItemCount}件</div>
                  </div>
                  <ChevronRight size={18} color="var(--muted)" />
                </div>
              );
            })}
            {!roomId && (
               <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', padding: '10px' }}>保存時に「収納1」が自動作成されます。</div>
            )}
          </div>
        </div>
      </main>

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-04) */}
      {currentStep === 'OG-STEP-04' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '160px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', right: '40px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            部屋名を入力して保存します。メモや詳細レイアウトは後で編集できます。
          </div>
        </div>
      )}

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-05) */}
      {currentStep === 'OG-STEP-05' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '280px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', right: '40px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            次に、この部屋の中に収納を1つ配置します。部屋レイアウトの編集を開いてください。
          </div>
        </div>
      )}
    </div>
  );
};
