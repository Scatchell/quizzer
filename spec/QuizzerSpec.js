var testDomElements = [];

describe("quizzer", function () {
    beforeEach(function () {
        var textDiv = $( '<div id="text">').appendTo( document.body );

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

});