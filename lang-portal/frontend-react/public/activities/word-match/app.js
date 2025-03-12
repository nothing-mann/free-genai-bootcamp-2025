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
  const gameBoard = document.getElementById('game-board');
  const timerDisplay = document.getElementById('timer');
  const pairsMatched = document.getElementById('pairs-matched');
  const totalPairs = document.getElementById('total-pairs');
  const resultsContainer = document.getElementById('results-container');
  const scoreDisplay = document.getElementById('score-display');
  const finalTime = document.getElementById('final-time');
  const finalPairs = document.getElementById('final-pairs');
  const finalTotal = document.getElementById('final-total');
  const btnFinish = document.getElementById('btn-finish');
  const groupNameDisplay = document.getElementById('group-name');
  
  // Game state
  let words = [];
  let cards = [];
  let matched = 0;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let startTime = null;
  let timerInterval = null;
  let secondsElapsed = 0;
  let wordResults = {};
  
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
      
      // Take a maximum of 8 pairs for the game (16 cards)
      words = data.data.words.slice(0, 8);
      totalPairs.textContent = words.length;
      finalTotal.textContent = words.length;
      
      // Initialize word results
      words.forEach(word => {
        wordResults[word.id] = false;
      });
      
      // Start the game
      createCards();
      startTimer();
    } catch (error) {
      console.error('Error fetching words:', error);
      alert('Failed to load words for this activity.');
    }
  }
  
  // Create cards for the game
  function createCards() {
    // Create an array with nepali and english words
    const cardPairs = words.flatMap(word => [
      { id: word.id, text: word.nepali_word, lang: 'nepali', wordId: word.id },
      { id: word.id, text: word.english_word, lang: 'english', wordId: word.id }
    ]);
    
    // Shuffle the cards
    cards = cardPairs.sort(() => Math.random() - 0.5);
    
    // Create the HTML for the cards
    gameBoard.innerHTML = cards.map((card, index) => `
      <div class="card" data-index="${index}" data-word-id="${card.wordId}" data-lang="${card.lang}">
        <div class="card-inner">
          <div class="card-front">
            <span>?</span>
          </div>
          <div class="card-back">
            <span>${card.text}</span>
          </div>
        </div>
      </div>
    `).join('');
    
    // Add event listeners to the cards
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', flipCard);
    });
  }
  
  // Handle card flipping
  function flipCard() {
    if (lockBoard) return;
    
    const clickedCard = this;
    const cardIndex = parseInt(clickedCard.dataset.index);
    
    // Prevent flipping already flipped or matched cards
    if (clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched')) {
      return;
    }
    
    // Flip the card
    clickedCard.classList.add('flipped');
    
    // Handle first and second card selection
    if (firstCard === null) {
      firstCard = clickedCard;
    } else if (secondCard === null && clickedCard !== firstCard) {
      secondCard = clickedCard;
      checkMatch();
    }
  }
  
  // Check if the two flipped cards match
  function checkMatch() {
    lockBoard = true;
    
    const isMatch = firstCard.dataset.wordId === secondCard.dataset.wordId && 
                   firstCard.dataset.lang !== secondCard.dataset.lang;
    
    if (isMatch) {
      matched++;
      pairsMatched.textContent = matched;
      
      // Mark cards as matched
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      
      // Mark this word as correctly matched
      const wordId = parseInt(firstCard.dataset.wordId);
      wordResults[wordId] = true;
      
      // Reset selection
      resetCards();
      
      // Check if all pairs are matched
      if (matched === words.length) {
        endGame();
      }
    } else {
      // Flip back after a delay
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetCards();
      }, 1000);
    }
  }
  
  // Reset card selection
  function resetCards() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }
  
  // Start the timer
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
      const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
      timerDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }
  
  // End the game
  function endGame() {
    clearInterval(timerInterval);
    
    // Show results
    gameBoard.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    
    // Display final results
    const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
    const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
    finalTime.textContent = `${minutes}:${seconds}`;
    finalPairs.textContent = matched;
    
    // Calculate score based on time and accuracy
    // Simple scoring: 100% if all pairs matched
    const score = Math.round((matched / words.length) * 100);
    scoreDisplay.textContent = `${score}%`;
    
    // Submit results to the main application
    submitResults();
  }
  
  // Submit results to the API
  async function submitResults() {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      // Convert wordResults to array of results
      const results = Object.entries(wordResults).map(([wordId, isCorrect]) => ({
        wordId: parseInt(wordId),
        isCorrect
      }));

      // Submit individual results
      await Promise.all(results.map(result => 
        fetch(`${API_BASE_URL}/study-sessions/${sessionId}/words/${result.wordId}/review`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ is_correct: result.isCorrect })
        })
      ));

      // End the session
      await fetch(`${API_BASE_URL}/study-sessions/${sessionId}/end`, {
        method: 'POST',
        headers
      });

      // Close the window after a short delay to allow the parent window to update
      setTimeout(() => {
        window.close();
      }, 1000);
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('Failed to submit some results. Please try again.');
    }
  }
  
  // Event listener for finish button
  btnFinish.addEventListener('click', () => {
    window.close();
  });
  
  // Start the game
  fetchWords();
});
