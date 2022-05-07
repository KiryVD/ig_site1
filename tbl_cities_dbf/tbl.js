//create Tabulator on DOM element with id "table_view"
var table = new Tabulator("#table_view", {
 	height:700, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
 	rowHeight:40,
 	data:tbl_obj, //assign data to table
// 	layout:"fitColumns", //fit columns to width of table (optional)
 	autoColumns:true,
});

//trigger an alert message when the row is clicked
table.on("rowClick", function(e, row) {
  if (typeof row.getData().WP_HTML != "undefined")
  {
    var web_ref = row.getData().WP_HTML;
    web_ref.trim();
    var win = window.open(web_ref, '_blank');
    win.focus();
  } 
});
