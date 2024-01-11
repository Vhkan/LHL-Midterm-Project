// Client facing scripts here

$(document).ready(function() {

  console.log('Client works');

  //Delegation when a favorite btn is clicked
  const favoriteItem = function(event) {
    event.preventDefault();

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


  let selectedYear, selectedModel, selectedMake, selectedPrice;

  // capturing values from each filter option

  $('#filterYear').on('change', function() {
    selectedYear = $(this).val();
    console.log(selectedYear);
  });

  $('#filterMake').on('change', function() {
    selectedMake = $(this).val();
    console.log(selectedMake);
  });

  $('#filterModel').on('change', function() {
    selectedModel = $(this).val();
    console.log(selectedModel);
  });

  $('#filterPrice').on('change', function() {
    selectedPrice = $(this).val();

    if (selectedPrice) {
      let [min, max] = selectedPrice.split(' ');
      min = Number(min);
      max = Number(max);
      selectedPrice = [min, max];
    }
  });

  $('.filter-form').on('submit', function(event) {
    event.preventDefault();

    // creating object to pass to server side route

    // example object:
    // const formData = {
    //  year: 1959,
    //  make: 'Chevrolet',
    //  model: 'Corvette',
    //  price: ['80000', '90000']
    // };

    const formData = {
      year: selectedYear,
      make: selectedMake,
      model: selectedModel,
      price: selectedPrice
    };

    $.ajax({
      method: 'POST',
      url: '/filtered',
      data: formData
    })
      .done((response) => {
        console.log('Success');
        updateCarList(response, false);
      })
  })

  // Empty card container and update HTML with new array of cars from filter
  /**
   * updateCarList
   * @param {Array} cars - An array of car objects.
   * @param {boolean} isAdmin - true if admin html render, false for user html render
   */
  function updateCarList(cars, isAdmin) {

    // ADMIN html

    const adminHtml = `
            <!-- Delete an item -->
            <form action="/inventory" method="POST">
              <input type="hidden" name="itemId" value="<%= item.id  %>">
              <button type="submit" class="btn btn-danger btn-md">Delete an Item</button>
            </form>


            <div class="mark-as-sold">
              <!-- When mark as sold btn is clicked -->
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="exampleCheckbox">
                <b>Mark as Sold</b>
              </div>
            </div>
            `;

    // USER html
    const userHtml = `
            <a href="/contact_seller" class="btn btn-warning btn-md" role="button">Contact Seller</a>
            <div class="add-to-favs">
              <!-- When favorite btn is clicked -->
              <b>Add to Favourites </b><i class="heart-icon fa-solid fa-heart fa-lg"></i>
            </div>`;

    // class that holds the car information

    const $carList = $('.row.mb-4');
    $carList.empty();

    //copied HTML format from index.ejs to render same format and styling

    cars.forEach((data) => {
      const imgUrl = data.is_sold ? '/documents/Sold/SOLD.jpg' : data.photo_url_1;
      const html = `
      <div class="col-md-3">
        <div class="card">
          <a href="/sell/${data.id}">
            <img src="${imgUrl}" class="card-img-top" alt="image_unavailable">
          </a>
          <div class="card-body">
            <h5 class="card-title">
              ${data.make}
              ${data.model}
            </h5>
            <h6 class="card-info"><b>Year:</b>
              ${data.year}
            </h6>
            <h6 class="card-info"><b>Color:</b>
              ${data.color}
            </h6>
            <h6 class="card-info"><b>Mileage:</b>
              ${data.odometer}
            </h6>
            <h6 class="card-info"><b>Price:</b> $${data.price}
            </h6>
            ${isAdmin ? adminHtml : userHtml}

          </div>
        </div>
      </div>`;
      $carList.append(html);
    });
  }



  //Chat on contact_seller page V2

  const $messageInput = $("#messageInput");
  const $chatContainer = $("#chatContainer");

  $('#send-btn').click(sendMessage);

  function sendMessage() {
    const msg = $messageInput.val();

    // New message based on the sender (Seller/Buyer)
    const sender = isSellerTurn() ? "Seller" : "Buyer";

    //Cerating a message + class (sender + "-message" => "Buyer-message")
    const newMessage = $("<div class='mb-2 " + sender + "-message'><strong>" + sender + ":</strong> " + msg + "</div>");

    // Adds a new message to the chat
    $chatContainer.append(newMessage);

    // Clears the msg input field
    $messageInput.val("");

    // Changes the message sender
    toggleSenderTurn();
  }

  // Check if it's the seller's / buyer's turn now
  //Returns a true/false boolean
  function isSellerTurn() {
    if ($('.seller-message').length % 2 === 0) {
      return true; // It's seller's turn
    } else {
      return false; // It's buyer's turn
    }
  }
  // Toggles sender's the turn
  function toggleSenderTurn() {
    if (isSellerTurn()) {
      $chatContainer.append("<div class='mb-2 buyer-message'><strong>Buyer:</strong> Typing...</div>");
    } else {
      $chatContainer.append("<div class='mb-2 seller-message'><strong>Seller:</strong> Typing...</div>");
    }
  }

  // SOLD checkbox

  $('.row.mb-4').on('change', '.form-check-input', function() {
    console.log('checkbox changed!');
    const itemId = $(this).closest('.card-body').find('input[name="itemId"]').val();

    $.ajax({
      method: 'POST',
      url: `/sell/${itemId}`,
      data: { itemId: itemId }
    })
      .done(response => {
        console.log('success');
        updateCarList(response, true);
        location.reload();
      })
      .fail(error => {
        console.log(`Error: ${error}`);
      });
  });


  
  //Favorite an item
  $('.card-body').on('click', '.heart-icon', function() {
    // Find the closest parent card element
    const card = $(this).closest('.card');

    // Extract item.id from the href attribute
    const itemId = card.find('a').attr('href').split('/').pop();

    const favoriteData = {
      carId: itemId
    };
    $.ajax({
      method: 'POST',
      url: '/favorites',
      data: favoriteData,
      success: function(response) {
        // Handle the success response
        console.log(response);
      },
      error: function(error) {
        // Handle the error response
        console.error(error);
      }
    });

    $.ajax({
      method: 'GET',
      url: '/favorites',
      success: function(response) {
        console.log('success', response);
      }
    });
  });

  //Unfavorite an item
  $('.card-body').on('click', '.heart-icon', function() {
    const card = $(this).closest('.card');
    const itemId = card.find('a').attr('href').split('/').pop();
    const favoriteData = {
      carId: itemId
    };

    $.ajax({
      method: 'POST',
      url: '/favorites/remove',
      data: favoriteData,
      success: function(response){
        console.log("Response from /favorites/remove", response);
  
        removeFromFavorites(userId, carId)
        .then(() => {
          console.log('Item removed from favorites');
        })
        .catch((error) => {
          console.log("Favorited item removal error:", error);
        })
      },
          error: function(error) {
        console.log(error);
      }
    });

  })



});
