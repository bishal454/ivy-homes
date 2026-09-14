import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { fetchCatalog } from './data/catalog';
import { FiltersBar } from './components/FiltersBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetails } from './components/PropertyDetails';

const API_BASE = import.meta.env.VITE_IVY_API_BASE_URL || 'https://solve.ivy.homes';
const API_KEY = import.meta.env.VITE_IVY_API_KEY || '';
const defaultEmail = import.meta.env.VITE_IVY_DEMO_EMAIL || 'demo1@ivy.homes';
const savedKey = (email) => `ivy-saved-homes-${email}`;
const sessionKey = 'ivy-session';
const defaultFilters = {
  locality: '',
  bedroom: '',
  furnishing: '',
  minPrice: '',
  maxPrice: '',
};

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const pretty = (value = '') =>
  String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

function readSession() {
  try {
    const value = localStorage.getItem(sessionKey);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || 'Unable to sign in.');
  }
  return { ...(await response.json()), email };
}

async function refreshSession(session) {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) throw new Error('Your session expired. Please sign in again.');
  return { ...session, ...(await response.json()) };
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(import.meta.env.VITE_IVY_DEMO_PASSWORD || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = await login(email, password);
      localStorage.setItem(sessionKey, JSON.stringify(session));
      onLogin(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-intro">
        <p className="eyebrow">IVY HOMES</p>
        <h1>Find a home that feels right.</h1>
        <p>Browse the complete city inventory, compare projects, and save properties to your personal shortlist.</p>
      </section>
      <form className="login-form" onSubmit={submit}>
        <p className="eyebrow">WELCOME BACK</p>
        <h2>Sign in to continue</h2>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}

export default function App() {
  const [session, setSession] = useState(readSession);
  const [view, setView] = useState('homes');
  const [items, setItems] = useState({ listings: [], rentals: [], projects: [] });
  const [filters, setFilters] = useState(defaultFilters);
  const [saved, setSaved] = useState(() => {
    const currentSession = readSession();
    try {
      return new Set(JSON.parse(localStorage.getItem(savedKey(currentSession?.email || defaultEmail)) || '[]'));
    } catch {
      return new Set();
    }
  });
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!session?.refresh_token) return undefined;
    let active = true;
    const renew = async () => {
      try {
        const nextSession = await refreshSession(session);
        if (!active) return;
        localStorage.setItem(sessionKey, JSON.stringify(nextSession));
        setSession(nextSession);
      } catch {
        localStorage.removeItem(sessionKey);
        if (active) setSession(null);
      }
    };
    const timer = window.setInterval(renew, 10 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [session]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const catalog = await fetchCatalog();
        if (!active) return;
        setItems(catalog);
      } catch (error) {
        console.error(error);
        if (active) setLoadError(error.message || 'Property data could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (session?.email) localStorage.setItem(savedKey(session.email), JSON.stringify([...saved]));
  }, [saved, session]);

  const activeCollection =
    view === 'homes'
      ? items.listings
      : view === 'rentals'
        ? items.rentals
        : view === 'projects'
          ? items.projects
          : items.listings.filter((item) => saved.has(item.listing_id));

  const localities = useMemo(() => {
    return [...new Set(activeCollection.map((item) => item.locality).filter(Boolean))].sort();
  }, [activeCollection]);

  const visibleItems = useMemo(() => {
    return activeCollection.filter((item) => {
      const localityMatch = !filters.locality || item.locality === filters.locality;
      const bedroomMatch = !filters.bedroom || Number(item.bedroom) === Number(filters.bedroom);
      const furnishingMatch = !filters.furnishing || item.furnishing === filters.furnishing;
      const minPriceMatch = !filters.minPrice || Number(item.price || item.price_min || 0) >= Number(filters.minPrice);
      const maxPriceMatch = !filters.maxPrice || Number(item.price || item.price_min || 0) <= Number(filters.maxPrice);
      return localityMatch && bedroomMatch && furnishingMatch && minPriceMatch && maxPriceMatch;
    });
  }, [activeCollection, filters]);

  const selectedItem =
    [...items.listings, ...items.rentals, ...items.projects].find(
      (item) => (item.listing_id || item.project_id) === selectedId,
    ) || null;

  const toggleSaved = (item) => {
    const id = item.listing_id || item.project_id;
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!session) return <LoginScreen onLogin={setSession} />;

  if (selectedItem) {
    return (
      <PropertyDetails
        item={selectedItem}
        saved={saved.has(selectedItem.listing_id || selectedItem.project_id)}
        onBack={() => setSelectedId(null)}
        onToggle={toggleSaved}
      />
    );
  }

  const stats = [
    {
      label: 'Live listings',
      value: items.listings.filter((item) => item.is_live).length.toLocaleString('en-IN'),
    },
    {
      label: 'Rental records',
      value: items.rentals.length.toLocaleString('en-IN'),
    },
    {
      label: 'Projects',
      value: items.projects.length.toLocaleString('en-IN'),
    },
  ];

  return (
    <div className={sidebarCollapsed ? 'page-shell sidebar-collapsed' : 'page-shell'}>
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">I</span>
          {!sidebarCollapsed && <span className="brand-text">Ivy Homes</span>}
        </div>

        <nav className="sidebar-nav">
          {[
            ['homes', 'Homes'],
            ['rentals', 'Rentals'],
            ['projects', 'Projects'],
            ['saved', 'Saved'],
          ].map(([name, label]) => (
            <button
              key={name}
              type="button"
              className={view === name ? 'nav-item active' : 'nav-item'}
              onClick={() => setView(name)}
            >
              {!sidebarCollapsed && label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar-toggle"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setSidebarCollapsed((current) => !current)}
        >
          <span aria-hidden="true">{sidebarCollapsed ? '›' : '‹'}</span>
          {!sidebarCollapsed && <span>Collapse menu</span>}
        </button>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">PROPERTY SEARCH</p>
            <h1>{view === 'saved' ? 'Saved homes' : view === 'rentals' ? 'Rental homes' : view === 'projects' ? 'Projects' : 'Homes for sale'}</h1>
          </div>
          <div className="topbar-meta">
            <span>{money(visibleItems.reduce((sum, item) => sum + (item.price || item.price_min || item.price_max || 0), 0))}</span>
            <small>visible market value</small>
          </div>
          <button
            type="button"
            className="signout-button"
            onClick={() => {
              localStorage.removeItem(sessionKey);
              setSession(null);
            }}
          >
            Sign out
          </button>
        </header>

        <section className="hero-panel">
          <div>
            <p className="eyebrow muted">Curated inventory</p>
            <h2>Browse all listings in your city.</h2>
          </div>
          <div className="stats-row">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <small>{stat.label}</small>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </section>

        {view !== 'saved' ? (
          <FiltersBar filters={filters} localities={localities} onChange={setFilters} />
        ) : null}

        <div className="section-header">
          <span>{loading ? 'Loading dataset…' : `${visibleItems.length.toLocaleString('en-IN')} properties found`}</span>
        </div>

        <section className="listing-grid">
          {loading ? (
            <div className="empty-state">Loading live property data…</div>
          ) : loadError ? (
            <div className="empty-state error-state">
              <strong>{loadError}</strong>
              <button type="button" className="retry-btn" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="empty-state">No properties match the current filters.</div>
          ) : (
            visibleItems.map((item) => (
              <PropertyCard
                key={item.listing_id || item.project_id}
                item={item}
                kind={view === 'saved' ? 'homes' : view}
                saved={saved.has(item.listing_id || item.project_id)}
                onSelect={(selected) => setSelectedId(selected.listing_id || selected.project_id)}
                onToggle={toggleSaved}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
