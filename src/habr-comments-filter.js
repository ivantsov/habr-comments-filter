var LEFT_ARROW = '&#8592;',
    RIGHT_ARROW = '&#8594;',
    FILTER_FORM_ID = 'comments-filter-form',
    FILTERED_COMMENTS_COUNT_LABEL_ID = 'comment-filter-form__lbl-filtered-comments-count',
    FILTER_MIN_RATING_INPUT_ID = 'comments-filter-form__inp-min-rating',
    FILTER_RESET_BTN_ID = 'comments-filter-form__btn-reset',
    FILTER_VISIBLE_CONTROLLER_ID = 'visible-controller';

function FilterView() {
    var isShow = true, $form;

    this.create = function (commentsCount, avgRating) {
        var htmlForm = '<div id="' + FILTER_FORM_ID + '" style="background-color: #f2f2f2; position: fixed; top: 50px; right: 0; border: 2px solid #777;">' +
            '<div style="background-color: #6da3bd; font-size: 28px; color: #fff; text-align: left; padding: 0 5px; cursor: pointer; height: 100%; position: absolute; float: left; z-index: 1000;">' +
            '<div id="' + FILTER_VISIBLE_CONTROLLER_ID + '" style="height: 100%; padding: 40px 0;">&#8594;</div>' +
            '</div>' +
            '<div style="position: relative; padding: 20px 10px 20px 50px; float: left;">' +
            '<p style="color: #000">Средний рейтинг: <strong>' + avgRating + '</strong></p>' +
            '<p style="color: #000">Мин рейтинг: <input style="width: 40px" id="' + FILTER_MIN_RATING_INPUT_ID + '" type="text"></p>' +
            '<p>Показано комм: <strong id="' + FILTERED_COMMENTS_COUNT_LABEL_ID + '">' + commentsCount + '</strong> из <strong>' + commentsCount + '</strong></p>' +
            '<button id="' + FILTER_RESET_BTN_ID + '" style="margin-top: 10px">Сбросить фильтр</button>' +
            '</div>' +
            '</div>';

        $('body').append(htmlForm);
        $form = $('#' + FILTER_FORM_ID);
    };

    this.setFilteredCommentsCount = function (filteredCommentCount) {
        $form.find('#' + FILTERED_COMMENTS_COUNT_LABEL_ID).text(filteredCommentCount);
    };

    this.toggle = function () {
        var $elem = $form.find('#' + FILTER_VISIBLE_CONTROLLER_ID);

        if (isShow) {
            isShow = false;
            $elem.html(LEFT_ARROW);
            $form.css({right: -1 * $form.width() + 35});
        }
        else {
            isShow = true;
            $elem.html(RIGHT_ARROW);
            $form.css({right: 0});
        }
    };
}

function FilterController() {
    var comments = [],
        commentsCount = 0,
        filteredComments = [],
        filteredCommentsCount = 0;

    this.getComments = function () {
        var comment, rating, id;

        commentsCount = 0;

        $('.comment_item').each(function () {
            comment = $(this);
            rating = parseInt(comment.find('.comment_body').eq(0).find('.score').eq(0).text().replace('–', '-'), 10);
            id = parseInt(comment.prop('id').replace(/[^0-9]+/, ''), 10);

            comments[id] = {
                parentId: parseInt(comment.find('.parent_id').eq(0).data('parent_id'), 10),
                rating: isNaN(rating) ? 0 : rating,
                isLast: false
            };

            commentsCount += 1;
        });

        return comments;
    };

    this.getCommentsCount = function () {
        return commentsCount;
    };

    this.getFilteredComments = function (minRating) {
        var comment, parent, id, parentId;

        filteredComments = [];
        filteredCommentsCount = 0;

        for (id in comments) {
            if (comments.hasOwnProperty(id)) {
                comment = comments[id];
                parentId = comment.parentId;
                parent = comments[parentId];

                if (comment.rating >= minRating && !filteredComments[id]) {
                    comment.isLast = true;
                    filteredComments[id] = comment;
                    filteredCommentsCount += 1;

                    while (parent) {
                        if (!filteredComments[parentId]) {
                            filteredComments[parentId] = parent;
                            filteredCommentsCount += 1;
                        }

                        parent.isLast = false;
                        parentId = parent.parentId;
                        parent = comments[parentId];
                    }
                }
            }
        }

        return filteredComments;
    };

    this.getFilteredCommentsCount = function () {
        return filteredCommentsCount;
    };

    this.getAvgRating = function () {
        var squareRatingSum = 0,
            commentsCount = this.getCommentsCount(),
            id;

        for (id in comments) {
            if (comments.hasOwnProperty(id)) {
                squareRatingSum += Math.pow(comments[id].rating, 2);
            }
        }

        return commentsCount > 0 ? Math.round(Math.sqrt(squareRatingSum / commentsCount)) : 0;
    };

    this.run = function () {
        var idName = '#comment_', $elem, $reply, id;

        for (id in comments) {
            if (comments.hasOwnProperty(id)) {
                $elem = $(idName + id);
                $reply = $elem.find('.reply');

                $elem.find('.show-reply').remove();

                // if comment is last in tree AND open child link doesnt exist AND child exist
                if (comments[id].isLast && $reply.eq(0).find('.show-reply').length === 0 && $elem.find('.reply_link').length > 1) {
                    $reply.eq(0).append('<a class="show-reply show-reply-hide" style="float: right" href="javascript:void(0)">Показать ответы</a>');

                    comments[id].isLast = false;
                }

                if (filteredComments[id]) {
                    $elem.show();
                }
                else {
                    $elem.hide();
                }
            }
        }
    };

    this.reset = function () {
        var idName = '#comment_', id;

        for (id in comments) {
            if (comments.hasOwnProperty(id)) {
                $(idName + id).show()
                    .find('.show-reply')
                    .remove();
            }
        }
    };

    this.toggleComments = function ($elem) {
        var parent;

        if ($elem.hasClass('show-reply-hide')) {
            $elem.removeClass('show-reply-hide');
            $elem.text('Скрыть ответы');

            parent = $elem.closest('.comment_item');

            parent.find('.comment_item').each(function () {
                $(this).show();
            });
        }
        else {
            $elem.addClass('show-reply-hide');
            $elem.text('Показать ответы');

            parent = $elem.closest('.comment_item');

            parent.find('.comment_item').each(function () {
                if (!$(this).hasClass('cool-comment') && $(this).find('.cool-comment').length === 0) {
                    $(this).hide();
                }
            });
        }
    };
}

function App() {
    var controller, view;

    this.initFilterForm = function () {
        var avgRating, commentsCount;

        controller = new FilterController();
        controller.getComments();
        avgRating = controller.getAvgRating();
        commentsCount = controller.getCommentsCount();

        view = new FilterView();
        view.create(commentsCount, avgRating);
    };

    function setMinRating(value) {
        controller.getFilteredComments(value);
        controller.run();

        view.setFilteredCommentsCount(controller.getFilteredCommentsCount());
    }

    function updateMinRatingByOne(value) {
        var $minRating = $('#' + FILTER_MIN_RATING_INPUT_ID),
            minRatingValue = parseInt($minRating.val(), 10) || 0,
            newMinRatingValue = minRatingValue + value;

        $minRating.val(newMinRatingValue);
        setMinRating(newMinRatingValue);
    }

    this.addHandlers = function () {
        $('#' + FILTER_MIN_RATING_INPUT_ID).on('input', function () {
            setMinRating($(this).val());
        });

        $('#' + FILTER_RESET_BTN_ID).on('click', function (e) {
            $('#' + FILTER_MIN_RATING_INPUT_ID).val('');
            controller.reset();
            view.setFilteredCommentsCount(controller.getCommentsCount());

            e.preventDefault();
        });

        $('#' + FILTER_VISIBLE_CONTROLLER_ID).on('click', function () {
            view.toggle();
        });

        $('body').on('click', '.show-reply', function () {
            controller.toggleComments($(this));
        });

        // hotkeys
        $(document).on('keydown', function (e) {
            if (e.ctrlKey && e.keyCode === 38) {
                updateMinRatingByOne(1);

                e.preventDefault();
            }
        });

        $(document).on('keydown', function (e) {
            if (e.ctrlKey && e.keyCode === 40) {
                updateMinRatingByOne(-1);

                e.preventDefault();
            }
        });
    };
}

var app = new App();
app.initFilterForm();
app.addHandlers();