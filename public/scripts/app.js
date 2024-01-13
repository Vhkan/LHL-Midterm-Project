// Client facing scripts here

$(document).ready(function() {

  console.log('Client works');

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
        location.reload();
      },
      error: function(error) {
        // Handle the error response
        console.error(error);
      }
    });
  });


});
