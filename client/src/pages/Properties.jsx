import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';

const PROPERTY_TYPES = ['', 'Studio', 'Apartment', 'House'];

function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm opacity-60">
      <div className="aspect-[3/2] skeleton" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-20 skeleton rounded-lg" />
          <div className="h-8 w-20 skeleton rounded-lg" />
        </div>
        <div className="h-12 w-full skeleton rounded-lg mt-4" />
      </div>
    </div>
  );
}

function sortProperties(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted;
  }
}

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const cityParam = searchParams.get('city') || '';

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    setErrorDismissed(false);

    try {
      const params = {};
      if (cityParam.trim()) params.city = cityParam.trim();
      const { data } = await axiosInstance.get('/api/properties', { params });
      setProperties(data);
    } catch (err) {
      setProperties([]);
      setError(err.response?.data?.message || 'Unable to load properties. Please check your connection or refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [cityParam]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) setTypeFilter(type);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = properties;
    if (typeFilter) {
      list = list.filter((p) => p.type === typeFilter);
    }
    return sortProperties(list, sortBy);
  }, [properties, typeFilter, sortBy]);

  const typeLabels = {
    '': 'All Types',
    Studio: 'Studio',
    Apartment: 'Apartment',
    House: 'House',
  };

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-24 pb-stack-lg flex-grow">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {error && !errorDismissed && (
            <div className="mb-8 flex items-center justify-between bg-error-container text-on-error-container p-4 rounded-xl border border-error/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <p className="font-body-md">{error}</p>
              </div>
              <button
                type="button"
                className="material-symbols-outlined hover:bg-on-error-container/10 p-1 rounded-full transition-colors"
                onClick={() => setErrorDismissed(true)}
              >
                close
              </button>
            </div>
          )}

          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <h1 className="font-headline-lg-mobile md:font-display-lg text-on-background">Explore Properties</h1>
                <p className="text-on-surface-variant font-body-md">
                  {!loading && `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} available`}
                  {loading && 'Loading listings...'}
                </p>
              </div>
              <button
                type="button"
                className="md:hidden flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-xl font-label-md text-label-md hover:bg-primary hover:text-on-primary active:scale-95 transition-transform"
                onClick={() => setMobileFiltersOpen((v) => !v)}
              >
                <span className="material-symbols-outlined">tune</span>
                Filters
              </button>
            </div>

            <div
              className={`flex flex-wrap items-center justify-between gap-4 py-4 border-y border-outline-variant/10 ${
                mobileFiltersOpen ? 'block' : 'hidden md:flex'
              }`}
            >
              <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type || 'all'}
                    type="button"
                    onClick={() => setTypeFilter(type)}
                    className={
                      typeFilter === type
                        ? 'text-label-md font-label-md whitespace-nowrap px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full cursor-pointer'
                        : 'text-label-md font-label-md whitespace-nowrap px-4 py-2 bg-surface-container hover:bg-surface-container-high transition-colors rounded-full cursor-pointer'
                    }
                  >
                    {typeLabels[type]}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 ml-auto mt-4 md:mt-0">
                <label className="font-label-md text-on-surface-variant hidden md:block" htmlFor="sort-by">
                  Sort by:
                </label>
                <select
                  id="sort-by"
                  className="bg-surface-container-low border-none rounded-xl text-label-md py-2 px-4 focus:ring-2 focus:ring-secondary cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-surface-container-high rounded-xl border border-outline-variant flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2">No properties found</h2>
              <p className="text-on-surface-variant mb-8 max-w-sm mx-auto font-body-md">
                Try adjusting your filters or check back later for new listings.
              </p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filtered.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  badge={index === 0 ? 'Featured' : property.type || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
