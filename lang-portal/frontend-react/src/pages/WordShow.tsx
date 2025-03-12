import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWord } from '@/hooks';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay, 
  Badge 
} from '@/components/common';

const WordShow = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useWord(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorDisplay 
        error={error instanceof Error ? error : new Error("Failed to load word details")} 
        resetError={refetch}
      />
    );
  }

  // Extract word data from the API response
  const word = data?.data;
  
  if (!word) {
    return (
      <ErrorDisplay 
        error={new Error("Word not found")}
      />
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

  // Setup the page header with back button
  const headerActions = (
    <Link to="/words" className="btn btn-ghost btn-sm">
      ← {t('common.buttons.back')}
    </Link>
  );

  return (
    <div>
      <PageHeader 
        title={word.nepali_word}
        actions={headerActions} 
      />
      
      {/* Word Details Card */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('words.details')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm opacity-70">{t('words.nepaliWord')}</div>
              <div className="text-xl">{word.nepali_word}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">{t('words.romanizedWord')}</div>
              <div>{word.romanized_nepali_word}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">{t('words.englishWord')}</div>
              <div>{word.english_word}</div>
            </div>
          </div>
          <div>
            <div className="text-sm opacity-70">{t('words.partOfSpeech')}</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {parsePartOfSpeech(word.part_of_speech).map((pos, index) => (
                <Badge key={index}>{pos}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Word Groups Card */}
      {word.word_groups && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('words.groups')}</h2>
          {word.word_groups.length === 0 ? (
            <p>{t('words.noGroups')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {word.word_groups.map((group) => (
                <Link to={`/groups/${group.id}`} key={group.id}>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-sm opacity-70">{group.description}</p>
                    <div className="mt-2 text-xs opacity-70">
                      {group.total_words} words
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default WordShow;
