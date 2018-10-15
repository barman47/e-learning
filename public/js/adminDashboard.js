$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();

    const courseForm =  $('#addCourseForm');
    const course = $('#course');
    const courseButton = $('#buttonAddCourse');
    const url = '/admins/addCourse';

    courseForm.on('submit', function (event) {
        const data = {
            course: course.val()
        };
        event.preventDefault();
        if (course.val() === '' || course.val().trim() === '') {
            M.toast({html: 'Please provide a course name'});
            $('#course').addClass('invalid');
            $('#course').focus();
        } else {
            $.ajax(url, {
                type: 'POST',
                data,
                success: (function () {
                    M.toast({html: 'Course added Successfully'});
                    course.val('');
                    course.focus();
                })
            }).fail(function () {
                M.toast({
                    html: 'Error! Course not uploaded. Try again.'
                });
            });
        }
    });
});