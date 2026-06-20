import { Link } from 'react-router-dom';

const fillIcon = { fontVariationSettings: "'FILL' 1" };

export default function Footer({ className = '' }) {
  return (
    <footer className={`bg-tertiary-container text-on-tertiary w-full py-20 ${className}`}>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="flex flex-col gap-4">
          <div className="font-headline-md text-headline-md font-bold text-on-tertiary flex items-center gap-2">
            <span className="material-symbols-outlined text-on-tertiary" style={fillIcon}>
              location_city
            </span>
            PropSpace
          </div>
          <p className="text-on-tertiary/60 font-body-md">
            Connecting you to premium real estate in Douala, Yaoundé, Limbe and across Cameroon.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-secondary-container">Navigation</h4>
          <div className="flex flex-col gap-2">
            <Link
              to="/properties"
              className="text-on-tertiary/60 hover:text-secondary-container transition-colors font-body-md"
            >
              Browse Properties
            </Link>
            <Link
              to="/dashboard"
              className="text-on-tertiary/60 hover:text-secondary-container transition-colors font-body-md"
            >
              List Your Home
            </Link>
            <span className="text-on-tertiary/60 font-body-md">Market Insights</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-secondary-container">Legal</h4>
          <div className="flex flex-col gap-2">
            <span className="text-on-tertiary/60 font-body-md">Privacy Policy</span>
            <span className="text-on-tertiary/60 font-body-md">Terms of Service</span>
            <span className="text-on-tertiary/60 font-body-md">Cookie Settings</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-secondary-container">Newsletter</h4>
          <p className="text-on-tertiary/60 font-body-md">
            Subscribe for the latest listings and market trends.
          </p>
          <div className="flex gap-2">
            <input
              className="bg-on-tertiary/5 border border-on-tertiary/10 rounded-xl px-4 py-3 text-sm w-full focus:ring-1 focus:ring-secondary-container/20 focus:border-secondary-container outline-none font-body-md placeholder:text-on-tertiary/40"
              placeholder="Your email"
              type="email"
            />
            <button
              type="button"
              className="bg-secondary-container text-on-secondary-container px-4 py-3 rounded-xl font-label-md uppercase hover:brightness-95 active:scale-95"
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-20 pt-8 border-t border-on-tertiary/10 text-on-tertiary/40 font-body-md text-center">
        © 2026 PropSpace Cameroon. All rights reserved.
      </div>
    </footer>
  );
}
