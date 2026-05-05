import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronRight } from 'lucide-react';

export const PersonLabelManagementScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate(-1)} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>人物ラベル管理</h2>
        <button className="text-btn" style={{ padding: '6px 12px', background: 'var(--primary)', color: '#fff', borderRadius: '999px', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }} onClick={() => alert('追加 (Phase 3)')}>
          追加
        </button>
      </header>

      <main className="main-content">
        <div className="section-label" style={{ fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>登録済みラベル</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span style={{ padding: '6px 12px', background: 'var(--purple-soft)', color: 'var(--purple)', border: '1px solid #dcc8ff', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>パパ</span>
          <span style={{ padding: '6px 12px', background: 'var(--purple-soft)', color: 'var(--purple)', border: '1px solid #dcc8ff', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>ママ</span>
          <span style={{ padding: '6px 12px', background: 'var(--purple-soft)', color: 'var(--purple)', border: '1px solid #dcc8ff', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>花子</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="list-row glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>パパ</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>アイテム12件</div>
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>

          <div className="list-row glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>ママ</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>アイテム23件</div>
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>

          <div className="list-row glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>花子</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>アイテム31件</div>
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>
        </div>
      </main>
    </div>
  );
};
