var WORD_DISPLAY_SPEED = 5;

function Quizzer(sections) {
    var self = this;

    self.currentSectionNumber = 1;

    self.sections = sections;

    self.hideAllWords = function () {
        var allWords = $("span[id^='word-']");

        allWords.hide();
    };

    self.blastWords = function () {
        $(".section").blast({
            delimiter: 'word',
            tag: 'span',
            customClass: 'word',
            generateIndexID: true
        });
    };

    self.createProgressBarForCurrentSection = function () {
        var currentProgressBarSelector = '#current-progress-bar';
        $(currentProgressBarSelector).html('');

        var progressBar = new ProgressBar.Line(currentProgressBarSelector, {
            color: '#FCB03C'
        });

        return progressBar;
    };

    self.wordsForSection = function (sectionNumber) {
        return $("div#section-" + sectionNumber + " span[id^='word-']");
    };

    self.wordsForCurrentSection = function () {
        return self.wordsForSection(self.currentSectionNumber);
    };

    self.nextSection = function () {
        self.currentSectionNumber += 1;
    };

    self.showNextSectionButton = function () {
        $('#next-section').show();
    };

    self.currentSection = function () {
        return self.sections[self.currentSectionNumber - 1];
    };

    self.totalWordsForAllSections = function () {
        var total = 0;

        $.each(self.sections, function (index) {
            total += self.wordsForSection(index + 1).length;
        });

        return total;
    };

    self.totalWordsForAllSectionsBeforeSection = function (sectionNumber) {
        var total = 0;

        $.each(self.sections.slice(0, sectionNumber - 1), function (index) {
            total += self.wordsForSection(index + 1).length;
        });

        return total;
    };

    self.playWordsForCurrentSection = function () {
        var sectionWords = self.wordsForCurrentSection();

        var progressBar = self.createProgressBarForCurrentSection();

        var totalSectionWords = sectionWords.length;

        sectionWords.each(function (currentWordIndex) {
            $(this).delay(currentWordIndex * WORD_DISPLAY_SPEED).fadeIn(700, function () {
                var currentProgressForSection = (currentWordIndex + 1) / totalSectionWords;
                var currentTotalProgress = (self.totalWordsForAllSectionsBeforeSection(self.currentSectionNumber) + currentWordIndex + 1) / self.totalWordsForAllSections();
                var animationCallbackFunction = currentProgressForSection == 1 ? self.showNextSectionButton() : {};
                progressBar.animate(currentProgressForSection, {duration: 100}, animationCallbackFunction);
                totalProgressBar.animate(currentTotalProgress, {duration: 100});
                //    todo is there a way to get a promise back from here to mark completion of the section?
            });
        });
    };

    function resetQuiz() {
        $('#questions-modal-body').html('');
        $('#quiz-continue-button').prop("disabled", true);
    }

    self.currentSectionHasQuizzes = function () {
        return self.currentSection().quizes.length > 0;
    };

    self.createSections = function () {
        $.each(self.sections, function (index, section) {
            $('<div>').attr('id', 'section-' + (index + 1)).addClass('section').html('<p>' + section.text + '</p>').appendTo($('#text')).hide();
        });
    };

    self.quizForCurrentSection = function (quizCompleteCallback) {
        var modal = $('#questionsModal');

        resetQuiz();

        self.currentSection().quizes.forEach(function (quiz) {
            var questionsModalBody = $('#questions-modal-body');

            $('<div id="modal-question">').html(quiz.question).appendTo(questionsModalBody);

            $.each(quiz.answers, function (index, answer) {
                $('<label class="btn btn-primary">').append(
                    $('<input type="radio" name="options" id="option' + (index + 1) + '" autocomplete="off" checked="">')
                ).append(answer)
                    .appendTo($('#questions-modal-body'));
            });

            var answers = $('#questions-modal-body label');

            $.each(answers, function (index, answer) {
                $(answer).click(function () {
                    $('#quiz-continue-button').removeAttr('disabled');
                    quiz.selectAnswer(index + 1);
                });
            });
        });

        if (self.currentSectionHasQuizzes()) {
            var continueButton = $('#quiz-continue-button');
            continueButton.unbind('click');
            continueButton.click(quizCompleteCallback);
            modal.modal();
        } else {
            quizCompleteCallback();
        }

    };

}

var sections = [
    new Section('Information about tactics can be derived from accounts of battles, but the very military manuals known to have existed and to have been used extensively by commanders, have not survived. Perhaps the greatest loss is the book of Sextus Julius Frontinus. But parts of his work were incorporated in the records of the historian Vegetius.',
        [
            new Quiz('Where did the information about roman battle tactics come from?',
                [
                    'From ancient roman texts',
                    'Derived from accounts of battle',
                    'Obtained mostly from a book written by Sextus Julius Frontinus',
                    'Obtained primarily from the historian Vegetius'
                ], 2)
        ]
    ),
    new Section('The importance of the choice of ground is pointed out.<br>There is an advantage of height over the enemy and if you are pitting infantry against cavalry, the rougher the ground the better. The sun should be behind you to dazzle the enemy. If there is strong wind it should blow away from you, giving advantage to your missiles and blinding the enemy with dust.',
        [
            new Quiz('Which is NOT one of the mentioned advantages when choosing a battle grounds?',
                [
                    'Keeping the high ground',
                    'Keeping the Sun behind you',
                    'Making sure the wind blows away from you',
                    'Using missiles against the enemy calvary'
                ], 4)
        ]
    ),
    new Section('In the battle line, each man should have three feet of space, while the distance between the ranks is given as six feet. <br>Thus 10\'000 men can be placed in a rectangle about 1\'500 yards by twelve yards, and it was advised not to extend the line beyond that.<br><br>The normal arrangement was to place the infantry in the centre and the cavalry on the wings. The function of the latter was to prevent the centre from being outflanked and once the battle turned and the enemy started to retreat the cavalry moved forward and cut them down. - Horsemen were always a secondary force in ancient warfare, the main fighting being done by the infantry.',
        [
            new Quiz('What were horsemen always considered in ancient warfare?',
                [
                    'A secondary force',
                    'The most critical force in the battle',
                    'Weaker than infantry forces',
                    'A force to drive the enemy to retreat'
                ], 1)
        ]
    )
];

$(document).ready(function () {
    totalProgressBar = new ProgressBar.Line('#total-progress-bar', {
        color: '#FCB03C'
    });

    var beginButton = $('#begin-learning');

    beginButton.click(function () {
        beginButton.hide();

        var firstSection = $('#section-1');
        firstSection.show();

        quizzer.playWordsForCurrentSection();
    });

    var nextSectionButton = $('#next-section');

    nextSectionButton.hide();
    nextSectionButton.click(function () {
        nextSectionButton.hide();
        var currentSectionText = $('section-' + quizzer.currentSectionNumber);

        currentSectionText.hide();
        currentSectionText.show();

        quizzer.quizForCurrentSection(
            function () {
                //todo use self.sections instead? Should require moving into quizzer object
                var quiz = sections[quizzer.currentSectionNumber - 1].getFirstQuiz();

                var questionsModalDiv = $('#questionsModal');
                questionsModalDiv.modal('hide');

                var resultModalBody = $('#result-modal-body');
                var result = quiz.correct() ? 'Correct!' : 'Wrong :(';
                var resultDetails = quiz.correct() ? '' : 'The correct answer was: ' + quiz.correctAnswerText();
                resultModalBody.html(
                    'You were ' + result +
                    '<br>' + '<br>' + resultDetails
                );
                var resultModal = $('#resultModal');
                var resultContinueButton = $('#result-continue-button');
                resultContinueButton.unbind('click');
                resultContinueButton.click(function () {
                    resultModal.modal('hide');

                    quizzer.nextSection();

                    var currentSection = $('#section-' + quizzer.currentSectionNumber);
                    currentSection.show();

                    quizzer.playWordsForCurrentSection();
                });

                resultModal.modal();
            }
        );
    });


    $(document).keypress(function (e) {
        if (nextSectionButton.is(':visible') && e.keyCode == 13) {
            nextSectionButton.click();
        }
    });

    var quizzer = new Quizzer(sections);

    quizzer.createSections();

    quizzer.blastWords();

    quizzer.hideAllWords();

//    todo add full progress bar (reading of entire document)
//    todo when hitting esc or not answering question, no way to continue to next section

});
