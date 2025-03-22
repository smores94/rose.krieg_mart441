$(document).ready(function () {
  // Fetch JSON data using jQuery AJAX
  $.getJSON("data.json", function (data) {
    let output = "";

    // Iterate over the data and create HTML
    $.each(data, function (index, event) {
      output += `<div class="event-item">`;
      output += `<h2>${event.description}</h2>`; // Use the description field
      output += `<p><strong>Year:</strong> ${event.year}</p>`; // Display the year
      output += `<p><strong>Involved Agents:</strong> ${event.involvedAgents.join(", ")}</p>`; // Display involved agents
      if (event.illustration) {
        output += `<img src="${event.illustration}" alt="Event Illustration">`; // Display the illustration if available
      }
      output += `</div>`;
    });

    // Insert the generated HTML into the container
    $("#data-container").html(output);

    // Apply your jQuery plugin to the event items
    $("#data-container .event-item").myPlugin();
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