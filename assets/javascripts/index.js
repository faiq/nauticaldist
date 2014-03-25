function autocompletehelper () {
	console.log("event happppppeenin")
	$.ajax({
		type: 'GET',
		url: "/ajax",
		data: {q : $("#field1").val(), fmt: "JSON"},
		contentType: 'application/json',
		datatype: "json",
		success: function (data){
			console.log('success');
			console.log(data); // got data
		
		}

	});
}
$(document).ready(function() {
	/*$("#field1").autocomplete({
		source: autocompletehelper,
		minlength: 4
	});*/
	$("#field2").autocomplete({
		source: autocompletehelper
	});

	$("#field1").on("keyup", function(e){
		if (e.keyCode === 13){
			console.log("event fired right");
			console.log($("#field1").val());
			autocompletehelper();

		}
	});

});