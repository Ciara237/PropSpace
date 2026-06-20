const PLACEHOLDER_IMAGE = 'https://placehold.co/400x250?text=No+Image';

function getAuthorName(author) {
  if (author && typeof author === 'object' && author.username) {
    return author.username;
  }
  return 'Unknown';
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function PropertyCard({ property, badge }) {
  const authorName = getAuthorName(property.author);

  return (
    <div className="group bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.imageUrls?.[0] || PLACEHOLDER_IMAGE}
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
          alt={property.title}
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md shadow-md">
            {badge}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-headline-md text-headline-md group-hover:text-secondary transition-colors">
            {property.title}
          </h3>
          <div className="text-secondary font-price-display whitespace-nowrap">
            {property.price.toLocaleString()} XAF
          </div>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant mb-4 font-body-md">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          {property.city}, {property.country}
        </div>
        {property.type && (
          <div className="mb-4">
            <span className="text-label-md font-label-md whitespace-nowrap px-4 py-2 bg-surface-container rounded-full">
              {property.type}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-xs">
              {getInitials(authorName)}
            </div>
            <span className="font-label-md text-on-surface">{authorName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
