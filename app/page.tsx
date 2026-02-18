import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1A1D1F]">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between h-[80px]">
            {/* Left: Logo & Search */}
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#6C5DD3] rounded-lg flex items-center justify-center transform -rotate-12">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight">Streva</span>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative group overflow-hidden p-[1px] rounded-[16px] shadow-[0px_16px_40px_-10px_rgba(108,93,211,0.35)] hover:shadow-[0px_20px_50px_-8px_rgba(108,93,211,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0.5 bg-gradient-to-br from-[#8E8AFF] via-[#F1F5F9] via-60% to-[#6C5DD3]">
                  <div className="relative bg-white rounded-[15px] pl-4 pr-5 py-2.5 flex items-center gap-2.5 bg-[radial-gradient(circle_at_top_left,rgba(142,138,255,0.15),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(108,93,211,0.15),transparent_50%)] bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6C5DD3]/0 via-[#6C5DD3]/10 to-[#6C5DD3]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer rounded-[15px]"></div>
                    <div className="text-[#1A1D1F]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.8 6.2L18 8L13.8 9.8L12 14L10.2 9.8L6 8L10.2 6.2L12 2Z" fill="#1A1D1F" stroke="#1A1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19 13L20 15.5L22.5 16.5L20 17.5L19 20L18 17.5L15.5 16.5L18 15.5L19 13Z" fill="#1A1D1F" stroke="#1A1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-bold text-sm text-[#1A1D1F] tracking-wide">
                      Ask AI
                    </span>
                  </div>
                </button>

                <div className="relative w-[320px]">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#A4A4A4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-12 pr-10 py-2.5 bg-[#F8FAFC] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all placeholder:text-[#A4A4A4]"
                    placeholder="Search..."
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <div className="w-7 h-7 bg-[#6C5DD3] rounded-full flex items-center justify-center cursor-pointer">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-6">
              <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1A1D1F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF754C] rounded-full border border-white"></span>
              </button>
              <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1A1D1F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </button>

              <div className="h-8 w-[1px] bg-gray-200"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="w-10 h-10 bg-[#FFAB7B] rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                  SR
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-tight">
                    Syed Roni
                  </span>
                  <span className="text-xs text-gray-500">
                    Product Designer
                  </span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1A1D1F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 mt-1">
            {["Home", "My Courses", "Assesment", "Settings"].map(
              (item, idx) => (
                <button
                  key={item}
                  className={`pb-4 text-sm font-medium border-b-2 transition-all ${idx === 0
                    ? "border-[#1A1D1F] text-[#1A1D1F]"
                    : "border-transparent text-gray-500 hover:text-[#1A1D1F]"
                    }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 md:p-8 grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Greeting & Stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1D1F] flex items-center gap-2">
                Good morning, Syed
                <span className="animate-wave origin-bottom-right inline-block">
                  👋🏻
                </span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                Welcome to Streva, Check your priority learning.
              </p>
            </div>
            <div className="flex items-center gap-3 text-white text-xs font-semibold">
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5DD3] to-[#8F85EA] shadow-lg shadow-[#6C5DD3]/20 flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[13px]">100</span>
                  <span className="opacity-80 text-[10px] font-normal">
                    Point
                  </span>
                </div>
              </div>
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFAB7B] to-[#FFCF9D] shadow-lg shadow-[#FFAB7B]/20 flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M12 2l3 7h7l-5 5 2 7-7-4-7 4 2-7-5-5h7z" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[13px]">24</span>
                  <span className="opacity-80 text-[10px] font-normal">
                    Badge
                  </span>
                </div>
              </div>
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9AD5] to-[#FFC2E8] shadow-lg shadow-[#FF9AD5]/20 flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[13px]">08</span>
                  <span className="opacity-80 text-[10px] font-normal">
                    Certificates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-white to-[#F0F2FF] p-6 rounded-[24px] shadow-sm border border-white">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#6C5DD3] to-transparent opacity-10"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-1 bg-[#FF4C4C] text-white text-[10px] font-bold rounded-lg uppercase tracking-wide">
                    New
                  </span>
                  <h3 className="font-bold text-[#1A1D1F]">
                    Feature Discussion
                  </h3>
                </div>
                <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
                  Smart Tutoring are a new feature in &quot;Feature Discussion&quot;
                  Can be explain the material problem chat.{" "}
                  <a
                    href="#"
                    className="text-[#1A1D1F] font-bold inline-flex items-center hover:underline decoration-2 underline-offset-4"
                  >
                    Go to detail{" "}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="ml-1"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* My Courses */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1A1D1F]">My Courses</h2>
              <a
                href="#"
                className="text-sm font-bold text-[#6C5DD3] hover:underline"
              >
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "Instgram Marketing Hacks",
                  subtitle: "Enhancing Learning Engagement through thoughtful UI/UX",
                  color: "from-[#8E8AFF] to-[#B4B1FF]",
                  materials: "10 Materials",
                  tag: "A-Z Guideline",
                  iconColor: "text-[#6C5DD3]",
                  bgColor: "bg-[#6C5DD3]/10",
                },
                {
                  title: "Google Adsense Hacks",
                  subtitle: "Enhancing Learning Engagement through thoughtful UI/UX",
                  color: "from-[#FFAB7B] to-[#FFCF9D]",
                  materials: "5 Materials",
                  tag: "A-Z Guideline",
                  iconColor: "text-[#FFAB7B]",
                  bgColor: "bg-[#FFAB7B]/10",
                },
                {
                  title: "Hit A Backhand Like Pro",
                  subtitle: "Enhancing Learning Engagement through thoughtful UI/UX",
                  color: "from-[#FF9AD5] to-[#FFC2E8]",
                  materials: "12 Materials",
                  tag: "A-Z Guideline",
                  iconColor: "text-[#FF9AD5]",
                  bgColor: "bg-[#FF9AD5]/10",
                },
              ].map((course, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-[24px] shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div
                    className={`h-[100px] rounded-2xl bg-gradient-to-r ${course.color} relative p-4 mb-4`}
                  >
                    <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-medium">
                      {course.materials}
                    </div>
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-medium border border-white/20">
                      {course.tag}
                    </div>
                    <div className="absolute bottom-[-24px] right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={course.iconColor.replace('text-[', '').replace(']', '')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded-lg ${course.bgColor}`}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className={course.iconColor}
                        strokeWidth="2.5"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      Course
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1A1D1F] leading-tight mb-2 min-h-[48px]">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                    {course.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-medium text-gray-500">
                      Prototyping
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-medium text-gray-500">
                      Not Urgent
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400">
                      Not Started
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1A1D1F] flex items-center gap-2">
                In progress learning content
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A4A4A4"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </h2>
              <a
                href="#"
                className="text-sm font-bold text-[#6C5DD3] hover:underline"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Mastering UI/UX Design: A Guide...",
                  materials: "5 Material",
                  completion: 56,
                  deadline: "1 Day",
                  action: "Start",
                  thumbGradient: "from-[#8E8AFF] to-[#B4B1FF]",
                },
                {
                  title: "Mastering UI/UX Design: A Guide...",
                  materials: "5 Material",
                  completion: 64,
                  deadline: "12 Hours",
                  action: "Continue",
                  deadlineColor: "text-red-500",
                  thumbGradient: "from-[#FF9AD5] to-[#FFC2E8]",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-[20px] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group"
                >
                  <div
                    className={`w-[120px] h-[70px] rounded-xl bg-gradient-to-br ${item.thumbGradient} flex items-center justify-center shrink-0`}
                  >
                    <div className="px-2 py-1 bg-white/30 backdrop-blur-sm rounded-lg text-white text-[9px] font-medium leading-tight text-center">
                      <span className="block opacity-60">Course</span>
                      Marketing...
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FF754C"
                          strokeWidth="2.5"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-500">
                          Course
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1A1D1F] text-sm truncate pr-4">
                        {item.title}
                      </h4>
                    </div>

                    <div className="col-span-2">
                      <div className="text-[10px] text-gray-400 mb-1">
                        Content
                      </div>
                      <div className="text-xs font-bold text-[#1A1D1F] flex items-center gap-1.5">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        {item.materials}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-[10px] text-gray-400 mb-1">
                        Completion
                      </div>
                      <div className="text-xs font-bold text-[#1A1D1F] flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full border-2 border-[#4BD37B] border-t-transparent flex items-center justify-center transform -rotate-45"></div>
                        {item.completion}%
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-[10px] text-gray-400 mb-1">
                        Deadline
                      </div>
                      <div className={`text-xs font-bold flex items-center gap-1.5 ${item.deadlineColor || 'text-[#1A1D1F]'}`}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {item.deadline}
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-[10px] text-xs font-bold text-[#1A1D1F] hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
                        {item.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most View Contents */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1A1D1F] flex items-center gap-2">
                Most view contents
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A4A4A4"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </h2>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-3 rounded-[16px] flex items-center justify-between group hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#FFAB7B]/10 flex items-center justify-center text-[#FFAB7B]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                  </div>
                  <span className="text-sm font-bold text-[#1A1D1F]">Mobile & Desktop Screen Pattern</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-medium text-gray-500">Course</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[180px] h-6 bg-[#EFEFEF] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-[80%] bg-[#D5D2FF]"></div>
                    <span className="absolute inset-0 flex items-center justify-end px-2 text-[10px] font-medium text-gray-600">80% (25 hrs)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-[16px] flex items-center justify-between group hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#FF9AD5]/10 flex items-center justify-center text-[#FF9AD5]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  </div>
                  <span className="text-sm font-bold text-[#1A1D1F]">Creating Engaging Learning Journeys: UI/UX Best Practices in LMS Design</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-medium text-gray-500">Page</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[180px] h-6 bg-[#EFEFEF] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-[15%] bg-[#F2F2F2]"></div>
                    <span className="absolute inset-0 flex items-center justify-end px-2 text-[10px] font-medium text-gray-600">15% (15 hrs)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-[16px] flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#1A1D1F] ml-12">Other Task</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[180px] h-6 bg-[#EFEFEF] rounded-full overflow-hidden relative">
                    <span className="absolute inset-0 flex items-center justify-end px-2 text-[10px] font-medium text-gray-600">5% (5 hrs)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* To be reviewed */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1A1D1F] flex items-center gap-2">
                To be reviewed
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A4A4A4"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </h2>
              <button className="text-sm font-bold text-[#1A1D1F] flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors">
                Last 7 Day
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { type: "Quiz", color: "text-[#FFAB7B]", bg: "bg-[#FFAB7B]/10", icon: "message-square" },
                { type: "Quiz", color: "text-[#8E8AFF]", bg: "bg-[#8E8AFF]/10", icon: "compass" },
                { type: "Assignment", color: "text-[#FF4C4C]", bg: "bg-[#FF4C4C]/10", icon: "file-text" },
                { type: "Assignment", color: "text-[#4BD37B]", bg: "bg-[#4BD37B]/10", icon: "bar-chart" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-[20px] shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {item.icon === "message-square" && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
                        {item.icon === "compass" && <circle cx="12" cy="12" r="10" />}
                        {item.icon === "file-text" && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
                        {item.icon === "bar-chart" && <path d="M12 20V10" />}
                        {item.icon === "bar-chart" && <path d="M18 20V4" />}
                        {item.icon === "bar-chart" && <path d="M6 20v-4" />}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1D1F]">Mastering UI/UX Design: A Guide...</h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
                        <span>{item.type}</span>
                        <span className="flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          15 Question
                        </span>
                      </div>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Promo Card */}
          <div className="h-[180px] rounded-[32px] bg-gradient-to-br from-[#8E8AFF] to-[#6C5DD3] relative overflow-hidden flex flex-col items-center justify-center text-center p-6 shadow-xl shadow-[#6C5DD3]/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            {/* Decorative Stars */}
            <div className="absolute top-8 left-8 text-white/40">✦</div>
            <div className="absolute bottom-8 right-8 text-white/40 text-xl">✦</div>
            <div className="absolute top-6 right-12 text-white/20 text-xs">✦</div>

            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>

            <h3 className="text-white font-bold text-lg relative z-10 w-2/3 mx-auto">Streva for Smart Tutoring</h3>
          </div>

          {/* Learning Content Chart */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[#1A1D1F] flex items-center gap-2">
                Learning content
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A4A4A4" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              </h3>
            </div>

            <div className="relative w-[200px] h-[100px] mx-auto mb-8">
              {/* Half Donut Implementation with CSS/SVG */}
              <svg viewBox="0 0 200 110" className="overflow-visible transform -rotate-180">
                {/* Background Arc */}
                {/* Passed: Purple */}
                <path d="M 20 100 A 80 80 0 0 1 60 30" fill="none" stroke="#6C5DD3" strokeWidth="20" strokeLinecap="round" />
                {/* Completed: Teal */}
                <path d="M 68 25 A 80 80 0 0 1 132 25" fill="none" stroke="#4BD37B" strokeWidth="20" strokeLinecap="round" />
                {/* Warning: Red */}
                <path d="M 140 30 A 80 80 0 0 1 180 100" fill="none" stroke="#FF4C4C" strokeWidth="20" strokeLinecap="round" />
                {/* Orange Segment overlay */}
                <path d="M 175 80 A 80 80 0 0 1 180 100" fill="none" stroke="#FFAB7B" strokeWidth="20" strokeLinecap="round" />

              </svg>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                <span className="text-4xl font-bold text-[#1A1D1F] block">120</span>
                <span className="text-xs text-gray-500">Content</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6C5DD3]"></span>
                <span className="text-[11px] font-medium text-gray-600">Passed</span>
                <span className="text-[11px] font-bold text-[#1A1D1F] ml-auto">74%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4BD37B]"></span>
                <span className="text-[11px] font-medium text-gray-600">Progress</span>
                <span className="text-[11px] font-bold text-[#1A1D1F] ml-auto">82%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4C4C]"></span>
                <span className="text-[11px] font-medium text-gray-600">Overdue</span>
                <span className="text-[11px] font-bold text-[#1A1D1F] ml-auto">45%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFAB7B]"></span>
                <span className="text-[11px] font-medium text-gray-600">Failed</span>
                <span className="text-[11px] font-bold text-[#1A1D1F] ml-auto">45%</span>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A1D1F] flex items-center gap-2">
                Goals
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A4A4A4" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              </h3>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F2F2F2" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6C5DD3" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="200" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-[#6C5DD3]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-bold text-[#1A1D1F]">Daily Goal: 6/30 learning</p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-gray-500">Your longest streak: <span className="text-[#1A1D1F]">1 day</span></p>
              <p className="text-[10px] text-gray-400 mt-1">(25 Feb 2025 - 5 May 2025)</p>
              <a href="#" className="text-xs font-bold text-[#6C5DD3] mt-2 inline-block hover:underline">See Detail</a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
