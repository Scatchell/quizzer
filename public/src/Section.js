function Section(sectionText, quizzes) {
    var self = this;

    self.text = sectionText;
    self.quizzes = (quizzes == undefined ? [] : quizzes);
    self.currentQuizNumber = 0;

    self.addQuiz = function (quiz) {
        self.quizzes.push(quiz);
    };

    self.nextQuiz = function () {
        self.currentQuizNumber += 1;
    };

    self.currentQuiz = function () {
        return self.quizzes[self.currentQuizNumber];
    };

    self.getQuiz = function (quizNumber) {
        return self.quizzes[quizNumber - 1];
    };

    self.onLastQuiz = function () {
        return self.quizzes.length == self.currentQuizNumber;
    };

    self.incorrectQuizzes = function () {
        var incorrectQuizzes = self.quizzes.filter(function (quiz) {
            return quiz.hasBeenAnswered() && !quiz.correct();
        });

        return incorrectQuizzes;
    };

    self.correctQuizzes = function () {
        var correctQuizzes = self.quizzes.filter(function (quiz) {
            return quiz.hasBeenAnswered() && quiz.correct();
        });

        return correctQuizzes;
    };
}