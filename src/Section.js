function Section(sectionText, quizzes) {
    var self = this;

    self.text = sectionText;
    self.quizzes = (quizzes == undefined ? [] : quizzes);
    self.currentQuiz = 0;

    self.addQuiz = function (quiz) {
        self.quizzes.push(quiz);
    };

    self.nextQuiz = function () {
        var nextQuiz = self.quizzes[self.currentQuiz];
        self.currentQuiz += 1;

        return nextQuiz;
    };

    self.getQuiz = function (quizNumber) {
        return self.quizzes[quizNumber - 1];
    };

    self.lastQuiz = function () {
        return self.quizzes.length == self.currentQuiz;
    };
}