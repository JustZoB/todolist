$( document ).ready(function() {
    //localStorage.clear();
    /*-----------------Rename-----------------*/ 
    $('body').on('click', ".rename", function() {
        Task.rename($(this).parents().eq(2));
    });
    $('body').on('click', ".save", function() {
        Task.saveRename($(this).parents().eq(2));
    });   
    /*-----------------Moving-----------------*/        
    $('body').on('click', ".check", function() {
        if (!$(this).hasClass('checked')) {
            replaceCheckbox($(this));
            Task.moveTo($(this).parents().eq(2), ".listDone");
        } else {
            replaceCheckbox($(this));
            Task.moveTo($(this).parents().eq(2), ".listStatuses");
        }
    });
    buttonEvent(".statuses", ".listStatuses");
    buttonEvent(".pending", ".listPending");
    buttonEvent(".cancel", ".listCancel");
    buttonEvent(".done", ".listDone");

    $('body').on('click', ".move", function() {
        let contant = $(this).parents().eq(2);
        contant.find(".hashtagBlock").addClass("hide");
        contant.find(".move_buttons").toggleClass("hide");
    });

    function buttonEvent(button, listButton) {
        $('body').on('click', button, function() {
            let contant = $(this).parents().eq(3);
            if (button == ".done") {
                if (!contant.find(".check").hasClass('checked')) {
                    replaceCheckbox(contant.find(".check"));
                }
            } else {
                if (contant.find(".check").hasClass('checked')) {
                    replaceCheckbox(contant.find(".check"));
                }
            }  
            Task.moveTo($(this).parents().eq(4), listButton);
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
    /*----------------Hashtag-----------------*/
    $('body').on('click', ".hashtag", function() {    
        let contant = $(this).parents().eq(2);
        contant.find(".hashtagBlock").toggleClass("hide");
        contant.find(".move_buttons").addClass("hide");
        contant.find(".hashtagValue").removeAttr("readonly").css("cursor", "text").addClass("active");
    });
    $('body').on('click', ".saveHashtag", function() {
        Task.saveHashtag($(this).parents().eq(3));
    });
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
                htmlTask(localTasks[i].name, $(localTasks[i].state), localTasks[i].tags);
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

        rename: function (contant) {
            contant.find(".move").attr("disabled", '');
            contant.find(".hashtag").attr("disabled", '');
            contant.find(".check").attr("disabled", '');
            contant.find(".taskName").removeAttr("readonly").css("cursor", "text").addClass("active");
            contant.find(".rename").addClass("hide");
            contant.find(".hashtagBlock").addClass("hide");
            contant.find(".save").removeClass("hide");
            contant.find(".move_buttons").addClass("hide");
    
            let taskName = contant.find(".taskName").val();
            let allTasks = JSON.parse(localStorage.getItem("todolist"));
            for (let i = 0; i < allTasks.length; i++) {
                if (allTasks[i].name == taskName) {
                    allTasks.splice(i, 1);
                }
            }
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        saveRename: function (contant) {
            contant.find(".move").removeAttr("disabled");
            contant.find(".hashtag").removeAttr("disabled");
            contant.find(".check").removeAttr("disabled");
            contant.find(".taskName").attr("readonly", '').css("cursor", "default").removeClass("active");
            contant.find(".rename").removeClass("hide");
            contant.find(".save").addClass("hide");
            
            let allTasks = JSON.parse(localStorage.getItem("todolist"));
            let localTask = {};
            localTask.name = contant.find(".taskName").val();
            localTask.state = "." + contant.parents().eq(1).attr('class');
            allTasks.push(localTask);
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        saveHashtag: function(task) {
            let hashtagName = "#" + task.find(".hashtagValue").val();
            let hashtagsBlock = task.find(".task__hashTags");
            let datalist = task.parents().find("#hashtags");
            if (hashtagName != "#") { 
                if (hashtagsBlock.find("div:contains('" + hashtagName + "')").length == 0) {
                    task.find(".hashtagBlock").toggleClass("hide");
                    if ((task.find(".task__hashTags").length == 0)) {
                        $("<div/>", {
                            class: 'task__hashTags',
                        }).appendTo(task);
                    } 
                    $("<div>" + hashtagName + "</div>").appendTo(task.find(".task__hashTags"));
                    if ($("[value='" + hashtagName.substr(1) + "']").length == 0) {
                        $("<option value='" + hashtagName.substr(1) + "'></option>").appendTo(datalist);
                    }
                    task.find(".hashtagValue").val("");

                    let allTasks = JSON.parse(localStorage.getItem("todolist"));
                    let localHashtags = [];
                    let taskName = task.find(".taskName").val();
                    for (let i = 0; i < allTasks.length; i++) {
                        if (allTasks[i].name == taskName) {
                            if (allTasks[i].tags == undefined) {
                                localHashtags[0] = hashtagName;
                                allTasks[i].tags = localHashtags;
                            } else {
                                allTasks[i].tags.push(hashtagName);
                            }
                        }
                    }
                    localStorage.setItem("todolist", JSON.stringify(allTasks));
                }
            }
        },

        moveTo: function (li, newState) {
            li.detach().appendTo($(newState));
            li.find('.move_buttons').addClass('hide');
            li.find('.hashtagBlock').addClass('hide');
            
            let taskName = li.find(".taskName").val();
            let allTasks = JSON.parse(localStorage.getItem("todolist"));
            for (let i = 0; i < allTasks.length; i++) {
                if (allTasks[i].name == taskName) {
                    allTasks[i].state = newState;
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
    
    function htmlTask(name, listState, tags) {
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

        if (tags != undefined) {
            $("<div/>", {
                class: 'task__hashTags',
            }).appendTo(contant);
            let hashtagBlock = li.find($(".task__hashTags"));
            let datalist = contant.parents().eq(2).find("#hashtags");
            for (let i = 0; i < tags.length; i++) {
                $("<div>" + tags[i] + "</div>").appendTo(hashtagBlock);
                if ($("[value='" + tags[i].substr(1) + "']").length == 0) {
                    $("<option value='" + tags[i].substr(1) + "'></option>").appendTo(datalist);
                }
            }
        }
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
        htmlHashtagCreating(change_block);
        htmlMoveButtons(change_block);
    }

    function htmlTaskName(place, name) {
        $("<div/>", {
            class: 'task__name',
        }).appendTo(place);
        let nameBlock = place.find(".task__name");

        createButton(nameBlock, "check", "", false);
        if (place.parents().eq(1).hasClass("listDone")) {
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

    function htmlHashtagCreating(place) {
        $("<div/>", {
            class: 'hashtagBlock hide',
        }).appendTo(place);
        let hashtagBlock = place.find(".hashtagBlock");
        $("<input/>", {
            type: 'text',
            list: 'hashtags',
            class: 'hashtagValue',
            readonly: ''
        }).appendTo(hashtagBlock);
        createButton(hashtagBlock, "saveHashtag", "fas fa-check-circle", false);
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
