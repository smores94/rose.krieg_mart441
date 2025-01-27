// Logging my favorite websites
console.log("Favorite Websites:");
console.log("1. https://www.etsy.com/");
console.log("2. https://people.com/");
console.log("3. https://www.reddit.com/");


// Logging my favorite games
console.log("Favorite Games:");
console.log("1. Candyland");
console.log("2. CK3 - AGOT");
console.log("3. Cell to Singularity");

// Logging my favorite artists and their cultural importance
console.log("Favorite Artists:");
console.log("1. Tamara de Lempicka");
console.log("2. Montana's Charlie Russell");
console.log("3. I love art that features the American West - too many to list");

// Prompting the user for a question and logging their response
const question = "What is your favorite pet?";
const answer = prompt(question);
console.log("Anything True Crime, Reading, Embroidery: " + answer);

// Adding click events to each dog section
document.addEventListener("DOMContentLoaded", () => {
    // Select all cards
    const cards = document.querySelectorAll(".card");
    
    // Add click events to cards
    cards.forEach(card => {
        card.addEventListener("click", () => {
            alert("You clicked on a dog card!");
        });
    });

    // Display a message when the user scrolls to the Maltese section
    const malteseSection = document.querySelector("#maltese");
    if (malteseSection) {
        malteseSection.addEventListener("mouseenter", () => {
            console.log("You’re exploring the Maltese section!");
        });
    }
});