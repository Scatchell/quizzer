var WORD_DISPLAY_SPEED = 5;
var BEGIN_REPEATING_QUIZZES_SECTION_NUM = 2;
var REPEAT_QUIZZES_FREQUENCY = 2;

function Quizzer(sections, randomizerCallback) {
    function randomizer(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    var self = this;
    self.randomizer = (randomizerCallback == undefined ? randomizer : randomizerCallback);

    self.currentSectionNumber = 1;

    self.sections = sections;

    function incorrectlyAnsweredQuizzes() {
        var incorrectQuizzes = [];

        self.sections.forEach(function (section) {
            incorrectQuizzes = incorrectQuizzes.concat(section.incorrectQuizzes());
        });

        return incorrectQuizzes;
    }

    function correctlyAnsweredQuizzes() {
        var incorrectQuizzes = [];

        self.sections.forEach(function (section) {
            incorrectQuizzes = incorrectQuizzes.concat(section.correctQuizzes());
        });

        return incorrectQuizzes;
    }

    self.selectRepeatQuiz = function () {
        var repeatQuiz;

        var incorrectQuizzes = incorrectlyAnsweredQuizzes();

        if (incorrectQuizzes.length == 0) {
            repeatQuiz = self.randomizer(correctlyAnsweredQuizzes());
        } else {
            repeatQuiz = incorrectQuizzes[0];
        }

        return repeatQuiz;
    };

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

    self.onLastSection = function () {
        return self.currentSectionNumber == sections.length;
    };

    self.nextSection = function () {
        self.currentSectionNumber += 1;

        //todo repeat wrong quizzes always if they exist, only repeat correct quizzes with repeat frequency
        if (self.currentSectionNumber >= BEGIN_REPEATING_QUIZZES_SECTION_NUM && (self.currentSectionNumber % REPEAT_QUIZZES_FREQUENCY == 0)) {
            self.currentSection().addQuiz(self.selectRepeatQuiz());
        }
    };

    self.showNextSectionButton = function () {
        $('#next-section').show();
    };

    self.currentSection = function () {
        return self.sections[self.currentSectionNumber - 1];
    };

    self.getSection = function (sectionNumber) {
        return self.sections[sectionNumber - 1];
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
                var animationCallbackFunction = (currentProgressForSection == 1 && !self.onLastSection() ? self.showNextSectionButton() : {});
                progressBar.animate(currentProgressForSection, {duration: 100}, animationCallbackFunction);
                totalProgressBar.animate(currentTotalProgress, {duration: 100});
                //    todo is there a way to get a promise back from here to mark completion of the section?
            });
        });
    };

    function resetQuizElements() {
        $('#questions-modal-body').html('');
        $('#quiz-continue-button').prop("disabled", true);
    }

    self.currentSectionHasQuizzes = function () {
        return self.currentSection().quizzes.length > 0;
    };

    self.createSections = function () {
        $.each(self.sections, function (index, section) {
            $('<div>').attr('id', 'section-' + (index + 1)).addClass('section').html('<p>' + section.text + '</p>').appendTo($('#text')).hide();
        });
    };

    //todo highlight the most previous section in some color to make it stand out
    function setupQuiz(quiz) {
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
    }

    function hideQuestionsModal() {
        var questionsModalDiv = $('#questions-modal');
        questionsModalDiv.modal('hide');
    }

    function quizCheck(quiz, nextQuizCallback) {
        var resultModalBody = $('#result-modal-body');
        var result = quiz.correct() ? 'Correct!' : 'Wrong :(';
        var resultDetails = quiz.correct() ? '' : 'The correct answer was: ' + quiz.correctAnswerText();
        resultModalBody.html(
            'You were ' + result +
            '<br>' + '<br>' + resultDetails
        );
        var resultModal = $('#result-modal');
        var resultContinueButton = $('#result-continue-button');
        resultContinueButton.unbind('click');
        resultContinueButton.click(function () {
            resultModal.modal('hide');

            if (self.currentSection().onLastQuiz()) {
                self.nextSection();

                var nextSectionButton = $('#next-section');
                nextSectionButton.hide();

                var currentSection = $('#section-' + self.currentSectionNumber);
                currentSection.show();

                self.playWordsForCurrentSection();
            } else {
                nextQuizCallback();
            }
        });

        resultModal.modal();
    }

    self.quizzesForCurrentSection = function () {
        var quiz = self.currentSection().currentQuiz();

        resetQuizElements();
        setupQuiz(quiz);

        function quizCompleteCallback() {
            hideQuestionsModal();

            quizCheck(quiz, self.quizzesForCurrentSection);

            //todo if hitting enter key too fast, the next section button doesnt work due to js errors - fix this
            if (!self.currentSection().onLastQuiz()) {
                self.currentSection().nextQuiz();
            }
        }

        if (self.currentSectionHasQuizzes()) {
            var continueButton = $('#quiz-continue-button');
            continueButton.unbind('click');

            continueButton.click(quizCompleteCallback);

            var modal = $('#questions-modal');
            modal.modal();
        } else {
            quizCompleteCallback();
        }

    };

}

$(document).ready(function () {
    totalProgressBar = new ProgressBar.Line('#total-progress-bar', {
        color: '#7CFC3F'
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
        quizzer.quizzesForCurrentSection();
    });


    $(document).keyup(function (e) {
        var quizContinueButton = $('#quiz-continue-button');
        if ($('#questions-modal-body').is(':visible')) {
            //49-51 are keys 1,2,3,4
            if (e.keyCode == 49) {
                $('#option1').click();
            } else if (e.keyCode == 50) {
                $('#option2').click();
            } else if (e.keyCode == 51) {
                $('#option3').click();
            } else if (e.keyCode == 52) {
                $('#option4').click();
                //    todo add avoiding click when button disabled
                //tried && (quizContinueButton.prop("disabled") == false) but didn't work
            } else if (e.keyCode == 13 && (quizContinueButton.prop("disabled") == false)) {
                quizContinueButton.click();
            }
        } else {
            var resultContinueButton = $('#result-continue-button');
            if (resultContinueButton.is(':visible') && e.keyCode == 13) {
                resultContinueButton.click();
            } else if (nextSectionButton.is(':visible') && e.keyCode == 13) {
                nextSectionButton.click();
            }
        }

    });

    var sections = [
        new Section('Information about tactics can be derived from accounts of battles, but the very military manuals known to have existed and to have been used extensively by commanders, have not survived. Perhaps the greatest loss is the book of Sextus Julius Frontinus. But parts of his work were incorporated in the records of the historian Vegetius.',
            [
                new Quiz('Where did most of the information about roman battle tactics come from?',
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
                        'Choosing a natural defensive barrier'
                    ], 4)
            ]
        ),
        new Section('In the battle line, each man should have three feet of space, while the distance between the ranks is given as six feet. <br>\
        Thus 10\'000 men can be placed in a rectangle about 1\'500 yards by twelve yards, and it was advised not to extend the line beyond that.<br><br>\
        The normal arrangement was to place the infantry in the centre and the cavalry on the wings. The function of the latter was to prevent the centre from being outflanked and once the battle turned and the enemy started to retreat the cavalry moved forward and cut them down. - Horsemen were always a secondary force in ancient warfare, the main fighting being done by the infantry.<br><br>\
        It was recommended that if your cavalry was weak it was to be stiffened with lightly armed foot soldiers.',
            [
                new Quiz('What were horsemen always considered in ancient warfare?',
                    [
                        'A secondary force',
                        'The most critical force in the battle',
                        'Weaker than infantry forces',
                        'A force to drive the enemy to retreat'
                    ], 1)
            ]
        ),
        new Section("Vegetius also stresses the need for adequate reserves. These could prevent an enemy from trying to envelope one's own forces, or could fend off enemy cavalry attacking the rear of the infantry.<br><br>\
            Alternatively, they could themselves move to the sides and perform an enveloping manoeuver against an opponent.<br><br>\
            The position to be taken up by the commander was normally on the right wing.",
            [
                new Quiz('What was NOT one of the mentioned benefits of having adequate reserves?',
                    [
                        'Attack the rear of the enemy infantry',
                        'Preventing an enemy from enveloping your forces',
                        'Fend off enemy calvary attacking the rear of the infantry',
                        'Move to the sides and perform an enveloping maneuver against an opponent'
                    ], 1)
            ]
        ),
        new Section("The tortoise was essentially a defensive formation by which the legionaries would hold their shields overhead, except for the front rows, thereby creating a kind of shell-like armour shielding them against missiles from the front or above.",
            [
                new Quiz('The tortoise was NOT...',
                    [
                        'A formation meant to fend particularly against missiles',
                        'A formation requiring shields to be held overhead',
                        'A formation requiring shields to be held in the front',
                        'A formation requiring shields to be held in the back'
                    ], 4)
            ]
        ),
        new Section("The wedge was commonly used by attacking legionaries, - legionaries formed up in a triangle, the front 'tip' being one man and pointing toward the enemy - this enabled small groups to be thrust well into the enemy and, when these formations expanded, the enemy troops were pushed into restricted positions, making hand-to-hand fighting difficult. This is where the short legionary gladius was useful, held low and used as a thrusting weapon, while the longer Celtic and Germanic swords became impossible to wield.",
            [
                new Quiz('The wedge formation would push enemy troops into restricted positions. Why was it mentioned this was particularly effective when fighting the Celtic and Germanic tribes?',
                    [
                        'They were less organized than the roman forces.',
                        'The romans could more easily use their long weapons, while their enemies couldn\'t as easily use their shorter weapons',
                        'The romans could more easily use their short weapons, while their enemies couldn\'t as easily use their long weapons',
                        'The romans could more effectively defend with their large shields'
                    ], 3),
                new Quiz('What was the name of the short legionary thrusting weapon?',
                    [
                        'Short Sword',
                        'Gladiator',
                        'Wedge',
                        'Gladius'
                    ], 4)
            ]
        ),
        new Section("The order to repel cavalry brought about the following formation. The first rank would form a firm wall with their shields, only their pila protruding, forming a vicious line of glistening spearheads ahead of the wall of shields. A horse, however well trained, could hardly be brought to break through such a barrier. The second rank of the infantry would then use its spears to drive off any attackers whose horses came to a halt. This formation would no doubt prove very effective, particularly against ill-disciplined enemy cavalry.", [
                new Quiz('Based on the context of the paragraph, what is a pila?',
                    [
                        'A spear',
                        'A sword',
                        'A shield'
                    ], 1),
                new Quiz('Once the horses were stopped via the first ranks shield wall and pila, what would happen?',
                    [
                        'The back rank would fire missiles at the slowed calvary',
                        'The second rank of infantry would use its spears to drive off any calvary that had come to a stop.',
                        'The first rank would switch to their gladius and enter melee combat with the fallen horsemen',
                        'The ranks would do nothing, and wait for the calvary to charge again'
                    ], 2)
            ]
        )
    ];

    var quizzer = new Quizzer(sections);

    quizzer.createSections();

    quizzer.blastWords();

    quizzer.hideAllWords();

})
;
