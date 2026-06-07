import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchProfile } from '../api/client';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useLocale } from '../hooks/useLocale';
import { LanguageSwitcher } from './LanguageSwitcher';
import navbarLogo from '../assets/img/navbar-logo.png';
import '../styles/layout.css';
import '../styles/auth.css';

const MOBILE_NAV_MQ = '(max-width: 767px)';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function SiteNavLinks({ user, onClose, onLogout, showLangSwitcher = false }) {
  const { settings } = useSiteConfig();
  const { to } = useLocale();
  const { t } = useTranslation('common');
  const hideSubsPublic = Boolean(settings?.hide_subscriptions_public);
  const canSeeSubs = !hideSubsPublic || Boolean(user?.is_admin);

  return (
    <>
      <NavLink
        to={to('home')}
        end
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
        onClick={onClose}
      >
        {t('nav.catalog')}
      </NavLink>
      <NavLink
        to={to('howItWorks')}
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
        onClick={onClose}
      >
        {t('nav.howItWorks')}
      </NavLink>
      <NavLink
        to={to('about')}
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
        onClick={onClose}
      >
        {t('nav.about')}
      </NavLink>
      <NavLink
        to={to('guides')}
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
        onClick={onClose}
      >
        {t('nav.guides')}
      </NavLink>
      <NavLink
        to={to('contact')}
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
        onClick={onClose}
      >
        {t('nav.contact')}
      </NavLink>
      {canSeeSubs && (
        <NavLink
          to={to('subscriptions')}
          className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          onClick={onClose}
        >
          {t('nav.subscriptions')}
        </NavLink>
      )}
      {user ? (
        <>
          {user?.is_admin && (
            <NavLink
              to={to('admin')}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
              onClick={onClose}
            >
              {t('nav.admin')}
            </NavLink>
          )}
          <NavLink
            to={to('profile')}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
            onClick={onClose}
          >
            {t('nav.profile')}
          </NavLink>
          <span className="nav-user">
            {t('nav.hello', { name: user.username })}
          </span>
          <button type="button" className="nav-link" onClick={onLogout}>
            {t('nav.logout')}
          </button>
        </>
      ) : (
        <NavLink
          to={to('auth')}
          className={({ isActive }) =>
            `nav-link nav-link--cta ${isActive ? 'nav-link--active' : ''}`
          }
          onClick={onClose}
        >
          {t('nav.login')}
        </NavLink>
      )}
      {showLangSwitcher && (
        <LanguageSwitcher className="lang-switcher--drawer" />
      )}
    </>
  );
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { to } = useLocale();
  const { t } = useTranslation('common');
  const [user, setUser] = useState(getStoredUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_NAV_MQ).matches,
  );

  useEffect(() => {
    function refreshUser() {
      setUser(getStoredUser());
    }
    window.addEventListener('auth-changed', refreshUser);
    window.addEventListener('storage', refreshUser);
    return () => {
      window.removeEventListener('auth-changed', refreshUser);
      window.removeEventListener('storage', refreshUser);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MQ);
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    fetchProfile()
      .then((data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen && isMobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, isMobile]);

  function handleLogout() {
    setMenuOpen(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-changed'));
    navigate(to('home'));
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const mobileDrawer =
    menuOpen &&
    isMobile &&
    createPortal(
      <>
        <button
          type="button"
          className="nav-overlay nav-overlay--visible"
          aria-label={t('menu.close')}
          onClick={closeMenu}
        />
        <nav
          id="site-nav"
          className="site-nav site-nav--open site-nav--mobile-drawer"
          aria-label={t('menu.mainNav')}
        >
          <SiteNavLinks
            user={user}
            onClose={closeMenu}
            onLogout={handleLogout}
            showLangSwitcher
          />
        </nav>
      </>,
      document.body,
    );

  return (
    <>
      <header
        className={`site-header ${menuOpen && isMobile ? 'site-header--menu-open' : ''}`}
      >
        <div className="site-header__inner">
          <Link to={to('home')} className="brand" onClick={closeMenu}>
            <img
              src={navbarLogo}
              alt={t('brand.alt')}
              className="brand__img"
              width={280}
              height={48}
              decoding="async"
            />
          </Link>

          {isMobile && (
            <button
              type="button"
              className={`nav-toggle ${menuOpen ? 'nav-toggle--open' : ''}`}
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              aria-label={menuOpen ? t('menu.close') : t('menu.open')}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="nav-toggle__bars" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
          )}

          {!isMobile && (
            <div className="site-header__end">
              <nav id="site-nav" className="site-nav" aria-label={t('menu.mainNav')}>
                <SiteNavLinks user={user} onClose={closeMenu} onLogout={handleLogout} />
              </nav>
              <LanguageSwitcher className="lang-switcher--header" />
            </div>
          )}
        </div>
      </header>
      {mobileDrawer}
    </>
  );
}
