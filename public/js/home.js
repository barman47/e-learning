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

    const url = '/students/login';
    let data = {
        studentEmail: $('#studentEmail').val(),
        studentPassword: $('#studentPassword').val()
    };

    function ajaxLogin (form) {
        $.ajax(url, {
            type: 'POST',
            data
        }).success(function () {
            form.reset();
        }).fail(function () {
            M.toast({
                html: 'Invalid Email or Password!'
            });
            // document.querySelector('#incorrectStudentData').style.display = 'block';
        });
    }

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    function submitForm (form, inputsArr) {
        form.addEventListener('submit', function (event) {
            if (isEmpty(inputArr[0][0])) {
                event.preventDefault();
                inputsArr[0][0].classList.add('invalid');
                inputsArr[0][0].focus();
            } else if (isEmpty(inputsArr[1][0])) {
                event.preventDefault();
                inputsArr[1][0].classList.add('invalid');
                inputsArr[1][0].focus();
            } else {
                ajaxLogin(form);
            }
        }, false);
    }

    function handleButtonClick (button, inputsArr) {
        button.addEventListener('click', function (event) {
            if (isEmpty(inputsArr[0][0])) {
                event.preventDefault();
                inputsArr[0][0].classList.add('invalid');
                inputsArr[0][0].focus();
            } else if (isEmpty(inputsArr[1][0])) {
                event.preventDefault();
                inputsArr[1][0].classList.add('invalid');
                inputsArr[1][0].focus();
            } else {
                ajaxLogin(form);
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
                // M.toast({
                //     html: 'Please provide a valid email to continue.'
                // });
            }
        }, false);
    }
    
    addKeyupEvent(studentInputs[0][0]);
    addFocusoutEvent(studentInputs[0][0]);
    submitForm(forms.student, studentInputs);
    handleButtonClick(buttons.student, studentInputs);

    addKeyupEvent(teacherInputs[0][0]);
    addFocusoutEvent(teacherInputs[0][0]);
    submitForm(forms.teacher, teacherInputs);
    handleButtonClick(buttons.teacher, teacherInputs);

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