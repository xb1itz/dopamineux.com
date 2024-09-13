$(function() {

	var url = 'https://gist.githubusercontent.com/xb1itz/e8675da0d6885b78acaef6d1cc783a77/raw/';
	var converter = new showdown.Converter();

	$.get(url, function(text) {
		var html = converter.makeHtml(text);
		$('.markdown-body').append(html);
	});
});
