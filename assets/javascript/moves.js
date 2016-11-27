$( document ).ready( function() {
  //Delete all types without moves - needed for empty json keys
  $.each(moves, function(key) {
    if ( Object.keys(moves[key]).length == 0 ) { delete moves[key]; }
  });

  /*Fixed elements*/
  Menu({
    model: moves,
    title: "Moves",
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
    $(".nav-icon-menu ul").append(
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
        return $(a[0]).find(".move-name").text() > $(b[0]).find(".move-name").text() ? 1 : -1;
      } 
      else if ( input == "Power") 
      {
        return parseInt($(a[0]).find(".move-power").text()) < parseInt($(b[0]).find(".move-power").text()) ? 1 : -1;
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
    var prevType = "";
    $(".move-name").each( function() { 
        var moveName = $(this).text().replace(/ /g, '_');
        if (moveName.toLowerCase().indexOf(input)!=-1) {
          var type = $(this).parent().parent().parent().prop("id").replace("accordion", "");
          
          $("#header_"+moveName).show();
          if ( prevType != type ) { $("#content_"+moveName).show(); } 
          else { $("#content_"+moveName).hide(); }

          prevType = type;
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
          "<div class='flex block-header twelve columns' id='category_"+type+"'>"+
          "<span class='left one column'><img class='icon' src= 'assets/images/type_icons/"+type+".png' /></span>"+
          "<span class='header ten columns'><h4>"+type+"</h5></span>"+
          "<span class='right one column'><img class='icon' src= 'assets/images/type_icons/"+type+".png' /></span>"+
         "</div>");

      var accordion = $("<div id='accordion"+type+"' class='twelve columns'></div>");
      $.each(moveList, function(moveName, move) 
      {
        moveName = moveName.replace(/ /g, '_');
        var flavor = typeof move.flavor !== "undefined" ? move.flavor : "No text!";
        var power = typeof move.power !== "undefined" ? move.power : "0";
        var style = typeof move.style !== "undefined" ? move.style : "Any";
        
        //Create header div for accordion
        var header = $("<div class='move-header twelve columns "+ type.toLowerCase() +"' id='header_"+moveName+"'></div>");
        header.append("<span class='one-half column'><img class='icon' src= 'assets/images/type_icons/"+type+".png' /></span>");
        header.append("<span class='three columns'><span class='label move-name'>"+moveName.replace(/_/g, ' ')+"</span><span> - "+style+"</span>");
        header.append("<span class='fancy eight columns'>" + flavor +"</span>");
        header.append("<span class='right label one-half columns move-power'>" + power + "</span>");
        accordion.append(header);
       
        //Create content div for accordion
        var content = $("<div class='move-content twelve columns' id='content_"+moveName+"'></div>");
        var effect = typeof move.effect !== "undefined" ? move.effect : "No effect";
        var critical = typeof move.critical !== "undefined" ? move.critical : "";
        var outofbattle = typeof move.out_of_battle !== "undefined" ? move.out_of_battle : "";

        content.append("<p><span class='label'> Value : </span><img class='icon' src='assets/images/pokedollar.png' alt='dollar'/>" + Math.pow(power,2) + "</p>");
        content.append("<p><span class='label'> Effect : </span>" + effect + "</p>");
        if (critical != "") { content.append("<p><span class='label'> Critical : </span>" + critical + "</p>"); }
        if (outofbattle != "") { content.append("<p><span class='label'> Out Of Battle : </span>" + outofbattle + "</p>"); }
        accordion.append(content);

      });

      $("#moveList").append(accordion);
      accordion
        .accordion({
          header: ".move-header",
          heightStyle: ""
        });
  });
}