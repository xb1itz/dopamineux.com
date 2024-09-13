$(function() {

	var url = 'https://gist.githubusercontent.com/xb1itz/045cd7f6d21a376d4124a3690f562544/raw/';
	var converter = new showdown.Converter();

	$.get(url, function(text) {
		var html = converter.makeHtml(text);
		$('.markdown-body').append(html);
	});
});
