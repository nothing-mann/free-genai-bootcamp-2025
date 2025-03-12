import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useStudySession, useStudySessionWords, useReviewWord } from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay, 
  Pagination,
  EmptyState 
} from '@/components/common';

const StudySessionShow = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [wordsPage, setWordsPage] = useState(1);
  const pageSize = 20;

  // Fetch session details
  const { 
    data: sessionData, 
    isLoading: sessionLoading, 
    isError: sessionIsError,
    error: sessionError,
    refetch: sessionRefetch
  } = useStudySession(id);

  // Fetch words for this session
  const {
    data: wordsData,
    isLoading: wordsLoading,
    isError: wordsIsError,
    error: wordsError,
    refetch: wordsRefetch
  } = useStudySessionWords(id, wordsPage, pageSize);

  // Review word mutation
  const reviewWordMutation = useReviewWord();

  if (sessionLoading || wordsLoading) {
    return <LoadingSpinner />;
  }

  if (sessionIsError) {
    return (
      <ErrorDisplay 
        error={sessionError instanceof Error ? sessionError : new Error("Failed to load session details")} 
        resetError={sessionRefetch}
      />
    );
  }

  // Extract session data from the API response
  const session = sessionData?.data;
  
  if (!session) {
    return (
      <ErrorDisplay 
        error={new Error("Session not found")}
      />
    );
  }

  // Calculate session stats
  const startDate = dayjs(session.started_at);
  const endDate = dayjs(session.ended_at);
  const duration = endDate.diff(startDate, 'minute');

  // Setup the page header with back button
  const headerActions = (
    <Link to="/study-sessions" className="btn btn-ghost btn-sm">
      ← {t('common.buttons.back')}
    </Link>
  );

  // Handle reviewing a word
  const handleReviewWord = async (wordId: number, isCorrect: boolean) => {
    try {
      await reviewWordMutation.mutateAsync({
        sessionId: Number(id),
        wordId,
        isCorrect
      });
    } catch (error) {
      console.error("Failed to review word", error);
    }
  };

  return (
    <div>
      <PageHeader 
        title={t('studySessions.details')} 
        actions={headerActions} 
      />
      
      {/* Session Details Card */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Session Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm opacity-70">{t('studySessions.activity')}</div>
                <div className="font-medium">{session.activity_name}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">{t('studySessions.group')}</div>
                <Link to={`/groups/${session.group_id}`} className="font-medium text-primary hover:underline">
                  {session.group_name}
                </Link>
              </div>
              <div>
                <div className="text-sm opacity-70">{t('studySessions.date')}</div>
                <div>{startDate.format('MMMM D, YYYY')}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-70">{t('studySessions.startTime')}</div>
                  <div>{startDate.format('h:mm A')}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">{t('studySessions.endTime')}</div>
                  <div>{endDate.format('h:mm A')}</div>
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70">{t('studySessions.duration')}</div>
                <div>{duration} minutes</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Actions</h2>
            <div className="flex flex-col gap-3">
              <Link to={`/study-activities/${session.study_activity_id}`} className="btn btn-outline">
                View Activity Details
              </Link>
              <Link to={`/study-activities/${session.study_activity_id}/launch`} className="btn btn-primary">
                Start New Session
              </Link>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Session Words */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('studySessions.wordReviewItems')}</h2>
        
        {/* Display error if words loading failed */}
        {wordsIsError && (
          <ErrorDisplay 
            error={wordsError instanceof Error ? wordsError : new Error("Failed to load words")} 
            resetError={wordsRefetch}
          />
        )}
        
        {/* Display message if no words */}
        {!wordsIsError && (!wordsData?.data?.words || wordsData.data.words.length === 0) && (
          <EmptyState 
            title="No words"
            message="No words were reviewed in this session."
          />
        )}
        
        {/* Display words if available */}
        {!wordsIsError && wordsData?.data?.words && wordsData.data.words.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wordsData.data.words.map((word) => (
                <Card key={word.id} className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{word.nepali_word}</div>
                      <div className="text-sm opacity-70">{word.english_word}</div>
                      <div className="text-xs opacity-50">{word.romanized_nepali_word}</div>
                    </div>
                    <Link 
                      to={`/words/${word.id}`} 
                      className="btn btn-ghost btn-xs"
                    >
                      View
                    </Link>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => handleReviewWord(word.id, true)}
                      className="btn btn-sm btn-success"
                      disabled={reviewWordMutation.isPending}
                    >
                      Mark Correct
                    </button>
                    <button 
                      onClick={() => handleReviewWord(word.id, false)}
                      className="btn btn-sm btn-error"
                      disabled={reviewWordMutation.isPending}
                    >
                      Mark Incorrect
                    </button>
                  </div>
                </Card>
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
    </div>
  );
};

export default StudySessionShow;
