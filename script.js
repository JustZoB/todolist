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
        if (window.location.href.indexOf("/index.html##") != -1) {
            localTask = JSON.parse(atob(window.location.href.slice(window.location.href.indexOf("/index.html") + 13, window.location.href.indexOf("__")))),
            color = JSON.parse(atob(window.location.href.slice(window.location.href.indexOf("__") + 2)));
            Task.sharingHtml(localTask, color);
        } else {
            if (window.location.href.endsWith("/index.html")) {
                var localColumns = JSON.parse(localStorage.getItem("columns_list")),
                    localTasks = JSON.parse(localStorage.getItem("todolist_v1.01"));
            } else {
                var url = window.location.href,
                    localColumns = JSON.parse(atob(window.location.href.slice(window.location.href.indexOf("/index.html") + 12, window.location.href.indexOf("__")))),
                    localTasks = JSON.parse(atob(window.location.href.slice(window.location.href.indexOf("__") + 2)));
            }
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
            
            if (localTasks != null) {
                for (let i = 0; i < localTasks.length; i++) {
                    Task.addHtml(localTasks[i].name, $("." + localTasks[i].state), localTasks[i].tags);
                }
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
