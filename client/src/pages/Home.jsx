import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBlfLBUJ6VC3y_rMlwcWgBuFvlJ-GXR8o2qd34Vm9o5ouqSDyB9ppO1dkQ9lD8DmxJjSajET1orLBJa2m_W1RsIwZAkM-5lS6faFinAtZ794yROAFDypt7EVOLgxIYPBuSUseAHPlOCh7QzZR2cuQCs9dX7sEFI1B7bBKtTcFzB17q4xkfi1dX1fjzuYHJUX4ANojWl3UjOSgHdRAMXy_fqK6TbMMwDa_LfLC6kFMW4IHTtYrwL6Vs-';

const CTA_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAk-_dMAMnVnE4gG9lkUuiEyPNxjIZwRzGpGI8s-Ob7DKv-i91zVB8NV1kQVZHDPDToKT0XCUcqYVjZP6YSOnWNSu4WK9WOmXl9pzXmM_d_09mdrpOXLilKHO6V_G-sMlTfungl8_XV9kAyMTg9Y_AjxAaucaXIg51q3gsE9PW4-oXuXgGUVyDOzd4O4RT1W0PhhD53UmlVsmMVPTyfAPullHHGvHBetq3UTDEUTumUkHrtCIeBxFyc';

const fillIcon = { fontVariationSettings: "'FILL' 1" };

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set('city', city.trim());
    if (propertyType) params.set('type', propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container selection:text-on-secondary-container min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-24 flex-grow">
        <section className="relative min-h-[700px] flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 hero-gradient z-10" />
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
            />
          </div>
          <div className="relative z-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg w-full">
            <div className="max-w-2xl">
              <h1 className="text-secondary-fixed font-headline-lg-mobile md:font-display-lg md:text-display-lg mb-6 leading-tight">
                Find Your Perfect Space
              </h1>
              <p className="text-on-tertiary/80 font-body-lg text-body-lg mb-10 max-w-lg">
                Thousands of properties for rent and sale across the globe. Experience the luxury of
                choice with our curated selection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link
                  to="/properties"
                  className="bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:brightness-95 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  Browse Properties
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-primary text-primary font-label-md text-label-md uppercase px-8 py-4 rounded-xl hover:bg-primary hover:text-on-primary active:scale-95 flex items-center justify-center"
                >
                  List Your Property
                </Link>
              </div>
            </div>
            <form
              onSubmit={handleSearch}
              className="w-full max-w-4xl bg-surface-container-lowest p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-2 border border-outline-variant/50"
            >
              <div className="flex-1 flex items-center px-4 py-3 border-r border-outline-variant/30 gap-3 group">
                <span className="material-symbols-outlined text-outline">location_on</span>
                <div className="flex-1">
                  <label className="block font-label-md text-[10px] text-outline uppercase tracking-wider mb-0.5">
                    City
                  </label>
                  <input
                    className="w-full border-none p-0 focus:ring-0 text-body-md placeholder:text-on-surface-variant/40 bg-transparent"
                    placeholder="Where are you looking?"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center px-4 py-3 border-r border-outline-variant/30 gap-3">
                <span className="material-symbols-outlined text-outline">home_work</span>
                <div className="flex-1">
                  <label className="block font-label-md text-[10px] text-outline uppercase tracking-wider mb-0.5">
                    Property Type
                  </label>
                  <select
                    className="w-full border-none p-0 focus:ring-0 text-body-md bg-transparent appearance-none cursor-pointer"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Apartment">Apartments</option>
                    <option value="House">Villas</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary-container text-on-tertiary px-10 py-4 rounded-xl font-label-md text-label-md font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">search</span>
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="py-stack-lg bg-background overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <span className="text-secondary font-label-md text-label-md uppercase tracking-[0.2em] mb-4 block">
                The Advantage
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary">Why PropSpace?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {[
                { icon: 'verified', title: 'Verified Listings', text: 'Every property listed on our platform undergoes a rigorous 10-point verification process to ensure accuracy and trust.' },
                { icon: 'update', title: 'Real-Time Updates', text: 'Never miss out on your dream home. Get instant notifications when properties matching your criteria hit the market.' },
                { icon: 'security', title: 'Secure Transactions', text: 'Our proprietary escrow and documentation system ensures every transaction is legally sound and financially protected.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-low p-10 rounded-xl border border-outline-variant/40 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-secondary-container/30 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-on-secondary-container text-3xl" style={fillIcon}>
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-4">{item.title}</h3>
                  <p className="text-on-surface-variant text-body-md leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-stack-lg">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="bg-primary-container rounded-xl overflow-hidden relative min-h-[400px] flex items-center">
              <div
                className="absolute right-0 top-0 w-1/2 h-full opacity-30 hidden md:block bg-cover bg-center"
                style={{ backgroundImage: `url('${CTA_IMAGE}')` }}
              />
              <div className="relative z-10 p-12 md:p-20 max-w-2xl">
                <h2 className="text-on-tertiary font-headline-lg text-headline-lg mb-6">
                  Market Insights in Your Inbox
                </h2>
                <p className="text-on-tertiary/70 text-body-lg mb-10">
                  Join 50,000+ investors and homeowners getting monthly deep dives into real estate trends.
                </p>
                <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                  <input
                    className="flex-1 bg-on-tertiary/10 border border-on-tertiary/20 rounded-xl px-6 py-4 text-on-tertiary focus:ring-2 focus:ring-secondary-fixed outline-none transition-all placeholder:text-on-tertiary/30"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <button
                    type="submit"
                    className="bg-secondary-fixed text-on-secondary-fixed px-8 py-4 rounded-xl font-label-md text-label-md font-bold whitespace-nowrap hover:bg-secondary-fixed-dim transition-all"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
