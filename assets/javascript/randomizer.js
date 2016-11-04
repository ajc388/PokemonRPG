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
      $("#selectedMovesList").empty();
      for (var i = 0; i < moveList.length; i++)
      {
        var move = moveList[i];
        $("#selectedMovesList").append("<div id='move"+i+"'>");
        $.each(move, function(key, value) {
          $("#move"+i).append("<p><b>"+ key.toUpperCase() + "</b> : " + value +"</p>");  
        }); 
        $("#selectedMovesList").append("<br/>");
      }
    }

    function movePicker(desiredMoves, moveType)
    {
      var pickedMoves = [];
      
      /*if ( desiredMoves > totalMoveCount)
      {
        console.log("You asked for more moves than are available in the file!"); //Need to correctly handle error
        return pickedMoves;
      }*/
      for ( var i = 0; i < desiredMoves;)
      {
        if (moveType == "Any")
        {
          var position = Math.floor(Math.random()*Object.keys(moves).length);
          moveType = Object.keys(moves)[position];
        }
        var moveSet = moves[moveType];

        var position = Math.floor(Math.random()*Object.keys(moveSet).length);
        var selectedMoveName = Object.keys(moveSet)[position];
        var selectedMove = moveSet[selectedMoveName];
        
        if ( moveNotPicked(pickedMoves, selectedMoveName) )       
        {
          pickedMoves.push(selectedMove);
          i++;
        }       
      }
      return pickedMoves;
    }

    function moveNotPicked(pickedMoves, selectedMoveName)
    {
      for ( var i = 0; i < pickedMoves.length; i++) //for each loop doesn't work?
      {
        if ( selectedMoveName == pickedMoves[i].name ) { return false; }
      }
      return true;
    }