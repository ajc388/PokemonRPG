/*Mysterious code goes here*/

$( document ).ready( function() {
	console.log(pokemon);

	//instantiate menu with search and sort
	Menu({
		model: pokemon,
		title: "Pokedex",
		search: 
		{ 
			tags: function() 
	        {
	            var tags = [];
	            $.each(pokemon, function(name) {
	               tags.push(name.replace(/_/g, " "));
	            });
	        	return tags;
	        },
			funct: search 
		},
		sort: 
		{
			keys: ['Name', 'Pokedex_ID', 'Type'],
			funct: sort
		}
	});
	displayPokemon(pokemon);
	sort();
});	

function search()
{ 
    var input = $("#search").val().toLowerCase().replace(/ /g, '_');
    var items = $(".pokemon");
    $.each(items, function() { 
        var name = $(this).find(".Name").text().replace(/ /g, '_');
        if (name.toLowerCase().indexOf(input)!=-1) {
          $(this).show(); //should be a table row
        }
        else { 
          $(this).hide(); //should be a table row
        }
    });
}

//Sort options types, name, pokedex number
function sort()
{
	var selected = $("#sort").val();
	var items = $(".pokemon");
	items = items.sort(function (a, b) {
	  if ( selected === "Pokedex_ID" ) { 
	    return parseInt($(a).find("."+selected).text()) > parseInt($(b).find("."+selected).text()) ? 1 : -1; 
	  }
	  else if ( selected === "Name" ) { 
	    return $(a).find("."+selected).text() > $(b).find("."+selected).text() ? 1 : -1; 
	  }
	  else if ( selected === "Type" ) {
	  	return $(a).find(".icon").attr("alt") > $(b).find(".icon").attr("alt") ? 1 : -1;
	  }
	});
	items.detach().appendTo($("#pokedex"));
}

function displayPokemon(pokemonList)
{
	$.each(pokemonList, function(pokemonName, pokemon) {
		if ( pokemon.Types.length == 1 ) { pokemon.Types[1] = pokemon.Types[0]; }
		else if ( pokemon.Types.length > 2 ) { return; }

		var article = $("<article class='pokemon three columns "+ pokemon.Types[0].toLowerCase() +"border' id='"+pokemonName+"' title=''></article>");
		article.append(
			"<div class='pokemonHeader'>"+
				"<img class='icon' src= 'assets/images/type_icons/"+pokemon.Types[0]+".png' alt='"+pokemon.Types[0]+"'/>"+
				"<div>"+
					"<span class='Name'>"+pokemonName.replace(/_/g, " ")+" : </span>"+
	    			"<span class='Pokedex_ID'>"+pokemon.Pokedex_ID+"</span>"+
	    		"</div>"+
				"<img class='icon' src= 'assets/images/type_icons/"+pokemon.Types[1]+".png' alt='"+pokemon.Types[1]+"'/>"+
			"</div>");
		article.append("<img class='pokepic' src='assets/images/pokemon/"+pokemonName+".png' />");
		article.append("<div class='shortDescription'><span>"+pokemon.Short_Description+"</span></div>");

		$("#pokedex").append(article);

		article.tooltip({
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

		article.on('click', function() {
			window.open("pokemon_sheet.html?name="+pokemonName, '_blank');
		});
	});
}