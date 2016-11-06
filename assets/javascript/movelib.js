  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);
      
      //Delete all types without moves - needed for empty json keys
      $.each(moves, function(key) {
        if ( Object.keys(moves[key]).length == 0 ) { delete moves[key]; }
      });

      //Create color map for UI
      //First color is dark, second color is light
      var colorMap = new Map();
      colorMap.set("Fire", ["#9C531F", "#F08030"]); 
      colorMap.set("Electric", ["#A1871F", "#F8D030"]); 
      colorMap.set("Normal", ["#6D6D4E", "#A8A878"]);

      //Display moves
      $.each(moves, function (type, value) {
        $("#moveList").append("<div class='blockheader'><h3>"+type+"</h3></div>");
        //var moveArray = $.map(moves[key], function(el) { return el});;
        displayMoves(type, moves[type], colorMap);
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

    function displayMoves(type, moveList, colorMap)
    {
      if (Object.keys(moveList).length > 0)
      {
        $("#moveList").append("<div id='accordion"+type+"'>");
        for (var moveName in moveList)
        {
          var move = moveList[moveName];
          if ( move )
          {
            //Create header div for accordion
            $("#accordion"+type).append("<div class='moveHeader' id='header_"+moveName+"'>"+
                                       "<img class='icon' id='img_icon_"+moveName+"'"+ 
                                       "src= 'assets/images/type_icons/"+type+".png' ></img>"+
                                       "<span class='moveName'>"+moveName.replace('_', ' ')+"</span>"+
                                       "<span class='moveDice' id='img_dice_"+moveName+"'></span>"+
                                       "<span class='moveFlavor'>" + move.flavor +"</span>"+ 
                                       "<span class='moveValue'>" + Math.pow(move.power,2) + "</span></div>");
            //Create dice icons - displayed after name inside the dice span tag
            for ( var i = 1; i < Math.round(move.power/30, 0)+1; i++ )
            {
              $("#img_dice_"+moveName).append("<img class='icon' src='assets/images/dice_icons/die_"+i+".png'/>");
            }

            //Create content div for accordion
            $("#accordion"+type)
            .append("<div class='moveContent' id='content_"+moveName+"'>"+
                    "<p><span class='descriptiveHeader'> Power: </span>" + move.power + "</p>" +
                    "<p><span class='descriptiveHeader'> Style: </span>" + move.style + "</p>" +
                    "<p><span class='descriptiveHeader'> Effect: </span>" + move.effect + "</p>"+
                    "<p><span class='descriptiveHeader'> Critical: </span>" + move.critical + "</p>"+
                    "</div>");
            
            //Set colors from colormap
            $("#header_"+moveName).css('background-color', colorMap.get(type)[0] );
            $("#content_"+moveName).css('background-color', colorMap.get(type)[1] );
          }
        }
        $("#accordion"+type).accordion();
      }
      else 
      {
        $("#moveList").append("<p>No results!?!?!</p>");
      }
    }