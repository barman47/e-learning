$(document).ready(function () {
    var forms = {
        teacher: document.forms.TeacherLoginForm,
        admin: document.forms.adminLogin
    };
    var teacherInputs = [
        [forms.teacher.teacherID, document.querySelector('#teacherIDErrorMessage')], 
        [forms.teacher.teacherPassword, document.querySelector('#teacherPasswordErrorMessage')]
    ];

    var adminInputs = [
        [forms.admin.adminUsername, document.querySelector('#adminUsernameErrorMessage')], 
        [forms.admin.adminPassword, document.querySelector('#adminPasswordErrorMessage')]
    ];

    var teacherIDRegExp = /^NASS\/TU\/[0-9]{1,5}$/i;

    const url = '/teachers/login';
    let data = {
        teacherID: $('#teacherID').val(),
        teacherPassword: $('#teacherPassword').val()
    };
    let adminData = {
        adminUsername: $('#adminUsername').val(),
        adminPassword: $('#adminPassword').val()
    };

    function ajaxLogin (form) {
        $.ajax(url, {
            type: 'POST',
            data,
            succes: success(function () {
                form.reset();
            })
        }).fail(function () {
            M.toast({
                html: 'Invalid ID or Password!'
            });
            // document.querySelector('#incorrectStudentData').style.display = 'block';
        });
    }
    function adminAjaxLogin (form) {
        $.ajax('/admins/login', {
            type: 'POST',
            adminData,
            succes: success(function () {
                form.reset();
            })
        }).fail(function () {
            M.toast({
                html: 'Invalid ID or Password!'
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
            if (isEmpty(inputsArr[0][0])) {
                event.preventDefault();
                inputsArr[0][0].classList.add('invalid');
                inputsArr[0][0].focus();
            } else if (isEmpty(inputsArr[1][0])) {
                event.preventDefault();
                inputsArr[1][0].classList.add('invalid');
                inputsArr[1][0].focus();
            } else {
                document.querySelector('#teacherPreloader').style.display = 'block';
                form.disabled = true;
                setTimeout(function () {
                    ajaxLogin(form);
                }, 2000);
            }
        }, false);
    }

    function addKeyupEvent (teacherID) {
        teacherID.addEventListener('keyup', function (event) {
            if (teacherIDRegExp.test(teacherID.value)) {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            } else {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            }
        }, false);
    }

    function addFocusoutEvent (teacherID) {
        teacherID.addEventListener('focusout', function (event) {
            if (teacherIDRegExp.test(teacherID.value)) {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            } else {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                teacherID.focus();
            }
        }, false);
    }

    addKeyupEvent(teacherInputs[0][0]);
    addFocusoutEvent(teacherInputs[0][0]);
    submitForm(forms.teacher, teacherInputs);

    submitForm(forms.admin, adminInputs);
});