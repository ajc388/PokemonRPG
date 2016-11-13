  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);
      
      //Delete all types without moves - needed for empty json keys
      $.each(moves, function(key) {
        if ( Object.keys(moves[key]).length == 0 ) { delete moves[key]; }
      });

      /*Fixed elements*/
      $(function() {
        fixedScroller($("#anchor"), $("#moves"))
      });

      //Displays a group of accordions for every pokemon type
      $.each(moves, function (type, value) {
        $("#moveList").append(
              "<div class='blockheader typeheader "+type.toLowerCase()+"' id='category_"+type+"'>"+
              "<button id='sort_name_"+type+"' class='button ui-button ui-widget ui-corner-all'>Sort By Name</button>"+
              "<span>"+
              "<img class='icon' src= 'assets/images/type_icons/"+type+".png' />"+
              "<span>"+type+"</span>"+
              "<img class='icon' src= 'assets/images/type_icons/"+type+".png' />"+
              "</span>"+
              "<button id='sort_power_"+type+"' class='button ui-button ui-widget ui-corner-all'>Sort By Power</button>"+
             "</div>"
            );

        displayMoves(type, moves[type]);

        //bind sort functionality to buttons
        $("#sort_name_"+type).on('click', function() { sortByName(type); });
        $("#sort_power_"+type).on('click', function() { sortByPower(type); });

        //Sort by name by default
        sortByName(type); 

        /*SCROLL FUNCTIONALITY*/

        $(".navIconMenu ul").append(
                  "<li><a id='link_"+type+"'>"+
                  "<img class='icon' src='assets/images/type_icons/"+type+".png' />"+
                  "</a></li>");

          $("#link_"+type).click(function() {
            $('html, body').animate({
                scrollTop: $("#category_"+type).offset().top - $("#moves").css("height").replace("px", "")
            }, 1000 );
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
    });

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

    function sortByPower(type)
    {
        var accordion = $("#accordion"+type);
        var entries = accordion.children('div');

        //Maps the two accordion DOM elemnets to an array
        var map = $.map(entries, function(item, i) {
          return i%2 == 0 ? [[$(item), $(item).next()]]: null;
        });

        var sort = map.sort(function (a, b) {
          return parseInt($(a[0]).find(".movePower").text()) < parseInt($(b[0]).find(".movePower").text()) ? 1 : -1;
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

    function displayMoves(type, moveList)
    {
      if (Object.keys(moveList).length > 0)
      {
        var accordion = $("<div id='accordion"+type+"'></div>");
        for (var moveName in moveList)
        {
          var move = moveList[moveName];
          if ( move )
          {
            var flavor = typeof move.flavor !== "undefined" ? move.flavor : "No text!";
            var power = typeof move.power !== "undefined" ? move.power : "0";

            //Create header div for accordion
            var header = $("<div class='moveHeader "+ type.toLowerCase() +"' id='header_"+moveName+"'>></div>");
            header.append("<img class='icon' id='img_icon_"+moveName+"' src= 'assets/images/type_icons/"+type+".png' ></img>");
            header.append("<span class='moveName'>"+moveName.replace('_', ' ')+"</span>");
            header.append("<span class='moveDice' id='img_dice_"+moveName+"'></span>");
            header.append("<span class='moveFlavor'>" + flavor +"</span>");
            header.append("<span class='movePower'>" + power + "</span>");
            accordion.append(header);
            
            //Create dice icons - displayed after name inside the dice span tag
            for ( var i = 1; i < Math.round(move.power/30, 0)+1; i++ )
            {
              accordion.find("#img_dice_"+moveName).append("<img class='icon' src='assets/images/dice_icons/die_"+i+".png'/>");
            }

            //Create content div for accordion
            var content = $("<div class='moveContent' id='content_"+moveName+"'></div>");
            var style = typeof move.style !== "undefined" ? move.style : "Any";
            var effect = typeof move.effect !== "undefined" ? move.effect : "No effect";
            var critical = typeof move.critical !== "undefined" ? move.critical : "";
            var outofbattle = typeof move.out_of_battle !== "undefined" ? move.out_of_battle : "";

            content.append("<p><span class='descriptiveHeader'> Value: </span><img src='assets/images/pokedollar.png' height='12px' width='15px'/>" + Math.pow(power,2) + "</p>");
            content.append("<p><span class='descriptiveHeader'> Style: </span>" + style + "</p>");
            content.append("<p><span class='descriptiveHeader'> Effect: </span>" + effect + "</p>");
            if (critical != "") { content.append("<p><span class='descriptiveHeader'> Critical: </span>" + critical + "</p>"); }
            if (outofbattle != "") { content.append("<p><span class='descriptiveHeader'> Out Of Battle: </span>" + outofbattle + "</p>"); }
            accordion.append(content);

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