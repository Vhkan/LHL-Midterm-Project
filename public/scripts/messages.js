$(document).ready(function () {

  function retrieveMessages() {
    $.ajax({
      type: 'GET',
      url: '/messages',
      success: function (messages) {
        messages.forEach(function (message) {
          $("#chatContainer").append('<div class="message"><strong>User ' + message.sender_id + ':</strong> ' + message.content + '</div>');
        });
      },
      error: function (error) {
        console.error('Error retrieving messages:', error);
      }
    });
  }



  $('.message-form').submit(function (event) {
    event.preventDefault();


    const message = $('#messageInput').val();


    $.ajax({
      type: 'POST',
      url: '/messages',
      data: { sender_id: 12, receiver_id: 13, content: message },
      success: function (response) {

        $('#chatContainer').append('<div class="my-message"><strong>You:</strong> ' + response.content + '</div>');


        $('#messageInput').val('');
      },
      error: function (error) {
        console.error('Error sending message:', error);
      }
    });
  });


  retrieveMessages();
});
