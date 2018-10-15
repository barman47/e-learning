$(document).ready(function () {
    var forms = {
        student: document.forms.studentLoginForm,
        teacher: document.forms.TeacherLoginForm
    };

    var studentInputs = [
        [forms.student.regNo, document.querySelector('#regNoErrorMessage')], 
        [forms.student.studentPassword, document.querySelector('#studentPasswordErrorMessage')]
    ];
    var teacherInputs = [
        [forms.teacher.teacherEmail, document.querySelector('#teacherIDErrorMessage')], 
        [forms.teacher.teacherPassword, document.querySelector('#teacherPasswordErrorMessage')]
    ];

    var buttons = {
        student: document.querySelector('#studentLoginButton'),
        teacher: document.querySelector('#teacherLoginButton')
    };

    var regNoRegExp = /^NASS\/SD\/[0-9]{1,5}$/i;

    var preloaders = {
        student: $('#studentPreloader'),
        teacher: $('#teacherPreloader'),
    };

    const studentUrl = '/students/login';
    const teacherUrl = '/teachers/login';
    const adminUrl = '/admins/login';
    let studentData = {
        regNo: $('#regNo').val(),
        studentPassword: $('#studentPassword').val()
    };

    let teacherData = {
        teacherID: $('#teacherID').val(),
        studentPassword: $('#teacherPassword').val()
    };

    let adminData = {
        adminUsername: $('#adminUsername').val(),
        adminPassword: $('#adminPassword').val()
    }

    function studentAjaxLogin (form) {
        $.ajax(studentUrl, {
            type: 'POST',
            studentData,
            succes: success(function () {
                form.reset();
            })
        }).fail(function () {
            M.toast({
                html: 'Invalid Email or Password!'
            });
        });
    }

    function studentAjaxLogin (form) {
        $.ajax(teacherUrl, {
            type: 'POST',
            studentData,
            succes: success(function () {
                form.reset();
            })
        }).fail(function () {
            M.toast({
                html: 'Invalid ID or Password!'
            });
        });
    }
    function adminAjaxLogin (form) {
        $.ajax(adminUrl, {
            type: 'POST',
            studentData,
            succes: success(function () {
                form.reset();
            })
        }).fail(function () {
            M.toast({
                html: 'Invalid ID or Password!'
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

    function submitForm (form, inputsArr) {
        form.addEventListener('submit', function (event) {
            if (isEmpty(inputsArr[0][0])) {
                event.preventDefault();
                inputsArr[0][0].classList.add('invalid');
                inputsArr[0][0].focus();
            } else if (isEmpty(inputsArr[1][0])) {
                event.preventDefault();
                inputsArr[1][0].classList.add('invalid');
                inputsArr[1][0].focus();
            } else {
                document.querySelector('#studentPreloader').style.display = 'block';
                document.querySelector('#teacherPreloader').style.display = 'block';
                form.disabled = true;
                setTimeout(function () {
                    studentAjaxLogin(form);
                }, 2000);
            }
        }, false);
    }

    function addKeyupEvent (regNo) {
        regNo.addEventListener('keyup', function (event) {
            if (regNoRegExp.test(regNo.value)) {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            } else {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            }
        }, false);
    }

    function addFocusoutEvent (regNo) {
        regNo.addEventListener('focusout', function (event) {
            if (regNoRegExp.test(regNo.value)) {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            } else {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                regNo.focus();
            }
        }, false);
    }
    
    addKeyupEvent(studentInputs[0][0]);
    addFocusoutEvent(studentInputs[0][0]);
    submitForm(forms.student, studentInputs);

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