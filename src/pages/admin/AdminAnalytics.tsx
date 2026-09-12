import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  Users,
  Footprints,
  Calendar,
  Download,
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const mostSearchedRooms = [
    { name: 'AI Lab (Room 204)', block: 'CSE Block · 2F', searches: 2840, share: '24%' },
    { name: 'Systems & Networks Lab 1', block: 'CSE Block · 2F', searches: 1980, share: '17%' },
    { name: 'Classroom 101', block: 'Main Block · 1F', searches: 1450, share: '12%' },
    { name: 'Central Food Court', block: 'Campus Quad', searches: 1320, share: '11%' },
    { name: 'Central Examination Hall', block: 'Auditorium', searches: 980, share: '8%' },
  ];

  const popularRoutes = [
    { from: 'Main Entrance Gate', to: 'AI Lab (Room 204)', count: 2120, avgTime: '2.1 min' },
    { from: 'North Parking Zone', to: 'Central Library', count: 1640, avgTime: '3.4 min' },
    { from: 'Hostel Complex', to: 'CSE Block Ground Floor', count: 1290, avgTime: '4.2 min' },
    { from: 'Mechanical Workshop', to: 'Canteen', count: 910, avgTime: '1.8 min' },
  ];

  const peakHours = [
    { hour: '8 AM - 9 AM', level: '85%', label: 'Morning Class Rush' },
    { hour: '9 AM - 10 AM', level: '98%', label: 'Peak Lectures' },
    { hour: '11 AM - 12 PM', level: '70%', label: 'Lab Sessions' },
    { hour: '12 PM - 1 PM', level: '92%', label: 'Lunch / Food Court' },
    { hour: '1 PM - 2 PM', level: '65%', label: 'Afternoon Classes' },
    { hour: '4 PM - 5 PM', level: '80%', label: 'Campus Exit' },
  ];

  const userFeedbacks = [
    {
      user: 'Ananya Sharma (Student)',
      rating: 5,
      comment: 'Saved me so much time on my first day finding AI Lab in the CSE wing!',
      date: 'Today, 10:14 AM',
    },
    {
      user: 'Markus Weber (Visiting Lecturer)',
      rating: 5,
      comment: 'The wheelchair step-free route guidance via the East Elevator was flawlessly accurate.',
      date: 'Yesterday, 3:45 PM',
    },
    {
      user: 'Pooja Patel (Campus Visitor)',
      rating: 4,
      comment: 'Very intuitive floor map. Would love to see walking simulation speed customization.',
      date: '2 days ago',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Spatial Analytics & Search Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze visitor transit patterns, peak congestion hours, and frequently visited rooms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting spatial analytics CSV dataset...')}
          className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Top Most Searched Rooms & Popular Routes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Searched (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Most Searched Destinations</span>
            </h2>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3">
            {mostSearchedRooms.map((room, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{room.name}</span>
                    <span className="text-slate-400 ml-2">({room.block})</span>
                  </div>
                  <span className="font-bold text-teal-700">{room.searches} hits</span>
                </div>
                {/* Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: room.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Route Flows (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Footprints className="w-4 h-4 text-teal-600" />
              <span>Most Frequent Walkways</span>
            </h2>
            <span className="text-xs text-slate-400">Corridor Load</span>
          </div>

          <div className="space-y-2.5">
            {popularRoutes.map((route, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{route.from}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-teal-700">{route.to}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Avg walking duration: {route.avgTime}
                  </div>
                </div>
                <div className="text-right shrink-0 font-bold text-slate-800">
                  {route.count} trips
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Navigation Hours Heatmap & User Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Hours (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Peak Navigation Hours</span>
            </h2>
            <span className="text-xs text-slate-400">Time-of-day distribution</span>
          </div>

          <div className="space-y-3">
            {peakHours.map((hour, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{hour.hour}</span>
                  <span className="text-slate-500 font-medium">{hour.label}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-sky-500 h-full rounded-full"
                    style={{ width: hour.level }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Feedback & Rating (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span>User Experience Feedback</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              4.9 / 5.0 Rating
            </span>
          </div>

          <div className="space-y-3">
            {userFeedbacks.map((fb, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{fb.user}</span>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed italic">&ldquo;{fb.comment}&rdquo;</p>
                <div className="text-[10px] text-slate-400">{fb.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
