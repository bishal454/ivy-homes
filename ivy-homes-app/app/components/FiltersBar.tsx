// @ts-nocheck
const pretty = (value = '') =>
  String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function FiltersBar({ filters, localities, onChange }) {
  const update = (key, value) => onChange((current) => ({ ...current, [key]: value }));

  return (
    <section className="filters-bar">
      <select value={filters.locality} onChange={(event) => update('locality', event.target.value)}>
        <option value="">All localities</option>
        {localities.map((locality) => (
          <option key={locality} value={locality}>
            {pretty(locality)}
          </option>
        ))}
      </select>

      <select value={filters.bedroom} onChange={(event) => update('bedroom', event.target.value)}>
        <option value="">Any bedrooms</option>
        {[1, 2, 3, 4, 5].map((bedroom) => (
          <option key={bedroom} value={bedroom}>
            {bedroom} BHK
          </option>
        ))}
      </select>

      <select value={filters.furnishing} onChange={(event) => update('furnishing', event.target.value)}>
        <option value="">Any furnishing</option>
        {['unfurnished', 'semi-furnished', 'fully-furnished'].map((item) => (
          <option key={item} value={item}>
            {pretty(item)}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={filters.minPrice}
        placeholder="Min price"
        onChange={(event) => update('minPrice', event.target.value)}
      />

      <input
        type="number"
        value={filters.maxPrice}
        placeholder="Max price"
        onChange={(event) => update('maxPrice', event.target.value)}
      />
    </section>
  );
}
