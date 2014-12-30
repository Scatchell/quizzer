var OFFSET = .05;

jQuery.expr[':'].regex = function (elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};


//function moveToNextSection() {
//}

$(document).ready(function () {
    var currentSection = "section-1";

    $(".section").blast({
        delimiter: 'word',
        tag: 'span',
        customClass: 'word',
        generateIndexID: true
    });

    var allWords = $("span[id^='word-']");

    allWords.hide();

    //moveToNextSection();
    var progressBar = new ProgressBar.Line('#progress-bar', {
        color: '#FCB03C'
    });

    var sectionWords = $("div#section-1 > span[id^='word-']");

    var totalSectionWords = sectionWords.length;

    sectionWords.each(function (currentWordIndex) {
        $(this).delay(currentWordIndex * 100).fadeIn(700, function () {
            var currentProgress = (currentWordIndex + 1) / totalSectionWords;
            progressBar.animate(currentProgress, {duration: 100});
        });
    });

//    todo move on to next section
//    todo fashion quiz question ideas

});
