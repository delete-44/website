// CODE FROM https://stackoverflow.com/questions/9979827/change-active-menu-item-on-page-scroll
// StackOverflow user @mekwall

// Bind to scroll
$(window).scroll(function () {
  // Cache selectors
  var list = $("#verticalScroller"),
    listHeight = list.outerHeight() + 15,
    // All list items
    menuItems = list.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function () {
      var item = $($(this).attr("href"));
      if (item.length) {
        return item;
      }
    });

  // Get container scroll position
  var distanceFromTop = $(this).scrollTop() + listHeight;

  // Get id of current scroll item
  var currentListItem = scrollItems.map(function () {
    if ($(this).offset().top < distanceFromTop) return this;
  });

  // Get the id of the current element
  currentListItem = currentListItem[currentListItem.length - 1];
  var id =
    currentListItem && currentListItem.length ? currentListItem[0].id : "";

  // Set/remove active class
  menuItems
    .parent()
    .removeClass("active-anchor-link")
    .end()
    .filter("[href='#" + id + "']")
    .parent()
    .addClass("active-anchor-link");
});
