function get_instagram(url, total, size, callback){
    var html = '<div class="insta ih-item circle effect19"><a class="ig-image" target="_blank" href="{{{link}}}"><img src="{{{image}}}" alt="{{caption}}"/><div class="info"><div class="content"><p>{{{caption_short}}}</p></div></div></a></div>'
    var item_rendered = [];
    Mustache.parse(html); 
    log('fetching instagram data from: ' + url);
    $.getJSON(url).done(function(data) {
        var insta_feed = data.social.instagram
        if(insta_feed != null){
            main_feed = insta_feed.splice(1,12);
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

function render_instagram_single(data){
    $('.instafeed_single').html(data)
}

function render_instagram(data){
    $('#instafeed').html(data)
}
function init() {
    get_instagram("//thegateway.mallmaverick.com/api/v3/thegateway/social.json", 12, 'standard_resolution', render_instagram);   
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