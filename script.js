$( document ).ready(function() {

    let Task = {
        add: function () {
            // .class
            let name = $("#newTask_value").val();
            if (name != "") {
                listState = $(".listStatuses");
                Task.addHtml(name, listState);
                LS.add(name);
            }
            $("#newTask_value").val("");
        },

        delete: function(li) {
            li.detach();

            LS.delete(li);
        },

        addHtml: function (name, listState, tags) {
            let list = $(listState);
            
            $(list).append(`<li class="task">
            <div class="task__color"></div>
            <div class="task__content"></div>
            </li>`);
            let li = list.find(".task:last-child"),
                content = li.find(".task__content");
    
            if (content.parents().eq(1).hasClass("listDone")) {
                $(content).append(`<div class='task__name'>
                <button class='check checked i'><i class='fas fa-check-square fa-lg'></i></button>
                <input class='taskName' type='text' value='${ name }' readonly></input>
                <p class="openText hide">${ name }</p>
                </div>`);
            }
            else {
                $(content).append(`<div class='task__name'>
                <button class='check i'><i class='far fa-square fa-lg'></i></button>
                <input class='taskName' type='text' value='${ name }' readonly></input>
                <p class="openText hide">${ name }</p>
                </div>`);
            }
    
            $(content).append(`<div class='task__menu'>
            <div class='task__menu__buttons'>
            <button class='hashtag i'><i class='fas fa-hashtag fa-lg'></i></button>
            <button class='delete i'><i class="fas fa-trash fa-lg"></i></button>
            </div>
            <div class='task__menu__change'>
            <div class='hashtagBlock hide'>
            <input class='hashtagValue active' type='text' list='hashtags'></input>
            <button class='saveHashtag i'><i class='fas fa-check-circle fa-lg'></i></button>
            </div></div></div>`);
    
            if (tags != undefined) {
                $(content).append(`<div class="task__hashTags"></div>`);
                let hashtagBlock = li.find($(".task__hashTags")),
                    datalist = content.parents().eq(2).find("#hashtags");
                for (let i = 0; i < tags.length; i++) {
                    $(hashtagBlock).append(`<div>${ tags[i] }</div>`);
                    if ($("[value='" + tags[i].substr(1) + "']").length == 0) {
                        $(datalist).append(`<option value='${ tags[i].substr(1) }'></option>`);
                    }
                }
            }
        },

        rename: function (content) {  
            content.find(".taskName").removeAttr("readonly").css("cursor", "text").addClass("active");
            prevName = content.find(".taskName").val();
            content.find(".taskName").focus();
        },

        saveRename: function (content) { 
            content.find(".taskName").attr("readonly", '').css("cursor", "default").removeClass("active");

            LS.saveRename(content.parent());
        },

        saveHashtag: function(task) {
            let hashtagName = "#" + task.find(".hashtagValue").val(),
                hashtagsBlock = task.find(".task__hashTags"),
                datalist = task.parents().find("#hashtags");
            if ((hashtagName != "#") && (hashtagsBlock.find("div:contains('" + hashtagName + "')").length == 0)) { 
                if ((task.find(".task__hashTags").length == 0)) {
                    $(task).append(`<div class="task__hashTags"></div>`);
                    hashtagsBlock = task.find(".task__hashTags");
                } 
                $(hashtagsBlock).append(`<div>${ hashtagName }</div>`);
                if ($("[value='" + hashtagName.substr(1) + "']").length == 0) {
                    $(datalist).append(`<option value='${ hashtagName.substr(1) }'></option>`);
                }
                task.find(".hashtagValue").val("");
                task.find(".hashtagBlock").focus();
                LS.saveHashtag(task, hashtagName);
            }
        },

        moveTask: function (li, newState) {
            if (newState == ".listDone") {
                if (!li.find(".check").hasClass('checked')) {
                    Task.check(li.find(".check"));
                }
            } else {
                if (li.find(".check").hasClass('checked')) {
                    Task.check(li.find(".check"));
                }
            }  
            
            LS.order(li, newState);
        },

        checkMove: function (li, newState) {
            li.detach().appendTo($(newState));
            
            LS.checkMove(li, newState);
        },

        check: function (checkbox) {
            checkbox.toggleClass('checked');
            checkbox.find("i").toggleClass('fas fa-check-square far fa-square');
        },

        touchValue: function(li) {
            let taskName = li.find(".taskName"),
                openText = li.find(".openText");
                taskName.toggleClass("hide");
                openText.toggleClass("hide");
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } 
        },

        filterHashTags_add: function (tag) {
            let container = $(".container"),
                taskFilter = container.find("li.task");

            taskFilter.addClass("hashtagFilter_hide");
            filterTags.push(tag);

            taskFilter.each(function(key, elem) {
                let c = 0;
                for (let i = 0; i < filterTags.length; i++) {
                    let tagName = $(elem).find("div div div:contains('" + filterTags[i] + "')");
                    if (tagName.length) {
                        c++;
                    }
                }
                if (c == filterTags.length) {
                    $(this).removeClass("hashtagFilter_hide");
                    $(this).find("div div div:contains('" + tag + "')").addClass("active");
                }
            });
        },

        filterHashTags_remove: function (tag) {
            let container = $(".container"),
                taskFilter = container.find("li.task");
            taskFilter.removeClass("hashtagFilter_hide");
            let visable = container.find("div div div:contains('" + tag + "')");
            visable.each(function(i,elem) {}).removeClass("active");
            filterTags.splice(filterTags.indexOf(tag), 1);
        },

        add_toggleTextarea: function (article) {
            article.find(".task__add__adding-block").toggleClass("hide");
            article.find(".task__add__button_open").toggleClass("hide");
        },

        add_toggleButtonMenu: function (article) {
            article.find(".task__add__menu__buttons").toggleClass("hide");
        },

        status_toggleTextarea: function (article) {
            article.find(".status__add__adding-block").toggleClass("hide");
            article.find(".status__add__button_open").toggleClass("hide");
        },

        head_toggleButtonMenu: function (article) {
            article.find(".article__head__menu__buttons").toggleClass("hide");
        }
    }

    let LS = {
        test: function () {
            let test = 'test';
            try {
              localStorage.setItem(test, test);
              localStorage.removeItem(test);
              return true;
            } catch(e) {
              return false;
            }
        },

        add: function (name) {
            let allTasks = JSON.parse(localStorage.getItem("todolist")),
                localTask = {};
            if (allTasks == null) {
                allTasks = [];
            }
            localTask.name = name;
            localTask.state = ".listStatuses";
            allTasks.push(localTask);
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        delete: function(li) {
            let allTasks = JSON.parse(localStorage.getItem("todolist")),
                liName = li.find(".taskName").val();
            for (let i = 0; i < allTasks.length; i++) {
                if (allTasks[i].name == liName) {
                    allTasks.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        order: function (li, newState) {
            let prevLiName = li.prev().find(".taskName").val(),
                liName = li.find(".taskName").val(),
                allTasks = JSON.parse(localStorage.getItem("todolist")),
                positionToSet = 0,
                positionThatSet = 0,
                thatToSet = {};
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
        },

        checkMove: function(li, newState) {
            let taskName = li.find(".taskName").val(),
                allTasks = JSON.parse(localStorage.getItem("todolist"));
            for (let i = 0; i < allTasks.length; i++) {
                if (allTasks[i].name == taskName) {
                    allTasks[i].state = newState;
                }
            }
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        saveRename: function (li) {
            let allTasks = JSON.parse(localStorage.getItem("todolist")),
                taskName = li.find(".taskName").val();
            for (let i = 0; i < allTasks.length; i++) {
                if (allTasks[i].name == prevName) {
                    allTasks[i].name = taskName;
                }
            }
            localStorage.setItem("todolist", JSON.stringify(allTasks));
        },

        saveHashtag: function (task, hashtagName) {
            let allTasks = JSON.parse(localStorage.getItem("todolist")),
                localHashtags = [],
                taskName = task.find(".taskName").val();
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

    let prevName = "",
        filterTags = [],
        listState = $(".listStatuses");

    if(LS.test() === true){
        let localTasks = JSON.parse(localStorage.getItem("todolist"));
        if (localTasks != null) {
            for (let i = 0; i < localTasks.length; i++) {
                Task.addHtml(localTasks[i].name, $(localTasks[i].state), localTasks[i].tags);
            }
        }
    }

    function findClass(listClasses) {
        let listState = ".listStatuses";
        if (listClasses.indexOf('listPending') >= 0) {
            listState = ".listPending";
        } else if (listClasses.indexOf('listCancel') >= 0) {
            listState = ".listCancel";
        } else if (listClasses.indexOf('listDone') >= 0) {
            listState = ".listDone";
        }
        return listState;
    }


    $('body').on('click', ".status__add__button_open", function() {
        Task.status_toggleTextarea($(this).parents().eq(1));
    });
    $('body').on('click', ".status__add__button_close", function() {
        Task.status_toggleTextarea($(this).parents().eq(3));
    });

    $('body').on('click', ".task__add__button_open", function() {
        Task.add_toggleTextarea($(this).parents().eq(2));
    });
    $('body').on('click', ".task__add__button_close", function() {
        Task.add_toggleTextarea($(this).parents().eq(5));
    });

    
    $('body').on('click', ".task__add__button_menu", function() {
        Task.add_toggleButtonMenu($(this).parents().eq(5));
    });
    $('body').on('click', ".article__head__button_menu", function() {
        Task.head_toggleButtonMenu($(this).parents().eq(2));
    });

    $('.sun').on('click', function() {
        toggleTime($(this).parent());
    });
    $('.moon').on('click', function() {
        toggleTime($(this).parent());
    });
    function toggleTime (menu) {
        menu.find(".sun").toggleClass("hide");
        menu.find(".moon").toggleClass("hide");
    }
    
    /*-----------------Rename-----------------*/ 
    $('body').on('click', ".taskName", function() {
        Task.rename($(this).parents().eq(1));
    });
    $('body').on('focusout', ".taskName", function() {
        Task.saveRename($(this).parents().eq(1));
    }); 
    $('body').on('keydown', ".taskName", function(event) {
        if ( event.which == 13 ) {
            if ($(this).hasClass("active")) {
                Task.saveRename($(this).parents().eq(1));
            } else {
                Task.rename($(this).parents().eq(1));
            }
        }
    }); 
    /*-----------------Moving-----------------*/ 
    $('body').on('click', ".check", function() {
        if (!$(this).hasClass('checked')) {
            Task.check($(this));
            Task.checkMove($(this).parents().eq(2), ".listDone");
        } else {
            Task.check($(this));
            Task.checkMove($(this).parents().eq(2), ".listStatuses");
        }
    });
    $( "#statuses, #pending, #cancel, #done" ).sortable({
        connectWith: ".list",
        update: function(event, ui) {
            Task.moveTask(ui.item, findClass(ui.item.parent().attr('class')));
        }
    }).disableSelection();
    /*-----------------Adding-----------------*/
    $('#newTask_add').on('click', function() {
       Task.add();
    });
    $("#newTask_value").keypress( function(event) {
        if ( event.which == 13 ) {
            Task.add();
        }
    })
    /*-----------------See all----------------*/
    $('body').on('dblclick', ".taskName", function() {
        Task.touchValue($(this).parents().eq(1));
    });
    $('body').on('dblclick', ".openText", function() {
        Task.touchValue($(this).parents().eq(1));
    });
    /*-----------------Delete-----------------*/
    $('body').on('click', ".delete", function() {
        Task.delete($(this).parents().eq(3));
    });
    /*----------------Hashtag-----------------*/
    $('body').on('click', ".hashtag", function() {    
        let content = $(this).parents().eq(2);
        content.find(".hashtagBlock").toggleClass("hide");
        content.find(".hashtagValue").focus();
    });
    
    $('body').on('click', ".saveHashtag", function() {
        Task.saveHashtag($(this).parents().eq(3));
    });
    $('body').on('keydown', ".hashtagValue", function(event) {
        if ( event.which == 13 ) {
            Task.saveHashtag($(this).parents().eq(3));
        }
    }); 
    /*---------------_CloseAll----------------*/
    $('body').on('click', function() {
        console.log(window.event.target);
        if (window.event.target == document.body) {
            $(".hashtagBlock").addClass("hide");
        }
        if (window.event.target.classList.contains("articles")) {
            $(".task__add__adding-block").addClass("hide");
            $(".task__add__button_open").removeClass("hide");
            $(".status__add__adding-block").addClass("hide");
            $(".status__add__button_open").removeClass("hide");
            $(".article__head__menu__buttons").addClass("hide");
            $(".task__add__menu__buttons").addClass("hide");
        }
    });
    $('body').on('click', ".task__hashTags div", function() {
        if ($(this).hasClass("active")) {
            Task.filterHashTags_remove($(this).html());
        } else {
            Task.filterHashTags_add($(this).html());
        }
    });
    /*----------------------------------------*/       
});
