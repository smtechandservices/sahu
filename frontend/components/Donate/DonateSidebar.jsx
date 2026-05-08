import React from 'react';

const honorWall = [
  { name: "Suresh Chandra Sahu", location: "Raipur, Chhattisgarh", amount: "₹51,000", date: "Today" },
  { name: "Meena Gupta", location: "Bhopal, MP", amount: "₹11,000", date: "Yesterday" },
  { name: "Anil Kumar Sahu", location: "Delhi, NCR", amount: "₹25,000", date: "2 days ago" },
  { name: "Pushpa Sahu", location: "Nagpur, MH", amount: "₹5,000", date: "3 days ago" },
];

const DonateSidebar = () => {
  return (
    <aside className="space-y-8">
      {/* Fund Allocation Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Fund Allocation
        </h2>
        <div className="space-y-6">
          <AllocationItem label="Education & Scholarships" percentage={60} color="bg-primary" />
          <AllocationItem label="Hostel Maintenance" percentage={25} color="bg-blue-500" />
          <AllocationItem label="Community Events" percentage={15} color="bg-green-500" />
        </div>
        <p className="text-xs text-gray-400 mt-8 leading-relaxed">
          * Our allocation is audited quarterly by the Sabha board to ensure 100% transparency.
        </p>
      </div>

      {/* Wall of Honor Section */}
      <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Wall of Honor
        </h2>

        <div className="space-y-4 relative z-10">
          {honorWall.map((donor, idx) => (
            <div key={idx} className="flex items-start justify-between py-3 border-b border-white/10 last:border-0 group">
              <div>
                <h3 className="text-sm font-bold group-hover:text-primary transition-colors">{donor.name}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{donor.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-primary">{donor.amount}</p>
                <p className="text-[10px] text-gray-500">{donor.date}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
          View All Contributors
        </button>
      </div>
    </aside>
  );
};

const AllocationItem = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-bold text-gray-900">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

export default DonateSidebar;
