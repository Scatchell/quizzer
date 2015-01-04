var testDomElements = [];

describe("quizzer", function () {
    beforeEach(function () {
        var textDiv = $('<div id="text">').appendTo(document.body);

        testDomElements = [textDiv];
    });

    afterEach(function () {
        testDomElements.forEach(function (element) {
            element.remove();
        });

        $('.section').remove();
    });

    it("should show words for each section", function () {
        var sections = [
            new Section('1 2 3 4',
                []
            ),
            new Section('1 2 3 4 5',
                []
            )
        ];

        var quizzer = new Quizzer(sections);

        quizzer.createSections();

        quizzer.blastWords();

        expect(quizzer.wordsForSection(1).length).toEqual(4);
        expect(quizzer.wordsForSection(2).length).toEqual(5);
    });

    it("should increment to next section", function () {
        var quizzer = new Quizzer();

        quizzer.nextSection();

        expect(quizzer.currentSectionNumber).toEqual(2);
    });

    it("should know total words for all sections", function () {
        var sections = [
            new Section('1 2 3 4 5',
                []
            ),
            new Section('6 7 8',
                []
            ),
            new Section('9 10',
                []
            )
        ];

        var quizzer = new Quizzer(sections);

        quizzer.createSections();

        quizzer.blastWords();

        expect(quizzer.totalWordsForAllSections()).toEqual(10);
    });

    it("should know total words for all sections BEFORE a certain section", function () {
        var sections = [
            new Section('1 2 3 4 5',
                []
            ),
            new Section('6 7 8',
                []
            ),
            new Section('9 10',
                []
            )
        ];

        var quizzer = new Quizzer(sections);

        quizzer.createSections();

        quizzer.blastWords();

        expect(quizzer.totalWordsForAllSectionsBeforeSection(3)).toEqual(8);
    });

    describe('previous quizzes', function () {
        it('should bring back first wrongly answered question', function () {
            var quizOne = new Quiz('test 1',
                ['', '', '', ''], 1);

            quizOne.selectAnswer(1);

            var quizTwo = new Quiz('test 2',
                ['', '', '', ''], 1);

            quizTwo.selectAnswer(2);

            var quizThree = new Quiz('test 3',
                ['', '', '', ''], 1);

            quizThree.selectAnswer(1);

            var sections = [
                new Section('1', [quizOne]),
                new Section('2', [quizTwo]),
                new Section('3', [quizThree])
            ];

            var quizzer = new Quizzer(sections);

            expect(quizzer.selectRepeatQuiz()).toEqual(quizTwo);
        });

        it('should bring back first wrongly answered question after questions have been re-answered', function () {
            var quizOne = new Quiz('test 1',
                ['', '', '', ''], 1);

            quizOne.selectAnswer(1);

            var quizTwo = new Quiz('test 2',
                ['', '', '', ''], 1);

            quizTwo.selectAnswer(2);

            var quizThree = new Quiz('test 3',
                ['', '', '', ''], 1);

            quizThree.selectAnswer(1);

            var sections = [
                new Section('1', [quizOne]),
                new Section('2', [quizTwo]),
                new Section('3', [quizThree])
            ];

            var quizzer = new Quizzer(sections);

            expect(quizzer.selectRepeatQuiz()).toEqual(quizTwo);

            quizOne.selectAnswer(2);
            expect(quizzer.selectRepeatQuiz()).toEqual(quizOne);
        });

        it('should bring back correctly answered questions randomly if there are no wrongly answered questions', function () {
            var quizOne = new Quiz('test 1',
                ['', '', '', ''], 1);

            quizOne.selectAnswer(1);

            var quizTwo = new Quiz('test 2',
                ['', '', '', ''], 1);

            quizTwo.selectAnswer(1);

            var quizThree = new Quiz('test 3',
                ['', '', '', ''], 1);

            quizThree.selectAnswer(1);

            var sections = [
                new Section('1', [quizOne]),
                new Section('2', [quizTwo]),
                new Section('3', [quizThree])
            ];

            function mockRandomizer(array) {
                return array[0];
            }

            var quizzer = new Quizzer(sections, mockRandomizer);

            expect(quizzer.selectRepeatQuiz()).toEqual(quizOne);
        });
    });

});