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

    column_add: function (color, name, disabled) {
        let columns = JSON.parse(localStorage.getItem("columns_list")),
            localColumn = {};
        if (columns == null) {
            columns = [];
        }
        localColumn.name = name;
        localColumn.color = color;
        localColumn.deleteD = disabled;
        columns.push(localColumn);
        localStorage.setItem("columns_list", JSON.stringify(columns));
    },

    column_rename: function (article) {
        let columns = JSON.parse(localStorage.getItem("columns_list")),
            statusName = article.find("h2").text();
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].name == statusPrevName) {
                columns[i].name = statusName;
                break;
            }
        }
        localStorage.setItem("columns_list", JSON.stringify(columns));
    },

    column_color_change: function (article, color) {
        let columns = JSON.parse(localStorage.getItem("columns_list"));
        let name = article.find("h2").text();
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].name == name) {
                columns[i].color = color;
                break;
            }
        }
        localStorage.setItem("columns_list", JSON.stringify(columns));
    },

    column_delete: function (article) {
        let columns = JSON.parse(localStorage.getItem("columns_list"));
        let name = article.find("h2").text();
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].name == name) {
                columns.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("columns_list", JSON.stringify(columns));
    },

    task_add: function (name, listState) {
        let allTasks = JSON.parse(localStorage.getItem("todolist_v1.01")),
            localTask = {};
        if (allTasks == null) {
            allTasks = [];
        }
        localTask.name = name;
        localTask.state = listState;
        allTasks.push(localTask);
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    task_rename: function (li) {
        let allTasks = JSON.parse(localStorage.getItem("todolist_v1.01")),
            taskName = li.find(".taskName").val();
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == prevName) {
                allTasks[i].name = taskName;
                break;
            }
        }
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    task_order: function (li, newState) {
        let prevLiName = li.prev().find(".taskName").val(),
            liName = li.find(".taskName").val(),
            allTasks = JSON.parse(localStorage.getItem("todolist_v1.01")),
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
        
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    status_order: function (article, statusName) {
        let prevStatusName = article.prev().find("h2").text(),
            columns = JSON.parse(localStorage.getItem("columns_list")),
            positionToSet = 0,
            positionThatSet = 0,
            thatToSet = {};


        for (let i = 0; i < columns.length; i++) {
            if (columns[i].name == statusName) {
                thatToSet = columns[i];
                positionThatSet = i;
            }
            if (columns[i].name == prevStatusName) {
                positionToSet = i;
            }
        }
        if ((positionThatSet < positionToSet) || (prevStatusName == undefined)) {
            columns.splice(positionThatSet, 1);
            columns.splice(positionToSet, 0, thatToSet);
        } else {
            columns.splice(positionThatSet, 1);
            columns.splice(positionToSet + 1, 0, thatToSet);
        }
        
        localStorage.setItem("columns_list", JSON.stringify(columns));
    },

    task_move_check: function(li, newState) {
        let taskName = li.find(".taskName").val(),
            allTasks = JSON.parse(localStorage.getItem("todolist_v1.01"));
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                allTasks[i].state = newState.substr(1);
                break;
            }
        }
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    task_delete: function(li) {
        let allTasks = JSON.parse(localStorage.getItem("todolist_v1.01")),
            liName = li.find(".taskName").val();
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == liName) {
                allTasks.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    tag_add: function (taskName, hashtagName) {
        let allTasks = JSON.parse(localStorage.getItem("todolist_v1.01")),
            localHashtags = [],
            tag = {};

            tag.name = hashtagName;
            tag.color = "lightblue";
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                if (allTasks[i].tags == undefined) {
                    localHashtags[0] = tag;
                    allTasks[i].tags = localHashtags;
                } else {
                    allTasks[i].tags.push(tag);
                }
            }
        }
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    tag_color_change: function (task, tagName, color) {
        let allTasks = JSON.parse(localStorage.getItem("todolist_v1.01")),
            taskName = task.find(".taskName").val();

        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                for (let j = 0; j < allTasks[i].tags.length; j++) {
                    if (allTasks[i].tags[j].name == tagName) {
                        allTasks[i].tags[j].color = color;
                        break;
                    }
                }
            }
        }
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    tag_delete: function (task, tag) {
        let allTasks = JSON.parse(localStorage.getItem("todolist_v1.01")),
            taskName = task.find(".taskName").val(),
            tagName = tag.find(".tag_name").text();

        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                for (let j = 0; j < allTasks[i].tags.length; j++) {
                    if (allTasks[i].tags[j].name == tagName) {
                        allTasks[i].tags.splice(j, 1);
                        break;
                    }
                }
            }
        }
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    tag_rename: function (task, name) {
        let allTasks = JSON.parse(localStorage.getItem("todolist_v1.01")),
            taskName = task.find(".taskName").val();

        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                for (let j = 0; j < allTasks[i].tags.length; j++) {
                    if (allTasks[i].tags[j].name == prevTagName) {
                        allTasks[i].tags[j].name = name;
                        break;
                    }
                }
            }
        }
        localStorage.setItem("todolist_v1.01", JSON.stringify(allTasks));
    },

    theme: function() {
        let theme = JSON.parse(localStorage.getItem("todolist_theme"));
        if ($("body").hasClass("night")) {
            theme = "night";
        } else {
            theme = "day";
        }
        localStorage.setItem("todolist_theme", JSON.stringify(theme));
    }
}