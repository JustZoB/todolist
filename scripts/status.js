let articles_array = [],
    statusPrevName = "";

let Status = {

    add: function (color, nameValue, disabled) {
        if ((nameValue != "") && (Status.checkOtherNames(nameValue) == 0)) {
            Status.addHtml(color, nameValue, disabled);
            LS.column_add(color, nameValue, disabled);
            $(".articles").find("status__add__value").val('').focus();
            $(".container").scrollLeft($(".articles").width());
        }
    },      

    addHtml: function (color, name, disabled) {
        let articles = $(".articles");
        let id = articles_array.length;
        articles_array.push(id);
        let ids_array = articles_array.slice(0);
        for (let i = 0; i < ids_array.length; i++) {
            ids_array[i] = "#" + ids_array[i];
        }
        let newStatuses = articles.find(".newStatus");
        let listClass = name[0].toUpperCase() + name.slice(1);;
        if (disabled == true) {
            disabled = " disabled";
        }

        $(`<article class="${ color }">
            <div class="article__color"></div>
            <div class="article__head">
                <h2>${ name }</h2>
                <input class='statusName active hide' type='text' maxlength="12" value='${ name }'></input>
                <div class="article__head__menu">
                    <button class="article__head__button_menu i basic"><i class="fas fa-ellipsis-h fa-lg"></i></button>
                    <div class="article__buttons popup hide">
                        <button class="article__button_rename i basic" title="Rename"${ disabled }><i class='fas fa-pen fa-lg'></i></button>
                        <button class="article__button_color i basic" title="Paint"><i class='fas fa-palette fa-lg'></i></button>
                        <div class="article__choose-color popup hide">
                            <span class="blue"></span>
                            <span class="yellow"></span>
                            <span class="red"></span>
                            <span class="green"></span>
                            <span class="purple"></span>
                            <span class="lightgreen"></span>
                            <span class="orange"></span>
                            <span class="navy"></span>
                            <span class="gold"></span>
                            <span class="cooper"></span>
                            <span class="lightpink"></span>
                            <span class="charcoal"></span>
                        </div>
                        <button class="article__button_delete i basic" title="Delete"${ disabled }><i class='fas fa-trash fa-lg'></i></button>
                        <div class="article__delete_confirm popup hide">
                            <button class="article__delete_yes i" title="Delete"><i class='fas fa-check fa-lg'></i></button>
                            <button class="article__delete_no i" title="Don't delete"><i class='fas fa-times fa-lg'></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <ul class="${ listClass } list" id="${ id }"></ul>
            <div class="newTask">
                <div class="newTask__content">
                    <button class="newTask__button_open">Add card</button>
                    <div class="newTask__adding-block hide">
                        <textarea class="newTask__value" type="text" placeholder="Enter a head of your task..."></textarea>
                        <div class='newTask__hashtags hide'>
                            <input class='newTask__hashtagValue lightblue' type='text' list='hashtags' placeholder='Tag'></input>
                            <span class="newTask__hashtagBuffer"></span>
                        </div>
                        <div class="newTask__buttons">
                            <div class="newTask__buttons_change">
                                <button class="newTask__button_add">Add card</button>
                                <button class="newTask__button_close i basic" title="Close"><i class="fas fa-times fa-lg"></i></button>
                            </div>
                            <div class="newTask__menu">
                                <button class="newTask__button_menu i basic"><i class="fas fa-ellipsis-v fa-lg"></i></button>
                                <div class="newTask__menu__buttons popup hide">
                                    <button class="newTask__button_hashtags i basic" title="Add tag"><i class='fas fa-hashtag fa-lg'></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>`).insertBefore(newStatuses);


        let string = ids_array.join(', ');
        $( string ).sortable({
            connectWith: ".list",
            placeholder: "sortPlaceholder",
            update: function(event, ui) {
                Task.move_dd(ui.item, ui.item.parent().clone().removeClass("list ui-sortable").attr('class'));
            }
        }).disableSelection();

        $( "#articles" ).sortable({
            items: "article",
            handle: ".article__color", 
            update: function(event, ui) {
                LS.status_order(ui.item, ui.item.find("h2").text());
            }
        }).disableSelection();

        articles.width(articles.width() + 380);
    },

    rename_start: function (article) {
        article.find("h2").addClass("hide");
        statusPrevName = article.find("h2").text();
        article.find(".statusName").removeClass("hide").focus().val('').val(article.find("h2").text());
    },

    rename_finish: function (article) {
        let statusNewName = article.find(".statusName").val();

        if (((statusNewName != "") && (Status.checkOtherNames(statusNewName) == 0)) || ((Status.checkOtherNames(statusNewName) == 1) && (statusNewName == statusPrevName))) {
            article.find("h2").text(statusNewName);
            article.find("h2").removeClass("hide");
            article.find(".statusName").addClass("hide");
    
            LS.column_rename(article);
        }
    },

    color_change: function (article, color) {
        article.removeClass().addClass(color);
        LS.column_color_change(article, color);
    },

    delete: function (article) {
        LS.column_delete(article);
        article.detach();

        let articles = $(".articles");
        articles.width(articles.width() - 380);
    },

    textarea_touch: function (article) {
        article.find(".status__add__adding-block").toggleClass("hide");
        article.find(".status__add__button_open").toggleClass("hide");
    },

    head_menu_touch: function (article) {
        article.find(".article__buttons").toggleClass("hide");
    },

    menu_color_touch: function (article) {
        article.find(".article__choose-color").toggleClass("hide");
    },

    delete_confirm_touch: function (article) {
        article.find(".article__delete_confirm").toggleClass("hide");
    },

    newStatus_menu_color_touch: function (article) {
        article.find(".status__add__choose-color").toggleClass("hide");
    },

    newStatus_color_change: function (button, color) {
        button.removeClass().addClass(color).addClass("status__add__button_color i");
    },

    resize: function (ul) {
        if ((ul.outerHeight() + 200) > ul.parent().outerHeight()) { 
            ul.parent().find(".article__head").css({ marginLeft : "14px",  marginRight : "18px" });
            ul.parent().find(".article__color").css({ marginLeft : "14px" });
        } else {
            ul.parent().find(".article__head").css({ marginLeft : "20px",  marginRight : "25px" });
            ul.parent().find(".article__color").css({ marginLeft : "20px" });
        }
    },

    checkOtherNames: function(nameValue) {
        let article_names = [],
            mat = 0;
    
        $(".articles").find("h2").each(function(key, elem) {
            article_names.push($(elem).text());
        });
        for (let i = 0; i < article_names.length; i++) {
            if (article_names[i] == nameValue) {
                mat++;
            }
        }
        return mat;
    }
}