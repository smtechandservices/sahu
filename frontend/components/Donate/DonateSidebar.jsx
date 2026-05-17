import React from 'react';

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
          <AllocationItem label="Education &amp; Scholarships" percentage={60} color="bg-primary" />
          <AllocationItem label="Hostel Maintenance" percentage={25} color="bg-blue-500" />
          <AllocationItem label="Community Events" percentage={15} color="bg-green-500" />
        </div>
        <p className="text-xs text-gray-400 mt-8 leading-relaxed">
          * Our allocation is audited quarterly by the Sabha board to ensure 100% transparency.
        </p>
      </div>

      {/* Impact Stats Section */}
      <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Our Impact
        </h2>

        <div className="space-y-4 relative z-10">
          {[
            { stat: '2,400+', label: 'Students Supported' },
            { stat: '₹1.2 Cr+', label: 'Scholarships Awarded' },
            { stat: '18',      label: 'Community Events Held' },
            { stat: '6',       label: 'Hostels Maintained' },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0"
            >
              <span className="text-sm text-gray-300">{item.label}</span>
              <span className="text-lg font-black text-primary">{item.stat}</span>
            </div>
          ))}
        </div>
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
