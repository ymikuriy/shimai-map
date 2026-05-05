import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Users, Tags, UserCog } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';

export const ManagementScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentStep, nextStep } = useOnboarding();

  const handleRoomManagementClick = () => {
    if (currentStep === 'OG-STEP-02') nextStep();
    navigate('/management/rooms');
  };

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate('/')} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>管理/設定</h2>
        <div style={{ width: '40px' }} /> {/* スペーサー */}
      </header>

      <main className="main-content">
        <div className="menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div 
            className="menu-row glass" 
            style={currentStep === 'OG-STEP-02' ? { minHeight: '64px', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', position: 'relative', zIndex: 102, border: '2px solid var(--primary)', boxShadow: '0 0 0 4px rgba(37,99,235,.22)', backgroundColor: '#fff' } : { minHeight: '64px', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} 
            onClick={handleRoomManagementClick}
          >
            <div className="menu-icon" style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={20} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>部屋管理</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>部屋一覧、部屋登録、部屋レイアウト編集</div>
            </div>
            <div style={{ color: 'var(--muted)', fontWeight: 800 }}>›</div>
          </div>

          <div className="menu-row glass" style={{ minHeight: '64px', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/management/labels')}>
            <div className="menu-icon" style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--green-soft)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>人物ラベル管理</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>パパ、ママ、花子などのラベル管理</div>
            </div>
            <div style={{ color: 'var(--muted)', fontWeight: 800 }}>›</div>
          </div>

          <div className="menu-row glass" style={{ minHeight: '64px', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/management/categories')}>
            <div className="menu-icon" style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--orange-soft)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tags size={20} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>カテゴリ管理</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>衣類、書類、雨具などのカテゴリ管理</div>
            </div>
            <div style={{ color: 'var(--muted)', fontWeight: 800 }}>›</div>
          </div>

          <div className="menu-row glass" style={{ minHeight: '64px', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/settings')}>
            <div className="menu-icon" style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCog size={20} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>アカウント設定</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>ログアウト、メールアドレス、アカウント削除</div>
            </div>
            <div style={{ color: 'var(--muted)', fontWeight: 800 }}>›</div>
          </div>

        </div>
      </main>

      {/* オンボーディング ガイド・オーバーレイ (OG-STEP-02) */}
      {currentStep === 'OG-STEP-02' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17,24,39,0.36)', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', top: '160px', right: '16px', left: '16px', zIndex: 101, backgroundColor: '#111827', color: '#fff', padding: '16px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.5, boxShadow: '0 12px 26px rgba(17,24,39,.24)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: '-6px', left: '40px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #111827' }} />
            部屋管理を開きます。他の管理項目はガイド中は選択できません。
          </div>
        </div>
      )}
    </div>
  );
};
