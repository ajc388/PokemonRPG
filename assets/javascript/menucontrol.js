function menu(parameters) 
{
	if ( parameters.model == {} ) { return; }  
	var model = parameters.model;
    var searchFlag = typeof parameters.searchFlag == "undefined" ? true : false;
    var sortFlag = typeof parameters.sort == "undefined" ? false : true;
    var title = typeof parameters.title == "undefined" ? "Data Grid" : parameters.title;
    var suppress = typeof parameters.suppressCols == "undefined" ? [] : parameters.suppressCols;
    var headerFlag = typeof parameters.headerFlag == "undefined" ? true : parameters.headerFlag;

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
      $.each(parmeters.sort.keys, function (key) {
        $("#sort").append(
          $("<option></option>").val(key).html(key)
        );
      });

      $("#sort").on("change", function() { paremeters.sort.func(); });

    }

}

/*
<div id="anchor"></div>
    <div id="moves" class="blockheader">
      <nav class="navIconMenu">
        <ul>
        </ul>
      </nav>
      <span class="sort">
        <label for="sort">Sort: </label>
        <select class="input" id="sort">
          <option value='Name'>Name</option>
          <option value='Power'>Power</option>
        </select>
      </span>
      <span class="search">
        <label for="search">Search: </label>
        <input class="input" id="search" type="search"></input>
      </span>
    </div>
    <div id="moveAccordions"></div>
*/