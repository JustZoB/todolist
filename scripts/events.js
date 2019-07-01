/*-----------------Time-----------------*/ 
$('.sun').on('click', function() {
    toggleTime($(this).parent());
});
$('.moon').on('click', function() {
    toggleTime($(this).parent());
});
function toggleTime (menu) {
    menu.find(".sun").toggleClass("hide");
    menu.find(".moon").toggleClass("hide");
}
/*---------------New Task---------------*/
    /*-----------Open menu----------*/ 
$('body').on('click', ".status__add__button_open", function() {
    Status.textarea_touch($(this).parents().eq(1));
    $(this).parent().find(".status__add__value").focus();
    $(".container").scrollLeft($(".articles").width());
});
    /*----------Close menu----------*/
$('body').on('click', ".status__add__button_close", function() {
    Status.textarea_touch($(this).parents().eq(3));
});
    /*----------Add column----------*/
$('body').on('click', ".status__add__button_add", function() {
    Status.add("purple");

    $(".container").scrollLeft($(".articles").width());
    $(".status__add__value").val("");
    $(".status__add__value").focus();
});
$('body').on('keydown', ".status__add__value", function() {
    if ( event.which == 13 ) {
        Status.add("purple");

        $(".container").scrollLeft($(".articles").width());
        $(".status__add__value").val("");
        $(".status__add__value").focus();

        event.preventDefault();
    }
    
});

/*----------------Column----------------*/
    /*----------Touch menu----------*/
 $('body').on('click', ".article__head__button_menu", function() {
    Status.head_menu_touch($(this).parents().eq(2));
    $(this).parents().eq(2).find(".article__delete_confirm").addClass("hide");
});
    /*--------Open color menu-------*/
$('body').on('click', ".article__button_color", function() {
    Status.menu_color_touch($(this).parents().eq(3));
});
    /*---------Choose color---------*/
$('body').on('click', ".article__choose-color span", function() {
    Status.color_change($(this).parents().eq(4), $(this).attr("class"));
    Status.head_menu_touch($(this).parents().eq(4));
    Status.menu_color_touch($(this).parents().eq(4));
});
    /*---------Delete confirm-------*/
$('body').on('click', ".article__button_delete", function() {
    Status.delete_touchConfirm($(this).parents().eq(3));
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
    }
});




/*-----------------Task-----------------*/ 
    /*-------Touch adding menu------*/ 
$('body').on('click', ".task__add__button_menu", function() {
    Task.adding_menu_touch($(this).parents().eq(5));
});
    /*---------Open adding----------*/
$('body').on('click', ".task__add__button_open", function() {
    Task.adding_textarea_touch($(this).parents().eq(2));
    $(this).parents().eq(2).scrollTop($(this).parents().eq(2).height());
    $(this).parent().find(".task__add__value").focus();
});
    /*---------Close adding----------*/
$('body').on('click', ".task__add__button_close", function() {
    Task.adding_textarea_touch($(this).parents().eq(5));
});
    /*-------------Add---------------*/
$('body').on('click', ".task__add__button_add", function() {
    Task.add($(this).parents().eq(5));
    $(this).parents().eq(5).scrollTop($(this).parents().eq(5).height());
});
$('body').on('keypress', ".task__add__value", function() {
    if ( event.which == 13 ) {
        Task.add($(this).parents().eq(3));
        $(this).parents().eq(3).scrollTop($(this).parents().eq(3).height());
        event.preventDefault();
    }
});

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
        Task.move_check($(this).parents().eq(2), ".listDone");
    } else {
        Task.check($(this));
        Task.move_check($(this).parents().eq(2), ".listStatuses");
    }
});
    /*--------Open task name--------*/
$('body').on('click', ".task__button_show", function() {
    Task.name_show($(this).parents().eq(3));
    $(this).parent().addClass("hide");
});
    /*-------Close task name--------*/
$('body').on('dblclick', ".openText", function() {
    Task.name_show($(this).parents().eq(1));
});

    /*----Show Adding new hashtag---*/ 
$('body').on('click', ".task__button_hashtag", function() {
    Task.menu_touch($(this).parents().eq(3));
    Task.hashtag_showAdding($(this).parents().eq(3));
    Task.hashtag_checkHeight($(this).parents().eq(3));
});
    /*----Width of hashtag-input----*/
$('body').on('input', ".hashtagValue", function() {
    let value = $(this),
        buffer = $(this).parent().find('.hashtagBuffer')
    buffer.text(value.val());
    value.width(buffer.width() + 35);
});



/*-----------------Tag------------------*/

    /*-------------Add--------------*/
$('body').on('keypress', ".hashtagValue", function() {
    if ( (event.which == 13) || (event.which == 44)) {
        if (!$(this).hasClass("rename")) {
            Tag.add($(this).parents().eq(2));
            event.preventDefault();
        }
    }
});
    /*------Touch menu of tag-------*/
$('body').on('click', ".tag_name", function() {
    Tag.menu_touch($(this).parent());
});
    /*------------Rename------------*/
$('body').on('click', ".tag__button_rename", function() {
    Tag.menu_touch($(this).parents().eq(1));
    Tag.rename_start($(this).parents().eq(1));
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
    //Tag.filter($(this).parents().eq(1));
});

    /*------Open color menu---------*/
$('body').on('click', ".tag__button_color", function() {
    Tag.menu_color_touch($(this).parents().eq(1));
});
    /*--------Choose color----------*/
$('body').on('click', ".tag__choose-color span", function() {
    Tag.color_change($(this).parents().eq(2), $(this).attr("class"));
    Tag.menu_touch($(this).parents().eq(2));
    Tag.menu_color_touch($(this).parents().eq(2));
});
    /*---------Delete confirm-------*/
$('body').on('click', ".tag__button_delete", function() {
    Tag.delete_touchConfirm($(this).parents().eq(2));
});
    /*------Delete confirm yes------*/ 
$('body').on('click', ".tag__delete_yes", function() {
    Tag.delete($(this).parents().eq(2));
    Task.hashtag_checkHeight($(this).parents().eq(4));
});
    /*-------Delete confirm no------*/
$('body').on('click', ".tag__delete_no", function() {
    $(this).parent().addClass("hide");
});


     /*-------Open task name--------*/
$('body').on('click', ".task__menu_open", function() {
    Task.menu_touch($(this).parents().eq(2));
});
    /*--------Delete confirm--------*/
$('body').on('click', ".task__button_delete", function() {
    Task.delete_touchConfirm($(this).parents().eq(3));
});
    /*------Delete confirm yes------*/ 
$('body').on('click', ".task__delete_yes", function() {
    Task.delete($(this).parents().eq(4));
});
    /*-------Delete confirm no------*/
$('body').on('click', ".task__delete_no", function() {
    $(this).parent().addClass("hide");
});

/*----------------CloseAll----------------*/
$('body').on('click', function() {
    console.log(window.event.target);
    if (window.event.target.classList.contains("articles") || window.event.target.classList.contains("container")) {
        $(".taskName").removeClass("hide");
        $(".openText").addClass("hide");
        $(".task__add__adding-block").addClass("hide");
        $(".task__add__button_open").removeClass("hide");
        $(".status__add__adding-block").addClass("hide");
        $(".status__add__button_open").removeClass("hide");
        $(".article__buttons").addClass("hide");
        $(".task__add__menu__buttons").addClass("hide");
        $(".article__choose-color").addClass("hide");
        $(".article__delete_confirm").addClass("hide");
        $(".task__delete_confirm").addClass("hide");
        $(".tag__delete_confirm").addClass("hide");
        $(".task__buttons").addClass("hide");
        $(".hashtagValue").each(function(key, elem) {
            if ($(elem).hasClass("rename")) {
                $(".tag").removeClass("hide");
                $(elem).addClass("hide").val('').removeClass("rename");
            } else {
                $(elem).addClass("hide").val('');
            }
        });
        $(".tag__buttons").addClass("hide");
        $(".tag__choose-color").addClass("hide");
        $(".task").each(function(key, elem) {
            Task.hashtag_checkHeight($(elem));
        });
        
    }
});
/*
$('body').on('click', ".task__hashtags div", function() {
    if ($(this).hasClass("active")) {
        Task.filterHashTags_remove($(this).html());
    } else {
        Task.filterHashTags_add($(this).html());
    }
});*/
/*----------------------------------------*/