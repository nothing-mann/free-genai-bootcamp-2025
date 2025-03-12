import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useWords } from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay, 
  Pagination,
  Badge,
  EmptyState 
} from '@/components/common';

const Words = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 20;
  
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useWords(page, pageSize);

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

  // Adapt to the API response structure
  const words = data?.data?.words || [];
  const pagination = data?.meta?.pagination;
  
  if (words.length === 0) {
    return (
      <>
        <PageHeader title={t('words.title')} />
        <EmptyState 
          title="No words found"
          message="There are no words available."
        />
      </>
    );
  }

  // Function to parse JSON part_of_speech string
  const parsePartOfSpeech = (posString: string): string[] => {
    try {
      return JSON.parse(posString);
    } catch (e) {
      return [posString]; // Return as single string if parsing fails
    }
  };

  return (
    <div>
      <PageHeader title={t('words.title')} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {words.map((word) => (
          <Link to={`/words/${word.id}`} key={word.id}>
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{word.nepali_word}</div>
                  <div className="text-sm opacity-70">{word.english_word}</div>
                  <div className="text-xs opacity-50">{word.romanized_nepali_word}</div>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {parsePartOfSpeech(word.part_of_speech).map((pos, index) => (
                    <Badge key={index}>{pos}</Badge>
                  ))}
                </div>
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

export default Words;
