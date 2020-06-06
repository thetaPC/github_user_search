(function ($) {
  // Argument passed from InvokeCommand.
  $.fn.user_search = function (data) {
    console.log('user_search is called.');
    alert(data);
    // Set textfield's value to the passed arguments.
    // $('input#edit-output').attr('value', data);
    $.ajax({
      url: "https://api.github.com/search/users?q=" + data,
      // url: "https://api.github.com/search/users?q=tom",
      success: function (result) {
        $('.view-empty').html(JSON.stringify(result));
        console.log(result);
        console.log(JSON.stringify(result));
      }
    });
  };
})(jQuery);
