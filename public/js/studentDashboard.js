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

    var submitButton = document.querySelector('#askQuestionButton');

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    function addButtonEvent (button, textarea) {
        button.addEventListener('click', function (event) {
            if (isEmpty(textarea)) {
                M.toast({
                    html: 'Please enter your question.'
                });
                textarea.focus()
            } else {
                var data = {
                    question: $('#question').val(),
                    name: event.target.dataset.name
                }
                const url = '/students/askQuestion';

                $.ajax(url, {
                    type: 'POST',
                    data,
                    success: (function () {
                        M.toast({html: 'Question sent successfully'});
                        textarea.value = '';
                    })
                }).fail(function () {
                    M.toast({
                        html: 'Error! Question not sent'
                    });
                });
            }
        }, false);
    }

    addButtonEvent(submitButton, question);
});