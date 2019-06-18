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
    let listState = document.querySelector(".list");
    if(lsTest() === true){
        if (!localStorage.length == 0) {
            for (let key in localStorage) {
                if (c < localStorage.length) {
                    let localTask = JSON.parse(localStorage.getItem(key));
                    if (localTask.state == true) {
                        listState = document.querySelector(".list");
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
    
    function completeTask(li) {
        li.detach().appendTo(".listDone");
        let taskName = li.find("[type = text]").val();
        let task = JSON.parse(localStorage.getItem(taskName));
        task.state = false;
        localStorage.setItem(taskName, JSON.stringify(task));
    }

    function returnTask(li) {
        li.detach().appendTo(".list");
    }

    let list = $(".list");
    $('#newTask_add').on('click', function() {
        let newTask_value = $("#newTask_value").val();
        if (newTask_value != "") {
            listState = document.querySelector(".list");
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
        li.appendChild(input_checkbox);
        li.appendChild(input_text);
        li.appendChild(button_change);
        li.appendChild(button_save);
        ul.appendChild(li);
        // <i class="fas fa-trash-alt"></i> Удалить
    }
});