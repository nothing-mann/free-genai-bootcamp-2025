import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
  description?: string;
}

const PageHeader = ({ title, actions, description }: PageHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">{title}</h1>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
      {description && <p className="mt-2 text-base-content/70">{description}</p>}
    </div>
  );
};

export default PageHeader;
