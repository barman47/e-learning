$(document).ready(function () {
    var forms = {
        student: document.forms.studentLoginForm,
        teacher: document.forms.TeacherLoginForm
    };

    var studentInputs = [
        [forms.student.studentEmail, document.querySelector('#studentEmailErrorMessage')], 
        [forms.student.studentPassword, document.querySelector('#studentPasswordErrorMessage')]
    ];
    var teacherInputs = [
        [forms.teacher.teacherEmail, document.querySelector('#teacherEmailErrorMessage')], 
        [forms.teacher.teacherPassword, document.querySelector('#teacherPasswordErrorMessage')]
    ];

    var buttons = {
        student: document.querySelector('#studentLoginButton'),
        teacher: document.querySelector('#teacherLoginButton')
    };

    var emailRegExp = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    function submitForm (form, inputsArr) {
        form.addEventListener('submit', function (event) {
            for (var i = 0; i < inputsArr.length; i++) {
                if (isEmpty(inputsArr[i][0])) {
                    event.preventDefault();
                    inputsArr[i][0].classList.add('invalid');
                    inputsArr[i][0].focus();
                    break;
                }
            }
        }, false);
    }

    function handleButtonClick (form, button, inputsArr) {
        form.addEventListener('submit', function (event) {
            for (var i = 0; i < inputsArr.length; i++) {
                if (isEmpty(inputsArr[i][0])) {
                    event.preventDefault();
                    inputsArr[i][0].classList.add('invalid');
                    inputsArr[i][0].focus();
                    break;
                }
            }
        }, false);
    }

    function addKeyupEvent (emailField) {
        emailField.addEventListener('keyup', function (event) {
            if (emailRegExp.test(emailField.value)) {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            } else {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            }
        }, false);
    }

    function addFocusoutEvent (emailField) {
        emailField.addEventListener('focusout', function (event) {
            if (emailRegExp.test(emailField.value)) {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            } else {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                emailField.focus();
                M.toast({
                    html: 'Please provide a valid email to continue.'
                });
            }
        }, false);
    }
    
    addKeyupEvent(studentInputs[0][0]);
    addFocusoutEvent(studentInputs[0][0]);
    submitForm(forms.student, studentInputs);
    handleButtonClick(forms.student, buttons.student, studentInputs);

    addKeyupEvent(teacherInputs[0][0]);
    addFocusoutEvent(teacherInputs[0][0]);
    submitForm(forms.teacher, teacherInputs);
    handleButtonClick(forms.teacher, buttons.teacher, teacherInputs);

    $('.pushpin').pushpin({
        top: $('.pushpin').offset().top,            
    });
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown({hover: true});
    $('.parallax').parallax();
    $('.collapsible').collapsible();
    $('.scrollspy').scrollSpy();
    $('.modal').modal({
        preventScrolling: true
    });
    $('.tooltipped').tooltip({
        html: '<span style="color: orange;">Close</span>'
    });
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
});