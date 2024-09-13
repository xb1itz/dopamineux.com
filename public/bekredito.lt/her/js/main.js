$(function() {

	var url = 'https://gist.githubusercontent.com/xb1itz/83f04244cd1b17e4840462b6a300c732/raw/4a23c2be2ce726137a4ec44e0da7b2d4cb13fa89/bekredito.lt_her.md';
	var converter = new showdown.Converter();

	$.get(url, function(text) {
		var html = converter.makeHtml(text);
		$('.markdown-body').append(html);
	});
});
