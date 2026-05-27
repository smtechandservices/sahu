"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Phone } from 'lucide-react';

const chairman = {
  name: "Shri Shailesh Narayan Sah",
  role: "Chairman, Bandhu Patrika Management Committee",
  district: "Patna",
};

const executiveMembers = [
  { name: "Shri Hiralal Sah", district: "Tirhut", mobile: "7765937654" },
  { name: "Shri Ranjit Sah", district: "Bhagalpur", mobile: "9771512170" },
  { name: "Shri Satya Narayan Sahu", district: "Darbhanga", mobile: "9835454139" },
  { name: "Shri Satyanarayan Sah", district: "Saharsa", mobile: "6200701594" },
  { name: "Shri Manoj Kumar", district: "Munger", mobile: "7004414405" },
  { name: "Shri Rajan Prasad Gupta", district: "Saran", mobile: "9123436336" },
  { name: "Shri Rakesh Kumar Sah", district: "Purnia", mobile: "8789484042" },
  { name: "Shri Chhotan Sah", district: "Magadh", mobile: "9006214490" },
  { name: "Shri Vipul Kumar", district: "Patna", mobile: "8210703879" },
  { name: "Shri Mayanand Sah", district: "Madhepura", mobile: "7739726062" },
  { name: "Shri Balram Sahu (Advocate)", district: "Madhubani", mobile: "9931782314" },
  { name: "Shri Vipin Gupta", district: "Kaimur", mobile: "7717731365" },
  { name: "Shri Virendra Prasad Gupta", district: "Rohtas", mobile: "8084878543" },
];

const advisoryMembers = [
  { name: "Dr. Dharmshila Gupta", title: "Rajya Sabha MP", mobile: "9304110287" },
  { name: "Shri Shivanandan Prasad", title: "Former State President, Retired Income Tax Commissioner, New Delhi", mobile: "9818105975" },
  { name: "Dr. C. N. Gupta", title: "Former MLA & Former President, State Assembly", mobile: "9431218881" },
  { name: "Shri Sunil Kumar Pintu", title: "MLA & Former MP", mobile: "9431241051" },
  { name: "Shri Ramnarayan Mandal", title: "MLA", mobile: "9473192725" },
  { name: "Shri Narayan Prasad Sahu", title: "Minister, Disaster Management Department, Bihar", mobile: "9939587607" },
  { name: "Dr. Ramchandra Prasad", title: "MLA, Hayaghat, Darbhanga", mobile: "9801394977" },
  { name: "Shri Lalbabu Prasad Gupta", title: "MLA", mobile: "8002753890" },
  { name: "Shrimati Sunita Devi", title: "MLA", mobile: "6203330862" },
  { name: "Shri Sanjay Kumar Gupta", title: "Former MLA", mobile: "9431813367" },
  { name: "Shri Gunjeshwar Sah", title: "Former MLA", mobile: "9431810418" },
  { name: "Shri Motilal Prasad", title: "Former MLA", mobile: "9472285099" },
  { name: "Shri Lalbabu Prasad", title: "Former Legislative Council Member", mobile: "9431212330" },
  { name: "Shri Ramjeevan Prasad Sah", title: "Former MLA", mobile: "9199180852" },
  { name: "Shri Vidyanand Prasad", title: "Patna", mobile: "9431268094" },
  { name: "Prof. Mahendra Prasad", title: "Muzaffarpur", mobile: "9835875775" },
  { name: "Shri Vijay Shankar Prasad", title: "Khagaria", mobile: "9430483339" },
  { name: "Shrimati Shakuntala Sahu", title: "Wife of Late Ramdev Sahu, Patna", mobile: "9708000901" },
];

const committeeChairpersons = [
  { name: "Shri Ranvijay Sahu", committee: "Building Construction Committee", mobile: "9386153874" },
  { name: "Shri Bimal Kishore Bittu", committee: "Art and Culture Operations Committee", mobile: "9304327556" },
  { name: "Shri Amardeep Kumar alias Pappu", committee: "Meritorious Poor Students & Helpless Upliftment Committee", mobile: "9304770996" },
  { name: "Er. Pramod Kumar", committee: "Yoga and Intellectual Committee", mobile: "9835213555" },
  { name: "Shri Raghunath Sah", committee: "Building Operations Committee", mobile: "9934891806" },
  { name: "Dr. Arvind Sahu", committee: "Hostel Operations Committee", mobile: "9934964745" },
  { name: "Shrimati Preeti Saha", committee: "Matrimonial Relations Committee", mobile: "9334121693" },
  { name: "Shri Suraj Kumar", committee: "Social Security Committee", mobile: "9304379058" },
  { name: "Shri Sunil Kumar", committee: "Disaster Management Cell", mobile: "9304379058" },
  { name: "Shri Mahesh Chandra Diwakar", committee: "Industry Cell", mobile: "9431421075" },
  { name: "Shri Manoj Kumar Gupta", committee: "Municipal Committee", mobile: "9431421075" },
  { name: "Shri Pramod Kumar (Advocate)", committee: "Income Tax & GST Committee", mobile: "9386705543" },
  { name: "Dr. Praveen Sahu", committee: "Health Committee", mobile: "9006633325" },
  { name: "Prof. Ramchandra Sahu", committee: "Acharya Shyam Nandan Shastri Library", mobile: "9431004963" },
  { name: "Shri Mahendra Sahu", committee: "Cultural & Heritage Conservation Committee", mobile: "8789881244" },
  { name: "Dr. Deepak Kumar Gupta", committee: "Technical Education Committee", mobile: "9311299375" },
  { name: "Shri Jiya Lal Prasad Dinkar", committee: "Banking Service Committee", mobile: "9507511667" },
  { name: "Dr. Sanjay Kumar", committee: "Social Dispute Resolution Committee", mobile: "9304121041" },
  { name: "Prof. Avinash Ranjan", committee: "Teacher Service Committee", mobile: "8507585826" },
  { name: "Shri Dhanraj Prasad", committee: "Farmers Committee", mobile: "9430008875" },
  { name: "Shri Kundan Kumar Gupta", committee: "Student Committee", mobile: "9507511667" },
  { name: "Er. Shailendra Prasad Gupta", committee: "Planning and Student Welfare Committee", mobile: "9234776292" },
  { name: "Shri Raju Kumar Gupta", committee: "Interstate Relations Committee", mobile: "9323924118" },
  { name: "Shri Ashok Chandra alias Laat Sahab", committee: "Retail Trade Committee", mobile: "9334078400" },
  { name: "Shri Rameshwar Prasad Sah", committee: "Employee Service Committee", mobile: "9431847989" },
  { name: "Shri Vijay Kumar (Advocate)", committee: "Law and Justice Committee", mobile: "9934844793" },
  { name: "Shri Avadhesh Gupta (Former Mukhiya)", committee: "Panchayati Raj Committee", mobile: "9801689642" },
  { name: "Shri Virendra Kumar Sahu", committee: "Administrative Committee", mobile: "9801518585" },
  { name: "Shri Vishwanath Gupta", committee: "Census Committee", mobile: "9852118267" },
  { name: "Shri Umesh Kumar Gupta", committee: "Commerce and Trade Cell", mobile: "9934887736" },
  { name: "Shri Rajesh Kumar", committee: "Spokesperson & Media In-charge", mobile: "9334208224" },
];

const tabs = [
  { id: 'executive', label: 'Executive Members', count: executiveMembers.length },
  { id: 'advisory', label: 'Advisory Committee', count: advisoryMembers.length },
  { id: 'committees', label: 'Committee Chairpersons', count: committeeChairpersons.length },
];

const ExecutiveCommittee = () => {
  const [activeTab, setActiveTab] = useState('executive');

  return (
    <section id="about-executive" className="section-padding bg-[#FFFBF7]">
      <div className="px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">Governance</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Executive Committee</h2>
          <div className="w-16 h-1 bg-primary mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl">
            The governing body of Bihar Tailik Sahu Sabha, Patna — comprising district representatives, advisors, and committee heads.
          </p>
        </motion.div>

        {/* Chairman Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10 flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">{chairman.role}</p>
            <h3 className="text-xl font-bold text-gray-900">{chairman.name}</h3>
            <p className="text-gray-500 text-sm mt-0.5">{chairman.district}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 flex-wrap mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-yellow-200 text-gray-600 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Executive Members */}
        {activeTab === 'executive' && (
          <motion.div
            key="executive"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {executiveMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white border border-yellow-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm hover:border-yellow-300 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">{member.name.split(' ')[1]?.charAt(0) || member.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm leading-snug">{member.name}</h4>
                  <p className="text-primary text-xs font-semibold mt-0.5">{member.district}</p>
                  <a
                    href={`tel:+91${member.mobile}`}
                    className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 mt-0.5 transition-colors"
                  >
                    <Phone size={10} /> {member.mobile}
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Advisory Committee */}
        {activeTab === 'advisory' && (
          <motion.div
            key="advisory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {advisoryMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white border border-yellow-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm hover:border-yellow-300 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-amber-700 font-bold text-sm">{member.name.split(' ')[1]?.charAt(0) || member.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm leading-snug">{member.name}</h4>
                  <p className="text-gray-500 text-xs mt-0.5 leading-snug">{member.title}</p>
                  <a
                    href={`tel:+91${member.mobile}`}
                    className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Phone size={10} /> {member.mobile}
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Committee Chairpersons */}
        {activeTab === 'committees' && (
          <motion.div
            key="committees"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {committeeChairpersons.map((member, index) => (
              <div
                key={index}
                className="bg-white border border-yellow-200 rounded-xl p-4 hover:shadow-sm hover:border-yellow-300 transition-all"
              >
                <p className="text-primary text-xs font-bold uppercase tracking-wide mb-2 leading-snug">{member.committee}</p>
                <h4 className="font-bold text-gray-900 text-sm leading-snug mb-1">{member.name}</h4>
                <a
                  href={`tel:+91${member.mobile}`}
                  className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <Phone size={10} /> {member.mobile}
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ExecutiveCommittee;
