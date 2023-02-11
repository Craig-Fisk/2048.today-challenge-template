describe('The ultimate 2048.today solution', () => {
  // Before we run our 'Test' add event listener for onGameStart to ensure API is ready
  beforeEach(() => {
    cy.visit('https://2048.today', {
      onBeforeLoad (win) {
        cy.window().invoke('addEventListener', 'onGameStart', cy.stub().as('gameReady'))
      }
    })
  })

  it('should complete the puzzle', () => {
    // Ensure the API is available on the window
    cy.window().its('TFET').should('exist');
    // Ensure the onGameStart event has fired
    cy.get('@gameReady').should('have.been.calledOnce');

    // Run the algorithm
    cy.window().then((win) => {
      // Randomly pick a direction to swipe
        const pickNext = () => {
          const min = 0;
          const max = 3;
          // get random number between 0 - 3
          const rand = Math.floor(Math.random() * (max - min + 1) + min); 
          switch(rand) {
            case 0:
              win.TFET.swipeLeft();
              break;
            case 1:
              win.TFET.swipeRight();
              break;
            case 2:
              win.TFET.swipeDown();
              break;
            case 3:
              win.TFET.swipeUp();
              break;
          }
        }

        const checkAndWait = () => {
           // Check if we have won or lost
          if(win.TFET.gameLost === false && win.TFET.gameWon === false) {
             // Wait a small amount of time so we don't overload the JS Engine
            cy.wait(100).then(() => {
              pickNext();
            });
          }
        }

        // Listen for swipe events to finish before checking and swiping again
        win.addEventListener('onSwipeLeft', () => {
          checkAndWait()
        });
        win.addEventListener('onSwipeRight', () => {
          checkAndWait()
        });
        win.addEventListener('onSwipeUp', () => {
          checkAndWait()
        });
        win.addEventListener('onSwipeDown', () => {
          checkAndWait()
        });

        // Kick off the algorithm
        pickNext();
      })
    
  })
})