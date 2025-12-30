import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/analysis') {
      return location.pathname.startsWith('/analysis');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-ios-grouped-background flex justify-center font-sans text-ios-text-primary selection:bg-ios-blue/30">
      <div className="w-full max-w-[480px] bg-ios-grouped-background min-h-screen shadow-2xl flex flex-col relative overflow-hidden">

        {/* Main Content Area - with padding for bottom tab bar */}
        <main className="flex-1 pb-[83px] pt-4 overflow-y-auto no-scrollbar">
            {children}
        </main>

        {/* iOS Tab Bar */}
        <nav className="fixed bottom-0 z-50 w-full max-w-[480px] bg-white/80 backdrop-blur-md border-t border-[var(--background-border)] pb-5 pt-2">
          <div className="flex justify-around items-end h-[49px]">
            <Link
              to="/"
              className={`flex flex-col items-center justify-center w-full h-full gap-1 active:opacity-50 transition-opacity ${isActive('/') ? 'text-[var(--primary-500)]' : 'text-[var(--text-disabled)]'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
              <span className="text-[14px] font-normal">홈</span>
            </Link>

            <Link
              to="/analysis"
              className={`flex flex-col items-center justify-center w-full h-full gap-1 active:opacity-50 transition-opacity ${isActive('/analysis') ? 'text-[var(--primary-500)]' : 'text-[var(--text-disabled)]'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
              </svg>
              <span className="text-[14px] font-normal">분석</span>
            </Link>

            <Link
              to="/history"
              className={`flex flex-col items-center justify-center w-full h-full gap-1 active:opacity-50 transition-opacity ${isActive('/history') ? 'text-[var(--primary-500)]' : 'text-[var(--text-disabled)]'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 13a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
              </svg>
              <span className="text-[14px] font-normal">이력</span>
            </Link>

            <Link
              to="/recruitment"
              className={`flex flex-col items-center justify-center w-full h-full gap-1 active:opacity-50 transition-opacity ${isActive('/recruitment') ? 'text-[var(--primary-500)]' : 'text-[var(--text-disabled)]'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
              </svg>
              <span className="text-[14px] font-normal">구인관리</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
