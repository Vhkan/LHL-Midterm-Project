// Client facing scripts here

$(document).ready(function() {
  console.log('Client works');


  //Delegation when a favorite btn is clicked
  const favoriteItem = function(event) {
    event.preventDefault();

    if (event.target.classList.contains('heart-icon')) {
      // A  dds 'is-favorite' class if doesn't exist and removes if it does
      $(event.target).toggleClass('is-favorite');

      if ($(event.target).hasClass('is-favorite')) {
        // changes the color to yellow if the fav class is present
        $(event.target).css('color', '#FFC436');
      } else {
        // Resets the color to dark-blue is the class is not present
        $(event.target).css('color', '#033c9d');
      }
    }
  }


  $(document).on('click', '.heart-icon', favoriteItem);

});