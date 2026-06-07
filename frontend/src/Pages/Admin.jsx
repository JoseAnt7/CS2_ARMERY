import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import {
  adminCreateUser,
  adminPatchSettings,
  adminPatchUser,
  adminSetUserSubscription,
  fetchAdminStats,
  fetchAdminSettings,
  fetchAdminUsers,
  fetchSubscriptions,
} from '../api/client';
import { useSiteConfig } from '../context/SiteConfigContext';
import { applyColorTheme, resolveColorTheme } from '../utils/applyColorTheme';
import { useLocale } from '../hooks/useLocale';
import '../styles/admin.css';

const THEME_IDS = ['orange', 'blue'];

function getToken() {
  return localStorage.getItem('access_token');
}

export function Admin() {
  const { to } = useLocale();
  const { t } = useTranslation(['admin', 'auth']);
  const { refresh: refreshSiteConfig } = useSiteConfig();
  const token = getToken();
  const [forbidden, setForbidden] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [subsCatalog, setSubsCatalog] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [draftHideSubs, setDraftHideSubs] = useState(false);
  const [savedHideSubs, setSavedHideSubs] = useState(false);
  const [draftTheme, setDraftTheme] = useState('orange');
  const [savedTheme, setSavedTheme] = useState('orange');
  const [savingSiteSettings, setSavingSiteSettings] = useState(false);
  const [siteSettingsMsg, setSiteSettingsMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false,
  });
  const [subEdit, setSubEdit] = useState({});
  const savedThemeRef = useRef('orange');
  savedThemeRef.current = savedTheme;

  const publicPages = useMemo(
    () => [
      {
        id: 'subscriptions',
        labelKey: 'visibility.pages.subscriptions',
        path: to('subscriptions'),
        settingKey: 'hide_subscriptions_public',
      },
    ],
    [to],
  );

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.id - b.id),
    [users],
  );

  const loadAll = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [s, u, catalog] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers(),
        fetchSubscriptions({ includePlans: true }),
      ]);
      const settingsRes = await fetchAdminSettings();
      setStats(s);
      setUsers(u.items || []);
      setSubsCatalog(catalog.items || []);
      const settings = settingsRes.settings || null;
      setSiteSettings(settings);
      const hideSubs = Boolean(settings?.hide_subscriptions_public);
      const theme = resolveColorTheme(settings?.color_theme);
      setDraftHideSubs(hideSubs);
      setSavedHideSubs(hideSubs);
      setDraftTheme(theme);
      setSavedTheme(theme);
      applyColorTheme(theme);
      setForbidden(false);
    } catch (err) {
      const msg = String(err.message || '');
      if (/\b403\b|No autorizado|forbidden/i.test(msg)) {
        setForbidden(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadAll();
  }, [token, loadAll]);

  useEffect(() => {
    return () => applyColorTheme(savedThemeRef.current);
  }, []);

  const handleCreateUser = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      try {
        await adminCreateUser({
          username: newUser.username.trim(),
          email: newUser.email.trim(),
          password: newUser.password,
          is_admin: newUser.is_admin,
        });
        setNewUser({ username: '', email: '', password: '', is_admin: false });
        await loadAll();
      } catch (err) {
        setError(err.message);
      }
    },
    [newUser, loadAll],
  );

  const toggleAdmin = useCallback(
    async (u) => {
      setError('');
      try {
        await adminPatchUser(u.id, { is_admin: !u.is_admin });
        await loadAll();
      } catch (err) {
        setError(err.message);
      }
    },
    [loadAll],
  );

  const planOptionsForSub = useCallback(
    (subSlug) => {
      const sub = subsCatalog.find((s) => s.slug === subSlug);
      return sub?.plans || [];
    },
    [subsCatalog],
  );

  const saveSubscription = useCallback(
    async (userId) => {
      const edit = subEdit[userId] || {};
      const activeRow = sortedUsers.find((x) => x.id === userId);
      const activeSubs = (activeRow?.subscriptions || []).filter((s) => s.is_active);

      const subscription_slug =
        edit.subscription_slug ||
        activeSubs[0]?.subscription?.slug ||
        subsCatalog[0]?.slug;

      const plans = planOptionsForSub(subscription_slug);
      const plan_slug =
        edit.plan_slug || activeSubs[0]?.plan?.slug || plans[0]?.slug;

      if (!subscription_slug || !plan_slug) {
        setError(t('admin:errors.noSubscription'));
        return;
      }
      setError('');
      try {
        await adminSetUserSubscription(userId, { subscription_slug, plan_slug });
        await loadAll();
      } catch (err) {
        setError(err.message);
      }
    },
    [subEdit, sortedUsers, subsCatalog, planOptionsForSub, loadAll, t],
  );

  const siteSettingsDirty =
    draftHideSubs !== savedHideSubs || draftTheme !== savedTheme;

  function selectDraftTheme(themeId) {
    setSiteSettingsMsg('');
    const next = resolveColorTheme(themeId);
    setDraftTheme(next);
    applyColorTheme(next);
  }

  async function saveSiteSettings() {
    setError('');
    setSiteSettingsMsg('');
    setSavingSiteSettings(true);
    try {
      const res = await adminPatchSettings({
        hide_subscriptions_public: draftHideSubs,
        color_theme: draftTheme,
      });
      const settings = res.settings || null;
      const nextHide = Boolean(settings?.hide_subscriptions_public);
      const nextTheme = resolveColorTheme(settings?.color_theme);
      setSiteSettings(settings);
      setDraftHideSubs(nextHide);
      setSavedHideSubs(nextHide);
      setDraftTheme(nextTheme);
      setSavedTheme(nextTheme);
      applyColorTheme(nextTheme);
      await refreshSiteConfig();
      setSiteSettingsMsg(t('admin:settingsSaved'));
    } catch (err) {
      setError(err.message);
      applyColorTheme(savedTheme);
      setDraftTheme(savedTheme);
    } finally {
      setSavingSiteSettings(false);
    }
  }

  if (!token) {
    return <Navigate to={to('auth')} replace state={{ from: to('admin') }} />;
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-hint">{t('admin:loading')}</p>
      </div>
    );
  }

  if (forbidden) {
    return <Navigate to={to('home')} replace />;
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">{t('admin:title')}</h1>
          <p className="admin-page__subtitle">{t('admin:subtitle')}</p>
        </div>
      </header>

      {error && <p className="admin-error">{error}</p>}

      <section className="admin-section">
        <h2 className="admin-section-title">{t('admin:appearance.title')}</h2>
        <p className="admin-note">{t('admin:appearance.note')}</p>
        <div className="admin-theme-grid" role="radiogroup" aria-label={t('admin:appearance.themeLabel')}>
          {THEME_IDS.map((themeId) => {
            const selected = draftTheme === themeId;
            return (
              <button
                key={themeId}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`admin-theme-card ${selected ? 'admin-theme-card--active' : ''}`}
                onClick={() => selectDraftTheme(themeId)}
              >
                <span className="admin-theme-card__swatches" aria-hidden>
                  {(themeId === 'orange' ? ['#f5a623', '#e67e22'] : ['#4d9fff', '#2563eb']).map(
                    (color) => (
                      <span key={color} style={{ background: color }} />
                    ),
                  )}
                </span>
                <span className="admin-theme-card__label">{t(`admin:themes.${themeId}.label`)}</span>
                <span className="admin-theme-card__desc">
                  {t(`admin:themes.${themeId}.description`)}
                </span>
                {selected && (
                  <span className="admin-theme-card__badge">{t('admin:appearance.selected')}</span>
                )}
              </button>
            );
          })}
        </div>
        <p className="admin-theme-preview">
          <Trans
            i18nKey="appearance.preview"
            ns="admin"
            components={{ accent: <span className="admin-theme-preview__accent" /> }}
          />
        </p>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">{t('admin:visibility.title')}</h2>
        <p className="admin-note">{t('admin:visibility.note')}</p>
        <div className="admin-table-wrap">
          <table className="admin-table admin-visibility-table">
            <thead>
              <tr>
                <th>{t('admin:visibility.colPage')}</th>
                <th>{t('admin:visibility.colPath')}</th>
                <th>{t('admin:visibility.colPublic')}</th>
              </tr>
            </thead>
            <tbody>
              {publicPages.map((page) => {
                const isPublicVisible = !draftHideSubs;
                return (
                  <tr key={page.id}>
                    <td data-label={t('admin:visibility.colPage')}>{t(`admin:${page.labelKey}`)}</td>
                    <td data-label={t('admin:visibility.colPath')}>
                      <code>{page.path}</code>
                    </td>
                    <td data-label={t('admin:visibility.colPublic')}>
                      <button
                        type="button"
                        className={`admin-visibility-toggle ${isPublicVisible ? 'admin-visibility-toggle--on' : 'admin-visibility-toggle--off'}`}
                        onClick={() => {
                          setSiteSettingsMsg('');
                          setDraftHideSubs((prev) => !prev);
                        }}
                        title={
                          isPublicVisible
                            ? t('admin:visibility.publicTitle')
                            : t('admin:visibility.hiddenTitle')
                        }
                        aria-label={
                          isPublicVisible
                            ? t('admin:visibility.hidePublic')
                            : t('admin:visibility.showPublic')
                        }
                      >
                        {isPublicVisible ? '👁' : '🚫'}
                      </button>
                      <span className="admin-visibility-status">
                        {isPublicVisible
                          ? t('admin:visibility.visible')
                          : t('admin:visibility.hidden')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="admin-visibility-actions">
          <button
            type="button"
            className="admin-btn"
            disabled={!siteSettingsDirty || savingSiteSettings}
            onClick={saveSiteSettings}
          >
            {savingSiteSettings ? t('admin:visibility.saving') : t('admin:visibility.save')}
          </button>
          {siteSettingsMsg && (
            <span className="admin-visibility-msg">{siteSettingsMsg}</span>
          )}
        </div>
      </section>

      {stats && (
        <section className="admin-stats admin-section">
          <h2 className="admin-section-title">{t('admin:stats.title')}</h2>
          <p className="admin-note">{t('admin:stats.note')}</p>
          <div className="admin-stats__grid">
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">{t('admin:stats.today')}</span>
              <strong className="admin-stat-card__value">{stats.visits?.day ?? 0}</strong>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">{t('admin:stats.month')}</span>
              <strong className="admin-stat-card__value">{stats.visits?.month ?? 0}</strong>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">{t('admin:stats.year')}</span>
              <strong className="admin-stat-card__value">{stats.visits?.year ?? 0}</strong>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">{t('admin:stats.users')}</span>
              <strong className="admin-stat-card__value">{stats.users_total ?? 0}</strong>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">{t('admin:stats.admins')}</span>
              <strong className="admin-stat-card__value">{stats.admins_total ?? 0}</strong>
            </div>
          </div>
        </section>
      )}

      <section className="admin-section">
        <h2 className="admin-section-title">{t('admin:createUser.title')}</h2>
        <form className="admin-form" onSubmit={handleCreateUser}>
          <label>
            {t('admin:createUser.username')}
            <input
              value={newUser.username}
              onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))}
              required
            />
          </label>
          <label>
            {t('admin:createUser.email')}
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </label>
          <label>
            {t('admin:createUser.password')}
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
              minLength={6}
              required
            />
          </label>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={newUser.is_admin}
              onChange={(e) => setNewUser((p) => ({ ...p, is_admin: e.target.checked }))}
            />
            {t('admin:createUser.asAdmin')}
          </label>
          <button type="submit" className="admin-btn">
            {t('admin:createUser.submit')}
          </button>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">{t('admin:users.title')}</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin:users.colId')}</th>
                <th>{t('admin:users.colUsername')}</th>
                <th>{t('admin:users.colEmail')}</th>
                <th>{t('admin:users.colRole')}</th>
                <th>{t('admin:users.colSubs')}</th>
                <th>{t('admin:users.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u) => {
                const activeSubs = (u.subscriptions || []).filter((s) => s.is_active);
                const edit = subEdit[u.id] || {};
                const defaultSub = subsCatalog[0];
                const selSub =
                  edit.subscription_slug ||
                  activeSubs[0]?.subscription?.slug ||
                  defaultSub?.slug;
                const plans = planOptionsForSub(selSub);
                const selPlan =
                  edit.plan_slug ||
                  activeSubs[0]?.plan?.slug ||
                  plans[0]?.slug;

                return (
                  <tr key={u.id}>
                    <td data-label={t('admin:users.colId')}>{u.id}</td>
                    <td data-label={t('admin:users.colUsername')}>{u.username}</td>
                    <td data-label={t('admin:users.colEmail')}>{u.email}</td>
                    <td data-label={t('admin:users.colRole')}>
                      <span className={u.is_admin ? 'admin-badge admin-badge--gold' : 'admin-badge'}>
                        {u.is_admin
                          ? u.admin_protected
                            ? t('admin:users.roleMainAdmin')
                            : t('admin:users.roleAdmin')
                          : t('admin:users.roleUser')}
                      </span>
                    </td>
                    <td data-label={t('admin:users.colSubs')}>
                      <ul className="admin-sub-list">
                        {activeSubs.length === 0 && (
                          <li className="muted">{t('admin:users.noActiveSub')}</li>
                        )}
                        {activeSubs.map((s) => (
                          <li key={s.id}>
                            {s.subscription?.name} · {s.plan?.name}
                          </li>
                        ))}
                      </ul>
                      <div className="admin-sub-form">
                        <select
                          value={selSub || ''}
                          onChange={(e) =>
                            setSubEdit((prev) => ({
                              ...prev,
                              [u.id]: {
                                subscription_slug: e.target.value,
                                plan_slug: '',
                              },
                            }))
                          }
                          className="admin-select"
                        >
                          {subsCatalog.map((sub) => (
                            <option key={sub.slug} value={sub.slug}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selPlan || ''}
                          onChange={(e) =>
                            setSubEdit((prev) => ({
                              ...prev,
                              [u.id]: {
                                subscription_slug:
                                  prev[u.id]?.subscription_slug || selSub,
                                plan_slug: e.target.value,
                              },
                            }))
                          }
                          className="admin-select"
                        >
                          {(planOptionsForSub(selSub) || []).map((p) => (
                            <option key={p.slug} value={p.slug}>
                              {p.name} ({p.price_eur}€)
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm"
                          onClick={() => saveSubscription(u.id)}
                        >
                          {t('admin:users.saveSub')}
                        </button>
                      </div>
                    </td>
                    <td data-label={t('admin:users.colActions')}>
                      {!(u.admin_protected && u.is_admin) && (
                        <button
                          type="button"
                          className="admin-btn admin-btn--outline"
                          onClick={() => toggleAdmin(u)}
                        >
                          {u.is_admin
                            ? t('admin:users.removeAdmin')
                            : t('admin:users.makeAdmin')}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section admin-bootstrap-hint">
        <h2 className="admin-section-title">{t('admin:bootstrap.title')}</h2>
        <p>
          <Trans
            i18nKey="bootstrap.text"
            ns="admin"
            components={{
              code1: <code />,
              code2: <code />,
              code3: <code />,
            }}
          />
        </p>
      </section>
    </div>
  );
}
