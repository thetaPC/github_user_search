/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

(function (Drupal, $, drupalSettings) {
  'use strict';
  Drupal.behaviors.pagination = {
    attach: function (context, drupalSettings) {
      $(".block-github-user-search").on("click", ".pagination a", function () {
        let users = [];
        Promise.all([ajaxUserSearch($(this).attr('data-page'))]).then(() => {
          // all requests finished successfully
          users.forEach((user, index) => {
            // console.log(user);
            $.ajax({
              url: "https://api.github.com/users/" + user,
              type: 'GET',
              dataType: 'json',
              data: {
                client_id: '1fe29a511df572a999e0',
                client_secret: 'd1246418259eddc7b3b29e39759e3308af1e5fc1'
              },
              success: function (result) {
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
                var follower_count = document.createElement("div");
                follower_count.className = "follower-count";
                follower_count.innerText = result.followers;
                column.append(follower_count);
                //
                var profile_url = document.createElement("a");
                profile_url.className = "profile-url";
                profile_url.href = result.html_url;
                profile_url.innerText = 'Visit Profile';
                var profile_url_accessibility = document.createElement("span");
                profile_url_accessibility.className = "sr-only";
                profile_url_accessibility.innerText = ' of ' + result.login;
                profile_url.append(profile_url_accessibility);
                column.append(profile_url);
                //
                $("#user-search-results").append(column);
              }
            });

          });
        }).catch(() => {
          // all requests finished but one or more failed
        });

        function ajaxUserSearch(pageNo) {
          return $.ajax({
            url: "https://api.github.com/search/users?q=" + $('#edit-user').val() + '&page=' + pageNo,
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
              // console.log(result);
              $("#user-search-results").empty();
              users = [];
              $.each(result.items, function (key, value) {
                users.push(value.login);
              });
              // Pagination
              $total_users_per_page = 30;
              $total_pages = Math.ceil($user_count / $total_users_per_page);
              // console.log($total_pages);
              var pagination = document.createElement("ul");
              pagination.className = "pagination";
              for (i = 1; i < $total_pages; i++) {
                var pagination_item = document.createElement("li");
                var pagination_item_link = document.createElement("a");
                // pagination_item_link.href = "https://api.github.com/search/users?q=" + data + '&page=' + i;
                pagination_item_link.dataset.page = i;
                pagination_item_link.innerText = i;
                pagination_item.append(pagination_item_link);
                pagination.append(pagination_item);
              }
              $("#user-search-results-count").append(pagination);
            }
          });
        }
      });
      // $(document).ready(function () {

      // });
    }
  };

})(Drupal, jQuery, drupalSettings);
