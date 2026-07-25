'use client';

import { useState, useEffect, FormEvent } from 'react';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const DEFAULT_USERNAME = 'Mau6987';

interface GithubUser {
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitterUsername: string | null;
  email: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  githubProfileUrl: string;
  createdAt: string;
}

export default function Home() {
  const [input, setInput] = useState(DEFAULT_USERNAME);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function fetchUser(username: string) {
    if (!username.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${BACKEND_URL}/user/${username.trim()}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `El backend respondió ${res.status}`);
      }
      const data: GithubUser = await res.json();
      setUser(data);
      setStatus('idle');
    } catch (err: any) {
      setUser(null);
      setStatus('error');
      setErrorMsg(err.message || 'No se pudo conectar con el backend');
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    fetchUser(input);
  }

  useEffect(() => {
    fetchUser(DEFAULT_USERNAME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrap">
      <div className="brand">
        <b>$</b> whois — consulta de perfiles públicos de GitHub
      </div>

      <form className="terminal" onSubmit={handleSubmit}>
        <div className="terminal-chrome">
          <span className="dot r" />
          <span className="dot y" />
          <span className="dot g" />
          <span className="terminal-title">bash — user-lookup</span>
        </div>
        <div className="terminal-body">
          <div className="prompt-row">
            <span className="prompt-sign">➜</span>
            <span className="prompt-cmd">whois</span>
            <input
              className="prompt-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="usuario-de-github"
              autoFocus
              spellCheck={false}
            />
            <button
              type="submit"
              className="run-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'buscando…' : 'ejecutar'}
            </button>
          </div>
          
        </div>
      </form>

      {status === 'loading' && (
        <p className="state loading">consultando api.github.com</p>
      )}

      {status === 'error' && (
        <p className="state error">✕ error: {errorMsg}</p>
      )}

      {user && status !== 'loading' && (
        <main className="card">
          <div className="card-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.avatarUrl} alt={user.username} className="avatar" />
            <div className="identity">
              <div className="name">{user.name || user.username}</div>
              <div className="login">@{user.username}</div>
              {user.bio && <div className="bio">{user.bio}</div>}
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-value">{user.publicRepos}</div>
              <div className="stat-label">Repos</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.followers}</div>
              <div className="stat-label">Seguidores</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.following}</div>
              <div className="stat-label">Siguiendo</div>
            </div>
            <div className="stat">
              <div className="stat-value">{user.publicGists}</div>
              <div className="stat-label">Gists</div>
            </div>
          </div>

          <div className="info-meta">
            {user.company && (
              <div className="info-row">
                <span className="info-label">Compañía</span>
                <span className="info-value">{user.company}</span>
              </div>
            )}
            {user.location && (
              <div className="info-row">
                <span className="info-label">Ubicación</span>
                <span className="info-value">{user.location}</span>
              </div>
            )}
            {user.blog && (
              <div className="info-row">
                <span className="info-label">Sitio web</span>
                <span className="info-value">{user.blog}</span>
              </div>
            )}
            {user.twitterUsername && (
              <div className="info-row">
                <span className="info-label">Twitter</span>
                <span className="info-value">@{user.twitterUsername}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Miembro desde</span>
              <span className="info-value">
                {new Date(user.createdAt).toLocaleDateString('es-AR')}
              </span>
            </div>
          </div>

          <a
            href={user.githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            Ver perfil en GitHub ↗
          </a>
        </main>
      )}
    </div>
  );
}
