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

export function PropertyDetails({ item, saved, onBack, onToggle }) {
  const title = item.apartment_name || item.title || 'Property';
  const price = item.price || item.price_min || item.price_max || 0;

  return (
    <main className="details-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to listings
      </button>

      <section className="details-card">
        <div className="details-content">
          <div className="eyebrow">{pretty(item.locality || 'featured')} • {pretty(item.property_type || item.project_status || 'property')}</div>
          <h1>{pretty(title)}</h1>
          <p className="details-price">{money(price)}</p>
          <p className="details-description">
            {item.description || 'Updated property listing from the Ivy Homes dataset.'}
          </p>
        </div>

        <aside className="details-side">
          <h2>Property details</h2>
          <ul>
            <li>{item.bedroom || 'Multiple'} bedrooms</li>
            <li>{item.bathroom || '—'} bathrooms</li>
            <li>{item.carpet_area || item.min_area_sqft || item.max_area_sqft || '—'} sq ft</li>
            <li>{item.facing_direction ? pretty(item.facing_direction) : 'Direction not listed'}</li>
          </ul>
          <button type="button" className="primary-btn" onClick={() => onToggle(item)}>
            {saved ? 'Remove from saved homes' : 'Save this home'}
          </button>
        </aside>
      </section>
    </main>
  );
}
