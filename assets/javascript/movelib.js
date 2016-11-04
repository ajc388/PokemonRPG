  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);
      
      //Display moves
      $.each(moves, function (key, value) {
        $("#moveList").append("<div class='blockheader'><h3>"+key+"</h3>");
        var moveArray = $.map(moves[key], function(el) { return el});;
        displayMoves(key, moveArray);
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
        .on('autocompleteclose', function () {  search(); })
        .on('change', function() { search(); })
        .on('blur', function() { alert("made it"); search(); });

    });

    function search()
    {
        //alert("search");
        var input = $("#search").val().toLowerCase();
        $(".moveName").each( function() { 
            var moveName = $(this).text();
            if (moveName.toLowerCase().indexOf(input)!=-1) { $("#header_"+moveName).show(); }
            else { $("#header_"+moveName).hide(); }
            $("#content_"+moveName).hide(); 
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