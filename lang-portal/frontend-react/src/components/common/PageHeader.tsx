import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
  description?: string;
  variant?: 'default' | 'nepal';
}

const PageHeader = ({ title, actions, description, variant = 'default' }: PageHeaderProps) => {
  const { t } = useTranslation();
  
  if (variant === 'nepal') {
    return (
      <div className="mb-8">
        <div className="nepal-header px-6 py-4 mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
        {description && <p className="mt-2 text-base-content/70">{description}</p>}
        <div className="nepal-divider mt-2"></div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nepal-red to-nepal-blue">{title}</h1>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
      {description && <p className="mt-2 text-base-content/70">{description}</p>}
    </div>
  );
};

export default PageHeader;
