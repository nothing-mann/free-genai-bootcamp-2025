import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useResetHistory, useFullReset } from '@/hooks';
import { 
  Card, 
  PageHeader, 
  ConfirmDialog 
} from '@/components/common';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [resetHistoryConfirmOpen, setResetHistoryConfirmOpen] = useState(false);
  const [fullResetConfirmOpen, setFullResetConfirmOpen] = useState(false);

  const resetHistoryMutation = useResetHistory();
  const fullResetMutation = useFullReset();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleResetHistory = async () => {
    try {
      await resetHistoryMutation.mutateAsync();
      setResetHistoryConfirmOpen(false);
    } catch (error) {
      console.error('Error resetting history:', error);
    }
  };

  const handleFullReset = async () => {
    try {
      await fullResetMutation.mutateAsync();
      setFullResetConfirmOpen(false);
    } catch (error) {
      console.error('Error performing full reset:', error);
    }
  };

  return (
    <div>
      <PageHeader title={t('settings.title')} />
      
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.theme')}</h2>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <span className="label-text">{t('settings.theme')}: {theme === 'light' ? 'Light' : 'Dark'}</span>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={theme === 'dark'} 
              onChange={toggleTheme}
            />
          </label>
        </div>
      </Card>
      
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.language')}</h2>
        <div className="form-control">
          <div className="flex gap-4">
            <button
              className={`btn ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleLanguageChange('en')}
            >
              English
            </button>
            <button
              className={`btn ${i18n.language === 'np' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleLanguageChange('np')}
            >
              नेपाली
            </button>
          </div>
        </div>
      </Card>
      
      <Card className="mb-6 bg-base-200">
        <h2 className="text-xl font-semibold mb-4">Reset Options</h2>
        <div className="space-y-6">
          <div>
            <button 
              onClick={() => setResetHistoryConfirmOpen(true)} 
              className="btn btn-warning"
              disabled={resetHistoryMutation.isPending}
            >
              {resetHistoryMutation.isPending ? (
                <><span className="loading loading-spinner loading-xs"></span> Resetting...</>
              ) : (
                t('settings.resetHistory')
              )}
            </button>
            <p className="mt-2 text-sm">{t('settings.resetHistoryDescription')}</p>
          </div>
          
          <div>
            <button 
              onClick={() => setFullResetConfirmOpen(true)} 
              className="btn btn-error"
              disabled={fullResetMutation.isPending}
            >
              {fullResetMutation.isPending ? (
                <><span className="loading loading-spinner loading-xs"></span> Resetting...</>
              ) : (
                t('settings.fullReset')
              )}
            </button>
            <p className="mt-2 text-sm">{t('settings.fullResetDescription')}</p>
          </div>
        </div>
      </Card>
      
      {/* Reset History Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetHistoryConfirmOpen}
        onClose={() => setResetHistoryConfirmOpen(false)}
        onConfirm={handleResetHistory}
        title="Confirm Reset History"
        message={t('settings.confirmReset')}
        confirmText={t('settings.resetHistory')}
        confirmVariant="warning"
      />
      
      {/* Full Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={fullResetConfirmOpen}
        onClose={() => setFullResetConfirmOpen(false)}
        onConfirm={handleFullReset}
        title="Confirm Full Reset"
        message={t('settings.confirmReset')}
        confirmText={t('settings.fullReset')}
        confirmVariant="error"
      />
    </div>
  );
};

export default Settings;
