import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchWeaponFilters, fetchWeapons } from '../api/client';
import { FilterBar } from '../components/FilterBar';
import { WeaponCard } from '../components/WeaponCard';
import { HomeEditorial } from '../components/HomeEditorial';
import '../styles/catalog.css';
import '../styles/info.css';

export function Home() {
  const { t, i18n } = useTranslation(['home', 'catalog', 'common']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([{ id: 'all', label: t('catalog:filters.all') }]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState(() => searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('q') || '');
  const [exterior, setExterior] = useState('all');
  const [rarity, setRarity] = useState('all');
  const [exteriorOptions, setExteriorOptions] = useState([]);
  const [rarityOptions, setRarityOptions] = useState([]);
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        setCategories([
          { id: 'all', label: t('catalog:filters.all') },
          ...res.categories.filter((c) => c.id !== 'all'),
        ]);
      })
      .catch(() => {});

    fetchWeaponFilters()
      .then((res) => {
        setExteriorOptions(res.exteriors || []);
        setRarityOptions(res.rarities || []);
      })
      .catch(() => {});
  }, [t, i18n.language]);

  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    setSearch((prev) => (prev === urlQ ? prev : urlQ));
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      const trimmed = search.trim();
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (trimmed) next.set('q', trimmed);
          else next.delete('q');
          return next;
        },
        { replace: true },
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [search, setSearchParams]);

  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch, exterior, rarity, sort]);

  const loadWeapons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeapons({
        category,
        q: debouncedSearch,
        exterior,
        rarity,
        page,
        limit: 24,
        sort,
        prices: true,
      });
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [category, debouncedSearch, exterior, rarity, page, sort]);

  useEffect(() => {
    loadWeapons();
  }, [loadWeapons]);

  const localeTag = i18n.language === 'en' ? 'en-US' : 'es-ES';

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">
          <Trans i18nKey="hero.title" ns="home" components={{ span: <span /> }} />
        </h1>
        <p className="hero__subtitle">{t('home:hero.subtitle')}</p>
      </section>

      <FilterBar
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
        searchQuery={search}
        onSearchChange={setSearch}
        exterior={exterior}
        onExteriorChange={setExterior}
        rarity={rarity}
        onRarityChange={setRarity}
        exteriorOptions={exteriorOptions}
        rarityOptions={rarityOptions}
        sort={sort}
        onSortChange={setSort}
      />

      {data && (
        <div className="results-meta">
          <span>{t('home:meta.skinsFound', { count: data.total.toLocaleString(localeTag) })}</span>
          <span>{t('home:meta.pageOf', { page: data.page, pages: data.pages })}</span>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>{t('home:loading')}</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{t('home:error.load', { message: error })}</p>
          <p>{t('home:error.retry')}</p>
        </div>
      )}

      {!loading && !error && data?.items?.length === 0 && (
        <div className="empty-state">
          <p>{t('home:empty')}</p>
        </div>
      )}

      {!loading && !error && data?.items?.length > 0 && (
        <>
          <div className="weapon-grid">
            {data.items.map((weapon) => (
              <WeaponCard key={weapon.id} weapon={weapon} />
            ))}
          </div>

          <nav className="pagination" aria-label={t('home:paginationLabel')}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {t('common:actions.previous')}
            </button>
            <span className="pagination__info">
              {page} / {data.pages}
            </span>
            <button
              type="button"
              disabled={page >= data.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t('common:actions.next')}
            </button>
          </nav>
        </>
      )}

      <HomeEditorial />
    </>
  );
}
