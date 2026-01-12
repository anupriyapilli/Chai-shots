'use client';

import { useState } from 'react';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@chaishots.test');
  const [password, setPassword] = useState('Admin123!');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setToken('');

    // This is effectively your handleSubmit logic, but actually used:
    const formData = { email, password };

    try {
      const data = await login(formData); // uses NEXT_PUBLIC_API_BASE_URL

      // ✅ Save token + redirect
      localStorage.setItem('accessToken', data.accessToken);
      setToken(data.accessToken);
      window.location.href = '/lessons';
    } catch (err: any) {
      // If login throws or backend returns error, show something
      const message =
        err?.message && typeof err.message === 'string'
          ? err.message
          : 'Network or server error';
      setError(message);
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      >
        <source src="/bg.mp4.mp4" type="video/mp4" />
      </video>

      {/* 🌫️ OVERLAY */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))',
          zIndex: -1,
        }}
      />

      {/* 🧱 CONTENT */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 20,
            padding: 32,
            boxShadow: '0 30px 80px rgba(153, 15, 123, 0.35)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* 🟡 LOGO */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img
              src="/chaishots-logo.png"
              alt="Chaishots"
              style={{
                width: 160,
                borderRadius: 16,
                background: '#fde047',
                padding: 12,
              }}
            />
          </div>

          <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h1>

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: 16 }}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #cbd5f5',
                }}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #cbd5f5',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: 14,
                borderRadius: 10,
                border: 'none',
                background: '#2563eb',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Sign in
            </button>
          </form>

          {error && (
            <p
              style={{
                color: '#dc2626',
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              {error}
            </p>
          )}

          {token && (
            <div
              style={{
                marginTop: 20,
                background: '#f1f59',
                padding: 12,
                borderRadius: 8,
                fontSize: 12,
              }}
            >
              <p>Access Token:</p>
              <textarea
                rows={3}
                value={token}
                readOnly
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
