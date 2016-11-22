$( document ).ready( function() {
  console.log(moves);
  displayMoves(moves, ["Spark", "Thunder_Shock", "Squeak", "Tail_Wag", "Growl", "Play_Nice", "Quick_Attack", "Electro_Ball", "Thunder_Wave", "Feint", "Double_Team", "Spark", "Nuzzle", "Shuffle", "Electrolocation", "Thunderbolt", "Discharge", "Agility", "Novelty_Pokemon"]);
});

function displayMoves(moves, pokemonMoves)
{
   var accordion = $("<div id='accordion' class='twelve columns'></div>");
   $.each(pokemonMoves, function(id, pokemonMove) 
   {
      var type = 'Electric';
      var move = moves[type][pokemonMove];
      if (move)
      {
        console.log(move);
        var moveName = pokemonMove.replace(/ /g, '_');
        var flavor = typeof move.flavor !== "undefined" ? move.flavor : "No text!";
        var power = typeof move.power !== "undefined" ? move.power : "0";
        var style = typeof move.style !== "undefined" ? move.style : "Any";
        
        //Create header div for accordion
        var header = $("<div class='moveHeader twelve columns "+ type.toLowerCase() +"' id='header_"+moveName+"'></div>");
        header.append("<span class='one-half column'><img class='icon' id='img_icon_"+moveName+"' src= 'assets/images/type_icons/"+type+".png' /></span>");
        header.append("<span class='four columns'><span class='label'>"+moveName.replace(/_/g, ' ')+"</span><span> - "+style+"</span>");
        //header.append("<span class='moveDice' id='img_dice_"+moveName+"'></span>");
        header.append("<span class='seven columns'>" + flavor +"</span>");
        header.append("<span style='text-align: right;' class='label one-half columns'>" + power + "</span>");
        accordion.append(header);
        
        //Create dice icons - displayed after name inside the dice span tag
        for ( var i = 1; i < Math.round(move.power/30, 0)+1; i++ )
        {
          accordion.find("#img_dice_"+moveName).append("<img class='icon' src='assets/images/dice_icons/die_"+i+".png'/>");
        }

        //Create content div for accordion
        var content = $("<div class='moveContent twelve columns' id='content_"+moveName+"'></div>");
        var effect = typeof move.effect !== "undefined" ? move.effect : "No effect";
        var critical = typeof move.critical !== "undefined" ? move.critical : "";
        var outofbattle = typeof move.out_of_battle !== "undefined" ? move.out_of_battle : "";

        //content.append("<p><span class='descriptiveHeader'> Value: </span><img src='assets/images/pokedollar.png'/>" + Math.pow(power,2) + "</p>");
        content.append("<p><span class='label'> Effect: </span>" + effect + "</p>");
        if (critical != "") { content.append("<p><span class='label'> Critical: </span>" + critical + "</p>"); }
        if (outofbattle != "") { content.append("<p><span class='label'> Out Of Battle: </span>" + outofbattle + "</p>"); }
        accordion.append(content);
      }
    });
    $("#moves").append(accordion);
    accordion.accordion({heightStyle: ""});
}