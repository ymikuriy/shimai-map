import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAppData } from '../../contexts/AppDataContext';

export const ItemEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentStep, nextStep } = useOnboarding();
  const { addItem, rooms, storages } = useAppData();
  
  const [itemName, setItemName] = useState('');
  const [memo, setMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 初期の部屋・収納を選択状態にする
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');
  // 選択中の部屋に属する収納のリスト
  const availableStorages = storages.filter(s => s.roomId === selectedRoomId);
  const [selectedStorageId, setSelectedStorageId] = useState<string>(availableStorages[0]?.id || '');

  // 部屋が変わったら収納の選択をリセットする
  React.useEffect(() => {
    const newStorages = storages.filter(s => s.roomId === selectedRoomId);
    if (newStorages.length > 0 && !newStorages.find(s => s.id === selectedStorageId)) {
      setSelectedStorageId(newStorages[0].id);
    } else if (newStorages.length === 0) {
      setSelectedStorageId('');
    }
  }, [selectedRoomId, storages]);

  const isSaveEnabled = itemName.trim().length > 0 && selectedRoomId !== '' && selectedStorageId !== '' && !isSaving;

  const handleSaveClick = async () => {
    if (!isSaveEnabled) return;
    
    setIsSaving(true);
    try {
      await addItem({
        name: itemName.trim(),
        roomId: selectedRoomId,
        storageId: selectedStorageId,
        personLabelIds: []
      });

      if (currentStep === 'OG-STEP-08') {
        nextStep();
        navigate('/');
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

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate(-1)} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>アイテム登録</h2>
        <button 
          onClick={handleSaveClick} 
          disabled={!isSaveEnabled}
          style={{ color: isSaveEnabled ? 'var(--primary)' : '#cbd5e1', fontSize: '14px', fontWeight: 800, border: 'none', background: 'none', cursor: isSaveEnabled ? 'pointer' : 'default', padding: '8px' }}
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
      </header>
      
      <main className="main-content" style={{ padding: '16px' }}>
        <div style={currentStep === 'OG-STEP-08' ? { marginBottom: '16px', position: 'relative', zIndex: 102, backgroundColor: '#fff', padding: '8px', borderRadius: '16px', border: '2px solid var(--primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)' } : { marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>アイテム名 <span style={{ color: 'var(--red)' }}>*</span></label>
          <input 
            type="text" 
            placeholder="例：パスポート" 
            style={{ width: '100%', minHeight: '46px', background: '#fff', border: '1px solid var(--line)', borderRadius: '14px', padding: '11px 16px', fontSize: '14px', fontWeight: 800 }} 
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
            格納先 <span style={{ color: 'var(--red)', marginLeft: '4px' }}>*</span>
          </label>
          
          {rooms.length === 0 ? (
             <div style={{ padding: '12px', background: 'var(--red-soft)', color: 'var(--red)', borderRadius: '14px', fontSize: '13px', fontWeight: 800, border: '1px solid #fecaca' }}>
               まずは「部屋管理」から部屋を登録してください。
             </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <select 
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                style={{ flex: 1, minHeight: '46px', background: '#fff', border: '1px solid var(--line)', borderRadius: '14px', padding: '0 12px', fontSize: '14px', fontWeight: 800, boxShadow: '0 4px 10px rgba(31,41,55,.03)', cursor: 'pointer', appearance: 'none' }}
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>

              <select 
                value={selectedStorageId}
                onChange={(e) => setSelectedStorageId(e.target.value)}
                disabled={availableStorages.length === 0}
                style={{ flex: 1, minHeight: '46px', background: '#fff', border: '1px solid var(--line)', borderRadius: '14px', padding: '0 12px', fontSize: '14px', fontWeight: 800, boxShadow: '0 4px 10px rgba(31,41,55,.03)', cursor: 'pointer', appearance: 'none', opacity: availableStorages.length === 0 ? 0.5 : 1 }}
              >
                {availableStorages.length === 0 ? (
                  <option value="">収納なし</option>
                ) : (
                  availableStorages.map(storage => (
                    <option key={storage.id} value={storage.id}>{storage.name}</option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
            人物ラベル <span style={{ color: 'var(--muted)', fontSize: '10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '2px 6px', marginLeft: '6px' }}>任意</span>
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '38px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', padding: '5px 12px', background: 'var(--purple-soft)', color: 'var(--purple)', border: '1px solid #dcc8ff', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>パパ</span>
            <span style={{ display: 'inline-flex', padding: '5px 12px', background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid #bad0ff', borderRadius: '999px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>＋ 追加</span>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
            カテゴリ <span style={{ color: 'var(--muted)', fontSize: '10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '2px 6px', marginLeft: '6px' }}>任意</span>
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '38px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', padding: '5px 12px', background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid #b7ead5', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>日用品</span>
            <span style={{ display: 'inline-flex', padding: '5px 12px', background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid #bad0ff', borderRadius: '999px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>＋ 追加</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', background: 'var(--orange-soft)', color: 'var(--orange)', border: '1px solid #ffdca1', borderRadius: '999px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
              <Sparkles size={14} /> AI候補
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
            メモ <span style={{ color: 'var(--muted)', fontSize: '10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '2px 6px', marginLeft: '6px' }}>任意</span>
          </label>
          <textarea 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ width: '100%', minHeight: '100px', background: '#fff', border: '1px solid var(--line)', borderRadius: '14px', padding: '12px 16px', fontSize: '14px', resize: 'vertical', boxShadow: '0 4px 10px rgba(31,41,55,.03)', fontFamily: 'inherit' }}
            placeholder="購入日や補足情報..."
          />
        </div>
      </main>

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-08) */}
      {currentStep === 'OG-STEP-08' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '160px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', right: '40px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            アイテム名と格納先を設定して保存します。任意項目は後で追加できます。
          </div>
        </div>
      )}
    </div>
  );
};
