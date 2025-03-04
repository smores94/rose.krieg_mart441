

// Step 1: Define the class
class ImageItem {
    constructor(title, imagePath, description, author, year) {
        this.title = title;
        this.imagePath = imagePath;
        this.description = description;
        this.author = author;
        this.year = year;
    }

    displayInfo() {
        return `${this.title} (${this.year}) by ${this.author}: ${this.description}`;
    }
}

// Step 2: Create objects from the class
const images = [
    new ImageItem(
        "Exploring Social Justice", 
        'imgs/exploringsocialjustice.jpg',  // No './'
        "exploring social justice through pbl",
        "Michelle Chanda Singh", 
        2021
    ),
    new ImageItem(
        "World Social Justice Day: If Only…", 
        'imgs/hartmann.jpg', 
        "Kathleen and Al Hartmann in the field with a woman they treat.",
        "Kathleen Hartmann", 
        2019
    ),
    new ImageItem(
        "The changing climate is a social justice issue", 
        'imgs/scienc.png', 
        "Equity is at the heart of reversing climate change. Our collective challenge is to fundamentally change our behaviors, our habits, and our lifestyle to reduce carbon emissions, end the age of fossil fuels, and sustain a liveable planet for all.",
        "Science Museum of Minnesota", 
        2020
    ),
    new ImageItem(
        "Social justice is historically villainized by newsrooms", 
        'imgs/justice.jpg', 
        "Throughout history, newspapers have villainized social justice movements. There was a time where papers were run by wealthy white men, thus it made sense that the stories in the paper would be against movements supporting women’s suffrage, immigration rights and labor unions. Even today there is a clear bias — both intentional and unintentional — towards social justice.",
        "MYRIAM ALCALA", 
        2021
    ),
    new ImageItem(
        "Protestors", 
        'imgs/wish.jpg', 
        "Protesters",
        "Kayla Velasquez/Unsplash", 
        2017
    )
];

// Step 3: Function to show random image from the array
function showRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];

    // Step 4: Get the elements to display the image and details
    const viewerImage = document.getElementById("viewerImage");
    const imageTitle = document.getElementById("imageTitle");
    const imageDescription = document.getElementById("imageDescription");
    const imageAuthor = document.getElementById("imageAuthor");
    const imageYear = document.getElementById("imageYear");
    const viewerContainer = document.getElementById("viewer-container");

    // Step 5: Update the elements with the selected image's data
    viewerImage.src = selectedImage.image;
    imageTitle.textContent = selectedImage.title;
    imageDescription.textContent = selectedImage.description;
    imageAuthor.textContent = selectedImage.author;
    imageYear.textContent = selectedImage.year;

    // Step 6: Display the container with the image and details
    viewerContainer.style.display = "block";
}

// Step 7: Add event listener to the button
document.getElementById("imageArrayButton").addEventListener("click", showRandomImage);



function startAnimation() {
    const viewfinder = document.getElementById("viewfinder");
    const hand = document.getElementById("hand");
    const textBox = document.querySelector(".text-box");
    const activateButton = document.getElementById("imageArrayButton");
    const viewmasterEyes = document.getElementById("viewmasterEyes");

    
    

    // Show 'viewmaster_eyes' and button after the previous elements disappear
    setTimeout(() => {
        console.log("Displaying viewmaster_eyes and button."); // Debugging
        viewmasterEyes.style.opacity = "1";  // Make viewmaster_eyes visible
        viewmasterEyes.style.display = "block"; // Ensure it's visible
        activateButton.style.display = "block";  // Show the button
        console.log("Button and viewmaster eyes are now visible.");
    }, 1000); // Show after the animations are done

    // When button is clicked, show a random image from the array
    activateButton.addEventListener("click", showRandomImage);
}

// Start animation when page loads
startAnimation();
