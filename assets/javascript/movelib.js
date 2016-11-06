  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);
      
      //Delete all types without moves - needed for empty json keys
      $.each(moves, function(key) {
        if ( Object.keys(moves[key]).length == 0 ) { delete moves[key]; }
      });

      //Display moves
      $.each(moves, function (type, value) {
        $("#moveList").append("<div class='blockheader'><h3>"+type+"</h3></div>");
        //var moveArray = $.map(moves[key], function(el) { return el});;
        displayMoves(type, moves[type]);
      });

      /*Search Functionality*/
      //Create auto complete feature for search bar
      $("#search").autocomplete({
        source: loadSearchTags(),
        minLength: 0,
        select: search(),
        delay: 500
      });
      //bind search functionality to the search box
      $("#search")
        .on("keyup", function() { search(); })
        .on('autocompleteclose', function () {  search(); });

    });

    function search()
    {
        var input = $("#search").val().toLowerCase();
        var prevKey = "";
        $(".moveName").each( function() { 
            var moveName = $(this).text().replace(' ', '_');
            if (moveName.toLowerCase().indexOf(input)!=-1) {
              var key = $(this).parent().parent().prop("id").replace("accordion", "");
            
              $("#header_"+moveName).show();
              if ( prevKey != key ) { $("#content_"+moveName).show(); } 
              else { $("#content_"+moveName).hide(); }

              prevKey = key;
            }
            else { 
              $("#header_"+moveName).hide(); 
              $("#content_"+moveName).hide(); 
            }
        });
    }

    function loadSearchTags()
    {
      var tags = [];
      $.each(moves, function(key, value) {
        $.each(moves[key], function(key, value) {
          tags.push(key);
        });
      });
      return tags;
    }

    function displayMoves(type, moveList)
    {
      console.log(moveList);
      if (Object.keys(moveList).length > 0)
      {
        $("#moveList").append("<div id='accordion"+type+"'>");
        
        for (var prop in moveList)
        {
          var move = moveList[prop];

          if ( move )
          {
            $("#accordion"+type).append("<div class='moveHeader' id='header_"+prop+"'><span class='moveName'>"+prop.replace('_', ' ')+
                                       "</span> <span class='moveFlavor'>" + move.flavor + 
                                       "</span> <span class='movePower'>" + move.power + "</span></div>");
            $("#accordion"+type)
            .append("<div class='moveContent' id='content_"+prop+"'>"+
                    "<p><span class='descriptiveHeader'> Style: </span>" + move.style + "</p>" +
                    "<p><span class='descriptiveHeader'> Effect: </span>" + move.effect + "</p>"+
                    "<p><span class='descriptiveHeader'> Critical: </span>" + move.critical + "</p>"+
                    "</div></div>");
          }
        }
        $("#accordion"+type).accordion();
      }
      else 
      {
        $("#moveList").append("<p>No results!?!?!</p>");
      }
    }