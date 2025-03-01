// Array of Artwork objects
const artworks = [
    new Artwork(
        "The Starry Night",
        "./Imgs/starry_night.jpg",
        "A famous painting by Vincent van Gogh.",
        "Vincent van Gogh",
        1889
    ),
    new Artwork(
        "Mona Lisa",
        "./Imgs/mona_lisa.jpg",
        "The most famous portrait in the world.",
        "Leonardo da Vinci",
        1503
    ),
    new Artwork(
        "The Scream",
        "./Imgs/the_scream.jpg",
        "An iconic representation of human anxiety.",
        "Edvard Munch",
        1893
    ),
    new Artwork(
        "Girl with a Pearl Earring",
        "./Imgs/pearl_earring.jpg",
        "A captivating portrait by Johannes Vermeer.",
        "Johannes Vermeer",
        1665
    ),
    new Artwork(
        "The Persistence of Memory",
        "./Imgs/persistence_of_memory.jpg",
        "A surrealist masterpiece by Salvador Dalí.",
        "Salvador Dalí",
        1931
    )
];

// Function to display a random artwork
function displayRandomArtwork() {
    const randomIndex = Math.floor(Math.random() * artworks.length);
    const artwork = artworks[randomIndex];

    // Update the DOM with the artwork details
    document.getElementById("artwork-title").textContent = artwork.title;
    document.getElementById("artwork-image").src = artwork.image;
    document.getElementById("artwork-description").textContent = artwork.description;
    document.getElementById("artwork-author").textContent = `By: ${artwork.author}`;
    document.getElementById("artwork-year").textContent = `Year: ${artwork.year}`;
}

// Add event listener to the button
document.getElementById("random-artwork-button").addEventListener("click", displayRandomArtwork);

// Display a random artwork when the page loads
displayRandomArtwork();