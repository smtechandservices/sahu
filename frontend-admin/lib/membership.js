// Membership tier names by fee; keep in sync with frontend/lib/membership.js
const TIER_NAMES = {
  1000: 'Aajeevan',
  2500: 'Varishth Aajeevan',
  5000: 'Sanrakshak',
  10000: 'Varishth Sanrakshak',
  25000: 'Ati Varishth Sanrakshak',
};

export const membershipTierName = (amount) => TIER_NAMES[Number(amount)] || null;
