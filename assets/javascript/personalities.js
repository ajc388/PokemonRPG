$( document ).ready( function() {
  /*print out json files*/
  DataGrid(
  {
    model: personalities, 
    searchFlag: true,
    sortFlag: true,
    name: "Personlaties"
  });

});