$( document ).ready( function() {
  console.log(moves);
  
  //Extracting key name from url
  var pokemonName = location.search.substring(location.search.indexOf('=')+1);
  var selectedPokemon = pokemon[pokemonName];
  
  displayLabels(selectedPokemon, pokemonName);
  displayHP(selectedPokemon);
  displayFP(selectedPokemon);
  displayAttributes(selectedPokemon);
  displayPokemon(selectedPokemon, pokemonName);
  //displayCounters(selectedPokemon);
  displayDashRange(selectedPokemon);

  displayMoves(selectedPokemon, moves);
});

function displayLabels(pokemon, name) 
{
  var shiny = typeof pokemon.Shiny !== "undefined" && pokemon.Shiny ? "Shiny" : "";
  var legend = typeof pokemon.Legendary !== "undefined" && pokemon.Legendary ? "Legend" : "";
  
  $("#shiny").html(shiny);
  $("#name").html(name);
  $("#legend").html(legend);
}

function displayHP(pokemon)
{
  var ivStrength = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Strength !== "undefined" ? pokemon.Attributes.IV.Strength : 0;
  var evStrength = typeof pokemon.Attributes.EV !== "undefined" && typeof pokemon.Attributes.EV.Strength !== "undefined" ? pokemon.Attributes.EV.Strength : 0;
  var ivMind = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Mind !== "undefined" ? pokemon.Attributes.IV.Mind : 0;
  var evMind = typeof pokemon.Attributes.EV !== "undefined" && typeof pokemon.Attributes.EV.Mind !== "undefined" ? pokemon.Attributes.EV.Mind : 0;
  var hp = (ivStrength + evStrength)*2 + ivMind + evMind;
  
  $("#hpBar").append("<span class='actual'>"+displayBoxes(0, hp)+"</span>");
  $("#hpBar").append("<span class='potential'>"+displayBoxes(hp, 36)+"</span>");
}

function displayFP(pokemon)
{
  var ivMind = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Mind !== "undefined" ? pokemon.Attributes.IV.Mind : 0;
  var evMind = typeof pokemon.Attributes.EV !== "undefined" && typeof pokemon.Attributes.EV.Mind !== "undefined" ? pokemon.Attributes.EV.Mind : 0;
  var fp = ivMind + evMind;

  $("#fpBar").append("<span class='actual'>"+displayBoxes(0, fp)+"</span>");
  $("#fpBar").append("<span class='potential'>"+displayBoxes(fp, 12)+"</span>");
}

function displayBoxes(prev, limit)
{
  for (var i = prev, str = ""; i < limit; i++) { 
    if (i%6 == 0 ) { str += " "; }
    str += "□"; 
  }
  return str;
}

function displayCounters(pokemon) 
{
  var primaryType = pokemon.Types !== "undefined" && pokemon.Types.length > 0 ? pokemon.Types[0] : "None";
  var secondaryType = pokemon.Types !== "undefined" && pokemon.Types.length == 2 ? pokemon.Types[1] : "None";
  //var counters = 

}

function displayDashRange(pokemon)
{
  var ivSpeed = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Speed !== "undefined" ? pokemon.Attributes.IV.Speed : 0;
  var ivSense = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Sense !== "undefined" ? pokemon.Attributes.IV.Sense : 0;
  
  var dash = ivSpeed;
  var range = ivSense+1;

  $("#dash").html(dash);
  $("#range").html(range);
}

function displayPokemon(pokemon, pokemonName)
{
  var primaryType = pokemon.Types !== "undefined" && pokemon.Types.length > 0 ? pokemon.Types[0] : "null";
  $("#pokemon").addClass("border").addClass(primaryType.toLowerCase() + "border");
  
  $("#pokemon").append("<span class='twelve columns'>" +
    "<h5>"+
    "<span id='gender' class='offset-by-one one column'></span>"+
    "<span id='eggGroups' class='ten columns'></span>"+
    "</h5>"+
    "</span>"+
    "<span class='offset-by-four columns'><img class='five columns' src='assets/images/pokemon/"+pokemonName+".png'></span>"+
    "</span>");
  
  displayGender(pokemon);
  displayEggGroups(pokemon);
}

function displayGender(pokemon)
{
  var male = pokemon.Gender !== "undefined" && pokemon.Gender.Male_Weight !== "undefined" ? pokemon.Gender.Male_Weight : 50;
  var female = pokemon.Gender !== "undefined" && pokemon.Gender.Female_Weight !== "undefined" ? pokemon.Gender.Female_Weight : 50;
  var other = pokemon.Gender !== "undefined" && pokemon.Gender.Other_Weight !== "undefined" ? pokemon.Gender.Other_Weight : 0;

  var rand = Math.random() * (male+female+other);
  if ( rand <= male ) { $("#gender").append("<img class='icon' style='vertical-align: middle;' src='assets/images/gender_icons/male.png' alt='male'/>");}
  else if ( rand <= male+female ) { $("#gender").append("<img class='icon' style='vertical-align: middle;' src='assets/images/gender_icons/female.png' alt='female'/>");}
  else if ( rand <= male+female+other ) { $("#gender").append("<img class='icon' style='vertical-align: middle;' src='assets/images/gender_icons/other.png' alt='other'/>");}
}

function displayEggGroups(pokemon)
{
  if ( typeof pokemon.Egg_Groups !== "undefined" )
  { 
    var eggGroups = pokemon.Egg_Groups;
    if ( eggGroups.length == 1 )
    {
      $("#eggGroups").append("<span class='center twelve columns'>"+ eggGroups[0] +"</span>");
    }
    else if ( eggGroups.length == 2)
    {
      $("#eggGroups").append("<span class='center six columns'>"+ eggGroups[0] +"</span>");
      $("#eggGroups").append("<span class='center six columns'>"+ eggGroups[1] +"</span>"); 
    }
  } 
  else 
  {
     $("#eggGroups").append("<span class='center twelve columns'> None </span>");
  }
  
}

function displayAttributes(pokemon) 
{
  var ivSpeed = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Speed !== "undefined" ? pokemon.Attributes.IV.Speed : 0;
  var ivStrength = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Strength !== "undefined" ? pokemon.Attributes.IV.Strength : 0;
  var ivSense = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Sense !== "undefined" ? pokemon.Attributes.IV.Sense : 0;
  var ivMind = typeof pokemon.Attributes.IV !== "undefined" && typeof pokemon.Attributes.IV.Mind !== "undefined" ? pokemon.Attributes.IV.Mind : 0;
  
  var evSpeed = typeof pokemon.Attributes.EV !== "undefined" && typeof pokemon.Attributes.EV.Speed !== "undefined" ? pokemon.Attributes.EV.Strength : 0;
  var evStrength = typeof pokemon.Attributes.EV !== "undefined" && typeof pokemon.Attributes.EV.Strength !== "undefined" ? pokemon.Attributes.EV.Strength : 0;
  var evSense = typeof pokemon.Attributes.EV !== "undefined" && typeof pokemon.Attributes.EV.Sense !== "undefined" ? pokemon.Attributes.EV.Strength : 0;
  var evMind = typeof pokemon.Attributes.EV !== "undefined" && typeof pokemon.Attributes.EV.Mind !== "undefined" ? pokemon.Attributes.EV.Mind : 0;

  displayAttributeIV($("#iv_speed"), ivSpeed );
  displayAttributeIV($("#iv_strength"), ivStrength );
  displayAttributeIV($("#iv_sense"), ivSense );
  displayAttributeIV($("#iv_mind"), ivMind );

  displayAttributeEV($("#ev_speed"), evSpeed );
  displayAttributeEV($("#ev_strength"), evStrength );
  displayAttributeEV($("#ev_sense"), evSense );
  displayAttributeEV($("#ev_mind"), evMind );
}

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

function displayMoves(pokemon, moves)
{ 
   var pokemonMoves = typeof pokemon.Moves !== "undefined" && typeof pokemon.Moves.Learnable !== "undefined" ? pokemon.Moves.Learnable : [];
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
        header.append("<span class='three columns'><span class='label'>"+moveName.replace(/_/g, ' ')+"</span><span> - "+style+"</span>");
        header.append("<span class='eight columns'>" + flavor +"</span>");
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