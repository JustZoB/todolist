let prevTagName = "",
    newTask_hashtags = [];

let Tag = {

    add: function(task) {
        let hashtagInput = task.find(".hashtagValue"), 
            hashtagsBlock = task.find(".task__hashtags"),
            datalist = task.parents().find("#hashtags"),
            hashtagName = "#" + hashtagInput.val();

        if ((hashtagName != "#") && (hashtagsBlock.find("div:contains('" + hashtagName + "')").length == 0)) { 
            Tag.addHtml(task, hashtagName, "lightblue");
            if ($("[value='" + hashtagName.substr(1) + "']").length == 0) {
                $(datalist).append(`<option value='${ hashtagName.substr(1) }'></option>`);
            }
            hashtagInput.width(60);
            hashtagInput.val('');
            hashtagInput.focus();

            let taskName = task.find(".taskName").val();
            LS.tag_add(taskName, hashtagName);
        }
    },

    shareHtml: function(task, name, color) {
        $(`<div class="tag">
            <div class="tag_name ${ color }">${ name }</div>
        </div>`).insertBefore(task.find(".hashtagValue"));
    },

    addHtml: function(task, name, color) {
        $(`<div class="tag">
            <div class="tag_name ${ color }">${ name }</div>
            <div class="tag__buttons popup hide">
                <button class="tag__button_rename i basic" title="Rename"><i class='fas fa-pen fa-lg'></i></button>
                <button class="tag__button_filter i basic" title="Filter"><i class='fas fa-filter fa-lg'></i></button>
                <button class="tag__button_color i basic" title="Paint"><i class='fas fa-palette fa-lg'></i></button>
                <div class="tag__choose-color popup hide">
                    <div class="color-col">
                        <span class="lightblue"></span>
                        <span class="yellow"></span>
                        <span class="red"></span>
                        <span class="green"></span>
                        <span class="purple"></span>
                        <span class="lightgreen"></span>
                    </div>
                    <div class="color-col">
                        <span class="orange"></span>
                        <span class="navy"></span>
                        <span class="gold"></span>
                        <span class="cooper"></span>
                        <span class="lightpink"></span>
                        <span class="charcoal"></span>
                    </div>
                </div>
                <button class="tag__button_delete i basic" title="Delete"><i class='fas fa-trash fa-lg'></i></button>
                <div class="tag__delete_confirm popup hide">
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

        LS.tag_color_change(tag.parents().eq(2), tag.find(".tag_name").text(), color);
    },

    delete_confirm_touch: function (tag) {
        tag.find(".tag__delete_confirm").toggleClass("hide");
    },
    
    rename_start: function (tag) {
        prevTagName = tag.find(".tag_name").text();
        tag.addClass("hide");
        let nameClone = tag.find(".tag_name").clone(),
            name = nameClone.text().substring(1),
            color = nameClone.removeClass("tag_name").attr("class");
        tag.parent().find(".hashtagValue").removeClass().addClass("hashtagValue").addClass(color).addClass("rename").val(name).focus();
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
            
            LS.tag_rename(task, newTagName);
        }
    },


    delete: function (tag) {
        LS.tag_delete(tag.parents().eq(2), tag);
        tag.detach();
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

    newTask__add: function (article, name) {
        let state = article.find(".list").clone().removeClass("list ui-sortable").attr("class"),
            newTag = {};

        newTag.name = "#" + name;
        newTag.state = state;
        newTag.color = "lightblue";

        if ((name != "") && (Tag.checkOtherNames(article, newTag.name) == 0)){
            newTask_hashtags.push(newTag);
            $(`<div class="tag">
                <div class="tag_name lightblue">#${ name }</div>
            </div>`).insertBefore(article.find(".newTask__hashtagValue"));
            article.find(".newTask__hashtagValue").val('');
        }   
    },

    checkOtherNames: function(article, name) {
        let tagName_check = [],
            newTaskBlock = article.find(".newTask"),
            mat = 0;
        
        newTaskBlock.find(".tag").each(function(key, elem) {
            tagName_check.push($(elem).find(".tag_name").text());
        });
        for (let i = 0; i < tagName_check.length; i++) {
            if (tagName_check[i] == name) {
                mat++;
            }
        }
        return mat;
    }
}