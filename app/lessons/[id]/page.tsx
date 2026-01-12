'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Lesson = {
  id: string;
  title: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  publishAt: string | null;
  publishedAt: string | null;
  isPaid: boolean;
  contentType: 'VIDEO' | 'ARTICLE';
  durationMs: number | null;
};

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // lesson fields
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Lesson['status']>('DRAFT');
  const [publishAt, setPublishAt] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  // content fields
  const [contentType, setContentType] = useState<'video' | 'article'>('video');
  const [durationMs, setDurationMs] = useState<number | ''>('');

  // UI state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLesson() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No token found in localStorage');
          router.push('/login');
          return;
        }

        const res = await fetch(`http://localhost:4000/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error('API error', res.status);
          const text = await res.text();
          console.error('API response:', text);
          setApiError(`Failed to load lesson (${res.status})`);
          return;
        }

        const data: Lesson = await res.json();

        setTitle(data.title);
        setStatus(data.status);
        setPublishAt(
          data.publishAt
            ? new Date(data.publishAt).toISOString().slice(0, 16)
            : '',
        );
        setIsPaid(data.isPaid);
        setContentType(data.contentType === 'VIDEO' ? 'video' : 'article');
        setDurationMs(data.durationMs ?? '');
      } catch (err) {
        console.error('Fetch failed', err);
        setApiError('Network error while loading lesson.');
      }
    }

    if (id) loadLesson();
  }, [id, router]);

  async function save() {
    setValidationError(null);
    setApiError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    if (contentType === 'video' && (!durationMs || durationMs <= 0)) {
      setValidationError('Duration (ms) is required for video lessons.');
      setIsSaving(false);
      return;
    }

    if (
      (status === 'SCHEDULED' || status === 'PUBLISHED') &&
      !publishAt
    ) {
      setValidationError('Publish At is required.');
      setIsSaving(false);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token || !id) {
      setApiError('Missing token or lesson id.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/lessons/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          publishAt: publishAt ? new Date(publishAt).toISOString() : null,
          isPaid,
          contentType: contentType === 'video' ? 'VIDEO' : 'ARTICLE',
          durationMs: durationMs === '' ? null : durationMs,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setApiError(data?.message || `Save failed (${res.status})`);
        return;
      }

      setSuccessMessage('Lesson saved successfully.');
      setTimeout(() => router.push('/lessons'), 800);
    } catch (err) {
      console.error(err);
      setApiError('Network error while saving.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: 40 }}>
      <header style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <img
          src="/chaishots-logo.png"
          alt="Chaishots"
          style={{ width: 200, borderRadius: 16 }}
        />
        <div>
          <h1>Edit: {title || 'Lesson'}</h1>
          <p>Update lesson details and publishing rules</p>
        </div>
      </header>

      {validationError && (
        <p style={{ color: 'red', marginTop: 16 }}>{validationError}</p>
      )}
      {apiError && (
        <p style={{ color: 'red', marginTop: 8 }}>{apiError}</p>
      )}
      {successMessage && (
        <p style={{ color: 'green', marginTop: 8 }}>{successMessage}</p>
      )}

      <div style={{ marginTop: 24, display: 'grid', gap: 16 }}>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as Lesson['status'])
          }
        >
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PUBLISHED">Published</option>
        </select>

        <input
          type="datetime-local"
          value={publishAt}
          onChange={(e) => setPublishAt(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
          />
          {' '}Paid Lesson
        </label>

        <select
          value={contentType}
          onChange={(e) =>
            setContentType(e.target.value as 'video' | 'article')
          }
        >
          <option value="video">Video</option>
          <option value="article">Article</option>
        </select>

        {contentType === 'video' && (
          <input
            type="number"
            placeholder="Duration (ms)"
            value={durationMs}
            onChange={(e) =>
              setDurationMs(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
          />
        )}

        <button onClick={save} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save Lesson'}
        </button>
      </div>
    </div>
  );
}
