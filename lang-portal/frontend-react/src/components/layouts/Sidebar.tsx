import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { t } = useTranslation();
  
  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: 'dashboard' },
    { path: '/study-activities', label: t('nav.studyActivities'), icon: 'book' },
    { path: '/words', label: t('nav.words'), icon: 'text' },
    { path: '/groups', label: t('nav.groups'), icon: 'folder' },
    { path: '/study-sessions', label: t('nav.studySessions'), icon: 'clock' },
    { path: '/settings', label: t('nav.settings'), icon: 'settings' },
  ];

  return (
    <div className="drawer-side z-20">
      <label htmlFor="drawer-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="menu p-4 w-72 min-h-full bg-base-200 text-base-content bg-nepal-lokta">
        <div className="flex items-center justify-between px-4 py-6 mb-4 border-b border-nepal-red/20">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nepal-red to-nepal-blue">{t('app.title')}</h1>
          <div className="w-10 h-10 flex items-center justify-center">
            <div className="w-8 h-8 temple-container flex items-center justify-center">
              <span className="text-nepal-red">🇳🇵</span>
            </div>
          </div>
        </div>
        
        {/* Prayer flags inspired divider */}
        <div className="prayer-flags mt-2 mb-6">
          <div className="prayer-flag prayer-flag-blue"></div>
          <div className="prayer-flag prayer-flag-white"></div>
          <div className="prayer-flag prayer-flag-red"></div>
          <div className="prayer-flag prayer-flag-green"></div>
          <div className="prayer-flag prayer-flag-yellow"></div>
        </div>
        
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  isActive 
                    ? 'active font-medium bg-nepal-red text-white flex items-center gap-3 px-4 py-2 rounded-md' 
                    : 'font-normal flex items-center gap-3 px-4 py-2 hover:bg-nepal-red/10 rounded-md transition-colors duration-200'
                }
              >
                <IconForNav icon={item.icon} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        
        {/* Removed the language stats progress bar section that was here */}
        
      </div>
    </div>
  );
};

// Keep the existing IconForNav component
const IconForNav = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'dashboard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'book':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'text':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      );
    case 'folder':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    case 'clock':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'settings':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
};

export default Sidebar;
