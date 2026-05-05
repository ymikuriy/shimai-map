import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Rnd } from 'react-rnd';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAppData } from '../../contexts/AppDataContext';
import type { Storage, Landmark, LayoutPosition } from '../../types';

type TabType = 'shape' | 'storage' | 'landmark' | 'move';

const ROOM_SHAPES = {
  square: { width: 220, height: 220 },
  vertical: { width: 180, height: 260 },
  horizontal: { width: 260, height: 180 },
};

export const RoomLayoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId?: string }>();
  const { currentStep, nextStep } = useOnboarding();
  const { rooms, storages, landmarks, updateStorage, addStorage, updateLandmark, addLandmark, items } = useAppData();

  const [activeTab, setActiveTab] = useState<TabType>('shape');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'storage' | 'landmark' | null>(null);
  
  const [localStorages, setLocalStorages] = useState<Storage[]>([]);
  const [localLandmarks, setLocalLandmarks] = useState<Landmark[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const room = rooms.find(r => r.id === roomId);
  const roomShape = ROOM_SHAPES.horizontal;

  useEffect(() => {
    if (roomId) {
      setLocalStorages(storages.filter(s => s.roomId === roomId));
      setLocalLandmarks(landmarks.filter(l => l.roomId === roomId));
    }
  }, [roomId, storages, landmarks]);

  const selectedItem = selectedType === 'storage' 
    ? localStorages.find(s => s.id === selectedId)
    : localLandmarks.find(l => l.id === selectedId);

  const updateLocalName = (id: string, type: 'storage' | 'landmark', newName: string) => {
    if (type === 'storage') {
      setLocalStorages(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
    } else {
      setLocalLandmarks(prev => prev.map(l => l.id === id ? { ...l, name: newName } : l));
    }
  };

  const handleAddItem = (itemType: string, type: 'storage' | 'landmark') => {
    if (!roomId) return;
    
    const tempId = `temp_${type}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const itemsList = type === 'storage' ? localStorages : localLandmarks;
    const offset = itemsList.length * 10;
    
    const newPos = { x: 20 + offset, y: 20 + offset, width: 60, height: 40 };

    if (type === 'storage') {
      setLocalStorages(prev => [...prev, {
        id: tempId,
        roomId,
        name: `${itemType}${prev.length + 1}`,
        position: newPos,
        createdAt: new Date().toISOString()
      }]);
    } else {
      setLocalLandmarks(prev => [...prev, {
        id: tempId,
        roomId,
        name: `${itemType}${prev.length + 1}`,
        position: newPos,
        createdAt: new Date().toISOString()
      }]);
    }

    setSelectedId(tempId);
    setSelectedType(type);
    setActiveTab('move');
  };

  const adjustPosition = (axis: 'x' | 'y' | 'width' | 'height', delta: number) => {
    if (!selectedId || !selectedType) return;
    
    const updateList = selectedType === 'storage' ? setLocalStorages : setLocalLandmarks;
    
    updateList((prev: any[]) => prev.map((item: any) => {
      if (item.id === selectedId) {
        let newPos = { ...item.position, [axis]: item.position[axis] + delta };
        
        if (axis === 'width' || axis === 'height') {
          newPos[axis] = Math.max(10, newPos[axis]);
        }
        
        // Boundaries only for storages
        if (selectedType === 'storage') {
          if (newPos.x < 0) newPos.x = 0;
          if (newPos.y < 0) newPos.y = 0;
          if (newPos.x + newPos.width > roomShape.width) {
            if (axis === 'width') newPos.width = roomShape.width - newPos.x;
            else if (axis === 'x') newPos.x = roomShape.width - newPos.width;
          }
          if (newPos.y + newPos.height > roomShape.height) {
            if (axis === 'height') newPos.height = roomShape.height - newPos.y;
            else if (axis === 'y') newPos.y = roomShape.height - newPos.height;
          }
        }
        
        return { ...item, position: newPos };
      }
      return item;
    }));
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const promises: Promise<any>[] = [];

      localStorages.forEach(storage => {
        if (storage.id.startsWith('temp_')) {
          const { id, createdAt, ...data } = storage;
          promises.push(addStorage(data));
        } else {
          promises.push(updateStorage(storage.id, { name: storage.name, position: storage.position }));
        }
      });

      localLandmarks.forEach(landmark => {
        if (landmark.id.startsWith('temp_')) {
          const { id, createdAt, ...data } = landmark;
          promises.push(addLandmark(data));
        } else {
          promises.push(updateLandmark(landmark.id, { name: landmark.name, position: landmark.position }));
        }
      });

      await Promise.all(promises);

      if (currentStep === 'OG-STEP-06') {
        nextStep();
        navigate('/');
      } else {
        navigate(-1);
      }
    } catch (e) {
      console.error("Failed to save layout", e);
      alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (!room) {
    return <div style={{ padding: '20px' }}>部屋が見つかりません</div>;
  }

  // --- Rnd Configuration Helpers ---
  const getHandleStyles = (isSelected: boolean, color: string) => {
    if (!isSelected) return {};
    const base = {
      width: '12px',
      height: '12px',
      background: '#fff',
      border: `2px solid ${color}`,
      borderRadius: '2px',
    };
    return {
      topLeft: { ...base, top: '-6px', left: '-6px' },
      topRight: { ...base, top: '-6px', right: '-6px' },
      bottomLeft: { ...base, bottom: '-6px', left: '-6px' },
      bottomRight: { ...base, bottom: '-6px', right: '-6px' },
    };
  };

  const getEnableResizing = (isSelected: boolean) => ({
    top: isSelected, right: isSelected, bottom: isSelected, left: isSelected,
    topRight: isSelected, bottomRight: isSelected, bottomLeft: isSelected, topLeft: isSelected
  });

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate(-1)} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>部屋レイアウト</h2>
        <button 
          className="text-btn" 
          disabled={isSaving}
          style={currentStep === 'OG-STEP-06' ? { position: 'relative', zIndex: 102, padding: '6px 12px', background: '#fff', color: 'var(--primary)', borderRadius: '999px', fontSize: '14px', fontWeight: 800, border: '2px solid var(--primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)', cursor: 'pointer' } : { padding: '6px 12px', background: 'var(--primary)', color: '#fff', borderRadius: '999px', fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer' }} 
          onClick={handleSaveClick}
        >
          {isSaving ? '保存中...' : '完了'}
        </button>
      </header>

      <main className="main-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Context bar */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: 800, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          選択中：{room.name} ＞ {selectedItem ? selectedItem.name : '未選択'}
        </div>

        {/* Canvas Area */}
        <div style={{ border: '1px solid var(--line)', background: '#fff', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
          
          <div 
            style={{ 
              width: `${roomShape.width}px`, 
              height: `${roomShape.height}px`, 
              border: '4px solid var(--line)', 
              position: 'relative', 
              background: '#f8fafc',
              zIndex: 1
            }}
            onPointerDown={(e) => { 
              if (e.target === e.currentTarget) {
                setSelectedId(null); 
                setSelectedType(null); 
              }
            }}
          >
            {/* Landmarks (z-index 2) */}
            {localLandmarks.map(landmark => {
              const isSelected = landmark.id === selectedId;
              return (
                <Rnd
                  key={landmark.id}
                  size={{ width: landmark.position.width, height: landmark.position.height }}
                  position={{ x: landmark.position.x, y: landmark.position.y }}
                  onDragStart={() => { setSelectedId(landmark.id); setSelectedType('landmark'); }}
                  onDrag={(e, d) => {
                    setLocalLandmarks(prev => prev.map(l => l.id === landmark.id ? { ...l, position: { ...l.position, x: d.x, y: d.y } } : l));
                  }}
                  onResizeStart={() => { setSelectedId(landmark.id); setSelectedType('landmark'); }}
                  onResize={(e, direction, ref, delta, position) => {
                    setLocalLandmarks(prev => prev.map(l => l.id === landmark.id ? { ...l, position: { x: position.x, y: position.y, width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) } } : l));
                  }}
                  enableResizing={getEnableResizing(isSelected)}
                  resizeHandleStyles={getHandleStyles(isSelected, '#94a3b8')} // Muted color for landmarks
                  // Landmarks have no bounds restriction
                  style={{
                    border: `2px ${isSelected ? 'solid var(--primary)' : 'dashed #cbd5e1'}`,
                    background: isSelected ? 'rgba(219, 234, 254, 0.8)' : 'rgba(241, 245, 249, 0.8)',
                    color: isSelected ? 'var(--primary)' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    zIndex: isSelected ? 10 : 2,
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  }}
                  dragGrid={[5, 5]}
                  resizeGrid={[5, 5]}
                >
                  {landmark.name}
                </Rnd>
              );
            })}

            {/* Storages (z-index 3) */}
            {localStorages.map(storage => {
              const isSelected = storage.id === selectedId;
              return (
                <Rnd
                  key={storage.id}
                  size={{ width: storage.position.width, height: storage.position.height }}
                  position={{ x: storage.position.x, y: storage.position.y }}
                  bounds="parent" // Powerful built-in bounds!
                  onDragStart={() => { setSelectedId(storage.id); setSelectedType('storage'); }}
                  onDrag={(e, d) => {
                    setLocalStorages(prev => prev.map(s => s.id === storage.id ? { ...s, position: { ...s.position, x: d.x, y: d.y } } : s));
                  }}
                  onResizeStart={() => { setSelectedId(storage.id); setSelectedType('storage'); }}
                  onResize={(e, direction, ref, delta, position) => {
                    setLocalStorages(prev => prev.map(s => s.id === storage.id ? { ...s, position: { x: position.x, y: position.y, width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) } } : s));
                  }}
                  enableResizing={getEnableResizing(isSelected)}
                  resizeHandleStyles={getHandleStyles(isSelected, 'var(--primary)')}
                  style={{
                    border: `2px solid ${isSelected ? 'var(--primary)' : '#93c5fd'}`,
                    background: isSelected ? '#dbeafe' : 'var(--primary-soft)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    zIndex: isSelected ? 11 : 3,
                    boxShadow: isSelected ? '0 8px 16px rgba(37,99,235,0.15), 0 0 0 3px #bfdbfe' : 'none',
                  }}
                  dragGrid={[5, 5]}
                  resizeGrid={[5, 5]}
                >
                  {storage.name}
                </Rnd>
              );
            })}
          </div>
          <div style={{ marginTop: '10px', fontSize: '10px', fontWeight: 800, color: 'var(--muted)' }}>
            中央ドラッグ：移動 ／ 四隅ドラッグ：サイズ変更
          </div>
        </div>

        {/* Selected State Panel */}
        <div style={{ border: `1px solid ${selectedId ? (selectedType === 'storage' ? '#bad0ff' : '#cbd5e1') : 'var(--line)'}`, background: selectedId ? (selectedType === 'storage' ? '#f8fbff' : '#f8fafc') : '#fff', borderRadius: '16px', padding: '12px', minHeight: '74px' }}>
          {selectedItem ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>{selectedType === 'storage' ? '収納名' : '目印名'}</span>
                <input 
                  type="text" 
                  value={selectedItem.name} 
                  onChange={(e) => updateLocalName(selectedItem.id, selectedType, e.target.value)}
                  style={{ flex: 1, padding: '4px 8px', border: '1px solid var(--line)', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 800, color: 'var(--muted)' }}>
                {selectedType === 'storage' ? (
                  <>
                    <span>アイテム {items.filter(i => i.storageId === selectedItem.id).length}件</span>
                    <button onClick={() => navigate(`/management/storage/layout`)} style={{ padding: '4px 10px', background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid #bad0ff', borderRadius: '999px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>収納レイアウト ›</button>
                  </>
                ) : (
                  <span>目印は部屋の枠線外にも配置できます</span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '13px', fontWeight: 800 }}>
              未選択
            </div>
          )}
        </div>

        {/* Action Tabs */}
        <div>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--line)' }}>
            <button onClick={() => setActiveTab('shape')} style={{ flex: 1, padding: '10px 4px', background: activeTab === 'shape' ? '#fff' : '#f8fafc', border: '1px solid var(--line)', borderBottom: 'none', borderRadius: '12px 12px 0 0', color: activeTab === 'shape' ? 'var(--primary)' : 'var(--muted)', fontSize: '11px', fontWeight: 800, borderBottomWidth: activeTab === 'shape' ? '2px' : '0', borderBottomColor: 'var(--primary)' }}>部屋形状</button>
            <button onClick={() => setActiveTab('storage')} style={currentStep === 'OG-STEP-06' ? { flex: 1, padding: '10px 4px', background: '#fff', border: '2px solid var(--primary)', borderBottom: 'none', borderRadius: '12px 12px 0 0', color: 'var(--primary)', fontSize: '11px', fontWeight: 800, position: 'relative', zIndex: 102 } : { flex: 1, padding: '10px 4px', background: activeTab === 'storage' ? '#fff' : '#f8fafc', border: '1px solid var(--line)', borderBottom: 'none', borderRadius: '12px 12px 0 0', color: activeTab === 'storage' ? 'var(--primary)' : 'var(--muted)', fontSize: '11px', fontWeight: 800, borderBottomWidth: activeTab === 'storage' ? '2px' : '0', borderBottomColor: 'var(--primary)' }}>収納＋</button>
            <button onClick={() => setActiveTab('landmark')} style={{ flex: 1, padding: '10px 4px', background: activeTab === 'landmark' ? '#fff' : '#f8fafc', border: '1px solid var(--line)', borderBottom: 'none', borderRadius: '12px 12px 0 0', color: activeTab === 'landmark' ? 'var(--primary)' : 'var(--muted)', fontSize: '11px', fontWeight: 800, borderBottomWidth: activeTab === 'landmark' ? '2px' : '0', borderBottomColor: 'var(--primary)' }}>目印＋</button>
            <button onClick={() => setActiveTab('move')} style={{ flex: 1, padding: '10px 4px', background: activeTab === 'move' ? '#fff' : '#f8fafc', border: '1px solid var(--line)', borderBottom: 'none', borderRadius: '12px 12px 0 0', color: activeTab === 'move' ? 'var(--primary)' : 'var(--muted)', fontSize: '11px', fontWeight: 800, borderBottomWidth: activeTab === 'move' ? '2px' : '0', borderBottomColor: 'var(--primary)' }}>詳細移動</button>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderTop: 'none', padding: '16px', borderRadius: '0 0 16px 16px' }}>
            
            {activeTab === 'shape' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button style={{ padding: '8px', border: '1px solid var(--line)', background: '#f8fafc', borderRadius: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--muted)' }}>正方形</button>
                <button style={{ padding: '8px', border: '1px solid var(--line)', background: '#f8fafc', borderRadius: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--muted)' }}>縦長</button>
                <button style={{ padding: '8px', border: '1px solid #bad0ff', background: 'var(--primary-soft)', borderRadius: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>横長</button>
              </div>
            )}

            {activeTab === 'storage' && (
              <div style={currentStep === 'OG-STEP-06' ? { position: 'relative', zIndex: 102 } : {}}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button onClick={() => handleAddItem('押入', 'storage')} style={{ padding: '12px 4px', border: '1px solid #bad0ff', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>押入</button>
                  <button onClick={() => handleAddItem('クローゼット', 'storage')} style={{ padding: '12px 4px', border: '1px solid #bad0ff', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>クローゼット</button>
                  <button onClick={() => handleAddItem('棚', 'storage')} style={{ padding: '12px 4px', border: '1px solid #bad0ff', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>棚</button>
                </div>
              </div>
            )}

            {activeTab === 'landmark' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button onClick={() => handleAddItem('ドア', 'landmark')} style={{ padding: '12px 4px', border: '1px dashed #cbd5e1', background: '#f1f5f9', color: '#64748b', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>ドア</button>
                <button onClick={() => handleAddItem('窓', 'landmark')} style={{ padding: '12px 4px', border: '1px dashed #cbd5e1', background: '#f1f5f9', color: '#64748b', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>窓</button>
                <button onClick={() => handleAddItem('柱', 'landmark')} style={{ padding: '12px 4px', border: '1px dashed #cbd5e1', background: '#f1f5f9', color: '#64748b', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>柱</button>
              </div>
            )}

            {activeTab === 'move' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', width: '30px' }}>幅</span>
                    <button onClick={() => adjustPosition('width', -5)} style={{ flex: 1, padding: '6px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', fontWeight: 800 }}>-</button>
                    <button onClick={() => adjustPosition('width', 5)} style={{ flex: 1, padding: '6px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', fontWeight: 800 }}>+</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', width: '30px' }}>高さ</span>
                    <button onClick={() => adjustPosition('height', -5)} style={{ flex: 1, padding: '6px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', fontWeight: 800 }}>-</button>
                    <button onClick={() => adjustPosition('height', 5)} style={{ flex: 1, padding: '6px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', fontWeight: 800 }}>+</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '32px 32px 32px', gridTemplateAreas: `". up ." "left center right" ". down ."`, gap: '4px', justifyContent: 'center' }}>
                  <button onClick={() => adjustPosition('y', -5)} style={{ gridArea: 'up', padding: '4px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', fontWeight: 800 }}>↑</button>
                  <button onClick={() => adjustPosition('x', -5)} style={{ gridArea: 'left', padding: '4px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', fontWeight: 800 }}>←</button>
                  <div style={{ gridArea: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--muted)', fontWeight: 800 }}>移動</div>
                  <button onClick={() => adjustPosition('x', 5)} style={{ gridArea: 'right', padding: '4px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', fontWeight: 800 }}>→</button>
                  <button onClick={() => adjustPosition('y', 5)} style={{ gridArea: 'down', padding: '4px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', fontWeight: 800 }}>↓</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-06) */}
      {currentStep === 'OG-STEP-06' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '220px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', right: '40px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            収納＋から収納を追加し、完了を押します。収納の細かな位置調整は指でドラッグして行えます。
          </div>
        </div>
      )}
    </div>
  );
};
