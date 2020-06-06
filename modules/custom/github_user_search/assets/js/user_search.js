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
          success: function (result) {
            console.log(result);
            $.each(result, function (key, value) {
              var columnImage = document.createElement("div");
              columnImage.className = "col col-xs-12 col-md-6";
              var img = document.createElement('img');
              img.className = "img-responsive";
              img.src = value.avatar_url;
              img.width = '100';
              img.alt = 'Profile image of ' + value.login;
              columnImage.append(img);
              $("#user-search-results").append(columnImage);

              var columnName = document.createElement("div");
              columnName.className = "col col-xs-12 col-md-6";
              columnName.innerText = value.login;
              $("#user-search-results").append(columnName);
            });
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
        headers: {
          "accept": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
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
