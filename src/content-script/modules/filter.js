let comments = {};
let commentsCount = 0;
let averageRating = 0;
let minRating = 0;

function getDataByElement($element) {
    const id = parseInt($element.getAttribute('id').replace('comment_', ''), 10);
    const $rating = $element.querySelector('.js-score');
    const rating = $rating ? parseInt($rating.textContent.replace('–', '-'), 10) : 0;
    const parentId = parseInt($element.querySelector('.parent_id').dataset.parent_id, 10);

    return {
        id,
        rating,
        parentId,
        isHidden: false,
        $element
    };
}

export function parse() {
    const $comments = document.querySelectorAll('.comment_item');
    const result = [...$comments].reduce((obj, $comment) => {
        const data = getDataByElement($comment);
        obj.comments[data.id] = data;

        // needed for calculating the average rating
        obj.ratingSquareSum += data.rating ** 2;

        return obj;
    }, {
        comments: {},
        ratingSquareSum: 0
    });

    comments = result.comments;
    commentsCount = $comments.length;
    averageRating = Math.round(Math.sqrt(result.ratingSquareSum / commentsCount));

    return {
        totalCommentsCount: commentsCount,
        shownCommentsCount: commentsCount,
        averageRating,
        minRating
    };
}

export function filter(minRating) {
    return Object.keys(comments).reduce((shownCommentsCount, id) => {
        let comment = comments[id];

        if (comment.rating < minRating) {
            comment.isHidden = true;
            // TODO: remove
            comment.$element.querySelector('.comment_body').style.background = 'white';
        }
        else {
            while (comment) {
                shownCommentsCount++;
                // TODO: remove
                comment.$element.querySelector('.comment_body').style.background = 'red';

                comment.isHidden = false;
                comment = comments[comment.parentId];
            }
        }

        return shownCommentsCount;
    }, 0);
}
