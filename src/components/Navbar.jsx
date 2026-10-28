import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  // Determine current active page name based on route
  let currentPageName = '';
  if (location.pathname.includes('actual')) {
    currentPageName = 'Planned vs   Actual';
  } else if (location.pathname.includes('planned') || location.pathname === '/') {
    currentPageName = 'Planned';
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Project Name */}
          <div className="flex items-center">
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              Service Project ROI
            </span>
          </div>

          {/* Right: Static Text Only (No border, No link) */}
          {currentPageName && (
            <div className="flex items-center">
              <span className="text-sm font-semibold text-[#0c72af] select-none cursor-default">
                {currentPageName}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
