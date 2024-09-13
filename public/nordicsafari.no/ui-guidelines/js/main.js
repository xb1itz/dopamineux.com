$(function() {

	var url = 'https://gist.githubusercontent.com/xb1itz/d00e6c140740fef834e9a919d3363845/raw/';
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
