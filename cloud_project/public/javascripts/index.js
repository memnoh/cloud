function suggestions() {
	$("#q").autocomplete({
		source: function(request, response){
			$.ajax({
				url: '/api/suggest?q='+request.term,
				dataType: 'json',
				success: function(data, textStatus, jqXHR){
					response($.map(data, function(item){
						return {
							label: item.suggestion
						};
					}));
				},
				error: function(jqXHR, textStatus, errorThrown){
					alert(jqXHR.responseText);
				}
			});
		},
		minLength: 2
	});
}

$(document).ready(function() {
	suggestions();
});