// ==UserScript==
// @name habrCommentsFilter
// @description filter comments by rating
// @author Alexander Ivantsov (shpuntik74@gmail.com)
// @license MIT
// @version 2.1
// @include http://habrahabr.ru/post/*
// @include http://habrahabr.ru/company/*/blog/*
// ==/UserScript==

var addScriptTag = function (funcToRun) {
    var script = document.createElement('script');
    script.textContent = '(' + funcToRun.toString() + ')()';
    document.body.appendChild(script);
};

addScriptTag(function(){
    include "habr-comments-filter.js"
});