$(document).ready(function () {
  // Fetch JSON data using jQuery AJAX
  $.getJSON("data.json", function (data) {
    let output = "";

    // Iterate over the data and create HTML
    $.each(data, function (key, value) {
      output += `<div class="data-item">`;
      output += `<h2>${value.name || value.title || "Untitled"}</h2>`; // Adjust based on your dataset
      output += `<p>${value.description || "No description available."}</p>`; // Adjust based on your dataset
      output += `</div>`;
    });

    // Insert the generated HTML into the container
    $("#data-container").html(output);

    // Apply your jQuery plugin to the data
    $("#data-container .data-item").myPlugin();
  }).fail(function () {
    console.error("Error loading JSON data.");
  });
});

// Define a jQuery plugin
(function ($) {
  $.fn.myPlugin = function () {
    this.hover(
      function () {
        $(this).css("background-color", "#f0f0f0"); // Highlight on hover
      },
      function () {
        $(this).css("background-color", ""); // Remove highlight
      }
    );
    return this; // Maintain chainability
  };
})(jQuery);