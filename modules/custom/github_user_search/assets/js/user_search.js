(function ($) {
  // Argument passed from InvokeCommand.
  $.fn.user_search = function (data) {
    // console.log('user_search is called.');
    // alert(data);
    // Set textfield's value to the passed arguments.
    // $('input#edit-output').attr('value', data);
    let users = [];
    Promise.all([ajaxUserSearch()]).then(() => {
      // all requests finished successfully
      users.forEach((user, index) => {
        console.log(user);
        $.ajax({
          url: "https://api.github.com/users/" + user,
          type: 'GET',
          dataType: 'json',
          data: {
            client_id: '1fe29a511df572a999e0',
            client_secret: 'd1246418259eddc7b3b29e39759e3308af1e5fc1'
          },
          success: function (result) {
            console.log(result);
            var column = document.createElement("div");
            column.className = "col col-xs-12";
            var img = document.createElement('img');
            img.className = "img-responsive";
            img.src = result.avatar_url;
            img.width = '100';
            img.alt = 'Profile image of ' + result.login;
            column.append(img);
            //
            var username = document.createElement("div");
            username.className = "username";
            username.innerText = result.login;
            column.append(username);
            //
            var biography = document.createElement("div");
            biography.className = "biography";
            biography.innerText = result.bio;
            column.append(biography);
            //
            $("#user-search-results").append(column);
          }
        });

      });
    }).catch(() => {
      // all requests finished but one or more failed
    });
    function ajaxUserSearch() {
      return $.ajax({
        url: "https://api.github.com/search/users?q=" + data,
        // url: "https://api.github.com/search/users?q=tom",
        type: 'GET',
        dataType: 'json',
        success: function (result) {
          // $('.view-empty').html(JSON.stringify(result));
          $("#user-search-results-count").empty();
          $user_count = parseInt(result.total_count);
          $user_count_text = 'No users found.'
          if ($user_count > 1) {
            $user_count_text = 'users found.'
          }
          if ($user_count == 1) {
            $user_count_text = 'user found.'
          }
          $("#user-search-results-count").append($user_count + ' ' + $user_count_text);
          console.log(result);
          $("#user-search-results").empty();
          $.each(result.items, function (key, value) {
            users.push(value.login);
          });
        }
      });
    }
  };
})(jQuery);
