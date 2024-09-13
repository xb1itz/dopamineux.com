$(function() {

	var url = 'https://gist.githubusercontent.com/xb1itz/3ef1617deb5ac831df4b450522bebdf0/raw/';
	var converter = new showdown.Converter();

	$.get(url, function(text) {
		var html = converter.makeHtml(text);
		$('.markdown-body').append(html);
	});
});
