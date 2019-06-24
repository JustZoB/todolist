$( document ).ready(function() {
    //localStorage.clear();
    /*-----------------Rename-----------------*/ 
    $('body').on('dblclick', ".taskName", function() {
        Task.rename($(this).parents().eq(1));
    });
    
    $('body').on('focusout', ".taskName", function(event) {
        Task.saveRename($(this).parents().eq(1));
    }); 
    $('body').on('keydown', ".taskName", function(event) {
        if ( event.which == 13 ) {
            Task.saveRename($(this).parents().eq(1));
        }
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
    $( "#statuses, #pending, #cancel, #done" ).sortable({
        connectWith: ".list",
        handle: ".task__color",
        update: function(event, ui) {
            Task.moveTask(ui.item, findClass(ui.item.parent().attr('class')));
        }
    }).disableSelection();
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
        contant.find(".hashtagValue").focus();
    });
    $('body').on('click', ".saveHashtag", function() {
        Task.saveHashtag($(this).parents().eq(3));
    });
    /*----------------------------------------*/    

    /*--------------localStorage------------- */
    let prevName = "";
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
            contant.find(".taskName").removeAttr("readonly").css("cursor", "text").addClass("active");
            prevName = contant.find(".taskName").val();
        },

        saveRename: function (contant) { 
            contant.find(".taskName").attr("readonly", '').css("cursor", "default").removeClass("active");    

            localStorageSaveRename(contant.parent());
        },

        saveHashtag: function(task) {
            let hashtagName = "#" + task.find(".hashtagValue").val();
            let hashtagsBlock = task.find(".task__hashTags");
            let datalist = task.parents().find("#hashtags");
            if ((hashtagName != "#") && (hashtagsBlock.find("div:contains('" + hashtagName + "')").length == 0)) { 
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
        },

        moveTask: function (li, newState) {
            if (newState == ".listDone") {
                if (!li.find(".check").hasClass('checked')) {
                    replaceCheckbox(li.find(".check"));
                }
            } else {
                if (li.find(".check").hasClass('checked')) {
                    replaceCheckbox(li.find(".check"));
                }
            }  
            
            localStorageOrder(li, newState);
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

        htmlTaskName(contant, name);
        htmlTaskMenu(contant);
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
        createButton(buttons_block, "hashtag", "fas fa-hashtag");
        
        $("<div/>", {
            class: 'task__menu__change',
        }).appendTo(menu);
        let change_block = menu.find(".task__menu__change");
        htmlHashtagCreating(change_block);
    }

    function htmlTaskName(place, name) {
        $("<div/>", {
            class: 'task__name',
        }).appendTo(place);
        let nameBlock = place.find(".task__name");

        createButton(nameBlock, "check", "");
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
            class: 'hashtagValue active' 
        }).appendTo(hashtagBlock);
        createButton(hashtagBlock, "saveHashtag", "fas fa-check-circle");
    }

    function createButton(place, buttonClass, i_icon) {
        $("<button/>", {
            class: buttonClass
        }).appendTo(place);
        let button = place.find(" ." + buttonClass);
        $("<i/>", {
            class: i_icon + ' fa-lg'
        }).appendTo(button);
    }

    function replaceCheckbox(checkbox) {
        checkbox.toggleClass('checked');
        checkbox.find("i").toggleClass('fas fa-check-square far fa-square');
    }

    function findClass(listClasses) {
        let listState = ".listStatuses"
        if (listClasses.indexOf('listPending') >= 0) listState = ".listPending";
        if (listClasses.indexOf('listCancel') >= 0) listState = ".listCancel";
        if (listClasses.indexOf('listDone') >= 0) listState = ".listDone";
        return listState;
    }

    function localStorageOrder(li, newState) {
        let prevLiName = li.prev().find(".taskName").val();
        let liName = li.find(".taskName").val();
        let allTasks = JSON.parse(localStorage.getItem("todolist"));
        let positionToSet = 0;
        let positionThatSet = 0;
        let thatToSet = {};
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == liName) {
                allTasks[i].state = newState;
                thatToSet = allTasks[i];
                positionThatSet = i;
            }
            if (allTasks[i].name == prevLiName) {
                positionToSet = i;
            }
        }
        if ((positionThatSet < positionToSet) || (prevLiName == undefined)) {
            allTasks.splice(positionThatSet, 1);
            allTasks.splice(positionToSet, 0, thatToSet);
        } else {
            allTasks.splice(positionThatSet, 1);
            allTasks.splice(positionToSet + 1, 0, thatToSet);
        }
        
        localStorage.setItem("todolist", JSON.stringify(allTasks));
    }

    function localStorageSaveRename(li) {
        let allTasks = JSON.parse(localStorage.getItem("todolist"));
        let taskName = li.find(".taskName").val();
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == prevName) {
                allTasks[i].name = taskName;
            }
        }
        localStorage.setItem("todolist", JSON.stringify(allTasks));
    }
});
