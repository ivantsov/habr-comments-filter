// ==UserScript==
// @name habrCommentsFilter
// @description filter comments by rating
// @author Alexander Ivantsov (shpuntik74@gmail.com)
// @license MIT
// @version 1.3
// @include http://habrahabr.ru/post/*
// @include http://habrahabr.ru/company/*/blog/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function(){

    function FilterView(options){
        var LEFT_ARROW = "&#8592;",
            RIGHT_ARROW = "&#8594;",
            isShow = true,
            form = null,
            controller = options.controller;

		this.create = function(){
            controller.getCommentsWithPositiveRating();

            var avgRating = controller.getAvgRating(),
                commentsCount = controller.getCommentsCount(),
			    htmlForm = "<div id='comments-filter-form' style='background-color: #f2f2f2; position: fixed; top: 50px; right: 0; border: 2px solid #777;'>" +
                    "<div style='position: relative; padding: 20px 40px;'>" +
                        "<p style='color: #000'>" +
                            "Средний рейтинг: <strong>" + controller.getAvgRating() + "</strong>" +
                        "</p>" +
                        "<p style='color: #000'>" +
                            "Мин рейтинг: <input style='width: 30px' id='comments-filter-form__inp-min-rating' type='number' min='0'>" +
                        "</p>" +
                        "<p>" +
                            "Показано комм: <strong id='comment-filter-form__lbl-shown-comments-count'>" + commentsCount + "</strong> из <strong>" + commentsCount + "</strong>" +
                        "</p>" +
                        "<button id='comments-filter-form__btn-reset' style='margin-top: 10px'>Сбросить фильтр</button>" +
                    "</div>" +
                    "<div id='visible-controller' style='background-color: #6da3bd; font-size: 28px; color: #fff; text-align: left; padding-left: 45px; cursor: pointer; height: 42px'>&#8594;</div>" +
                "</div>";

            $("body").append(htmlForm);
            form = $("#comments-filter-form");
		};

        this.toggle = function(){
            if(isShow){
                isShow = false;
                form.find("#visible-controller").html(LEFT_ARROW);
                form.animate({
                    right: -1 * form.width() + 80
                }, 1000);
            }
            else{
                isShow = true;
                form.find("#visible-controller").html(RIGHT_ARROW);
                form.animate({right: 0}, 1000);
            }
        };
	}

    function FilterController(){
        //TODO: add hotkey
        var commentsWithPositiveRating = [],
            commentsWithPositiveRatingCount = 0,
            commentsCount = 0;

        this.getCommentsWithPositiveRating = function(){
            var comment, rating;

            $(".comment_item").each(function(){
                comment = $(this);
                rating = parseInt(comment.find(".mark .score").html(), 10);

                if(isNaN(rating) === false && rating > 0){
                    commentsWithPositiveRating.push({
                        comment: comment,
                        rating: rating
                    });
                }
            });

            commentsWithPositiveRatingCount = commentsWithPositiveRating.length;
        };

        this.getAvgRating = function(){
            var sumRating = 0;

            for(var i = 0; i < commentsWithPositiveRatingCount; i++){
                sumRating += Math.pow(commentsWithPositiveRating[i].rating, 2);
            }

            return commentsWithPositiveRatingCount > 0 ? Math.round(Math.sqrt(sumRating / commentsWithPositiveRatingCount)) : 0;
        };

        this.getCommentsCount = function(){
            if(!commentsCount){
                commentsCount = $(".comment_item").length;
            }

            return commentsCount;
        };

        this.getShownCommentsCount = function(){
            return this.getCommentsCount() - $(".comment_item:hidden").length;
        };

        function setClassForBestComments(minRating){
            for(var i = 0; i < commentsWithPositiveRatingCount; i++){
                if(commentsWithPositiveRating[i].rating >= minRating){
                    commentsWithPositiveRating[i].comment.addClass("cool-comment");
                }
            }
        };

        function hideBadComments(){
            $(".comment_item").each(function(){
                if($(this).hasClass("cool-comment") === false && $(this).find(".cool-comment").length === 0){
                    $(this).hide();
                }
                else if($(this).hasClass("cool-comment") && $(this).find(".cool-comment").length === 0 && $(this).find(".reply .show-reply").length === 0 && $(this).find(".reply_link").length > 1){
                    $(this).find(".reply").eq(0).append("<a class='show-reply show-reply-hide' style='float: right' href='javascript:void(0)'>Показать ответы</a>");
                }
            });
        }

        this.runFilter = function(minRating){
            setClassForBestComments(parseInt(minRating, 10));
            hideBadComments();
        };

        this.resetFilter = function(){
            $(".comment_item").each(function(){
                $(this).removeClass("cool-comment");
                $(this).find(".show-reply").remove();
                $(this).show();
            });
        };

        this.toggleComments = function(elem){
            var parent;

            if(elem.hasClass("show-reply-hide")){
                elem.removeClass("show-reply-hide");
                elem.text("Скрыть ответы");

                parent = elem.closest(".comment_item");

                parent.find(".comment_item").each(function(){
                    $(this).show();
                });
            }
            else{
                elem.addClass("show-reply-hide");
                elem.text("Показать ответы");

                parent = elem.closest(".comment_item");

                parent.find(".comment_item").each(function(){
                    if(!$(this).hasClass("cool-comment") && $(this).find(".cool-comment").length == 0){
                        $(this).hide();
                    }
                });
            }
        };
    }

    var filterController = new FilterController();
    var filterView = new FilterView({
        controller: filterController
    });

    filterView.create(filterController);

    function updateShownCommentLbl(){
        var shownCommentsCount = filterController.getShownCommentsCount();
        $("#comment-filter-form__lbl-shown-comments-count").text(shownCommentsCount);
    };

    $("#comments-filter-form__inp-min-rating").on("input", function(){
        var minRating = $(this).val();

        filterController.resetFilter();
        filterController.runFilter(minRating);
        updateShownCommentLbl();
    });

    $("body").on("click", "#comments-filter-form__btn-reset", function(){
        filterController.resetFilter();
        updateShownCommentLbl();

        return false;
    });

    $("body").on("click", "#visible-controller", function(){
        filterView.toggle();
    });

    $("body").on("click", ".show-reply", function(){
        filterController.toggleComments($(this));
    });

});