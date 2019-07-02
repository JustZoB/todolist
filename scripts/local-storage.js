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

    move_check: function(li, newState) {
        let taskName = li.find(".taskName").val(),
            allTasks = JSON.parse(localStorage.getItem("todolist"));
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                allTasks[i].state = newState;
            }
        }
        localStorage.setItem("todolist", JSON.stringify(allTasks));
    },

    rename: function (li) {
        let allTasks = JSON.parse(localStorage.getItem("todolist")),
            taskName = li.find(".taskName").val();
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == prevName) {
                allTasks[i].name = taskName;
            }
        }
        localStorage.setItem("todolist", JSON.stringify(allTasks));
    },

    tag_add: function (task, hashtagName) {
        let allTasks = JSON.parse(localStorage.getItem("todolist")),
            localHashtags = [],
            tag = {},
            taskName = task.find(".taskName").val();

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
        localStorage.setItem("todolist", JSON.stringify(allTasks));
    },

    tag_color_change: function (task, tagName, color) {
        let allTasks = JSON.parse(localStorage.getItem("todolist")),
            taskName = task.find(".taskName").val();

        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                for (let j = 0; j < allTasks[i].tags.length; j++) {
                    if (allTasks[i].tags[j].name == tagName) {
                        allTasks[i].tags[j].color = color;
                    }
                }
            }
        }
        localStorage.setItem("todolist", JSON.stringify(allTasks));
    },

    tag_delete: function (task, tag) {
        let allTasks = JSON.parse(localStorage.getItem("todolist")),
            taskName = task.find(".taskName").val(),
            tagName = tag.find(".tag_name").text();

        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                for (let j = 0; j < allTasks[i].tags.length; j++) {
                    if (allTasks[i].tags[j].name == tagName) {
                        allTasks[i].tags.splice(j, 1);
                    }
                }
            }
        }
        localStorage.setItem("todolist", JSON.stringify(allTasks));
    },

    tag_rename: function (task, name) {
        let allTasks = JSON.parse(localStorage.getItem("todolist")),
            taskName = task.find(".taskName").val();

        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].name == taskName) {
                for (let j = 0; j < allTasks[i].tags.length; j++) {
                    if (allTasks[i].tags[j].name == prevTagName) {
                        allTasks[i].tags[j].name = name;
                    }
                }
            }
        }
        localStorage.setItem("todolist", JSON.stringify(allTasks));
    },
}