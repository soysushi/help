// declare global socket variable
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
// Do this once the document have loaded
document.addEventListener('DOMContentLoaded', () => {
  // variable in this outer scope for other functions to change the chatroom
  var send_msg_cont = ""


  //load username into profile name on document load
  document.querySelector('#profile-name').innerHTML = localStorage.getItem('name');
  //so check to see if the list is empty, if it is change local storage chatroom to null
  if (!document.querySelector('#contacts ul').firstElementChild){
    console.log("the list is empty!")
    localStorage.removeItem('chatroom');
    // disable messages and message input
    var message_area = document.querySelector(".messages");
      message_area.style.display = "none";
    var message_input = document.querySelector(".message-input");
      message_input.style.display = "none";
  }
  // if it is not, that means user is not in their first session
  else {
    var chatroom = localStorage.getItem("chatroom")
    var username = localStorage.getItem("name")
    var message_area = document.querySelector(".messages");
    message_area.style.display = "block";
    var message_input = document.querySelector(".message-input");
    message_input.style.display = "block";
    document.title = chatroom;
    history.pushState({"title": chatroom}, chatroom, chatroom)
    socket.emit('enter channel', {'contents': chatroom, 'username': username});
  }
  //
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


    //clear button clears the session or logs the user out
    var log_out = document.querySelector('#settings');
    log_out.onclick = function () {
      localStorage.clear();
      location.reload();
    };
    //when user clicks on create channel
    document.querySelector('#add-channel').onclick = () => {
      // pop up moda
      modal1.style.display = "block";
    };
    // this listens for pushstate and then takes the states and assign title and url
    window.onpopstate = e => {
        const data = e.state;
        document.title = data.title;
        const username = localStorage.getItem('name');
        localStorage.setItem('chatroom', data.title);
        socket.emit('enter channel', {'contents': data.title, 'username': username});
    };
      // Initialize new request
    document.querySelector('#form1').onsubmit = function(e) {
      modal1.style.display = "none";
      const request = new XMLHttpRequest();
      const chatroom = document.querySelector('#chatroom').value;
      const username = localStorage.getItem('name');
      request.open('POST', '/add_chatroom');
      // this is the xml request to the server for the chatroom
          // that also means
      request.onload = () => {
          // Extract JSON data from request
          const data = JSON.parse(request.responseText);
          // Update the result div
          if (data.success) {
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
                // *** this is because contents is always the one you created?
                send_msg_cont = contents
                localStorage.setItem('chatroom', send_msg_cont);
                console.log(contents)
                // ok so this is the part where entering should be a post request
                document.title = contents;
                history.pushState({"title": contents}, contents, contents)
                socket.emit('enter channel', {'contents': contents, 'username': username});
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
      // When connected, configure buttons, check to see if there is a previous session
      socket.on('connect', () => {
          // If the user previously had a previous session
          var a = localStorage.getItem("chatroom")
          var b = localStorage.getItem("name")
          if (a || b == null){
            console.log("this is a new session")
            console.log(a)
            console.log(b)
          }
          document.getElementById("file_upload").onclick = () => {
              console.log("hello i am clicked")
              document.getElementById("f_up").click()
          }


          document.querySelectorAll(".contact").forEach(elem => elem.onclick = () => {
            message_area.style.display = "block";
            message_input.style.display = "block";
            var contents = elem.querySelector(".name").innerHTML;
            send_msg_cont = localStorage.getItem("chatroom");
            const username = localStorage.getItem('name');
            document.title = contents;
            history.pushState({"title": contents}, contents, contents)
            localStorage.setItem('chatroom', contents);
            socket.emit('enter channel', {'contents': contents, 'username': username});
          });



          socket.on('load messages', data => {
            console.log("loading from refresh")
              const username = localStorage.getItem('name');
              const d_username = JSON.parse(data.username)
              clear_channels();
              const li = document.createElement('li');
              // parse the messages;
              var result = JSON.parse(data.chatroom_messages)
              message = ""
              dt = ""
              for (var i in result) {
                // key is the date_time
                var key = i;
                var val = result[i];
                for (var j in val) {
                  var sub_key = j; // this is the user name
                  var sub_val = val[j]; // this is the messae
                  message = sub_val;
                  dt = JSON.parse(i);
                  if (sub_key != username) {
                    $('<li class="replies"><img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="" /><span class="tooltiptext">'+ d_username + ": " + dt +'</span><p>' + message + '</p></li>').appendTo($('.messages ul'));
                    $('.message-input input').val(null);
                    $('.contact.active .preview').html('<span>You: </span>' + message);
                    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
                  }
                  else {
                    $('<li class="sent"><img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="" /><span class="tooltiptext">'+ username + ": " + dt +'</span><p>' + message + '</p></li>').appendTo($('.messages ul'));
                    $('.message-input input').val(null);
                    $('.contact.active .preview').html('<span>You: </span>' + message);
                    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
                  }
                }
              }
          });

          // When user send messages
          socket.on('append messages', data => {
              var current_chatroom = localStorage.getItem('chatroom');
              var chatroom = JSON.parse(data.chatroom)
              if (chatroom != current_chatroom){
                return false;
              }

              const li = document.createElement('li');
              const username = localStorage.getItem('name');
              // parse the messages;
              var d_username = JSON.parse(data.username);
              var result = JSON.parse(data.message); // message contains username
              var date_t = JSON.parse(data.date_time);


              message = ""
              dt = ""
              for (var i in result) { // for username and message in datetime
                var key = i; // username
                var val = result[i]; // message
                message = val;
                dt = date_t;
              }
              // this expression is equivalent to parsing
              if (d_username != username) {
                $('<li class="replies"><img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="" /><span class="tooltiptext">'+ d_username + ": " + dt +'</span><p>' + message + '</p></li>').appendTo($('.messages ul'));
                $('.message-input input').val(null);
                $('.contact.active .preview').html('<span>You: </span>' + message);
                $(".messages").animate({ scrollTop: $(document).height() }, "fast");
              }
              else {
                $('<li class="sent"><img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="" /><span class="tooltiptext">'+ username + ": " + dt +'</span><p>' + message + '</p></li>').appendTo($('.messages ul'));
                $('.message-input input').val(null);
                $('.contact.active .preview').html('<span>You: </span>' + message);
                $(".messages").animate({ scrollTop: $(document).height() }, "fast");
              }

          });
          const clear_channels = () => {
            let ul = document.querySelector(".messages ul");
            ul.innerHTML = "";
          };


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
              send_msg_cont = localStorage.getItem('chatroom')
              var chatroom = ""
              if (send_msg_cont == "") {
                // this should never fire
                console.log("I should never fire")
                chatroom = document.querySelector('#chatroom').value;
              }
              else {
                chatroom = send_msg_cont;
              }
              console.log("username" + username)
              console.log(send_msg_cont) // this is chatroom essentially
              console.log(message)
              // send message to the server with the message, chatroom, and username
              socket.emit('send message', {'message': message, 'chatroom': chatroom, 'username': username});
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
    });

      });


  //# sourceURL=pen.js
