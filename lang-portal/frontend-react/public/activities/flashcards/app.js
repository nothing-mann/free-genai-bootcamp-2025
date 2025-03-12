document.addEventListener('DOMContentLoaded', () => {
  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('sessionId');
  const groupId = params.get('groupId');
  
  // Check if we have the necessary parameters
  if (!sessionId || !groupId) {
    alert('Missing required parameters. Cannot start activity.');
    return;
  }
  
  // Get the API base URL from the parent window if possible, or use a default
  const API_BASE_URL = window.location.origin + '/api';
  
  // DOM elements
  const flashcard = document.getElementById('flashcard');
  const flashcardFront = document.getElementById('flashcard-front');
  const flashcardBack = document.getElementById('flashcard-back');
  const btnFlip = document.getElementById('btn-flip');
  const btnCorrect = document.getElementById('btn-correct');
  const btnWrong = document.getElementById('btn-wrong');
  const btnFinish = document.getElementById('btn-finish');
  const currentCount = document.getElementById('current-count');
  const totalCount = document.getElementById('total-count');
  const progressBar = document.querySelector('.progress');
  const resultsContainer = document.getElementById('results-container');
  const scoreDisplay = document.getElementById('score-display');
  const correctCount = document.getElementById('correct-count');
  const incorrectCount = document.getElementById('incorrect-count');
  const groupNameDisplay = document.getElementById('group-name');
  
  // Activity state
  let words = [];
  let currentWordIndex = 0;
  let isFlipped = false;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let results = [];
  const startTime = Date.now(); // Track start time
  let endTime; // Track end time
  
  // Disable answer buttons initially
  btnCorrect.disabled = true;
  btnWrong.disabled = true;
  
  // Fetch words for this group
  async function fetchWords() {
    try {
      // Get words directly from group endpoint
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/words?per_page=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      
      const data = await response.json();
      if (!data.success || !data.data?.words || data.data.words.length === 0) {
        throw new Error('No words found in this group');
      }
      
      // Get the group name
      const groupResponse = await fetch(`${API_BASE_URL}/groups/${groupId}`);
      if (groupResponse.ok) {
        const groupData = await groupResponse.json();
        if (groupData.success && groupData.data.name) {
          groupNameDisplay.textContent = groupData.data.name;
        }
      }
      
      // Use the words from the group data
      words = data.data.words.sort(() => Math.random() - 0.5);
      totalCount.textContent = words.length;
      
      // Start the activity
      showNextWord();
    } catch (error) {
      console.error('Error fetching words:', error);
      alert('Failed to load words for this activity.');
    }
  }
  
  // Display the next word
  function showNextWord() {
    if (currentWordIndex >= words.length) {
      showResults();
      return;
    }
    
    // Update the progress
    currentCount.textContent = currentWordIndex + 1;
    progressBar.style.width = `${((currentWordIndex + 1) / words.length) * 100}%`;
    
    // Reset the card state
    isFlipped = false;
    flashcard.classList.remove('flashcard-flip');
    flashcardFront.classList.remove('hidden');
    flashcardBack.classList.add('hidden');
    
    // Disable answer buttons until card is flipped
    btnCorrect.disabled = true;
    btnWrong.disabled = true;
    
    // Set the word content
    const word = words[currentWordIndex];
    flashcardFront.textContent = word.nepali_word;
    flashcardBack.textContent = `${word.english_word} (${word.romanized_nepali_word})`;
  }
  
  // Flip the flashcard
  function flipCard() {
    isFlipped = !isFlipped;
    
    if (isFlipped) {
      flashcardFront.classList.add('hidden');
      flashcardBack.classList.remove('hidden');
      flashcard.classList.add('flashcard-flip');
      // Enable answer buttons after flip
      btnCorrect.disabled = false;
      btnWrong.disabled = false;
    } else {
      flashcardFront.classList.remove('hidden');
      flashcardBack.classList.add('hidden');
      flashcard.classList.remove('flashcard-flip');
    }
  }
  
  // Handle correct answer
  function markCorrect() {
    const currentWord = words[currentWordIndex];
    correctAnswers++;
    results.push({
      wordId: currentWord.id,
      isCorrect: true
    });
    currentWordIndex++;
    showNextWord();
  }
  
  // Handle wrong answer
  function markWrong() {
    const currentWord = words[currentWordIndex];
    incorrectAnswers++;
    results.push({
      wordId: currentWord.id,
      isCorrect: false
    });
    currentWordIndex++;
    showNextWord();
  }
  
  // Show results at the end of the activity
  function showResults() {
    endTime = Date.now(); // Record end time when activity completes
    const durationSeconds = Math.floor((endTime - startTime) / 1000);
    
    // Hide the flashcard
    flashcard.classList.add('hidden');
    btnFlip.classList.add('hidden');
    btnCorrect.classList.add('hidden');
    btnWrong.classList.add('hidden');
    
    // Show results
    resultsContainer.classList.remove('hidden');
    
    // Calculate and display score
    const score = Math.round((correctAnswers / words.length) * 100);
    scoreDisplay.textContent = `${score}%`;
    correctCount.textContent = correctAnswers;
    incorrectCount.textContent = incorrectAnswers;
    
    // Submit results to the main application
    submitResults(durationSeconds);
  }
  
  // Submit results to the API
  async function submitResults(durationSeconds) {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      // Submit individual word reviews first
      await Promise.all(results.map(result => 
        fetch(`${API_BASE_URL}/study-sessions/${sessionId}/words/${result.wordId}/review`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ is_correct: result.isCorrect })
        })
      ));

      // End the session with stats including duration
      await fetch(`${API_BASE_URL}/study-sessions/${sessionId}/end`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          correct_count: correctAnswers,
          total_count: words.length,
          duration_seconds: durationSeconds
        })
      });

      // Close window after delay
      setTimeout(() => window.close(), 1000);
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('Failed to submit results. Please try again.');
    }
  }
  
  // Event listeners
  btnFlip.addEventListener('click', flipCard);
  btnCorrect.addEventListener('click', markCorrect);
  btnWrong.addEventListener('click', markWrong);
  btnFinish.addEventListener('click', () => {
    // Close the window or redirect back to the main app
    window.close();
  });
  
  // Also allow clicking on the card to flip it
  flashcard.addEventListener('click', () => {
    // Only flip if buttons are visible (not in results view)
    if (!btnFlip.classList.contains('hidden')) {
      flipCard();
    }
  });
  
  // Start the activity
  fetchWords();
});
