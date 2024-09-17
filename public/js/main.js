$(document).ready(function() {

	/*=================================
	=            Analytics            =
	=================================*/
	
	$(window).on('scroll', function() {

		var scroll = $(window).scrollTop();

		if (scroll >= 50) {
			$('#header').addClass('fixed');
		} else {
			$('#header').removeClass('fixed');
		}
	});

	$(window).bind('scroll.challenges', function() {

		var scroll = $(window).scrollTop();

		if (scroll >= 700) {

			ga('send', {
			  hitType: 'pageview',
			  page: 'scroll-challenges'
			});

			$(window).unbind('scroll.challenges');
		} 
	});

	$(window).bind('scroll.how', function() {

		var scroll = $(window).scrollTop();

		if (scroll >= 2500) {

			ga('send', {
			  hitType: 'pageview',
			  page: 'scroll-how'
			});

			$(window).unbind('scroll.how');
		} 
	});

	$(window).bind('scroll.services', function() {

		var scroll = $(window).scrollTop();

		if (scroll >= 3500) {

			ga('send', {
			  hitType: 'pageview',
			  page: 'scroll-services'
			});

			$(window).unbind('scroll.services');
		} 
	});

	$(window).bind('scroll.footer', function() {

		var scroll = $(window).scrollTop();

		if (scroll >= 4600) {

			ga('send', {
			  hitType: 'pageview',
			  page: 'scroll-footer'
			});

			$(window).unbind('scroll.footer');
		} 
	});


	/*====================================
	=            Interactions            =
	====================================*/

	$('input, textarea').on('change', function() {
		if (this.value) {
			$(this).addClass('dirty');
		} else {
			$(this).removeClass('dirty');
		};
	});

	$('.navbar').on('click', 'a', function(event){
	    event.preventDefault();

	    ga('send', {
		  hitType: 'pageview',
		  page: 'nav-' + $.attr(this, 'href').substring(1)
		});

	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top + 50
	    }, 500);
	    
	    $('.navbar-toggle').click();
	});

	$('.navbar .cta').click(function(event){
	    event.preventDefault();

	    $('html, body').animate({
	        scrollTop: $('#cta').offset().top
	    }, 500, function() {
		    $('#cta button').trigger('click');
		    $('.navbar-toggle').click();
	    });

	});

	$('form .toggle').click(function() {

		// grecaptcha.execute();

		ga('send', {
		  hitType: 'pageview',
		  page: 'form-' + $(this).closest('form').attr('data-form')
		});

		$(this).closest('form').find('.form-fields').slideDown({
			complete: function() {
				$(this).find('[name="name"]').focus();
			}
		});

		$(this).closest('form').find('.submit').show();

		$(this).hide();
		$(this).off('click');

		// prevent submitting
		return false;
	});

	$('form').submit(function() {

		ga('send', {
		  hitType: 'pageview',
		  page: 'submit-' + $(this).attr('data-form')
		});

		$theForm = $(this);

		grecaptcha.ready(function () {
			grecaptcha.execute('6LeD70YqAAAAAMQ3t-nvpWEUpOljlusFHR8YCXDM', { action: 'submit' }).then(function (token) {
				
				$("<input />").attr("type", "hidden")
					.attr("name", "recapcha")
					.attr("value", token)
					.appendTo($theForm);

				$.ajax({
					type: $theForm.attr('method'),
					url: $theForm.attr('action'),
					data: $theForm.serialize(),
					dataType: 'json',
					success: function(data) {
						$theForm.slideUp();
						$theForm.parent().find('.success').slideDown();
					},
					error: function(err) {
						console.log(err);
					}
				});

			});
		});

		// prevent submitting again
		return false;
	});
	
});

var CaptchaCallback = function(token) {

	var tokeninput = $("<input>")
       .attr("type", "hidden")
       .attr("name", "token").val(token);

    $('form').append($(tokeninput));
};