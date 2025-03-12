import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGroup, useGroupWords, useGroupStudySessions } from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay, 
  Pagination, 
  Badge,
  EmptyState,
  ProgressBar
} from '@/components/common';
import dayjs from 'dayjs';

const GroupShow = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [wordsPage, setWordsPage] = useState(1);
  const [sessionsPage, setSessionsPage] = useState(1);
  const pageSize = 20;

  // Fetch the group details
  const { 
    data: groupData, 
    isLoading: groupLoading, 
    isError: groupIsError,
    error: groupError,
    refetch: groupRefetch
  } = useGroup(id);

  // Fetch the words in this group
  const {
    data: wordsData,
    isLoading: wordsLoading,
    isError: wordsIsError,
    error: wordsError,
    refetch: wordsRefetch
  } = useGroupWords(id, wordsPage, pageSize);

  // Fetch the study sessions for this group
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    isError: sessionsIsError,
    error: sessionsError,
    refetch: sessionsRefetch
  } = useGroupStudySessions(id, sessionsPage, pageSize);

  if (groupLoading || wordsLoading || sessionsLoading) {
    return <LoadingSpinner />;
  }

  if (groupIsError) {
    return (
      <ErrorDisplay 
        error={groupError instanceof Error ? groupError : new Error("Failed to load group details")} 
        resetError={groupRefetch}
      />
    );
  }

  // Extract group data from the API response
  const group = groupData?.data;
  
  if (!group) {
    return (
      <ErrorDisplay 
        error={new Error("Group not found")}
      />
    );
  }

  // Setup the page header with back button
  const headerActions = (
    <Link to="/groups" className="btn btn-ghost btn-sm">
      ← {t('common.buttons.back')}
    </Link>
  );

  return (
    <div>
      <PageHeader 
        title={group.name} 
        actions={headerActions} 
      />
      
      {/* Group Details Card */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('groups.details')}</h2>
        <div className="space-y-4">
          <div>
            <div className="text-sm opacity-70">{t('groups.name')}</div>
            <div>{group.name}</div>
          </div>
          <div>
            <div className="text-sm opacity-70">{t('groups.description')}</div>
            <div>{group.description}</div>
          </div>

          {/* Statistics section */}
          {group.statistics && (
            <div>
              <div className="text-sm opacity-70 mb-2">{t('groups.statistics')}</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="stat-title">Total Reviews</div>
                  <div className="stat-value text-primary">{group.statistics.total_count}</div>
                </div>
                <div>
                  <div className="stat-title">Correct</div>
                  <div className="stat-value text-success">{group.statistics.correct_count}</div>
                </div>
                <div>
                  <div className="stat-title">Wrong</div>
                  <div className="stat-value text-error">{group.statistics.wrong_count}</div>
                </div>
              </div>
              
              {/* Success rate progress bar */}
              {group.statistics.total_count > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>
                      {Math.round((group.statistics.correct_count / group.statistics.total_count) * 100)}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={group.statistics.correct_count} 
                    max={group.statistics.total_count} 
                    color="success" 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Words in Group */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('groups.words')}</h2>
        
        {/* Display error if words loading failed */}
        {wordsIsError && (
          <ErrorDisplay 
            error={wordsError instanceof Error ? wordsError : new Error("Failed to load group words")} 
            resetError={wordsRefetch}
          />
        )}
        
        {/* Display message if no words */}
        {!wordsIsError && wordsData?.data?.words?.length === 0 && (
          <EmptyState 
            title="No words"
            message={t('groups.noWords')}
          />
        )}
        
        {/* Display words if available */}
        {!wordsIsError && wordsData?.data?.words && wordsData.data.words.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wordsData?.data?.words.map((word) => (
                <Link to={`/words/${word.id}`} key={word.id}>
                  <Card className="hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{word.nepali_word}</div>
                        <div className="text-sm opacity-70">{word.english_word}</div>
                        <div className="text-xs opacity-50">{word.romanized_nepali_word}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* Pagination for words */}
            {wordsData?.meta?.pagination?.total_pages && wordsData.meta.pagination.total_pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={wordsData.meta.pagination.page}
                  totalPages={wordsData.meta.pagination.total_pages}
                  onPageChange={setWordsPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Study Sessions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('groups.studySessions')}</h2>
        
        {/* Display error if sessions loading failed */}
        {sessionsIsError && (
          <ErrorDisplay 
            error={sessionsError instanceof Error ? sessionsError : new Error("Failed to load study sessions")} 
            resetError={sessionsRefetch}
          />
        )}
        
        {/* Display message if no sessions */}
        {!sessionsIsError && (!sessionsData?.data?.study_sessions || sessionsData.data.study_sessions.length === 0) && (
          <EmptyState 
            title="No study sessions"
            message={t('groups.noSessions')}
          />
        )}
        
        {/* Display sessions if available */}
        {!sessionsIsError && sessionsData?.data?.study_sessions && sessionsData.data.study_sessions.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Items</th>
                    <th>Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsData.data.study_sessions.map((session) => {
                    const startDate = dayjs(session.started_at);
                    const endDate = dayjs(session.ended_at);
                    const duration = endDate.diff(startDate, 'minute');
                    const score = session.number_of_review_items > 0 
                      ? Math.round((session.number_of_correct_review_items / session.number_of_review_items) * 100) 
                      : 0;
                    
                    return (
                      <tr key={session.id}>
                        <td>{session.activity_name}</td>
                        <td>{startDate.format('MMM D, YYYY')}</td>
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
            {sessionsData?.meta?.pagination?.total_pages && sessionsData.meta.pagination.total_pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={sessionsData.meta.pagination.page}
                  totalPages={sessionsData.meta.pagination.total_pages}
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

export default GroupShow;
