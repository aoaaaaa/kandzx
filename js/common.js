$(function(){
	//获取屏幕高度，从而设置页面高度
	var w=$(window).width();
	var h=$(window).height();
	$('.bigcontainer').css('height',h);
	$('.right-add').css('height',h);

	$('.list-unstyled>li:first-child').click(function(){
		$(location).attr('href', 'index.html');
	});
	$('.list-unstyled>li:nth-child(2)').click(function(){
		$(location).attr('href','category.html');
	});
	$('.list-unstyled>li:nth-child(3)').click(function(){
		$(location).attr('href','资讯管理.html');
	});
	$('.list-unstyled>li:last-child').click(function(){
		$(location).attr('href','user.html');
	});
	
	
});
