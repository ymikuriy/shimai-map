import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';

export const ItemLocationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const { items, rooms, storages, areas, personLabels, categories } = useAppData();

  const item = items.find(i => i.id === itemId);
  
  if (!item) {
    return (
      <div className="main-layout">
        <header className="header-container glass">
          <button className="icon-btn ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
        </header>
        <main className="main-content">
          <p>アイテムが見つかりませんでした。</p>
        </main>
      </div>
    );
  }

  const room = rooms.find(r => r.id === item.roomId);
  const storage = storages.find(s => s.id === item.storageId);
  const area = areas.find(a => a.id === item.areaId);
  const itemCategories = categories.filter(c => c.id === item.categoryId);
  const itemLabels = personLabels.filter(p => item.personLabelIds?.includes(p.id));

  const locationStr = [
    room?.name || '不明な部屋',
    storage?.name || '不明な収納',
    area?.name
  ].filter(Boolean).join(' ＞ ');

  return (
    <div className="main-layout">
      <header className="header-container glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="icon-btn ghost" onClick={() => navigate(-1)} aria-label="戻る">
          <ArrowLeft size={24} />
        </button>
        <h2 className="header-title" style={{ fontSize: '18px', flex: 1, textAlign: 'center', color: 'var(--ink)' }}>所在確認</h2>
        <button className="icon-btn ghost" onClick={() => navigate(`/add?id=${item.id}`)} aria-label="編集">
          <Edit2 size={20} />
        </button>
      </header>

      <main className="main-content">
        <div className="glass" style={{ borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              📦
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{item.name}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                {locationStr}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {itemLabels.map(p => (
              <span key={p.id} style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '999px', background: 'var(--purple-soft)', color: 'var(--purple)', fontWeight: 800 }}>{p.name}</span>
            ))}
            {itemCategories.map(c => (
              <span key={c.id} style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '999px', background: 'var(--green-soft)', color: 'var(--green)', fontWeight: 800 }}>{c.name}</span>
            ))}
          </div>
        </div>

        <div className="section-label" style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)', marginBottom: '12px' }}>部屋全体のレイアウト</div>
        <div style={{ border: '1px solid var(--line)', background: '#fff', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '200px', height: '150px', border: '3px solid var(--ink)', position: 'relative', background: '#fafafa' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '60px', height: '80px', border: '2px solid var(--primary)', background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              {storage?.name || '収納'}
            </div>
          </div>
        </div>

        <div className="section-label" style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)', marginBottom: '12px' }}>収納内のレイアウト</div>
        <div style={{ border: '1px solid var(--line)', background: '#fff', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '220px', height: '180px', border: '3px solid var(--primary)', position: 'relative', background: '#fafafa' }}>
            {area && (
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', height: '60px', border: '2px solid var(--green)', background: 'var(--green-soft)', color: 'var(--green)', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {area.name}
              </div>
            )}
            {!area && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '12px' }}>
                詳細エリアは設定されていません
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};
