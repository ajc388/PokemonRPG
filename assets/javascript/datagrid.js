/*Abstracted data grid with search functionality*/
function DataGrid(parameters) 
{ 
    //Load in parameters
    if ( parameters.model == {} ) { return; }  
    var model = parameters.model;
    var searchFlag = typeof parameters.searchFlag == "undefined" ? true : false;
    var sortFlag = typeof parameters.sortFlag == "undefined" ? true : false;
    var title = typeof parameters.title == "undefined" ? "Data Grid" : parameters.title;
    var suppress = typeof parameters.suppressCols == "undefined" ? [] : parameters.suppressCols;
    var headerFlag = typeof parameters.headerFlag == "undefined" ? true : parameters.headerFlag;
    
    //construct menu items
    $("#datagrid").append(
        '<div id="anchor"></div>'+
        '<div id="selector" class="block-header twelve columns">'+
          '<span id="title" class="header six columns"><h4>'+title+'</h4></span>'+
        '</div>'+
        '<div id="grid" class="twelve columns"></div>');

    if ( sortFlag )
    {
      $("#selector").append(
        '<span class="shift three columns">'+
          '<h5><label class="header offset-by-one five columns" for="sort">Sort</label>'+
          '<select class="input right offset-by-one five columns" id="sort"></select></h5>'+
        '</span>');

      //is there a better way to do this?!
      $("#sort").append("<option value='Name'>Name</option>");
      $.each(model[Object.keys(model)[0]], function (key) {
        $("#sort").append(
          $("<option></option>").val(key).html(key)
        );
      });

      $("#sort").on("change", function() { sort(); });
    } 
    //Build dom elements
    if ( searchFlag ) 
    {
      //Add search bar in
      $("#selector").append(
          '<span id="searchBar" class="shift three columns">'+
            '<h5><label class="header offset-by-one five columns" for="search">Search</label>'+
            '<input class="input right offset-by-one five columns" id="search" type="search"></input></h5>'+
          '</span>');

      /*Search Functionality*/
      //Create auto complete feature for search bar
      $("#search").autocomplete({
        source: loadSearchTags(model),
        minLength: Math.max(Object.keys(model).length/100, 2),
        select: search($(".name")),
        delay: 500
      });
      //bind search functionality to the search box
      $("#search")
        .on("keyup", function() { search($(".name")); })
        .on('autocompleteclose', function () { search($(".name")); });
    }
    
    displayTable(model, $("#grid"));

    //default sorting
    sort();
    
    /*Fixed elements*/
    $(function() {
      fixedScroller($("#anchor"), $("#selector"))
    });

    //FUNCTIONS
    function sort() {
      var rows = $(".dataRow");
      var col = $("#sort").val();
      rows = rows.sort(function (a, b) {
        if ( $.type($(a).find("."+col).text()) === "number") { 
          return parseInt($(a).find("."+col).text()) > parseInt($(b).find("."+col).text()) ? 1 : -1; 
        }
        else if ( $.type($(a).find("."+col).text()) === "string" ) { 
          return $(a).find("."+col).text() > $(b).find("."+col).text() ? 1 : -1; 
        }
      });
      rows.detach().appendTo($("#dataGrid"));
    }

    function search(criteria)
    { 
        var input = $("#search").val().toLowerCase();
        $(criteria).each(function() { 
            var name = $(this).text().replace(' ', '_');
            if (name.toLowerCase().indexOf(input)!=-1) {
              $(this).parent().show(); //should be a table row
            }
            else { 
              $(this).parent().hide(); //should be a table row
            }
        });
    }
    
    function loadSearchTags(model)
    {
      var tags = [];
      $.each(model, function(key, value) {
        tags.push(key);
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

    function displayTable(data, root)
    {
      if (Object.keys(data).length > 0)
      {
        var table = $("<table id='dataGrid' class='dataGrid twelve columns'></table>");
        if ( headerFlag )
        {
          var row = $("<tr class='dataRowHeader'></tr>");
          row.append("<th class='header'><h6>Name</h6></th>");
          $.each(data[Object.keys(data)[0]], function(key) {
            row.append("<th class='dataHeader'>"+ key +"</th>");
          });
          table.append(row);
        }
        $.each(data, function(key) {
          var row = $("<tr class='dataRow'></tr>");
          row.append("<td class='dataValue Name'>"+key.replace("_", " ")+"</td>");
          
          $.each(data[key], function(att, val) {
              row.append("<td class='dataValue "+att+"'>"+val+"</td>");    
          });
          table.append(row);
        });
        root.append(table); 
      }
      else 
      {
        root.append("<p>No results!?!?!</p>");
      }
    }
}