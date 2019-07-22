
document.addEventListener('DOMContentLoaded', function() {
  // connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  //load username into profile name on document load
  document.querySelector('#profile-name').innerHTML = localStorage.getItem('name');
  // hide the modal for chatroom creation
  var modal1 = document.getElementById("myModal1");
  modal1.style.display = "none";
  // prompt user for new name if local name is null
  if (localStorage.getItem('name') === null){
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    // on submit, store name into local storage and set the current name
    document.querySelector('#form').onsubmit = function() {
      modal.style.display = "none";
      let name = localStorage.getItem('name');
      name = document.querySelector('#name').value;
      document.querySelector('#profile-name').innerHTML = name;
      localStorage.setItem('name', name);
    };
  };

  // display clear button only when user has entered a display name
    var button = document.getElementById("settings");
    if (localStorage.getItem('name') === null) {
      button.style.display = "none";
    } else {
      button.style.display = "block";
    }

    // disable add channel button if user is not set
    var button = document.getElementById("add-channel");
    if (localStorage.getItem('name') === null) {
      button.style.display = "none";
    } else {
      button.style.display = "block";
    }
    // disable chatroom area is user not set
    var button = document.querySelector(".content");
    if (localStorage.getItem('name') === null) {
      button.style.display = "none";
    } else {
      button.style.display = "block";
    }

    // disable messages and message input
    var message_area = document.querySelector(".messages");
      message_area.style.display = "none";
    var message_input = document.querySelector(".message-input");
      message_input.style.display = "none";


    //clear button clears the session or logs the user out
    var log_out = document.querySelector('#settings');
    log_out.onclick = function () {
      localStorage.clear();
      location.reload();

    };

    //when user clicks on create channel
    document.querySelector('#add-channel').onclick = () => {
      // pop up modal
      modal1.style.display = "block";
      console.log("channel clicked")
    };

      // Initialize new request
    document.querySelector('#form1').onsubmit = function(e) {
      console.log("new XML request");
      modal1.style.display = "none";
      const request = new XMLHttpRequest();
      const chatroom = document.querySelector('#chatroom').value;
      const username = localStorage.getItem('name');
      request.open('POST', '/add_chatroom');

        // Callback function for when request completes
      request.onload = () => {
      console.log("Request completes");
          // Extract JSON data from request
          const data = JSON.parse(request.responseText);
          // Update the result div
          if (data.success) {
              console.log("Data success");
              // get the data that was returned.
              const contents = `${data.chatroom}`
              // create the dom tree under contacts
              const li = document.createElement('li');
              const div = document.createElement('div');
              const span = document.createElement('span');
              const div0= document.createElement('div')
              const p = document.createElement('p');
              const p0 = document.createElement('p');
              li.classList.add('contact');
              div.classList.add('wrap');
              span.classList.add('contact-status', 'online');
              div0.classList.add('meta');
              p.classList.add('name');
              p0.classList.add('preview');
              // setting innerHTML of new dom tree
              const username = localStorage.getItem('name');
              p.innerHTML = contents;
              // p0.innerHTML = username;
              div0.append(p);
              div0.append(p0);
              div.append(span);
              div.append(div0);
              li.append(div);
              //li.style.cssText = "position: relative;  padding: 10px 0 15px 0; font-size: 0.9em; cursor:pointer";
              document.querySelector('#contacts ul').appendChild(li);
              // when the user clicks on the chatroom, enters it
              li.onclick = () => {
                // shows display area for messages and its input
                message_area.style.display = "block";
                message_input.style.display = "block";
                // when a user enters add_chatroom
                socket.emit('enter channel', {'contents': contents});
              };
          }
          else {
              console.log("Data fail");
              alert('chatroom already exists');
              return false;
          }
        }
        // add data to send to the server
      const data = new FormData();
      data.append('chatroom', chatroom);
      data.append('username', username);


      // Send request
      request.send(data);
      console.log("Send data again?");
      e.preventDefault();
      return false;
      };
      // Connect to websocket


      // When connected, configure buttons
      socket.on('connect', () => {
          // Each button should emit a "submit vote" event
          document.querySelectorAll(".contact").forEach(elem => elem.onclick = () => {
            message_area.style.display = "block";
            message_input.style.display = "block";
            var contents = elem.value;
            const username = localStorage.getItem('name');
            socket.emit('enter channel', {'contents': contents});
          });
      });
      // when the user first enters the room
      socket.on('load messages', data => {
          // clear the messages area
          //document.querySelector(".messages").innerHTML = "";
          const li = document.createElement('li');
          const response = JSON.parse(data)
          console.log(response.username)
          const username = localStorage.getItem('name');
          // parse the messages;
          message = `${response}`;
          $('<li class="sent"><img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
          $('.message-input input').val(null);
          $('.contact.active .preview').html('<span>You: </span>' + message);
          $(".messages").animate({ scrollTop: $(document).height() }, "fast");
      });

      // When user send messages
      socket.on('append messages', data => {
          const li = document.createElement('li');
          const username = localStorage.getItem('name');
          // parse the messages;
          message = `${data}`;
          $('<li class="sent"><img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
          $('.message-input input').val(null);
          $('.contact.active .preview').html('<span>You: </span>' + message);
          $(".messages").animate({ scrollTop: $(document).height() }, "fast");
          document.querySelector
      });





});



  $(".messages").animate({ scrollTop: $(document).height() }, "fast");

  $("#profile-img").click(function() {
  	$("#status-options").toggleClass("active");
  });

  $(".expand-button").click(function() {
    $("#profile").toggleClass("expanded");
  	$("#contacts").toggleClass("expanded");
  });

  $("#status-options ul li").click(function() {
  	$("#profile-img").removeClass();
  	$("#status-online").removeClass("active");
  	$("#status-away").removeClass("active");
  	$("#status-busy").removeClass("active");
  	$("#status-offline").removeClass("active");
  	$(this).addClass("active");

  	if($("#status-online").hasClass("active")) {
  		$("#profile-img").addClass("online");
  	} else if ($("#status-away").hasClass("active")) {
  		$("#profile-img").addClass("away");
  	} else if ($("#status-busy").hasClass("active")) {
  		$("#profile-img").addClass("busy");
  	} else if ($("#status-offline").hasClass("active")) {
  		$("#profile-img").addClass("offline");
  	} else {
  		$("#profile-img").removeClass();
  	};

  	$("#status-options").removeClass("active");
  });

  function newMessage() {
  	message = $(".message-input input").val();
    //send message to server with the message containing the message itself, username, and chatroom
    const username = localStorage.getItem('name');
    const chatroom = document.querySelector('#chatroom').value;
    console.log("new Message")
    // send message to the server with the message, chatroom, and username
    socket.emit('send message', {'message': message, 'chatroom': chatroom, 'username': username});
    console.log("socket send?")
  	if($.trim(message) == '') {
  		return false;
  	}
  };

  $('.submit').click(function() {
    newMessage();
  });

  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      newMessage();
      return false;
    }
  });
  //# sourceURL=pen.js
