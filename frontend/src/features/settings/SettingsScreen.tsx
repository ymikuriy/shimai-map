import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AtSign, Key, Smartphone } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate('/management')} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>アカウント設定</h2>
        <div style={{ width: '40px' }} /> {/* スペーサー */}
      </header>

      <main className="main-content">
        <div className="menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          
          <div className="menu-row glass" style={{ minHeight: '64px', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="menu-icon" style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AtSign size={20} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>メールアドレス</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>example@mail.com</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '999px', backgroundColor: 'var(--green-soft)', color: 'var(--green)', border: '1px solid #b7ead5' }}>確認済み</span>
          </div>

          <div className="menu-row glass" style={{ minHeight: '64px', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div className="menu-icon" style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={20} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>パスワード変更</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>再設定メールを送信</div>
            </div>
            <div style={{ color: 'var(--muted)', fontWeight: 800 }}>›</div>
          </div>

          <div className="menu-row glass" style={{ minHeight: '64px', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="menu-icon" style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={20} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>ログイン中の端末</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>Phase 2：端末確認/解除</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '999px', backgroundColor: '#f8fafc', color: 'var(--muted)', border: '1px solid #e2e8f0' }}>後続</span>
          </div>

        </div>

        <button 
          className="ghost-button" 
          onClick={() => {
            alert('ログアウトします (Phase 4)');
            navigate('/');
          }} 
          style={{ width: '100%', borderRadius: '14px', minHeight: '42px', padding: '12px', fontSize: '14px', fontWeight: 800, backgroundColor: '#fff', color: 'var(--ink)', border: '1px solid var(--line)', marginBottom: '12px', cursor: 'pointer' }}
        >
          ログアウト
        </button>
        
        <button 
          className="danger-button" 
          onClick={() => alert('アカウント削除確認画面へ遷移します (Phase 4)')} 
          style={{ width: '100%', borderRadius: '14px', minHeight: '42px', padding: '12px', fontSize: '14px', fontWeight: 800, backgroundColor: 'var(--red-soft)', color: 'var(--red)', border: '1px solid #fecaca', cursor: 'pointer' }}
        >
          アカウント削除
        </button>
      </main>
    </div>
  );
};
