$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    $('select').formSelect();
    
    var courseForm =  $('#addCourseForm');
    var removeCourseForm = $('#removeCourseForm');
    var course = $('#course');
    var url = '/admins/addCourse';
    
    $('#removeCourseButton').addClass('disabled');

    $('#removeCourse').on('change', function (event) {
        if (event.target.value === '') {
            $('#removeCourseButton').addClass('disabled');
        } else {
            $('#removeCourseButton').removeClass('disabled');
        }
    });

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

    removeCourseForm.on('submit', function (event) {
        if ($('#removeCourse').val() === '' || $('#removeCourse').val().trim() === '') {
            M.toast({ html: 'Please select a Course to remove' });
        } else {
            $.ajax('/admins/removeCourse', {
                type: 'POST',
                data: {
                    courseToRemove: $('#removeCourse').val()
                },
                success: (function () {
                    M.toast({html: 'Course Removed Successfully'});
                    setTimeout(function () {
                        location.reload();
                    }, 4000);
                })
            }).fail(function () {
                M.toast({
                    html: 'Error! Could not remove Course. Try again.'
                });
            });
        }
    });
});