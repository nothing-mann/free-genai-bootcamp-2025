import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useStudyActivity, useGroups, useLaunchStudyActivity } from '@/hooks';
import { generateActivityUrl } from '@/utils/activityUtils';
import { 
  PageHeader, 
  Card, 
  LoadingSpinner, 
  ErrorDisplay, 
  EmptyState,
  Pagination 
} from '@/components/common';

const StudyActivityLaunch = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch activity details
  const { 
    data: activityData, 
    isLoading: activityLoading, 
    isError: activityIsError,
    error: activityError,
    refetch: activityRefetch
  } = useStudyActivity(id);

  // Fetch available word groups
  const { 
    data: groupsData, 
    isLoading: groupsLoading, 
    isError: groupsIsError,
    error: groupsError,
    refetch: groupsRefetch
  } = useGroups(page, pageSize);

  // Launch study session mutation
  const launchMutation = useLaunchStudyActivity();

  if (activityLoading || groupsLoading) {
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

  if (groupsIsError) {
    return (
      <ErrorDisplay 
        error={groupsError instanceof Error ? groupsError : new Error("Failed to load word groups")} 
        resetError={groupsRefetch}
      />
    );
  }

  // Extract data from the API responses
  const activity = activityData?.data;
  const groups = groupsData?.data?.word_groups || [];
  const pagination = groupsData?.meta?.pagination;

  if (!activity) {
    return (
      <ErrorDisplay 
        error={new Error("Activity not found")}
      />
    );
  }

  if (groups.length === 0) {
    return (
      <>
        <PageHeader title={`Launch ${activity.name}`} />
        <EmptyState 
          title="No word groups available"
          message="You need at least one word group to launch this activity."
        />
      </>
    );
  }

  // Handle launching the activity
  const handleLaunch = async () => {
    if (!selectedGroupId) return;
    
    try {
      const result = await launchMutation.mutateAsync({
        activityId: Number(id),
        groupId: selectedGroupId
      });
      
      if (result?.id) {  // Check for id directly
        const sessionId = result.id;
        
        // Generate the activity URL
        const activityUrl = generateActivityUrl(
          activity.name, 
          sessionId,
          selectedGroupId
        );

        // Open in new tab with proper window features
        const activityWindow = window.open(
          activityUrl,
          '_blank',
          'width=800,height=600,scrollbars=yes,status=yes'
        );

        if (!activityWindow) {
          alert('Please allow popups for this site to launch activities');
          return;
        }

        // Navigate to study session page
        navigate(`/study-sessions/${sessionId}`);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error("Failed to launch activity", error);
    }
  };

  // Setup the page header with back button
  const headerActions = (
    <Link 
      to={`/study-activities/${activity.id}`} 
      className="btn btn-ghost btn-sm"
    >
      ← {t('common.buttons.back')}
    </Link>
  );

  return (
    <div>
      <PageHeader 
        title={`Launch ${activity.name}`} 
        actions={headerActions} 
      />
      
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('studyActivities.selectGroup')}</h2>
        <p className="mb-4">Select a word group to study with this activity:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedGroupId === group.id ? 'bg-primary text-primary-content' : 'hover:border-primary'
              }`}
              onClick={() => setSelectedGroupId(group.id)}
            >
              <h3 className="font-medium">{group.name}</h3>
              <p className="text-sm opacity-80 line-clamp-2">{group.description}</p>
              <div className="mt-2 text-sm">
                {group.total_words} words
              </div>
            </div>
          ))}
        </div>

        {pagination && pagination.total_pages > 1 && (
          <div className="mt-4 mb-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={setPage}
            />
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            className="btn btn-primary" 
            disabled={!selectedGroupId || launchMutation.isPending}
            onClick={handleLaunch}
          >
            {launchMutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Launching...
              </>
            ) : (
              t('studyActivities.launchNow')
            )}
          </button>
        </div>
      </Card>
      
      {/* Activity Details Card */}
      <Card>
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
              <h2 className="text-xl font-semibold">{activity.name}</h2>
              <p className="text-base-content/80 mt-2">{activity.description}</p>
            </div>
            
            <div>
              <div className="text-sm opacity-70 mb-1">Instructions</div>
              <p>{activity.instructions}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudyActivityLaunch;
