$(document).ready(function() {
  //Unfavorite an item
  $('.card-body').on('click', '.fa-trash', function() {
    const card = $(this).closest('.card');
    const itemId = card.find('a').attr('href').split('/').pop();
    const favoriteData = {
      carId: itemId
    };

    $.ajax({
      method: 'POST',
      url: '/favorites/remove',
      data: favoriteData,
      success: function(response) {
      console.log('success');
      },
      error: function(error) {
        location.reload();
        console.log(error);
      }
    });

  })

  //Delegation when a favorite btn is clicked
  const favoriteItem = function(event) {

    if (event.target.classList.contains('heart-icon')) {
      // Adds 'is-favorite' class if doesn't exist and removes if it does
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
  $(document).on('click', '.fa-trash', favoriteItem);


});
