import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useStudyActivities } from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay,
  EmptyState 
} from '@/components/common';

const StudyActivities = () => {
  const { t } = useTranslation();
  
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useStudyActivities();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorDisplay 
        error={error instanceof Error ? error : new Error("Unknown error")} 
        resetError={refetch}
      />
    );
  }

  // Extract activities from the API response
  const activities = data?.data?.study_activities || [];
  
  if (activities.length === 0) {
    return (
      <>
        <PageHeader title={t('studyActivities.title')} />
        <EmptyState 
          title="No activities found"
          message="There are no study activities available."
        />
      </>
    );
  }

  return (
    <div>
      <PageHeader title={t('studyActivities.title')} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <div className="mb-4 aspect-video bg-base-200 rounded-lg overflow-hidden">
              <img 
                src={`/assets/thumbnails/${activity.thumbnail}`} 
                alt={activity.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/thumbnails/default.jpg';
                }}
              />
            </div>
            <h3 className="text-lg font-medium">{activity.name}</h3>
            <p className="text-sm text-base-content/70 mb-3 line-clamp-2">{activity.description}</p>
            
            <div className="flex justify-between">
              <Link 
                to={`/study-activities/${activity.id}`} 
                className="btn btn-outline btn-sm"
              >
                {t('studyActivities.view')}
              </Link>
              <Link 
                to={`/study-activities/${activity.id}/launch`} 
                className="btn btn-primary btn-sm"
              >
                {t('studyActivities.launch')}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudyActivities;
