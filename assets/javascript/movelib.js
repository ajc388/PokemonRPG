  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);

      //print moves
      $.each(moves, function (key, value) {
        $("#moveList").append("<div><h3>"+key+"</h3>");
        var moveArray = $.map(moves[key], function(el) { return el});;
        displayMoves(key, moveArray);
      });
    });

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
            $("#accordion"+key).append("<h3>"+move.name+": " + move.flavor + " " + move.power + "</h3>");
            $("#accordion"+key)
            .append("<div>"+
                    "<p> Style: " + move.style + "</p>" +
                    "<p> Effect: " + move.effect + "</p>"+
                    "<p> Critical: " + move.critical + "</p>"+
                    "</div>");
          }
        }
        $("#accordion"+key).accordion();
      }
      else 
      {
        $("#moveList").append("<p>No results</p>");
      }
    }