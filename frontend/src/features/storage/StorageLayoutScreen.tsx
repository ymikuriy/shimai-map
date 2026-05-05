import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

export const StorageLayoutScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate(-1)} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>収納レイアウト</h2>
        <button className="text-btn" style={{ padding: '6px 12px', background: 'none', color: 'var(--primary)', borderRadius: '999px', fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer' }} onClick={() => navigate(-1)}>
          完了
        </button>
      </header>

      <main className="main-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 800, color: '#475569' }}>
          玄関収納1
        </div>

        <div style={{ border: '1px solid var(--line)', background: '#fff', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'center' }}>
          {/* キャンバスモック */}
          <div style={{ width: '220px', height: '180px', border: '3px solid var(--primary)', position: 'relative', background: '#fafafa' }}>
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', height: '60px', border: '2px solid var(--green)', background: 'var(--green-soft)', color: 'var(--green)', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px #86efac' }}>エリアA</div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', padding: '16px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ border: '1px solid #b7ead5', background: '#f7fffb', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <input type="text" defaultValue="エリアA" style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '4px 8px', fontSize: '13px', fontWeight: 800, width: '120px' }} />
                <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 800 }}>アイテム12件</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                <button style={{ padding: '6px 12px', border: '1px solid var(--line)', background: '#fff', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>幅+</button>
                <button style={{ padding: '6px 12px', border: '1px solid var(--line)', background: '#fff', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>幅-</button>
                <button style={{ padding: '6px 12px', border: '1px solid var(--line)', background: '#fff', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>高さ+</button>
              </div>
            </div>
            
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', minHeight: '40px', background: '#fff', border: '1px dashed var(--green)', color: 'var(--green)', borderRadius: '12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
              <Plus size={16} /> エリアを追加
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
