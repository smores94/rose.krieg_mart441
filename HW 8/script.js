$(document).ready(function () {
    // Arrays for images, text, and shapes
    const images = [
      "./img/image1.jpg",
      "./img/image2.jpg",
      "./img/image3.jpg",
      "./img/image4.jpg",
      "./img/image5.jpg",
      "./img/image6.jpg",
      "./img/image7.jpg",
      "./img/image8.jpg"
    ];
    const texts = [
      "Let them eat cake",
      "Just need to suffer a little.",
      "Let them eat cake",
      "Some of the things that I say will be incorrect",
      "Make America Great Again.",
      "I believe you have to be willing to be misunderstood if you’re going to innovate.",
      "Is it better to live in a world where everyone is happy all the time, even if that happiness is artificial? Do you wish for world peace and happiness all the time? Are you sure?"
    ];
    const shapes = ["circle", "square", "triangle"];
  
    let currentImageIndex = 0;
    let currentTextIndex = 0;
    let currentShapeIndex = 0;
  
    // Function to fade in and out images
    function fadeImages() {
      $("#image-container").fadeOut(15000, function () {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        $(this).html(`<img src="${images[currentImageIndex]}" alt="Image">`).fadeIn(8000);
      });
    }
  
    // Function to change text
    function changeText() {
        $("#text-container").fadeOut(1000, function () { // Fade out over 1 second
          currentTextIndex = (currentTextIndex + 1) % texts.length;
          $(this).text(texts[currentTextIndex]).fadeIn(10000, function () {
            // Wait 10 seconds before starting the next fade-out
            setTimeout(changeText, 10000);
          });
        });
      }
      
      // Start the text cycle
      changeText();
  
    // Function to move shapes
    function moveShapes() {
      const shapeTypes = {
        circle: { borderRadius: "50%" },
        square: { borderRadius: "0" },
        triangle: { borderRadius: "0", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }
      };
  
      const shape = $("<div>").addClass("shape").css({
        top: Math.random() * 80 + "%",
        left: Math.random() * 80 + "%",
        backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        ...shapeTypes[shapes[currentShapeIndex]]
      });
  
      $("#shape-container").html(shape);
      currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
  
      shape.animate(
        { top: Math.random() * 80 + "%", left: Math.random() * 80 + "%" },
        2000,
        "linear",
        moveShapes
      );
    }
  
    // Initialize animations
    setInterval(fadeImages, 5000); // Change images every 5 seconds
    setInterval(changeText, 10000); // Change text every 10 seconds
    moveShapes(); // Start moving shapes
  });