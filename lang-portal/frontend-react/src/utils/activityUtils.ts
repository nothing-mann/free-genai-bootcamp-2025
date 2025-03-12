/**
 * Generates the URL for a study activity
 * 
 * @param activityName - The name of the activity
 * @param sessionId - The ID of the study session
 * @param groupId - The ID of the word group
 * @returns The URL to launch the activity
 */
export const generateActivityUrl = (
  activityName: string,
  sessionId: number,
  groupId: number
): string => {
  // Use absolute path from the public directory
  const baseUrl = window.location.origin;
  
  const activityPaths: Record<string, string> = {
    'Flashcards': '/activities/flashcards/index.html',
    'Word Match': '/activities/word-match/index.html',
  };
  
  const activityPath = activityPaths[activityName];
  if (!activityPath) {
    throw new Error(`Unknown activity: ${activityName}`);
  }
  
  // Ensure parameters are properly encoded
  const params = new URLSearchParams({
    sessionId: sessionId.toString(),
    groupId: groupId.toString()
  });
  
  return `${baseUrl}${activityPath}?${params.toString()}`;
};

/**
 * Posts activity results back to the main application
 * 
 * @param sessionId - The ID of the study session
 * @param results - Array of word review results
 * @returns Promise that resolves when all results have been posted
 */
export const postActivityResults = async (
  sessionId: number,
  results: Array<{
    wordId: number,
    isCorrect: boolean
  }>
): Promise<void> => {
  try {
    // Get the auth token if stored in local storage
    const token = localStorage.getItem('token');
    
    // Create post requests for each result
    const requests = results.map(result => 
      fetch(`/api/study-sessions/${sessionId}/words/${result.wordId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ is_correct: result.isCorrect })
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to post result for word ${result.wordId}`);
        }
        return response.json();
      })
    );
    
    // Wait for all requests to complete
    await Promise.all(requests);
    
    // End the session
    await fetch(`/api/study-sessions/${sessionId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to end session');
      }
      return response.json();
    });
    
  } catch (error) {
    console.error('Error posting activity results:', error);
    throw error;
  }
};
