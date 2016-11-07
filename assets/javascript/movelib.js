  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);
      
      //Delete all types without moves - needed for empty json keys
      $.each(moves, function(key) {
        if ( Object.keys(moves[key]).length == 0 ) { delete moves[key]; }
      });

      //MOVE THIS TO CSS these values don't change dynamically
      //Create color map for UI
      //First color is dark, second color is light
      var colorMap = new Map();
      colorMap.set("Fire", ["#9C531F", "#F08030"]); 
      colorMap.set("Electric", ["#A1871F", "#F8D030"]); 
      colorMap.set("Normal", ["#6D6D4E", "#A8A878"]);

      //Displays a group of accordions for every pokemon type
      $.each(moves, function (type, value) {
        $("#moveList").append(
            "<div class='blockheader'>"+
              "<button id='sort_name_"+type+"' class='sort_button ui-button ui-widget ui-corner-all'>Sort By Name</button>"+
              "<span style='display: inline-block; width: 80%;'>"+type+"</span>"+
              "<button id='sort_power_"+type+"' class='sort_button ui-button ui-widget ui-corner-all'>Sort By Power</button>"+
             "</div>"
            );
        $(".sort_button").css({
          display: 'inline-block',
          width: '120px',
          backgroundColor: 'darkslateblue',
          color: 'white'
        });

        displayMoves(type, moves[type], colorMap);

        //bind sort functionality to buttons
        $("#sort_name_"+type).on('click', function() { sortByName(type); });
        $("#sort_power_"+type).on('click', function() { sortByValue(type); });

        //Sort by name by default
        sortByName(type); 
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

    function sortByName(type)
    {
        var accordion = $("#accordion"+type);
        var entries = accordion.children('div');

        //Maps the two accordion DOM elemnets to an array
        var map = $.map(entries, function(item, i) {
          return i%2 == 0 ? [[$(item), $(item).next()]]: null;
        });

        //Sort the accordions by move name
        var sort = map.sort(function (a, b) {
          return $(a[0]).find(".moveName").text() > $(b[0]).find(".moveName").text() ? 1 : -1;
        });

        //reattach the accordions
        $.each(sort, function(key, item) {
          accordion.append(item[0]);
          accordion.append(item[1]);
        });
    }

    function sortByValue(type)
    {
        var accordion = $("#accordion"+type);
        var entries = accordion.children('div');

        //Maps the two accordion DOM elemnets to an array
        var map = $.map(entries, function(item, i) {
          return i%2 == 0 ? [[$(item), $(item).next()]]: null;
        });

        var sort = map.sort(function (a, b) {
          return parseInt($(a[0]).find(".moveValue").text()) < parseInt($(b[0]).find(".moveValue").text()) ? 1 : -1;
        });

        console.log(sort);

        $.each(sort, function(key, item) {
          accordion.append(item[0]);
          accordion.append(item[1]);
        });
    }

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
        var accordion = $("<div id='accordion"+type+"'></div>");
        for (var moveName in moveList)
        {
          var move = moveList[moveName];
          if ( move )
          {
            //Create header div for accordion
            accordion.append("<div class='moveHeader' id='header_"+moveName+"'>"+
                                       "<img class='icon' id='img_icon_"+moveName+"'"+ 
                                       "src= 'assets/images/type_icons/"+type+".png' ></img>"+
                                       "<span class='moveName'>"+moveName.replace('_', ' ')+"</span>"+
                                       "<span class='moveDice' id='img_dice_"+moveName+"'></span>"+
                                       "<span class='moveFlavor'>" + move.flavor +"</span>"+ 
                                       "<span class='moveValue'>" + Math.pow(move.power,2) + "</span></div>");
            //Create dice icons - displayed after name inside the dice span tag
            for ( var i = 1; i < Math.round(move.power/30, 0)+1; i++ )
            {
              accordion.find("#img_dice_"+moveName).append("<img class='icon' src='assets/images/dice_icons/die_"+i+".png'/>");
            }

            //Create content div for accordion
            accordion
            .append("<div class='moveContent' id='content_"+moveName+"'>"+
                    "<p><span class='descriptiveHeader'> Power: </span>" + move.power + "</p>" +
                    "<p><span class='descriptiveHeader'> Style: </span>" + move.style + "</p>" +
                    "<p><span class='descriptiveHeader'> Effect: </span>" + move.effect + "</p>"+
                    "<p><span class='descriptiveHeader'> Critical: </span>" + move.critical + "</p>"+
                    "</div>");
            
            //Set colors from colormap
            accordion.find("#header_"+moveName).css('background-color', colorMap.get(type)[0] );
            accordion.find("#content_"+moveName).css('background-color', colorMap.get(type)[1] );
          }
        }

        $("#moveList").append(accordion);
        accordion.accordion();
      }
      else 
      {
        $("#moveList").append("<p>No results!?!?!</p>");
      }
    }