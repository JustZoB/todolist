$( document ).ready(function() {
    //localStorage.clear();
    /*-----------------Rename------------------*/
    $('body').on('click', ".change", function() {
       $(this).prevAll().eq(1).attr("disabled", '');
       $(this).prev().removeAttr("readonly");
       $(this).prev().css("cursor", "text");
       $(this).prev().addClass("active");
       $(this).addClass("hide");
       $(this).next().removeClass("hide");
       $(this).nextAll().eq(1).attr("disabled", '');
       $(this).nextAll().eq(2).addClass("hide");

       localStorage.removeItem($(this).parent().find("[type = text]").val());
    });
    $('body').on('click', ".save", function() {
        $(this).prevAll().eq(2).removeAttr("disabled");
        $(this).prevAll().eq(1).attr("readonly", '');
        $(this).prevAll().eq(1).css("cursor", "default");
        $(this).prevAll().eq(1).removeClass("active");
        $(this).prev().removeClass("hide");
        $(this).addClass("hide");
        $(this).next().removeAttr("disabled", '');

        let li = $(this).parent();
        let task = {};
        task.name = li.find("[type = text]").val();
        task.state = "." + li.parent().attr('class');
        localStorage.setItem(task.name, JSON.stringify(task));
    });
    /*----------------------------------------*/

    /*--------------localStorage------------- */
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
    let listState = document.querySelector(".listStatuses");
    if(lsTest() === true){
        if (!localStorage.length == 0) {
            for (let key in localStorage) {
                if (c < localStorage.length) {
                    let localTask = JSON.parse(localStorage.getItem(key));
                    listState = document.querySelector(localTask.state);
                    htmlTask(localTask.name, listState);
                }
                c++;
            }
        }
    }
    /*----------------------------------------*/

    /*-----------------Moving-----------------*/
    $('body').on('click', ".check", function() {
        if (!$(this).hasClass('checked')) {
            replaceCheckbox($(this));
            moveTo($(this).parent(), ".listDone");
        } else {
            replaceCheckbox($(this));
            moveTo($(this).parent(), ".listStatuses");
        }
    });
    buttonEvent(".statuses", ".listStatuses");
    buttonEvent(".pending", ".listPending");
    buttonEvent(".cancel", ".listCancel");
    buttonEvent(".done", ".listDone");

    function buttonEvent(button, listButton) {
        $('body').on('click', button, function() {
            if (button == ".done") {
                if (!$(this).parent().parent().find(".check").hasClass('checked')) {
                    replaceCheckbox($(this).parent().parent().find(".check"));
                }
            } else {
                if ($(this).parent().parent().find(".check").hasClass('checked')) {
                    replaceCheckbox($(this).parent().parent().find(".check"));
                }
            }  
            moveTo($(this).parent().parent(), listButton);
        });
    }

    $('body').on('click', ".move", function() {
        $(this).next().toggleClass("hide");
    });

    function replaceCheckbox(checkbox) {
        checkbox.toggleClass('checked');
        checkbox.find("i").toggleClass('fas');
        checkbox.find("i").toggleClass('fa-check-square');
        checkbox.find("i").toggleClass('far');
        checkbox.find("i").toggleClass('fa-square');
    }

    function moveTo(li, newLi) {
        li.detach().appendTo(newLi);
        li.find('.block__move_buttons').addClass('hide');

        let taskName = li.find("[type = text]").val();
        let task = JSON.parse(localStorage.getItem(taskName));
        task.state = newLi;
        localStorage.setItem(taskName, JSON.stringify(task));
    }
    /*----------------------------------------*/

    /*-----------------Adding-----------------*/
    let list = $(".listStatuses");
    
    $('#newTask_add').on('click', function() {
        newTask();
    });
    $("#newTask_value").keypress( function(event) {
        if ( event.which == 13 ) {
            newTask();
        }
    })

    function newTask() {
        let newTask_value = $("#newTask_value").val();
        if (newTask_value != "") {
            listState = document.querySelector(".listStatuses");
            addTask(newTask_value, listState);
        }
        $("#newTask_value").val("");
    }

    function addTask(newTask_value, listState) {
        htmlTask(newTask_value, listState);
        let task = {};
        task.name = newTask_value;
        task.state = ".listStatuses";
        localStorage.setItem(newTask_value, JSON.stringify(task));
    }
    /*----------------------------------------*/
    function htmlTask(newTask_value, listState) {
        let ul = listState;
        let li = document.createElement('li');
        li.classList.add('task');

        let input_checkbox = document.createElement('button');
        input_checkbox.classList.add('check');
        let i_checksquare = document.createElement('i');
        i_checksquare.classList.add('fa-lg');
        if (listState.classList.contains("listDone")) {
            input_checkbox.classList.add('checked');
            i_checksquare.classList.add('fas');
            i_checksquare.classList.add('fa-check-square');
        } else {
            i_checksquare.classList.add('far');
            i_checksquare.classList.add('fa-square');
        }
        input_checkbox.appendChild(i_checksquare);

        let input_text = document.createElement('input');
        input_text.setAttribute('type', "text");
        input_text.setAttribute('value', newTask_value);
        input_text.setAttribute('readonly', '');

        move_buttons = htmlMoveButtons();

        li.appendChild(input_checkbox);
        li.appendChild(input_text);

        createButton(li, "change", "fa-pencil-alt", false);
        createButton(li, "save", "fa-check-circle", true);
        createButton(li, "move", "fa-arrows-alt", false);

        li.appendChild(move_buttons);
       
        ul.appendChild(li);
    }

    function htmlMoveButtons() {
        let move_buttons = document.createElement('div');
        move_buttons.classList.add('hide');
        move_buttons.classList.add('block__move_buttons');

        createButton(move_buttons, "statuses", "fa-ellipsis-h", false);
        createButton(move_buttons, "pending", "fa-clock", false);
        createButton(move_buttons, "cancel", "fa-trash-alt", false);
        createButton(move_buttons, "done", "fa-check", false);

        return move_buttons;
    }

    function createButton(place, buttonClass, i_icon, hide) {
        let button = document.createElement('button');
        if (hide == true) {
            button.classList.add("hide");
        }
        button.classList.add(buttonClass);
        let icon = document.createElement('i');
        icon.classList.add("fas");
        icon.classList.add(i_icon);
        icon.classList.add('fa-lg');
        button.appendChild(icon);
        place.appendChild(button);
    }
});