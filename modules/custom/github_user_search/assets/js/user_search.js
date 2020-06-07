/**
 * @file Search users using the GitHub API.
 * @author Maria Loza <mlozacoder@gmail.com>
 *
 * See [GitHub API v3 - Searching users]{@link https://developer.github.com/v3/search/#search-users} for searching users through the GitHub API.
 * See [GitHub API v3 - Pagination]{@link https://developer.github.com/v3/guides/traversing-with-pagination/} for traversing with pagination.
 *
 */

(function ($) {
  // Argument passed from InvokeCommand.
  $.fn.user_search = function (data) {
    /** @type {string} */
    var userQuery = data;
    /** @type {array} */
    var currentPageUsers = [];
    /** @type {int} */
    var usersPerPage = 30; // Github API default.
    async function getUsersByQuery(githubURL) {
      // Clear any items from the list.
      $("#user-search-results").empty();
      $("#user-search-results-count").empty();
      /** @type {array} */
      var currentPageUsers = [];
      /** @type {object} */
      var response = await fetch(githubURL);
      /** @type {array} */
      var results = await response.json();
      // Total count ---
      /** @type {int} */
      var user_count = parseInt(results.total_count);
      // Create a unique message based on the number of users found.
      /** @type {string} */
      user_count_text = ' - No users found.'
      if (user_count > 1) {
        user_count_text = 'users found.'
      }
      if (user_count == 1) {
        user_count_text = 'user found.'
      }
      // Add the user count to the block.
      /** @type {Element} */
      var columnResultCount = document.createElement("div");
      columnResultCount.className = "col col-xs-12";
      columnResultCount.innerText = user_count + ' ' + user_count_text;
      $("#user-search-results-count").append(columnResultCount);
      // Create a top pagination if there's than one page found.
      if (user_count > usersPerPage) {
        /** @type {string} */
        var headersPaginationLinks = response.headers.get("link");
        createPagination(headersPaginationLinks);
      }
      // Store all the usernames associated with the found users.
      results.items.forEach(user => {
        currentPageUsers.push(user.login);
      });
      // Iterate through the usernames to find additional data on their profile.
      currentPageUsers.forEach(user => {
        // Calling ont the User API.
        var userData = getUserData(user).then(data => {
          // Creating a Bootstrap column per user.
          /** @type {Element} */
          var column = document.createElement("div");
          column.className = "col col-xs-12 col-md-4";
          // Creating a Bootstrap panel per user.
          /** @type {Element} */
          var panel = document.createElement("div");
          panel.className = "panel panel-default card";
          // Creating an element associated with the user's name.
          /** @type {Element} */
          var name = document.createElement("h2");
          name.className = "name";
          name.innerText = data.name;
          panel.append(name);
          // Creating an element associated with the user's image.
          /** @type {Element} */
          var img = document.createElement('img');
          img.className = "img-responsive img-circle";
          img.src = data.avatar_url;
          img.width = '100';
          img.alt = 'Profile image of ' + data.login;
          panel.append(img);
          // Creating an element associated with the user's username.
          /** @type {Element} */
          var username = document.createElement("div");
          username.className = "username";
          username.innerText = data.login;
          panel.append(username);
          // Creating an element associated with the user's follower count.
          /** @type {Element} */
          var followers = document.createElement("div");
          followers.className = "followers";
          followers.innerText = data.followers + ' followers';
          panel.append(followers);
          // Creating an element associated with the user's biography.
          /** @type {Element} */
          var biography = document.createElement("div");
          biography.className = "biography";
          biography.innerText = data.bio;
          panel.append(biography);
          // Creating a link associated with the user's profile link.
          /** @type {Element} */
          var profile_url = document.createElement("a");
          profile_url.className = "profile-url btn btn-primary";
          profile_url.href = data.html_url;
          profile_url.innerText = 'Visit Profile';
          // Creating an element associated with the user's profile link to make it ADA compliant.
          /** @type {Element} */
          var profile_url_accessibility = document.createElement("span");
          profile_url_accessibility.className = "sr-only";
          profile_url_accessibility.innerText = ' of ' + data.login;
          profile_url.append(profile_url_accessibility);
          panel.append(profile_url);
          // Adding all the user information to the block page.
          column.append(panel);
          $("#user-search-results").append(column);
        }).catch(error => {
          // Errors are more than likely a limit on GitHub API calls.
          // May verify through the Network tab - 403 error.
          // For developer usage. Remove upon deployment!!!
          // console.log('error:', error);
        });
      });
      // Create bottom pagination if there's more than one page.
      if (user_count > usersPerPage) {
        /** @type {string} */
        var headersPaginationLinks = response.headers.get("link");
        createPagination(headersPaginationLinks);
      }
    };
    // Retrieves a user's information.
    async function getUserData(username) {
      /** @type {object} */
      var response = await fetch('https://api.github.com/users/' + username, {
        client_id: '1fe29a511df572a999e0',
        client_secret: 'd1246418259eddc7b3b29e39759e3308af1e5fc1',
      });
      /** @type {array} */
      var results = await response.json();
      return results;
    };
    // Creates a pagination based on users found count.
    // @see https://github.com/hnasr/javascript_playground/blob/master/githubtutorial/index.html
    function createPagination(headerLinks) {
      /** @type {array} */
      var paginationLinks = headerLinks.split(",");
      /** @type {array} */
      var paginationURLs = paginationLinks.map(a => {
        return {
          url: a.split(";")[0].replace(">", "").replace("<", ""),
          title: a.split(";")[1].match(/"(.*?)"/)[1]
        }
      });
      // Created numbered pagination items.
      paginationURLs = createInnerPaginationItems(paginationURLs);
      // Creating a Bootstrap column.
      /** @type {Element} */
      var paginationColumn = document.createElement("div");
      paginationColumn.className = "col col-xs-12";
      // Creating a Bootstrap pagination.
      /** @type {Element} */
      var pagination = document.createElement("ul");
      pagination.className = "pagination";
      paginationURLs.forEach(paginationURL => {
        // Set up an active pagination for Bootstrap styling.
        /** @type {Element} */
        var pagination_item = document.createElement("li");
        pagination_item.className = "page-item";
        if (paginationURL.active) {
          pagination_item.className = "active";
        }
        // Tie each link to its correct GitHub Search page.
        /** @type {Element} */
        var btnPagerLink = document.createElement("a")
        pagination_item.className = "page-link";
        btnPagerLink.textContent = paginationURL.title;
        btnPagerLink.addEventListener("click", e => {
          // Update the search with the new page number.
          getUsersByQuery(paginationURL.url)
        });
        // Add to the pagination.
        pagination_item.append(btnPagerLink);
        pagination.append(pagination_item);
      });
      // Add element to the block page.
      paginationColumn.append(pagination);
      $("#user-search-results").append(paginationColumn);
    };
    // Create numbered pagination items.
    function createInnerPaginationItems(headerLinks) {
      if (headerLinks[0].title == 'next') {
        // Get the next page number and current page number.
        // @see https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        /** @type {object} */
        var urlParams = new URLSearchParams(headerLinks[0].url);
        /** @type {string} */
        var nextPageNo = urlParams.get('page');
        /** @type {int} */
        var currentPageNo = parseInt(nextPageNo) - 1;
      } else if (headerLinks[0].title == 'prev') {
        // Get the previous page number and current page number.
        // @see https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        /** @type {object} */
        var urlParams = new URLSearchParams(headerLinks[0].url);
        /** @type {string} */
        var prevPageNo = urlParams.get('page');
        /** @type {int} */
        var currentPageNo = parseInt(prevPageNo) + 1;
      }
      /** @type {string} */
      var lastPageNo;
      // Get the last page number.
      headerLinks.forEach(headerLink => {
        if (headerLink.title == 'last') {
          /** @type {object} */
          var lastUrlParams = new URLSearchParams(headerLink.url);
          lastPageNo = lastUrlParams.get('page');
        }
      });
      // Verify that a current page number was retrieved.
      if (currentPageNo != undefined) {
        /** @type {array} */
        var pagesNo = [];
        // Create previous two pages.
        /** @type {int} */
        var prev1 = currentPageNo - 2;
        pagesNo.push(prev1);
        /** @type {int} */
        var prev2 = currentPageNo - 1;
        pagesNo.push(prev2);
        // Verify that the previous two page numbers are valid.
        /** @type {array} */
        var validPrevPagesNo = validPageNo(pagesNo, lastPageNo);
        // Valid previous pages must be added to the pagination links.
        validPrevPagesNo.forEach(validPrevPageNo => {
          /** @type {object} */
          var prevPageURL = new URL(headerLinks[0].url);
          prevPageURL.searchParams.set('page', validPrevPageNo);
          headerLinks.push({
            url: prevPageURL.toString(),
            title: validPrevPageNo,
          });
        });
        // Create the current page.
        // @see https://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery
        /** @type {object} */
        var currentPageURL = new URL(headerLinks[0].url);
        currentPageURL.searchParams.set('page', currentPageNo);
        headerLinks.push({
          url: currentPageURL.toString(),
          title: currentPageNo,
          active: true
        });
        // Create next two pages.
        pagesNo = [];
        /** @type {int} */
        var next1 = currentPageNo + 1;
        pagesNo.push(next1);
        /** @type {int} */
        var next2 = currentPageNo + 2;
        pagesNo.push(next2);
        // Verify that the next two page numbers are valid.
        /** @type {array} */
        var validNextPagesNo = validPageNo(pagesNo, lastPageNo);
        // Valid next pages must be added to the pagination links.
        validNextPagesNo.forEach(validNextPageNo => {
          /** @type {object} */
          var nextPageURL = new URL(headerLinks[0].url);
          nextPageURL.searchParams.set('page', validNextPageNo);
          headerLinks.push({
            url: nextPageURL.toString(),
            title: validNextPageNo,
          });
        });
      }
      // Reorder pagination links.
      /** @type {array} */
      var orderedHeaderLinks = reorderPaginationLinks(headerLinks);
      return orderedHeaderLinks;
    };
    // Verify that the page numbers exist in the pages.
    function validPageNo(pageNumbers, lastPageNo) {
      /** @type {array} */
      var validNumbers = [];
      pageNumbers.forEach(pageNumber => {
        // Valid pages must be a positive number and equal or less than the last page.
        if (pageNumber > 0 && pageNumber <= lastPageNo) {
          validNumbers.push(pageNumber);
        }
      });
      return validNumbers;
    }
    // Reorder pagination links to a typical look.
    // Example: first | prev | 1 | 2 | 3 | next | last
    function reorderPaginationLinks(paginationLinks) {
      // Move prev pagination to the front if it exists.
      paginationLinks.forEach(function (paginationLink, index) {
        if (paginationLink.title == 'prev') {
          paginationLinks.splice(index, 1);
          paginationLinks.unshift(paginationLink);
        }
      });
      // Move first pagination to the front if it exists.
      paginationLinks.forEach(function (paginationLink, index) {
        if (paginationLink.title == 'first') {
          paginationLinks.splice(index, 1);
          paginationLinks.unshift(paginationLink);
        }
      });
      // Move next pagination to the back if it exists.
      paginationLinks.forEach(function (paginationLink, index) {
        if (paginationLink.title == 'next') {
          paginationLinks.push(paginationLinks.splice(index, 1)[0]);
        }
      });
      // Move last pagination to the back if it exists.
      paginationLinks.forEach(function (paginationLink, index) {
        if (paginationLink.title == 'last') {
          paginationLinks.push(paginationLinks.splice(index, 1)[0]);
        }
      });
      return paginationLinks;
    }
    // Valid search query.
    if (userQuery) {
      getUsersByQuery('https://api.github.com/search/users?q=' + userQuery);
    }
  };
})(jQuery);
