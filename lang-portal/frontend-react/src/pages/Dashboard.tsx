import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  useDashboardOverview,
  useDashboardStatistics, 
  useStudyProgress,
  useLastStudySession 
} from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay,
  ProgressBar
} from '@/components/common';
import dayjs from 'dayjs';

const Dashboard = () => {
  const { t } = useTranslation();
  
  // Fetch dashboard data
  const { 
    data: overviewData,
    isLoading: overviewLoading,
    isError: overviewIsError,
    error: overviewError,
    refetch: overviewRefetch
  } = useDashboardOverview();

  const { 
    data: statisticsData,
    isLoading: statisticsLoading,
    isError: statisticsIsError,
    error: statisticsError,
    refetch: statisticsRefetch
  } = useDashboardStatistics();

  const { 
    data: progressData,
    isLoading: progressLoading,
    isError: progressIsError,
    error: progressError,
    refetch: progressRefetch
  } = useStudyProgress();

  const { 
    data: lastSessionData,
    isLoading: lastSessionLoading,
    isError: lastSessionIsError,
    error: lastSessionError,
    refetch: lastSessionRefetch
  } = useLastStudySession();

  // Show loading while fetching data
  if (overviewLoading || statisticsLoading || progressLoading || lastSessionLoading) {
    return <LoadingSpinner />;
  }

  // Show errors if any
  if (overviewIsError) {
    return (
      <ErrorDisplay 
        error={overviewError instanceof Error ? overviewError : new Error("Failed to load dashboard overview")} 
        resetError={overviewRefetch}
      />
    );
  }

  if (statisticsIsError) {
    return (
      <ErrorDisplay 
        error={statisticsError instanceof Error ? statisticsError : new Error("Failed to load dashboard statistics")} 
        resetError={statisticsRefetch}
      />
    );
  }

  // Extract data from API responses
  const overview = overviewData?.data;
  const statistics = statisticsData?.data;
  const progress = progressData?.data?.progress;
  const lastSession = lastSessionData?.data;

  return (
    <div>
      <PageHeader title={t('dashboard.title')} />
      
      {/* Statistics Section */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.statistics.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat">
            <div className="stat-title">{t('dashboard.statistics.successRate')}</div>
            <div className="stat-value text-primary">
              {statistics?.average_score ? `${statistics.average_score.toFixed(1)}%` : 'N/A'}
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-title">{t('dashboard.statistics.studySessions')}</div>
            <div className="stat-value text-primary">{statistics?.study_sessions_completed || 0}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">{t('dashboard.statistics.activeGroups')}</div>
            <div className="stat-value text-primary">{overview?.total_groups || 0}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Words Studied</div>
            <div className="stat-value text-primary">{statistics?.words_learned || 0}</div>
          </div>
        </div>
      </Card>
      
      {/* Study Progress Section */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.studyProgress.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm opacity-70 mb-1">{t('dashboard.studyProgress.wordsStudied')}</div>
            <div className="text-2xl font-medium">{progress?.total_words_studied || 0}</div>
          </div>
          
          <div>
            <div className="text-sm opacity-70 mb-1">Activities Started</div>
            <div className="text-2xl font-medium">{progress?.total_activities || 0}</div>
          </div>
          
          <div>
            <div className="text-sm opacity-70 mb-1">Sessions Completed</div>
            <div className="text-2xl font-medium">{progress?.total_sessions || 0}</div>
          </div>
        </div>
        
        {/* Progress bar showing percentage of total words studied */}
        {progress && overview && overview.total_words > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('dashboard.studyProgress.masteryProgress')}</span>
              <span>{Math.round((progress.total_words_studied / overview.total_words) * 100)}%</span>
            </div>
            <ProgressBar 
              value={progress.total_words_studied} 
              max={overview.total_words} 
              color="primary" 
            />
          </div>
        )}
      </Card>
      
      {/* Last Session Section */}
      {lastSession && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.lastSession.title')}</h2>
          
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <div className="opacity-70 text-sm">Date</div>
              <div>{dayjs(lastSession.started_at).format('MMMM D, YYYY')}</div>
              
              <div className="mt-2 opacity-70 text-sm">Duration</div>
              <div>{dayjs(lastSession.ended_at).diff(dayjs(lastSession.started_at), 'minute')} minutes</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="opacity-70 text-sm mb-1">Score</div>
              <div className="radial-progress text-primary" style={{ "--value": lastSession.score } as any}>
                {lastSession.score}%
              </div>
            </div>
            
            <div className="flex flex-col md:items-end mt-4 md:mt-0">
              <Link 
                to={`/study-sessions/${lastSession.id}`}
                className="btn btn-outline btn-primary"
              >
                View Details
              </Link>
            </div>
          </div>
        </Card>
      )}
      
      {/* Call to Action */}
      <div className="flex justify-center mt-8">
        <Link to="/study-activities" className="btn btn-primary btn-lg">
          {t('dashboard.startStudy')}
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
