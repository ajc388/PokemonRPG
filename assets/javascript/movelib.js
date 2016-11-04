  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);

      //Create auto complete feature for search bar
      $("#search").autocomplete({
        source: loadSearchTags()
      });

      //print moves
      $.each(moves, function (key, value) {
        $("#moveList").append("<div class='blockheader'><h3>"+key+"</h3>");
        var moveArray = $.map(moves[key], function(el) { return el});;
        displayMoves(key, moveArray);
      });

      //bind search functionality to the search box on key press
      $("#search").on("keyup", function() { search(); });

      //bind search functionality to search box on enter
      $("#search").on("keypress", function (e) {
        //Enter key
        if (e.keyCode === 13) { search(); }
      });  

    });

    function search()
    {
        var input = $("#search").val().toLowerCase();
        $(".moveName").each( function() { 
            var moveName = $(this).text();
            console.log(moveName);
            if (moveName.toLowerCase().indexOf(input)!=-1) { 
              console.log($("#header_"+moveName));
              $("#header_"+moveName).show(); 
              $("#content_"+moveName).show(); 
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

    function displayMoves(key, moveList)
    {
      if (moveList.length > 0)
      {
        $("#moveList").append("<div id='accordion"+key+"'>");
        for (var i = 0; i < moveList.length; i++)
        {
          var move = moveList[i];
          if ( move )
          {
            $("#accordion"+key).append("<div class='moveHeader' id='header_"+move.name+"'><span class='moveName'>"+move.name+
                                       "</span> <span class='moveFlavor'>" + move.flavor + 
                                       "</span> <span class='movePower'>" + move.power + "</span></div>");
            $("#accordion"+key)
            .append("<div class='moveContent' id='content_"+move.name+"'>"+
                    "<p><span class='descriptiveHeader'> Style: </span>" + move.style + "</p>" +
                    "<p><span class='descriptiveHeader'> Effect: </span>" + move.effect + "</p>"+
                    "<p><span class='descriptiveHeader'> Critical: </span>" + move.critical + "</p>"+
                    "</div></div>");
          }
        }
        $("#accordion"+key).accordion();
      }
      else 
      {
        $("#moveList").append("<p>No results!</p>");
      }
    }