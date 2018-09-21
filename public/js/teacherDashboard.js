$(document).ready(function () {
    $('.pushpin').pushpin({
        top: $('.pushpin').offset().top,
    });
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown({hover: true});
    $('.fixed-action-btn').floatingActionButton({hoverEnabled: true});
    $('.tooltipped').tooltip({position: 'left'});
    $('.scrollspy').scrollSpy();
    $('.modal').modal();
    $('select').formSelect();
    $('#top').on('click', function (event) {
        if (this.hash !== '') {
            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {
                window.location.hash = hash;
            });
        }
    });

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById('top').style.display = 'block';
        } else {
            document.getElementById('top').style.display = 'none';
        }
    };

    var uploadForm = document.forms.uploadForm;
    var uploadField = uploadForm.fileField;
    var file = uploadForm.file;
    var subjectCategory = uploadForm.subjectCategory;
    var uploadButton = document.querySelector('#uploadButton');

    var question = document.querySelector('.question');
    var answer = document.querySelector('.answer');
    var answerButton = document.querySelector('.answerBtn');

    var url = '/upload/';
    data = {
        subject: subjectCategory,
        file: file.value
    };

    function uploadFile (event) {
        if (isEmpty(uploadField) || subjectCategory.value === "") {
            event.preventDefault();
            M.toast({html: 'Please provide a file to upload and select a subject category'});
        } //else {
        //     event.preventDefault();
        //     $.ajax(url, {
        //         method: 'POST',
        //         data,
        //         success: function () {
        //             M.toast({html: 'File uploaded successfully'});
        //         }
        //     }).fail(function () {
        //         M.toast({html: 'Error! File not uploaded'});
        //     });
        // }
    }

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    uploadForm.addEventListener('submit', uploadFile, false);

    answerButton.addEventListener('click', function (event) {
        if (isEmpty(answer)) {
            M.toast({html: 'Please provide an answer to this question'});
            answer.focus();
        } else {
            //var parentDiv = event.target.parentElement.parentElement;
            console.log(event);
            // console.log(event.target.dataset.by);
            // var url = '/teachers/answeredQuestions';
            // var data = {
            //     answer: answer.value,
            //     question: question.innerHTML,
            //     idToRemove: event.target.parentElement.previousElementSibling.previousElementSibling.dataset.id
            //     // answeredBy:
            // };

            // $.ajax(url, {
            //     method: 'POST',
            //     data,
            //     success: function () {
            //     }
            // }).fail(function () {

            // });
        }
    }, false);

    answer.addEventListener('focusout', function () {
        if (isEmpty(answer)) {
            M.toast({html: 'Please provide an answer to this question'});
            answer.focus();
        }
    }, false);
});
