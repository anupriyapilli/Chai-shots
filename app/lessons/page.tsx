
'use client';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Lesson = {
  id: string;
  title: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  publishAt: string | null;
  publishedAt: string | null;
  isPaid: boolean;
  contentType: 'video' | 'article';
  durationMs: number | null;
};

export default function LessonsPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [status, setStatus] =
    useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // auth guard + load token
  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    if (!stored) {
      router.push('/login');
      return;
    }
    setToken(stored);
  }, [router]);

  async function load(url: string) {
    if (!token) {
      setStatus('error');
      setErrorMessage('Please log in again to get a fresh token.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch lessons');

      const data = await res.json();
      setLessons(Array.isArray(data) ? data : [data]);
      setStatus('success');
      setLastUpdated(new Date().toISOString());
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  }

  return (
    <div
  style={{
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top left, #fdf4ff, #eef2ff, #f8fafc)',
  }}
>

      

      {/* CONTENT */}
      <div
        style={{
          minHeight: '100vh',
          padding: '60px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
  style={{
    width: '100%',
    maxWidth: 900,
    background: 'rgba(255, 255, 255, 0.78)', // ✅ clean glass
    borderRadius: 28,
    padding: 36,
    boxShadow: '0 40px 100px rgba(15,23,42,0.35)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.35)',
  }}
>

          {/* HEADER */}
          <header
            style={{
              display: 'flex',
              gap: 28,
              alignItems: 'center',
              marginBottom: 36,
            }}
          >
            <div
              style={{
                padding: 8,
                borderRadius: 28,
                background:
                  'linear-gradient(135deg,#6366f1,#ec4899,#f97316)',
                boxShadow: '0 30px 70px rgba(99,102,241,0.55)',
              }}
            >
              <img
                src="/chaishots-logo.png"
                alt="Chaishots"
                style={{
                  width: 220,
                  borderRadius: 22,
                  background: '#fff',
                  padding: 14,
                }}
              />
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#0f172a',
                }}
              >
                Lessons Dashboard
              </h1>
              <p
                style={{
                  marginTop: 6,
                  fontSize: 15,
                  color: '#334155',
                  maxWidth: 420,
                }}
              >
                Secure, scheduled lesson delivery platform powered by Chaishots
                CMS.
              </p>
            </div>
          </header>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
            <button
              onClick={() =>
                load(`${baseUrl}/lessons/latest`)

              }
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 16,
                border: 'none',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Load Latest Lesson
            </button>

            <button
              onClick={() => load(`${baseUrl}/lessons/latest`)
}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 16,
                border: 'none',
                background: 'linear-gradient(135deg,#ec4899,#f97316)',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Load All Lessons
            </button>
          </div>

          {/* ERROR */}
          {status === 'error' && (
            <div
              style={{
                background: '#f7eaea',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: 14,
                borderRadius: 14,
                marginBottom: 20,
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* LESSON LIST */}
          {lessons.length > 0 && (
            <div
              style={{
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 18,
                padding: 24,
                border: '1px solid #e5e7eb',
              }}
            >
              <h3 style={{ marginBottom: 16, fontWeight: 800 }}>Lessons</h3>

              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #1679dd',
                  }}
                >
                  <div>
                    <strong>{lesson.title}</strong>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#64748b',
                        marginTop: 4,
                      }}
                    >
                      <div>Status: {lesson.status}</div>
                      <div>
                        Publish at: {lesson.publishAt ?? '—'}
                      </div>
                      <div>
                        Published at: {lesson.publishedAt ?? '—'}
                      </div>
                      <div>
                        Paid: {lesson.isPaid ? 'Yes' : 'No'}
                      </div>
                      <div>Type: {lesson.contentType}</div>
                      {lesson.contentType === 'video' && (
                        <div>
                          Duration (ms): {lesson.durationMs ?? '—'}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        router.push(`/lessons/${lesson.id}`)
                      }
                      style={{
                        marginTop: 8,
                        padding: '6px 12px',
                        borderRadius: 999,
                        border: 'none',
                        background: '#6366f1',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <span
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background:
                        lesson.status === 'PUBLISHED'
                          ? 'rgba(34,197,94,0.15)'
                          : lesson.status === 'SCHEDULED'
                          ? 'rgba(59,130,246,0.15)'
                          : 'rgba(234,179,8,0.18)',
                    }}
                  >
                    {lesson.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {lastUpdated && (
            <p style={{ marginTop: 16, fontSize: 12, color: '#64748b' }}>
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
