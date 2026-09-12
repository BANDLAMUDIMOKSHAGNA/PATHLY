import React from 'react';
import {
  Search,
  ArrowRight,
  MapPin,
  Map,
  Layers,
  CornerUpRight,
  ShieldCheck,
  Building,
  Building2,
  Compass,
  GraduationCap,
  ShoppingBag,
  HeartPulse,
  Briefcase,
  Plane,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomePage: React.FC = () => {
  const {
    setUserView,
    setIsSearchOpen,
    setSelectedCollege,
    colleges,
    startNavigationToRoom,
    rooms,
  } = useApp();

  const handleStartNavigating = () => {
    // Navigate directly to AI Lab Room 204 demo route
    const aiLab = rooms.find((r) => r.id === 'rm-204');
    if (aiLab) {
      startNavigationToRoom(aiLab);
    } else {
      setUserView('map');
    }
  };

  // Feature Cards matching reference image
  const features = [
    {
      title: 'Indoor Navigation',
      description: 'Get accurate directions inside buildings.',
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      title: 'Interactive Floor Maps',
      description: 'Explore detailed maps with real-time updates.',
      icon: <Map className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Find Rooms & Shops',
      description: 'Locate classrooms, labs, shops and more.',
      icon: <Search className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50',
    },
    {
      title: 'Turn-by-Turn Directions',
      description: 'Follow the best route step by step.',
      icon: <CornerUpRight className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
    },
    {
      title: 'Multi-Floor Navigation',
      description: 'Easily move between floors and blocks.',
      icon: <Layers className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50',
    },
    {
      title: 'Accessible Routes',
      description: 'Find wheelchair-friendly paths and facilities.',
      icon: <ShieldCheck className="w-6 h-6 text-pink-600" />,
      bg: 'bg-pink-50',
    },
  ];

  // 4 Steps matching reference image
  const steps = [
    {
      number: 1,
      title: 'Choose a location',
      description: 'Select a college, mall, hospital or office.',
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
      badgeBg: 'bg-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      number: 2,
      title: 'Select your block and floor',
      description: 'Choose the building section and floor level.',
      icon: <Building className="w-5 h-5 text-blue-600" />,
      badgeBg: 'bg-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      number: 3,
      title: 'Choose your destination',
      description: 'Find the room, shop or facility.',
      icon: <Search className="w-5 h-5 text-purple-600" />,
      badgeBg: 'bg-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      number: 4,
      title: 'Follow the route',
      description: 'Get real-time directions and reach your destination.',
      icon: <CornerUpRight className="w-5 h-5 text-teal-600" />,
      badgeBg: 'bg-teal-600',
      iconBg: 'bg-teal-50',
    },
  ];

  // 6 Spaces matching reference image
  const spaces = [
    {
      id: 'col-1',
      title: 'Colleges & Universities',
      subtitle: 'Classrooms, labs, libraries and more.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      icon: <GraduationCap className="w-4 h-4 text-slate-600" />,
    },
    {
      id: 'col-2',
      title: 'Shopping Malls',
      subtitle: 'Shops, food courts, restrooms and more.',
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80',
      icon: <ShoppingBag className="w-4 h-4 text-slate-600" />,
    },
    {
      id: 'col-3',
      title: 'Hospitals',
      subtitle: 'Departments, rooms, labs and more.',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      icon: <HeartPulse className="w-4 h-4 text-slate-600" />,
    },
    {
      id: 'col-4',
      title: 'Corporate Offices',
      subtitle: 'Meeting rooms, workspaces, facilities and more.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      icon: <Briefcase className="w-4 h-4 text-slate-600" />,
    },
    {
      id: 'col-1',
      title: 'Airports',
      subtitle: 'Terminals, gates, services and more.',
      image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
      icon: <Plane className="w-4 h-4 text-slate-600" />,
    },
    {
      id: 'col-1',
      title: 'Convention Centers',
      subtitle: 'Halls, rooms, exhibits and more.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      icon: <Building2 className="w-4 h-4 text-slate-600" />,
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO SECTION WITH ATRIUM BACKGROUND & PHONE MOCKUP */}
      <section className="relative pt-6 sm:pt-12 pb-10 overflow-hidden">
        {/* Atrium Backdrop with soft fade to white/dark */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80"
            alt="Modern university campus atrium"
            className="w-full h-full object-cover object-center opacity-25 dark:opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-950 via-white/95 dark:via-slate-950/95 to-white/60 dark:to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 dark:via-slate-950/40 to-white dark:to-slate-950" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Green Pill Tag */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <span>Indoor Navigation Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Find Your Way <br />
                Inside, Effortlessly.
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Pathly helps you navigate complex indoor spaces — from college classrooms and labs to mall stores, hospitals and offices.
              </p>

              {/* Prominent Search Bar */}
              <div className="pt-2 max-w-md mx-auto lg:mx-0">
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-between p-1.5 pl-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500 dark:hover:border-teal-400 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 truncate font-normal">
                      Search for a building, room, shop or facility...
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleStartNavigating}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Start Navigating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setUserView('buildings')}
                  className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-sm transition-all cursor-pointer"
                >
                  Explore Buildings
                </button>
              </div>

              {/* Stats Row */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 max-w-md mx-auto lg:mx-0">
                <div className="grid grid-cols-3 gap-4 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900 dark:text-white leading-none">500+</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Buildings</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900 dark:text-white leading-none">1M+</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Navigations</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900 dark:text-white leading-none">99%</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Phone Mockup as shown in reference image */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
                {/* Smartphone Chassis */}
                <div className="relative rounded-[42px] border-[7px] border-slate-900 bg-slate-900 shadow-2xl p-2.5 ring-1 ring-slate-800">
                  {/* Speaker Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-700 rounded-full" />
                  </div>

                  {/* Phone Screen Container */}
                  <div className="rounded-[32px] overflow-hidden bg-white text-slate-800 flex flex-col h-[520px] border border-slate-200 relative">
                    {/* Status Bar */}
                    <div className="px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-800 bg-white">
                      <span>11:04</span>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="text-[10px]">5G</span>
                        <div className="w-4 h-2 border border-slate-600 rounded-[2px] p-[1px] flex">
                          <div className="w-full bg-slate-800 rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* Top Destination Header inside Phone */}
                    <div className="p-3 bg-white border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 fill-teal-600/20" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 leading-tight">
                              AI Lab - Room 204
                            </div>
                            <div className="text-[10px] text-slate-500">
                              CSE Block - 2nd Floor
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold">
                          <Clock className="w-3 h-3 text-teal-600" />
                          <span>2 min · 130 m</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Blueprint Vector Map inside Phone */}
                    <div className="flex-1 bg-slate-50 relative p-3 overflow-hidden flex flex-col justify-center">
                      <svg viewBox="0 0 280 260" className="w-full h-full drop-shadow-xs">
                        {/* Floor Boundary */}
                        <rect
                          x="10"
                          y="10"
                          width="260"
                          height="240"
                          rx="10"
                          fill="#f8fafc"
                          stroke="#cbd5e1"
                          strokeWidth="2"
                        />

                        {/* Rooms Outline */}
                        {/* Top row rooms */}
                        <rect x="25" y="25" width="65" height="55" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="57" y="56" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">Room 201</text>

                        <rect x="105" y="25" width="65" height="55" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="137" y="56" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">Room 202</text>

                        {/* AI Lab Room 204 highlighted */}
                        <rect x="185" y="25" width="75" height="70" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                        <text x="222" y="55" fill="#047857" fontSize="10" fontWeight="bold" textAnchor="middle">AI Lab</text>
                        <text x="222" y="70" fill="#059669" fontSize="9" textAnchor="middle">Room 204</text>

                        {/* Corridor hallways */}
                        <path d="M 25 100 L 255 100" stroke="#e2e8f0" strokeWidth="24" strokeLinecap="round" />
                        <path d="M 175 100 L 175 220" stroke="#e2e8f0" strokeWidth="24" strokeLinecap="round" />

                        {/* Bottom facilities */}
                        <rect x="25" y="145" width="65" height="60" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="57" y="180" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">Room 203</text>

                        <rect x="105" y="145" width="55" height="60" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                        <text x="132" y="180" fill="#64748b" fontSize="9" textAnchor="middle">Restroom</text>

                        {/* Animated Glowing Cyan Navigation Route Line */}
                        <path
                          d="M 57 145 L 57 100 L 222 100 L 222 75"
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-route-dash"
                        />

                        {/* Starting Location Pulse Node */}
                        <circle cx="57" cy="145" r="8" fill="#38bdf8" opacity="0.3" className="animate-ping" />
                        <circle cx="57" cy="145" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />

                        {/* Destination Pin Node */}
                        <circle cx="222" cy="75" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                        <path d="M 222 75 L 222 68" stroke="#ef4444" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Bottom Guidance Prompt in Phone */}
                    <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CornerUpRight className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">
                            Turn Right in 20 m
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Follow corridor towards Lab Wing
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top-Right Floating Badge on Phone */}
                <div className="absolute -top-3 -right-3 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 z-30">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <div className="text-[11px] font-bold leading-tight">
                    <div>CSE Block</div>
                    <div className="text-[10px] text-teal-400 font-normal">2nd Floor →</div>
                  </div>
                </div>
              </div>

              {/* Cursive "Navigate Smarter" with Curved Arrow */}
              <div className="mt-4 flex items-center gap-2 self-center text-teal-600 font-medium">
                <span className="font-serif italic text-base tracking-wide">
                  Navigate Smarter
                </span>
                <svg width="36" height="24" viewBox="0 0 36 24" fill="none" className="text-teal-600">
                  <path
                    d="M2 18 C 12 18, 22 14, 28 6 M 28 6 L 22 6 M 28 6 L 26 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POWERFUL FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            Powerful Features
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything You Need for Seamless Navigation
          </h2>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-200 dark:hover:border-teal-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center mb-4`}>
                  {feat.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW PATHLY WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            How Pathly Works
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Get to Your Destination in 4 Simple Steps
          </h2>
        </div>

        {/* 4 Steps Horizontal Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs relative flex flex-col justify-between"
            >
              <div>
                {/* Step Circle Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-6 h-6 rounded-full ${step.badgeBg} text-white font-bold text-xs flex items-center justify-center`}>
                    {step.number}
                  </div>
                  {idx < 3 && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-slate-300 dark:text-slate-600" />
                  )}
                </div>

                {/* Step Icon */}
                <div className={`w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center mb-3`}>
                  {step.icon}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner Card (Mint box as shown in reference) */}
        <div className="bg-[#e6f4f2] dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              From entrance to exact location.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              Pathly takes you beyond the building — right to your destination inside.
            </p>
          </div>

          {/* Graphic / Character with phone */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
              <MapPin className="w-7 h-7 fill-teal-600/20" />
            </div>
            <button
              type="button"
              onClick={handleStartNavigating}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Try Live Route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BUILT FOR EVERY COMPLEX SPACE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            Built for Every Complex Space
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            One Platform. Endless Possibilities.
          </h2>
        </div>

        {/* 6 Real Photo Cards Grid (3 cols x 2 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space, idx) => (
            <div
              key={idx}
              onClick={() => {
                const found = colleges.find((c) => c.id === space.id);
                if (found) setSelectedCollege(found);
                setUserView('buildings');
              }}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              {/* Photo */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom Details Bar */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {space.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">
                      {space.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {space.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all pl-2">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-emerald-50/90 dark:from-emerald-950/40 via-teal-50/80 dark:via-teal-950/40 to-cyan-50/90 dark:to-cyan-950/40 border border-teal-100/80 dark:border-teal-900/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="space-y-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto md:mx-0">
              <MapPin className="w-5 h-5 fill-teal-700/20" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Lost inside? Pathly knows the way.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              Navigate complex spaces with confidence. Explore. Discover.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setUserView('buildings')}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Isometric Floor Layout Graphic */}
          <div className="w-full max-w-[260px] sm:max-w-[300px] shrink-0">
            <svg viewBox="0 0 240 180" className="w-full h-auto drop-shadow-sm">
              {/* Isometric 3D Floor Blueprint */}
              <path
                d="M 120 15 L 225 70 L 120 135 L 15 75 Z"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              <path
                d="M 15 75 L 120 135 L 120 155 L 15 95 Z"
                fill="#e2e8f0"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              <path
                d="M 120 135 L 225 70 L 225 90 L 120 155 Z"
                fill="#cbd5e1"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Inner Blocks / Rooms */}
              <path d="M 60 65 L 105 40 L 135 55 L 90 80 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 130 90 L 165 72 L 195 88 L 160 106 Z" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />

              {/* Glowing Route Path */}
              <path
                d="M 45 70 L 115 105 L 160 85"
                fill="none"
                stroke="#0284c7"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Start Pulse Beacon */}
              <circle cx="45" cy="70" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />

              {/* Destination 3D Pin */}
              <g transform="translate(160, 65)">
                <path
                  d="M 0 0 C -6 -12 -6 -18 0 -22 C 6 -18 6 -12 0 0 Z"
                  fill="#0d9488"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-15" r="2.5" fill="#ffffff" />
              </g>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};
