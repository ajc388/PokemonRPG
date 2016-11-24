$( document ).ready( function() {
  console.log(moves);
  
  var pokemonName = location.search.substring(location.search.indexOf('=')+1);
  var selectedPokemon = pokemon[pokemonName];

  //problem should this build entirely from the model dynamically? 
  //allowing new attributes to be added?
  displayAttributeIV($("#iv_speed"), selectedPokemon.Attributes.IV.Speed );
  displayAttributeIV($("#iv_strength"), selectedPokemon.Attributes.IV.Strength );
  displayAttributeIV($("#iv_sense"), selectedPokemon.Attributes.IV.Sense );
  displayAttributeIV($("#iv_mind"), selectedPokemon.Attributes.IV.Mind );

  displayAttributeEV($("#ev_speed"), selectedPokemon.Attributes.EV.Speed );
  displayAttributeEV($("#ev_strength"), selectedPokemon.Attributes.EV.Strength );
  displayAttributeEV($("#ev_sense"), selectedPokemon.Attributes.EV.Sense );
  displayAttributeEV($("#ev_mind"), selectedPokemon.Attributes.EV.Mind );



  displayMoves(moves, ["Spark", "Thunder_Shock", "Squeak", "Tail_Wag", "Growl", "Play_Nice", "Quick_Attack", "Electro_Ball", "Thunder_Wave", "Feint", "Double_Team", "Spark", "Nuzzle", "Shuffle", "Electrolocation", "Thunderbolt", "Discharge", "Agility", "Novelty_Pokemon"]);
});

function displayAttributeEV(element, val)
{
  for ( var i = 0, str =""; i < 6; i++) { 
    str += i < val ? "●" : "○"; 
  }
  element.html(str);
}

function displayAttributeIV(element, val)
{
  for ( var i = 0, str =""; i < 6; i++) { 
    str += i >= 6-val ? "●" : "○"; 
  }
  element.html(str);
}

function displayMoves(moves, pokemonMoves)
{
   var accordion = $("<div id='accordion' class='twelve columns'></div>");
   $.each(pokemonMoves, function(id, pokemonMove) 
   {
      var move = findMove(moves, pokemonMove);
      if (move != null)
      {
        var moveName = pokemonMove.replace(/ /g, '_');
        var flavor = typeof move.flavor !== "undefined" ? move.flavor : "No text!";
        var power = typeof move.power !== "undefined" ? move.power : "0";
        var style = typeof move.style !== "undefined" ? move.style : "Any";
        
        //Create header div for accordion
        var header = $("<div class='moveHeader twelve columns "+ move.type.toLowerCase() +"' id='header_"+moveName+"'></div>");
        header.append("<span class='one-half column'><img class='icon' src= 'assets/images/type_icons/"+move.type+".png' /></span>");
        header.append("<span class='four columns'><span class='label'>"+moveName.replace(/_/g, ' ')+"</span><span> - "+style+"</span>");
        header.append("<span class='seven columns'>" + flavor +"</span>");
        header.append("<span style='text-align: right;' class='label one-half columns'>" + power + "</span>");
        accordion.append(header);

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

function findMove(moves, pokemonMove) 
{
  var move = null;
  $.each(moves, function(type, moveList) {
    if (moveList[pokemonMove])
    {
      move = moveList[pokemonMove];
      move["type"] = type;
      return false;
    } 
  });
  return move;
}