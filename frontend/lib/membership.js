// Membership tiers on the Join page; the backend accepts exactly these amounts
// (MembershipApplication.FEE_CHOICES). Names are [English, Hindi].
export const MEMBERSHIP_TIERS = [
  { amount: 1000, name: ['Aajeevan', 'आजीवन'] },
  { amount: 2500, name: ['Varishth Aajeevan', 'वरिष्ठ आजीवन'] },
  { amount: 5000, name: ['Sanrakshak', 'संरक्षक'] },
  { amount: 10000, name: ['Varishth Sanrakshak', 'वरिष्ठ संरक्षक'] },
  { amount: 25000, name: ['Ati Varishth Sanrakshak', 'अति वरिष्ठ संरक्षक'] },
];

export const membershipTier = (amount) => MEMBERSHIP_TIERS.find((tier) => tier.amount === Number(amount));
