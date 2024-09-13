$(function() {

	var url = 'https://gist.githubusercontent.com/xb1itz/166c3f398eb4190c28b142902a27fa04/raw/';
	var converter = new showdown.Converter({
		simplifiedAutoLink: true,
		openLinksInNewWindow: true
	});

	$.get(url, function(text) {
		converter.setFlavor('github');
		var html = converter.makeHtml(text);
		$('.markdown-body').append(html);
	});
});
