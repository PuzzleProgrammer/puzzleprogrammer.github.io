/*jshint jquery:true */
/*global $:true */

var $ = jQuery.noConflict();

$(document).ready(function($) {
    "use strict";

    /* global google: false */


 /* ==============================================
 Burger Menu
 =============================================== */

 var burgerMenuWrap=$('.burger-menu').find('.menu-wrap');
    var burgerMenu=$('.burger-menu').find('.menu-wrap > ul > li').children('ul');
    var burgerMenuLength=burgerMenu.length;
    
    
    burgerMenu.each(function(e){
    
        $(this).siblings('a').append('<i class="open-menu fa fa-angle-down"></i>');
    
    });
    
    /* Menu Slide Toggle */
    
    $('.open-menu').on('click',function(e){
    
        e.preventDefault();
        
        if($(this).parent('a').parent('li').hasClass('active')){
            $('.open-menu').parent('a').parent('li').removeClass('active');
            $(this).parent('a').siblings('ul').stop().slideUp({
                duration:1000,
                easing: 'easeOutExpo'
            });
    
        }
        
        else{
    
            $('.open-menu').parent('a').parent('li').removeClass('active');
            $(this).parent('a').parent('li').addClass('active');
            $('.open-menu').parent('a').siblings('ul').stop().slideUp({
                duration:1000,
                easing: 'easeOutExpo'
            });
    
            $(this).parent('a').siblings('ul').stop().slideDown({
                duration:1000,
                easing: 'easeOutExpo'
            });
        }   
    });
    
    $('.open-menu').hover(function(){
    
        $(this).stop().animate({
            paddingTop:'10px'
        },200);
    
    },function(){
    
        $(this).stop().animate({
            paddingTop:'7px'
        },200);
    
    });
    
    $('.close-icon').click(function(){
    
        burgerMenuWrap.removeClass('fadeInDown');
        burgerMenuWrap.addClass('fadeOutUp');
    
        $('.burger-menu').stop().delay(500).slideUp({
            duration:500,
            easing:'easeOutCubic'
        }); 
    
        $('.top-bars').find('.fa').stop().delay(600).animate({
            opacity:1
        },300);
    });


    $('.top-bars').find('.fa').click(function(){
        burgerMenuWrap.removeClass('fadeOutUp');   
        burgerMenuWrap.addClass('fadeInDown');
    
        $('.burger-menu').stop().slideDown({
            duration:500,
            easing:'easeInCubic'
        });
        $('.burger-menu').css('display','block');
        $(this).stop().animate({
            opacity:0
        },300);
    });

});
