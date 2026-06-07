import { useTranslation } from 'react-i18next';
import { RaritySelect } from './RaritySelect';
import '../styles/catalog.css';

export function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  exterior,
  onExteriorChange,
  rarity,
  onRarityChange,
  exteriorOptions,
  rarityOptions,
  sort,
  onSortChange,
}) {
  const { t } = useTranslation('catalog');

  return (
    <div className="filters-bar">
      <div className="search-box">
        <span className="search-box__icon" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          placeholder={t('filters.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t('filters.searchLabel')}
        />
      </div>

      <div className="category-pills" role="tablist" aria-label={t('filters.categoriesLabel')}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`pill ${activeCategory === cat.id ? 'pill--active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.id === 'all' ? t('filters.all') : cat.label}
          </button>
        ))}
      </div>

      <div className="filters-extra">
        <select
          className="sort-select"
          value={exterior}
          onChange={(e) => onExteriorChange(e.target.value)}
          aria-label={t('filters.exteriorLabel')}
        >
          <option value="all">{t('filters.allExteriors')}</option>
          {exteriorOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <RaritySelect
          value={rarity}
          onChange={onRarityChange}
          options={rarityOptions}
          aria-label={t('filters.rarity')}
        />

        <select
          className="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label={t('filters.sortLabel')}
        >
          <option value="name">{t('filters.sortName')}</option>
          <option value="rarity">{t('filters.sortRarity')}</option>
        </select>
      </div>
    </div>
  );
}
