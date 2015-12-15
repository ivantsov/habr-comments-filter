// ==UserScript==
// @name habrCommentsFilter
// @description filter comments by rating
// @author Alexander Ivantsov (alexivantsiv@ya.ru)
// @license MIT
// @version 2.2
// @include http://habrahabr.ru/post/*
// @include http://habrahabr.ru/company/*/blog/*
// @include http://geektimes.ru/post/*
// @include http://geektimes.ru/company/*/blog/*
// @include http://megamozg.ru/post/*
// @include http://megamozg.ru/company/*/blog/*
// ==/UserScript==

var addScriptTag = function (funcToRun) {
    var script = document.createElement('script');
    script.textContent = '(' + funcToRun.toString() + ')()';
    document.body.appendChild(script);
};

addScriptTag(function(){
    include "habr-comments-filter.js"
});