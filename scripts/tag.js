let prevTagName = "";

let Tag = {

    add: function(task) {
        let hashtagInput = task.find(".hashtagValue"); 
        let hashtagName = "#" + hashtagInput.val(),
            hashtagsBlock = task.find(".task__hashtags"),
            datalist = task.parents().find("#hashtags");
        if ((hashtagName != "#") && (hashtagsBlock.find("div:contains('" + hashtagName + "')").length == 0)) { 
            Tag.addHtml(task, hashtagName);
            if ($("[value='" + hashtagName.substr(1) + "']").length == 0) {
                $(datalist).append(`<option value='${ hashtagName.substr(1) }'></option>`);
            }
            hashtagInput.width(60);
            hashtagInput.val('');
            hashtagInput.focus();
            /*LS.tag_add(task, hashtagName);*/
        }
    },

    addHtml: function(task, name) {
        $(`<div class="tag">
            <div class="tag_name lightblue">${ name }</div>
            <div class="tag__buttons hide">
                <button class="tag__button_rename i" title="Rename"><i class='fas fa-pen fa-lg'></i></button>
                <button class="tag__button_filter i" title="Filter"><i class='fas fa-filter fa-lg'></i></button>
                <button class="tag__button_color i" title="Paint"><i class='fas fa-palette fa-lg'></i></button>
                <div class="tag__choose-color hide">
                    <span class="lightblue"></span>
                    <span class="yellow"></span>
                    <span class="red"></span>
                    <span class="green"></span>
                    <span class="purple"></span>
                    <span class="lightgreen"></span>
                    <span class="orange"></span>
                </div>
                <button class="tag__button_delete i" title="Delete"><i class='fas fa-trash fa-lg'></i></button>
                <div class="tag__delete_confirm hide">
                    <button class="tag__delete_yes i" title="Delete"><i class='fas fa-check fa-lg'></i></button>
                    <button class="tag__delete_no i" title="Don't delete"><i class='fas fa-times fa-lg'></i></button>
                </div>
            </div>
        </div>`).insertBefore(task.find(".hashtagValue"));
    },

    menu_touch : function (tag) {
        tag.find(".tag__buttons").toggleClass("hide");
    },

    menu_color_touch: function (tag) {
        tag.find(".tag__choose-color").toggleClass("hide");
    },

    color_change: function (tag, color) {
        tag.find(".tag_name").removeClass().addClass(color).addClass("tag_name");

        // LS
    },

    delete_touchConfirm: function (tag) {
        tag.find(".tag__delete_confirm").toggleClass("hide");
    },
    
    rename_start: function (tag) {
        prevTagName = tag.find(".tag_name").text();
        tag.addClass("hide");
        let nameClone = tag.find(".tag_name").clone();
        let name = nameClone.text().substring(1);
        let color = nameClone.removeClass("tag_name").attr("class");
        tag.parent().find(".hashtagValue").removeClass().addClass("hashtagValue").addClass(color).addClass("rename").val(name).focus();

        // LS
    },

    rename_finish: function (task) {
        let tagInput = task.find(".hashtagValue");
            newTagName = "#" + tagInput.val();
        if ((newTagName != "") && ((newTagName == prevTagName) || (task.find("div:contains('" + newTagName + "')").length == 0))) {
            tag_name = task.find(("div div div div:contains(" + prevTagName + ")"));
            tag_name.parent().removeClass("hide");
            tag_name.text('').text(newTagName);
            tagInput.addClass("hide").val('');
            tagInput.parent().removeClass("rename");
            // LS
        }
    },


    delete: function (tag) {
        tag.detach();

        // LS
    },

    filter_on: function (tag) {
        let container = $(".container"),
            taskFilter = container.find("li.task"),
            tagName = tag.find(".tag_name").text();

        taskFilter.addClass("tag-filter_hide");
        filterTags.push(tagName);

        taskFilter.each(function(key, elem) {
            let c = 0;
            for (let i = 0; i < filterTags.length; i++) {
                let tagNames = $(elem).find("div div div div:contains('" + filterTags[i] + "')");
                if (tagNames.length) {
                    c++;
                }
            }
            if (c == filterTags.length) {
                $(this).removeClass("tag-filter_hide");
                $(this).find("div div div div:contains('" + tag.find(".tag_name").text() + "')").addClass("activeTag");
            }
        });
    },

    filter_off: function (tag) {
        let container = $(".container"),
            taskFilter = container.find("li.task"),
            tagName = tag.find(".tag_name").text();

        taskFilter.removeClass("tag-filter_hide");
        let visable = container.find("div div div div div:contains('" + tagName + "')");
        visable.each(function(i,elem) {}).removeClass("activeTag");
        filterTags.splice(filterTags.indexOf(tagName), 1);
    },

}