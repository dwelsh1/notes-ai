import React, { useEffect, useState } from 'react';

interface PageSummary {
  id: string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
}

interface DashboardProps {
  onNewPage: () => void;
  onSelectPage: (pageId: string) => void;
}

interface StatsState {
  totalPages: number;
  recentActivity: number;
  pagesThisWeek: number;
}

function formatTimeAgo(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Updated today';
  if (diffDays === 1) return 'Updated 1 day ago';
  return `Updated ${diffDays} days ago`;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNewPage, onSelectPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatsState>({ totalPages: 0, recentActivity: 0, pagesThisWeek: 0 });
  const [recentPages, setRecentPages] = useState<PageSummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/pages');
        const pages: PageSummary[] = response.ok ? await response.json() : [];

        const totalPages = pages.length;
        const recentActivity = totalPages; // simple proxy
        const pagesThisWeek = totalPages; // simple proxy

        setStats({ totalPages, recentActivity, pagesThisWeek });

        // Sort by updatedAt desc if available
        const recent = [...pages].sort((a, b) => {
          const at = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const bt = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return bt - at;
        });
        setRecentPages(recent.slice(0, 10));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '24px', color: '#6b7280' }}>Loading dashboard...</div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: '#111827' }}>Welcome to NotesAI</h1>
        <button
          onClick={onNewPage}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          New Page
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 240px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: 'white' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Pages</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.totalPages}</div>
        </div>
        <div style={{ flex: '0 0 240px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: 'white' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Recent Activity</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.recentActivity}</div>
        </div>
        <div style={{ flex: '0 0 240px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: 'white' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Pages This Week</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.pagesThisWeek}</div>
        </div>
      </div>

      {/* Recent Pages */}
      <div style={{ marginTop: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', padding: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Recent Pages</h2>
        {recentPages.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>No pages yet. Create your first page!</p>
        ) : (
          <div>
            {recentPages.map((page, index) => (
              <div
                key={page.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < recentPages.length - 1 ? '1px solid #e5e7eb' : 'none',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                  }}
                >
                  📄
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: 0,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#111827',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {page.title}
                  </h3>
                  <span style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {formatTimeAgo(page.updatedAt || page.createdAt)}
                  </span>
                </div>
                <button
                  onClick={() => onSelectPage(page.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


