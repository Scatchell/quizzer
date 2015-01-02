var testDomElements = [];

describe("Quiz", function () {

    it("should know when answer is correct", function () {
        var quiz = new Quiz("test question", ['1', '2', '3'], 3);

        quiz.selectAnswer(3);

        expect(quiz.correct()).toBe(true);
    });

    it("should know when answer is not correct", function () {
        var quiz = new Quiz("test question", ['1', '2', '3'], 3);

        quiz.selectAnswer(1);

        expect(quiz.correct()).toBe(false);
    });

});