(function($) {
    function data_attrs(settings, element) {
        /* Return the subset of data attrs whose name begin with the
        data_attr_prefix */
        var data = $('body').data();
        if (!settings.is_page){
            data = $.extend(data, $(element).data());
        }
        var out = {};
        var prefix = settings.data_attr_prefix;
        
        for (key in data) {
            if(key.indexOf(prefix) == 0) {
                out[normalize_name(key.replace(prefix, ''))] = data[key];
            }
        }
        
        return out;
    }
    
    function normalize_name(name) {
        /* SiteCatalyst variable names are case sensitive, but the jQuery 
        data API does some case munging. This is intended to repair that. */
        name = name.replace(/pagename/i, 'pageName');
        name = name.replace(/purchaseid/i, 'purchaseID');
        name = name.replace(/evar/i, 'eVar');
        return name;
    }
    
    function data(settings, element) {
        /* This method yields the SiteCatalyst tracking for the current
        element generated with the following precedence (lowest to higest):
        defaults, element data-attrs, element data-attrs that've you've
        overridden with javascript. */
        
        // Override the default set of tracking data with the set of data
        // the client was instantiated with.
        var tracking_data = $.extend({
            'channel': 'Website',
            'pageName': window.document.URL + ': ' + window.document.title,
        }, settings.default_data);
        // Override our data with element data attrs
        var tracking_data = $.extend(tracking_data, data_attrs(settings, element));
        
        console.info("Accumulated tracking data for",
                     settings.is_page ? window.document.URL : element);
        for (key in tracking_data) {
            console.info(key,': ',tracking_data[key]);
        }
        return tracking_data;
    }
    
    function track(settings, element) {
        /* Compute the tracking data for this element and send it to 
        omniture.
        
        Note that the mysterious var named 's' used in this method is defined
        by the SiteCatalyst client provided by Omniture (omniture.js). */
        var tracking_data = data(settings, element);
        
        $.each(tracking_data, function(index, value) {
           s[index] = value;
        });
        
        // Send Data.
        s.t();
        
        s.clearVars("pageName,events,channel,products", 1);
        
        console.info("Tracking data sent.");
    }
    
    $.fn.sitecatalyst = function(options) {
        var settings = $.extend({
            'data_attr_prefix': 'omniture_',
            'default_data': {}
        }, options);
        settings.is_page = false;
        
        if(this.length == 0) {
            settings.is_page = true;
            track(settings, this);
        }
        
        return this.each(function(i, element) {
            track(settings, $(element));
        });
    };
    $.fn.sitecatalyst.overrides = {};
})(jQuery);