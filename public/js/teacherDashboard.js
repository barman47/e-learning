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

    var uploadInputs = [
        uploadForm.file,
        uploadForm.subjectCategory,
        uploadForm.bookTitle
    ];
    var uploadButton = document.querySelector('#uploadButton');

    var question = document.querySelector('.question');
    var answer = document.querySelector('.answer');
    var answerButton = document.querySelectorAll('.answerBtn');

    var deleteButton = document.querySelectorAll('.delete-icons');
    var url = '/upload/';
    data = {
        subject: uploadInputs[1],
        file: uploadInputs[0].value
    };

    function handleDeleteRequest () {
        deleteButton.forEach((deleteButton) => {
            deleteButton.addEventListener('click', function (e) {
                const id = e.target.attributes[2].value;
                path = e.target.parentElement.childNodes[0].attributes[0].nodeValue;
                e.target.parentElement.remove();
                const url = '/deleteMaterial';
                data = {id, path};
                $.ajax({  
                    url,
                    type: 'DELETE',  
                    data,  
                    success: function (data, textStatus, xhr) {  
                        M.toast({html: 'File Deleted Successfully'});
                    },  
                    error: function (xhr, textStatus, errorThrown) {  
                        M.toast({html: 'Error! File not Deleted'});
                    }  
                });
            });
        });
    }

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    function submitUploadForm (event) {        
        for (var i = 0; i < uploadInputs.length; i++) {
            if (isEmpty(uploadInputs[i])) {
                event.preventDefault();
                uploadInputs[i].classList.add('invalid');
                uploadInputs[i].focus();
                M.toast({html: 'Please provide book and details to upload'});
                break;
            }
        }
    }

    uploadForm.addEventListener('submit', submitUploadForm, false);

    answerButton.forEach(function (answerButton) {
        answerButton.addEventListener('click', function (e) {
            const question = e.target.parentElement.parentElement.childNodes[1].innerHTML;
            const askedBy = e.target.parentElement.parentElement.childNodes[3].childNodes[1].innerHTML;
            const answer = e.target.parentElement.childNodes[1];
            const answeredBy = document.querySelector('#navigation').getAttribute('data-teacher');
            const id = e.target.parentElement.parentElement.childNodes[1].attributes[1].nodeValue;
            if (isEmpty(answer)) {
                M.toast({html: 'Please provide an answer to this question'});
                answer.classList.add('invalid');
                answer.focus();
            } else {
                const url = '/teachers/answeredQuestions';
                const data = {
                    id,
                    question,
                    answer: answer.value,
                    askedBy,
                    answeredBy
                };
                $.ajax(url, {
                    method: 'POST',
                    data,
                    success: function () {
                        e.target.parentElement.parentElement.remove();
                        M.toast({html: 'Question answered Successfully'});
                    }
                }).fail(function () {
                    M.toast({html: 'Error! Something Went wrong. Please try again'});
                });
            }
        }, false);
    });
    handleDeleteRequest();
});
