function Menu(parameters) 
{
	var model = parameters.model;
  var searchFlag = typeof parameters.search == "undefined" ? false : true;
  var sortFlag = typeof parameters.sort == "undefined" ? false : true;
  var navMenuFlag = typeof parameters.navmenu == "undefined" ? false : true;
  var title = typeof parameters.title == "undefined" ? "Menu" : parameters.title;

  //construct menu items
  $("#menu").append(
      '<div id="anchor"></div>'+
      '<div id="selector" class="block-header twelve columns">'+
        '<span id="title" class="header one column"><h4>'+title+'</h4></span>'+
      '</div>');

  if ( navMenuFlag ) 
  {
    $("#selector").prepend(
     '<nav class="left nav-icon-menu five columns">'+
      '<ul class="twelve columns">'+
      '</ul>'+
     '</nav>'
    );

    parameters.navmenu.funct(model);
  } else {
    $("#title").addClass("offset-by-five");
  }

  if ( sortFlag )
  {
    $("#selector").append(
      '<span class="shift three columns">'+
        '<h5><label class="header offset-by-two four columns" for="sort">Sort</label>'+
        '<select class="input right offset-by-one five columns" id="sort"></select></h5>'+
      '</span>');

    //is there a better way to do this?!
    $.each(parameters.sort.keys, function (key, value) {
      $("#sort").append(
        $("<option></option>").val(value).html(value)
      );
    });

    $("#sort").on("change", function() { parameters.sort.funct(); });
  } else {
    $("#searchBar").addClass("offset-by-three");
  }

  if ( searchFlag ) 
  {
    //Add search bar in
    $("#selector").append(
        '<span id="searchBar" class="three columns">'+
          '<h5><label class="header offset-by-two four columns" for="search">Search</label>'+
          '<input class="input right offset-by-one five columns" id="search" type="search"></input></h5>'+
        '</span>');

    /*Search Functionality*/
    //Create auto complete feature for search bar
    $("#search").autocomplete({
      source: parameters.search.tags(),
      minLength: Math.max(Object.keys(model).length/50, 2),
      select: parameters.search.funct(),
      delay: 500
    });
    //bind search functionality to the search box
    $("#search")
      .on("keyup", function() { parameters.search.funct(); })
      .on('autocompleteclose', function () { parameters.search.funct(); });
  }

  /*Fixed elements*/
  $(function() {
    fixedScroller($("#anchor"), $("#selector"))
  });

  function fixedScroller(anchor, fixedElement) {
    var move = function() {
        var st = $(window).scrollTop();
        var ot = anchor.offset().top;
        if(st > ot) {
            $(fixedElement).addClass("fixed");
        } else {
            if(st <= ot) {
                $(fixedElement).removeClass("fixed");
            }
        }
    };
    $(window).scroll(move);
    move();
  }
}