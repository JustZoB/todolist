$( document ).ready(function() {
    if(LS.test() === true){
        let localColumns = JSON.parse(localStorage.getItem("columns_list"));
        if (localColumns != null) {
            for (let i = 0; i < localColumns.length; i++) {
                Status.addHtml(localColumns[i].color, localColumns[i].name, localColumns[i].deleteD);
            } 
        } else {
            Status.add("blue", "Statuses", true);
            Status.add("yellow", "Pending", false);
            Status.add("red", "Cancel", false);
            Status.add("green", "Done", true);
        }

        let localTasks = JSON.parse(localStorage.getItem("todolist"));
        if (localTasks != null) {
            for (let i = 0; i < localTasks.length; i++) {
                Task.addHtml(localTasks[i].name, $("." + localTasks[i].state), localTasks[i].tags);
            }
        }
    }
    $(".task").each(function(key, elem) {
        Task.hashtag_checkHeight($(elem));
    });
    $(".list").each(function(key, elem) {
        Status.resize($(elem));
    });
});
