// Shared helpers for Razorpay Checkout (donations and membership fees)

export const loadRazorpayCheckout = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

// fetchApi throws { status, data }; pull out the first readable message
export const errorMessage = (err) => {
  if (err instanceof Error) return err.message;
  const data = err?.data;
  if (!data) return null;
  if (data.error) return data.error;
  const first = Object.values(data)[0];
  return Array.isArray(first) ? first[0] : typeof first === 'string' ? first : null;
};
