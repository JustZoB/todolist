let articles_array = [];

let Status = {
    add: function (color, nameValue, deleteDisabled) {
        if (nameValue == undefined) {
            nameValue = $(".status__add__value").val();
        }
        if (nameValue != "") {
            Status.addHtml(color, nameValue, deleteDisabled);
        }
    },      

    addHtml: function (color, name, deleteDisabled) {
        let articles = $(".articles");
        let id = articles_array.length;
        articles_array.push(id);
        let ids_array = articles_array.slice(0);
        for (let i = 0; i < ids_array.length; i++) {
            ids_array[i] = "#" + ids_array[i];
        }
        let newStatuses = articles.find(".newStatus");
        let listClass = name[0].toUpperCase() + name.slice(1);;
        if (deleteDisabled == true) {
            deleteDisabled = " disabled";
        }

        $(`<article class="${ color }">
            <div class="article__color"></div>
            <div class="article__head">
                <h2>${ name }</h2>
                <input class='statusName active hide' type='text' value='${ name }'></input>
                <div class="article__head__menu">
                    <button class="article__head__button_menu i basic"><i class="fas fa-ellipsis-h fa-lg"></i></button>
                    <div class="article__buttons popup hide">
                        <button class="article__button_rename i basic" title="Rename"><i class='fas fa-pen fa-lg'></i></button>
                        <button class="article__button_color i basic" title="Paint"><i class='fas fa-palette fa-lg'></i></button>
                        <div class="article__choose-color popup hide">
                            <span class="blue"></span>
                            <span class="yellow"></span>
                            <span class="red"></span>
                            <span class="green"></span>
                            <span class="purple"></span>
                            <span class="lightgreen"></span>
                            <span class="orange"></span>
                        </div>
                        <button class="article__button_delete i basic" title="Delete"${ deleteDisabled }><i class='fas fa-trash fa-lg'></i></button>
                        <div class="article__delete_confirm popup hide">
                            <button class="article__delete_yes i" title="Delete"><i class='fas fa-check fa-lg'></i></button>
                            <button class="article__delete_no i" title="Don't delete"><i class='fas fa-times fa-lg'></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <ul class="list${ listClass } list" id="${ id }"></ul>
            <div class="newTask">
                <div class="newTask__content">
                    <button class="newTask__button_open">Add card</button>
                    <div class="newTask__adding-block hide">
                        <textarea class="newTask__value" type="text" placeholder="Enter a head of your task..."></textarea>
                        <div class='newTask__hashtags hide'>
                            <input class='newTask__hashtagValue lightblue' type='text' list='hashtags'></input>
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
                Task.move_dd(ui.item, findClass(ui.item.parent().attr('class')));
            }
        }).disableSelection();

        $( "#articles" ).sortable().disableSelection();

        articles.width(articles.width() + 390);
    },

    color_change: function (article, color) {
        article.removeClass().addClass(color);
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

    delete_touchConfirm: function (article) {
        article.find(".article__delete_confirm").toggleClass("hide");
    },
    
    delete: function (article) {
        article.detach();

        let articles = $(".articles");
        articles.width(articles.width() - 390);
    },

    rename_start: function (article) {
        article.find("h2").addClass("hide");
        article.find(".statusName").removeClass("hide").focus().val('').val(article.find("h2").text());
    },

    rename_finish: function (article) {
        article.find("h2").text(article.find(".statusName").val());
        article.find("h2").removeClass("hide");
        article.find(".statusName").addClass("hide");

        /*LS */
    },

    newStatus_menu_color_touch: function (article) {
        article.find(".status__add__choose-color").toggleClass("hide");
    },

    newStatus_color_change: function (button, color) {
        button.removeClass().addClass(color).addClass("status__add__button_color i");
    },
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