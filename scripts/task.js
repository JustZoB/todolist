let prevName = "",
    filterTags = [];

let Task = {
    add: function(article) {
        let name = article.find(".newTask__value");
        let nameValue = name.val();
        if (nameValue != "") {
            let listState = findClass(article.find(".list").attr("class"));
            Task.addHtml(nameValue, article.find(".list"));
            LS.add(nameValue, listState);
        }
        article.find(".newTask__value").focus();
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

        name = escapeHtml(name);

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
                    <button class='check${ checked } i basic'><i class='${ check_icon } fa-lg'></i></button>
                    <input class='taskName' type='text' value='${ name }' readonly></input>
                    <p class="openText hide">${ name }</p>
                    <button class='task__menu_open i basic'><i class='fas fa-ellipsis-h fa-lg'></i></button>
                    <div class="task__buttons popup hide">
                        <button class="task__button_rename i basic" title="Rename"><i class='fas fa-pen fa-lg'></i></button>
                        <button class="task__button_hashtag i basic" title="Add tag"><i class='fas fa-hashtag fa-lg'></i></button>
                        <button class="task__button_show i basic" title="Show all text"><i class='fas fa-eye fa-lg'></i></button>
                        <button class="task__button_delete i basic" title="Delete"><i class='fas fa-trash fa-lg'></i></button>
                        <div class="task__delete_confirm popup hide">
                            <button class="task__delete_yes i" title="Delete"><i class='fas fa-check fa-lg'></i></button>
                            <button class="task__delete_no i" title="Don't delete"><i class='fas fa-times fa-lg'></i></button>
                        </div>
                    </div>
                </div>
                <div class='task__hashtags'>
                    <input class='hashtagValue lightblue hide' type='text' list='hashtags'></input>
                    <span class="hashtagBuffer"></span>
                </div>
            </div>
        </li>`);

        if (tags != undefined) {
            let li = list.find(".task:last-child"),
                datalist = li.parents().eq(3).find("#hashtags");

            for (let i = 0; i < tags.length; i++) {
                Tag.addHtml(li, tags[i]);
                if ($("[value='" + tags[i].substr(1) + "']").length == 0) {
                    $(datalist).append(`<option value='${ tags[i].substr(1) }'></option>`);
                }
            }
        }
    },

    rename_start: function (content) {  
        content.find(".taskName").removeAttr("readonly").css("cursor", "text").addClass("active");
        prevName = content.find(".taskName").val();
        content.find(".taskName").focus().val('').val(prevName);
    },

    rename_finish: function (content) { 
        content.find(".taskName").attr("readonly", '').css("cursor", "default").removeClass("active");

        LS.rename_finish(content.parent());
    },

    move_dd: function (li, newState) {
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

    move_check: function (li, newState) {
        li.detach().appendTo($(newState));
        
        LS.move_check(li, newState);
    },

    check: function (checkbox) {
        checkbox.toggleClass('checked');
        checkbox.find("i").toggleClass('fas fa-check-square far fa-square');
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

    delete_touchConfirm: function (task) {
        task.find(".task__delete_confirm").toggleClass("hide");
    },

    hashtag_showAdding: function (task) {
        task.find(".hashtagValue").removeClass("hide");
        task.find(".hashtagValue").focus();
    },

    hashtag_checkHeight: function (task) {
        console.log(task.find(".task__hashtags").height());
        console.log(task);
        if (task.find(".task__hashtags").height() == 0) {
            task.find(".task__hashtags").css({"padding-bottom" : "0"});
        } else {
            task.find(".task__hashtags").css({"padding-bottom" : "5px"});
        }
    },

    scrollToBottom: function (column) {
        column.scrollTop(column.height());
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

    // rebuild
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