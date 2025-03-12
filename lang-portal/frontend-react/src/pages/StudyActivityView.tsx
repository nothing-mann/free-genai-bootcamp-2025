import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useStudyActivity, useStudyActivitySessions } from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay, 
  Pagination,
  EmptyState 
} from '@/components/common';

const StudyActivityView = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [sessionsPage, setSessionsPage] = useState(1);
  const pageSize = 10;

  // Fetch activity details
  const { 
    data: activityData, 
    isLoading: activityLoading, 
    isError: activityIsError,
    error: activityError,
    refetch: activityRefetch
  } = useStudyActivity(id);

  // Fetch activity sessions
  const { 
    data: sessionsData, 
    isLoading: sessionsLoading, 
    isError: sessionsIsError,
    error: sessionsError,
    refetch: sessionsRefetch
  } = useStudyActivitySessions(id, sessionsPage, pageSize);

  if (activityLoading || sessionsLoading) {
    return <LoadingSpinner />;
  }

  if (activityIsError) {
    return (
      <ErrorDisplay 
        error={activityError instanceof Error ? activityError : new Error("Failed to load activity details")} 
        resetError={activityRefetch}
      />
    );
  }

  // Extract data from the API response
  const activity = activityData?.data;

  if (!activity) {
    return (
      <ErrorDisplay 
        error={new Error("Activity not found")}
      />
    );
  }

  // Setup the page header with back button
  const headerActions = (
    <div className="flex gap-2">
      <Link to="/study-activities" className="btn btn-ghost btn-sm">
        ← {t('common.buttons.back')}
      </Link>
      <Link to={`/study-activities/${activity.id}/launch`} className="btn btn-primary btn-sm">
        {t('studyActivities.launch')}
      </Link>
    </div>
  );

  return (
    <div>
      <PageHeader 
        title={activity.name} 
        actions={headerActions} 
      />
      
      {/* Activity Details Card */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 aspect-video bg-base-200 rounded-lg overflow-hidden">
            <img 
              src={`/assets/thumbnails/${activity.thumbnail}`} 
              alt={activity.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/thumbnails/default.jpg';
              }}
            />
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{t('studyActivities.details')}</h2>
              <p className="text-base-content/80 mt-2">{activity.description}</p>
            </div>
            
            <div>
              <div className="text-sm opacity-70 mb-1">Instructions</div>
              <p>{activity.instructions}</p>
            </div>
            
            <div className="mt-4">
              <Link 
                to={`/study-activities/${activity.id}/launch`} 
                className="btn btn-primary"
              >
                {t('studyActivities.launchNow')}
              </Link>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Past Sessions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('studyActivities.pastSessions')}</h2>
        
        {/* Display error if sessions loading failed */}
        {sessionsIsError && (
          <ErrorDisplay 
            error={sessionsError instanceof Error ? sessionsError : new Error("Failed to load past sessions")} 
            resetError={sessionsRefetch}
          />
        )}
        
        {/* Display message if no sessions */}
        {!sessionsIsError && (!sessionsData?.study_sessions || sessionsData.study_sessions.length === 0) && (
          <EmptyState 
            title="No study sessions"
            message="You haven't completed any sessions for this activity yet."
          />
        )}
        
        {/* Display sessions if available */}
        {!sessionsIsError && sessionsData?.study_sessions && sessionsData.study_sessions.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Group</th>
                    <th>Duration</th>
                    <th>Items</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsData.study_sessions.map((session) => {
                    const startDate = dayjs(session.started_at);
                    const endDate = dayjs(session.ended_at);
                    const duration = endDate.diff(startDate, 'minute');
                    const score = session.number_of_review_items > 0 
                      ? Math.round((session.number_of_correct_review_items / session.number_of_review_items) * 100) 
                      : 0;
                    
                    return (
                      <tr key={session.id}>
                        <td>{startDate.format('MMM D, YYYY')}</td>
                        <td>{session.group_name}</td>
                        <td>{duration} min</td>
                        <td>{session.number_of_review_items}</td>
                        <td>
                          <div className="flex items-center">
                            <span 
                              className={
                                score >= 80 ? 'text-success' : 
                                score >= 50 ? 'text-warning' : 
                                'text-error'
                              }
                            >
                              {score}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link 
                            to={`/study-sessions/${session.id}`} 
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination for sessions */}
            {sessionsData?.pagination && sessionsData.pagination.total_pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={sessionsData.pagination.page}
                  totalPages={sessionsData.pagination.total_pages}
                  onPageChange={setSessionsPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudyActivityView;
