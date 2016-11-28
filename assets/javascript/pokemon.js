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
  displayCounters(selectedPokemon, counters);
  displayDashRange(selectedPokemon);
  displayAbility(selectedPokemon, abilities);
  displayEvolution(selectedPokemon);
  displayNature(selectedPokemon, natures);
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

function displayCounters(pokemon, counters) 
{
  var primaryType = pokemon.Types !== "undefined" && pokemon.Types.length > 0 ? pokemon.Types[0] : "None";
  var secondaryType = pokemon.Types !== "undefined" && pokemon.Types.length == 2 ? pokemon.Types[1] : "None";

  var table = $("<table class='twelve columns'></table>");
  var row = $("<tr></tr>");
  //Add header
  row.append("<th class='two columns'></th>");
  if ( pokemon.Types.length == 0 || pokemon.Types.length == 1 )
  {
    row.append("<th class='ten columns'>"+primaryType+"</th>");
  }
  else if ( pokemon.Types.length == 2 )
  {
    row.append("<th class='five columns'>"+primaryType+"</th>");
    row.append("<th class='five columns'>"+secondaryType+"</th>");
  }
  table.append(row);

  //Add table body
  for ( var key in counters[primaryType]) 
  {
    var row = $("<tr></tr>");
    var primaryCounters = primaryType != "None" ? counters[primaryType][key] : [];
    var secondaryCounters = secondaryType != "None" ? counters[secondaryType][key] : [];
    row.append("<td class='label two columns'>"+key+"</td>");
    if ( pokemon.Types.length == 0 || pokemon.Types.length == 1 )
    {
      row.append("<td class='ten columns'>"+displayCounterIcons(primaryCounters)+"</td>");
    } 
    else if ( pokemon.Types.length == 2 ) 
    {
      row.append("<td class='five columns'>"+displayCounterIcons(primaryCounters)+"</td>");
      row.append("<td class='five columns'>"+displayCounterIcons(secondaryCounters)+"</td>");
    }
    table.append(row);
  }
  
  $("#counters").append(table);
}

function displayCounterIcons(counters)
{
  var str = "";
  $.each(counters, function(id, type) {
    str += "<img class='icon two columns' src='assets/images/type_icons/"+type+".png' alt='"+type+"'/>";
  });
  return str;
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

function displayAbility(pokemon, abilities)
{
  var ability = typeof pokemon.Ability !== "undefined" ? abilities[pokemon.Ability]: "None";
  $("#ability").append("<span class='label'>"+pokemon.Ability+": </span>");
  $("#ability").append("<span>"+ability["Description"]+"</span>");
}

function displayEvolution(pokemon)
{
  var evolutionMethod = typeof pokemon.Evolution !== "undefined" && typeof pokemon.Evolution.Method !== "undefined" && pokemon.Evolution.Method != null ? pokemon.Evolution.Method : "Mysterious";
  if ( typeof pokemon.Evolution !== "undefined" && typeof pokemon.Evolution.Next_Evolutions !== "undefined" && pokemon.Evolution.Next_Evolutions != null )
  {
    $("#evolution").html(evolutionMethod);
  } else {
    $("#evolution").html("Final Form");
  }
}

function displayNature(pokemon, natures)
{
  var total = 0;
  $.each(natures, function(name, nature) {
    var weight = nature.Weight;
    total += weight;
  });

  var rand = Math.random()*total;
  var runningTotal = 0;
  var key = "";
  $.each(natures, function(name, nature) {
    var weight = nature.Weight;
    runningTotal += weight;
    if ( rand < runningTotal ) { 
      key = name; 
      return false; //jquery break
    }
  });

  $("#nature").append("<span class='header'>"+key.replace(/_/g, " ")+": </span>");
  $("#nature").append("<span>"+natures[key]["Description"]+"</span>");
}

function displayPokemon(pokemon, pokemonName)
{
  var primaryType = pokemon.Types !== "undefined" && pokemon.Types.length > 0 ? pokemon.Types[0] : "null";
  $("#pokemon").addClass("border").addClass(primaryType.toLowerCase() + "border");
  
  //important to keep the pokemon as a div because of grid changes
  $("#pokemon").append("<span class='twelve columns'>" +
    "<h5>"+
    "<span id='gender'></span>"+
    "<span id='eggGroups' class='header ten columns'></span>"+
    "</h5>"+
    "</span>"+
    "<div class='offset-by-four columns'><img class='pokepic five columns' src='assets/images/pokemon/"+pokemonName+".png'></div>"+
    "</span>");
  
  $("#pokemon").tooltip({
      content: "<div><p>"+ pokemon.Long_Description +"</p></div>",
      open: function(event, ui)
          {
            ui.tooltip.hover(
              function () {
                $(this).fadeTo("slow", 1);
        });
          },
      track: true
    });

  displayGender(pokemon);
  displayEggGroups(pokemon);
}

function displayGender(pokemon)
{
  var male = pokemon.Gender !== "undefined" && pokemon.Gender.Male_Weight !== "undefined" ? pokemon.Gender.Male_Weight : 50;
  var female = pokemon.Gender !== "undefined" && pokemon.Gender.Female_Weight !== "undefined" ? pokemon.Gender.Female_Weight : 50;
  var other = pokemon.Gender !== "undefined" && pokemon.Gender.Other_Weight !== "undefined" ? pokemon.Gender.Other_Weight : 0;

  var rand = Math.random() * (male+female+other);
  if ( rand <= male ) { $("#gender").append("<img class='icon offset-by-one one column' src='assets/images/gender_icons/male.png' alt='male'/>");}
  else if ( rand <= male+female ) { $("#gender").append("<img class='icon offset-by-one one column' src='assets/images/gender_icons/female.png' alt='female'/>");}
  else if ( rand <= male+female+other ) { $("#gender").append("<img class='icon offset-by-one one column' src='assets/images/gender_icons/other.png' alt='other'/>");}
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
        var container = $("<article class='group twelve columns'></div>");

        var header = $("<div class='move-header twelve columns "+ move.type.toLowerCase() +"' id='header_"+moveName+"'></div>");
        header.append("<span class='one-half column'><img class='icon' src= 'assets/images/type_icons/"+move.type+".png' /></span>");
        header.append("<span class='three columns'><span class='label'>"+moveName.replace(/_/g, ' ')+"</span><span> - "+style+"</span>");
        header.append("<span class='eight columns'>" + flavor +"</span>");
        header.append("<span style='text-align: right;' class='label one-half columns'>" + power + "</span>");
        container.append(header);
       
        //Create content div for accordion
        var content = $("<div class='move-content twelve columns' id='content_"+moveName+"'></div>");
        var effect = typeof move.effect !== "undefined" ? move.effect : "No effect";
        var critical = typeof move.critical !== "undefined" ? move.critical : "";
        var outofbattle = typeof move.out_of_battle !== "undefined" ? move.out_of_battle : "";

        content.append("<p><span class='label'> Effect: </span>" + effect + "</p>");
        if (critical != "") { content.append("<p><span class='label'> Critical: </span>" + critical + "</p>"); }
        if (outofbattle != "") { content.append("<p><span class='label'> Out Of Battle: </span>" + outofbattle + "</p>"); }
        container.append(content);

        accordion.append(container);
      }
    });
    $("#moves").append(accordion);
    accordion
      .accordion({
        header: ".move-header",
        heightStyle: ""
      })
      .sortable({
        axis: "y",
        handle: ".move-header",
        stop: function( event, ui ) {
          // IE doesn't register the blur when sorting
          ui.item.children(".move-header").triggerHandler( "focusout" );
          // Refresh accordion to handle new order
          $( this ).accordion( "refresh" );
        }
    });
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