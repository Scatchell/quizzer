function Section(sectionText, questions) {
    var self = this;

    self.text = sectionText;
    self.quizes = (questions == undefined ? [] : questions);

    self.addQuestion = function (question) {
        self.quizes.push(question);
    };

    self.getFirstQuiz = function () {
        return self.quizes[0];
    }
}