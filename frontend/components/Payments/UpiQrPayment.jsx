"use client";

import { useLanguage } from '../../context/LanguageContext';
import { RAZORPAY_IN_TESTING, SABHA_UPI_ID } from '../../lib/razorpay';

// The Sabha's UPI QR, shown beside Razorpay-backed pay buttons; `amount` is optional (e.g. a donation not yet typed in)
export function UpiQrPayment({ amount }) {
  const { t } = useLanguage();
  const rupees = Number(amount) > 0 ? Number(amount).toLocaleString('en-IN') : null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/upi-qr.png"
        alt={t('UPI QR code for payment', 'भुगतान के लिए UPI QR कोड')}
        className="w-40 h-40 shrink-0 bg-white rounded-xl border border-gray-200 p-2"
      />
      <div className="text-center sm:text-left space-y-2">
        <p className="font-bold text-gray-900">
          {rupees
            ? t(`Scan to pay ₹${rupees} with any UPI app`, `किसी भी UPI ऐप से ₹${rupees} भुगतान के लिए स्कैन करें`)
            : t('Scan to pay with any UPI app', 'किसी भी UPI ऐप से भुगतान के लिए स्कैन करें')}
        </p>
        <p className="text-sm text-gray-500">
          {t('Google Pay, PhonePe, Paytm, BHIM and others', 'Google Pay, PhonePe, Paytm, BHIM आदि')}
        </p>
        <p className="text-xs text-gray-500">
          {t('UPI ID', 'UPI आईडी')}: <span className="font-mono font-semibold text-gray-700 select-all">{SABHA_UPI_ID}</span>
        </p>
        <p className="text-xs text-gray-400">{t('The Bihar State Co-operative Bank Ltd', 'द बिहार स्टेट को-ऑपरेटिव बैंक लिमिटेड')}</p>
      </div>
    </div>
  );
}

// Warns that the Razorpay button is a test checkout; hidden once RAZORPAY_IN_TESTING is false
export function RazorpayTestNotice() {
  const { t } = useLanguage();
  if (!RAZORPAY_IN_TESTING) return null;

  return (
    <p className="text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      {t(
        'Razorpay online payment is in testing. The button below opens a test checkout and no real money is charged.',
        'Razorpay ऑनलाइन भुगतान अभी परीक्षण में है। नीचे दिया गया बटन टेस्ट चेकआउट खोलता है, इसमें कोई वास्तविक राशि नहीं कटती।'
      )}
    </p>
  );
}
