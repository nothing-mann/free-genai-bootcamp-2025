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
  
  // Disable answer buttons initially
  btnCorrect.disabled = true;
  btnWrong.disabled = true;
  
  // Fetch words for this group
  async function fetchWords() {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/words?per_page=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      
      const data = await response.json();
      if (!data.success || !data.data.words || data.data.words.length === 0) {
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
      
      // Shuffle the words to randomize the order
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
    submitResults();
  }
  
  // Submit results to the API
  async function submitResults() {
    try {
      // Post each result individually
      const postPromises = results.map(result => 
        fetch(`${API_BASE_URL}/study-sessions/${sessionId}/words/${result.wordId}/review`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_correct: result.isCorrect })
        })
      );
      
      await Promise.all(postPromises);
      
      // End the session
      await fetch(`${API_BASE_URL}/study-sessions/${sessionId}/end`, {
        method: 'POST'
      });
      
      console.log('All results submitted successfully!');
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('Failed to submit some results. Your progress might not be fully saved.');
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
