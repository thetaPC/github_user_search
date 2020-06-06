(function ($) {
  // Argument passed from InvokeCommand.
  $.fn.user_search = function (data) {
    var userQuery = data;
    var currentPageUsers = [];
    async function getUsersByQuery(githubURL) {
      $("#user-search-results").empty();
      currentPageUsers = [];
      var response = await fetch(githubURL, {
        client_id: '1fe29a511df572a999e0',
        client_secret: 'd1246418259eddc7b3b29e39759e3308af1e5fc1'
      });
      var link = response.headers.get("link");
      var links = link.split(",");
      var urls = links.map(a => {
        return {
          url: a.split(";")[0].replace(">", "").replace("<", ""),
          title: a.split(";")[1]
        }

      })
      console.log(urls);


      var results = await response.json();
      results.items.forEach(user => {
        currentPageUsers.push(user.login);
        var column = document.createElement("div");
        column.className = "col col-xs-12";
        var img = document.createElement('img');
        img.className = "img-responsive";
        img.src = user.avatar_url;
        img.width = '100';
        img.alt = 'Profile image of ' + user.login;
        column.append(img);
        //
        var username = document.createElement("div");
        username.className = "username";
        username.innerText = user.login;
        column.append(username);
                //
                // var biography = document.createElement("div");
                // biography.className = "biography";
                // biography.innerText = user.bio;
                // column.append(biography);
                //
                // var follower_count = document.createElement("div");
                // follower_count.className = "follower-count";
                // follower_count.innerText = user.followers;
                // column.append(follower_count);
        //
        var profile_url = document.createElement("a");
        profile_url.className = "profile-url";
        profile_url.href = user.html_url;
        profile_url.innerText = 'Visit Profile';
        var profile_url_accessibility = document.createElement("span");
        profile_url_accessibility.className = "sr-only";
        profile_url_accessibility.innerText = ' of ' + user.login;
        profile_url.append(profile_url_accessibility);
        column.append(profile_url);
        //
        $("#user-search-results").append(column);
      });
      console.log(currentPageUsers);

      urls.forEach(u => {
        const btn = document.createElement("button")
        btn.textContent = u.title;
        btn.addEventListener("click", e => getUsersByQuery(u.url))
        $("#user-search-results").append(btn);
      });
      // return data;
    }
    getUsersByQuery('https://api.github.com/search/users?q=' + userQuery);
  // getUsersByQuery()
  //   .then(data => console.log(data));





    // // console.log('user_search is called.');
    // // alert(data);
    // // Set textfield's value to the passed arguments.
    // // $('input#edit-output').attr('value', data);
    // let users = [];


    // var issues = [];


    // Promise.all([ajaxUserSearch("https://api.github.com/search/users?q=" + data)]).then(() => {
    //   // all requests finished successfully
    //   users.forEach((user, index) => {
    //     // console.log(user);
    //     $.ajax({
    //       url: "https://api.github.com/users/" + user,
    //       type: 'GET',
    //       dataType: 'json',
    //       data: {
    //         client_id: '1fe29a511df572a999e0',
    //         client_secret: 'd1246418259eddc7b3b29e39759e3308af1e5fc1'
    //       },
    //       success: function (result) {
    //         var column = document.createElement("div");
    //         column.className = "col col-xs-12";
    //         var img = document.createElement('img');
    //         img.className = "img-responsive";
    //         img.src = result.avatar_url;
    //         img.width = '100';
    //         img.alt = 'Profile image of ' + result.login;
    //         column.append(img);
    //         //
    //         var username = document.createElement("div");
    //         username.className = "username";
    //         username.innerText = result.login;
    //         column.append(username);
    //         //
    //         var biography = document.createElement("div");
    //         biography.className = "biography";
    //         biography.innerText = result.bio;
    //         column.append(biography);
    //         //
    //         var follower_count = document.createElement("div");
    //         follower_count.className = "follower-count";
    //         follower_count.innerText = result.followers;
    //         column.append(follower_count);
    //         //
    //         var profile_url = document.createElement("a");
    //         profile_url.className = "profile-url";
    //         profile_url.href = result.html_url;
    //         profile_url.innerText = 'Visit Profile';
    //         var profile_url_accessibility = document.createElement("span");
    //         profile_url_accessibility.className = "sr-only";
    //         profile_url_accessibility.innerText = ' of ' + result.login;
    //         profile_url.append(profile_url_accessibility);
    //         column.append(profile_url);
    //         //
    //         $("#user-search-results").append(column);
    //       }
    //     });

    //   });
    // }).catch(() => {
    //   // all requests finished but one or more failed
    // });
    // function ajaxUserSearch(githubURL) {
    //   // console.log(githubURL);
    //   return pagedUsers = $.ajax({
    //     // url: "https://api.github.com/search/users?q=" + githubURL,
    //     url: githubURL,
    //     // url: "https://api.github.com/search/users?q=tom",
    //     type: 'GET',
    //     // crossDomain: true,
    //     dataType: 'json',
    //     success: function (result) {


    //       $.merge(issues, result);

    //       var link = pagedUsers.getResponseHeader("Link");
    //       console.log(link);
    //       // console.log(pagedUsers);

    //       if (link.indexOf("next") !== -1) {
    //         console.log('hit');
    //         githubURL = link.substring(link.indexOf("<") + 1, link.indexOf(">"));
    //         ajaxUserSearch(githubURL);
    //       } else {
    //         console.log(issues);
    //       }


    //       $("#user-search-results-count").empty();
    //       $user_count = parseInt(result.total_count);
    //       $user_count_text = 'No users found.'
    //       if ($user_count > 1) {
    //         $user_count_text = 'users found.'
    //       }
    //       if ($user_count == 1) {
    //         $user_count_text = 'user found.'
    //       }
    //       $("#user-search-results-count").append($user_count + ' ' + $user_count_text);
    //       // console.log(result);
    //       $("#user-search-results").empty();
    //       $.each(result.items, function (key, value) {
    //         users.push(value.login);
    //       });
    //       // Pagination
    //       $total_users_per_page = 30;
    //       $total_pages = Math.ceil($user_count / $total_users_per_page);
    //       // console.log($total_pages);
    //       var pagination = document.createElement("ul");
    //       pagination.className = "pagination";
    //       for (i = 1; i < $total_pages; i++) {
    //         var pagination_item = document.createElement("li");
    //         var pagination_item_link = document.createElement("a");
    //         // pagination_item_link.href = "https://api.github.com/search/users?q=" + data + '&page=' + i;
    //         pagination_item_link.dataset.page = i;
    //         pagination_item_link.innerText = i;
    //         pagination_item.append(pagination_item_link);
    //         pagination.append(pagination_item);
    //       }
    //       $("#user-search-results-count").append(pagination);
    //     }
    //   });
    // }
  };
})(jQuery);
