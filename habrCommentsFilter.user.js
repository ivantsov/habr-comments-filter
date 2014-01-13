// ==UserScript==
// @name habrCommentsFilter
// @description filter comments by rating
// @author Alexander Ivantsov
// @license MIT
// @version 1.2
// @include http://habrahabr.ru/post/*
// @include http://habrahabr.ru/company/*/blog/*
// ==/UserScript==

$(function(){

	var FilterForm = {
		isShow: true,
        isFilter: false,
        form: null,

		create: function(){
			var htmlForm = "<div id='comments-filter-form' style='background-color: #f0f0e7; position: fixed; top: 50px; right: 0; padding: 20px 40px; border: 2px solid #777;'>" +
				"<div style='position: relative'>" +
					"<p style='color: #000'>" +
						"Средний рейтинг: <span style='width: 30px; color: #0072b1;'>" + Filter.getAvgRating() + "</span>" +
					"</p>" +
					"<p style='color: #000'>" +
						"Мин рейтинг: <input id='comments-filter-form__inp-min-rating' style='width: 30px' type='number' placeholder='0'>" +
					"</p>" +
					"<button id='comments-filter-form__btn' style='margin-top: 10px'>Отфильтровать</button>" +
				"</div>" +
			"</div>";

            $("body").append(htmlForm);

            this.form = $("#comments-filter-form");
		},

        toggle: function(){
            if(this.isShow){    //  hide
                this.isShow = false;

                this.form.animate({
                    paddingLeft: "+=80",
                    right: -1 * this.form.width() - 80

                }, 1000);
            }
            else{   //  show
                this.isShow = true;

                this.form.animate({
                    paddingLeft: "-=80",
                    right: 0
                }, 1000);
            };
        },

        btnClick: function(elem){
            if(this.isFilter){
                this.isFilter = false;

                Filter.refresh();

                this.form.find("p").show();

                elem.html("Отфильтровать");
            }
            else{
                this.isFilter = true;

                Filter.run();

                this.form.find("p").hide();

                elem.html("Сбросить");
            };
        }
	};

    var Filter = {
        getAvgRating: function(){
            var count = 0,
                ratingSum = 0,  //sum of comments rating
                rating;

            $(".comment_item").each(function(){
                rating = parseInt($(this).find(".mark .score").html());

                if(isNaN(rating) || rating == 0) return; //    skip comments with not positive rating

                count++;
                ratingSum += rating;
            });

            return Math.round(ratingSum/count);
        },

        run: function(){
            var minRating = parseInt($("#comments-filter-form__inp-min-rating").val());
            var rating;

            //  set class 'cool-comment' for comment with needed rating
            $(".comment_item").each(function(){
                rating = $(this).find(".mark .score").html();

                if( isNaN(parseInt(rating)) ) rating = -1 * parseInt(rating.replace("–", ""));  //  negative rating
                else rating = parseInt(rating); //  positive rating

                if(rating >= minRating) $(this).addClass("cool-comment");
            });

            //  hide useless comments and add 'show comments' button for it
            $(".comment_item").each(function(){
                if(!$(this).hasClass("cool-comment") && $(this).find(".cool-comment").length == 0) $(this).hide();
                else if($(this).hasClass("cool-comment") && $(this).find(".cool-comment").length == 0 && $(this).find(".reply .show-reply").length == 0 && $(this).find(".reply_link").length > 1) $(this).find(".reply").eq(0).append("<a class='show-reply show-reply-hide' style='float: right' href='javascript:void(0)'>Показать ответы</a>");
            });
        },

        refresh: function(){
            $(".cool-comment").each(function(){
                $(this).removeClass("cool-comment");
                $(this).find(".show-reply").remove();
            });

            $(".comment_item").each(function(){
                $(this).show();
            });
        },

        toggleComments: function(elem){
            var parent;

            if(elem.hasClass("show-reply-hide")){
                elem.removeClass("show-reply-hide");
                elem.html("Скрыть ответы");

                parent = elem.closest(".comment_item");

                parent.find(".comment_item").each(function(){
                    $(this).show();
                });
            }
            else{
                elem.addClass("show-reply-hide");
                elem.html("Показать ответы");

                parent = elem.closest(".comment_item");

                parent.find(".comment_item").each(function(){
                    if(!$(this).hasClass("cool-comment") && $(this).find(".cool-comment").length == 0) $(this).hide();
                });
            };
        }
    };

    FilterForm.create();

    $("body").on("click", "#comments-filter-form__inp-min-rating", function(){
        return false;
    });

    $("body").on("click", "#comments-filter-form__btn", function(){
        FilterForm.btnClick($(this));

        return false;
    });

    //  show and close comments filter form
    $("body").on("click", "#comments-filter-form", function(){
        FilterForm.toggle();
    });

    $("body").on("click", ".show-reply", function(){
        Filter.toggleComments($(this));
    });

});