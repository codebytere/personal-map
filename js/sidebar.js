$.fn.sidebar = function(options) {
  
  var $sidebar = this;
  var $tabs = $sidebar.find('ul.sidebar-tabs, .sidebar-tabs > ul');
  var $container = $sidebar.children('.sidebar-content').first();

  options = $.extend({
    position: 'left'
  }, options || {});

  $sidebar.addClass('sidebar-' + options.position);

  $tabs.children('li').children('a').on('click', function(e) {
    e.preventDefault();
    var $tab = $(this).closest('li');

    if ($tab.hasClass('active'))
      $sidebar.close();
    else if (!$tab.hasClass('disabled'))
      $sidebar.open(this.hash.slice(1), $tab);
  });

  $sidebar.find('.sidebar-close').on('click', function() {
      $sidebar.close();
  });

  $sidebar.open = function(id, $tab) {
    if (typeof $tab === 'undefined')
      $tab = $tabs.find('li > a[href="#' + id + '"]').parent();

    $container.children('.sidebar-pane.active').removeClass('active');

    $container.children('#' + id).addClass('active');

    $tabs.children('li.active').removeClass('active');

    $tab.addClass('active');

    $sidebar.trigger('content', { 'id': id });

    if ($sidebar.hasClass('collapsed')) {
      $sidebar.trigger('opening');
      $sidebar.removeClass('collapsed');
    }
  };

  $sidebar.close = function() {
    $tabs.children('li.active').removeClass('active');

    if (!$sidebar.hasClass('collapsed')) {
      $sidebar.trigger('closing');
      $sidebar.addClass('collapsed');
    }
  };

  return $sidebar;
};
