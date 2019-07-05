let prevName = "",
    filterTags = [],
    newtask__addTags = [];

let Task = {
    add: function(article) {
        let name = article.find(".newTask__value"), 
            nameValue = name.val();
            
        if ((nameValue != "") && (Task.checkOtherNames(nameValue) == 0)){
            let listState = article.find(".list").clone().removeClass("list ui-sortable").attr("class");
            for (let i = 0; i < newTask_hashtags.length; i++) {
                if (newTask_hashtags[i].state == listState) {
                    newtask__addTags.push(newTask_hashtags[i]);
                    newTask_hashtags.splice(i, 1);
                    i--;
                }
            }
            Task.addHtml(nameValue, article.find(".list"), newtask__addTags);
            LS.task_add(nameValue, listState);
            
            for (let i = 0; i < newtask__addTags.length; i++) {
                LS.tag_add(nameValue, newtask__addTags[i].name);
            }
            let tags = article.find(".newTask__hashtags");
            tags.find(".tag").each(function(key, elem) {
                $(elem).detach();
            });
            let list = article.find(".list");
            Task.hashtag_checkHeight(list.find(".task").last());
            article.find(".newTask__value").focus();
            name.val("");
            newtask__addTags = [];
        }
    },

    delete: function(li) {
        li.detach();

        LS.task_delete(li);
    },

    addHtml: function (name, listState, tags) {
        let list = $(listState),
            check_icon = "",
            checked = "";

        name = escapeHtml(name);

        if (listState.hasClass("Done")) {
            checked = " checked";
            check_icon = "fas fa-check-square";
        } else {
            check_icon = "far fa-square";
        }

        $(list).append(`<li class="task">
            <div class="task__color"></div>
            <div class="task__content">
                <div class='task__name'>
                    <button class='check${ checked } i basic'><i class='${ check_icon } fa-lg'></i></button>
                    <input class='taskName' type='text' value='${ name }' readonly></input>
                    <p class="openText hide">${ name }</p>
                    <button class='task__menu_open i basic'><i class='fas fa-ellipsis-h fa-lg'></i></button>
                    <div class="task__buttons popup hide">
                        <button class="task__button_rename i basic" title="Rename"><i class='fas fa-pen fa-lg'></i></button>
                        <button class="task__button_hashtag i basic" title="Add tag"><i class='fas fa-hashtag fa-lg'></i></button>
                        <button class="task__button_share i basic" title="Share task"><i class='fas fa-share fa-lg'></i></button>
                        <div class="task__share popup hide">
                            <input class='task__share-input' type='text'></input>
                        </div>
                        <button class="task__button_show i basic" title="Show all text"><i class='fas fa-eye fa-lg'></i></button>
                        <button class="task__button_delete i basic" title="Delete"><i class='fas fa-trash fa-lg'></i></button>
                        <div class="task__delete_confirm popup hide">
                            <button class="task__delete_yes i" title="Delete"><i class='fas fa-check fa-lg'></i></button>
                            <button class="task__delete_no i" title="Don't delete"><i class='fas fa-times fa-lg'></i></button>
                        </div>
                    </div>
                </div>
                <div class='task__hashtags'>
                    <input class='hashtagValue lightblue hide' type='text' list='hashtags' placeholder='Tag'></input>
                    <span class="hashtagBuffer"></span>
                </div>
            </div>
        </li>`);

        if (tags != undefined) {
            let li = list.find(".task:last-child"),
                datalist = li.parents().eq(3).find("#hashtags");

            for (let i = 0; i < tags.length; i++) {
                Tag.addHtml(li, tags[i].name, tags[i].color);
                if ($("[value='" + tags[i].name.substr(1) + "']").length == 0) {
                    $(datalist).append(`<option value='${ tags[i].name.substr(1) }'></option>`);
                }
            }
        }
    },

    rename_start: function (content) {
        content.find(".openText").addClass("hide");
        content.find(".taskName").removeAttr("readonly").css("cursor", "text").addClass("active").removeClass("hide");
        prevName = content.find(".taskName").val();
        content.find(".taskName").focus().val('').val(prevName);
    },

    rename_finish: function (content) {
        let taskName = content.find(".taskName").val();
        
        if (((taskName != "") && (Task.checkOtherNames(taskName) == 1)) || ((Task.checkOtherNames(taskName) == 2) && (taskName == prevName))) {
            content.find(".taskName").attr("readonly", '').css("cursor", "default").removeClass("active");
            content.find(".openText").text(taskName);
            LS.task_rename(content.parent());
        }
    },

    move_dd: function (li, newState) {
        if (newState == "Done") {
            if (!li.find(".check").hasClass('checked')) {
                Task.check(li.find(".check"));
            }
        } else {
            if (li.find(".check").hasClass('checked')) {
                Task.check(li.find(".check"));
            }
        }  
        
        LS.task_order(li, newState);
    },

    move_check: function (li, newState) {
        li.detach().appendTo($(newState));
        
        LS.task_move_check(li, newState);
    },

    check: function (checkbox) {
        checkbox.toggleClass('checked');
        checkbox.find("i").toggleClass('fas fa-check-square far fa-square');
    },

    share: function (task) {
        let localTasks = JSON.parse(localStorage.getItem("todolist_v1.01"));
        let name = task.find(".taskName").val();
        let sharingTask = {};
        for (let i = 0; i < localTasks.length; i++) {
            if (localTasks[i].name == name) {
                sharingTask = JSON.stringify(localTasks[i]);
            }
        }
        color = JSON.stringify(task.parents().eq(1).attr('class'));

        task.find(".task__share").toggleClass("hide");
        $(".task__share-input")
        .val("##" + btoa(sharingTask) + "__" + btoa(color))
        .select();
        document.execCommand('copy');
    },

    name_show: function(li) {
        li.find(".taskName").toggleClass("hide");
        li.find(".openText").toggleClass("hide");
    },

    adding_textarea_touch: function (article) {
        article.find(".newTask__adding-block").toggleClass("hide");
        article.find(".newTask__button_open").toggleClass("hide");
    },

    adding_menu_touch: function (article) {
        article.find(".newTask__menu__buttons").toggleClass("hide");
    },

    menu_touch : function (task) {
        task.find(".task__buttons").toggleClass("hide");
    },

    delete_confirm_touch: function (task) {
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

    scrollToBottom: function (column) {
        column.scrollTop(column.height());
    },

    checkOtherNames: function(nameValue) {
        let task_names = [],
        mat = 0;
        
        $(".articles").find(".task").each(function(key, elem) {
            task_names.push($(elem).find(".taskName").val());
        });
        for (let i = 0; i < task_names.length; i++) {
            if (task_names[i] == nameValue) {
                mat++;
            }
        }
        return mat;
    },

    sharingHtml: function (localTask, color) {
        $(".newStatus").addClass("hide");
        $(".share-button").addClass("hide");

        let list = $(".container"),
            check_icon = "",
            checked = "";

        localTask.name = escapeHtml(localTask.name);

        if (localTask.state == "Done") {
            checked = " checked";
            check_icon = "fas fa-check-square";
        } else {
            check_icon = "far fa-square";
        }

        list.append(`<li class="task center">
            <div class="task__color ${ color }"></div>
            <div class="task__content">
                <div class='task__name'>
                    <button class='${ checked } i basic'><i class='${ check_icon } fa-lg'></i></button>
                    <input class='taskName long' type='text' value='${ localTask.name }' readonly></input>
                </div>
                <div class='task__hashtags'>
                    <input class='hashtagValue lightblue hide' type='text' list='hashtags' placeholder='Tag'></input>
                    <span class="hashtagBuffer"></span>
                </div>
            </div>
        </li>`);

        let tags = localTask.tags;
        if (tags != undefined) {
            let li = $(".task");

            for (let i = 0; i < tags.length; i++) {
                Tag.shareHtml(li, tags[i].name, tags[i].color);
            }
        }
    }
}

let entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }