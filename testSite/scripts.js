var w = 0;
var x = [];
var y = 0;
var s = 0.2;
var z = 0;
var imgHeight = [];
var divH = [];

$(document).ready(function(){
	w = $(window).height();
	x = document.getElementsByClassName("parallax");
	z = $(document).height();
	y = -$(window).scrollTop()*s;
	for(i=0;i<x.length;i++){
		divH[i] = $(x[i]).height();
		imgHeight[i] = (w*s) + divH[i];
		// x[i].style.backgroundSize = "auto " + imgHeight + "px";
		x[i].style.backgroundPosition = "center "+y+"px";
		x[i].style.backgroundAttachment = "fixed";
		x[i].style.minWidth = "100%";
		x[i].style.minHeight = imgHeight + "px";
	}
});

$(document).resize(function(){
	w = $(window).height();
	y = -$(window).scrollTop()*s;
	z = $(document).height();
	for(i=0;i<x.length;i++){
		divH[i] = $(x[i]).height();
		imgHeight[i] = (w*s) + divH[i];
		x[i].style.backgroundSize = "auto " + imgHeight + "px";
		x[i].style.backgroundPosition = "center "+y+"px";
	}
});

$(document).scroll(function(){
	y = -$(window).scrollTop()*s;
	//need to set it up so that the image height is equal to the screen height plus a fraction of the extra space
	for(i=0;i<x.length;i++){
		x[i].style.backgroundPosition = "center "+y+"px";
	}
});