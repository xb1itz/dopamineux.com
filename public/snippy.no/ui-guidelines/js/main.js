$(function() {

	var url = 'https://gist.githubusercontent.com/xb1itz/3d06f31b8ad0ee994b5707bb1054d900/raw';
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
