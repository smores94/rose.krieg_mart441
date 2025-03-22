$(document).ready(function () {
  // Fetch JSON data using jQuery AJAX
  $.getJSON("data.json", function (data) {
    let output = "";

    // Iterate over the data and create gallery items
    $.each(data, function (index, event) {
      output += `<a href="#">`;
      output += `<img src="${event.illustration || 'placeholder.jpg'}" alt="Event Illustration">`; // Use a placeholder if no image is available
      output += `<div class="event-details">`;
      output += `<h2>${event.description}</h2>`;
      output += `<p><strong>Year:</strong> ${event.year}</p>`;
      output += `<p><strong>Involved Agents:</strong> ${event.RelatedPeopleorEvents.join(", ")}</p>`;
      output += `</div>`;
      output += `</a>`;
    });

    // Insert the generated HTML into the gallery container
    $(".gallery").html(output);

    // Initialize the flipping gallery plugin
    $(".gallery").flipping_gallery({
      direction: "forward", // Flipping direction
      selector: "> a", // Selector for gallery items
      spacing: 10, // Spacing between items
      showMaximum: 15, // Maximum number of items visible
      enableScroll: true, // Enable scrolling
      flipDirection: "bottom", // Flip direction
      autoplay: false // Disable autoplay
    });
  }).fail(function () {
    console.error("Error loading JSON data.");
  });
});