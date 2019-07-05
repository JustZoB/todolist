/*-----------------Time-----------------*/
$('.sun, .moon').on('click', function() {
    $(this).parent().find(".sun").toggleClass("hide");
    $(this).parent().find(".moon").toggleClass("hide");
    $(this).parent().parent().toggleClass("day night");
    LS.theme();
});
/*----------------Share-----------------*/
$('.share-button').on('click', function() {
    if ($(".share-input").hasClass("hide")) {
        $(".share-copied").css(({ opacity: 0 })).animate({ opacity: 1 }, 500).animate({ opacity: 0 }, 3000);
    }
    $(".share-input")
        .toggleClass("hide")
        .val("#" + btoa(localStorage.getItem("columns_list")) + "__" + btoa(localStorage.getItem("todolist_v1.01")))
        .select();
    document.execCommand('copy');
    
});
/*---------------New Status---------------*/
    /*-----------Open menu----------*/ 
$('body').on('click', ".status__add__button_open", function() {
    Status.textarea_touch($(this).parents().eq(1));
    $(this).parent().find(".status__add__value").focus();
    $(".container").scrollLeft($(".articles").width());
    $(this).blur();
});
    /*----------Close menu----------*/
$('body').on('click', ".status__add__button_close", function() {
    Status.textarea_touch($(this).parents().eq(3));
});
    /*----------Add column----------*/
$('body').on('click', ".status__add__button_add", function() {
    let button_color = $(this).parent().find(".status__add__button_color"),
        color = button_color.clone().removeClass("status__add__button_color i").attr("class");
    Status.add(color, $(".status__add__value").val(), false);
});
$('body').on('keydown', ".status__add__value", function() {
    if ( event.which == 13 ) {
        let button_color = $(this).parent().find(".status__add__button_color"),
            color = button_color.clone().removeClass("status__add__button_color i").attr("class");
        Status.add(color, $(this).val(), false);
        $(this).val('');
        event.preventDefault();
    }
    if ( event.which == 32 ) {
        event.preventDefault();
    }
});

/*----------------Column----------------*/
    /*----------Touch menu----------*/
 $('body').on('click', ".article__head__button_menu", function() {
    Status.head_menu_touch($(this).parents().eq(2));
    $(this).parents().eq(2).find(".article__delete_confirm").addClass("hide");
    $(this).blur();
});
    /*--------Open color menu-------*/
$('body').on('click', ".article__button_color", function() {
    Status.menu_color_touch($(this).parents().eq(3));
    $(this).blur();
});
    /*---------Choose color---------*/
$('body').on('click', ".article__choose-color span", function() {
    Status.color_change($(this).parents().eq(4), $(this).attr("class"));
    Status.head_menu_touch($(this).parents().eq(4));
    Status.menu_color_touch($(this).parents().eq(4));
});
    /*---------Delete confirm-------*/
$('body').on('click', ".article__button_delete", function() {
    Status.delete_confirm_touch($(this).parents().eq(3));
    $(this).blur();
});
    /*------Delete confirm yes------*/ 
$('body').on('click', ".article__delete_yes", function() {
    Status.delete($(this).parents().eq(4));
});
    /*-------Delete confirm no------*/
$('body').on('click', ".article__delete_no", function() {
    $(this).parent().addClass("hide");
});
    /*---------Start rename---------*/
$('body').on('click', ".article__button_rename", function() {
    Status.rename_start($(this).parents().eq(3));
    Status.head_menu_touch($(this).parents().eq(3));
});
    /*--------Finish rename---------*/
$('body').on('focusout', ".statusName", function() {
    Status.rename_finish($(this).parents().eq(1));
});
$('body').on('keypress', ".statusName", function() {
    if ( event.which == 13 ) {
        Status.rename_finish($(this).parents().eq(1));
        event.preventDefault();
    }
    if ( event.which == 32 ) {
        event.preventDefault();
    }
});
    /*-------Touch color menu-------*/
$('body').on('click', ".status__add__button_color", function() {
    Status.newStatus_menu_color_touch($(this).parents().eq(1));
});
    /*---------Choose color---------*/
$('body').on('click', ".status__add__choose-color span", function() {
    let button = $(this).parents().eq(1).find(".status__add__button_color");
    Status.newStatus_color_change(button, $(this).attr("class"));
    Status.newStatus_menu_color_touch($(this).parents().eq(2));
});
   



/*---------------New Task---------------*/ 
    /*-------Touch adding menu------*/ 
$('body').on('click', ".newTask__button_menu", function() {
    Task.adding_menu_touch($(this).parents().eq(5));
    $(this).blur();
});
    /*---------Open adding----------*/
$('body').on('click', ".newTask__button_open", function() {
    Task.adding_textarea_touch($(this).parents().eq(2));
    Task.scrollToBottom($(this).parents().eq(2));
    $(this).parent().find(".newTask__value").focus();
});
    /*---------Close adding----------*/
$('body').on('click', ".newTask__button_close", function() {
    Task.adding_textarea_touch($(this).parents().eq(5));
});
    /*-------------Add---------------*/
$('body').on('click', ".newTask__button_add", function() {
    Task.add($(this).parents().eq(5));
    Task.scrollToBottom($(this).parents().eq(5));
});
$('body').on('keypress', ".newTask__value", function() {
    if ( event.which == 13 ) {
        Task.add($(this).parents().eq(3));
        Task.scrollToBottom($(this).parents().eq(3));
        event.preventDefault(); 
    }
});
    /*----Open input for hashtags----*/
$('body').on('click', ".newTask__button_hashtags", function() {
    $(this).parents().eq(3).find(".newTask__hashtags").toggleClass("hide");
    $(this).parents().eq(3).find(".newTask__hashtagValue").focus();
    Task.adding_menu_touch($(this).parents().eq(6));
    Task.scrollToBottom($(this).parents().eq(6));
});

    /*----------Add hashtags---------*/
$('body').on('keypress', ".newTask__hashtagValue", function() {
    if ( (event.which == 13) || (event.which == 44)) {
        Tag.newTask__add($(this).parents().eq(4), $(this).val());
        event.preventDefault();
    }
});



/*-----------------Task-----------------*/
    /*------------Rename------------*/ 
$('body').on('click', ".task__button_rename", function() {
    Task.rename_start($(this).parents().eq(2));
    $(this).parent().addClass("hide");
});
    /*----------Save rename---------*/
$('body').on('focusout', ".taskName", function() {
    Task.rename_finish($(this).parents().eq(1));
}); 
    /*----Rename or Save rename-----*/
$('body').on('keypress', ".taskName", function(event) {
    if ( event.which == 13 ) {
        if ($(this).hasClass("active")) {
            Task.rename_finish($(this).parents().eq(1));
        } else {
            Task.rename_start($(this).parents().eq(1));
        }
    }
}); 
    /*------------Check-------------*/ 
$('body').on('click', ".check", function() {
    if (!$(this).hasClass('checked')) {
        Task.check($(this));
        Task.move_check($(this).parents().eq(2), ".Done");
    } else {
        Task.check($(this));
        Task.move_check($(this).parents().eq(2), ".Statuses");
    }
    Status.resize($(".Done"));
    Status.resize($(".Statuses"));
});
    /*--------Open task name--------*/
$('body').on('click', ".task__button_show", function() {
    Task.name_show($(this).parents().eq(3));
    $(this).parent().addClass("hide");
    Status.resize($(this).parents().eq(4));
});
    /*----Show Adding new hashtag---*/ 
$('body').on('click', ".task__button_hashtag", function() {
    Task.menu_touch($(this).parents().eq(3));
    Task.hashtag_showAdding($(this).parents().eq(3));
    Task.hashtag_checkHeight($(this).parents().eq(3));
    Status.resize($(this).parents().eq(4));
});
$('body').on('click', '.task__button_share', function() {
    Task.share($(this).parents().eq(3));
});
    /*-------Touch task name--------*/
$('body').on('click', ".task__menu_open", function() {
    Task.menu_touch($(this).parents().eq(2));
    Status.resize($(this).parents().eq(3));
    $(this).blur();
});
    /*--------Delete confirm--------*/
$('body').on('click', ".task__button_delete", function() {
    Task.delete_confirm_touch($(this).parents().eq(3));
    $(this).blur();
});
    /*------Delete confirm yes------*/ 
$('body').on('click', ".task__delete_yes", function() {
    Task.delete($(this).parents().eq(4));
    Status.resize($(this).parents().eq(5));
});
    /*-------Delete confirm no------*/
$('body').on('click', ".task__delete_no", function() {
    $(this).parent().addClass("hide");
});



/*-----------------Tag------------------*/
    /*-------------Add--------------*/
$('body').on('keypress', ".hashtagValue", function() {
    if ( (event.which == 13) || (event.which == 44)) {
        if (!$(this).hasClass("rename")) {
            Tag.add($(this).parents().eq(2));
            event.preventDefault();
            Status.resize($(this).parents().eq(3));
        }
    }
});
    /*----Width of hashtag-input----*/
$('body').on('input', ".hashtagValue", function() {
    let value = $(this),
        buffer = $(this).parent().find('.hashtagBuffer')
    buffer.text(value.val());
    value.width(buffer.width() + 35);
});
    /*------Touch menu of tag-------*/
$('body').on('click', ".tag_name", function() {
    Tag.menu_touch($(this).parent());
    $(this).blur();
});
    /*------------Rename------------*/
$('body').on('click', ".tag__button_rename", function() {
    Tag.menu_touch($(this).parents().eq(1));
    Tag.rename_start($(this).parents().eq(1));

    let value = $(this).parents().eq(2).find('.hashtagValue'),
        buffer = $(this).parents().eq(2).find('.hashtagBuffer');
    buffer.text(value.val());
    value.width(buffer.width() + 35);
});
    /*---------Save rename----------*/
$('body').on('keypress', ".hashtagValue", function() {
    if ((event.which == 13)) {
        if ($(this).hasClass("rename")) {
            Tag.rename_finish($(this).parents().eq(2));
            event.preventDefault();
        }
    }
    if (event.which == 44) {
        event.preventDefault();
    }
});
    /*-----------Filter------------*/
$('body').on('click', ".tag__button_filter", function() {
    if ($(this).parents().eq(1).find(".tag_name").hasClass("activeTag")) {
        Tag.menu_touch($(this).parents().eq(1));
        Tag.filter_off($(this).parents().eq(1));
    } else {
        Tag.menu_touch($(this).parents().eq(1));
        Tag.filter_on($(this).parents().eq(1));
    }
});

    /*------Open color menu---------*/
$('body').on('click', ".tag__button_color", function() {
    Tag.menu_color_touch($(this).parents().eq(1));
    $(this).blur();
});
    /*--------Choose color----------*/
$('body').on('click', ".tag__choose-color span", function() {
    Tag.color_change($(this).parents().eq(3), $(this).attr("class"));
    Tag.menu_touch($(this).parents().eq(3));
    Tag.menu_color_touch($(this).parents().eq(3));
});
    /*---------Delete confirm-------*/
$('body').on('click', ".tag__button_delete", function() {
    Tag.delete_confirm_touch($(this).parents().eq(1));
    $(this).blur();
});
    /*------Delete confirm yes------*/ 
$('body').on('click', ".tag__delete_yes", function() {
    let task = $(this).parents().eq(5);
    Tag.delete($(this).parents().eq(2));
    Task.hashtag_checkHeight(task);
});
    /*-------Delete confirm no------*/
$('body').on('click', ".tag__delete_no", function() {
    $(this).parent().addClass("hide");
});

/*----------------CloseAll----------------*/
$('body').on('click', function() {
    console.log(window.event.target);
    if (window.event.target.classList.contains("articles") || window.event.target.classList.contains("container")) {
        $(".openText").addClass("hide");
        $(".taskName").removeClass("hide");
        $(".newTask__adding-block").addClass("hide");
        $(".newTask__button_open").removeClass("hide");
        $(".status__add__adding-block").addClass("hide");
        $(".status__add__button_open").removeClass("hide");
        $(".statusName").addClass("hide");
        $("h2").removeClass("hide");
        
        $(".hashtagValue").each(function(key, elem) {
            if ($(elem).hasClass("rename")) {
                $(".tag").removeClass("hide");
                $(elem).addClass("hide").val('').removeClass("rename");
            } else {
                $(elem).addClass("hide").val('');
            }
        });
        $(".task").each(function(key, elem) {
            Task.hashtag_checkHeight($(elem));
        });
        $(".list").each(function(key, elem) {
            Status.resize($(elem));
        });
    }
});

eventsClose(".article__choose-color");
eventsClose(".task__buttons");
eventsClose(".tag__delete_confirm");
eventsClose(".task__delete_confirm");
eventsClose(".article__delete_confirm");
eventsClose(".newTask__menu__buttons");
eventsClose(".article__buttons");
eventsClose(".status__add__choose-color");
eventsClose(".tag__choose-color");
eventsClose(".task__share");
eventsClose(".share-input");
//eventsClose(".share-copied");


function eventsClose (classes, second) {
    $(document).mouseup(function (e){
        let div = $(classes);
        div.each(function(key, elem) {
            if ((!$(elem).is(e.target)) && ($(elem).has(e.target).length === 0) && (!$(elem).prev().is(e.target)) && ($(elem).prev().has(e.target).length === 0)) {
                $(elem).addClass("hide");
            }
        });
    });
}
