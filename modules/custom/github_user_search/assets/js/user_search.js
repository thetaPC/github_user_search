(function ($) {
  // Argument passed from InvokeCommand.
  $.fn.user_search = function (data) {
    var userQuery = data;
    var currentPageUsers = [];
    var usersPerPage = 30; // Github API default.
    async function getUsersByQuery(githubURL) {
      $("#user-search-results").empty();
      $("#user-search-results-count").empty();
      currentPageUsers = [];
      var response = await fetch(githubURL);

      var results = await response.json();
      // Total count ---
      $user_count = parseInt(results.total_count);
      $user_count_text = 'No users found.'
      if ($user_count > 1) {
        $user_count_text = 'users found.'
      }
      if ($user_count == 1) {
        $user_count_text = 'user found.'
      }
      var columnResultCount = document.createElement("div");
      columnResultCount.className = "col col-xs-12";
      columnResultCount.innerText = $user_count + ' ' + $user_count_text;
      $("#user-search-results-count").append(columnResultCount);
      // Pagination ---
      if ($user_count > usersPerPage) {
        // Create top pagination.
        var headersPaginationLinks = response.headers.get("link");
        createPagination(headersPaginationLinks);
      }

      results.items.forEach(user => {
        currentPageUsers.push(user.login);
      });
      currentPageUsers.forEach(user => {
        var userData = getUserData(user).then(data => {
          var column = document.createElement("div");
          column.className = "col col-xs-12 col-md-4";
          var panel = document.createElement("div");
          panel.className = "panel panel-default";
          //
          var name = document.createElement("h2");
          name.className = "name";
          name.innerText = data.name;
          panel.append(name);
          var img = document.createElement('img');
          img.className = "img-responsive img-circle";
          img.src = data.avatar_url;
          img.width = '100';
          img.alt = 'Profile image of ' + data.login;
          panel.append(img);
          //
          var username = document.createElement("div");
          username.className = "username";
          username.innerText = data.login;
          panel.append(username);
          //
          var followers = document.createElement("div");
          followers.className = "followers";
          followers.innerText = data.followers + ' followers';
          panel.append(followers);
          //
          var biography = document.createElement("div");
          biography.className = "biography";
          biography.innerText = data.bio;
          panel.append(biography);
          //
          var profile_url = document.createElement("a");
          profile_url.className = "profile-url btn btn-primary";
          profile_url.href = data.html_url;
          profile_url.innerText = 'Visit Profile';
          var profile_url_accessibility = document.createElement("span");
          profile_url_accessibility.className = "sr-only";
          profile_url_accessibility.innerText = ' of ' + data.login;
          profile_url.append(profile_url_accessibility);
          panel.append(profile_url);
          //
          column.append(panel);
          $("#user-search-results").append(column);
        }).catch(error => {
          console.log('error:', error);
        });
      });

      // Pagination ---
      if ($user_count > usersPerPage) {
        // Create bottom pagination.
        var headersPaginationLinks = response.headers.get("link");
        createPagination(headersPaginationLinks);
      }
    };
    async function getUserData(username) {
      var response = await fetch('https://api.github.com/users/' + username, {
        client_id: '1fe29a511df572a999e0',
        client_secret: 'd1246418259eddc7b3b29e39759e3308af1e5fc1',
      });
      var results = await response.json();
      return results;
    };
    function createPagination(headerLinks) {
      var paginationLinks = headerLinks.split(",");
      var paginationURLs = paginationLinks.map(a => {
        return {
          url: a.split(";")[0].replace(">", "").replace("<", ""),
          title: a.split(";")[1].match(/"(.*?)"/)[1]
        }
      });
      paginationURLs = createInnerPaginationItems(paginationURLs);
      var paginationColumn = document.createElement("div");
      paginationColumn.className = "col col-xs-12";
      var pagination = document.createElement("ul");
      pagination.className = "pagination";
      paginationURLs.forEach(paginationURL => {
        var pagination_item = document.createElement("li");
        if (paginationURL.active) {
          pagination_item.className = "active";
        }
        var btnPagerLink = document.createElement("a")
        btnPagerLink.textContent = paginationURL.title;
        btnPagerLink.addEventListener("click", e => {
          getUsersByQuery(paginationURL.url)
        });
        pagination_item.append(btnPagerLink);
        pagination.append(pagination_item);

      });
      paginationColumn.append(pagination);
      $("#user-search-results").append(paginationColumn);
    };
    function createInnerPaginationItems(headerLinks) {
      if (headerLinks[0].title == 'next') {
        // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        var urlParams = new URLSearchParams(headerLinks[0].url);
        var nextPageNo = urlParams.get('page');
        var currentPageNo = parseInt(nextPageNo) - 1;
        var urlParams = new URLSearchParams(headerLinks[1].url);
      } else if (headerLinks[0].title == 'prev') {
        // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        var urlParams = new URLSearchParams(headerLinks[0].url);
        var prevPageNo = urlParams.get('page');
        var currentPageNo = parseInt(prevPageNo) + 1;
      }
      var lastPageNo;
      headerLinks.forEach(headerLink => {
        if (headerLink.title == 'last') {
          var lastUrlParams = new URLSearchParams(headerLink.url);
          lastPageNo = lastUrlParams.get('page');
        }
      });
      if (currentPageNo != undefined) {
        var pagesNo = [];
        // Create previous two pages.
        prev1 = currentPageNo - 2;
        pagesNo.push(prev1);
        prev2 = currentPageNo - 1;
        pagesNo.push(prev2);
        var validPrevPagesNo = validPageNo(pagesNo, lastPageNo);
        validPrevPagesNo.forEach(validPrevPageNo => {
          var prevPageURL = new URL(headerLinks[0].url);
          prevPageURL.searchParams.set('page', validPrevPageNo);
          headerLinks.push({
            url: prevPageURL.toString(),
            title: validPrevPageNo,
          });
        });
        // https://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery
        var currentPageURL = new URL(headerLinks[0].url);
        currentPageURL.searchParams.set('page', currentPageNo);
        headerLinks.push({
          url: currentPageURL.toString(),
          title: currentPageNo,
          active: true
        });
        // Create next two pages.
        pagesNo = [];
        next1 = currentPageNo + 1;
        pagesNo.push(next1);
        next2 = currentPageNo + 2;
        pagesNo.push(next2);
        var validNextPagesNo = validPageNo(pagesNo, lastPageNo);
        validNextPagesNo.forEach(validNextPageNo => {
          var nextPageURL = new URL(headerLinks[0].url);
          nextPageURL.searchParams.set('page', validNextPageNo);
          headerLinks.push({
            url: nextPageURL.toString(),
            title: validNextPageNo,
          });
        });
      }
      orderedHeaderLinks = reorderPaginationLinks(headerLinks);
      return orderedHeaderLinks;
    };
    function validPageNo(pageNumbers, lastPageNo) {
      var validNumbers = [];
      pageNumbers.forEach(pageNumber => {
        if (pageNumber > 0 && pageNumber <= lastPageNo) {
          validNumbers.push(pageNumber);
        }
      });
      return validNumbers;
    }
    function reorderPaginationLinks(paginationLinks) {
      paginationLinks.forEach(function (paginationLink, index) {
        if (paginationLink.title == 'prev') {
          paginationLinks.splice(index, 1);
          paginationLinks.unshift(paginationLink);
        }
      });
      paginationLinks.forEach(function (paginationLink, index) {
        if (paginationLink.title == 'first') {
          paginationLinks.splice(index, 1);
          paginationLinks.unshift(paginationLink);
        }
      });
      paginationLinks.forEach(function (paginationLink, index) {
        if (paginationLink.title == 'next') {
          paginationLinks.push(paginationLinks.splice(index, 1)[0]);
        }
      });
      paginationLinks.forEach(function (paginationLink, index) {
        if (paginationLink.title == 'last') {
          paginationLinks.push(paginationLinks.splice(index, 1)[0]);
        }
      });
      return paginationLinks;
    }
    if (userQuery) {
      getUsersByQuery('https://api.github.com/search/users?q=' + userQuery);
    }
  };
})(jQuery);
