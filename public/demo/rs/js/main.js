$(function() {

	var url = 'https://gist.githubusercontent.com/xb1itz/9476cbd6bfdf8904201bbb556bd363dc/raw/78f41aaadd42a584d4266a498fbe9ecbf77f205b/rs.md';
	var converter = new showdown.Converter();

	$.get(url, function(text) {
		var html = converter.makeHtml(text);
		$('.markdown-body').append(html);
	});
});
