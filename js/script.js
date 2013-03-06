(function ( $, window, document, undefined ) {
	var Twitter = {
		init: function ( options, element ) {
			var that = this;

			that.elem = element;
			$elem = $(that.elem);

			that.url = "http://search.twitter.com/search.json";

			that.targetElem = $('.tweets'); // definitely not the best practice here

			that.keyword = ( typeof options === 'string')
				? options
				: options.search

			if ( that.keyword === "") {
				that.keyword = $.fn.queryTwitter.options.search;
			}

			that.options = $.extend( {}, $.fn.queryTwitter.options, options );

			console.log(that.keyword, that.options);

			that.flowControl(1);
		},

		flowControl: function ( length ) {
			var that = this;

			setTimeout(	function () {
				that.fetch().done( function ( results ) {
					results = that.limit( results.results, that.options.limit );
					that.buildFrag( results );
					that.showResults();
				});

				if ( typeof that.options.whenDone === 'function') {
					that.options.whenDone.apply( that.elem, argmt );
				}

				if ( that.options.refresh) {
					that.flowControl();
				}

			}, length || that.options.refresh );


		},

		fetch: function () {
			var that = this;

			return $.ajax({
				url: that.url,
				data: { q: that.keyword },
				dataType: 'jsonp'
			});
		},

		buildFrag: function ( results ) {
			var that = this;

			that.tweets = $.map( results, function ( obj, i ) {
				// console.log( obj );
				return $( that.options.wrapper ).append( obj.text, " - @", obj.from_user );
				// console.log( obj.text, obj.from_user );
			} );
		},

		showResults: function () {
			var that = this;

			if ( this.options.transition == 'none' || !this.options.transition ) {
				this.targetElem.html( that.tweets );
			}else{
				this.targetElem[ that.options.transition ]( 500, function () {
					$(this).html( that.tweets )[ that.options.transition ]( 500 );
				});
			}
		},

		limit: function ( obj, count ) {
			return obj.slice( 0, count);
		}

	};

	$.fn.queryTwitter = function ( options ) {
		return this.each( function () {
			var tw = Object.create( Twitter );
			tw.init( options, this );

			$.data( this, 'queryTwitter', tw);
		});
	};

	$.fn.queryTwitter.options = {
		search: "@aboutdotcom", // default search, if the users type in nothing
		wrapper: "<div></div>", // wrapping the tweets with these tags
		limit: 10, // limit the number of results being displaed
		refresh: 10000, // refresh integral in ms
		transition: "slideToggle", // transition animation, can be turned off if set to "none"
		onComplete: null // call back function
	};

})( jQuery, window, document );



