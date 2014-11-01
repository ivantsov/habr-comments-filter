describe('filter controller', function () {
    var filter;

    it('works', function () {
        filter = new FilterController();

        expect(filter).toBeDefined();
    });

    describe('method', function () {
        var getArrayCount = function (array) {
            return array.filter(function (elem) {
                return elem !== undefined;
            }).length;
        };

        var getShownCommentsCount = function () {
            var shownCommentsCount = 0;

            $('.comment_item').each(function () {
                if ($(this).is(':visible')) {
                    shownCommentsCount += 1;
                }
            });

            return shownCommentsCount;
        };

        jasmine.getFixtures().fixturesPath = 'base/src/tests/';

        beforeEach(function () {
            loadFixtures('fixtures.html');
        });

        it('get comments and get count', function () {
            var comments = filter.getComments(), id;

            expect(comments).toBeDefined();
            expect(filter.getCommentsCount()).toEqual(getArrayCount(comments));
            expect(filter.getCommentsCount()).toEqual(310);

            for (id in comments) {
                expect(isNaN(comments[id].rating)).toBeFalsy();
            }
        });

        it('get avg rating', function () {
            var avgRating = filter.getAvgRating();

            expect(avgRating).toEqual(27);
        });

        var expects = [{
                minRating: 300,
                filteredCommentsCount: 0
            }, {
                minRating: 200,
                filteredCommentsCount: 3
            }, {
                minRating: 100,
                filteredCommentsCount: 5
            }, {
                minRating: 50,
                filteredCommentsCount: 27
            }, {
                minRating: 10,
                filteredCommentsCount: 79
            }];

        it('get filtered comments by rating and get count', function () {
            var filteredComments, i;

            for (i = 0; i < expects.length; i++) {
                filteredComments = filter.getFilteredComments(expects[i].minRating);
                expect(filter.getFilteredCommentsCount()).toEqual(getArrayCount(filteredComments));
                expect(filter.getFilteredCommentsCount()).toEqual(expects[i].filteredCommentsCount);
            }
        });

        it('run', function () {
            var filteredCommentsCount, shownCommentsCount, i;

            for (i = 0; i < expects.length; i++) {
                filter.getFilteredComments(expects[i].minRating);
                filter.run();
                filteredCommentsCount = filter.getFilteredCommentsCount();
                shownCommentsCount = getShownCommentsCount();
                expect(shownCommentsCount).toEqual(filteredCommentsCount);
            }
        });


        it('reset filter', function () {
            var shownCommentsBefore, shownCommentsAfter;

            filter.getFilteredComments(300);
            filter.run();
            shownCommentsBefore = getShownCommentsCount();
            expect(shownCommentsBefore).toEqual(0);

            filter.reset();
            shownCommentsAfter = getShownCommentsCount();
            expect(shownCommentsAfter).toEqual(310);
        });

    });

});