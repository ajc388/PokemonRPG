$( document ).ready( function() {
  //Delete all types without moves - needed for empty json keys
  $.each(moves, function(key) {
    if ( Object.keys(moves[key]).length == 0 ) { delete moves[key]; }
  });

  /*bind selectable options to move type drop down list user control*/
  $("#moveTypeDropdownList").append(
    $("<option></option>").val('Any').html('Any')
  );
  $.each(moves, function (key, value) {
    $("#moveTypeDropdownList").append(
      $("<option></option>").val(key).html(key)
    );
  });

  /*bind events to form*/
  /*bind click action to randomize button*/
  $("#randomize").click(function() {
    var numberOfMoves = $("#numberMovesTextBox").val();
    var moveType = $("#moveTypeDropdownList").find("option:selected").text();
    var moveList = movePicker(numberOfMoves, moveType)
    
    displayMoves(moveList);
  });


  function displayMoves(moveList)
  {
    var moves = $("#moveList");
    moves.empty();
    if (Object.keys(moveList).length > 0)
    {
      var accordion = $("<div id='accordion'></div>");
      for (var moveName in moveList)
      {
        var move = moveList[moveName];
        if ( move )
        {
          var flavor = typeof move.flavor !== "undefined" ? move.flavor : "No text!";
          var power = typeof move.power !== "undefined" ? move.power : "0";
          var style = typeof move.style !== "undefined" ? move.style : "Any";

          var container = $("<article class='group twelve columns'></div>");

          var header = $("<div class='flex move-header twelve columns "+ move.type.toLowerCase() +"' id='header_"+moveName+"'></div>");
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

          content.append("<p><span class='label'> Effect : </span><span>" + effect + "</span></p>");
          if (critical != "") { content.append("<p><span class='label'> Critical : </span><span>" + critical + "</span></p>"); }
          if (outofbattle != "") { content.append("<p><span class='label'> Out Of Battle : </span><span>" + outofbattle + "</span></p>"); }
          container.append(content);
          accordion.append(container);
        }
      }

      moves.append(accordion);
      accordion.append(accordion);
      accordion
        .accordion({
          header: ".move-header",
          heightStyle: ""
        })
    }
    else 
    {
      moves.append("<p>No results!?!?!</p>");
    }
  }

  //may want to simplify this entirely!
  function movePicker(desiredMoves, moveType)
  {
    var pickedMoves = {};
    var type = moveType;
    var moveBag = JSON.parse(JSON.stringify(moves)); //cloning the json file <_>

    if ( moveType == "Any" && desiredMoves > getTotalMoves(moveBag))
    {
      console.log("You asked for more moves than are available in the file!"); //Need to correctly handle error
      return pickedMoves;
    } 
    else if ( moveType != "Any" && desiredMoves > Object.keys(moveBag[type]).length)
    {
      console.log("You asked for move moves than are listed in that move type!");
      return pickedMoves;
    }
    else 
    {
      for ( var i = 0; i < desiredMoves; i++)
      {
        if (moveType == "Any")
        {
          var position = Math.round(Math.random()*(Object.keys(moveBag).length-1), 0);
          //console.log(position);
          type = Object.keys(moveBag)[position];
        }

        var moveSet = moveBag[type];
        var position = Math.round(Math.random()*(Object.keys(moveSet).length-1), 0);
        //console.log(position);
        var selectedMoveName = Object.keys(moveSet)[position];
        var selectedMove = moveSet[selectedMoveName];
          
        pickedMoves[selectedMoveName] = selectedMove;
        pickedMoves[selectedMoveName]["type"] = type;
        delete moveSet[selectedMoveName];
        if( Object.keys(moveBag[type]).length == 0 ) { delete moveBag[type]; } 
      }
    } 
    return pickedMoves;
  }

  function getTotalMoves(moveBag)
  {
    var totalMoves = 0;
    for ( var moveSet in moveBag) { totalMoves += Object.keys(moveBag[moveSet]).length; }
    return totalMoves;
  }
});