  $( document ).ready( function() {
      /*print out json files*/
      console.log(moves);
      //console.log(pokemon);

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
        displayMoves(moveList);
      });
    });

    function displayMoves(moveList)
    {
      $("#selectedMoves").empty();
      if (moveList.length > 0)
      {
        $("#selectedMoves").append("<div id='accordion'>");
        for (var i = 0; i < moveList.length; i++)
        {
          var move = moveList[i];
          if ( move )
          {
            $("#accordion").append("<h3>"+move.name+": " + move.flavor + " " + move.power + "</h3>");
            $("#accordion")
            .append("<div>"+
                    "<p> Style: " + move.style + "</p>" +
                    "<p> Effect: " + move.effect + "</p>"+
                    "<p> Critical: " + move.critical + "</p>"+
                    "</div>");
          }
        }
        $("#accordion").accordion();
      }
      else 
      {
        $("#selectedMoves").append("<p>No results</p>");
      }
    }

    //may want to simplify this entirely!
    function movePicker(desiredMoves, moveType)
    {
      var pickedMoves = [];
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
            
          pickedMoves.push(selectedMove);
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