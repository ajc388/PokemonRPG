$( document ).ready( function() {
  //Delete all types without moves - needed for empty json keys
  $.each(moves, function(key) {
    if ( Object.keys(moves[key]).length == 0 ) { delete moves[key]; }
  });

  /*Fixed elements*/
  Menu({
    model: moves,
    title: "Moves Library",
    search: 
    { 
      tags: function() 
      {
        var tags = [];
        $.each(moves, function(key, moveList) {
          $.each(moveList, function(moveName) {
            tags.push(moveName.replace(/_/g, " "));
          });
        });
        return tags;
      },
      funct: search 
    },
    sort: 
    {
      keys: ['Name', 'Power'],
      funct: sort
    },
    navmenu:
    {
      funct: typeIconNavMenu
    }
  });

  //Displays a group of accordions for every pokemon type
  displayMoves(moves);

  sort();
});

function typeIconNavMenu(moves)
{
  $.each(moves, function(type) {
    /*SCROLL FUNCTIONALITY*/
    $(".navIconMenu ul").append(
              "<li><a id='link_"+type+"'>"+
              "<img class='icon' src='assets/images/type_icons/"+type+".png' />"+
              "</a></li>");

    $("#link_"+type).click(function() {
      $('html, body').animate({
          scrollTop: $("#category_"+type).offset().top - $("#menu").css("height").replace("px", "")
      }, 1500 );
    });
  });
}

function sort()
{
  var input = $("#sort").val();  
  $.each(moves, function(type) {
    var accordion = $("#accordion"+type);
    var entries = accordion.children('div');

    //Maps the two accordion DOM elemnets to an array
    var map = $.map(entries, function(item, i) {
      return i%2 == 0 ? [[$(item), $(item).next()]]: null;
    });
    
    //Sort the accordions by move name
    var sort = map.sort(function (a, b) {
      if ( input == "Name" ) 
      {
        return $(a[0]).find(".moveName").text() > $(b[0]).find(".moveName").text() ? 1 : -1;
      } 
      else if ( input == "Power") 
      {
        return parseInt($(a[0]).find(".movePower").text()) < parseInt($(b[0]).find(".movePower").text()) ? 1 : -1;
      }
    });
  
    //reattach the accordions
    $.each(sort, function(key, item) {
      accordion.append(item[0]);
      accordion.append(item[1]);
    });
  });
}

function search()
{
    var input = $("#search").val().toLowerCase().replace(/ /g, '_');
    var prevKey = "";
    $(".moveName").each( function() { 
        var moveName = $(this).text().replace(/ /g, '_');
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

function displayMoves(moves)
{
   $.each(moves, function (type, moveList) 
   {
      $("#moveList").append(
          "<div class='blockheader typeheader "+type.toLowerCase()+"' id='category_"+type+"'>"+
          "<span>"+
          "<img class='icon' src= 'assets/images/type_icons/"+type+".png' />"+
          "<span>"+type+"</span>"+
          "<img class='icon' src= 'assets/images/type_icons/"+type+".png' />"+
          "</span>"+
         "</div>");

      var accordion = $("<div id='accordion"+type+"'></div>");
      $.each(moveList, function(moveName, move) 
      {
        moveName = moveName.replace(/ /g, '_');
        var flavor = typeof move.flavor !== "undefined" ? move.flavor : "No text!";
        var power = typeof move.power !== "undefined" ? move.power : "0";

        //Create header div for accordion
        var header = $("<div class='moveHeader "+ type.toLowerCase() +"' id='header_"+moveName+"'></div>");
        header.append("<img class='icon' id='img_icon_"+moveName+"' src= 'assets/images/type_icons/"+type+".png' ></img>");
        header.append("<span class='moveName'>"+moveName.replace(/_/g, ' ')+"</span>");
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

        content.append("<p><span class='descriptiveHeader'> Value: </span><img src='assets/images/pokedollar.png'/>" + Math.pow(power,2) + "</p>");
        content.append("<p><span class='descriptiveHeader'> Style: </span>" + style + "</p>");
        content.append("<p><span class='descriptiveHeader'> Effect: </span>" + effect + "</p>");
        if (critical != "") { content.append("<p><span class='descriptiveHeader'> Critical: </span>" + critical + "</p>"); }
        if (outofbattle != "") { content.append("<p><span class='descriptiveHeader'> Out Of Battle: </span>" + outofbattle + "</p>"); }
        accordion.append(content);
      });

      $("#moveList").append(accordion);
      accordion.accordion({heightStyle: ""});
  });
}