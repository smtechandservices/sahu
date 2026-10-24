// Builds and downloads PDF receipts for payments confirmed through Razorpay (donations, membership fees).
// jsPDF's built-in fonts have no ₹ glyph, so amounts are written as "Rs."

import { membershipTier } from './membership';

const ORG = {
  name: 'Bihar Tailik Sahu Sabha',
  address: ['Sahu Bhawan, Langer Toli Chauraha,', 'Bihari Sao Ln, Patna, Bihar 800004'],
  contact: '+91 6122303994  |  info@sahusabha.org',
};

const PURPOSE_LABELS = {
  'General Welfare': 'General Welfare Fund',
  Education: 'Education & Scholarships',
  Hostel: 'Hostel Maintenance',
  Medical: 'Community Medical Aid',
};

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const belowHundred = (n) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]} ${ONES[n % 10]}`.trim());

const belowThousand = (n) => {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${ONES[hundreds]} Hundred` : '', rest ? belowHundred(rest) : ''].filter(Boolean).join(' ');
};

// Indian numbering: crore, lakh, thousand
const numberToWords = (num) => {
  if (num === 0) return 'Zero';
  const parts = [];
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;
  if (crore) parts.push(`${numberToWords(crore)} Crore`);
  if (lakh) parts.push(`${belowHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${belowHundred(thousand)} Thousand`);
  if (rest) parts.push(belowThousand(rest));
  return parts.join(' ');
};

const amountInWords = (amount) => {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  return `Rupees ${numberToWords(rupees)}${paise ? ` and ${belowHundred(paise)} Paise` : ''} Only`;
};

const loadImage = async (src) => {
  const blob = await (await fetch(src)).blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const formatDate = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

async function buildReceipt({ title, number, rows, amount, thankYou }) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  try {
    const logo = await loadImage('/assets/logo-sahu.png');
    doc.addImage(logo, 'PNG', margin - 3, 14, 70, 21);
  } catch {
    doc.setFont('helvetica', 'bold').setFontSize(16).text(ORG.name, margin, 28);
  }
  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(90);
  doc.text([...ORG.address, ORG.contact], pageWidth - margin, 20, { align: 'right', lineHeightFactor: 1.5 });

  doc.setDrawColor(234, 179, 8).setLineWidth(0.8).line(margin, 40, pageWidth - margin, 40);

  doc.setFont('helvetica', 'bold').setFontSize(18).setTextColor(30);
  doc.text(title, pageWidth / 2, 55, { align: 'center' });

  // Receipt details
  let y = 72;
  doc.setFontSize(11);
  [['Receipt No.', number], ...rows].forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal').setTextColor(110).text(label, margin, y);
    doc.setFont('helvetica', 'bold').setTextColor(30).text(String(value), margin + 50, y);
    doc.setDrawColor(235).setLineWidth(0.2).line(margin, y + 4, pageWidth - margin, y + 4);
    y += 11;
  });

  // Amount box
  y += 6;
  doc.setFillColor(254, 249, 195).setDrawColor(234, 179, 8).setLineWidth(0.4);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 3, 3, 'FD');
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(110).text('Amount Received', margin + 6, y + 9);
  doc.setFont('helvetica', 'bold').setFontSize(20).setTextColor(30);
  doc.text(`Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + 6, y + 20);
  doc.setFont('helvetica', 'italic').setFontSize(9).setTextColor(90);
  doc.text(amountInWords(amount), pageWidth - margin - 6, y + 20, { align: 'right', maxWidth: 90 });

  // Footer
  y += 48;
  doc.setFont('helvetica', 'normal').setFontSize(11).setTextColor(50);
  doc.text(thankYou, pageWidth / 2, y, { align: 'center' });
  doc.setFontSize(8).setTextColor(140);
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, y + 8, { align: 'center' });

  doc.save(`${number}.pdf`);
}

export async function downloadDonationReceipt(donation, paymentId) {
  await buildReceipt({
    title: 'DONATION RECEIPT',
    number: `BTSS-DON-${String(donation.id).padStart(6, '0')}`,
    rows: [
      ['Date', formatDate(donation.created_at)],
      ['Donor Name', donation.name],
      ['Phone', `+91 ${donation.phone}`],
      ['Purpose', PURPOSE_LABELS[donation.purpose] || donation.purpose],
      ['Payment Mode', 'Online (Razorpay)'],
      ['Payment ID', paymentId],
      ['Status', 'Paid'],
    ],
    amount: Number(donation.amount),
    thankYou: `Thank you for your generous contribution to ${ORG.name}.`,
  });
}

export async function downloadMatrimonialReceipt(receipt) {
  await buildReceipt({
    title: 'MATRIMONIAL PROFILE RECEIPT',
    number: `BTSS-MAT-${String(receipt.id).padStart(6, '0')}`,
    rows: [
      ['Date', formatDate(receipt.paid_at)],
      ['Name', receipt.name],
      ['Phone', `+91 ${receipt.phone}`],
      ['Gender', receipt.gender],
      ['Age', `${receipt.age} years`],
      ['City', receipt.city || '-'],
      ['Payment For', 'Matrimonial Profile Creation Fee'],
      ['Payment Mode', 'Online (Razorpay)'],
      ['Payment ID', receipt.razorpay_payment_id],
      ['Status', 'Paid'],
    ],
    amount: Number(receipt.amount),
    thankYou: `Your matrimonial profile with ${ORG.name} is now live. Best wishes!`,
  });
}

export async function downloadMembershipReceipt(application) {
  await buildReceipt({
    title: 'MEMBERSHIP RECEIPT',
    number: `BTSS-MEM-${String(application.id).padStart(6, '0')}`,
    rows: [
      ['Date', formatDate(application.paid_at || application.created_at)],
      ['Member Name', application.name],
      ['Phone', `+91 ${application.phone}`],
      ['City', application.city || '-'],
      ['Aadhaar No.', application.aadhaar_masked],
      ['KYC Document', 'Submitted'],
      ['Payment For', `${membershipTier(application.amount)?.name[0] ?? 'Community'} Membership Fee`],
      ['Payment Mode', 'Online (Razorpay)'],
      ['Payment ID', application.razorpay_payment_id],
      ['Status', 'Paid'],
    ],
    amount: Number(application.amount),
    thankYou: `Welcome to ${ORG.name}! Thank you for joining the community.`,
  });
}
