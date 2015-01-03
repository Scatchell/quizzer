describe("quizzer", function () {

    it("should get the first quiz", function () {
        var quizOne = new Quiz('test question', ['answer1', 'answer2'], 1);
        var quizTwo = new Quiz('test question 2', ['answer3', 'answer4'], 1);
        var section = new Section("test", [quizOne, quizTwo]);

        expect(section.currentQuiz).toBe(0);
        expect(section.nextQuiz()).toBe(quizOne);
    });

    it("should know when not on the last quiz", function () {
        var quizOne = new Quiz('test question', ['answer1', 'answer2'], 1);
        var quizTwo = new Quiz('test question 2', ['answer3', 'answer4'], 1);
        var section = new Section("test", [quizOne, quizTwo]);

        section.nextQuiz();
        expect(section.lastQuiz()).toBe(false);
    });

    it("should know when reached the last quiz", function () {
        var quizOne = new Quiz('test question', ['answer1', 'answer2'], 1);
        var quizTwo = new Quiz('test question 2', ['answer3', 'answer4'], 1);
        var section = new Section("test", [quizOne, quizTwo]);

        section.nextQuiz();
        section.nextQuiz();
        expect(section.lastQuiz()).toBe(true);
    });

    it("should get the next quiz", function () {
        var quizOne = new Quiz('test question', ['answer1', 'answer2'], 1);
        var quizTwo = new Quiz('test question 2', ['answer3', 'answer4'], 1);
        var section = new Section("test", [quizOne, quizTwo]);

        section.nextQuiz();
        expect(section.currentQuiz).toBe(1);
        expect(section.nextQuiz()).toBe(quizTwo);
    });

    it("should be undefined when no more quizzes", function () {
        var quizOne = new Quiz('test question', ['answer1', 'answer2'], 1);
        var quizTwo = new Quiz('test question 2', ['answer3', 'answer4'], 1);
        var section = new Section("test", [quizOne, quizTwo]);

        section.nextQuiz();
        section.nextQuiz();
        expect(section.currentQuiz).toBe(2);
        expect(section.nextQuiz()).toBe(undefined);
    });

});