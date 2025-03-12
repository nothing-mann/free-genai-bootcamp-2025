import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };
  
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <span className="font-medium text-lg">
          {i18n.language === 'en' ? 'EN' : 'नेपाली'}
        </span>
      </label>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>
            English
          </button>
        </li>
        <li>
          <button onClick={() => changeLanguage('np')} className={i18n.language === 'np' ? 'active' : ''}>
            नेपाली
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSelector;
