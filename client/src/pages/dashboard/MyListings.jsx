import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

function formatPrice(price) {
  return `${price.toLocaleString()} XAF/month`;
}

export default function MyListings() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listingsRes, profileRes] = await Promise.all([
        axiosInstance.get('/api/properties/mine'),
        axiosInstance.get('/api/users/me'),
      ]);
      setProperties(listingsRes.data);
      setUserProfile(profileRes.data);
    } catch (err) {
      setProperties([]);
      setError(err.response?.data?.message || 'Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/properties/${deleteTarget._id}`);
      setProperties((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing. Please try again.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container min-h-screen flex flex-col bg-surface-container-low">
      <Navbar />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} userProfile={userProfile} />

      <main className="md:ml-64 pt-24 pb-stack-lg flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
              My Listings
            </h1>
            <p className="text-on-surface-variant text-body-md">
              Manage and monitor your active property advertisements.
            </p>
          </div>
          <Link
            to="/dashboard/create"
            className="bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:brightness-95 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>
              add
            </span>
            Add New Listing
          </Link>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-error-container text-on-error-container p-4 rounded-xl border border-error/20">
            <span className="material-symbols-outlined">error</span>
            <p className="font-body-md flex-1">{error}</p>
            <button type="button" onClick={() => setError('')} className="material-symbols-outlined">
              close
            </button>
          </div>
        )}

        {loading && (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-on-surface-variant font-body-md">Loading your listings...</p>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-24 h-24 bg-surface-container-high rounded-none border border-outline-variant flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">holiday_village</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">No active listings yet</h2>
            <p className="text-on-surface-variant mb-8 max-w-sm mx-auto font-body-md">
              Start your property journey by listing your first home or commercial space with PropSpace.
            </p>
            <Link
              to="/dashboard/create"
              className="bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:brightness-95 active:scale-95 flex items-center justify-center gap-3 shadow-lg"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>
                add_circle
              </span>
              Create Your First Listing
            </Link>
          </div>
        )}

        {!loading && properties.length > 0 && (
          <div className="space-y-gutter">
            {properties.map((property) => {
              const imageUrl = property.imageUrls?.[0];
              return (
                <div
                  key={property._id}
                  className="listing-card group bg-surface-container-lowest p-4 rounded-none border border-outline-variant shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="md:w-64 h-48 overflow-hidden flex-shrink-0 relative">
                    {imageUrl ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={imageUrl}
                        alt={property.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                        No image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      Active
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                        <h2 className="font-headline-md text-headline-md text-primary mb-1">{property.title}</h2>
                        <span className="text-primary font-bold text-price-display font-price-display">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      <p className="text-on-surface-variant flex items-center gap-1 mb-4 font-body-md">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        {property.city}, {property.country}
                      </p>
                      {property.type && (
                        <div className="flex flex-wrap gap-4 text-on-surface-variant font-label-md">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[20px]">home_work</span>
                            {property.type}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/edit/${property._id}`)}
                        className="flex-1 md:flex-none px-6 py-2 border-2 border-primary-container text-primary-container font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary-container hover:text-white transition-all uppercase tracking-widest"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(property)}
                        className="flex-1 md:flex-none px-6 py-2 border-2 border-error text-error font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-error hover:text-white transition-all uppercase tracking-widest"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer className="md:ml-64 md:w-[calc(100%-16rem)]" />

      <button
        type="button"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-[60] active:scale-90 transition-transform"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
      </button>

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-surface p-8 rounded-none border border-outline shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-error-container text-on-error-container rounded-none flex items-center justify-center mb-6 mx-auto">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="text-headline-md font-headline-md text-primary text-center mb-2">Delete Listing?</h3>
            <p className="text-on-surface-variant text-center mb-8 font-body-md">
              Are you sure you want to remove{' '}
              <span className="font-bold text-primary">{deleteTarget.title}</span>? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="w-full py-4 bg-error text-white font-label-md text-label-md uppercase tracking-widest shadow-md hover:bg-red-800 transition-colors disabled:opacity-70"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Property'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="w-full py-4 bg-surface-container-high text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container-highest transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
