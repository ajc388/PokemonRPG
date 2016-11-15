function Menu(parameters) 
{
	var model = parameters.model;
  var searchFlag = typeof parameters.search == "undefined" ? false : true;
  var sortFlag = typeof parameters.sort == "undefined" ? false : true;
  var title = typeof parameters.title == "undefined" ? "Menu" : parameters.title;

  //construct menu items
  $("#menu").append(
      '<div id="anchor"></div>'+
      '<div id="selector" class="blockheader">'+
        '<span>'+title+'</span>'+
      '</div>');

  if ( sortFlag )
  {
    $("#selector").append(
      '<span class="sort">'+
        '<label for="sort">Sort: </label>'+
        '<select class="input" id="sort"></select>'+
      '</span>');

    //is there a better way to do this?!
    $.each(parameters.sort.keys, function (key, value) {
      $("#sort").append(
        $("<option></option>").val(value).html(value)
      );
    });

    $("#sort").on("change", function() { parameters.sort.funct(); });
  }

  if ( searchFlag ) 
  {
    //Add search bar in
    $("#selector").append(
        '<span class="search">'+
          '<label for="search">Search: </label>'+
          '<input class="input" id="search" type="search"></input>'+
        '</span>');

    /*Search Functionality*/
    //Create auto complete feature for search bar
    $("#search").autocomplete({
      source: loadSearchTags(model),
      minLength: Math.max(Object.keys(model).length/100, 2),
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
  
  function loadSearchTags(model)
  {
    var tags = [];
    $.each(model, function(key, value) {
      tags.push(key.replace("_", " "));
    });
    return tags;
  }

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