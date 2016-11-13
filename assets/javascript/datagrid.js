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
        '<div id="selector" class="blockheader">'+
          '<span >'+title+'</span>'+
        '</div>'+
        '<div id="grid"></div>');

    if ( sortFlag )
    {
      $("#selector").append(
        '<span class="sort">'+
          '<label for="sort">Sort: </label>'+
          '<select class="input" id="sort"></select>'+
        '</span>');

      //is there a better way to do this?!
      $("#sort").append("<option value='Name'>Name</option>");
      $.each(model[Object.keys(model)[0]], function (key) {
        $("#sort").append(
          $("<option></option>").val(key).html(key)
        );
      });

      $("#sort").on("change", function() { sort(); });

      //default sorting
      sort();
    }

    //Build dom elements
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
        minLength: Object.keys(model)/100,
        select: search($(".name")),
        delay: 500
      });
      //bind search functionality to the search box
      $("#search")
        .on("keyup", function() { search($(".name")); })
        .on('autocompleteclose', function () { search($(".name")); });
    }
    
    displayTable(model, $("#grid"));

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
      rows.detach().appendTo($("#grid"));
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
        var table = $("<table class='dataGrid'></table>");
        if ( headerFlag )
        {
          var row = $("<tr class='dataRow'></tr>");
          row.append("<th class='dataHeader'>Name</th>");
          $.each(data[Object.keys(data)[0]], function(key) {
            row.append("<th class='dataHeader'>"+ key +"</th>");
          });
          table.append(row);
        }
        $.each(data, function(key) {
          var row = $("<tr class='dataRow'></tr>");
          row.append("<td class='dataValue Name'>"+key+"</td>");
          
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