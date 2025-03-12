import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-9xl font-bold text-primary">404</div>
      <h1 className="text-2xl font-bold mt-8 mb-6">{t('errors.notFound')}</h1>
      <p className="text-center mb-8 max-w-md">
        {t('errors.notFoundMessage')}
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        {t('errors.backToDashboard')}
      </Link>
    </div>
  );
};

export default NotFound;
