var default_image = {
    "image_url" : "//codecloud.cdn.speedyrails.net/sites/59d3dc256e6f6459f8960000/image/jpeg/1508432729000/10dundas_default.jpg",
}

function get_instagram(url, total, size, callback){
    var html = '<div class="insta_container"><a target="_blank" href="{{{link}}}"><img src="{{{image}}}" alt="{{caption}}"/></a></div>'
    var item_rendered = [];
    Mustache.parse(html); 
    log('fetching instagram data from: ' + url);
    $.getJSON(url).done(function(data) {
        var insta_feed = data.social.instagram
        if(insta_feed != null){
            main_feed = insta_feed.splice(0,5);
            $.each(main_feed, function(i,v){
                var feed_obj = {}
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

function init() {
    $('#menu-icon').click(function(){
		$(this).toggleClass('open');
		$('.nav_container').slideToggle();
		$('body').toggleClass('no_scroll');
	});
	
    store_search();
    
    $("#mobile_search").click(function() {
        $(".site_search").show();
        $(this).hide();
    });
    $("#close_search_mobile").click(function() {
        $(".site_search").hide();
        $("#mobile_search").show();
    });
    
    get_instagram("//10dundaseast.mallmaverick.com/api/v2/10dundaseast/social.json", 5, 'standard_resolution', render_instagram);   
 
    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
    
    $(".alpha_list a").click(function(e) {
        e.preventDefault();
        var id = $(this).attr("href");
        $('html, body').animate({
            scrollTop: $(id).offset().top -25
        }, 1500);
    });
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function jobs_filter(){
    $('.filter_jobs').click(function(e){
        $('#no_jobs_in_filter').text("")
        var filter_id = $(this).attr('data-id');
        $('.active_filter').removeClass('active_filter');
        $(this).addClass('active_filter');
        $('#current_filter').text($(this).text());
        var rows = $('.filter_row');
        if (filter_id == "all"){
            rows.show();
        } else {
            rows.hide();
            $.each(rows, function(i, val){
                var filter_array = val.getAttribute('data-job-type').split('/');
                if ($.inArray(filter_id, filter_array) >= 0){
                    $(val).show();
                }
            });
        }
        if($('.filter_row:hidden').length == rows.length){
            $('#no_jobs_in_filter').text("There are currently no " + filter_id + " jobs available, please check back again later.")
        }
    });
}

function render_instagram(data){
    $('#instafeed').html(data);
}

function show_cat_stores(){
    $('.show_cat_stores').click(function(e){
        var cat_id = $(this).attr('data-id');
        var cat_name = $(this).attr('name');
        var rows = $('.cats_row');
        if(cat_id != "000") {
            rows.hide();
            $.each(rows, function(i, val){
                var cat_array = val.getAttribute('data-cat').split(',');
                if ($.inArray(cat_id, cat_array) >= 0){
                    $(val).show();
                }
            });
            $(".store_initial").css("display", "none");
        } else {
            rows.show();
            $('#cat_name').hide();    
        }
        $('.dropdown-menu .cat_list').css('display', 'none');
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

function show_png_pin(trigger, map){
    $(trigger).bind("change", function(e) {
        e.preventDefault()
        
        var selectedOption = $("#storelist_container").val().split(",");
        console.log(selectedOption)
        var selectedOptionName = $("#storelist_container option:selected").text();
        
        var isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
        // coords = $(selectedOption).attr('data-value').split(",");
        var zoomData = $(map).smoothZoom('getZoomData');
        x_coord = parseInt(selectedOption[0]) + 5;
        y_coord = parseInt(selectedOption[1]);
    
        $(map).smoothZoom('removeLandmark')
        if (isMobile) {
            $(map).smoothZoom('focusTo', {x:x_coord, y:y_coord, zoom:100});    
        } else {
            $(map).smoothZoom('focusTo', {x:x_coord, y:y_coord, zoom:150});
        }
        
        $(map).smoothZoom('addLandmark', 
			[
			'<div class="item mark" data-show-at-zoom="0" data-position="' + x_coord + ',' + y_coord + '">\
				<div>\
					<div class="text">\
					'+ selectedOptionName + '\
				</div>\
				<img src="//codecloud.cdn.speedyrails.net/sites/584ed7876e6f643ecd000000/image/png/1497039299000/map_marker.png" width="40px" height="59px" alt="marker" />\
				</div>\
			</div>'
			]
		);
    });
}

function store_search() {
    $('#close_search').click(function(){
        $(this).hide();
        $('#search_results_stores').html('');
        $('#search_results_events').html('');
        $('#search_results_promotions').html('');
        $('#search_results_stores').hide();
        $('#search_results_events').hide();
        $('#search_results_promotions').hide();
        $('#site_search').val('');
        $('#search_icon').show();
    });
    $('#site_search').keyup(function(){
        if ($('#site_search').val() == ""){
            $('#search_results_stores').html('');
            $('#search_results_events').html('');
            $('#search_results_promotions').html('');
            $('#search_results_stores').hide();
            $('#search_results_events').hide();
            $('#search_results_promotions').hide();
            $('#close_search').hide();
            $('#search_icon').show();
        } else {
            $('#close_search').show();
            $('#search_icon').hide();
            $('#search_results_stores').html('');
            $('#search_results_events').html('');
            $('#search_results_promotions').html('');
            
            var val = $(this).val().toLowerCase();
            
            results = getSearchResults(val);
            var s_stores = results.stores;
            var s_events = results.events;
            var s_promos = results.promotions;
            
            if(s_stores !=undefined && s_stores.length > 0){
                var h2_stores = "<h2 id='open_stores' class='li_open'>(" +s_stores.length + ") Stores<i class='pull-right fa fa-chevron-down'></i></h2>";
                $('#search_results_stores').append(h2_stores);
                $.each(s_stores, function(i, v){
                    var div_stores = "<div class='blog_search_results collapse_open_stores'>";
                    div_stores = div_stores + "<h4><a href='/stores/" + v.slug + "'>" + v.name + "</a></h4>";
                    div_stores = div_stores + "</div>";
                    $('#search_results_stores').append(div_stores);
                    $('#search_results_stores').show();
                });
            }
            if(s_promos != undefined && s_promos.length > 0){
                var h2_promotions = "<h2 id='open_promotions' class='li_open'>(" +s_promos.length + ") Promotions<i class='pull-right fa fa-chevron-down'></i></h2>";
                $('#search_results_promotions').append(h2_promotions);
                $.each(s_promos, function(i, v){
                    var div = "<div class='blog_search_results collapse_open_promotions'>";
                    div = div + "<h4><a href='/promotions/" + v.slug + "'>" + v.name + "</a></h4>";
                    div = div + "</div>";
                    $('#search_results_promotions').append(div);
                    $('#search_results_promotions').show();
                });
            }   
            if(s_events != undefined && s_events.length > 0){
                var h2_events = "<h2 id='open_events' class='li_open'>(" +s_events.length + ") Events<i class='pull-right fa fa-chevron-down'></i></h2>";
                $('#search_results_stores').append(h2_events);
                $.each(s_events, function(i, v){
                    var div = "<div class='blog_search_results collapse_open_events'>";
                    div = div + "<h4><a href='/events/" + v.slug + "'>" + v.name + "</a></h4>";
                    div = div + "</div>";
                    $('#search_results_stores').append(div);
                    $('#search_results_stores').show();
                });
            }
            $('.li_open').click(function(){
                var collapse = ".collapse_" + $(this).attr('id');
                if($(this).hasClass('open')){
                    $(collapse).slideUp('fast');
                    $(this).removeClass('open');
                } else {
                    $(this).addClass('open');
                    $(collapse).slideDown('fast');
                }
            });
        }
    });
}

function submit_contest(slug) {
    var contest_entry = {};
    var contest_data = {};
    contest_data.first_name = $('#first_name').val();
    contest_data.last_name = $('#last_name').val();
    contest_data.email = $('#email').val();
    contest_data.phone = $('#phone_number').val();
    contest_data.mailing_address = $('#mailing_address').val();
    contest_data.city = $('#city').val();
    contest_data.postal_code = $('#postal_code').val();
    contest_data.birthday = $('#birthday').val();
    contest_data.newsletter = $('#newsletter_signup').prop("checked");
    contest_entry.contest = contest_data;
    
    var propertyDetails = getPropertyDetails();
    var host = propertyDetails.mm_host.replace("http:", "");
    var action = host + "/contests/" + slug + "/create_js_entry"
    $.ajax({
        url : action,
        type: "POST",
        data : contest_entry,
        success: function(data){
            $('#succes_msg').show();
            $('.contest_btn').prop('disabled', false);
            $('#contest_form').trigger('reset');
            $('html, body').animate({scrollTop : 0},800);
        },
        error: function (data){
            alert('An error occured while processing your request. Please try again later!')
        }
    });
}