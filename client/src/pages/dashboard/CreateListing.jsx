import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio'];

const emptyForm = {
  title: '',
  description: '',
  price: '',
  city: '',
  country: '',
  type: '',
  imageUrls: '',
};

export default function CreateListing() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [userProfile, setUserProfile] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/users/me');
      setUserProfile(data);
    } catch {
      /* sidebar falls back to defaults */
    }
  }, []);

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    setPageLoading(true);
    setApiError('');
    try {
      const { data: mine } = await axiosInstance.get('/api/properties/mine');
      const property = mine.find((p) => p._id === id);
      if (!property) {
        setApiError('Listing not found or you do not have permission to edit it.');
        return;
      }
      setForm({
        title: property.title ?? '',
        description: property.description ?? '',
        price: String(property.price ?? ''),
        city: property.city ?? '',
        country: property.country ?? '',
        type: property.type ?? '',
        imageUrls: property.imageUrls?.join(', ') ?? '',
      });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to load listing.');
    } finally {
      setPageLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (isEdit) fetchProperty();
    else setForm(emptyForm);
  }, [isEdit, fetchProperty]);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.country.trim()) next.country = 'Country is required';
    if (!form.price) next.price = 'Price is required';
    else if (Number.isNaN(Number(form.price)) || Number(form.price) < 0) next.price = 'Enter a valid price';
    if (!form.type) next.type = 'Property type is required';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      city: form.city.trim(),
      country: form.country.trim(),
      type: form.type,
      imageUrls: form.imageUrls
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/properties/${id}`, payload);
      } else {
        await axiosInstance.post('/api/properties', payload);
      }
      navigate('/dashboard/listings');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <Navbar />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} userProfile={userProfile} />

      <main className="md:ml-64 pt-24 min-h-screen px-margin-mobile md:px-margin-desktop pb-32 max-w-3xl mx-auto w-full flex-grow">
        <header className="mb-10">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
            {isEdit ? 'Edit Listing' : 'Create Listing'}
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-2xl">
            {isEdit
              ? 'Update your property details below.'
              : 'Add a new property to your portfolio. All fields marked with validation are required.'}
          </p>
        </header>

        {pageLoading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-on-surface-variant">Loading listing...</p>
          </div>
        ) : (
          <section className="luxury-card p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8">
              <span className="material-symbols-outlined text-secondary p-2 bg-secondary-container/20 rounded-lg">
                home_work
              </span>
              <h2 className="font-headline-md text-headline-md text-primary">Property Details</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {apiError && (
                <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/10 font-body-md text-sm">
                  {apiError}
                </div>
              )}

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  className="w-full px-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none"
                  value={form.title}
                  onChange={updateField('title')}
                  placeholder="Furnished Apartment in Bonapriso"
                />
                {errors.title && <p className="text-error font-label-md text-[12px]">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none resize-y"
                  value={form.description}
                  onChange={updateField('description')}
                  placeholder="Describe your property..."
                />
                {errors.description && <p className="text-error font-label-md text-[12px]">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="price">
                    Price (XAF)
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none"
                    value={form.price}
                    onChange={updateField('price')}
                    placeholder="350000"
                  />
                  {errors.price && <p className="text-error font-label-md text-[12px]">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="type">
                    Property Type
                  </label>
                  <select
                    id="type"
                    className="w-full px-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none"
                    value={form.type}
                    onChange={updateField('type')}
                  >
                    <option value="">Select type</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.type && <p className="text-error font-label-md text-[12px]">{errors.type}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    className="w-full px-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none"
                    value={form.city}
                    onChange={updateField('city')}
                    placeholder="Douala"
                  />
                  {errors.city && <p className="text-error font-label-md text-[12px]">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="country">
                    Country
                  </label>
                  <input
                    id="country"
                    className="w-full px-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none"
                    value={form.country}
                    onChange={updateField('country')}
                    placeholder="Cameroon"
                  />
                  {errors.country && <p className="text-error font-label-md text-[12px]">{errors.country}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="imageUrls">
                  Image URLs
                </label>
                <input
                  id="imageUrls"
                  className="w-full px-4 py-3 border border-outline-variant bg-surface-container-low focus:border-secondary focus:ring-1 focus:ring-secondary/20 rounded-xl font-body-md outline-none"
                  value={form.imageUrls}
                  onChange={updateField('imageUrls')}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
                <p className="text-on-surface-variant font-body-md text-[12px]">Comma-separated image URLs</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end">
                <Link
                  to="/dashboard/listings"
                  className="border-2 border-primary text-primary font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:bg-primary hover:text-on-primary active:scale-95 transition-all text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:brightness-95 active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Listing'}
                  <span className="material-symbols-outlined text-[18px]">save</span>
                </button>
              </div>
            </form>
          </section>
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
    </div>
  );
}
