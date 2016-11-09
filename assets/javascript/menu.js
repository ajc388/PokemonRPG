/*Abstracted data grid with search functionality*/
function dataGrid(parameters) 
{ 
    //Load in parameters
    var model = parameters.model;
    var searchCriteria = parameters.model;

    /*Search Functionality*/
    //Create auto complete feature for search bar
    $("#search").autocomplete({
      source: loadSearchTags(model),
      minLength: 2,
      select: search(searchCriteria),
      delay: 500
    });
    //bind search functionality to the search box
    $("#search")
      .on("keyup", function() { search(searchCriteria); })
      .on('autocompleteclose', function () { search(searchCriteria); });
    
    /*Fixed elements*/
    $(function() {
      fixedScroller($("#anchor"), $("#selector"))
    });

    displayTable(model, $("#personalities"));

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
        
        $.each(data, function(key) {
          var row = $("<tr class='dataRow'></tr>");
          row.append("<td class='dataValue name'>"+key+"</td>");
          
          $.each(data[key], function(att, val) {
              row.append("<td class='dataValue "+att+"'>"+val+"</td>");    
          });
          table.append(row);
        });
        root.append(table); 
      }
      else 
      {
        $(root).append("<p>No results!?!?!</p>");
      }
    }
}