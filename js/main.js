(function(window){

	// watchResize method
	// https://gist.github.com/aarongustafson/4157402
	window.watchResize = function( callback ){
        var resizing;
        callback.size = 0;
        function done()
        {
            var curr_size = window.innerWidth;
            clearTimeout( resizing );
            resizing = null;
            // only run on a true resize
            if ( callback.size != curr_size )
            {
                callback();
                callback.size = curr_size;
            }
        }
        window.addEventListener('resize', function(){
            if ( resizing )
            {
                clearTimeout( resizing );
                resizing = null;
            }
            resizing = setTimeout( done, 50 );
        });
        // init
        callback();
    };

	// Get the active Media Query as defined in the CSS
	// Use the following format:
	// #getActiveMQ-watcher { font-family: "default"; }
	// @media only screen and (min-width:20em){ #getActiveMQ-watcher { font-family: "small"; } }
	// etc.
	window.getActiveMQ = function()
	{
			// Build the watcher
		var watcher = document.createElement('div'),
			// alias getComputedStyle
			computed = window.getComputedStyle,
			// Regexp for removing quotes
			re = /['"]/g;
		
		// set upt the watcher and add it to the DOM
		watcher.setAttribute( 'id', 'getActiveMQ-watcher' );
		watcher.style.display = 'none';
		body.appendChild( watcher );
		
		// We’ll redefine this method the first time it’s run
		// For old IE
		if ( 'currentStyle' in watcher )
		{
			window.getActiveMQ = function()
			{
				return watcher.currentStyle['fontFamily'].replace( re, '' );
			};
		}
		// For modern browsers
		else if ( computed )
		{
			window.getActiveMQ = function()
			{
				return computed( watcher, null ).getPropertyValue( 'font-family' ).replace( re, '' );
			};
		}
		// For everything else
		else
		{
			window.getActiveMQ = function()
			{
				return 'unknown';
			};
		}
		return window.getActiveMQ();
	};


	// --- CUSTOM CODE --- //

    var html = document.getElementsByTagName('html')[0],
		body = document.getElementsByTagName('body')[0],
		page_classes = html.classList,
		class_prefix = 'drawer-nav-';

	if ( ! "classList" in body )
	{
		return;
	}

	var toggleDrawerNav_running = false;
	function toggleDrawerNav(e)
	{
		e.preventDefault();

		// check to make sure it’s not already running
		if ( toggleDrawerNav_running )
		{
			return;
		}

		// block any secondary requests until we’re done
		toggleDrawerNav_running = true;

		// Toggle the class
		page_classes.toggle( class_prefix + 'open' );

		// toggle the "running" indicator off once the animation is complete
		// Duration: .5 seconds
		setTimeout(function(){
			toggleDrawerNav_running = false;
		}, 500);

	}

	// Adjust the nav to slide in from the right if the browser window is "small"
	window.watchResize(function(){

		var currentMQ = window.getActiveMQ(),
			menu_trigger = document.getElementById( 'nav-jump' ),
			menu_closer = document.getElementById( 'menu-close' ),
			enabled_class = class_prefix + 'enabled';

		if ( currentMQ == 'small' &&
			 ! page_classes.contains( enabled_class ) )
		{
			page_classes.add( enabled_class );
			// handle toggles
			menu_trigger.addEventListener( 'click', toggleDrawerNav, false );
			menu_trigger.addEventListener( 'touchdown', toggleDrawerNav, false );
			menu_closer.addEventListener( 'click', toggleDrawerNav, false );
			menu_closer.addEventListener( 'touchdown', toggleDrawerNav, false );
		}
		else if ( classes.contains( enabled_class ) )
		{
			page_classes.remove( enabled_class );
			// handle toggles
			menu_trigger.removeEventListener( 'click', toggleDrawerNav, false );
			menu_trigger.removeEventListener( 'touchdown', toggleDrawerNav, false );
			menu_closer.removeEventListener( 'click', toggleDrawerNav, false );
			menu_closer.removeEventListener( 'touchdown', toggleDrawerNav, false );
		}

	});

}(this));