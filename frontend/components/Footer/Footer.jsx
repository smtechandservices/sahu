import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t-[12px] border-[#FFFBEB] py-16">
      <div className="px-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Left Side: Branding & Copyright */}
          <div className="flex flex-col items-center lg:items-start gap-2">
            <h3 className="text-2xl font-bold text-slate-800">Sahu Sabha</h3>
            <p className="text-slate-500 text-sm font-medium">
              © {new Date().getFullYear()} Sahu Sabha Digital Heritage. Preserving values, empowering community.
            </p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
              Made by Commhawk
            </p>
          </div>
          
          {/* Right Side: Navigation Links */}
          <nav>
            <ul className="flex flex-wrap justify-center lg:justify-end gap-x-12 gap-y-4">
              <li>
                <Link href="/career" className="text-slate-500 hover:text-yellow-700 font-medium transition-colors">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-yellow-700 font-medium transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-500 hover:text-yellow-700 font-medium transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-slate-500 hover:text-yellow-700 font-medium transition-colors">
                  Advertisement Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
