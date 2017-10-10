var default_image = {
    "image_url" : "//codecloud.cdn.speedyrails.net/sites/59d3dc256e6f6459f8960000/image/png/1507148207000/default.png",
}

function getAssetURL(id){
    var store_id = id;
    var store_assets = "https://northside.mallmaverick.com/api/v4/northside/stores/" + store_id + "/store_files.json"
    var store_front_image_url = "";    
    $.ajax({
        url: store_assets,
        dataType: 'json',
        async: false,
        success: function(data) {
            if(data.store_files.length > 0){
                store_front_image_url = data.store_files[0].url;
            }
        },
        error: function (data){
            store_front_image_url = "";
        }
    });
    
    return store_front_image_url;
}

function get_instagram(url, total, size, callback){
    var html = '<div class="insta_container"><a target="_blank" href="{{{link}}}"><img src="{{{image}}}" alt="{{caption}}"/></a></div>'
    var item_rendered = [];
    Mustache.parse(html); 
    log('fetching instagram data from: ' + url);
    $.getJSON(url).done(function(data) {
        var insta_feed = data.social.instagram
        if(insta_feed != null){
            main_feed = insta_feed.splice(0,9);
            $.each(main_feed, function(i,v){
                var feed_obj = {}
                if(v.caption != null){
                    if(v.caption.text.length > 100){
                        feed_obj.caption_short = v.caption.text.substring(0,99) + "...";
                    }
                    // feed_obj.caption = v.caption.text
                }
                else{
                    feed_obj.caption = ""
                }
                feed_obj.image = v.images[size].url
                feed_obj.link = v.link
                if (i < total){
                    
                    var ig_rendered =  Mustache.render(html,feed_obj);
                    item_rendered.push(ig_rendered.trim());
                }
            })
            callback(item_rendered.join(''))
        }
    });
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function render_instagram_single(data){
    $('.instafeed_single').html(data)
}

function render_instagram(data){
    $('#instafeed').html(data)
}
function init() {
    get_instagram("//thegateway.mallmaverick.com/api/v3/thegateway/social.json", 12, 'standard_resolution', render_instagram);   
}

function show_cat_stores(){
    $('.show_cat_stores').click(function(e){
        var cat_id = $(this).attr('data-id');
        var cat_name = $(this).attr('name');
        var rows = $('.cats_row');
        if(cat_id != "000") {
            rows.hide();
            // $('#cat_name').text($(this).text());
            // $('#cat_name').css('display', 'block');
            $.each(rows, function(i, val){
                var cat_array = val.getAttribute('data-cat').split(',');
                if ($.inArray(cat_id, cat_array) >= 0){
                    $(val).show();
                }
            });
            $(".store_initial").css("display", "none");
        } else {
            rows.show();
            // $.each($('.store_initial'), function(i, val){
            //     if ($(val).text().length > 0){
            //         $(val).show();
            //     } 
            // });
            $('#cat_name').hide();    
        }
        $('.dropdown-menu .cat_list').css('display', 'none');
        $('#store_cat_list').html(cat_name + '<span class="dropdown_arrow"><img src="//codecloud.cdn.speedyrails.net/sites/58bdb9106e6f644783090000/image/png/1489097373000/Expand Arrow.png" alt=""></span>');
        $('html, body').animate({scrollTop : 0},800);
        e.preventDefault();
    });
}

function show_content() {
    var today_hours = getTodaysHours();
    renderHomeHours('#home_hours_container', '#home_hours_template', today_hours);
    renderHomeHours('#home_hours_container_footer', '#home_hours_template_footer', today_hours)
    
    var hours = getPropertyRegularHours();
    var hours_mf = [];
    var hours_sat = [];
    var hours_sun = [];
    $.each(hours, function(key, val){
        if (val.day_of_week == 1 && val.is_holiday == false){
            hours_mf.push(val);
        }
        if (val.day_of_week == 6 && val.is_holiday == false){
            hours_sat.push(val);
        }
        if (val.day_of_week == 0 && val.is_holiday == false){
            hours_sun.push(val);
        }
    });
    renderHours('#hours_mf_container','#hours_mf_template', hours_mf, 'reg_hours');
    renderHours('#hours_sat_container','#hours_sat_template', hours_sat, 'reg_hours');
    renderHours('#hours_sun_container','#hours_sun_template', hours_sun, 'reg_hours');
}