$( document ).ready(function() {
    //localStorage.clear();
    /*-----------------Rename-----------------*/ 
    $('body').on('click', ".rename", function() {
        Task.rename($(this));
    });
    $('body').on('click', ".save", function() {
        Task.saveRename($(this));
    });
    /*-----------------Moving-----------------*/        
    $('body').on('click', ".check", function() {
        if (!$(this).hasClass('checked')) {
            replaceCheckbox($(this));
            Task.moveTo($(this).parent(), ".listDone");
        } else {
            replaceCheckbox($(this));
            Task.moveTo($(this).parent(), ".listStatuses");
        }
    });
    buttonEvent(".statuses", ".listStatuses");
    buttonEvent(".pending", ".listPending");
    buttonEvent(".cancel", ".listCancel");
    buttonEvent(".done", ".listDone");

    $('body').on('click', ".move", function() {
        $(this).next().toggleClass("hide");
    });

    function buttonEvent(button, listButton) {
        $('body').on('click', button, function() {
            if (button == ".done") {
                if (!$(this).parents().eq(1).find(".check").hasClass('checked')) {
                    replaceCheckbox($(this).parents().eq(1).find(".check"));
                }
            } else {
                if ($(this).parents().eq(1).find(".check").hasClass('checked')) {
                    replaceCheckbox($(this).parents().eq(1).find(".check"));
                }
            }  
            Task.moveTo($(this).parents().eq(1), listButton);
        });
    }
    /*-----------------Adding-----------------*/
    $('#newTask_add').on('click', function() {
        newTask();
    });
    $("#newTask_value").keypress( function(event) {
        if ( event.which == 13 ) {
            newTask();
        }
    })
    /*----------------------------------------*/    

    /*--------------localStorage------------- */
    function lsTest(){
        let test = 'test';
        try {
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch(e) {
          return false;
        }
    }

    let listState = $(".listStatuses");
    if(lsTest() === true){
        let localTasks = JSON.parse(localStorage.getItem("todolist"));
        if (localTasks != null) {
            for (let i = 0; i < localTasks.length; i++) {
                htmlTask(localTasks[i].name, $(localTasks[i].state));
            }
        }
    }
    /*----------------------------------------*/    

    let Task = {
        add: function (name, listState) {
            htmlTask(name, listState);
    
            let allTasks = JSON.parse(localStorage.getItem("todolist"));
            if (allTasks == null) {
                allTasks = [];
            }
            let localTask = {};
            localTask.name = name;
            localTask.state = ".listStatuses";
            allTasks.push(localTask);
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        rename: function (renameButton) {
            renameButton.prevAll().eq(1).attr("disabled", '');
            renameButton.prev().removeAttr("readonly").css("cursor", "text").addClass("active");
            renameButton.addClass("hide");
            renameButton.next().removeClass("hide");
            renameButton.nextAll().eq(1).attr("disabled", '');
            renameButton.nextAll().eq(2).addClass("hide");
    
            let allTasks = JSON.parse(localStorage.getItem("todolist"));
            allTasks.splice(renameButton.parent().find("[type = text]").val(), 1);
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        saveRename: function (saveButton) {
            saveButton.prevAll().eq(2).removeAttr("disabled");
            saveButton.prevAll().eq(1).attr("readonly", '').css("cursor", "default").removeClass("active");
            saveButton.prev().removeClass("hide");
            saveButton.addClass("hide");
            saveButton.next().removeAttr("disabled", '');
    
            let allTasks = JSON.parse(localStorage.getItem("todolist"));
            let li = saveButton.parent();
            let localTask = {};
            localTask.name = li.find("[type = text]").val();
            localTask.state = "." + li.parent().attr('class');
            allTasks.push(localTask);
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        moveTo: function (li, newLi) {
            li.detach().appendTo(newLi);
            li.find('.move_buttons').addClass('hide');
    
            let taskName = li.find("[type = text]").val();
            let allTasks = JSON.parse(localStorage.getItem("todolist"));
            for (let i = 0; i < allTasks.length; i++) {
                if (allTasks[i].name == taskName) {
                    allTasks[i].state = newLi;
                }
            }
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        }
    }

    function newTask() {
        let name = $("#newTask_value").val();
        if (name != "") {
            listState = $(".listStatuses");
            Task.add(name, listState);
        }
        $("#newTask_value").val("");
    }
    
    function htmlTask(name, listState) {
        let ul = $(listState);
        
        $("<li/>", {
            class: 'task'
        }).appendTo(ul);
        let li = ul.find(".task:last-child");

        $("<div/>", {
            class: 'task__color',
        }).appendTo(li);
        $("<div/>", {
            class: 'task__contant',
        }).appendTo(li);

        let contant = li.find(".task__contant");


        htmlTaskMenu(contant);

        htmlTaskName(contant, name);
    }

    function htmlTaskMenu(place) {
        $("<div/>", {
            class: 'task__menu',
        }).appendTo(place);
        let menu = place.find(".task__menu");

        $("<div/>", {
            class: 'task__menu__buttons',
        }).appendTo(menu);
        let buttons_block = menu.find(".task__menu__buttons");
        createButton(buttons_block, "move", "fas fa-arrows-alt", false);
        createButton(buttons_block, "rename", "fas fa-pencil-alt", false);
        createButton(buttons_block, "save", "fas fa-check-circle", true);
        createButton(buttons_block, "hashtag", "fas fa-hashtag", false);
        
        $("<div/>", {
            class: 'task__menu__change',
        }).appendTo(menu);
        let change_block = menu.find(".task__menu__change");
        createButton(change_block, "swap", "fas fa-arrow-right", false);
        $("<input/>", {
            type: 'text',
            class: 'taskName',
            readonly: ''
        }).appendTo(change_block);

        $("<div/>", {
            class: 'move_buttons',
        }).appendTo(change_block);
        let move_buttons = change_block.find(".move_buttons")
        htmlMoveButtons(move_buttons);
    }

    function htmlTaskName(place, name) {
        $("<div/>", {
            class: 'task__name',
        }).appendTo(place);
        let nameBlock = place.find(".task__name");

        createButton(nameBlock, "check", "", false);
        if (listState.hasClass("listDone")) {
            nameBlock.find(".check").addClass("checked");
            nameBlock.find(".check i").addClass("fas fa-check-square");
        }
        else {
            nameBlock.find(".check i").addClass("far fa-square");
        }
        $("<input/>", {
            type: 'text',
            value: name,
            class: 'taskName',
            readonly: ''
        }).appendTo(nameBlock);
    }

    function htmlMoveButtons(place) {
        $("<div/>", {
            class: 'move_buttons hide'
        }).appendTo(place);
        let move_buttons = place.find('.move_buttons');
        
        createButton(move_buttons, "statuses", "fas fa-ellipsis-h", false);
        createButton(move_buttons, "pending", "fas fa-clock", false);
        createButton(move_buttons, "cancel", "fas fa-trash-alt", false);
        createButton(move_buttons, "done", "fas fa-check", false);
    }

    function createButton(place, buttonClass, i_icon, hide) {
        $("<button/>", {
            class: buttonClass
        }).appendTo(place);
        let button = place.find(" ." + buttonClass);
        $("<i/>", {
            class: i_icon + ' fa-lg'
        }).appendTo(button);

        if (hide == true) {
            $(button).addClass("hide");
        }
    }

    function replaceCheckbox(checkbox) {
        checkbox.toggleClass('checked');
        checkbox.find("i").toggleClass('fas fa-check-square far fa-square');
    }
});
