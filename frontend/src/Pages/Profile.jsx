import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deleteAccount, fetchProfile, updateProfile } from '../api/client';
import { ProfileSubscriptionsSection } from '../components/ProfileSubscriptionsSection';
import { useLocale } from '../hooks/useLocale';
import '../styles/profile.css';
import '../styles/auth.css';

const SECTION_IDS = ['account', 'subscriptions', 'alerts', 'delete'];

function formatDate(iso, locale) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function AccountSection({ user, onUpdated, locale }) {
  const { t } = useTranslation(['profile', 'auth']);
  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (form.password && form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: t('auth:passwordMismatch') });
      return;
    }

    if (form.password && form.password.length < 6) {
      setMessage({ type: 'error', text: t('auth:passwordMinLength') });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
      };
      if (form.password) payload.password = form.password;

      const data = await updateProfile(payload);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-changed'));
      onUpdated(data.user);
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setMessage({ type: 'success', text: t('profile:account.updateSuccess') });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="profile-section__title">{t('profile:account.title')}</h2>
      <p className="profile-section__desc">{t('profile:account.desc')}</p>

      <div className="profile-readonly">
        <div className="profile-readonly__row">
          <span className="profile-readonly__label">{t('profile:account.memberSince')}</span>
          <span className="profile-readonly__value">{formatDate(user.created_at, locale)}</span>
        </div>
        <div className="profile-readonly__row">
          <span className="profile-readonly__label">{t('profile:account.accountId')}</span>
          <span className="profile-readonly__value">#{user.id}</span>
        </div>
      </div>

      <form className="profile-form auth-form" style={{ padding: 0 }} onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="profile-username">{t('auth:username')}</label>
          <input
            id="profile-username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="profile-email">{t('auth:email')}</label>
          <input
            id="profile-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="profile-password">{t('profile:account.passwordOptional')}</label>
          <input
            id="profile-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder={t('profile:account.passwordPlaceholder')}
          />
        </div>
        {form.password && (
          <div className="form-field">
            <label htmlFor="profile-confirm">{t('profile:account.confirmPassword')}</label>
            <input
              id="profile-confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>
        )}
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? t('profile:account.saving') : t('profile:account.save')}
        </button>
      </form>

      {message.text && (
        <p className={`profile-message profile-message--${message.type}`}>{message.text}</p>
      )}
    </section>
  );
}

function PlaceholderSection({ title, description, text, locked }) {
  return (
    <section>
      <h2 className="profile-section__title">{title}</h2>
      <p className="profile-section__desc">{description}</p>
      <div className={`profile-placeholder ${locked ? 'profile-placeholder--locked' : ''}`}>
        {locked && <div className="profile-placeholder__icon" aria-hidden>🔒</div>}
        <p>{text}</p>
      </div>
    </section>
  );
}

function DeleteSection() {
  const navigate = useNavigate();
  const { to } = useLocale();
  const { t } = useTranslation('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function handleDelete() {
    if (!window.confirm(t('delete.confirm'))) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await deleteAccount();
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-changed'));
      navigate(to('home'));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="profile-section__title">{t('delete.title')}</h2>
      <p className="profile-section__desc">{t('delete.desc')}</p>

      <div className="profile-delete-box">
        <p>{t('delete.warning')}</p>
        <button
          type="button"
          className="profile-delete-btn"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? t('delete.submitting') : t('delete.submit')}
        </button>
      </div>

      {message.text && (
        <p className={`profile-message profile-message--${message.type}`}>{message.text}</p>
      )}
    </section>
  );
}

export function Profile() {
  const { to, locale } = useLocale();
  const { t } = useTranslation('profile');
  const token = localStorage.getItem('access_token');
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(
    location.state?.section || 'account',
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetchProfile()
      .then((data) => {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-changed'));
      })
      .catch((err) => {
        const authError = /Subject must be a string|Missing Authorization|Token|401|422/i.test(
          err.message,
        );
        if (authError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth-changed'));
        }
        setError(authError ? t('sessionExpired') : err.message);
      })
      .finally(() => setLoading(false));
  }, [token, t]);

  if (!token) {
    return <Navigate to={to('auth')} replace />;
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner" />
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-guard">
        <p>{error || t('loadError')}</p>
        <Link to={to('auth')} className="profile-guard__link">
          {t('loginLink')}
        </Link>
      </div>
    );
  }

  function renderSection() {
    switch (activeSection) {
      case 'account':
        return <AccountSection user={user} onUpdated={setUser} locale={locale} />;
      case 'subscriptions':
        return <ProfileSubscriptionsSection />;
      case 'alerts':
        return (
          <PlaceholderSection
            title={t('alerts.title')}
            description={t('alerts.desc')}
            text={t('alerts.placeholder')}
            locked
          />
        );
      case 'delete':
        return <DeleteSection />;
      default:
        return null;
    }
  }

  const sectionMeta = {
    account: { icon: '👤', locked: false },
    subscriptions: { icon: '⭐', locked: false },
    alerts: { icon: '🔔', locked: true },
    delete: { icon: '🗑️', locked: false },
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <h1 className="profile-sidebar__title">{t('sidebarTitle')}</h1>
        <ul className="profile-nav">
          {SECTION_IDS.map((id) => (
            <li key={id} className="profile-nav__item">
              <button
                type="button"
                className={`profile-nav__btn ${
                  activeSection === id ? 'profile-nav__btn--active' : ''
                } ${sectionMeta[id].locked ? 'profile-nav__btn--locked' : ''}`}
                onClick={() => setActiveSection(id)}
                aria-current={activeSection === id ? 'page' : undefined}
              >
                <span className="profile-nav__icon" aria-hidden>
                  {sectionMeta[id].icon}
                </span>
                {t(`sections.${id}`)}
                {sectionMeta[id].locked && <span className="profile-nav__lock">🔒</span>}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="profile-content">{renderSection()}</div>
    </div>
  );
}
