$( document ).ready(function() {
    localStorage.clear();
    /*-----------Изменить название задачи--------------*/
    $('body').on('click', ".change", function() {
       $(this).prevAll().eq(1).attr("disabled", '');
       $(this).prev().removeAttr("readonly");
       $(this).prev().css("cursor", "text");
       $(this).prev().addClass("active");
       $(this).addClass("hide");
       $(this).next().removeClass("hide");
    });
    $('body').on('click', ".save", function() {
        $(this).prevAll().eq(2).removeAttr("disabled");
        $(this).prevAll().eq(1).attr("readonly", '');
        $(this).prevAll().eq(1).css("cursor", "default");
        $(this).prevAll().eq(1).removeClass("active");
        $(this).prev().removeClass("hide");
        $(this).addClass("hide");
    });
    /*-------------------------------------------------*/

    $('body').on('click', ".move", function() {
        $(this).next().toggleClass("hide");
    });
    $('body').on('click', ".statuses", function() {
        moveTo($(this).parent().parent(), ".listStatuses");
    });
    $('body').on('click', ".pending", function() {
        moveTo($(this).parent().parent(), ".listPending");
    });
    $('body').on('click', ".cancel", function() {
        moveTo($(this).parent().parent(), ".listCancel");
    });
    $('body').on('click', ".done", function() {
        moveTo($(this).parent().parent(), ".listDone");
    });
    $('body').on('click', ".backlog", function() {
        moveTo($(this).parent().parent(), ".listBacklog");
    });

    $('body').on('click', ".check", function() {
        if ($(this).prop('checked')) {
            completeTask($(this).parent());
        } else {
            returnTask($(this).parent());
        }
    });

    function lsTest(){
        var test = 'test';
        try {
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch(e) {
          return false;
        }
    }

    let c = 0;
    let checked = false;
    let listState = document.querySelector(".listStatuses");
    if(lsTest() === true){
        if (!localStorage.length == 0) {
            for (let key in localStorage) {
                if (c < localStorage.length) {
                    let localTask = JSON.parse(localStorage.getItem(key));
                    if (localTask.state == true) {
                        listState = document.querySelector(".listStatuses");
                        checked = false;
                    } else {
                        listState = document.querySelector(".listDone");
                        checked = true;
                    }
                    htmlTask(localTask.name, listState, checked);
                }
                c++;
            }
        }
    }
    function moveTo(li, newLi) {
        li.detach().appendTo(newLi);
        li.find('.block__move_buttons').addClass('hide');
    }
    function completeTask(li) {
        li.detach().appendTo(".listDone");
        let taskName = li.find("[type = text]").val();
        let task = JSON.parse(localStorage.getItem(taskName));
        task.state = false;
        localStorage.setItem(taskName, JSON.stringify(task));
    }

    function returnTask(li) {
        li.detach().appendTo(".listStatuses");        
    }

    let list = $(".listStatuses");
    $('#newTask_add').on('click', function() {
        let newTask_value = $("#newTask_value").val();
        if (newTask_value != "") {
            listState = document.querySelector(".listStatuses");
            addTask(newTask_value, listState);
        }
        $("#newTask_value").val("");
    });
   
    function addTask(newTask_value, listState) {
        htmlTask(newTask_value, listState, false);
        let task = {};
        task.name = newTask_value;
        task.state = true;
        localStorage.setItem(newTask_value, JSON.stringify(task));
    }

    function htmlTask(newTask_value, listState, checked) {
        let ul = listState;
        let li = document.createElement('li');
        li.classList.add('task');
        let input_checkbox = document.createElement('input');
        input_checkbox.setAttribute('type', "checkbox");
        if (checked == true) {
            input_checkbox.setAttribute('checked', '');
        }
        input_checkbox.classList.add('check');
        let input_text = document.createElement('input');
        input_text.setAttribute('type', "text");
        input_text.setAttribute('value', newTask_value);
        input_text.setAttribute('readonly', '');

        let button_change = document.createElement('button');
        button_change.classList.add('change');
        let i_pencil = document.createElement('i');
        i_pencil.classList.add('fas');
        i_pencil.classList.add('fa-pencil-alt');
        i_pencil.classList.add('fa-lg');
        button_change.appendChild(i_pencil);
        let button_save = document.createElement('button');
        button_save.classList.add('save');
        button_save.classList.add('hide');
        let i_check = document.createElement('i');
        i_check.classList.add('fas');
        i_check.classList.add('fa-check-circle');
        i_check.classList.add('fa-lg');
        button_save.appendChild(i_check);
        let button_move = document.createElement('button');
        button_move.classList.add('move');
        let i_move = document.createElement('i');
        i_move.classList.add('fas');
        i_move.classList.add('fa-arrows-alt');
        i_move.classList.add('fa-lg');
        button_move.appendChild(i_move);

        move_buttons = htmlMoveButtons();

        li.appendChild(input_checkbox);
        li.appendChild(input_text);

        li.appendChild(button_change);
        li.appendChild(button_save);
        li.appendChild(button_move);

        li.appendChild(move_buttons);
       
        ul.appendChild(li);
    }
    function htmlMoveButtons() {
        let move_buttons = document.createElement('div');
        move_buttons.classList.add('hide');
        move_buttons.classList.add('block__move_buttons');

        let button_statuses = document.createElement('button');
        button_statuses.classList.add('statuses');
        let i_ellipsis = document.createElement('i');
        i_ellipsis.classList.add('fas');
        i_ellipsis.classList.add('fa-ellipsis-h');
        i_ellipsis.classList.add('fa-lg');
        button_statuses.appendChild(i_ellipsis);
        move_buttons.appendChild(button_statuses);

        let button_pending = document.createElement('button');
        button_pending.classList.add('pending');
        let i_clock = document.createElement('i');
        i_clock.classList.add('fas');
        i_clock.classList.add('fa-clock');
        i_clock.classList.add('fa-lg');
        move_buttons.appendChild(i_clock);
        button_pending.appendChild(i_clock);
        move_buttons.appendChild(button_pending);

        let button_cancel = document.createElement('button');
        button_cancel.classList.add('cancel');
        let i_trash = document.createElement('i');
        i_trash.classList.add('fas');
        i_trash.classList.add('fa-trash-alt');
        i_trash.classList.add('fa-lg');
        move_buttons.appendChild(i_trash);
        button_cancel.appendChild(i_trash);
        move_buttons.appendChild(button_cancel);

        let button_done = document.createElement('button');
        button_done.classList.add('done');
        let i_check = document.createElement('i');
        i_check.classList.add('fas');
        i_check.classList.add('fa-check');
        i_check.classList.add('fa-lg');
        move_buttons.appendChild(i_check);
        button_done.appendChild(i_check);
        move_buttons.appendChild(button_done);

        let button_backlog = document.createElement('button');
        button_backlog.classList.add('backlog');
        let i_icicles = document.createElement('i');
        i_icicles.classList.add('fas');
        i_icicles.classList.add('fa-icicles');
        i_icicles.classList.add('fa-lg');
        move_buttons.appendChild(i_icicles);
        button_backlog.appendChild(i_icicles);
        move_buttons.appendChild(button_backlog);

        return move_buttons;
    }
});