# rose.krieg_mart441
 
README for Color Matching Game
Overview
This is a simple Color Matching Game built using HTML, CSS, and JavaScript. The game consists of a 5x2 grid of cards, each hiding a color. The objective is to match all pairs of colors in as few attempts as possible. When all pairs are matched, the game redirects to a summary page displaying the total number of attempts.

How It Works
Setup:

The game uses 5 unique colors (red, blue, green, yellow, purple), duplicated to create 10 cards (5 pairs).

The colors are shuffled randomly at the start of the game.

Gameplay:

Click on a card to reveal its color.

Click on a second card to see if it matches the first.

If the colors match, the cards stay visible.

If the colors don’t match, the cards flip back after a 1-second delay.

Each pair of clicks counts as one attempt.

End Game:

When all pairs are matched, the game redirects to a summary page that displays the total number of attempts.

Reset Game:

The Reset Game button reshuffles the colors and resets the game state, allowing you to play again.

Features
Simple and Intuitive: Easy to understand and play.

Dynamic Shuffling: Colors are shuffled randomly at the start of each game.

Attempt Tracking: The game keeps track of the number of attempts and displays it at the end.

Responsive Design: The game board adapts to different screen sizes.

What I Think About It
This game is a fun and lightweight way to practice memory and matching skills. By using colors instead of images, the game is simple to implement and easy to play. The addition of a summary page adds a sense of accomplishment, and the reset functionality makes it replayable. It’s a great example of how basic web technologies (HTML, CSS, JavaScript) can be used to create an interactive and engaging experience.

How to Run
Download or clone the repository.

Open the index.html file in your browser.

Start playing!

Future Improvements
Add a timer to track how long it takes to complete the game.

Include difficulty levels (e.g., more colors or larger grids).

Add animations for flipping cards.

Save high scores using localStorage.
