$( document ).ready(function() {

    let prevName = "",
        filterTags = [],
        articles_array = [];

    let Task = {
        add: function(article) {
            let name = article.find(".task__add__value");
            let nameValue = name.val();
            if (nameValue != "") {
                let listState = findClass(article.find(".list").attr("class"));
                Task.addHtml(nameValue, article.find(".list"));
                LS.add(nameValue, listState);
            }
            article.find(".task__add__value").focus();
            name.val("");
        },

        delete: function(li) {
            li.detach();

            LS.delete(li);
        },

        addHtml: function (name, listState, tags) {
            let list = $(listState),
                check_icon = "",
                checked = "";

            if (listState.hasClass("listDone")) {
                checked = " checked";
                check_icon = "fas fa-check-square";
            } else {
                check_icon = "far fa-square";
            }

            $(list).append(`<li class="task">
                <div class="task__color"></div>
                <div class="task__content">
                    <div class='task__name'>
                        <button class='check${ checked } i'><i class='${ check_icon } fa-lg'></i></button>
                        <input class='taskName' type='text' value='${ name }' readonly></input>
                        <p class="openText hide">${ name }</p>
                        <button class='task__menu_open i'><i class='fas fa-ellipsis-h fa-lg'></i></button>
                        <div class="task__buttons hide">
                            <button class="task__button_rename i" title="Rename"><i class='fas fa-pen fa-lg'></i></button>
                            <button class="task__button_hashtag i" title="Add tag"><i class='fas fa-hashtag fa-lg'></i></button>
                            <button class="task__button_show i" title="Show all text"><i class='fas fa-eye fa-lg'></i></button>
                            <button class="task__button_delete i" title="Delete"><i class='fas fa-trash fa-lg'></i></button>
                            <div class="task__delete_confirm hide">
                                <button class="task__delete_yes i" title="Delete"><i class='fas fa-check fa-lg'></i></button>
                                <button class="task__delete_no i" title="Don't delete"><i class='fas fa-times fa-lg'></i></button>
                            </div>
                        </div>
                    </div>
                    <div class='task__hashtags'>
                        <input class='hashtagValue active hide' type='text' list='hashtags'></input>
                        <div class="hashtagBuffer"></div>
                    </div>
                </div>
            </li>`);

            if (tags != undefined) {
                let li = list.find(".task:last-child"),
                    hashtagBlock = li.find($(".task__hashtags")),
                    datalist = li.parents().eq(3).find("#hashtags");

                for (let i = 0; i < tags.length; i++) {
                    $(`<div>${ tags[i] }</div>`).insertBefore(hashtagBlock.find(".hashtagValue"));
                    if ($("[value='" + tags[i].substr(1) + "']").length == 0) {
                        $(datalist).append(`<option value='${ tags[i].substr(1) }'></option>`);
                    }
                }
            }
        },

        rename: function (content) {  
            content.find(".taskName").removeAttr("readonly").css("cursor", "text").addClass("active");
            prevName = content.find(".taskName").val();
            content.find(".taskName").focus().val('').val(prevName);
        },

        saveRename: function (content) { 
            content.find(".taskName").attr("readonly", '').css("cursor", "default").removeClass("active");

            LS.saveRename(content.parent());
        },

        saveHashtag: function(task) {
            let hashtagInput = task.find(".hashtagValue"); 
            let hashtagName = "#" + hashtagInput.val(),
                hashtagsBlock = task.find(".task__hashtags"),
                datalist = task.parents().find("#hashtags");
            if ((hashtagName != "#") && (hashtagsBlock.find("div:contains('" + hashtagName + "')").length == 0)) { 
                $(`<div>${ hashtagName }</div>`).insertBefore(hashtagInput);
                if ($("[value='" + hashtagName.substr(1) + "']").length == 0) {
                    $(datalist).append(`<option value='${ hashtagName.substr(1) }'></option>`);
                }
                hashtagInput.width(60);
                hashtagInput.val('');
                hashtagInput.focus();
                /*LS.saveHashtag(task, hashtagName);*/
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

        touchMenu : function (task) {
            task.find(".task__buttons").toggleClass("hide");
        },

        delete_touchConfirm: function (task) {
            task.find(".task__delete_confirm").toggleClass("hide");
        },

        hashtag_showAdding: function (task) {
            task.find(".hashtagValue").removeClass("hide");
            task.find(".hashtagValue").focus();
        },

        hashtag_checkHeight: function (task) {
            if (task.find(".task__hashtags").height() == 0) {
                task.find(".task__hashtags").css({"padding-bottom" : "0"});
            } else {
                task.find(".task__hashtags").css({"padding-bottom" : "5px"});
            }
        },
    }

    let Status = {
        add: function (color, nameValue, deleteDisabled) {
            if (nameValue == undefined) {
                nameValue = $(".status__add__value").val();
            }
            if (nameValue != "") {
                Status.addHtml(color, nameValue, deleteDisabled);
            }
        },      

        addHtml: function (color, name, deleteDisabled) {
            let articles = $(".articles");
            let id = articles_array.length;
            articles_array.push(id);
            let ids_array = articles_array.slice(0);
            for (let i = 0; i < ids_array.length; i++) {
                ids_array[i] = "#" + ids_array[i];
            }
            let newStatuses = articles.find(".newStatus");
            let listClass = name[0].toUpperCase() + name.slice(1);;
            if (deleteDisabled == true) {
                deleteDisabled = " disabled";
            }

            $(`<article class="${ color }">
                <div class="article__color"></div>
                <div class="article__head">
                    <h2>${ name }</h2>
                    <input class='statusName active hide' type='text' value='${ name }'></input>
                    <div class="article__head__menu">
                        <button class="article__head__button_menu i"><i class="fas fa-ellipsis-h fa-lg"></i></button>
                        <div class="article__buttons hide">
                            <button class="article__button_rename i" title="Rename"><i class='fas fa-pen fa-lg'></i></button>
                            <button class="article__button_color i" title="Paint"><i class='fas fa-palette fa-lg'></i></button>
                            <div class="choose-color hide">
                                <span class="blue"></span>
                                <span class="yellow"></span>
                                <span class="red"></span>
                                <span class="green"></span>
                                <span class="purple"></span>
                                <span class="lightgreen"></span>
                                <span class="orange"></span>
                            </div>
                            <button class="article__button_delete i" title="Delete"${ deleteDisabled }><i class='fas fa-trash fa-lg'></i></button>
                            <div class="article__delete_confirm hide">
                                <button class="article__delete_yes i" title="Delete"><i class='fas fa-check fa-lg'></i></button>
                                <button class="article__delete_no i" title="Don't delete"><i class='fas fa-times fa-lg'></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="list${ listClass } list" id="${ id }"></ul>
                <div class="task__add">
                    <div class="task__add__content">
                        <button class="task__add__button_open">Add card</button>
                        <div class="task__add__adding-block hide">
                            <textarea class="task__add__value" type="text" placeholder="Enter a head of your task..."></textarea>
                            <div class="task__add__buttons">
                                <div class="task__add__buttons_change">
                                    <button class="task__add__button_add">Add card</button>
                                    <button class="task__add__button_close i" title="Close"><i class="fas fa-times fa-lg"></i></button>
                                </div>
                                <div class="task__add__menu">
                                    <button class="task__add__button_menu i"><i class="fas fa-ellipsis-v fa-lg"></i></button>
                                    <div class="task__add__menu__buttons hide">
                                        <button class="task__add__menu__button_add-hashtags i" title="Add tag"><i class='fas fa-hashtag fa-lg'></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>`).insertBefore(newStatuses);

            let string = ids_array.join(', ');
            $( string ).sortable({
                connectWith: ".list",
                update: function(event, ui) {
                    Task.moveTask(ui.item, findClass(ui.item.parent().attr('class')));
                }
            }).disableSelection();

            articles.width(articles.width() + 390);
        },

        color_change: function (article, color) {
            article.removeClass().addClass(color);
        },

        toggleTextarea: function (article) {
            article.find(".status__add__adding-block").toggleClass("hide");
            article.find(".status__add__button_open").toggleClass("hide");
        },

        head_menu_touch: function (article) {
            article.find(".article__buttons").toggleClass("hide");
        },

        color_touchChoosing: function (article) {
            article.find(".choose-color").toggleClass("hide");
        },

        delete_touchConfirm: function (article) {
            article.find(".article__delete_confirm").toggleClass("hide");
        },
        
        delete: function (article) {
            article.detach();

            let articles = $(".articles");
            articles.width(articles.width() - 390);
        },

        rename_start: function (article) {
            article.find("h2").addClass("hide");
            article.find(".statusName").removeClass("hide").focus().val('').val(article.find("h2").text());
        },

        rename_finish: function (article) {
            article.find("h2").text(article.find(".statusName").val());
            article.find("h2").removeClass("hide");
            article.find(".statusName").addClass("hide");

            /*LS */
        },
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

        add: function (name, listState) {
            let allTasks = JSON.parse(localStorage.getItem("todolist")),
                localTask = {};
            if (allTasks == null) {
                allTasks = [];
            }
            localTask.name = name;
            localTask.state = listState;
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

    Status.add("blue", "Statuses", true);
    Status.add("yellow", "Pending");
    Status.add("red", "Cancel");
    Status.add("green", "Done", true);

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

    /*-----------------Time-----------------*/ 
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
    /*---------------New Task---------------*/
        /*-----------Open menu----------*/ 
    $('body').on('click', ".status__add__button_open", function() {
        Status.toggleTextarea($(this).parents().eq(1));
        $(this).parent().find(".status__add__value").focus();
        $(".container").scrollLeft($(".articles").width());
    });
        /*----------Close menu----------*/
    $('body').on('click', ".status__add__button_close", function() {
        Status.toggleTextarea($(this).parents().eq(3));
    });
        /*----------Add column----------*/
    $('body').on('click', ".status__add__button_add", function() {
        Status.add("purple");

        $(".container").scrollLeft($(".articles").width());
        $(".status__add__value").val("");
        $(".status__add__value").focus();
    });
    $('body').on('keydown', ".status__add__value", function() {
        if ( event.which == 13 ) {
            Status.add("purple");

            $(".container").scrollLeft($(".articles").width());
            $(".status__add__value").val("");
            $(".status__add__value").focus();

            event.preventDefault();
        }
        
    });
    /*----------------Column----------------*/
        /*-----------Touch menu----------*/
     $('body').on('click', ".article__head__button_menu", function() {
        Status.head_menu_touch($(this).parents().eq(2));
        $(this).parents().eq(2).find(".article__delete_confirm").addClass("hide");
    });
        /*--------Open color menu-------*/
    $('body').on('click', ".article__button_color", function() {
        Status.color_touchChoosing($(this).parents().eq(3));
    });
        /*---------Choose color---------*/
    $('body').on('click', ".choose-color span", function() {
        Status.color_change($(this).parents().eq(4), $(this).attr("class"));
        Status.head_menu_touch($(this).parents().eq(4));
        Status.color_touchChoosing($(this).parents().eq(4));
    });
        /*---------Delete confirm-------*/
    $('body').on('click', ".article__button_delete", function() {
        Status.delete_touchConfirm($(this).parents().eq(3));
    });
        /*------Delete confirm yes------*/ 
    $('body').on('click', ".article__delete_yes", function() {
        Status.delete($(this).parents().eq(4));
    });
        /*-------Delete confirm no------*/
    $('body').on('click', ".article__delete_no", function() {
        $(this).parent().addClass("hide");
    });
        /*---------Start rename---------*/
    $('body').on('click', ".article__button_rename", function() {
        Status.rename_start($(this).parents().eq(3));
        Status.head_menu_touch($(this).parents().eq(3));
    });
        /*--------Finish rename---------*/
    $('body').on('focusout', ".statusName", function() {
        Status.rename_finish($(this).parents().eq(1));
    });
    $('body').on('keypress', ".statusName", function() {
        if ( event.which == 13 ) {
            Status.rename_finish($(this).parents().eq(1));
        }
    });
    
    
    
    
    /*-----------------Task-----------------*/ 
        /*-------Touch adding menu------*/ 
    $('body').on('click', ".task__add__button_menu", function() {
        Task.add_toggleButtonMenu($(this).parents().eq(5));
    });
        /*---------Open adding----------*/
    $('body').on('click', ".task__add__button_open", function() {
        Task.add_toggleTextarea($(this).parents().eq(2));
        $(this).parents().eq(2).scrollTop($(this).parents().eq(2).height());
        $(this).parent().find(".task__add__value").focus();
    });
        /*---------Close adding----------*/
    $('body').on('click', ".task__add__button_close", function() {
        Task.add_toggleTextarea($(this).parents().eq(5));
    });
        /*-----------Add task------------*/
    $('body').on('click', ".task__add__button_add", function() {
        Task.add($(this).parents().eq(5));
        $(this).parents().eq(5).scrollTop($(this).parents().eq(5).height());
    });
    $('body').on('keypress', ".task__add__value", function() {
        if ( event.which == 13 ) {
            Task.add($(this).parents().eq(3));
            $(this).parents().eq(3).scrollTop($(this).parents().eq(3).height());
            event.preventDefault();
        }
    });
    
    
        /*--------------Rename--------------*/ 
    $('body').on('click', ".task__button_rename", function() {
        Task.rename($(this).parents().eq(2));
        $(this).parent().addClass("hide");
    });
        /*------------Save rename-----------*/
    $('body').on('focusout', ".taskName", function() {
        Task.saveRename($(this).parents().eq(1));
    }); 
        /*------Rename or Save rename-------*/
    $('body').on('keypress', ".taskName", function(event) {
        if ( event.which == 13 ) {
            if ($(this).hasClass("active")) {
                Task.saveRename($(this).parents().eq(1));
            } else {
                Task.rename($(this).parents().eq(1));
            }
        }
    }); 
        /*--------------Check---------------*/ 
    $('body').on('click', ".check", function() {
        if (!$(this).hasClass('checked')) {
            Task.check($(this));
            Task.checkMove($(this).parents().eq(2), ".listDone");
        } else {
            Task.check($(this));
            Task.checkMove($(this).parents().eq(2), ".listStatuses");
        }
    });
        /*----------Open task name----------*/
    $('body').on('click', ".task__button_show", function() {
        Task.touchValue($(this).parents().eq(3));
        $(this).parent().addClass("hide");
    });
        /*---------Close task name----------*/
    $('body').on('dblclick', ".openText", function() {
        Task.touchValue($(this).parents().eq(1));
    });

        /*------Show Adding new hashtag-----*/ 
    $('body').on('click', ".task__button_hashtag", function() {
        Task.touchMenu($(this).parents().eq(3));
        Task.hashtag_showAdding($(this).parents().eq(3));
        Task.hashtag_checkHeight($(this).parents().eq(3));
    });
        /*------Width of hashtag-input------*/
    $('body').on('input', ".hashtagValue", function() {
        let value = $(this),
            buffer = $(this).parent().find('.hashtagBuffer')
        buffer.text(value.val());
        value.width(buffer.width() + 35);
    });
        /*-----------Add hashtag------------*/
    $('body').on('keypress', ".hashtagValue", function() {
        if ( (event.which == 13) || (event.which == 44)) {
            Task.saveHashtag($(this).parents().eq(2));
            event.preventDefault();
        }
    });

         /*-------Open task name--------*/
    $('body').on('click', ".task__menu_open", function() {
        Task.touchMenu($(this).parents().eq(2));
    });
        /*--------Delete confirm--------*/
    $('body').on('click', ".task__button_delete", function() {
        Task.delete_touchConfirm($(this).parents().eq(3));
    });
        /*------Delete confirm yes------*/ 
    $('body').on('click', ".task__delete_yes", function() {
        Task.delete($(this).parents().eq(4));
    });
        /*-------Delete confirm no------*/
    $('body').on('click', ".task__delete_no", function() {
        $(this).parent().addClass("hide");
    });
    
    /*----------------CloseAll----------------*/
    $('body').on('click', function() {
        console.log(window.event.target);
        if (window.event.target.classList.contains("articles") || window.event.target.classList.contains("container")) {
            $(".taskName").removeClass("hide");
            $(".openText").addClass("hide");
            $(".task__add__adding-block").addClass("hide");
            $(".task__add__button_open").removeClass("hide");
            $(".status__add__adding-block").addClass("hide");
            $(".status__add__button_open").removeClass("hide");
            $(".article__buttons").addClass("hide");
            $(".task__add__menu__buttons").addClass("hide");
            $(".choose-color").addClass("hide");
            $(".article__delete_confirm").addClass("hide");
            $(".task__delete_confirm").addClass("hide");
            $(".task__buttons").addClass("hide");
            $(".hashtagValue").addClass("hide");
            $(".task").each(function(key, elem) {
                Task.hashtag_checkHeight($(elem));
            });
            
        }
    });
    $('body').on('click', ".task__hashtags div", function() {
        if ($(this).hasClass("active")) {
            Task.filterHashTags_remove($(this).html());
        } else {
            Task.filterHashTags_add($(this).html());
        }
    });
    /*----------------------------------------*/       
});
