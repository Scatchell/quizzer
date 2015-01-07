function Quiz(question, answers, correctAnswer){
    var self = this;

    self.question = question;
    self.answers = answers;
    self.correctAnswer = correctAnswer;

    self.isAnswerCorrect = undefined;

    self.selectAnswer = function (answerNumber) {
        self.isAnswerCorrect = (answerNumber == self.correctAnswer);
    };

    self.correct = function () {
        return self.isAnswerCorrect;
    };

    self.correctAnswerText = function () {
        return self.answers[self.correctAnswer - 1];
    };

    self.hasBeenAnswered = function () {
        return self.isAnswerCorrect != undefined;
    }
}