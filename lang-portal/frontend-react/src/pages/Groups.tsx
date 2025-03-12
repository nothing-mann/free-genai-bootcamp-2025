import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGroups } from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay, 
  EmptyState,
  Pagination 
} from '@/components/common';

const Groups = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGroups(page, pageSize);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorDisplay 
        error={error instanceof Error ? error : new Error("Failed to load word groups")}
        resetError={refetch}
      />
    );
  }

  const groups = data?.data?.word_groups || [];
  const pagination = data?.meta?.pagination;

  if (groups.length === 0) {
    return (
      <>
        <PageHeader title={t('groups.title')} />
        <EmptyState 
          title="No word groups"
          message="There are no word groups available."
        />
      </>
    );
  }

  return (
    <div>
      <PageHeader title={t('groups.title')} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Link key={group.id} to={`/groups/${group.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">{group.name}</h3>
              <p className="text-sm text-base-content/70 mb-3">{group.description}</p>
              <div className="text-sm">
                {group.total_words} {t('words.title').toLowerCase()}
              </div>
            </Card>
          </Link>
        ))}
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

export default Groups;
