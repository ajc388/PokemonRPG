  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);
      //console.log(pokemon);

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
    });

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