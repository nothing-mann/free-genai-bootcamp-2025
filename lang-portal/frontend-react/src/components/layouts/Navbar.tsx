import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSelector from '../common/LanguageSelector';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <div className="navbar bg-base-100 border-b border-base-300">
      <div className="flex-none lg:hidden">
        <label 
          htmlFor="drawer-toggle" 
          aria-label="open sidebar"
          className="btn btn-square btn-ghost drawer-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <span className="lg:hidden text-xl font-bold">{t('app.title')}</span>
      </div>
      <div className="flex-none gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Navbar;
