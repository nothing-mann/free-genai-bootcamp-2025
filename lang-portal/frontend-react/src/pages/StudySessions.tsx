import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useStudySessions } from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay, 
  Pagination, 
  EmptyState 
} from '@/components/common';

const StudySessions = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useStudySessions(page, pageSize);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorDisplay 
        error={error instanceof Error ? error : new Error("Failed to load study sessions")} 
        resetError={refetch}
      />
    );
  }

  // Extract sessions from the API response
  const sessions = data?.data?.study_sessions || [];
  const pagination = data?.meta?.pagination;
  
  if (sessions.length === 0) {
    return (
      <>
        <PageHeader title={t('studySessions.title')} />
        <EmptyState 
          title="No study sessions"
          message="You haven't completed any study sessions yet."
        />
      </>
    );
  }

  return (
    <div>
      <PageHeader title={t('studySessions.title')} />
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>{t('studySessions.date')}</th>
              <th>{t('studySessions.activity')}</th>
              <th>{t('studySessions.group')}</th>
              <th>{t('studySessions.duration')}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const startDate = dayjs(session.started_at);
              const endDate = dayjs(session.ended_at);
              const duration = endDate.diff(startDate, 'minute');
              
              return (
                <tr key={session.id}>
                  <td>{startDate.format('MMM D, YYYY')}</td>
                  <td>{session.activity_name}</td>
                  <td>{session.group_name}</td>
                  <td>{duration} min</td>
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
      
      {pagination && pagination.total_pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default StudySessions;
