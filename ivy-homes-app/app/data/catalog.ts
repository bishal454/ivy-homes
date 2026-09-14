// @ts-nocheck
export const fetchCatalog = async () => {
  const [listingsRes, rentalsRes, projectsRes] = await Promise.all([
    fetch('/data/listings.json'),
    fetch('/data/rentals.json'),
    fetch('/data/projects.json'),
  ]);

  if (!listingsRes.ok || !rentalsRes.ok || !projectsRes.ok) {
    throw new Error('Property data could not be loaded. Please refresh and try again.');
  }

  const [listings, rentals, projects] = await Promise.all([
    listingsRes.json(),
    rentalsRes.json(),
    projectsRes.json(),
  ]);

  return {
    listings: listings.records || [],
    rentals: rentals.records || [],
    projects: projects.records || [],
  };
};
