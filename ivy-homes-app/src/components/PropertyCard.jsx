const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const pretty = (value = '') =>
  String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function PropertyCard({ item, kind, saved, onSelect, onToggle }) {
  const title = item.apartment_name || item.title || 'Property';
  const location = item.locality || 'Featured';
  const price = item.price || item.price_min || item.price_max || 0;
  const area = item.carpet_area || item.min_area_sqft || item.max_area_sqft || '—';

  const label =
    kind === 'rentals' ? 'Rent' : kind === 'projects' ? 'Project' : item.bedroom ? `${item.bedroom} BHK` : 'Home';

  return (
    <article className="property-card">
      <div className="property-card__top">
        <span>{label}</span>
        <button type="button" className="favorite-btn" onClick={() => onToggle(item)}>
          {saved ? '♥' : '♡'}
        </button>
      </div>

      <button type="button" className="property-card__body" onClick={() => onSelect(item)}>
        <h3>{pretty(title)}</h3>
        <p>
          {pretty(location)} • {area} sq ft
        </p>
        <strong>{kind === 'rentals' ? `${money(price)} / month` : money(price)}</strong>
        <small>{pretty(item.furnishing || item.project_status || item.property_type || '')}</small>
      </button>
    </article>
  );
}
