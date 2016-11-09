$( document ).ready( function() {
  /*print out json files*/
  dataGrid({
    model: personalities, 
    searchCriteria: ".name" });
});