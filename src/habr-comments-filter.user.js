// ==UserScript==
// @name habrCommentsFilter
// @description filter comments by rating
// @author Alexander Ivantsov (shpuntik74@gmail.com)
// @license MIT
// @version 2.0
// @include http://habrahabr.ru/post/*
// @include http://habrahabr.ru/company/*/blog/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function(){
    include "habr-comments-filter.js"
});