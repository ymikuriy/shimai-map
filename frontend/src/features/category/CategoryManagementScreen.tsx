import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronRight, Sparkles } from 'lucide-react';

export const CategoryManagementScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate(-1)} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>カテゴリ管理</h2>
        <button className="text-btn" style={{ padding: '6px 12px', background: 'var(--primary)', color: '#fff', borderRadius: '999px', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }} onClick={() => alert('追加 (Phase 3)')}>
          追加
        </button>
      </header>

      <main className="main-content">
        <div className="section-label" style={{ fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>初期カテゴリ + 追加カテゴリ</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span style={{ padding: '6px 12px', background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid #b7ead5', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>衣類</span>
          <span style={{ padding: '6px 12px', background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid #b7ead5', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>書類</span>
          <span style={{ padding: '6px 12px', background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid #b7ead5', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>雨具</span>
          <span style={{ padding: '6px 12px', background: 'var(--green-soft)', color: 'var(--green)', border: '1px solid #b7ead5', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>季節用品</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="list-row glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>雨具</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                アイテム5件 / <Sparkles size={12} color="var(--orange)" /> AI候補対象
              </div>
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>

          <div className="list-row glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>書類</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>アイテム14件 / 初期カテゴリ</div>
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>

          <div className="list-row glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>季節用品</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>アイテム8件 / ユーザー追加</div>
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>
        </div>
      </main>
    </div>
  );
};
