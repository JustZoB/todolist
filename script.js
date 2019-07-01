$( document ).ready(function() {
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
});
