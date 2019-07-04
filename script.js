$( document ).ready(function() {
    if(LS.test() === true){
        let theme = JSON.parse(localStorage.getItem("todolist_theme")); 
        if (theme == "day") {
            $("body").removeClass().addClass("day");
            $(".sun").toggleClass("hide");
            $(".moon").toggleClass("hide");
        } else {
            $("body").removeClass().addClass("night");
        }

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

        let localTasks = JSON.parse(localStorage.getItem("todolist_v1.01"));
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
