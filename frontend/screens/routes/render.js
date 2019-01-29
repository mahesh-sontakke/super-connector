window.renderMainFrame = function(url, link, callback) {
    $('.br-menu-link').removeClass('active');
    $('a[href="'+link+'"]').addClass('active');
    setTimeout(function () {
      $("#main-frame").empty();
      $('#main-frame').load(url, function() {
          
          callback();
      });
    }, 600);
  }