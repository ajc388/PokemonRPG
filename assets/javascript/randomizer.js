  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);
      //console.log(pokemon);

      //Delete all types without moves - needed for empty json keys
      $.each(moves, function(key) {
        if ( Object.keys(moves[key]).length == 0 ) { delete moves[key]; }
      });

      //Create color map for UI
      //First color is dark, second color is light
      var colorMap = new Map();
      colorMap.set("Fire", ["#9C531F", "#F08030"]); 
      colorMap.set("Electric", ["#A1871F", "#F8D030"]); 
      colorMap.set("Normal", ["#6D6D4E", "#A8A878"]);

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
      $("#randomizeMovesButton").click(function() {
        var numberOfMoves = $("#numberMovesTextBox").val();
        var moveType = $("#moveTypeDropdownList").find("option:selected").text();
        var moveList = movePicker(numberOfMoves, moveType)

        console.log(moveList);
        displayMoves(moveType, moveList, colorMap);
      });
    });

    function displayMoves(type, moveList, colorMap)
    {
      $("#moveList").empty();
      
      if (Object.keys(moveList).length > 0)
      {
        $("#moveList").append("<div id='accordion"+type+"'>");
        
        for (var moveName in moveList)
        {
          var move = moveList[moveName];
          if ( move )
          {
            //Create header for accordion
            $("#accordion"+type).append("<div class='moveHeader' id='header_"+moveName+"'>"+
                                       "<img class='icon' id='img_icon_"+moveName+"'"+ 
                                       "src= 'assets/images/type_icons/"+move.type+".png' ></img>"+
                                       "<span class='moveName'>"+moveName.replace('_', ' ')+"</span>"+
                                       "<span class='moveDice' id='img_dice_"+moveName+"'></span>"+
                                       "<span class='moveFlavor'>" + move.flavor +"</span>"+ 
                                       "<span class='moveValue'>" + Math.pow(move.power,2) + "</span></div>");
            //Create dice icons - displayed after name inside the dice span tag
            for ( var i = 1; i < Math.round(move.power/30, 0)+1; i++ )
            {
              $("#img_dice_"+moveName).append("<img class='icon' src='assets/images/dice_icons/die_"+i+".png'/>");
            }

            //Create content for accordion
            $("#accordion"+type)
            .append("<div class='moveContent' id='content_"+moveName+"'>"+
                    "<p><span class='descriptiveHeader'> Power: </span>" + move.power + "</p>" +
                    "<p><span class='descriptiveHeader'> Style: </span>" + move.style + "</p>" +
                    "<p><span class='descriptiveHeader'> Effect: </span>" + move.effect + "</p>"+
                    "<p><span class='descriptiveHeader'> Critical: </span>" + move.critical + "</p>"+
                    "</div>");
            
            //Set colors from colormap
            $("#header_"+moveName).css('background-color', colorMap.get(move.type)[0] );
            $("#content_"+moveName).css('background-color', colorMap.get(move.type)[1] );
          }
        }
        $("#accordion"+type).accordion();
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