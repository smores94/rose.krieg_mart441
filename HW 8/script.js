$(document).ready(function () {
    // Arrays for images, text, and shapes
    const images = [
      "image1.jpg",
      "image2.jpg",
      "image3.jpg"
    ];
    const texts = [
      "Stay curious.",
      "Dream big.",
      "Keep learning."
    ];
    const shapes = ["circle", "square", "triangle"];
  
    let currentImageIndex = 0;
    let currentTextIndex = 0;
    let currentShapeIndex = 0;
  
    // Function to fade in and out images
    function fadeImages() {
      $("#image-container").fadeOut(1000, function () {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        $(this).html(`<img src="${images[currentImageIndex]}" alt="Image">`).fadeIn(1000);
      });
    }
  
    // Function to change text
    function changeText() {
      $("#text-container").fadeOut(500, function () {
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        $(this).text(texts[currentTextIndex]).fadeIn(500);
      });
    }
  
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
    setInterval(fadeImages, 3000); // Change images every 3 seconds
    setInterval(changeText, 2000); // Change text every 2 seconds
    moveShapes(); // Start moving shapes
  });