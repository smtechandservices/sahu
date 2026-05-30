import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/news', label: 'News' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/magazine', label: 'Magazine' },
  { href: '/career', label: 'Opportunities' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/donate', label: 'Donate' },
];

const aboutLinks = [
  { href: '/about', label: 'Sabha Overview' },
  { href: '/about#about-leadership', label: 'Leadership Team' },
  { href: '/about#about-executive', label: 'Executive Committee' },
  { href: '/about#about-stats', label: 'Our Impact' },
  { href: '/about#constitution', label: 'Constitution' },
  { href: '/matrimonial', label: 'Matrimonial' },
];

const legalLinks = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/policy', label: 'Advertisement Policy' },
];

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#1a120b] text-gray-300">
      {/* Top accent bar matching header */}
      <div className="h-1.5 w-full bg-[#f5b301]" />

      {/* Main footer content */}
      <div className="px-6 lg:px-8 py-14 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Branding */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logo-sahu.png"
                alt="Sahu Sabha Logo"
                width={160}
                height={80}
                style={{ height: 'auto' }}
                className="-ms-2 opacity-90"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-loose max-w-xs">
              बिहार तैलिक साहू सभा पटना के बकरगंज इलाके में स्थित एक प्रमुख सामुदायिक सभा है, जो मुख्य रूप से शादी-ब्याह, सम्मेलनों और अन्य समारोहों के लिए आयोजित की जाती है।
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://www.facebook.com/bihartailiksahusabha/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#f5b301] hover:text-[#1a120b] text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <FacebookIcon />
              </a>
              {/* <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#f5b301] hover:text-[#1a120b] text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#f5b301] hover:text-[#1a120b] text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <InstagramIcon />
              </a> */}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wider border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#f5b301] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#f5b301] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About Sabha */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wider border-b border-white/10 pb-2">
              About Sabha
            </h4>
            <ul className="flex flex-col gap-2.5">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#f5b301] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#f5b301] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wider border-b border-white/10 pb-2">
              Get In Touch
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="tel:+916122303994"
                  className="flex items-start gap-2.5 text-sm text-gray-400 hover:text-[#f5b301] transition-colors group"
                >
                  <span className="text-[#f5b301] mt-0.5"><PhoneIcon /></span>
                  <span>+91 6122303994</span>
                </a>
              </li>
              {/* <li>
                <a
                  href="mailto:info@sahusabha.org"
                  className="flex items-start gap-2.5 text-sm text-gray-400 hover:text-[#f5b301] transition-colors group"
                >
                  <span className="text-[#f5b301] mt-0.5"><MailIcon /></span>
                  <span>info@sahusabha.org</span>
                </a>
              </li> */}
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-[#f5b301] mt-0.5"><LocationIcon /></span>
                <span>J585+HCG, Sahu bhawan, Langer toli chauraha, Bihari Sao Ln, Patna, Bihar 800004, India</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-[#f5b301] mt-0.5">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>
                  Mon – Sun &nbsp;·&nbsp; 8:00 AM – 8:00 PM
                </span>
              </li>
            </ul>

            {/* CTA */}
            <Link
              href="/join"
              className="mt-2 inline-block text-center bg-[#f5b301] text-[#1a120b] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="px-6 lg:px-8 py-5 mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} {' '} Bihar Tailik Sahu Sabha. &nbsp;&nbsp; All rights reserved. &nbsp;&nbsp; Made with care by &nbsp;
            <a href="https://commhawk.in/" target="_blank">
              <span className="text-[#f5b301] font-semibold">Commhawk</span>
            </a>
          </p>
          <nav>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-[#f5b301] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
