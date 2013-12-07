/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* jqPlot @VERSION | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
if(!document.createElement("canvas").getContext){(function(){var ab=Math;var n=ab.round;var l=ab.sin;var A=ab.cos;var H=ab.abs;var N=ab.sqrt;var d=10;var f=d/2;var z=+navigator.userAgent.match(/MSIE ([\d.]+)?/)[1];function y(){return this.context_||(this.context_=new D(this))}var t=Array.prototype.slice;function g(j,m,p){var i=t.call(arguments,2);return function(){return j.apply(m,i.concat(t.call(arguments)))}}function af(i){return String(i).replace(/&/g,"&amp;").replace(/"/g,"&quot;")}function Y(m,j,i){if(!m.namespaces[j]){m.namespaces.add(j,i,"#default#VML")}}function R(j){Y(j,"g_vml_","urn:schemas-microsoft-com:vml");Y(j,"g_o_","urn:schemas-microsoft-com:office:office");if(!j.styleSheets.ex_canvas_){var i=j.createStyleSheet();i.owningElement.id="ex_canvas_";i.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}"}}R(document);var e={init:function(i){var j=i||document;j.createElement("canvas");j.attachEvent("onreadystatechange",g(this.init_,this,j))},init_:function(p){var m=p.getElementsByTagName("canvas");for(var j=0;j<m.length;j++){this.initElement(m[j])}},initElement:function(j){if(!j.getContext){j.getContext=y;R(j.ownerDocument);j.innerHTML="";j.attachEvent("onpropertychange",x);j.attachEvent("onresize",W);var i=j.attributes;if(i.width&&i.width.specified){j.style.width=i.width.nodeValue+"px"}else{j.width=j.clientWidth}if(i.height&&i.height.specified){j.style.height=i.height.nodeValue+"px"}else{j.height=j.clientHeight}}return j},uninitElement:function(j){if(j.getContext){var i=j.getContext();delete i.element_;delete i.canvas;j.innerHTML="";j.context_=null;j.getContext=null;j.detachEvent("onpropertychange",x);j.detachEvent("onresize",W)}}};function x(j){var i=j.srcElement;switch(j.propertyName){case"width":i.getContext().clearRect();i.style.width=i.attributes.width.nodeValue+"px";i.firstChild.style.width=i.clientWidth+"px";break;case"height":i.getContext().clearRect();i.style.height=i.attributes.height.nodeValue+"px";i.firstChild.style.height=i.clientHeight+"px";break}}function W(j){var i=j.srcElement;if(i.firstChild){i.firstChild.style.width=i.clientWidth+"px";i.firstChild.style.height=i.clientHeight+"px"}}e.init();var k=[];for(var ae=0;ae<16;ae++){for(var ad=0;ad<16;ad++){k[ae*16+ad]=ae.toString(16)+ad.toString(16)}}function B(){return[[1,0,0],[0,1,0],[0,0,1]]}function J(p,m){var j=B();for(var i=0;i<3;i++){for(var ah=0;ah<3;ah++){var Z=0;for(var ag=0;ag<3;ag++){Z+=p[i][ag]*m[ag][ah]}j[i][ah]=Z}}return j}function v(j,i){i.fillStyle=j.fillStyle;i.lineCap=j.lineCap;i.lineJoin=j.lineJoin;i.lineWidth=j.lineWidth;i.miterLimit=j.miterLimit;i.shadowBlur=j.shadowBlur;i.shadowColor=j.shadowColor;i.shadowOffsetX=j.shadowOffsetX;i.shadowOffsetY=j.shadowOffsetY;i.strokeStyle=j.strokeStyle;i.globalAlpha=j.globalAlpha;i.font=j.font;i.textAlign=j.textAlign;i.textBaseline=j.textBaseline;i.arcScaleX_=j.arcScaleX_;i.arcScaleY_=j.arcScaleY_;i.lineScale_=j.lineScale_}var b={aliceblue:"#F0F8FF",antiquewhite:"#FAEBD7",aquamarine:"#7FFFD4",azure:"#F0FFFF",beige:"#F5F5DC",bisque:"#FFE4C4",black:"#000000",blanchedalmond:"#FFEBCD",blueviolet:"#8A2BE2",brown:"#A52A2A",burlywood:"#DEB887",cadetblue:"#5F9EA0",chartreuse:"#7FFF00",chocolate:"#D2691E",coral:"#FF7F50",cornflowerblue:"#6495ED",cornsilk:"#FFF8DC",crimson:"#DC143C",cyan:"#00FFFF",darkblue:"#00008B",darkcyan:"#008B8B",darkgoldenrod:"#B8860B",darkgray:"#A9A9A9",darkgreen:"#006400",darkgrey:"#A9A9A9",darkkhaki:"#BDB76B",darkmagenta:"#8B008B",darkolivegreen:"#556B2F",darkorange:"#FF8C00",darkorchid:"#9932CC",darkred:"#8B0000",darksalmon:"#E9967A",darkseagreen:"#8FBC8F",darkslateblue:"#483D8B",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",darkturquoise:"#00CED1",darkviolet:"#9400D3",deeppink:"#FF1493",deepskyblue:"#00BFFF",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1E90FF",firebrick:"#B22222",floralwhite:"#FFFAF0",forestgreen:"#228B22",gainsboro:"#DCDCDC",ghostwhite:"#F8F8FF",gold:"#FFD700",goldenrod:"#DAA520",grey:"#808080",greenyellow:"#ADFF2F",honeydew:"#F0FFF0",hotpink:"#FF69B4",indianred:"#CD5C5C",indigo:"#4B0082",ivory:"#FFFFF0",khaki:"#F0E68C",lavender:"#E6E6FA",lavenderblush:"#FFF0F5",lawngreen:"#7CFC00",lemonchiffon:"#FFFACD",lightblue:"#ADD8E6",lightcoral:"#F08080",lightcyan:"#E0FFFF",lightgoldenrodyellow:"#FAFAD2",lightgreen:"#90EE90",lightgrey:"#D3D3D3",lightpink:"#FFB6C1",lightsalmon:"#FFA07A",lightseagreen:"#20B2AA",lightskyblue:"#87CEFA",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#B0C4DE",lightyellow:"#FFFFE0",limegreen:"#32CD32",linen:"#FAF0E6",magenta:"#FF00FF",mediumaquamarine:"#66CDAA",mediumblue:"#0000CD",mediumorchid:"#BA55D3",mediumpurple:"#9370DB",mediumseagreen:"#3CB371",mediumslateblue:"#7B68EE",mediumspringgreen:"#00FA9A",mediumturquoise:"#48D1CC",mediumvioletred:"#C71585",midnightblue:"#191970",mintcream:"#F5FFFA",mistyrose:"#FFE4E1",moccasin:"#FFE4B5",navajowhite:"#FFDEAD",oldlace:"#FDF5E6",olivedrab:"#6B8E23",orange:"#FFA500",orangered:"#FF4500",orchid:"#DA70D6",palegoldenrod:"#EEE8AA",palegreen:"#98FB98",paleturquoise:"#AFEEEE",palevioletred:"#DB7093",papayawhip:"#FFEFD5",peachpuff:"#FFDAB9",peru:"#CD853F",pink:"#FFC0CB",plum:"#DDA0DD",powderblue:"#B0E0E6",rosybrown:"#BC8F8F",royalblue:"#4169E1",saddlebrown:"#8B4513",salmon:"#FA8072",sandybrown:"#F4A460",seagreen:"#2E8B57",seashell:"#FFF5EE",sienna:"#A0522D",skyblue:"#87CEEB",slateblue:"#6A5ACD",slategray:"#708090",slategrey:"#708090",snow:"#FFFAFA",springgreen:"#00FF7F",steelblue:"#4682B4",tan:"#D2B48C",thistle:"#D8BFD8",tomato:"#FF6347",turquoise:"#40E0D0",violet:"#EE82EE",wheat:"#F5DEB3",whitesmoke:"#F5F5F5",yellowgreen:"#9ACD32"};function M(j){var p=j.indexOf("(",3);var i=j.indexOf(")",p+1);var m=j.substring(p+1,i).split(",");if(m.length!=4||j.charAt(3)!="a"){m[3]=1}return m}function c(i){return parseFloat(i)/100}function r(j,m,i){return Math.min(i,Math.max(m,j))}function I(ag){var i,ai,aj,ah,ak,Z;ah=parseFloat(ag[0])/360%360;if(ah<0){ah++}ak=r(c(ag[1]),0,1);Z=r(c(ag[2]),0,1);if(ak==0){i=ai=aj=Z}else{var j=Z<0.5?Z*(1+ak):Z+ak-Z*ak;var m=2*Z-j;i=a(m,j,ah+1/3);ai=a(m,j,ah);aj=a(m,j,ah-1/3)}return"#"+k[Math.floor(i*255)]+k[Math.floor(ai*255)]+k[Math.floor(aj*255)]}function a(j,i,m){if(m<0){m++}if(m>1){m--}if(6*m<1){return j+(i-j)*6*m}else{if(2*m<1){return i}else{if(3*m<2){return j+(i-j)*(2/3-m)*6}else{return j}}}}var C={};function F(j){if(j in C){return C[j]}var ag,Z=1;j=String(j);if(j.charAt(0)=="#"){ag=j}else{if(/^rgb/.test(j)){var p=M(j);var ag="#",ah;for(var m=0;m<3;m++){if(p[m].indexOf("%")!=-1){ah=Math.floor(c(p[m])*255)}else{ah=+p[m]}ag+=k[r(ah,0,255)]}Z=+p[3]}else{if(/^hsl/.test(j)){var p=M(j);ag=I(p);Z=p[3]}else{ag=b[j]||j}}}return C[j]={color:ag,alpha:Z}}var o={style:"normal",variant:"normal",weight:"normal",size:10,family:"sans-serif"};var L={};function E(i){if(L[i]){return L[i]}var p=document.createElement("div");var m=p.style;try{m.font=i}catch(j){}return L[i]={style:m.fontStyle||o.style,variant:m.fontVariant||o.variant,weight:m.fontWeight||o.weight,size:m.fontSize||o.size,family:m.fontFamily||o.family}}function u(m,j){var i={};for(var ah in m){i[ah]=m[ah]}var ag=parseFloat(j.currentStyle.fontSize),Z=parseFloat(m.size);if(typeof m.size=="number"){i.size=m.size}else{if(m.size.indexOf("px")!=-1){i.size=Z}else{if(m.size.indexOf("em")!=-1){i.size=ag*Z}else{if(m.size.indexOf("%")!=-1){i.size=(ag/100)*Z}else{if(m.size.indexOf("pt")!=-1){i.size=Z/0.75}else{i.size=ag}}}}}i.size*=0.981;i.family="'"+i.family.replace(/(\'|\")/g,"").replace(/\s*,\s*/g,"', '")+"'";return i}function ac(i){return i.style+" "+i.variant+" "+i.weight+" "+i.size+"px "+i.family}var s={butt:"flat",round:"round"};function S(i){return s[i]||"square"}function D(i){this.m_=B();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.strokeStyle="#000";this.fillStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=d*1;this.globalAlpha=1;this.font="10px sans-serif";this.textAlign="left";this.textBaseline="alphabetic";this.canvas=i;var m="width:"+i.clientWidth+"px;height:"+i.clientHeight+"px;overflow:hidden;position:absolute";var j=i.ownerDocument.createElement("div");j.style.cssText=m;i.appendChild(j);var p=j.cloneNode(false);p.style.backgroundColor="red";p.style.filter="alpha(opacity=0)";i.appendChild(p);this.element_=j;this.arcScaleX_=1;this.arcScaleY_=1;this.lineScale_=1}var q=D.prototype;q.clearRect=function(){if(this.textMeasureEl_){this.textMeasureEl_.removeNode(true);this.textMeasureEl_=null}this.element_.innerHTML=""};q.beginPath=function(){this.currentPath_=[]};q.moveTo=function(j,i){var m=V(this,j,i);this.currentPath_.push({type:"moveTo",x:m.x,y:m.y});this.currentX_=m.x;this.currentY_=m.y};q.lineTo=function(j,i){var m=V(this,j,i);this.currentPath_.push({type:"lineTo",x:m.x,y:m.y});this.currentX_=m.x;this.currentY_=m.y};q.bezierCurveTo=function(m,j,ak,aj,ai,ag){var i=V(this,ai,ag);var ah=V(this,m,j);var Z=V(this,ak,aj);K(this,ah,Z,i)};function K(i,Z,m,j){i.currentPath_.push({type:"bezierCurveTo",cp1x:Z.x,cp1y:Z.y,cp2x:m.x,cp2y:m.y,x:j.x,y:j.y});i.currentX_=j.x;i.currentY_=j.y}q.quadraticCurveTo=function(ai,m,j,i){var ah=V(this,ai,m);var ag=V(this,j,i);var aj={x:this.currentX_+2/3*(ah.x-this.currentX_),y:this.currentY_+2/3*(ah.y-this.currentY_)};var Z={x:aj.x+(ag.x-this.currentX_)/3,y:aj.y+(ag.y-this.currentY_)/3};K(this,aj,Z,ag)};q.arc=function(al,aj,ak,ag,j,m){ak*=d;var ap=m?"at":"wa";var am=al+A(ag)*ak-f;var ao=aj+l(ag)*ak-f;var i=al+A(j)*ak-f;var an=aj+l(j)*ak-f;if(am==i&&!m){am+=0.125}var Z=V(this,al,aj);var ai=V(this,am,ao);var ah=V(this,i,an);this.currentPath_.push({type:ap,x:Z.x,y:Z.y,radius:ak,xStart:ai.x,yStart:ai.y,xEnd:ah.x,yEnd:ah.y})};q.rect=function(m,j,i,p){this.moveTo(m,j);this.lineTo(m+i,j);this.lineTo(m+i,j+p);this.lineTo(m,j+p);this.closePath()};q.strokeRect=function(m,j,i,p){var Z=this.currentPath_;this.beginPath();this.moveTo(m,j);this.lineTo(m+i,j);this.lineTo(m+i,j+p);this.lineTo(m,j+p);this.closePath();this.stroke();this.currentPath_=Z};q.fillRect=function(m,j,i,p){var Z=this.currentPath_;this.beginPath();this.moveTo(m,j);this.lineTo(m+i,j);this.lineTo(m+i,j+p);this.lineTo(m,j+p);this.closePath();this.fill();this.currentPath_=Z};q.createLinearGradient=function(j,p,i,m){var Z=new U("gradient");Z.x0_=j;Z.y0_=p;Z.x1_=i;Z.y1_=m;return Z};q.createRadialGradient=function(p,ag,m,j,Z,i){var ah=new U("gradientradial");ah.x0_=p;ah.y0_=ag;ah.r0_=m;ah.x1_=j;ah.y1_=Z;ah.r1_=i;return ah};q.drawImage=function(aq,m){var aj,ah,al,ay,ao,am,at,aA;var ak=aq.runtimeStyle.width;var ap=aq.runtimeStyle.height;aq.runtimeStyle.width="auto";aq.runtimeStyle.height="auto";var ai=aq.width;var aw=aq.height;aq.runtimeStyle.width=ak;aq.runtimeStyle.height=ap;if(arguments.length==3){aj=arguments[1];ah=arguments[2];ao=am=0;at=al=ai;aA=ay=aw}else{if(arguments.length==5){aj=arguments[1];ah=arguments[2];al=arguments[3];ay=arguments[4];ao=am=0;at=ai;aA=aw}else{if(arguments.length==9){ao=arguments[1];am=arguments[2];at=arguments[3];aA=arguments[4];aj=arguments[5];ah=arguments[6];al=arguments[7];ay=arguments[8]}else{throw Error("Invalid number of arguments")}}}var az=V(this,aj,ah);var p=at/2;var j=aA/2;var ax=[];var i=10;var ag=10;ax.push(" <g_vml_:group",' coordsize="',d*i,",",d*ag,'"',' coordorigin="0,0"',' style="width:',i,"px;height:",ag,"px;position:absolute;");if(this.m_[0][0]!=1||this.m_[0][1]||this.m_[1][1]!=1||this.m_[1][0]){var Z=[];Z.push("M11=",this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",n(az.x/d),",","Dy=",n(az.y/d),"");var av=az;var au=V(this,aj+al,ah);var ar=V(this,aj,ah+ay);var an=V(this,aj+al,ah+ay);av.x=ab.max(av.x,au.x,ar.x,an.x);av.y=ab.max(av.y,au.y,ar.y,an.y);ax.push("padding:0 ",n(av.x/d),"px ",n(av.y/d),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",Z.join(""),", sizingmethod='clip');")}else{ax.push("top:",n(az.y/d),"px;left:",n(az.x/d),"px;")}ax.push(' ">','<g_vml_:image src="',aq.src,'"',' style="width:',d*al,"px;"," height:",d*ay,'px"',' cropleft="',ao/ai,'"',' croptop="',am/aw,'"',' cropright="',(ai-ao-at)/ai,'"',' cropbottom="',(aw-am-aA)/aw,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",ax.join(""))};q.stroke=function(al){var aj=[];var Z=false;var m=10;var am=10;aj.push("<g_vml_:shape",' filled="',!!al,'"',' style="position:absolute;width:',m,"px;height:",am,'px;"',' coordorigin="0,0"',' coordsize="',d*m,",",d*am,'"',' stroked="',!al,'"',' path="');var an=false;var ag={x:null,y:null};var ak={x:null,y:null};for(var ah=0;ah<this.currentPath_.length;ah++){var j=this.currentPath_[ah];var ai;switch(j.type){case"moveTo":ai=j;aj.push(" m ",n(j.x),",",n(j.y));break;case"lineTo":aj.push(" l ",n(j.x),",",n(j.y));break;case"close":aj.push(" x ");j=null;break;case"bezierCurveTo":aj.push(" c ",n(j.cp1x),",",n(j.cp1y),",",n(j.cp2x),",",n(j.cp2y),",",n(j.x),",",n(j.y));break;case"at":case"wa":aj.push(" ",j.type," ",n(j.x-this.arcScaleX_*j.radius),",",n(j.y-this.arcScaleY_*j.radius)," ",n(j.x+this.arcScaleX_*j.radius),",",n(j.y+this.arcScaleY_*j.radius)," ",n(j.xStart),",",n(j.yStart)," ",n(j.xEnd),",",n(j.yEnd));break}if(j){if(ag.x==null||j.x<ag.x){ag.x=j.x}if(ak.x==null||j.x>ak.x){ak.x=j.x}if(ag.y==null||j.y<ag.y){ag.y=j.y}if(ak.y==null||j.y>ak.y){ak.y=j.y}}}aj.push(' ">');if(!al){w(this,aj)}else{G(this,aj,ag,ak)}aj.push("</g_vml_:shape>");this.element_.insertAdjacentHTML("beforeEnd",aj.join(""))};function w(m,ag){var j=F(m.strokeStyle);var p=j.color;var Z=j.alpha*m.globalAlpha;var i=m.lineScale_*m.lineWidth;if(i<1){Z*=i}ag.push("<g_vml_:stroke",' opacity="',Z,'"',' joinstyle="',m.lineJoin,'"',' miterlimit="',m.miterLimit,'"',' endcap="',S(m.lineCap),'"',' weight="',i,'px"',' color="',p,'" />')}function G(aq,ai,aK,ar){var aj=aq.fillStyle;var aB=aq.arcScaleX_;var aA=aq.arcScaleY_;var j=ar.x-aK.x;var p=ar.y-aK.y;if(aj instanceof U){var an=0;var aF={x:0,y:0};var ax=0;var am=1;if(aj.type_=="gradient"){var al=aj.x0_/aB;var m=aj.y0_/aA;var ak=aj.x1_/aB;var aM=aj.y1_/aA;var aJ=V(aq,al,m);var aI=V(aq,ak,aM);var ag=aI.x-aJ.x;var Z=aI.y-aJ.y;an=Math.atan2(ag,Z)*180/Math.PI;if(an<0){an+=360}if(an<0.000001){an=0}}else{var aJ=V(aq,aj.x0_,aj.y0_);aF={x:(aJ.x-aK.x)/j,y:(aJ.y-aK.y)/p};j/=aB*d;p/=aA*d;var aD=ab.max(j,p);ax=2*aj.r0_/aD;am=2*aj.r1_/aD-ax}var av=aj.colors_;av.sort(function(aN,i){return aN.offset-i.offset});var ap=av.length;var au=av[0].color;var at=av[ap-1].color;var az=av[0].alpha*aq.globalAlpha;var ay=av[ap-1].alpha*aq.globalAlpha;var aE=[];for(var aH=0;aH<ap;aH++){var ao=av[aH];aE.push(ao.offset*am+ax+" "+ao.color)}ai.push('<g_vml_:fill type="',aj.type_,'"',' method="none" focus="100%"',' color="',au,'"',' color2="',at,'"',' colors="',aE.join(","),'"',' opacity="',ay,'"',' g_o_:opacity2="',az,'"',' angle="',an,'"',' focusposition="',aF.x,",",aF.y,'" />')}else{if(aj instanceof T){if(j&&p){var ah=-aK.x;var aC=-aK.y;ai.push("<g_vml_:fill",' position="',ah/j*aB*aB,",",aC/p*aA*aA,'"',' type="tile"',' src="',aj.src_,'" />')}}else{var aL=F(aq.fillStyle);var aw=aL.color;var aG=aL.alpha*aq.globalAlpha;ai.push('<g_vml_:fill color="',aw,'" opacity="',aG,'" />')}}}q.fill=function(){this.stroke(true)};q.closePath=function(){this.currentPath_.push({type:"close"})};function V(j,Z,p){var i=j.m_;return{x:d*(Z*i[0][0]+p*i[1][0]+i[2][0])-f,y:d*(Z*i[0][1]+p*i[1][1]+i[2][1])-f}}q.save=function(){var i={};v(this,i);this.aStack_.push(i);this.mStack_.push(this.m_);this.m_=J(B(),this.m_)};q.restore=function(){if(this.aStack_.length){v(this.aStack_.pop(),this);this.m_=this.mStack_.pop()}};function h(i){return isFinite(i[0][0])&&isFinite(i[0][1])&&isFinite(i[1][0])&&isFinite(i[1][1])&&isFinite(i[2][0])&&isFinite(i[2][1])}function aa(j,i,p){if(!h(i)){return}j.m_=i;if(p){var Z=i[0][0]*i[1][1]-i[0][1]*i[1][0];j.lineScale_=N(H(Z))}}q.translate=function(m,j){var i=[[1,0,0],[0,1,0],[m,j,1]];aa(this,J(i,this.m_),false)};q.rotate=function(j){var p=A(j);var m=l(j);var i=[[p,m,0],[-m,p,0],[0,0,1]];aa(this,J(i,this.m_),false)};q.scale=function(m,j){this.arcScaleX_*=m;this.arcScaleY_*=j;var i=[[m,0,0],[0,j,0],[0,0,1]];aa(this,J(i,this.m_),true)};q.transform=function(Z,p,ah,ag,j,i){var m=[[Z,p,0],[ah,ag,0],[j,i,1]];aa(this,J(m,this.m_),true)};q.setTransform=function(ag,Z,ai,ah,p,j){var i=[[ag,Z,0],[ai,ah,0],[p,j,1]];aa(this,i,true)};q.drawText_=function(am,ak,aj,ap,ai){var ao=this.m_,at=1000,j=0,ar=at,ah={x:0,y:0},ag=[];var i=u(E(this.font),this.element_);var p=ac(i);var au=this.element_.currentStyle;var Z=this.textAlign.toLowerCase();switch(Z){case"left":case"center":case"right":break;case"end":Z=au.direction=="ltr"?"right":"left";break;case"start":Z=au.direction=="rtl"?"right":"left";break;default:Z="left"}switch(this.textBaseline){case"hanging":case"top":ah.y=i.size/1.75;break;case"middle":break;default:case null:case"alphabetic":case"ideographic":case"bottom":ah.y=-i.size/2.25;break}switch(Z){case"right":j=at;ar=0.05;break;case"center":j=ar=at/2;break}var aq=V(this,ak+ah.x,aj+ah.y);ag.push('<g_vml_:line from="',-j,' 0" to="',ar,' 0.05" ',' coordsize="100 100" coordorigin="0 0"',' filled="',!ai,'" stroked="',!!ai,'" style="position:absolute;width:1px;height:1px;">');if(ai){w(this,ag)}else{G(this,ag,{x:-j,y:0},{x:ar,y:i.size})}var an=ao[0][0].toFixed(3)+","+ao[1][0].toFixed(3)+","+ao[0][1].toFixed(3)+","+ao[1][1].toFixed(3)+",0,0";var al=n(aq.x/d+1-ao[0][0])+","+n(aq.y/d-2*ao[1][0]);ag.push('<g_vml_:skew on="t" matrix="',an,'" ',' offset="',al,'" origin="',j,' 0" />','<g_vml_:path textpathok="true" />','<g_vml_:textpath on="true" string="',af(am),'" style="v-text-align:',Z,";font:",af(p),'" /></g_vml_:line>');this.element_.insertAdjacentHTML("beforeEnd",ag.join(""))};q.fillText=function(m,i,p,j){this.drawText_(m,i,p,j,false)};q.strokeText=function(m,i,p,j){this.drawText_(m,i,p,j,true)};q.measureText=function(m){if(!this.textMeasureEl_){var i='<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>';this.element_.insertAdjacentHTML("beforeEnd",i);this.textMeasureEl_=this.element_.lastChild}var j=this.element_.ownerDocument;this.textMeasureEl_.innerHTML="";this.textMeasureEl_.style.font=this.font;this.textMeasureEl_.appendChild(j.createTextNode(m));return{width:this.textMeasureEl_.offsetWidth}};q.clip=function(){};q.arcTo=function(){};q.createPattern=function(j,i){return new T(j,i)};function U(i){this.type_=i;this.x0_=0;this.y0_=0;this.r0_=0;this.x1_=0;this.y1_=0;this.r1_=0;this.colors_=[]}U.prototype.addColorStop=function(j,i){i=F(i);this.colors_.push({offset:j,color:i.color,alpha:i.alpha})};function T(j,i){Q(j);switch(i){case"repeat":case null:case"":this.repetition_="repeat";break;case"repeat-x":case"repeat-y":case"no-repeat":this.repetition_=i;break;default:O("SYNTAX_ERR")}this.src_=j.src;this.width_=j.width;this.height_=j.height}function O(i){throw new P(i)}function Q(i){if(!i||i.nodeType!=1||i.tagName!="IMG"){O("TYPE_MISMATCH_ERR")}if(i.readyState!="complete"){O("INVALID_STATE_ERR")}}function P(i){this.code=this[i];this.message=i+": DOM Exception "+this.code}var X=P.prototype=new Error;X.INDEX_SIZE_ERR=1;X.DOMSTRING_SIZE_ERR=2;X.HIERARCHY_REQUEST_ERR=3;X.WRONG_DOCUMENT_ERR=4;X.INVALID_CHARACTER_ERR=5;X.NO_DATA_ALLOWED_ERR=6;X.NO_MODIFICATION_ALLOWED_ERR=7;X.NOT_FOUND_ERR=8;X.NOT_SUPPORTED_ERR=9;X.INUSE_ATTRIBUTE_ERR=10;X.INVALID_STATE_ERR=11;X.SYNTAX_ERR=12;X.INVALID_MODIFICATION_ERR=13;X.NAMESPACE_ERR=14;X.INVALID_ACCESS_ERR=15;X.VALIDATION_ERR=16;X.TYPE_MISMATCH_ERR=17;G_vmlCanvasManager=e;CanvasRenderingContext2D=D;CanvasGradient=U;CanvasPattern=T;DOMException=P;G_vmlCanvasManager._version=888})()};
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, browserSupportsTurbolinks, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeHash, removeHashForIE10compatiblity, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  pageCache = {};

  cacheSize = 10;

  currentState = null;

  loadedAssets = null;

  referer = null;

  createDocument = null;

  xhr = null;

  fetchReplacement = function(url) {
    rememberReferer();
    cacheCurrentPage();
    triggerEvent('page:fetch', {
      url: url
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', removeHashForIE10compatiblity(url), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        resetScrollPosition();
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    cacheCurrentPage();
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent('page:change');
    return triggerEvent('page:update');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  removeHashForIE10compatiblity = function(url) {
    return removeHash(url);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref = testDoc.body) != null ? _ref.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent('page:change');
      return triggerEvent('page:update');
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent('page:update');
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[event.state.position]) {
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', installHistoryChangeHandler, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  installDocumentReadyPageEventTriggers();

  installJqueryAjaxSuccessPageUpdateTrigger();

  if (browserSupportsTurbolinks) {
    visit = fetchReplacement;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    supported: browserSupportsTurbolinks
  };

}).call(this);
/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/

if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.1-j6
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    if (this.options.target) this.$target = $(this.options.target)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.strict = this.options.strict
    this.$menu = $(this.options.menu)
    this.shown = false

    if (typeof this.source == 'string') {
        this.url = this.source
        this.source = this.searchAjax
    }
    
    if (element.nodeName == 'SELECT') this.replaceSelect()

    this.text = this.$element.val()
    
    this.$element
      .attr('data-text', this.value)
      .attr('autocomplete', "off")
      
    if (typeof this.$target != 'undefined') this.$element.attr('data-value', this.$target.val())
      else if (typeof this.$element.attr('data-value') == 'undefined') this.$element.attr('data-value', this.strict ? '' : this.value)
    
    this.$menu.css('min-width', this.$element.width() + 12)

    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , replaceSelect: function () {
      this.$target = this.$element
      this.$element = $('<input type="text" />')
      
      this.source = {}
      this.strict = true
      
      var options = this.$target.find('option')
      var $option;
      for (var i=0; i<options.length; i++) {
        $option = $(options[i]);
        if ($option.val() === '') {
          this.$element.attr('placeholder', $option.html());
          continue;
        }
        
        this.source[$option.val()] = $option.html()
        if (this.$target.val() == $option.val()) this.$element.val($option.html())
      }
      
      var attr = this.$target[0].attributes
      for (i=0; i<attr.length; i++) {
        if (attr[i].nodeName != 'type' && attr[i].nodeName != 'name' && attr[i].nodeName != 'id' && attr[i].nodeName != 'data-provide' && !attr[i].nodeName.match(/^on/)) {
          this.$element.attr(attr[i].nodeName, attr[i].nodeValue)
        }
      }

      this.$element.insertAfter(this.$target)
      if (this.$target.attr('autofocus')) this.$element.trigger('focus').select()
      this.$target.attr('autofocus', false)
      this.$target.hide()
    }
  
  , destroyReplacement: function () {
      // Detroy replacement element, so it doesn't mess up the browsers autofill on refresh
      if (typeof this.$target != 'undefined' && this.$target[0].nodeName == 'SELECT') {
        this.$element.replaceWith('');
      }
    }
  
  , select: function () {
      var li = this.$menu.find('.active')
        , val = li.attr('data-value')
        , text = li.find('.item-text').length > 0 ? li.find('.item-text').text() : li.text()

      val = this.updater(val, 'value')
      text = this.updater(text, 'text')

      this.$element
        .val(text)
        .attr('data-value', val)
      
      this.text = text
      
      if (typeof this.$target != 'undefined') {
        this.$target
          .val(val)
          .trigger('change')
      }
      
      this.$element.trigger('change')
      
      return this.hide()
    }

  , updater: function (text, type) {
      return text
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source
      
      return items ? this.process(items) : this
    }

  , process: function (items) {
      return $.isArray(items) ? this.processArray(items) : this.processObject(items)
    }
    
  , processArray: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , processObject: function (itemsIn) {
      var that = this
        , items = {}
        , i = 0

      $.each(itemsIn, function (key, item) {
        if (that.matcher(item)) items[key] = item
      })

      items = this.sorter(items)

      if ($.isEmptyObject(items)) {
        return this.shown ? this.hide() : this
      }
      
      $.each(items, function(key, item) {
        if (i++ >= that.options.items) delete items[key]
      })
      
      return this.render(items).show()
    }

  , searchAjax: function (query, process) {
      var that = this
      
      if (this.ajaxTimeout) clearTimeout(this.ajaxTimeout)

      this.ajaxTimeout = setTimeout(function () {
        if (that.ajaxTimeout) clearTimeout(that.ajaxTimeout)

        if (query === "") {
          that.hide()
          return
        }

        $.get(that.url, {'q': query, 'limit': that.options.items }, function (items) {
          if (typeof items == 'string') items = JSON.parse(items)
          process(items)
        })
      }, this.options.ajaxdelay)
  }
  
  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      return $.isArray(items) ? this.sortArray(items) : this.sortObject(items)  
    }

  , sortArray: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , sortObject: function (items) {
      var sorted = {}
        , key;
        
      for (key in items) {
        if (!items[key].toLowerCase().indexOf(this.query.toLowerCase())) {
          sorted[key] = items[key];
          delete items[key]
        }
      }
      
      for (key in items) {
        if (~items[key].indexOf(this.query)) {
          sorted[key] = items[key];
          delete items[key]
        }
      }

      for (key in items) {
        sorted[key] = items[key]
      }

      return sorted
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this
        , list = $([])
      
      $.map(items, function (item, value) {
        if (list.length >= that.options.items) return
        
        var li
          , a
        
        if ($.isArray(items)) value = item
        
        li = $(that.options.item)
        a = li.find('a').length ? li.find('a') : li
        a.html(that.highlighter(item))
        
        li.attr('data-value', value)
        if (li.find('a').length === 0) li.addClass('dropdown-header')
        
        list.push(li[0])
      })

      list.not('.dropdown-header').first().addClass('active')
      
      this.$menu.html(list)
      
      return this
    }
    
  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.nextAll('li:not(.dropdown-header)').first()

      if (!next.length) {
        next = $(this.$menu.find('li:not(.dropdown-header)')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prevAll('li:not(.dropdown-header)').first()

      if (!prev.length) {
        prev = this.$menu.find('li:not(.dropdown-header)').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('change',   $.proxy(this.change, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
        
      $(window).on('unload', $.proxy(this.destroyReplacement, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break
          
        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , change: function (e) {
      var value
      
      if (this.$element.val() != this.text) {
        value = this.$element.val() === '' || this.strict ? '' : this.$element.val()
            
        this.$element.val(value)
        this.$element.attr('data-value', value)
        this.text = value
        if (typeof this.$target != 'undefined') this.$target.val(value)
      }
    }

  , focus: function (e) {
      this.focused = true
    }
    
  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , ajaxdelay: 400
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document)
    .off('focus.typeahead.data-api')  // overwriting Twitter's typeahead 
    .on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      if ($this.is('select')) $this.attr('autofocus', true)
      e.preventDefault()
      $this.typeahead($this.data())
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-inputmask.js j2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Based on Masked Input plugin by Josh Bush (digitalbush.com)
 * ===========================================================
 * Copyright 2012 Jasny BV, Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;

  var isIphone = (window.orientation !== undefined),
      isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1


 /* INPUTMASK PUBLIC CLASS DEFINITION
  * ================================= */

  var Inputmask = function (element, options) {
    if (isAndroid) return // No support because caret positioning doesn't work on Android
    
    this.$element = $(element)
    this.options = $.extend({}, $.fn.inputmask.defaults, options)
    this.mask = String(options.mask)
    
    this.init()
    this.listen()
        
    this.checkVal() //Perform initial check for existing values
  }

  Inputmask.prototype = {
    
    init: function() {
      var defs = this.options.definitions
      var len = this.mask.length

      this.tests = [] 
      this.partialPosition = this.mask.length
      this.firstNonMaskPos = null

      $.each(this.mask.split(""), $.proxy(function(i, c) {
        if (c == '?') {
          len--
          this.partialPosition = i
        } else if (defs[c]) {
          this.tests.push(new RegExp(defs[c]))
          if(this.firstNonMaskPos === null)
            this.firstNonMaskPos =  this.tests.length - 1
        } else {
          this.tests.push(null)
        }
      }, this))

      this.buffer = $.map(this.mask.split(""), $.proxy(function(c, i) {
        if (c != '?') return defs[c] ? this.options.placeholder : c
      }, this))
      
      this.focusText = this.$element.val()

      this.$element.data("rawMaskFn", $.proxy(function() {
        return $.map(this.buffer, function(c, i) {
          return this.tests[i] && c != this.options.placeholder ? c : null
        }).join('')
      }, this))
    },
    
    listen: function() {
      if (this.$element.attr("readonly")) return

      var pasteEventName = (navigator.userAgent.match(/msie/i) ? 'paste' : 'input') + ".mask"

      this.$element
        .on("unmask", $.proxy(this.unmask, this))
        
        .on("focus.mask", $.proxy(this.focusEvent, this))
        .on("blur.mask", $.proxy(this.blurEvent, this))
        
        .on("keydown.mask", $.proxy(this.keydownEvent, this))
        .on("keypress.mask", $.proxy(this.keypressEvent, this))

        .on(pasteEventName, $.proxy(this.pasteEvent, this))
    },

    //Helper Function for Caret positioning
    caret: function(begin, end) {
      if (this.$element.length === 0) return
      if (typeof begin == 'number') {
        end = (typeof end == 'number') ? end : begin
        return this.$element.each(function() {
          if (this.setSelectionRange) {
            this.setSelectionRange(begin, end)
          } else if (this.createTextRange) {
            var range = this.createTextRange()
            range.collapse(true)
            range.moveEnd('character', end)
            range.moveStart('character', begin)
            range.select()
          }
        })
      } else {
        if (this.$element[0].setSelectionRange) {
          begin = this.$element[0].selectionStart
          end = this.$element[0].selectionEnd
        } else if (document.selection && document.selection.createRange) {
          var range = document.selection.createRange()
          begin = 0 - range.duplicate().moveStart('character', -100000)
          end = begin + range.text.length
        }
        return {
          begin: begin, 
          end: end
        }
      }
    },
    
    seekNext: function(pos) {
      var len = this.mask.length
      while (++pos <= len && !this.tests[pos]);
      
      return pos
    },
    
    seekPrev: function(pos) {
      while (--pos >= 0 && !this.tests[pos]);
      
      return pos
    },

    shiftL: function(begin,end) {
      var len = this.mask.length
      
      if(begin<0) return
      
      for (var i = begin,j = this.seekNext(end); i < len; i++) {
        if (this.tests[i]) {
          if (j < len && this.tests[i].test(this.buffer[j])) {
            this.buffer[i] = this.buffer[j]
            this.buffer[j] = this.options.placeholder
          } else
            break
          j = this.seekNext(j)
        }
      }
      this.writeBuffer()
      this.caret(Math.max(this.firstNonMaskPos, begin))
    },

    shiftR: function(pos) {
      var len = this.mask.length
      
      for (var i = pos, c = this.options.placeholder; i < len; i++) {
        if (this.tests[i]) {
          var j = this.seekNext(i)
          var t = this.buffer[i]
          this.buffer[i] = c
          if (j < len && this.tests[j].test(t))
            c = t
          else
            break
        }
      }
    },

    unmask: function() {
      this.$element
        .unbind(".mask")
        .removeData("inputmask")
    },
    
    focusEvent: function() {
      this.focusText = this.$element.val()
      var len = this.mask.length 
      var pos = this.checkVal()
      this.writeBuffer()

      var that = this
      var moveCaret = function() {
        if (pos == len)
          that.caret(0, pos)
        else
          that.caret(pos)
      }

      if ($.browser.msie)
        moveCaret()
      else
        setTimeout(moveCaret, 0)
    },
    
    blurEvent: function() {
      this.checkVal()
      if (this.$element.val() != this.focusText)
        this.$element.trigger('change')
    },
        
    keydownEvent: function(e) {
      var k=e.which

      //backspace, delete, and escape get special treatment
      if (k == 8 || k == 46 || (isIphone && k == 127)) {
        var pos = this.caret(),
        begin = pos.begin,
        end = pos.end
						
        if (end-begin === 0) {
          begin = k!=46 ? this.seekPrev(begin) : (end=this.seekNext(begin-1))
          end = k==46 ? this.seekNext(end) : end
        }
        this.clearBuffer(begin, end)
        this.shiftL(begin,end-1)

        return false
      } else if (k == 27) {//escape
        this.$element.val(this.focusText)
        this.caret(0, this.checkVal())
        return false
      }
    },

    keypressEvent: function(e) {
      var len = this.mask.length
      
      var k = e.which,
      pos = this.caret()

      if (e.ctrlKey || e.altKey || e.metaKey || k<32)  {//Ignore
        return true
      } else if (k) {
        if (pos.end - pos.begin !== 0) {
          this.clearBuffer(pos.begin, pos.end)
          this.shiftL(pos.begin, pos.end-1)
        }

        var p = this.seekNext(pos.begin - 1)
        if (p < len) {
          var c = String.fromCharCode(k)
          if (this.tests[p].test(c)) {
            this.shiftR(p)
            this.buffer[p] = c
            this.writeBuffer()
            var next = this.seekNext(p)
            this.caret(next)
          }
        }
        return false
      }
    },

    pasteEvent: function() {
      var that = this
      
      setTimeout(function() {
        that.caret(that.checkVal(true))
      }, 0)
    },
    
    clearBuffer: function(start, end) {
      var len = this.mask.length
      
      for (var i = start; i < end && i < len; i++) {
        if (this.tests[i])
          this.buffer[i] = this.options.placeholder
      }
    },

    writeBuffer: function() {
      return this.$element.val(this.buffer.join('')).val()
    },

    checkVal: function(allow) {
      var len = this.mask.length
      //try to place characters where they belong
      var test = this.$element.val()
      var lastMatch = -1
      
      for (var i = 0, pos = 0; i < len; i++) {
        if (this.tests[i]) {
          this.buffer[i] = this.options.placeholder
          while (pos++ < test.length) {
            var c = test.charAt(pos - 1)
            if (this.tests[i].test(c)) {
              this.buffer[i] = c
              lastMatch = i
              break
            }
          }
          if (pos > test.length)
            break
        } else if (this.buffer[i] == test.charAt(pos) && i != this.partialPosition) {
          pos++
          lastMatch = i
        }
      }
      if (!allow && lastMatch + 1 < this.partialPosition) {
        this.$element.val("")
        this.clearBuffer(0, len)
      } else if (allow || lastMatch + 1 >= this.partialPosition) {
        this.writeBuffer()
        if (!allow) this.$element.val(this.$element.val().substring(0, lastMatch + 1))
      }
      return (this.partialPosition ? i : this.firstNonMaskPos)
    }
  }

  
 /* INPUTMASK PLUGIN DEFINITION
  * =========================== */

  $.fn.inputmask = function (options) {
    return this.each(function () {
      var $this = $(this)
      , data = $this.data('inputmask')
      if (!data) $this.data('inputmask', (data = new Inputmask(this, options)))
    })
  }

  $.fn.inputmask.defaults = {
    mask: "",
    placeholder: "_",
    definitions: {
      '9': "[0-9]",
      'a': "[A-Za-z]",
      '?': "[A-Za-z0-9]",
      '*': "."
    }
  }

  $.fn.inputmask.Constructor = Inputmask


 /* INPUTMASK DATA-API
  * ================== */

  $(document).on('focus.inputmask.data-api', '[data-mask]', function (e) {
    var $this = $(this)
    if ($this.data('inputmask')) return
    e.preventDefault()
    $this.inputmask($this.data())
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-rowlink.js j1
 * http://jasny.github.com/bootstrap/javascript.html#rowlink
 * ============================================================
 * Copyright 2012 Jasny BV, Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!function ($) {
  
  "use strict"; // jshint ;_;

  var Rowlink = function (element, options) {
    options = $.extend({}, $.fn.rowlink.defaults, options)
    var tr = element.nodeName.toLowerCase() == 'tr' ? $(element) : $(element).find('tr:has(td)')
    
    tr.each(function() {
      var link = $(this).find(options.target).first()
      if (!link.length) return
      
      var href = link.attr('href')

      $(this).find('td').not('.nolink').click(function() {
        window.location = href;
      })

      $(this).addClass('rowlink')
      link.replaceWith(link.html())
    })
  }

  
 /* ROWLINK PLUGIN DEFINITION
  * =========================== */

  $.fn.rowlink = function (options) {
    return this.each(function () {
      var $this = $(this)
      , data = $this.data('rowlink')
      if (!data) $this.data('rowlink', (data = new Rowlink(this, options)))
    })
  }

  $.fn.rowlink.defaults = {
    target: "a"
  }

  $.fn.rowlink.Constructor = Rowlink


 /* ROWLINK DATA-API
  * ================== */

  $(function () {
    $('[data-provide="rowlink"],[data-provides="rowlink"]').each(function () {
      $(this).rowlink($(this).data())
    })
  })
  
}(window.jQuery);
/* ===========================================================
 * bootstrap-fileupload.js j2
 * http://jasny.github.com/bootstrap/javascript.html#fileupload
 * ===========================================================
 * Copyright 2012 Jasny BV, Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_

 /* FILEUPLOAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Fileupload = function (element, options) {
    this.$element = $(element)
    this.type = this.$element.data('uploadtype') || (this.$element.find('.thumbnail').length > 0 ? "image" : "file")
      
    this.$input = this.$element.find(':file')
    if (this.$input.length === 0) return

    this.name = this.$input.attr('name') || options.name

    this.$hidden = this.$element.find('input[type=hidden][name="'+this.name+'"]')
    if (this.$hidden.length === 0) {
      this.$hidden = $('<input type="hidden" />')
      this.$element.prepend(this.$hidden)
    }

    this.$preview = this.$element.find('.fileupload-preview')
    var height = this.$preview.css('height')
    if (this.$preview.css('display') != 'inline' && height != '0px' && height != 'none') this.$preview.css('line-height', height)

    this.original = {
      'exists': this.$element.hasClass('fileupload-exists'),
      'preview': this.$preview.html(),
      'hiddenVal': this.$hidden.val()
    }
    
    this.$remove = this.$element.find('[data-dismiss="fileupload"]')

    this.$element.find('[data-trigger="fileupload"]').on('click.fileupload', $.proxy(this.trigger, this))

    this.listen()
  }
  
  Fileupload.prototype = {
    
    listen: function() {
      this.$input.on('change.fileupload', $.proxy(this.change, this))
      $(this.$input[0].form).on('reset.fileupload', $.proxy(this.reset, this))
      if (this.$remove) this.$remove.on('click.fileupload', $.proxy(this.clear, this))
    },
    
    change: function(e, invoked) {
      if (invoked === 'clear') return
      
      var file = e.target.files !== undefined ? e.target.files[0] : (e.target.value ? { name: e.target.value.replace(/^.+\\/, '') } : null)
      
      if (!file) {
        this.clear()
        return
      }
      
      this.$hidden.val('')
      this.$hidden.attr('name', '')
      this.$input.attr('name', this.name)

      if (this.type === "image" && this.$preview.length > 0 && (typeof file.type !== "undefined" ? file.type.match('image.*') : file.name.match(/\.(gif|png|jpe?g)$/i)) && typeof FileReader !== "undefined") {
        var reader = new FileReader()
        var preview = this.$preview
        var element = this.$element

        reader.onload = function(e) {
          preview.html('<img src="' + e.target.result + '" ' + (preview.css('max-height') != 'none' ? 'style="max-height: ' + preview.css('max-height') + ';"' : '') + ' />')
          element.addClass('fileupload-exists').removeClass('fileupload-new')
        }

        reader.readAsDataURL(file)
      } else {
        this.$preview.text(file.name)
        this.$element.addClass('fileupload-exists').removeClass('fileupload-new')
      }
    },

    clear: function(e) {
      this.$hidden.val('')
      this.$hidden.attr('name', this.name)
      this.$input.attr('name', '')

      //ie8+ doesn't support changing the value of input with type=file so clone instead
      if (navigator.userAgent.match(/msie/i)){ 
          var inputClone = this.$input.clone(true);
          this.$input.after(inputClone);
          this.$input.remove();
          this.$input = inputClone;
      }else{
          this.$input.val('')
      }

      this.$preview.html('')
      this.$element.addClass('fileupload-new').removeClass('fileupload-exists')

      if (e) {
        this.$input.trigger('change', [ 'clear' ])
        e.preventDefault()
      }
    },
    
    reset: function(e) {
      this.clear()
      
      this.$hidden.val(this.original.hiddenVal)
      this.$preview.html(this.original.preview)
      
      if (this.original.exists) this.$element.addClass('fileupload-exists').removeClass('fileupload-new')
       else this.$element.addClass('fileupload-new').removeClass('fileupload-exists')
    },
    
    trigger: function(e) {
      this.$input.trigger('click')
      e.preventDefault()
    }
  }

  
 /* FILEUPLOAD PLUGIN DEFINITION
  * =========================== */

  $.fn.fileupload = function (options) {
    return this.each(function () {
      var $this = $(this)
      , data = $this.data('fileupload')
      if (!data) $this.data('fileupload', (data = new Fileupload(this, options)))
      if (typeof options == 'string') data[options]()
    })
  }

  $.fn.fileupload.Constructor = Fileupload


 /* FILEUPLOAD DATA-API
  * ================== */

  $(document).on('click.fileupload.data-api', '[data-provides="fileupload"]', function (e) {
    var $this = $(this)
    if ($this.data('fileupload')) return
    $this.fileupload($this.data())
      
    var $target = $(e.target).closest('[data-dismiss="fileupload"],[data-trigger="fileupload"]');
    if ($target.length > 0) {
      $target.trigger('click.fileupload')
      e.preventDefault()
    }
  })

}(window.jQuery);
// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.2 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\
!function(a){var b,c,d="0.4.2",e="hasOwnProperty",f=/[\.\/]/,g="*",h=function(){},i=function(a,b){return a-b},j={n:{}},k=function(a,d){a=String(a);var e,f=c,g=Array.prototype.slice.call(arguments,2),h=k.listeners(a),j=0,l=[],m={},n=[],o=b;b=a,c=0;for(var p=0,q=h.length;q>p;p++)"zIndex"in h[p]&&(l.push(h[p].zIndex),h[p].zIndex<0&&(m[h[p].zIndex]=h[p]));for(l.sort(i);l[j]<0;)if(e=m[l[j++]],n.push(e.apply(d,g)),c)return c=f,n;for(p=0;q>p;p++)if(e=h[p],"zIndex"in e)if(e.zIndex==l[j]){if(n.push(e.apply(d,g)),c)break;do if(j++,e=m[l[j]],e&&n.push(e.apply(d,g)),c)break;while(e)}else m[e.zIndex]=e;else if(n.push(e.apply(d,g)),c)break;return c=f,b=o,n.length?n:null};k._events=j,k.listeners=function(a){var b,c,d,e,h,i,k,l,m=a.split(f),n=j,o=[n],p=[];for(e=0,h=m.length;h>e;e++){for(l=[],i=0,k=o.length;k>i;i++)for(n=o[i].n,c=[n[m[e]],n[g]],d=2;d--;)b=c[d],b&&(l.push(b),p=p.concat(b.f||[]));o=l}return p},k.on=function(a,b){if(a=String(a),"function"!=typeof b)return function(){};for(var c=a.split(f),d=j,e=0,g=c.length;g>e;e++)d=d.n,d=d.hasOwnProperty(c[e])&&d[c[e]]||(d[c[e]]={n:{}});for(d.f=d.f||[],e=0,g=d.f.length;g>e;e++)if(d.f[e]==b)return h;return d.f.push(b),function(a){+a==+a&&(b.zIndex=+a)}},k.f=function(a){var b=[].slice.call(arguments,1);return function(){k.apply(null,[a,null].concat(b).concat([].slice.call(arguments,0)))}},k.stop=function(){c=1},k.nt=function(a){return a?new RegExp("(?:\\.|\\/|^)"+a+"(?:\\.|\\/|$)").test(b):b},k.nts=function(){return b.split(f)},k.off=k.unbind=function(a,b){if(!a)return k._events=j={n:{}},void 0;var c,d,h,i,l,m,n,o=a.split(f),p=[j];for(i=0,l=o.length;l>i;i++)for(m=0;m<p.length;m+=h.length-2){if(h=[m,1],c=p[m].n,o[i]!=g)c[o[i]]&&h.push(c[o[i]]);else for(d in c)c[e](d)&&h.push(c[d]);p.splice.apply(p,h)}for(i=0,l=p.length;l>i;i++)for(c=p[i];c.n;){if(b){if(c.f){for(m=0,n=c.f.length;n>m;m++)if(c.f[m]==b){c.f.splice(m,1);break}!c.f.length&&delete c.f}for(d in c.n)if(c.n[e](d)&&c.n[d].f){var q=c.n[d].f;for(m=0,n=q.length;n>m;m++)if(q[m]==b){q.splice(m,1);break}!q.length&&delete c.n[d].f}}else{delete c.f;for(d in c.n)c.n[e](d)&&c.n[d].f&&delete c.n[d].f}c=c.n}},k.once=function(a,b){var c=function(){return k.unbind(a,c),b.apply(this,arguments)};return k.on(a,c)},k.version=d,k.toString=function(){return"You are running Eve "+d},"undefined"!=typeof module&&module.exports?module.exports=k:"undefined"!=typeof define?define("eve",[],function(){return k}):a.eve=k}(this),function(a,b){"function"==typeof define&&define.amd?define(["eve"],function(c){return b(a,c)}):b(a,a.eve)}(this,function(a,b){function c(a){if(c.is(a,"function"))return u?a():b.on("raphael.DOMload",a);if(c.is(a,V))return c._engine.create[D](c,a.splice(0,3+c.is(a[0],T))).add(a);var d=Array.prototype.slice.call(arguments,0);if(c.is(d[d.length-1],"function")){var e=d.pop();return u?e.call(c._engine.create[D](c,d)):b.on("raphael.DOMload",function(){e.call(c._engine.create[D](c,d))})}return c._engine.create[D](c,arguments)}function d(a){if("function"==typeof a||Object(a)!==a)return a;var b=new a.constructor;for(var c in a)a[z](c)&&(b[c]=d(a[c]));return b}function e(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return a.push(a.splice(c,1)[0])}function f(a,b,c){function d(){var f=Array.prototype.slice.call(arguments,0),g=f.join("␀"),h=d.cache=d.cache||{},i=d.count=d.count||[];return h[z](g)?(e(i,g),c?c(h[g]):h[g]):(i.length>=1e3&&delete h[i.shift()],i.push(g),h[g]=a[D](b,f),c?c(h[g]):h[g])}return d}function g(){return this.hex}function h(a,b){for(var c=[],d=0,e=a.length;e-2*!b>d;d+=2){var f=[{x:+a[d-2],y:+a[d-1]},{x:+a[d],y:+a[d+1]},{x:+a[d+2],y:+a[d+3]},{x:+a[d+4],y:+a[d+5]}];b?d?e-4==d?f[3]={x:+a[0],y:+a[1]}:e-2==d&&(f[2]={x:+a[0],y:+a[1]},f[3]={x:+a[2],y:+a[3]}):f[0]={x:+a[e-2],y:+a[e-1]}:e-4==d?f[3]=f[2]:d||(f[0]={x:+a[d],y:+a[d+1]}),c.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])}return c}function i(a,b,c,d,e){var f=-3*b+9*c-9*d+3*e,g=a*f+6*b-12*c+6*d;return a*g-3*b+3*c}function j(a,b,c,d,e,f,g,h,j){null==j&&(j=1),j=j>1?1:0>j?0:j;for(var k=j/2,l=12,m=[-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],n=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],o=0,p=0;l>p;p++){var q=k*m[p]+k,r=i(q,a,c,e,g),s=i(q,b,d,f,h),t=r*r+s*s;o+=n[p]*N.sqrt(t)}return k*o}function k(a,b,c,d,e,f,g,h,i){if(!(0>i||j(a,b,c,d,e,f,g,h)<i)){var k,l=1,m=l/2,n=l-m,o=.01;for(k=j(a,b,c,d,e,f,g,h,n);Q(k-i)>o;)m/=2,n+=(i>k?1:-1)*m,k=j(a,b,c,d,e,f,g,h,n);return n}}function l(a,b,c,d,e,f,g,h){if(!(O(a,c)<P(e,g)||P(a,c)>O(e,g)||O(b,d)<P(f,h)||P(b,d)>O(f,h))){var i=(a*d-b*c)*(e-g)-(a-c)*(e*h-f*g),j=(a*d-b*c)*(f-h)-(b-d)*(e*h-f*g),k=(a-c)*(f-h)-(b-d)*(e-g);if(k){var l=i/k,m=j/k,n=+l.toFixed(2),o=+m.toFixed(2);if(!(n<+P(a,c).toFixed(2)||n>+O(a,c).toFixed(2)||n<+P(e,g).toFixed(2)||n>+O(e,g).toFixed(2)||o<+P(b,d).toFixed(2)||o>+O(b,d).toFixed(2)||o<+P(f,h).toFixed(2)||o>+O(f,h).toFixed(2)))return{x:l,y:m}}}}function m(a,b,d){var e=c.bezierBBox(a),f=c.bezierBBox(b);if(!c.isBBoxIntersect(e,f))return d?0:[];for(var g=j.apply(0,a),h=j.apply(0,b),i=O(~~(g/5),1),k=O(~~(h/5),1),m=[],n=[],o={},p=d?0:[],q=0;i+1>q;q++){var r=c.findDotsAtSegment.apply(c,a.concat(q/i));m.push({x:r.x,y:r.y,t:q/i})}for(q=0;k+1>q;q++)r=c.findDotsAtSegment.apply(c,b.concat(q/k)),n.push({x:r.x,y:r.y,t:q/k});for(q=0;i>q;q++)for(var s=0;k>s;s++){var t=m[q],u=m[q+1],v=n[s],w=n[s+1],x=Q(u.x-t.x)<.001?"y":"x",y=Q(w.x-v.x)<.001?"y":"x",z=l(t.x,t.y,u.x,u.y,v.x,v.y,w.x,w.y);if(z){if(o[z.x.toFixed(4)]==z.y.toFixed(4))continue;o[z.x.toFixed(4)]=z.y.toFixed(4);var A=t.t+Q((z[x]-t[x])/(u[x]-t[x]))*(u.t-t.t),B=v.t+Q((z[y]-v[y])/(w[y]-v[y]))*(w.t-v.t);A>=0&&1.001>=A&&B>=0&&1.001>=B&&(d?p++:p.push({x:z.x,y:z.y,t1:P(A,1),t2:P(B,1)}))}}return p}function n(a,b,d){a=c._path2curve(a),b=c._path2curve(b);for(var e,f,g,h,i,j,k,l,n,o,p=d?0:[],q=0,r=a.length;r>q;q++){var s=a[q];if("M"==s[0])e=i=s[1],f=j=s[2];else{"C"==s[0]?(n=[e,f].concat(s.slice(1)),e=n[6],f=n[7]):(n=[e,f,e,f,i,j,i,j],e=i,f=j);for(var t=0,u=b.length;u>t;t++){var v=b[t];if("M"==v[0])g=k=v[1],h=l=v[2];else{"C"==v[0]?(o=[g,h].concat(v.slice(1)),g=o[6],h=o[7]):(o=[g,h,g,h,k,l,k,l],g=k,h=l);var w=m(n,o,d);if(d)p+=w;else{for(var x=0,y=w.length;y>x;x++)w[x].segment1=q,w[x].segment2=t,w[x].bez1=n,w[x].bez2=o;p=p.concat(w)}}}}}return p}function o(a,b,c,d,e,f){null!=a?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+e,this.f=+f):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function p(){return this.x+H+this.y+H+this.width+" × "+this.height}function q(a,b,c,d,e,f){function g(a){return((l*a+k)*a+j)*a}function h(a,b){var c=i(a,b);return((o*c+n)*c+m)*c}function i(a,b){var c,d,e,f,h,i;for(e=a,i=0;8>i;i++){if(f=g(e)-a,Q(f)<b)return e;if(h=(3*l*e+2*k)*e+j,Q(h)<1e-6)break;e-=f/h}if(c=0,d=1,e=a,c>e)return c;if(e>d)return d;for(;d>c;){if(f=g(e),Q(f-a)<b)return e;a>f?c=e:d=e,e=(d-c)/2+c}return e}var j=3*b,k=3*(d-b)-j,l=1-j-k,m=3*c,n=3*(e-c)-m,o=1-m-n;return h(a,1/(200*f))}function r(a,b){var c=[],d={};if(this.ms=b,this.times=1,a){for(var e in a)a[z](e)&&(d[_(e)]=a[e],c.push(_(e)));c.sort(lb)}this.anim=d,this.top=c[c.length-1],this.percents=c}function s(a,d,e,f,g,h){e=_(e);var i,j,k,l,m,n,p=a.ms,r={},s={},t={};if(f)for(v=0,x=ic.length;x>v;v++){var u=ic[v];if(u.el.id==d.id&&u.anim==a){u.percent!=e?(ic.splice(v,1),k=1):j=u,d.attr(u.totalOrigin);break}}else f=+s;for(var v=0,x=a.percents.length;x>v;v++){if(a.percents[v]==e||a.percents[v]>f*a.top){e=a.percents[v],m=a.percents[v-1]||0,p=p/a.top*(e-m),l=a.percents[v+1],i=a.anim[e];break}f&&d.attr(a.anim[a.percents[v]])}if(i){if(j)j.initstatus=f,j.start=new Date-j.ms*f;else{for(var y in i)if(i[z](y)&&(db[z](y)||d.paper.customAttributes[z](y)))switch(r[y]=d.attr(y),null==r[y]&&(r[y]=cb[y]),s[y]=i[y],db[y]){case T:t[y]=(s[y]-r[y])/p;break;case"colour":r[y]=c.getRGB(r[y]);var A=c.getRGB(s[y]);t[y]={r:(A.r-r[y].r)/p,g:(A.g-r[y].g)/p,b:(A.b-r[y].b)/p};break;case"path":var B=Kb(r[y],s[y]),C=B[1];for(r[y]=B[0],t[y]=[],v=0,x=r[y].length;x>v;v++){t[y][v]=[0];for(var D=1,F=r[y][v].length;F>D;D++)t[y][v][D]=(C[v][D]-r[y][v][D])/p}break;case"transform":var G=d._,H=Pb(G[y],s[y]);if(H)for(r[y]=H.from,s[y]=H.to,t[y]=[],t[y].real=!0,v=0,x=r[y].length;x>v;v++)for(t[y][v]=[r[y][v][0]],D=1,F=r[y][v].length;F>D;D++)t[y][v][D]=(s[y][v][D]-r[y][v][D])/p;else{var K=d.matrix||new o,L={_:{transform:G.transform},getBBox:function(){return d.getBBox(1)}};r[y]=[K.a,K.b,K.c,K.d,K.e,K.f],Nb(L,s[y]),s[y]=L._.transform,t[y]=[(L.matrix.a-K.a)/p,(L.matrix.b-K.b)/p,(L.matrix.c-K.c)/p,(L.matrix.d-K.d)/p,(L.matrix.e-K.e)/p,(L.matrix.f-K.f)/p]}break;case"csv":var M=I(i[y])[J](w),N=I(r[y])[J](w);if("clip-rect"==y)for(r[y]=N,t[y]=[],v=N.length;v--;)t[y][v]=(M[v]-r[y][v])/p;s[y]=M;break;default:for(M=[][E](i[y]),N=[][E](r[y]),t[y]=[],v=d.paper.customAttributes[y].length;v--;)t[y][v]=((M[v]||0)-(N[v]||0))/p}var O=i.easing,P=c.easing_formulas[O];if(!P)if(P=I(O).match(Z),P&&5==P.length){var Q=P;P=function(a){return q(a,+Q[1],+Q[2],+Q[3],+Q[4],p)}}else P=nb;if(n=i.start||a.start||+new Date,u={anim:a,percent:e,timestamp:n,start:n+(a.del||0),status:0,initstatus:f||0,stop:!1,ms:p,easing:P,from:r,diff:t,to:s,el:d,callback:i.callback,prev:m,next:l,repeat:h||a.times,origin:d.attr(),totalOrigin:g},ic.push(u),f&&!j&&!k&&(u.stop=!0,u.start=new Date-p*f,1==ic.length))return kc();k&&(u.start=new Date-u.ms*f),1==ic.length&&jc(kc)}b("raphael.anim.start."+d.id,d,a)}}function t(a){for(var b=0;b<ic.length;b++)ic[b].el.paper==a&&ic.splice(b--,1)}c.version="2.1.2",c.eve=b;var u,v,w=/[, ]+/,x={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},y=/\{(\d+)\}/g,z="hasOwnProperty",A={doc:document,win:a},B={was:Object.prototype[z].call(A.win,"Raphael"),is:A.win.Raphael},C=function(){this.ca=this.customAttributes={}},D="apply",E="concat",F="ontouchstart"in A.win||A.win.DocumentTouch&&A.doc instanceof DocumentTouch,G="",H=" ",I=String,J="split",K="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[J](H),L={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},M=I.prototype.toLowerCase,N=Math,O=N.max,P=N.min,Q=N.abs,R=N.pow,S=N.PI,T="number",U="string",V="array",W=Object.prototype.toString,X=(c._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i),Y={NaN:1,Infinity:1,"-Infinity":1},Z=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,$=N.round,_=parseFloat,ab=parseInt,bb=I.prototype.toUpperCase,cb=c._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},db=c._availableAnimAttrs={blur:T,"clip-rect":"csv",cx:T,cy:T,fill:"colour","fill-opacity":T,"font-size":T,height:T,opacity:T,path:"path",r:T,rx:T,ry:T,stroke:"colour","stroke-opacity":T,"stroke-width":T,transform:"transform",width:T,x:T,y:T},eb=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,fb={hs:1,rg:1},gb=/,?([achlmqrstvxz]),?/gi,hb=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,ib=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,jb=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi,kb=(c._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,{}),lb=function(a,b){return _(a)-_(b)},mb=function(){},nb=function(a){return a},ob=c._rectPath=function(a,b,c,d,e){return e?[["M",a+e,b],["l",c-2*e,0],["a",e,e,0,0,1,e,e],["l",0,d-2*e],["a",e,e,0,0,1,-e,e],["l",2*e-c,0],["a",e,e,0,0,1,-e,-e],["l",0,2*e-d],["a",e,e,0,0,1,e,-e],["z"]]:[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]]},pb=function(a,b,c,d){return null==d&&(d=c),[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]]},qb=c._getPath={path:function(a){return a.attr("path")},circle:function(a){var b=a.attrs;return pb(b.cx,b.cy,b.r)},ellipse:function(a){var b=a.attrs;return pb(b.cx,b.cy,b.rx,b.ry)},rect:function(a){var b=a.attrs;return ob(b.x,b.y,b.width,b.height,b.r)},image:function(a){var b=a.attrs;return ob(b.x,b.y,b.width,b.height)},text:function(a){var b=a._getBBox();return ob(b.x,b.y,b.width,b.height)},set:function(a){var b=a._getBBox();return ob(b.x,b.y,b.width,b.height)}},rb=c.mapPath=function(a,b){if(!b)return a;var c,d,e,f,g,h,i;for(a=Kb(a),e=0,g=a.length;g>e;e++)for(i=a[e],f=1,h=i.length;h>f;f+=2)c=b.x(i[f],i[f+1]),d=b.y(i[f],i[f+1]),i[f]=c,i[f+1]=d;return a};if(c._g=A,c.type=A.win.SVGAngle||A.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML","VML"==c.type){var sb,tb=A.doc.createElement("div");if(tb.innerHTML='<v:shape adj="1"/>',sb=tb.firstChild,sb.style.behavior="url(#default#VML)",!sb||"object"!=typeof sb.adj)return c.type=G;tb=null}c.svg=!(c.vml="VML"==c.type),c._Paper=C,c.fn=v=C.prototype=c.prototype,c._id=0,c._oid=0,c.is=function(a,b){return b=M.call(b),"finite"==b?!Y[z](+a):"array"==b?a instanceof Array:"null"==b&&null===a||b==typeof a&&null!==a||"object"==b&&a===Object(a)||"array"==b&&Array.isArray&&Array.isArray(a)||W.call(a).slice(8,-1).toLowerCase()==b},c.angle=function(a,b,d,e,f,g){if(null==f){var h=a-d,i=b-e;return h||i?(180+180*N.atan2(-i,-h)/S+360)%360:0}return c.angle(a,b,f,g)-c.angle(d,e,f,g)},c.rad=function(a){return a%360*S/180},c.deg=function(a){return 180*a/S%360},c.snapTo=function(a,b,d){if(d=c.is(d,"finite")?d:10,c.is(a,V)){for(var e=a.length;e--;)if(Q(a[e]-b)<=d)return a[e]}else{a=+a;var f=b%a;if(d>f)return b-f;if(f>a-d)return b-f+a}return b},c.createUUID=function(a,b){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()}}(/[xy]/g,function(a){var b=0|16*N.random(),c="x"==a?b:8|3&b;return c.toString(16)}),c.setWindow=function(a){b("raphael.setWindow",c,A.win,a),A.win=a,A.doc=A.win.document,c._engine.initWin&&c._engine.initWin(A.win)};var ub=function(a){if(c.vml){var b,d=/^\s+|\s+$/g;try{var e=new ActiveXObject("htmlfile");e.write("<body>"),e.close(),b=e.body}catch(g){b=createPopup().document.body}var h=b.createTextRange();ub=f(function(a){try{b.style.color=I(a).replace(d,G);var c=h.queryCommandValue("ForeColor");return c=(255&c)<<16|65280&c|(16711680&c)>>>16,"#"+("000000"+c.toString(16)).slice(-6)}catch(e){return"none"}})}else{var i=A.doc.createElement("i");i.title="Raphaël Colour Picker",i.style.display="none",A.doc.body.appendChild(i),ub=f(function(a){return i.style.color=a,A.doc.defaultView.getComputedStyle(i,G).getPropertyValue("color")})}return ub(a)},vb=function(){return"hsb("+[this.h,this.s,this.b]+")"},wb=function(){return"hsl("+[this.h,this.s,this.l]+")"},xb=function(){return this.hex},yb=function(a,b,d){if(null==b&&c.is(a,"object")&&"r"in a&&"g"in a&&"b"in a&&(d=a.b,b=a.g,a=a.r),null==b&&c.is(a,U)){var e=c.getRGB(a);a=e.r,b=e.g,d=e.b}return(a>1||b>1||d>1)&&(a/=255,b/=255,d/=255),[a,b,d]},zb=function(a,b,d,e){a*=255,b*=255,d*=255;var f={r:a,g:b,b:d,hex:c.rgb(a,b,d),toString:xb};return c.is(e,"finite")&&(f.opacity=e),f};c.color=function(a){var b;return c.is(a,"object")&&"h"in a&&"s"in a&&"b"in a?(b=c.hsb2rgb(a),a.r=b.r,a.g=b.g,a.b=b.b,a.hex=b.hex):c.is(a,"object")&&"h"in a&&"s"in a&&"l"in a?(b=c.hsl2rgb(a),a.r=b.r,a.g=b.g,a.b=b.b,a.hex=b.hex):(c.is(a,"string")&&(a=c.getRGB(a)),c.is(a,"object")&&"r"in a&&"g"in a&&"b"in a?(b=c.rgb2hsl(a),a.h=b.h,a.s=b.s,a.l=b.l,b=c.rgb2hsb(a),a.v=b.b):(a={hex:"none"},a.r=a.g=a.b=a.h=a.s=a.v=a.l=-1)),a.toString=xb,a},c.hsb2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o),a*=360;var e,f,g,h,i;return a=a%360/60,i=c*b,h=i*(1-Q(a%2-1)),e=f=g=c-i,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a],zb(e,f,g,d)},c.hsl2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h),(a>1||b>1||c>1)&&(a/=360,b/=100,c/=100),a*=360;var e,f,g,h,i;return a=a%360/60,i=2*b*(.5>c?c:1-c),h=i*(1-Q(a%2-1)),e=f=g=c-i/2,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a],zb(e,f,g,d)},c.rgb2hsb=function(a,b,c){c=yb(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g;return f=O(a,b,c),g=f-P(a,b,c),d=0==g?null:f==a?(b-c)/g:f==b?(c-a)/g+2:(a-b)/g+4,d=60*((d+360)%6)/360,e=0==g?0:g/f,{h:d,s:e,b:f,toString:vb}},c.rgb2hsl=function(a,b,c){c=yb(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g,h,i;return g=O(a,b,c),h=P(a,b,c),i=g-h,d=0==i?null:g==a?(b-c)/i:g==b?(c-a)/i+2:(a-b)/i+4,d=60*((d+360)%6)/360,f=(g+h)/2,e=0==i?0:.5>f?i/(2*f):i/(2-2*f),{h:d,s:e,l:f,toString:wb}},c._path2string=function(){return this.join(",").replace(gb,"$1")},c._preload=function(a,b){var c=A.doc.createElement("img");c.style.cssText="position:absolute;left:-9999em;top:-9999em",c.onload=function(){b.call(this),this.onload=null,A.doc.body.removeChild(this)},c.onerror=function(){A.doc.body.removeChild(this)},A.doc.body.appendChild(c),c.src=a},c.getRGB=f(function(a){if(!a||(a=I(a)).indexOf("-")+1)return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:g};if("none"==a)return{r:-1,g:-1,b:-1,hex:"none",toString:g};!(fb[z](a.toLowerCase().substring(0,2))||"#"==a.charAt())&&(a=ub(a));var b,d,e,f,h,i,j=a.match(X);return j?(j[2]&&(e=ab(j[2].substring(5),16),d=ab(j[2].substring(3,5),16),b=ab(j[2].substring(1,3),16)),j[3]&&(e=ab((h=j[3].charAt(3))+h,16),d=ab((h=j[3].charAt(2))+h,16),b=ab((h=j[3].charAt(1))+h,16)),j[4]&&(i=j[4][J](eb),b=_(i[0]),"%"==i[0].slice(-1)&&(b*=2.55),d=_(i[1]),"%"==i[1].slice(-1)&&(d*=2.55),e=_(i[2]),"%"==i[2].slice(-1)&&(e*=2.55),"rgba"==j[1].toLowerCase().slice(0,4)&&(f=_(i[3])),i[3]&&"%"==i[3].slice(-1)&&(f/=100)),j[5]?(i=j[5][J](eb),b=_(i[0]),"%"==i[0].slice(-1)&&(b*=2.55),d=_(i[1]),"%"==i[1].slice(-1)&&(d*=2.55),e=_(i[2]),"%"==i[2].slice(-1)&&(e*=2.55),("deg"==i[0].slice(-3)||"°"==i[0].slice(-1))&&(b/=360),"hsba"==j[1].toLowerCase().slice(0,4)&&(f=_(i[3])),i[3]&&"%"==i[3].slice(-1)&&(f/=100),c.hsb2rgb(b,d,e,f)):j[6]?(i=j[6][J](eb),b=_(i[0]),"%"==i[0].slice(-1)&&(b*=2.55),d=_(i[1]),"%"==i[1].slice(-1)&&(d*=2.55),e=_(i[2]),"%"==i[2].slice(-1)&&(e*=2.55),("deg"==i[0].slice(-3)||"°"==i[0].slice(-1))&&(b/=360),"hsla"==j[1].toLowerCase().slice(0,4)&&(f=_(i[3])),i[3]&&"%"==i[3].slice(-1)&&(f/=100),c.hsl2rgb(b,d,e,f)):(j={r:b,g:d,b:e,toString:g},j.hex="#"+(16777216|e|d<<8|b<<16).toString(16).slice(1),c.is(f,"finite")&&(j.opacity=f),j)):{r:-1,g:-1,b:-1,hex:"none",error:1,toString:g}},c),c.hsb=f(function(a,b,d){return c.hsb2rgb(a,b,d).hex}),c.hsl=f(function(a,b,d){return c.hsl2rgb(a,b,d).hex}),c.rgb=f(function(a,b,c){return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)}),c.getColor=function(a){var b=this.getColor.start=this.getColor.start||{h:0,s:1,b:a||.75},c=this.hsb2rgb(b.h,b.s,b.b);return b.h+=.075,b.h>1&&(b.h=0,b.s-=.2,b.s<=0&&(this.getColor.start={h:0,s:1,b:b.b})),c.hex},c.getColor.reset=function(){delete this.start},c.parsePathString=function(a){if(!a)return null;var b=Ab(a);if(b.arr)return Cb(b.arr);var d={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},e=[];return c.is(a,V)&&c.is(a[0],V)&&(e=Cb(a)),e.length||I(a).replace(hb,function(a,b,c){var f=[],g=b.toLowerCase();if(c.replace(jb,function(a,b){b&&f.push(+b)}),"m"==g&&f.length>2&&(e.push([b][E](f.splice(0,2))),g="l",b="m"==b?"l":"L"),"r"==g)e.push([b][E](f));else for(;f.length>=d[g]&&(e.push([b][E](f.splice(0,d[g]))),d[g]););}),e.toString=c._path2string,b.arr=Cb(e),e},c.parseTransformString=f(function(a){if(!a)return null;var b=[];return c.is(a,V)&&c.is(a[0],V)&&(b=Cb(a)),b.length||I(a).replace(ib,function(a,c,d){var e=[];M.call(c),d.replace(jb,function(a,b){b&&e.push(+b)}),b.push([c][E](e))}),b.toString=c._path2string,b});var Ab=function(a){var b=Ab.ps=Ab.ps||{};return b[a]?b[a].sleep=100:b[a]={sleep:100},setTimeout(function(){for(var c in b)b[z](c)&&c!=a&&(b[c].sleep--,!b[c].sleep&&delete b[c])}),b[a]};c.findDotsAtSegment=function(a,b,c,d,e,f,g,h,i){var j=1-i,k=R(j,3),l=R(j,2),m=i*i,n=m*i,o=k*a+3*l*i*c+3*j*i*i*e+n*g,p=k*b+3*l*i*d+3*j*i*i*f+n*h,q=a+2*i*(c-a)+m*(e-2*c+a),r=b+2*i*(d-b)+m*(f-2*d+b),s=c+2*i*(e-c)+m*(g-2*e+c),t=d+2*i*(f-d)+m*(h-2*f+d),u=j*a+i*c,v=j*b+i*d,w=j*e+i*g,x=j*f+i*h,y=90-180*N.atan2(q-s,r-t)/S;return(q>s||t>r)&&(y+=180),{x:o,y:p,m:{x:q,y:r},n:{x:s,y:t},start:{x:u,y:v},end:{x:w,y:x},alpha:y}},c.bezierBBox=function(a,b,d,e,f,g,h,i){c.is(a,"array")||(a=[a,b,d,e,f,g,h,i]);var j=Jb.apply(null,a);return{x:j.min.x,y:j.min.y,x2:j.max.x,y2:j.max.y,width:j.max.x-j.min.x,height:j.max.y-j.min.y}},c.isPointInsideBBox=function(a,b,c){return b>=a.x&&b<=a.x2&&c>=a.y&&c<=a.y2},c.isBBoxIntersect=function(a,b){var d=c.isPointInsideBBox;return d(b,a.x,a.y)||d(b,a.x2,a.y)||d(b,a.x,a.y2)||d(b,a.x2,a.y2)||d(a,b.x,b.y)||d(a,b.x2,b.y)||d(a,b.x,b.y2)||d(a,b.x2,b.y2)||(a.x<b.x2&&a.x>b.x||b.x<a.x2&&b.x>a.x)&&(a.y<b.y2&&a.y>b.y||b.y<a.y2&&b.y>a.y)},c.pathIntersection=function(a,b){return n(a,b)},c.pathIntersectionNumber=function(a,b){return n(a,b,1)},c.isPointInsidePath=function(a,b,d){var e=c.pathBBox(a);return c.isPointInsideBBox(e,b,d)&&1==n(a,[["M",b,d],["H",e.x2+10]],1)%2},c._removedFactory=function(a){return function(){b("raphael.log",null,"Raphaël: you are calling to method “"+a+"” of removed object",a)}};var Bb=c.pathBBox=function(a){var b=Ab(a);if(b.bbox)return d(b.bbox);if(!a)return{x:0,y:0,width:0,height:0,x2:0,y2:0};a=Kb(a);for(var c,e=0,f=0,g=[],h=[],i=0,j=a.length;j>i;i++)if(c=a[i],"M"==c[0])e=c[1],f=c[2],g.push(e),h.push(f);else{var k=Jb(e,f,c[1],c[2],c[3],c[4],c[5],c[6]);g=g[E](k.min.x,k.max.x),h=h[E](k.min.y,k.max.y),e=c[5],f=c[6]}var l=P[D](0,g),m=P[D](0,h),n=O[D](0,g),o=O[D](0,h),p=n-l,q=o-m,r={x:l,y:m,x2:n,y2:o,width:p,height:q,cx:l+p/2,cy:m+q/2};return b.bbox=d(r),r},Cb=function(a){var b=d(a);return b.toString=c._path2string,b},Db=c._pathToRelative=function(a){var b=Ab(a);if(b.rel)return Cb(b.rel);c.is(a,V)&&c.is(a&&a[0],V)||(a=c.parsePathString(a));var d=[],e=0,f=0,g=0,h=0,i=0;"M"==a[0][0]&&(e=a[0][1],f=a[0][2],g=e,h=f,i++,d.push(["M",e,f]));for(var j=i,k=a.length;k>j;j++){var l=d[j]=[],m=a[j];if(m[0]!=M.call(m[0]))switch(l[0]=M.call(m[0]),l[0]){case"a":l[1]=m[1],l[2]=m[2],l[3]=m[3],l[4]=m[4],l[5]=m[5],l[6]=+(m[6]-e).toFixed(3),l[7]=+(m[7]-f).toFixed(3);break;case"v":l[1]=+(m[1]-f).toFixed(3);break;case"m":g=m[1],h=m[2];default:for(var n=1,o=m.length;o>n;n++)l[n]=+(m[n]-(n%2?e:f)).toFixed(3)}else{l=d[j]=[],"m"==m[0]&&(g=m[1]+e,h=m[2]+f);for(var p=0,q=m.length;q>p;p++)d[j][p]=m[p]}var r=d[j].length;switch(d[j][0]){case"z":e=g,f=h;break;case"h":e+=+d[j][r-1];break;case"v":f+=+d[j][r-1];break;default:e+=+d[j][r-2],f+=+d[j][r-1]}}return d.toString=c._path2string,b.rel=Cb(d),d},Eb=c._pathToAbsolute=function(a){var b=Ab(a);if(b.abs)return Cb(b.abs);if(c.is(a,V)&&c.is(a&&a[0],V)||(a=c.parsePathString(a)),!a||!a.length)return[["M",0,0]];var d=[],e=0,f=0,g=0,i=0,j=0;"M"==a[0][0]&&(e=+a[0][1],f=+a[0][2],g=e,i=f,j++,d[0]=["M",e,f]);for(var k,l,m=3==a.length&&"M"==a[0][0]&&"R"==a[1][0].toUpperCase()&&"Z"==a[2][0].toUpperCase(),n=j,o=a.length;o>n;n++){if(d.push(k=[]),l=a[n],l[0]!=bb.call(l[0]))switch(k[0]=bb.call(l[0]),k[0]){case"A":k[1]=l[1],k[2]=l[2],k[3]=l[3],k[4]=l[4],k[5]=l[5],k[6]=+(l[6]+e),k[7]=+(l[7]+f);break;case"V":k[1]=+l[1]+f;break;case"H":k[1]=+l[1]+e;break;case"R":for(var p=[e,f][E](l.slice(1)),q=2,r=p.length;r>q;q++)p[q]=+p[q]+e,p[++q]=+p[q]+f;d.pop(),d=d[E](h(p,m));break;case"M":g=+l[1]+e,i=+l[2]+f;default:for(q=1,r=l.length;r>q;q++)k[q]=+l[q]+(q%2?e:f)}else if("R"==l[0])p=[e,f][E](l.slice(1)),d.pop(),d=d[E](h(p,m)),k=["R"][E](l.slice(-2));else for(var s=0,t=l.length;t>s;s++)k[s]=l[s];switch(k[0]){case"Z":e=g,f=i;break;case"H":e=k[1];break;case"V":f=k[1];break;case"M":g=k[k.length-2],i=k[k.length-1];default:e=k[k.length-2],f=k[k.length-1]}}return d.toString=c._path2string,b.abs=Cb(d),d},Fb=function(a,b,c,d){return[a,b,c,d,c,d]},Gb=function(a,b,c,d,e,f){var g=1/3,h=2/3;return[g*a+h*c,g*b+h*d,g*e+h*c,g*f+h*d,e,f]},Hb=function(a,b,c,d,e,g,h,i,j,k){var l,m=120*S/180,n=S/180*(+e||0),o=[],p=f(function(a,b,c){var d=a*N.cos(c)-b*N.sin(c),e=a*N.sin(c)+b*N.cos(c);return{x:d,y:e}});if(k)y=k[0],z=k[1],w=k[2],x=k[3];else{l=p(a,b,-n),a=l.x,b=l.y,l=p(i,j,-n),i=l.x,j=l.y;var q=(N.cos(S/180*e),N.sin(S/180*e),(a-i)/2),r=(b-j)/2,s=q*q/(c*c)+r*r/(d*d);s>1&&(s=N.sqrt(s),c=s*c,d=s*d);var t=c*c,u=d*d,v=(g==h?-1:1)*N.sqrt(Q((t*u-t*r*r-u*q*q)/(t*r*r+u*q*q))),w=v*c*r/d+(a+i)/2,x=v*-d*q/c+(b+j)/2,y=N.asin(((b-x)/d).toFixed(9)),z=N.asin(((j-x)/d).toFixed(9));y=w>a?S-y:y,z=w>i?S-z:z,0>y&&(y=2*S+y),0>z&&(z=2*S+z),h&&y>z&&(y-=2*S),!h&&z>y&&(z-=2*S)}var A=z-y;if(Q(A)>m){var B=z,C=i,D=j;z=y+m*(h&&z>y?1:-1),i=w+c*N.cos(z),j=x+d*N.sin(z),o=Hb(i,j,c,d,e,0,h,C,D,[z,B,w,x])}A=z-y;var F=N.cos(y),G=N.sin(y),H=N.cos(z),I=N.sin(z),K=N.tan(A/4),L=4/3*c*K,M=4/3*d*K,O=[a,b],P=[a+L*G,b-M*F],R=[i+L*I,j-M*H],T=[i,j];if(P[0]=2*O[0]-P[0],P[1]=2*O[1]-P[1],k)return[P,R,T][E](o);o=[P,R,T][E](o).join()[J](",");for(var U=[],V=0,W=o.length;W>V;V++)U[V]=V%2?p(o[V-1],o[V],n).y:p(o[V],o[V+1],n).x;return U},Ib=function(a,b,c,d,e,f,g,h,i){var j=1-i;return{x:R(j,3)*a+3*R(j,2)*i*c+3*j*i*i*e+R(i,3)*g,y:R(j,3)*b+3*R(j,2)*i*d+3*j*i*i*f+R(i,3)*h}},Jb=f(function(a,b,c,d,e,f,g,h){var i,j=e-2*c+a-(g-2*e+c),k=2*(c-a)-2*(e-c),l=a-c,m=(-k+N.sqrt(k*k-4*j*l))/2/j,n=(-k-N.sqrt(k*k-4*j*l))/2/j,o=[b,h],p=[a,g];return Q(m)>"1e12"&&(m=.5),Q(n)>"1e12"&&(n=.5),m>0&&1>m&&(i=Ib(a,b,c,d,e,f,g,h,m),p.push(i.x),o.push(i.y)),n>0&&1>n&&(i=Ib(a,b,c,d,e,f,g,h,n),p.push(i.x),o.push(i.y)),j=f-2*d+b-(h-2*f+d),k=2*(d-b)-2*(f-d),l=b-d,m=(-k+N.sqrt(k*k-4*j*l))/2/j,n=(-k-N.sqrt(k*k-4*j*l))/2/j,Q(m)>"1e12"&&(m=.5),Q(n)>"1e12"&&(n=.5),m>0&&1>m&&(i=Ib(a,b,c,d,e,f,g,h,m),p.push(i.x),o.push(i.y)),n>0&&1>n&&(i=Ib(a,b,c,d,e,f,g,h,n),p.push(i.x),o.push(i.y)),{min:{x:P[D](0,p),y:P[D](0,o)},max:{x:O[D](0,p),y:O[D](0,o)}}}),Kb=c._path2curve=f(function(a,b){var c=!b&&Ab(a);if(!b&&c.curve)return Cb(c.curve);for(var d=Eb(a),e=b&&Eb(b),f={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},g={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},h=(function(a,b,c){var d,e;if(!a)return["C",b.x,b.y,b.x,b.y,b.x,b.y];switch(!(a[0]in{T:1,Q:1})&&(b.qx=b.qy=null),a[0]){case"M":b.X=a[1],b.Y=a[2];break;case"A":a=["C"][E](Hb[D](0,[b.x,b.y][E](a.slice(1))));break;case"S":"C"==c||"S"==c?(d=2*b.x-b.bx,e=2*b.y-b.by):(d=b.x,e=b.y),a=["C",d,e][E](a.slice(1));break;case"T":"Q"==c||"T"==c?(b.qx=2*b.x-b.qx,b.qy=2*b.y-b.qy):(b.qx=b.x,b.qy=b.y),a=["C"][E](Gb(b.x,b.y,b.qx,b.qy,a[1],a[2]));break;case"Q":b.qx=a[1],b.qy=a[2],a=["C"][E](Gb(b.x,b.y,a[1],a[2],a[3],a[4]));break;case"L":a=["C"][E](Fb(b.x,b.y,a[1],a[2]));break;case"H":a=["C"][E](Fb(b.x,b.y,a[1],b.y));break;case"V":a=["C"][E](Fb(b.x,b.y,b.x,a[1]));break;case"Z":a=["C"][E](Fb(b.x,b.y,b.X,b.Y))}return a}),i=function(a,b){if(a[b].length>7){a[b].shift();for(var c=a[b];c.length;)a.splice(b++,0,["C"][E](c.splice(0,6)));a.splice(b,1),l=O(d.length,e&&e.length||0)}},j=function(a,b,c,f,g){a&&b&&"M"==a[g][0]&&"M"!=b[g][0]&&(b.splice(g,0,["M",f.x,f.y]),c.bx=0,c.by=0,c.x=a[g][1],c.y=a[g][2],l=O(d.length,e&&e.length||0))},k=0,l=O(d.length,e&&e.length||0);l>k;k++){d[k]=h(d[k],f),i(d,k),e&&(e[k]=h(e[k],g)),e&&i(e,k),j(d,e,f,g,k),j(e,d,g,f,k);var m=d[k],n=e&&e[k],o=m.length,p=e&&n.length;f.x=m[o-2],f.y=m[o-1],f.bx=_(m[o-4])||f.x,f.by=_(m[o-3])||f.y,g.bx=e&&(_(n[p-4])||g.x),g.by=e&&(_(n[p-3])||g.y),g.x=e&&n[p-2],g.y=e&&n[p-1]}return e||(c.curve=Cb(d)),e?[d,e]:d},null,Cb),Lb=(c._parseDots=f(function(a){for(var b=[],d=0,e=a.length;e>d;d++){var f={},g=a[d].match(/^([^:]*):?([\d\.]*)/);if(f.color=c.getRGB(g[1]),f.color.error)return null;f.color=f.color.hex,g[2]&&(f.offset=g[2]+"%"),b.push(f)}for(d=1,e=b.length-1;e>d;d++)if(!b[d].offset){for(var h=_(b[d-1].offset||0),i=0,j=d+1;e>j;j++)if(b[j].offset){i=b[j].offset;break}i||(i=100,j=e),i=_(i);for(var k=(i-h)/(j-d+1);j>d;d++)h+=k,b[d].offset=h+"%"}return b}),c._tear=function(a,b){a==b.top&&(b.top=a.prev),a==b.bottom&&(b.bottom=a.next),a.next&&(a.next.prev=a.prev),a.prev&&(a.prev.next=a.next)}),Mb=(c._tofront=function(a,b){b.top!==a&&(Lb(a,b),a.next=null,a.prev=b.top,b.top.next=a,b.top=a)},c._toback=function(a,b){b.bottom!==a&&(Lb(a,b),a.next=b.bottom,a.prev=null,b.bottom.prev=a,b.bottom=a)},c._insertafter=function(a,b,c){Lb(a,c),b==c.top&&(c.top=a),b.next&&(b.next.prev=a),a.next=b.next,a.prev=b,b.next=a},c._insertbefore=function(a,b,c){Lb(a,c),b==c.bottom&&(c.bottom=a),b.prev&&(b.prev.next=a),a.prev=b.prev,b.prev=a,a.next=b},c.toMatrix=function(a,b){var c=Bb(a),d={_:{transform:G},getBBox:function(){return c}};return Nb(d,b),d.matrix}),Nb=(c.transformPath=function(a,b){return rb(a,Mb(a,b))},c._extractTransform=function(a,b){if(null==b)return a._.transform;b=I(b).replace(/\.{3}|\u2026/g,a._.transform||G);var d=c.parseTransformString(b),e=0,f=0,g=0,h=1,i=1,j=a._,k=new o;if(j.transform=d||[],d)for(var l=0,m=d.length;m>l;l++){var n,p,q,r,s,t=d[l],u=t.length,v=I(t[0]).toLowerCase(),w=t[0]!=v,x=w?k.invert():0;"t"==v&&3==u?w?(n=x.x(0,0),p=x.y(0,0),q=x.x(t[1],t[2]),r=x.y(t[1],t[2]),k.translate(q-n,r-p)):k.translate(t[1],t[2]):"r"==v?2==u?(s=s||a.getBBox(1),k.rotate(t[1],s.x+s.width/2,s.y+s.height/2),e+=t[1]):4==u&&(w?(q=x.x(t[2],t[3]),r=x.y(t[2],t[3]),k.rotate(t[1],q,r)):k.rotate(t[1],t[2],t[3]),e+=t[1]):"s"==v?2==u||3==u?(s=s||a.getBBox(1),k.scale(t[1],t[u-1],s.x+s.width/2,s.y+s.height/2),h*=t[1],i*=t[u-1]):5==u&&(w?(q=x.x(t[3],t[4]),r=x.y(t[3],t[4]),k.scale(t[1],t[2],q,r)):k.scale(t[1],t[2],t[3],t[4]),h*=t[1],i*=t[2]):"m"==v&&7==u&&k.add(t[1],t[2],t[3],t[4],t[5],t[6]),j.dirtyT=1,a.matrix=k}a.matrix=k,j.sx=h,j.sy=i,j.deg=e,j.dx=f=k.e,j.dy=g=k.f,1==h&&1==i&&!e&&j.bbox?(j.bbox.x+=+f,j.bbox.y+=+g):j.dirtyT=1}),Ob=function(a){var b=a[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":return 4==a.length?[b,0,a[2],a[3]]:[b,0];case"s":return 5==a.length?[b,1,1,a[3],a[4]]:3==a.length?[b,1,1]:[b,1]}},Pb=c._equaliseTransform=function(a,b){b=I(b).replace(/\.{3}|\u2026/g,a),a=c.parseTransformString(a)||[],b=c.parseTransformString(b)||[];for(var d,e,f,g,h=O(a.length,b.length),i=[],j=[],k=0;h>k;k++){if(f=a[k]||Ob(b[k]),g=b[k]||Ob(f),f[0]!=g[0]||"r"==f[0].toLowerCase()&&(f[2]!=g[2]||f[3]!=g[3])||"s"==f[0].toLowerCase()&&(f[3]!=g[3]||f[4]!=g[4]))return;for(i[k]=[],j[k]=[],d=0,e=O(f.length,g.length);e>d;d++)d in f&&(i[k][d]=f[d]),d in g&&(j[k][d]=g[d])
}return{from:i,to:j}};c._getContainer=function(a,b,d,e){var f;return f=null!=e||c.is(a,"object")?a:A.doc.getElementById(a),null!=f?f.tagName?null==b?{container:f,width:f.style.pixelWidth||f.offsetWidth,height:f.style.pixelHeight||f.offsetHeight}:{container:f,width:b,height:d}:{container:1,x:a,y:b,width:d,height:e}:void 0},c.pathToRelative=Db,c._engine={},c.path2curve=Kb,c.matrix=function(a,b,c,d,e,f){return new o(a,b,c,d,e,f)},function(a){function b(a){return a[0]*a[0]+a[1]*a[1]}function d(a){var c=N.sqrt(b(a));a[0]&&(a[0]/=c),a[1]&&(a[1]/=c)}a.add=function(a,b,c,d,e,f){var g,h,i,j,k=[[],[],[]],l=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],m=[[a,c,e],[b,d,f],[0,0,1]];for(a&&a instanceof o&&(m=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]]),g=0;3>g;g++)for(h=0;3>h;h++){for(j=0,i=0;3>i;i++)j+=l[g][i]*m[i][h];k[g][h]=j}this.a=k[0][0],this.b=k[1][0],this.c=k[0][1],this.d=k[1][1],this.e=k[0][2],this.f=k[1][2]},a.invert=function(){var a=this,b=a.a*a.d-a.b*a.c;return new o(a.d/b,-a.b/b,-a.c/b,a.a/b,(a.c*a.f-a.d*a.e)/b,(a.b*a.e-a.a*a.f)/b)},a.clone=function(){return new o(this.a,this.b,this.c,this.d,this.e,this.f)},a.translate=function(a,b){this.add(1,0,0,1,a,b)},a.scale=function(a,b,c,d){null==b&&(b=a),(c||d)&&this.add(1,0,0,1,c,d),this.add(a,0,0,b,0,0),(c||d)&&this.add(1,0,0,1,-c,-d)},a.rotate=function(a,b,d){a=c.rad(a),b=b||0,d=d||0;var e=+N.cos(a).toFixed(9),f=+N.sin(a).toFixed(9);this.add(e,f,-f,e,b,d),this.add(1,0,0,1,-b,-d)},a.x=function(a,b){return a*this.a+b*this.c+this.e},a.y=function(a,b){return a*this.b+b*this.d+this.f},a.get=function(a){return+this[I.fromCharCode(97+a)].toFixed(4)},a.toString=function(){return c.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},a.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},a.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},a.split=function(){var a={};a.dx=this.e,a.dy=this.f;var e=[[this.a,this.c],[this.b,this.d]];a.scalex=N.sqrt(b(e[0])),d(e[0]),a.shear=e[0][0]*e[1][0]+e[0][1]*e[1][1],e[1]=[e[1][0]-e[0][0]*a.shear,e[1][1]-e[0][1]*a.shear],a.scaley=N.sqrt(b(e[1])),d(e[1]),a.shear/=a.scaley;var f=-e[0][1],g=e[1][1];return 0>g?(a.rotate=c.deg(N.acos(g)),0>f&&(a.rotate=360-a.rotate)):a.rotate=c.deg(N.asin(f)),a.isSimple=!(+a.shear.toFixed(9)||a.scalex.toFixed(9)!=a.scaley.toFixed(9)&&a.rotate),a.isSuperSimple=!+a.shear.toFixed(9)&&a.scalex.toFixed(9)==a.scaley.toFixed(9)&&!a.rotate,a.noRotation=!+a.shear.toFixed(9)&&!a.rotate,a},a.toTransformString=function(a){var b=a||this[J]();return b.isSimple?(b.scalex=+b.scalex.toFixed(4),b.scaley=+b.scaley.toFixed(4),b.rotate=+b.rotate.toFixed(4),(b.dx||b.dy?"t"+[b.dx,b.dy]:G)+(1!=b.scalex||1!=b.scaley?"s"+[b.scalex,b.scaley,0,0]:G)+(b.rotate?"r"+[b.rotate,0,0]:G)):"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(o.prototype);var Qb=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);v.safari="Apple Computer, Inc."==navigator.vendor&&(Qb&&Qb[1]<4||"iP"==navigator.platform.slice(0,2))||"Google Inc."==navigator.vendor&&Qb&&Qb[1]<8?function(){var a=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){a.remove()})}:mb;for(var Rb=function(){this.returnValue=!1},Sb=function(){return this.originalEvent.preventDefault()},Tb=function(){this.cancelBubble=!0},Ub=function(){return this.originalEvent.stopPropagation()},Vb=function(a){var b=A.doc.documentElement.scrollTop||A.doc.body.scrollTop,c=A.doc.documentElement.scrollLeft||A.doc.body.scrollLeft;return{x:a.clientX+c,y:a.clientY+b}},Wb=function(){return A.doc.addEventListener?function(a,b,c,d){var e=function(a){var b=Vb(a);return c.call(d,a,b.x,b.y)};if(a.addEventListener(b,e,!1),F&&L[b]){var f=function(b){for(var e=Vb(b),f=b,g=0,h=b.targetTouches&&b.targetTouches.length;h>g;g++)if(b.targetTouches[g].target==a){b=b.targetTouches[g],b.originalEvent=f,b.preventDefault=Sb,b.stopPropagation=Ub;break}return c.call(d,b,e.x,e.y)};a.addEventListener(L[b],f,!1)}return function(){return a.removeEventListener(b,e,!1),F&&L[b]&&a.removeEventListener(L[b],e,!1),!0}}:A.doc.attachEvent?function(a,b,c,d){var e=function(a){a=a||A.win.event;var b=A.doc.documentElement.scrollTop||A.doc.body.scrollTop,e=A.doc.documentElement.scrollLeft||A.doc.body.scrollLeft,f=a.clientX+e,g=a.clientY+b;return a.preventDefault=a.preventDefault||Rb,a.stopPropagation=a.stopPropagation||Tb,c.call(d,a,f,g)};a.attachEvent("on"+b,e);var f=function(){return a.detachEvent("on"+b,e),!0};return f}:void 0}(),Xb=[],Yb=function(a){for(var c,d=a.clientX,e=a.clientY,f=A.doc.documentElement.scrollTop||A.doc.body.scrollTop,g=A.doc.documentElement.scrollLeft||A.doc.body.scrollLeft,h=Xb.length;h--;){if(c=Xb[h],F&&a.touches){for(var i,j=a.touches.length;j--;)if(i=a.touches[j],i.identifier==c.el._drag.id){d=i.clientX,e=i.clientY,(a.originalEvent?a.originalEvent:a).preventDefault();break}}else a.preventDefault();var k,l=c.el.node,m=l.nextSibling,n=l.parentNode,o=l.style.display;A.win.opera&&n.removeChild(l),l.style.display="none",k=c.el.paper.getElementByPoint(d,e),l.style.display=o,A.win.opera&&(m?n.insertBefore(l,m):n.appendChild(l)),k&&b("raphael.drag.over."+c.el.id,c.el,k),d+=g,e+=f,b("raphael.drag.move."+c.el.id,c.move_scope||c.el,d-c.el._drag.x,e-c.el._drag.y,d,e,a)}},Zb=function(a){c.unmousemove(Yb).unmouseup(Zb);for(var d,e=Xb.length;e--;)d=Xb[e],d.el._drag={},b("raphael.drag.end."+d.el.id,d.end_scope||d.start_scope||d.move_scope||d.el,a);Xb=[]},$b=c.el={},_b=K.length;_b--;)!function(a){c[a]=$b[a]=function(b,d){return c.is(b,"function")&&(this.events=this.events||[],this.events.push({name:a,f:b,unbind:Wb(this.shape||this.node||A.doc,a,b,d||this)})),this},c["un"+a]=$b["un"+a]=function(b){for(var d=this.events||[],e=d.length;e--;)d[e].name!=a||!c.is(b,"undefined")&&d[e].f!=b||(d[e].unbind(),d.splice(e,1),!d.length&&delete this.events);return this}}(K[_b]);$b.data=function(a,d){var e=kb[this.id]=kb[this.id]||{};if(0==arguments.length)return e;if(1==arguments.length){if(c.is(a,"object")){for(var f in a)a[z](f)&&this.data(f,a[f]);return this}return b("raphael.data.get."+this.id,this,e[a],a),e[a]}return e[a]=d,b("raphael.data.set."+this.id,this,d,a),this},$b.removeData=function(a){return null==a?kb[this.id]={}:kb[this.id]&&delete kb[this.id][a],this},$b.getData=function(){return d(kb[this.id]||{})},$b.hover=function(a,b,c,d){return this.mouseover(a,c).mouseout(b,d||c)},$b.unhover=function(a,b){return this.unmouseover(a).unmouseout(b)};var ac=[];$b.drag=function(a,d,e,f,g,h){function i(i){(i.originalEvent||i).preventDefault();var j=i.clientX,k=i.clientY,l=A.doc.documentElement.scrollTop||A.doc.body.scrollTop,m=A.doc.documentElement.scrollLeft||A.doc.body.scrollLeft;if(this._drag.id=i.identifier,F&&i.touches)for(var n,o=i.touches.length;o--;)if(n=i.touches[o],this._drag.id=n.identifier,n.identifier==this._drag.id){j=n.clientX,k=n.clientY;break}this._drag.x=j+m,this._drag.y=k+l,!Xb.length&&c.mousemove(Yb).mouseup(Zb),Xb.push({el:this,move_scope:f,start_scope:g,end_scope:h}),d&&b.on("raphael.drag.start."+this.id,d),a&&b.on("raphael.drag.move."+this.id,a),e&&b.on("raphael.drag.end."+this.id,e),b("raphael.drag.start."+this.id,g||f||this,i.clientX+m,i.clientY+l,i)}return this._drag={},ac.push({el:this,start:i}),this.mousedown(i),this},$b.onDragOver=function(a){a?b.on("raphael.drag.over."+this.id,a):b.unbind("raphael.drag.over."+this.id)},$b.undrag=function(){for(var a=ac.length;a--;)ac[a].el==this&&(this.unmousedown(ac[a].start),ac.splice(a,1),b.unbind("raphael.drag.*."+this.id));!ac.length&&c.unmousemove(Yb).unmouseup(Zb),Xb=[]},v.circle=function(a,b,d){var e=c._engine.circle(this,a||0,b||0,d||0);return this.__set__&&this.__set__.push(e),e},v.rect=function(a,b,d,e,f){var g=c._engine.rect(this,a||0,b||0,d||0,e||0,f||0);return this.__set__&&this.__set__.push(g),g},v.ellipse=function(a,b,d,e){var f=c._engine.ellipse(this,a||0,b||0,d||0,e||0);return this.__set__&&this.__set__.push(f),f},v.path=function(a){a&&!c.is(a,U)&&!c.is(a[0],V)&&(a+=G);var b=c._engine.path(c.format[D](c,arguments),this);return this.__set__&&this.__set__.push(b),b},v.image=function(a,b,d,e,f){var g=c._engine.image(this,a||"about:blank",b||0,d||0,e||0,f||0);return this.__set__&&this.__set__.push(g),g},v.text=function(a,b,d){var e=c._engine.text(this,a||0,b||0,I(d));return this.__set__&&this.__set__.push(e),e},v.set=function(a){!c.is(a,"array")&&(a=Array.prototype.splice.call(arguments,0,arguments.length));var b=new mc(a);return this.__set__&&this.__set__.push(b),b.paper=this,b.type="set",b},v.setStart=function(a){this.__set__=a||this.set()},v.setFinish=function(){var a=this.__set__;return delete this.__set__,a},v.setSize=function(a,b){return c._engine.setSize.call(this,a,b)},v.setViewBox=function(a,b,d,e,f){return c._engine.setViewBox.call(this,a,b,d,e,f)},v.top=v.bottom=null,v.raphael=c;var bc=function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,g=e.clientLeft||d.clientLeft||0,h=b.top+(A.win.pageYOffset||e.scrollTop||d.scrollTop)-f,i=b.left+(A.win.pageXOffset||e.scrollLeft||d.scrollLeft)-g;return{y:h,x:i}};v.getElementByPoint=function(a,b){var c=this,d=c.canvas,e=A.doc.elementFromPoint(a,b);if(A.win.opera&&"svg"==e.tagName){var f=bc(d),g=d.createSVGRect();g.x=a-f.x,g.y=b-f.y,g.width=g.height=1;var h=d.getIntersectionList(g,null);h.length&&(e=h[h.length-1])}if(!e)return null;for(;e.parentNode&&e!=d.parentNode&&!e.raphael;)e=e.parentNode;return e==c.canvas.parentNode&&(e=d),e=e&&e.raphael?c.getById(e.raphaelid):null},v.getElementsByBBox=function(a){var b=this.set();return this.forEach(function(d){c.isBBoxIntersect(d.getBBox(),a)&&b.push(d)}),b},v.getById=function(a){for(var b=this.bottom;b;){if(b.id==a)return b;b=b.next}return null},v.forEach=function(a,b){for(var c=this.bottom;c;){if(a.call(b,c)===!1)return this;c=c.next}return this},v.getElementsByPoint=function(a,b){var c=this.set();return this.forEach(function(d){d.isPointInside(a,b)&&c.push(d)}),c},$b.isPointInside=function(a,b){var d=this.realPath=qb[this.type](this);return this.attr("transform")&&this.attr("transform").length&&(d=c.transformPath(d,this.attr("transform"))),c.isPointInsidePath(d,a,b)},$b.getBBox=function(a){if(this.removed)return{};var b=this._;return a?((b.dirty||!b.bboxwt)&&(this.realPath=qb[this.type](this),b.bboxwt=Bb(this.realPath),b.bboxwt.toString=p,b.dirty=0),b.bboxwt):((b.dirty||b.dirtyT||!b.bbox)&&((b.dirty||!this.realPath)&&(b.bboxwt=0,this.realPath=qb[this.type](this)),b.bbox=Bb(rb(this.realPath,this.matrix)),b.bbox.toString=p,b.dirty=b.dirtyT=0),b.bbox)},$b.clone=function(){if(this.removed)return null;var a=this.paper[this.type]().attr(this.attr());return this.__set__&&this.__set__.push(a),a},$b.glow=function(a){if("text"==this.type)return null;a=a||{};var b={width:(a.width||10)+(+this.attr("stroke-width")||1),fill:a.fill||!1,opacity:a.opacity||.5,offsetx:a.offsetx||0,offsety:a.offsety||0,color:a.color||"#000"},c=b.width/2,d=this.paper,e=d.set(),f=this.realPath||qb[this.type](this);f=this.matrix?rb(f,this.matrix):f;for(var g=1;c+1>g;g++)e.push(d.path(f).attr({stroke:b.color,fill:b.fill?b.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(b.width/c*g).toFixed(3),opacity:+(b.opacity/c).toFixed(3)}));return e.insertBefore(this).translate(b.offsetx,b.offsety)};var cc=function(a,b,d,e,f,g,h,i,l){return null==l?j(a,b,d,e,f,g,h,i):c.findDotsAtSegment(a,b,d,e,f,g,h,i,k(a,b,d,e,f,g,h,i,l))},dc=function(a,b){return function(d,e,f){d=Kb(d);for(var g,h,i,j,k,l="",m={},n=0,o=0,p=d.length;p>o;o++){if(i=d[o],"M"==i[0])g=+i[1],h=+i[2];else{if(j=cc(g,h,i[1],i[2],i[3],i[4],i[5],i[6]),n+j>e){if(b&&!m.start){if(k=cc(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),l+=["C"+k.start.x,k.start.y,k.m.x,k.m.y,k.x,k.y],f)return l;m.start=l,l=["M"+k.x,k.y+"C"+k.n.x,k.n.y,k.end.x,k.end.y,i[5],i[6]].join(),n+=j,g=+i[5],h=+i[6];continue}if(!a&&!b)return k=cc(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),{x:k.x,y:k.y,alpha:k.alpha}}n+=j,g=+i[5],h=+i[6]}l+=i.shift()+i}return m.end=l,k=a?n:b?m:c.findDotsAtSegment(g,h,i[0],i[1],i[2],i[3],i[4],i[5],1),k.alpha&&(k={x:k.x,y:k.y,alpha:k.alpha}),k}},ec=dc(1),fc=dc(),gc=dc(0,1);c.getTotalLength=ec,c.getPointAtLength=fc,c.getSubpath=function(a,b,c){if(this.getTotalLength(a)-c<1e-6)return gc(a,b).end;var d=gc(a,c,1);return b?gc(d,b).end:d},$b.getTotalLength=function(){var a=this.getPath();if(a)return this.node.getTotalLength?this.node.getTotalLength():ec(a)},$b.getPointAtLength=function(a){var b=this.getPath();if(b)return fc(b,a)},$b.getPath=function(){var a,b=c._getPath[this.type];if("text"!=this.type&&"set"!=this.type)return b&&(a=b(this)),a},$b.getSubpath=function(a,b){var d=this.getPath();if(d)return c.getSubpath(d,a,b)};var hc=c.easing_formulas={linear:function(a){return a},"<":function(a){return R(a,1.7)},">":function(a){return R(a,.48)},"<>":function(a){var b=.48-a/1.04,c=N.sqrt(.1734+b*b),d=c-b,e=R(Q(d),1/3)*(0>d?-1:1),f=-c-b,g=R(Q(f),1/3)*(0>f?-1:1),h=e+g+.5;return 3*(1-h)*h*h+h*h*h},backIn:function(a){var b=1.70158;return a*a*((b+1)*a-b)},backOut:function(a){a-=1;var b=1.70158;return a*a*((b+1)*a+b)+1},elastic:function(a){return a==!!a?a:R(2,-10*a)*N.sin((a-.075)*2*S/.3)+1},bounce:function(a){var b,c=7.5625,d=2.75;return 1/d>a?b=c*a*a:2/d>a?(a-=1.5/d,b=c*a*a+.75):2.5/d>a?(a-=2.25/d,b=c*a*a+.9375):(a-=2.625/d,b=c*a*a+.984375),b}};hc.easeIn=hc["ease-in"]=hc["<"],hc.easeOut=hc["ease-out"]=hc[">"],hc.easeInOut=hc["ease-in-out"]=hc["<>"],hc["back-in"]=hc.backIn,hc["back-out"]=hc.backOut;var ic=[],jc=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||function(a){setTimeout(a,16)},kc=function(){for(var a=+new Date,d=0;d<ic.length;d++){var e=ic[d];if(!e.el.removed&&!e.paused){var f,g,h=a-e.start,i=e.ms,j=e.easing,k=e.from,l=e.diff,m=e.to,n=(e.t,e.el),o={},p={};if(e.initstatus?(h=(e.initstatus*e.anim.top-e.prev)/(e.percent-e.prev)*i,e.status=e.initstatus,delete e.initstatus,e.stop&&ic.splice(d--,1)):e.status=(e.prev+(e.percent-e.prev)*(h/i))/e.anim.top,!(0>h))if(i>h){var q=j(h/i);for(var r in k)if(k[z](r)){switch(db[r]){case T:f=+k[r]+q*i*l[r];break;case"colour":f="rgb("+[lc($(k[r].r+q*i*l[r].r)),lc($(k[r].g+q*i*l[r].g)),lc($(k[r].b+q*i*l[r].b))].join(",")+")";break;case"path":f=[];for(var t=0,u=k[r].length;u>t;t++){f[t]=[k[r][t][0]];for(var v=1,w=k[r][t].length;w>v;v++)f[t][v]=+k[r][t][v]+q*i*l[r][t][v];f[t]=f[t].join(H)}f=f.join(H);break;case"transform":if(l[r].real)for(f=[],t=0,u=k[r].length;u>t;t++)for(f[t]=[k[r][t][0]],v=1,w=k[r][t].length;w>v;v++)f[t][v]=k[r][t][v]+q*i*l[r][t][v];else{var x=function(a){return+k[r][a]+q*i*l[r][a]};f=[["m",x(0),x(1),x(2),x(3),x(4),x(5)]]}break;case"csv":if("clip-rect"==r)for(f=[],t=4;t--;)f[t]=+k[r][t]+q*i*l[r][t];break;default:var y=[][E](k[r]);for(f=[],t=n.paper.customAttributes[r].length;t--;)f[t]=+y[t]+q*i*l[r][t]}o[r]=f}n.attr(o),function(a,c,d){setTimeout(function(){b("raphael.anim.frame."+a,c,d)})}(n.id,n,e.anim)}else{if(function(a,d,e){setTimeout(function(){b("raphael.anim.frame."+d.id,d,e),b("raphael.anim.finish."+d.id,d,e),c.is(a,"function")&&a.call(d)})}(e.callback,n,e.anim),n.attr(m),ic.splice(d--,1),e.repeat>1&&!e.next){for(g in m)m[z](g)&&(p[g]=e.totalOrigin[g]);e.el.attr(p),s(e.anim,e.el,e.anim.percents[0],null,e.totalOrigin,e.repeat-1)}e.next&&!e.stop&&s(e.anim,e.el,e.next,null,e.totalOrigin,e.repeat)}}}c.svg&&n&&n.paper&&n.paper.safari(),ic.length&&jc(kc)},lc=function(a){return a>255?255:0>a?0:a};$b.animateWith=function(a,b,d,e,f,g){var h=this;if(h.removed)return g&&g.call(h),h;var i=d instanceof r?d:c.animation(d,e,f,g);s(i,h,i.percents[0],null,h.attr());for(var j=0,k=ic.length;k>j;j++)if(ic[j].anim==b&&ic[j].el==a){ic[k-1].start=ic[j].start;break}return h},$b.onAnimation=function(a){return a?b.on("raphael.anim.frame."+this.id,a):b.unbind("raphael.anim.frame."+this.id),this},r.prototype.delay=function(a){var b=new r(this.anim,this.ms);return b.times=this.times,b.del=+a||0,b},r.prototype.repeat=function(a){var b=new r(this.anim,this.ms);return b.del=this.del,b.times=N.floor(O(a,0))||1,b},c.animation=function(a,b,d,e){if(a instanceof r)return a;(c.is(d,"function")||!d)&&(e=e||d||null,d=null),a=Object(a),b=+b||0;var f,g,h={};for(g in a)a[z](g)&&_(g)!=g&&_(g)+"%"!=g&&(f=!0,h[g]=a[g]);return f?(d&&(h.easing=d),e&&(h.callback=e),new r({100:h},b)):new r(a,b)},$b.animate=function(a,b,d,e){var f=this;if(f.removed)return e&&e.call(f),f;var g=a instanceof r?a:c.animation(a,b,d,e);return s(g,f,g.percents[0],null,f.attr()),f},$b.setTime=function(a,b){return a&&null!=b&&this.status(a,P(b,a.ms)/a.ms),this},$b.status=function(a,b){var c,d,e=[],f=0;if(null!=b)return s(a,this,-1,P(b,1)),this;for(c=ic.length;c>f;f++)if(d=ic[f],d.el.id==this.id&&(!a||d.anim==a)){if(a)return d.status;e.push({anim:d.anim,status:d.status})}return a?0:e},$b.pause=function(a){for(var c=0;c<ic.length;c++)ic[c].el.id!=this.id||a&&ic[c].anim!=a||b("raphael.anim.pause."+this.id,this,ic[c].anim)!==!1&&(ic[c].paused=!0);return this},$b.resume=function(a){for(var c=0;c<ic.length;c++)if(ic[c].el.id==this.id&&(!a||ic[c].anim==a)){var d=ic[c];b("raphael.anim.resume."+this.id,this,d.anim)!==!1&&(delete d.paused,this.status(d.anim,d.status))}return this},$b.stop=function(a){for(var c=0;c<ic.length;c++)ic[c].el.id!=this.id||a&&ic[c].anim!=a||b("raphael.anim.stop."+this.id,this,ic[c].anim)!==!1&&ic.splice(c--,1);return this},b.on("raphael.remove",t),b.on("raphael.clear",t),$b.toString=function(){return"Raphaël’s object"};var mc=function(a){if(this.items=[],this.length=0,this.type="set",a)for(var b=0,c=a.length;c>b;b++)!a[b]||a[b].constructor!=$b.constructor&&a[b].constructor!=mc||(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)},nc=mc.prototype;nc.push=function(){for(var a,b,c=0,d=arguments.length;d>c;c++)a=arguments[c],!a||a.constructor!=$b.constructor&&a.constructor!=mc||(b=this.items.length,this[b]=this.items[b]=a,this.length++);return this},nc.pop=function(){return this.length&&delete this[this.length--],this.items.pop()},nc.forEach=function(a,b){for(var c=0,d=this.items.length;d>c;c++)if(a.call(b,this.items[c],c)===!1)return this;return this};for(var oc in $b)$b[z](oc)&&(nc[oc]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a][D](c,b)})}}(oc));return nc.attr=function(a,b){if(a&&c.is(a,V)&&c.is(a[0],"object"))for(var d=0,e=a.length;e>d;d++)this.items[d].attr(a[d]);else for(var f=0,g=this.items.length;g>f;f++)this.items[f].attr(a,b);return this},nc.clear=function(){for(;this.length;)this.pop()},nc.splice=function(a,b){a=0>a?O(this.length+a,0):a,b=O(0,P(this.length-a,b));var c,d=[],e=[],f=[];for(c=2;c<arguments.length;c++)f.push(arguments[c]);for(c=0;b>c;c++)e.push(this[a+c]);for(;c<this.length-a;c++)d.push(this[a+c]);var g=f.length;for(c=0;c<g+d.length;c++)this.items[a+c]=this[a+c]=g>c?f[c]:d[c-g];for(c=this.items.length=this.length-=b-g;this[c];)delete this[c++];return new mc(e)},nc.exclude=function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]==a)return this.splice(b,1),!0},nc.animate=function(a,b,d,e){(c.is(d,"function")||!d)&&(e=d||null);var f,g,h=this.items.length,i=h,j=this;if(!h)return this;e&&(g=function(){!--h&&e.call(j)}),d=c.is(d,U)?d:g;var k=c.animation(a,b,d,g);for(f=this.items[--i].animate(k);i--;)this.items[i]&&!this.items[i].removed&&this.items[i].animateWith(f,k,k),this.items[i]&&!this.items[i].removed||h--;return this},nc.insertAfter=function(a){for(var b=this.items.length;b--;)this.items[b].insertAfter(a);return this},nc.getBBox=function(){for(var a=[],b=[],c=[],d=[],e=this.items.length;e--;)if(!this.items[e].removed){var f=this.items[e].getBBox();a.push(f.x),b.push(f.y),c.push(f.x+f.width),d.push(f.y+f.height)}return a=P[D](0,a),b=P[D](0,b),c=O[D](0,c),d=O[D](0,d),{x:a,y:b,x2:c,y2:d,width:c-a,height:d-b}},nc.clone=function(a){a=this.paper.set();for(var b=0,c=this.items.length;c>b;b++)a.push(this.items[b].clone());return a},nc.toString=function(){return"Raphaël‘s set"},nc.glow=function(a){var b=this.paper.set();return this.forEach(function(c){var d=c.glow(a);null!=d&&d.forEach(function(a){b.push(a)})}),b},nc.isPointInside=function(a,b){var c=!1;return this.forEach(function(d){return d.isPointInside(a,b)?(console.log("runned"),c=!0,!1):void 0}),c},c.registerFont=function(a){if(!a.face)return a;this.fonts=this.fonts||{};var b={w:a.w,face:{},glyphs:{}},c=a.face["font-family"];for(var d in a.face)a.face[z](d)&&(b.face[d]=a.face[d]);if(this.fonts[c]?this.fonts[c].push(b):this.fonts[c]=[b],!a.svg){b.face["units-per-em"]=ab(a.face["units-per-em"],10);for(var e in a.glyphs)if(a.glyphs[z](e)){var f=a.glyphs[e];if(b.glyphs[e]={w:f.w,k:{},d:f.d&&"M"+f.d.replace(/[mlcxtrv]/g,function(a){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[a]||"M"})+"z"},f.k)for(var g in f.k)f[z](g)&&(b.glyphs[e].k[g]=f.k[g])}}return a},v.getFont=function(a,b,d,e){if(e=e||"normal",d=d||"normal",b=+b||{normal:400,bold:700,lighter:300,bolder:800}[b]||400,c.fonts){var f=c.fonts[a];if(!f){var g=new RegExp("(^|\\s)"+a.replace(/[^\w\d\s+!~.:_-]/g,G)+"(\\s|$)","i");for(var h in c.fonts)if(c.fonts[z](h)&&g.test(h)){f=c.fonts[h];break}}var i;if(f)for(var j=0,k=f.length;k>j&&(i=f[j],i.face["font-weight"]!=b||i.face["font-style"]!=d&&i.face["font-style"]||i.face["font-stretch"]!=e);j++);return i}},v.print=function(a,b,d,e,f,g,h,i){g=g||"middle",h=O(P(h||0,1),-1),i=O(P(i||1,3),1);var j,k=I(d)[J](G),l=0,m=0,n=G;if(c.is(e,"string")&&(e=this.getFont(e)),e){j=(f||16)/e.face["units-per-em"];for(var o=e.face.bbox[J](w),p=+o[0],q=o[3]-o[1],r=0,s=+o[1]+("baseline"==g?q+ +e.face.descent:q/2),t=0,u=k.length;u>t;t++){if("\n"==k[t])l=0,x=0,m=0,r+=q*i;else{var v=m&&e.glyphs[k[t-1]]||{},x=e.glyphs[k[t]];l+=m?(v.w||e.w)+(v.k&&v.k[k[t]]||0)+e.w*h:0,m=1}x&&x.d&&(n+=c.transformPath(x.d,["t",l*j,r*j,"s",j,j,p,s,"t",(a-p)/j,(b-s)/j]))}}return this.path(n).attr({fill:"#000",stroke:"none"})},v.add=function(a){if(c.is(a,"array"))for(var b,d=this.set(),e=0,f=a.length;f>e;e++)b=a[e]||{},x[z](b.type)&&d.push(this[b.type]().attr(b));return d},c.format=function(a,b){var d=c.is(b,V)?[0][E](b):arguments;return a&&c.is(a,U)&&d.length-1&&(a=a.replace(y,function(a,b){return null==d[++b]?G:d[b]})),a||G},c.fullfill=function(){var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(a,c,d){var e=d;return c.replace(b,function(a,b,c,d,f){b=b||d,e&&(b in e&&(e=e[b]),"function"==typeof e&&f&&(e=e()))}),e=(null==e||e==d?a:e)+""};return function(b,d){return String(b).replace(a,function(a,b){return c(a,b,d)})}}(),c.ninja=function(){return B.was?A.win.Raphael=B.is:delete Raphael,c},c.st=nc,function(a,b,d){function e(){/in/.test(a.readyState)?setTimeout(e,9):c.eve("raphael.DOMload")}null==a.readyState&&a.addEventListener&&(a.addEventListener(b,d=function(){a.removeEventListener(b,d,!1),a.readyState="complete"},!1),a.readyState="loading"),e()}(document,"DOMContentLoaded"),b.on("raphael.DOMload",function(){u=!0}),function(){if(c.svg){var a="hasOwnProperty",b=String,d=parseFloat,e=parseInt,f=Math,g=f.max,h=f.abs,i=f.pow,j=/[, ]+/,k=c.eve,l="",m=" ",n="http://www.w3.org/1999/xlink",o={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},p={};c.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var q=function(d,e){if(e){"string"==typeof d&&(d=q(d));for(var f in e)e[a](f)&&("xlink:"==f.substring(0,6)?d.setAttributeNS(n,f.substring(6),b(e[f])):d.setAttribute(f,b(e[f])))}else d=c._g.doc.createElementNS("http://www.w3.org/2000/svg",d),d.style&&(d.style.webkitTapHighlightColor="rgba(0,0,0,0)");return d},r=function(a,e){var j="linear",k=a.id+e,m=.5,n=.5,o=a.node,p=a.paper,r=o.style,s=c._g.doc.getElementById(k);if(!s){if(e=b(e).replace(c._radial_gradient,function(a,b,c){if(j="radial",b&&c){m=d(b),n=d(c);var e=2*(n>.5)-1;i(m-.5,2)+i(n-.5,2)>.25&&(n=f.sqrt(.25-i(m-.5,2))*e+.5)&&.5!=n&&(n=n.toFixed(5)-1e-5*e)}return l}),e=e.split(/\s*\-\s*/),"linear"==j){var t=e.shift();if(t=-d(t),isNaN(t))return null;var u=[0,0,f.cos(c.rad(t)),f.sin(c.rad(t))],v=1/(g(h(u[2]),h(u[3]))||1);u[2]*=v,u[3]*=v,u[2]<0&&(u[0]=-u[2],u[2]=0),u[3]<0&&(u[1]=-u[3],u[3]=0)}var w=c._parseDots(e);if(!w)return null;if(k=k.replace(/[\(\)\s,\xb0#]/g,"_"),a.gradient&&k!=a.gradient.id&&(p.defs.removeChild(a.gradient),delete a.gradient),!a.gradient){s=q(j+"Gradient",{id:k}),a.gradient=s,q(s,"radial"==j?{fx:m,fy:n}:{x1:u[0],y1:u[1],x2:u[2],y2:u[3],gradientTransform:a.matrix.invert()}),p.defs.appendChild(s);for(var x=0,y=w.length;y>x;x++)s.appendChild(q("stop",{offset:w[x].offset?w[x].offset:x?"100%":"0%","stop-color":w[x].color||"#fff"}))}}return q(o,{fill:"url(#"+k+")",opacity:1,"fill-opacity":1}),r.fill=l,r.opacity=1,r.fillOpacity=1,1},s=function(a){var b=a.getBBox(1);q(a.pattern,{patternTransform:a.matrix.invert()+" translate("+b.x+","+b.y+")"})},t=function(d,e,f){if("path"==d.type){for(var g,h,i,j,k,m=b(e).toLowerCase().split("-"),n=d.paper,r=f?"end":"start",s=d.node,t=d.attrs,u=t["stroke-width"],v=m.length,w="classic",x=3,y=3,z=5;v--;)switch(m[v]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":w=m[v];break;case"wide":y=5;break;case"narrow":y=2;break;case"long":x=5;break;case"short":x=2}if("open"==w?(x+=2,y+=2,z+=2,i=1,j=f?4:1,k={fill:"none",stroke:t.stroke}):(j=i=x/2,k={fill:t.stroke,stroke:"none"}),d._.arrows?f?(d._.arrows.endPath&&p[d._.arrows.endPath]--,d._.arrows.endMarker&&p[d._.arrows.endMarker]--):(d._.arrows.startPath&&p[d._.arrows.startPath]--,d._.arrows.startMarker&&p[d._.arrows.startMarker]--):d._.arrows={},"none"!=w){var A="raphael-marker-"+w,B="raphael-marker-"+r+w+x+y;c._g.doc.getElementById(A)?p[A]++:(n.defs.appendChild(q(q("path"),{"stroke-linecap":"round",d:o[w],id:A})),p[A]=1);var C,D=c._g.doc.getElementById(B);D?(p[B]++,C=D.getElementsByTagName("use")[0]):(D=q(q("marker"),{id:B,markerHeight:y,markerWidth:x,orient:"auto",refX:j,refY:y/2}),C=q(q("use"),{"xlink:href":"#"+A,transform:(f?"rotate(180 "+x/2+" "+y/2+") ":l)+"scale("+x/z+","+y/z+")","stroke-width":(1/((x/z+y/z)/2)).toFixed(4)}),D.appendChild(C),n.defs.appendChild(D),p[B]=1),q(C,k);var E=i*("diamond"!=w&&"oval"!=w);f?(g=d._.arrows.startdx*u||0,h=c.getTotalLength(t.path)-E*u):(g=E*u,h=c.getTotalLength(t.path)-(d._.arrows.enddx*u||0)),k={},k["marker-"+r]="url(#"+B+")",(h||g)&&(k.d=c.getSubpath(t.path,g,h)),q(s,k),d._.arrows[r+"Path"]=A,d._.arrows[r+"Marker"]=B,d._.arrows[r+"dx"]=E,d._.arrows[r+"Type"]=w,d._.arrows[r+"String"]=e}else f?(g=d._.arrows.startdx*u||0,h=c.getTotalLength(t.path)-g):(g=0,h=c.getTotalLength(t.path)-(d._.arrows.enddx*u||0)),d._.arrows[r+"Path"]&&q(s,{d:c.getSubpath(t.path,g,h)}),delete d._.arrows[r+"Path"],delete d._.arrows[r+"Marker"],delete d._.arrows[r+"dx"],delete d._.arrows[r+"Type"],delete d._.arrows[r+"String"];for(k in p)if(p[a](k)&&!p[k]){var F=c._g.doc.getElementById(k);F&&F.parentNode.removeChild(F)}}},u={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},v=function(a,c,d){if(c=u[b(c).toLowerCase()]){for(var e=a.attrs["stroke-width"]||"1",f={round:e,square:e,butt:0}[a.attrs["stroke-linecap"]||d["stroke-linecap"]]||0,g=[],h=c.length;h--;)g[h]=c[h]*e+(h%2?1:-1)*f;q(a.node,{"stroke-dasharray":g.join(",")})}},w=function(d,f){var i=d.node,k=d.attrs,m=i.style.visibility;i.style.visibility="hidden";for(var o in f)if(f[a](o)){if(!c._availableAttrs[a](o))continue;var p=f[o];switch(k[o]=p,o){case"blur":d.blur(p);break;case"href":case"title":var u=q("title"),w=c._g.doc.createTextNode(p);u.appendChild(w),i.appendChild(u);break;case"target":var x=i.parentNode;if("a"!=x.tagName.toLowerCase()){var u=q("a");x.insertBefore(u,i),u.appendChild(i),x=u}"target"==o?x.setAttributeNS(n,"show","blank"==p?"new":p):x.setAttributeNS(n,o,p);break;case"cursor":i.style.cursor=p;break;case"transform":d.transform(p);break;case"arrow-start":t(d,p);break;case"arrow-end":t(d,p,1);break;case"clip-rect":var z=b(p).split(j);if(4==z.length){d.clip&&d.clip.parentNode.parentNode.removeChild(d.clip.parentNode);var A=q("clipPath"),B=q("rect");A.id=c.createUUID(),q(B,{x:z[0],y:z[1],width:z[2],height:z[3]}),A.appendChild(B),d.paper.defs.appendChild(A),q(i,{"clip-path":"url(#"+A.id+")"}),d.clip=B}if(!p){var C=i.getAttribute("clip-path");if(C){var D=c._g.doc.getElementById(C.replace(/(^url\(#|\)$)/g,l));D&&D.parentNode.removeChild(D),q(i,{"clip-path":l}),delete d.clip}}break;case"path":"path"==d.type&&(q(i,{d:p?k.path=c._pathToAbsolute(p):"M0,0"}),d._.dirty=1,d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1)));break;case"width":if(i.setAttribute(o,p),d._.dirty=1,!k.fx)break;o="x",p=k.x;case"x":k.fx&&(p=-k.x-(k.width||0));case"rx":if("rx"==o&&"rect"==d.type)break;case"cx":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"height":if(i.setAttribute(o,p),d._.dirty=1,!k.fy)break;o="y",p=k.y;case"y":k.fy&&(p=-k.y-(k.height||0));case"ry":if("ry"==o&&"rect"==d.type)break;case"cy":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"r":"rect"==d.type?q(i,{rx:p,ry:p}):i.setAttribute(o,p),d._.dirty=1;break;case"src":"image"==d.type&&i.setAttributeNS(n,"href",p);break;case"stroke-width":(1!=d._.sx||1!=d._.sy)&&(p/=g(h(d._.sx),h(d._.sy))||1),d.paper._vbSize&&(p*=d.paper._vbSize),i.setAttribute(o,p),k["stroke-dasharray"]&&v(d,k["stroke-dasharray"],f),d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"stroke-dasharray":v(d,p,f);break;case"fill":var E=b(p).match(c._ISURL);if(E){A=q("pattern");var F=q("image");A.id=c.createUUID(),q(A,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),q(F,{x:0,y:0,"xlink:href":E[1]}),A.appendChild(F),function(a){c._preload(E[1],function(){var b=this.offsetWidth,c=this.offsetHeight;q(a,{width:b,height:c}),q(F,{width:b,height:c}),d.paper.safari()})}(A),d.paper.defs.appendChild(A),q(i,{fill:"url(#"+A.id+")"}),d.pattern=A,d.pattern&&s(d);break}var G=c.getRGB(p);if(G.error){if(("circle"==d.type||"ellipse"==d.type||"r"!=b(p).charAt())&&r(d,p)){if("opacity"in k||"fill-opacity"in k){var H=c._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l));if(H){var I=H.getElementsByTagName("stop");q(I[I.length-1],{"stop-opacity":("opacity"in k?k.opacity:1)*("fill-opacity"in k?k["fill-opacity"]:1)})}}k.gradient=p,k.fill="none";break}}else delete f.gradient,delete k.gradient,!c.is(k.opacity,"undefined")&&c.is(f.opacity,"undefined")&&q(i,{opacity:k.opacity}),!c.is(k["fill-opacity"],"undefined")&&c.is(f["fill-opacity"],"undefined")&&q(i,{"fill-opacity":k["fill-opacity"]});G[a]("opacity")&&q(i,{"fill-opacity":G.opacity>1?G.opacity/100:G.opacity});case"stroke":G=c.getRGB(p),i.setAttribute(o,G.hex),"stroke"==o&&G[a]("opacity")&&q(i,{"stroke-opacity":G.opacity>1?G.opacity/100:G.opacity}),"stroke"==o&&d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"gradient":("circle"==d.type||"ellipse"==d.type||"r"!=b(p).charAt())&&r(d,p);break;case"opacity":k.gradient&&!k[a]("stroke-opacity")&&q(i,{"stroke-opacity":p>1?p/100:p});case"fill-opacity":if(k.gradient){H=c._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l)),H&&(I=H.getElementsByTagName("stop"),q(I[I.length-1],{"stop-opacity":p}));break}default:"font-size"==o&&(p=e(p,10)+"px");var J=o.replace(/(\-.)/g,function(a){return a.substring(1).toUpperCase()});i.style[J]=p,d._.dirty=1,i.setAttribute(o,p)}}y(d,f),i.style.visibility=m},x=1.2,y=function(d,f){if("text"==d.type&&(f[a]("text")||f[a]("font")||f[a]("font-size")||f[a]("x")||f[a]("y"))){var g=d.attrs,h=d.node,i=h.firstChild?e(c._g.doc.defaultView.getComputedStyle(h.firstChild,l).getPropertyValue("font-size"),10):10;
if(f[a]("text")){for(g.text=f.text;h.firstChild;)h.removeChild(h.firstChild);for(var j,k=b(f.text).split("\n"),m=[],n=0,o=k.length;o>n;n++)j=q("tspan"),n&&q(j,{dy:i*x,x:g.x}),j.appendChild(c._g.doc.createTextNode(k[n])),h.appendChild(j),m[n]=j}else for(m=h.getElementsByTagName("tspan"),n=0,o=m.length;o>n;n++)n?q(m[n],{dy:i*x,x:g.x}):q(m[0],{dy:0});q(h,{x:g.x,y:g.y}),d._.dirty=1;var p=d._getBBox(),r=g.y-(p.y+p.height/2);r&&c.is(r,"finite")&&q(m[0],{dy:r})}},z=function(a,b){this[0]=this.node=a,a.raphael=!0,this.id=c._oid++,a.raphaelid=this.id,this.matrix=c.matrix(),this.realPath=null,this.paper=b,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!b.bottom&&(b.bottom=this),this.prev=b.top,b.top&&(b.top.next=this),b.top=this,this.next=null},A=c.el;z.prototype=A,A.constructor=z,c._engine.path=function(a,b){var c=q("path");b.canvas&&b.canvas.appendChild(c);var d=new z(c,b);return d.type="path",w(d,{fill:"none",stroke:"#000",path:a}),d},A.rotate=function(a,c,e){if(this.removed)return this;if(a=b(a).split(j),a.length-1&&(c=d(a[1]),e=d(a[2])),a=d(a[0]),null==e&&(c=e),null==c||null==e){var f=this.getBBox(1);c=f.x+f.width/2,e=f.y+f.height/2}return this.transform(this._.transform.concat([["r",a,c,e]])),this},A.scale=function(a,c,e,f){if(this.removed)return this;if(a=b(a).split(j),a.length-1&&(c=d(a[1]),e=d(a[2]),f=d(a[3])),a=d(a[0]),null==c&&(c=a),null==f&&(e=f),null==e||null==f)var g=this.getBBox(1);return e=null==e?g.x+g.width/2:e,f=null==f?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,c,e,f]])),this},A.translate=function(a,c){return this.removed?this:(a=b(a).split(j),a.length-1&&(c=d(a[1])),a=d(a[0])||0,c=+c||0,this.transform(this._.transform.concat([["t",a,c]])),this)},A.transform=function(b){var d=this._;if(null==b)return d.transform;if(c._extractTransform(this,b),this.clip&&q(this.clip,{transform:this.matrix.invert()}),this.pattern&&s(this),this.node&&q(this.node,{transform:this.matrix}),1!=d.sx||1!=d.sy){var e=this.attrs[a]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":e})}return this},A.hide=function(){return!this.removed&&this.paper.safari(this.node.style.display="none"),this},A.show=function(){return!this.removed&&this.paper.safari(this.node.style.display=""),this},A.remove=function(){if(!this.removed&&this.node.parentNode){var a=this.paper;a.__set__&&a.__set__.exclude(this),k.unbind("raphael.*.*."+this.id),this.gradient&&a.defs.removeChild(this.gradient),c._tear(this,a),"a"==this.node.parentNode.tagName.toLowerCase()?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var b in this)this[b]="function"==typeof this[b]?c._removedFactory(b):null;this.removed=!0}},A._getBBox=function(){if("none"==this.node.style.display){this.show();var a=!0}var b={};try{b=this.node.getBBox()}catch(c){}finally{b=b||{}}return a&&this.hide(),b},A.attr=function(b,d){if(this.removed)return this;if(null==b){var e={};for(var f in this.attrs)this.attrs[a](f)&&(e[f]=this.attrs[f]);return e.gradient&&"none"==e.fill&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform,e}if(null==d&&c.is(b,"string")){if("fill"==b&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;if("transform"==b)return this._.transform;for(var g=b.split(j),h={},i=0,l=g.length;l>i;i++)b=g[i],h[b]=b in this.attrs?this.attrs[b]:c.is(this.paper.customAttributes[b],"function")?this.paper.customAttributes[b].def:c._availableAttrs[b];return l-1?h:h[g[0]]}if(null==d&&c.is(b,"array")){for(h={},i=0,l=b.length;l>i;i++)h[b[i]]=this.attr(b[i]);return h}if(null!=d){var m={};m[b]=d}else null!=b&&c.is(b,"object")&&(m=b);for(var n in m)k("raphael.attr."+n+"."+this.id,this,m[n]);for(n in this.paper.customAttributes)if(this.paper.customAttributes[a](n)&&m[a](n)&&c.is(this.paper.customAttributes[n],"function")){var o=this.paper.customAttributes[n].apply(this,[].concat(m[n]));this.attrs[n]=m[n];for(var p in o)o[a](p)&&(m[p]=o[p])}return w(this,m),this},A.toFront=function(){if(this.removed)return this;"a"==this.node.parentNode.tagName.toLowerCase()?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var a=this.paper;return a.top!=this&&c._tofront(this,a),this},A.toBack=function(){if(this.removed)return this;var a=this.node.parentNode;return"a"==a.tagName.toLowerCase()?a.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):a.firstChild!=this.node&&a.insertBefore(this.node,this.node.parentNode.firstChild),c._toback(this,this.paper),this.paper,this},A.insertAfter=function(a){if(this.removed)return this;var b=a.node||a[a.length-1].node;return b.nextSibling?b.parentNode.insertBefore(this.node,b.nextSibling):b.parentNode.appendChild(this.node),c._insertafter(this,a,this.paper),this},A.insertBefore=function(a){if(this.removed)return this;var b=a.node||a[0].node;return b.parentNode.insertBefore(this.node,b),c._insertbefore(this,a,this.paper),this},A.blur=function(a){var b=this;if(0!==+a){var d=q("filter"),e=q("feGaussianBlur");b.attrs.blur=a,d.id=c.createUUID(),q(e,{stdDeviation:+a||1.5}),d.appendChild(e),b.paper.defs.appendChild(d),b._blur=d,q(b.node,{filter:"url(#"+d.id+")"})}else b._blur&&(b._blur.parentNode.removeChild(b._blur),delete b._blur,delete b.attrs.blur),b.node.removeAttribute("filter");return b},c._engine.circle=function(a,b,c,d){var e=q("circle");a.canvas&&a.canvas.appendChild(e);var f=new z(e,a);return f.attrs={cx:b,cy:c,r:d,fill:"none",stroke:"#000"},f.type="circle",q(e,f.attrs),f},c._engine.rect=function(a,b,c,d,e,f){var g=q("rect");a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);return h.attrs={x:b,y:c,width:d,height:e,r:f||0,rx:f||0,ry:f||0,fill:"none",stroke:"#000"},h.type="rect",q(g,h.attrs),h},c._engine.ellipse=function(a,b,c,d,e){var f=q("ellipse");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);return g.attrs={cx:b,cy:c,rx:d,ry:e,fill:"none",stroke:"#000"},g.type="ellipse",q(f,g.attrs),g},c._engine.image=function(a,b,c,d,e,f){var g=q("image");q(g,{x:c,y:d,width:e,height:f,preserveAspectRatio:"none"}),g.setAttributeNS(n,"href",b),a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);return h.attrs={x:c,y:d,width:e,height:f,src:b},h.type="image",h},c._engine.text=function(a,b,d,e){var f=q("text");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);return g.attrs={x:b,y:d,"text-anchor":"middle",text:e,font:c._availableAttrs.font,stroke:"none",fill:"#000"},g.type="text",w(g,g.attrs),g},c._engine.setSize=function(a,b){return this.width=a||this.width,this.height=b||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox),this},c._engine.create=function(){var a=c._getContainer.apply(0,arguments),b=a&&a.container,d=a.x,e=a.y,f=a.width,g=a.height;if(!b)throw new Error("SVG container not found.");var h,i=q("svg"),j="overflow:hidden;";return d=d||0,e=e||0,f=f||512,g=g||342,q(i,{height:g,version:1.1,width:f,xmlns:"http://www.w3.org/2000/svg"}),1==b?(i.style.cssText=j+"position:absolute;left:"+d+"px;top:"+e+"px",c._g.doc.body.appendChild(i),h=1):(i.style.cssText=j+"position:relative",b.firstChild?b.insertBefore(i,b.firstChild):b.appendChild(i)),b=new c._Paper,b.width=f,b.height=g,b.canvas=i,b.clear(),b._left=b._top=0,h&&(b.renderfix=function(){}),b.renderfix(),b},c._engine.setViewBox=function(a,b,c,d,e){k("raphael.setViewBox",this,this._viewBox,[a,b,c,d,e]);var f,h,i=g(c/this.width,d/this.height),j=this.top,l=e?"meet":"xMinYMin";for(null==a?(this._vbSize&&(i=1),delete this._vbSize,f="0 0 "+this.width+m+this.height):(this._vbSize=i,f=a+m+b+m+c+m+d),q(this.canvas,{viewBox:f,preserveAspectRatio:l});i&&j;)h="stroke-width"in j.attrs?j.attrs["stroke-width"]:1,j.attr({"stroke-width":h}),j._.dirty=1,j._.dirtyT=1,j=j.prev;return this._viewBox=[a,b,c,d,!!e],this},c.prototype.renderfix=function(){var a,b=this.canvas,c=b.style;try{a=b.getScreenCTM()||b.createSVGMatrix()}catch(d){a=b.createSVGMatrix()}var e=-a.e%1,f=-a.f%1;(e||f)&&(e&&(this._left=(this._left+e)%1,c.left=this._left+"px"),f&&(this._top=(this._top+f)%1,c.top=this._top+"px"))},c.prototype.clear=function(){c.eve("raphael.clear",this);for(var a=this.canvas;a.firstChild;)a.removeChild(a.firstChild);this.bottom=this.top=null,(this.desc=q("desc")).appendChild(c._g.doc.createTextNode("Created with Raphaël "+c.version)),a.appendChild(this.desc),a.appendChild(this.defs=q("defs"))},c.prototype.remove=function(){k("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var a in this)this[a]="function"==typeof this[a]?c._removedFactory(a):null};var B=c.st;for(var C in A)A[a](C)&&!B[a](C)&&(B[C]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(C))}}(),function(){if(c.vml){var a="hasOwnProperty",b=String,d=parseFloat,e=Math,f=e.round,g=e.max,h=e.min,i=e.abs,j="fill",k=/[, ]+/,l=c.eve,m=" progid:DXImageTransform.Microsoft",n=" ",o="",p={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},q=/([clmz]),?([^clmz]*)/gi,r=/ progid:\S+Blur\([^\)]+\)/g,s=/-?[^,\s-]+/g,t="position:absolute;left:0;top:0;width:1px;height:1px",u=21600,v={path:1,rect:1,image:1},w={circle:1,ellipse:1},x=function(a){var d=/[ahqstv]/gi,e=c._pathToAbsolute;if(b(a).match(d)&&(e=c._path2curve),d=/[clmz]/g,e==c._pathToAbsolute&&!b(a).match(d)){var g=b(a).replace(q,function(a,b,c){var d=[],e="m"==b.toLowerCase(),g=p[b];return c.replace(s,function(a){e&&2==d.length&&(g+=d+p["m"==b?"l":"L"],d=[]),d.push(f(a*u))}),g+d});return g}var h,i,j=e(a);g=[];for(var k=0,l=j.length;l>k;k++){h=j[k],i=j[k][0].toLowerCase(),"z"==i&&(i="x");for(var m=1,r=h.length;r>m;m++)i+=f(h[m]*u)+(m!=r-1?",":o);g.push(i)}return g.join(n)},y=function(a,b,d){var e=c.matrix();return e.rotate(-a,.5,.5),{dx:e.x(b,d),dy:e.y(b,d)}},z=function(a,b,c,d,e,f){var g=a._,h=a.matrix,k=g.fillpos,l=a.node,m=l.style,o=1,p="",q=u/b,r=u/c;if(m.visibility="hidden",b&&c){if(l.coordsize=i(q)+n+i(r),m.rotation=f*(0>b*c?-1:1),f){var s=y(f,d,e);d=s.dx,e=s.dy}if(0>b&&(p+="x"),0>c&&(p+=" y")&&(o=-1),m.flip=p,l.coordorigin=d*-q+n+e*-r,k||g.fillsize){var t=l.getElementsByTagName(j);t=t&&t[0],l.removeChild(t),k&&(s=y(f,h.x(k[0],k[1]),h.y(k[0],k[1])),t.position=s.dx*o+n+s.dy*o),g.fillsize&&(t.size=g.fillsize[0]*i(b)+n+g.fillsize[1]*i(c)),l.appendChild(t)}m.visibility="visible"}};c.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var A=function(a,c,d){for(var e=b(c).toLowerCase().split("-"),f=d?"end":"start",g=e.length,h="classic",i="medium",j="medium";g--;)switch(e[g]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":h=e[g];break;case"wide":case"narrow":j=e[g];break;case"long":case"short":i=e[g]}var k=a.node.getElementsByTagName("stroke")[0];k[f+"arrow"]=h,k[f+"arrowlength"]=i,k[f+"arrowwidth"]=j},B=function(e,i){e.attrs=e.attrs||{};var l=e.node,m=e.attrs,p=l.style,q=v[e.type]&&(i.x!=m.x||i.y!=m.y||i.width!=m.width||i.height!=m.height||i.cx!=m.cx||i.cy!=m.cy||i.rx!=m.rx||i.ry!=m.ry||i.r!=m.r),r=w[e.type]&&(m.cx!=i.cx||m.cy!=i.cy||m.r!=i.r||m.rx!=i.rx||m.ry!=i.ry),s=e;for(var t in i)i[a](t)&&(m[t]=i[t]);if(q&&(m.path=c._getPath[e.type](e),e._.dirty=1),i.href&&(l.href=i.href),i.title&&(l.title=i.title),i.target&&(l.target=i.target),i.cursor&&(p.cursor=i.cursor),"blur"in i&&e.blur(i.blur),(i.path&&"path"==e.type||q)&&(l.path=x(~b(m.path).toLowerCase().indexOf("r")?c._pathToAbsolute(m.path):m.path),"image"==e.type&&(e._.fillpos=[m.x,m.y],e._.fillsize=[m.width,m.height],z(e,1,1,0,0,0))),"transform"in i&&e.transform(i.transform),r){var y=+m.cx,B=+m.cy,D=+m.rx||+m.r||0,E=+m.ry||+m.r||0;l.path=c.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",f((y-D)*u),f((B-E)*u),f((y+D)*u),f((B+E)*u),f(y*u)),e._.dirty=1}if("clip-rect"in i){var G=b(i["clip-rect"]).split(k);if(4==G.length){G[2]=+G[2]+ +G[0],G[3]=+G[3]+ +G[1];var H=l.clipRect||c._g.doc.createElement("div"),I=H.style;I.clip=c.format("rect({1}px {2}px {3}px {0}px)",G),l.clipRect||(I.position="absolute",I.top=0,I.left=0,I.width=e.paper.width+"px",I.height=e.paper.height+"px",l.parentNode.insertBefore(H,l),H.appendChild(l),l.clipRect=H)}i["clip-rect"]||l.clipRect&&(l.clipRect.style.clip="auto")}if(e.textpath){var J=e.textpath.style;i.font&&(J.font=i.font),i["font-family"]&&(J.fontFamily='"'+i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,o)+'"'),i["font-size"]&&(J.fontSize=i["font-size"]),i["font-weight"]&&(J.fontWeight=i["font-weight"]),i["font-style"]&&(J.fontStyle=i["font-style"])}if("arrow-start"in i&&A(s,i["arrow-start"]),"arrow-end"in i&&A(s,i["arrow-end"],1),null!=i.opacity||null!=i["stroke-width"]||null!=i.fill||null!=i.src||null!=i.stroke||null!=i["stroke-width"]||null!=i["stroke-opacity"]||null!=i["fill-opacity"]||null!=i["stroke-dasharray"]||null!=i["stroke-miterlimit"]||null!=i["stroke-linejoin"]||null!=i["stroke-linecap"]){var K=l.getElementsByTagName(j),L=!1;if(K=K&&K[0],!K&&(L=K=F(j)),"image"==e.type&&i.src&&(K.src=i.src),i.fill&&(K.on=!0),(null==K.on||"none"==i.fill||null===i.fill)&&(K.on=!1),K.on&&i.fill){var M=b(i.fill).match(c._ISURL);if(M){K.parentNode==l&&l.removeChild(K),K.rotate=!0,K.src=M[1],K.type="tile";var N=e.getBBox(1);K.position=N.x+n+N.y,e._.fillpos=[N.x,N.y],c._preload(M[1],function(){e._.fillsize=[this.offsetWidth,this.offsetHeight]})}else K.color=c.getRGB(i.fill).hex,K.src=o,K.type="solid",c.getRGB(i.fill).error&&(s.type in{circle:1,ellipse:1}||"r"!=b(i.fill).charAt())&&C(s,i.fill,K)&&(m.fill="none",m.gradient=i.fill,K.rotate=!1)}if("fill-opacity"in i||"opacity"in i){var O=((+m["fill-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+c.getRGB(i.fill).o+1||2)-1);O=h(g(O,0),1),K.opacity=O,K.src&&(K.color="none")}l.appendChild(K);var P=l.getElementsByTagName("stroke")&&l.getElementsByTagName("stroke")[0],Q=!1;!P&&(Q=P=F("stroke")),(i.stroke&&"none"!=i.stroke||i["stroke-width"]||null!=i["stroke-opacity"]||i["stroke-dasharray"]||i["stroke-miterlimit"]||i["stroke-linejoin"]||i["stroke-linecap"])&&(P.on=!0),("none"==i.stroke||null===i.stroke||null==P.on||0==i.stroke||0==i["stroke-width"])&&(P.on=!1);var R=c.getRGB(i.stroke);P.on&&i.stroke&&(P.color=R.hex),O=((+m["stroke-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+R.o+1||2)-1);var S=.75*(d(i["stroke-width"])||1);if(O=h(g(O,0),1),null==i["stroke-width"]&&(S=m["stroke-width"]),i["stroke-width"]&&(P.weight=S),S&&1>S&&(O*=S)&&(P.weight=1),P.opacity=O,i["stroke-linejoin"]&&(P.joinstyle=i["stroke-linejoin"]||"miter"),P.miterlimit=i["stroke-miterlimit"]||8,i["stroke-linecap"]&&(P.endcap="butt"==i["stroke-linecap"]?"flat":"square"==i["stroke-linecap"]?"square":"round"),i["stroke-dasharray"]){var T={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};P.dashstyle=T[a](i["stroke-dasharray"])?T[i["stroke-dasharray"]]:o}Q&&l.appendChild(P)}if("text"==s.type){s.paper.canvas.style.display=o;var U=s.paper.span,V=100,W=m.font&&m.font.match(/\d+(?:\.\d*)?(?=px)/);p=U.style,m.font&&(p.font=m.font),m["font-family"]&&(p.fontFamily=m["font-family"]),m["font-weight"]&&(p.fontWeight=m["font-weight"]),m["font-style"]&&(p.fontStyle=m["font-style"]),W=d(m["font-size"]||W&&W[0])||10,p.fontSize=W*V+"px",s.textpath.string&&(U.innerHTML=b(s.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var X=U.getBoundingClientRect();s.W=m.w=(X.right-X.left)/V,s.H=m.h=(X.bottom-X.top)/V,s.X=m.x,s.Y=m.y+s.H/2,("x"in i||"y"in i)&&(s.path.v=c.format("m{0},{1}l{2},{1}",f(m.x*u),f(m.y*u),f(m.x*u)+1));for(var Y=["x","y","text","font","font-family","font-weight","font-style","font-size"],Z=0,$=Y.length;$>Z;Z++)if(Y[Z]in i){s._.dirty=1;break}switch(m["text-anchor"]){case"start":s.textpath.style["v-text-align"]="left",s.bbx=s.W/2;break;case"end":s.textpath.style["v-text-align"]="right",s.bbx=-s.W/2;break;default:s.textpath.style["v-text-align"]="center",s.bbx=0}s.textpath.style["v-text-kern"]=!0}},C=function(a,f,g){a.attrs=a.attrs||{};var h=(a.attrs,Math.pow),i="linear",j=".5 .5";if(a.attrs.gradient=f,f=b(f).replace(c._radial_gradient,function(a,b,c){return i="radial",b&&c&&(b=d(b),c=d(c),h(b-.5,2)+h(c-.5,2)>.25&&(c=e.sqrt(.25-h(b-.5,2))*(2*(c>.5)-1)+.5),j=b+n+c),o}),f=f.split(/\s*\-\s*/),"linear"==i){var k=f.shift();if(k=-d(k),isNaN(k))return null}var l=c._parseDots(f);if(!l)return null;if(a=a.shape||a.node,l.length){a.removeChild(g),g.on=!0,g.method="none",g.color=l[0].color,g.color2=l[l.length-1].color;for(var m=[],p=0,q=l.length;q>p;p++)l[p].offset&&m.push(l[p].offset+n+l[p].color);g.colors=m.length?m.join():"0% "+g.color,"radial"==i?(g.type="gradientTitle",g.focus="100%",g.focussize="0 0",g.focusposition=j,g.angle=0):(g.type="gradient",g.angle=(270-k)%360),a.appendChild(g)}return 1},D=function(a,b){this[0]=this.node=a,a.raphael=!0,this.id=c._oid++,a.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=b,this.matrix=c.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!b.bottom&&(b.bottom=this),this.prev=b.top,b.top&&(b.top.next=this),b.top=this,this.next=null},E=c.el;D.prototype=E,E.constructor=D,E.transform=function(a){if(null==a)return this._.transform;var d,e=this.paper._viewBoxShift,f=e?"s"+[e.scale,e.scale]+"-1-1t"+[e.dx,e.dy]:o;e&&(d=a=b(a).replace(/\.{3}|\u2026/g,this._.transform||o)),c._extractTransform(this,f+a);var g,h=this.matrix.clone(),i=this.skew,j=this.node,k=~b(this.attrs.fill).indexOf("-"),l=!b(this.attrs.fill).indexOf("url(");if(h.translate(1,1),l||k||"image"==this.type)if(i.matrix="1 0 0 1",i.offset="0 0",g=h.split(),k&&g.noRotation||!g.isSimple){j.style.filter=h.toFilter();var m=this.getBBox(),p=this.getBBox(1),q=m.x-p.x,r=m.y-p.y;j.coordorigin=q*-u+n+r*-u,z(this,1,1,q,r,0)}else j.style.filter=o,z(this,g.scalex,g.scaley,g.dx,g.dy,g.rotate);else j.style.filter=o,i.matrix=b(h),i.offset=h.offset();return d&&(this._.transform=d),this},E.rotate=function(a,c,e){if(this.removed)return this;if(null!=a){if(a=b(a).split(k),a.length-1&&(c=d(a[1]),e=d(a[2])),a=d(a[0]),null==e&&(c=e),null==c||null==e){var f=this.getBBox(1);c=f.x+f.width/2,e=f.y+f.height/2}return this._.dirtyT=1,this.transform(this._.transform.concat([["r",a,c,e]])),this}},E.translate=function(a,c){return this.removed?this:(a=b(a).split(k),a.length-1&&(c=d(a[1])),a=d(a[0])||0,c=+c||0,this._.bbox&&(this._.bbox.x+=a,this._.bbox.y+=c),this.transform(this._.transform.concat([["t",a,c]])),this)},E.scale=function(a,c,e,f){if(this.removed)return this;if(a=b(a).split(k),a.length-1&&(c=d(a[1]),e=d(a[2]),f=d(a[3]),isNaN(e)&&(e=null),isNaN(f)&&(f=null)),a=d(a[0]),null==c&&(c=a),null==f&&(e=f),null==e||null==f)var g=this.getBBox(1);return e=null==e?g.x+g.width/2:e,f=null==f?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,c,e,f]])),this._.dirtyT=1,this},E.hide=function(){return!this.removed&&(this.node.style.display="none"),this},E.show=function(){return!this.removed&&(this.node.style.display=o),this},E._getBBox=function(){return this.removed?{}:{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},E.remove=function(){if(!this.removed&&this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),c.eve.unbind("raphael.*.*."+this.id),c._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var a in this)this[a]="function"==typeof this[a]?c._removedFactory(a):null;this.removed=!0}},E.attr=function(b,d){if(this.removed)return this;if(null==b){var e={};for(var f in this.attrs)this.attrs[a](f)&&(e[f]=this.attrs[f]);return e.gradient&&"none"==e.fill&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform,e}if(null==d&&c.is(b,"string")){if(b==j&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;for(var g=b.split(k),h={},i=0,m=g.length;m>i;i++)b=g[i],h[b]=b in this.attrs?this.attrs[b]:c.is(this.paper.customAttributes[b],"function")?this.paper.customAttributes[b].def:c._availableAttrs[b];return m-1?h:h[g[0]]}if(this.attrs&&null==d&&c.is(b,"array")){for(h={},i=0,m=b.length;m>i;i++)h[b[i]]=this.attr(b[i]);return h}var n;null!=d&&(n={},n[b]=d),null==d&&c.is(b,"object")&&(n=b);for(var o in n)l("raphael.attr."+o+"."+this.id,this,n[o]);if(n){for(o in this.paper.customAttributes)if(this.paper.customAttributes[a](o)&&n[a](o)&&c.is(this.paper.customAttributes[o],"function")){var p=this.paper.customAttributes[o].apply(this,[].concat(n[o]));this.attrs[o]=n[o];for(var q in p)p[a](q)&&(n[q]=p[q])}n.text&&"text"==this.type&&(this.textpath.string=n.text),B(this,n)}return this},E.toFront=function(){return!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&c._tofront(this,this.paper),this},E.toBack=function(){return this.removed?this:(this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),c._toback(this,this.paper)),this)},E.insertAfter=function(a){return this.removed?this:(a.constructor==c.st.constructor&&(a=a[a.length-1]),a.node.nextSibling?a.node.parentNode.insertBefore(this.node,a.node.nextSibling):a.node.parentNode.appendChild(this.node),c._insertafter(this,a,this.paper),this)},E.insertBefore=function(a){return this.removed?this:(a.constructor==c.st.constructor&&(a=a[0]),a.node.parentNode.insertBefore(this.node,a.node),c._insertbefore(this,a,this.paper),this)},E.blur=function(a){var b=this.node.runtimeStyle,d=b.filter;return d=d.replace(r,o),0!==+a?(this.attrs.blur=a,b.filter=d+n+m+".Blur(pixelradius="+(+a||1.5)+")",b.margin=c.format("-{0}px 0 0 -{0}px",f(+a||1.5))):(b.filter=d,b.margin=0,delete this.attrs.blur),this},c._engine.path=function(a,b){var c=F("shape");c.style.cssText=t,c.coordsize=u+n+u,c.coordorigin=b.coordorigin;var d=new D(c,b),e={fill:"none",stroke:"#000"};a&&(e.path=a),d.type="path",d.path=[],d.Path=o,B(d,e),b.canvas.appendChild(c);var f=F("skew");return f.on=!0,c.appendChild(f),d.skew=f,d.transform(o),d},c._engine.rect=function(a,b,d,e,f,g){var h=c._rectPath(b,d,e,f,g),i=a.path(h),j=i.attrs;return i.X=j.x=b,i.Y=j.y=d,i.W=j.width=e,i.H=j.height=f,j.r=g,j.path=h,i.type="rect",i},c._engine.ellipse=function(a,b,c,d,e){var f=a.path();return f.attrs,f.X=b-d,f.Y=c-e,f.W=2*d,f.H=2*e,f.type="ellipse",B(f,{cx:b,cy:c,rx:d,ry:e}),f},c._engine.circle=function(a,b,c,d){var e=a.path();return e.attrs,e.X=b-d,e.Y=c-d,e.W=e.H=2*d,e.type="circle",B(e,{cx:b,cy:c,r:d}),e},c._engine.image=function(a,b,d,e,f,g){var h=c._rectPath(d,e,f,g),i=a.path(h).attr({stroke:"none"}),k=i.attrs,l=i.node,m=l.getElementsByTagName(j)[0];return k.src=b,i.X=k.x=d,i.Y=k.y=e,i.W=k.width=f,i.H=k.height=g,k.path=h,i.type="image",m.parentNode==l&&l.removeChild(m),m.rotate=!0,m.src=b,m.type="tile",i._.fillpos=[d,e],i._.fillsize=[f,g],l.appendChild(m),z(i,1,1,0,0,0),i},c._engine.text=function(a,d,e,g){var h=F("shape"),i=F("path"),j=F("textpath");d=d||0,e=e||0,g=g||"",i.v=c.format("m{0},{1}l{2},{1}",f(d*u),f(e*u),f(d*u)+1),i.textpathok=!0,j.string=b(g),j.on=!0,h.style.cssText=t,h.coordsize=u+n+u,h.coordorigin="0 0";var k=new D(h,a),l={fill:"#000",stroke:"none",font:c._availableAttrs.font,text:g};k.shape=h,k.path=i,k.textpath=j,k.type="text",k.attrs.text=b(g),k.attrs.x=d,k.attrs.y=e,k.attrs.w=1,k.attrs.h=1,B(k,l),h.appendChild(j),h.appendChild(i),a.canvas.appendChild(h);var m=F("skew");return m.on=!0,h.appendChild(m),k.skew=m,k.transform(o),k},c._engine.setSize=function(a,b){var d=this.canvas.style;return this.width=a,this.height=b,a==+a&&(a+="px"),b==+b&&(b+="px"),d.width=a,d.height=b,d.clip="rect(0 "+a+" "+b+" 0)",this._viewBox&&c._engine.setViewBox.apply(this,this._viewBox),this},c._engine.setViewBox=function(a,b,d,e,f){c.eve("raphael.setViewBox",this,this._viewBox,[a,b,d,e,f]);var h,i,j=this.width,k=this.height,l=1/g(d/j,e/k);return f&&(h=k/e,i=j/d,j>d*h&&(a-=(j-d*h)/2/h),k>e*i&&(b-=(k-e*i)/2/i)),this._viewBox=[a,b,d,e,!!f],this._viewBoxShift={dx:-a,dy:-b,scale:l},this.forEach(function(a){a.transform("...")}),this};var F;c._engine.initWin=function(a){var b=a.document;b.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!b.namespaces.rvml&&b.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),F=function(a){return b.createElement("<rvml:"+a+' class="rvml">')}}catch(c){F=function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},c._engine.initWin(c._g.win),c._engine.create=function(){var a=c._getContainer.apply(0,arguments),b=a.container,d=a.height,e=a.width,f=a.x,g=a.y;if(!b)throw new Error("VML container not found.");var h=new c._Paper,i=h.canvas=c._g.doc.createElement("div"),j=i.style;return f=f||0,g=g||0,e=e||512,d=d||342,h.width=e,h.height=d,e==+e&&(e+="px"),d==+d&&(d+="px"),h.coordsize=1e3*u+n+1e3*u,h.coordorigin="0 0",h.span=c._g.doc.createElement("span"),h.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",i.appendChild(h.span),j.cssText=c.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",e,d),1==b?(c._g.doc.body.appendChild(i),j.left=f+"px",j.top=g+"px",j.position="absolute"):b.firstChild?b.insertBefore(i,b.firstChild):b.appendChild(i),h.renderfix=function(){},h},c.prototype.clear=function(){c.eve("raphael.clear",this),this.canvas.innerHTML=o,this.span=c._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},c.prototype.remove=function(){c.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var a in this)this[a]="function"==typeof this[a]?c._removedFactory(a):null;return!0};var G=c.st;for(var H in E)E[a](H)&&!G[a](H)&&(G[H]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(H))}}(),B.was?A.win.Raphael=c:Raphael=c,c});
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(L){var u;L.fn.emptyForce=function(){for(var ah=0,ai;(ai=L(this)[ah])!=null;ah++){if(ai.nodeType===1){L.cleanData(ai.getElementsByTagName("*"))}if(L.jqplot.use_excanvas){ai.outerHTML=""}else{while(ai.firstChild){ai.removeChild(ai.firstChild)}}ai=null}return L(this)};L.fn.removeChildForce=function(ah){while(ah.firstChild){this.removeChildForce(ah.firstChild);ah.removeChild(ah.firstChild)}};L.fn.jqplot=function(){var ah=[];var aj=[];for(var ak=0,ai=arguments.length;ak<ai;ak++){if(L.isArray(arguments[ak])){ah.push(arguments[ak])}else{if(L.isPlainObject(arguments[ak])){aj.push(arguments[ak])}}}return this.each(function(an){var at,ar,aq=L(this),am=ah.length,al=aj.length,ap,ao;if(an<am){ap=ah[an]}else{ap=am?ah[am-1]:null}if(an<al){ao=aj[an]}else{ao=al?aj[al-1]:null}at=aq.attr("id");if(at===u){at="jqplot_target_"+L.jqplot.targetCounter++;aq.attr("id",at)}ar=L.jqplot(at,ap,ao);aq.data("jqplot",ar)})};L.jqplot=function(an,ak,ai){var aj=null,ah=null;if(arguments.length===3){aj=ak;ah=ai}else{if(arguments.length===2){if(L.isArray(ak)){aj=ak}else{if(L.isPlainObject(ak)){ah=ak}}}}if(aj===null&&ah!==null&&ah.data){aj=ah.data}var am=new R();L("#"+an).removeClass("jqplot-error");if(L.jqplot.config.catchErrors){try{am.init(an,aj,ah);am.draw();am.themeEngine.init.call(am);return am}catch(al){var ao=L.jqplot.config.errorMessage||al.message;L("#"+an).append('<div class="jqplot-error-message">'+ao+"</div>");L("#"+an).addClass("jqplot-error");document.getElementById(an).style.background=L.jqplot.config.errorBackground;document.getElementById(an).style.border=L.jqplot.config.errorBorder;document.getElementById(an).style.fontFamily=L.jqplot.config.errorFontFamily;document.getElementById(an).style.fontSize=L.jqplot.config.errorFontSize;document.getElementById(an).style.fontStyle=L.jqplot.config.errorFontStyle;document.getElementById(an).style.fontWeight=L.jqplot.config.errorFontWeight}}else{am.init(an,aj,ah);am.draw();am.themeEngine.init.call(am);return am}};L.jqplot.version="1.0.8";L.jqplot.revision="1250";L.jqplot.targetCounter=1;L.jqplot.CanvasManager=function(){if(typeof L.jqplot.CanvasManager.canvases=="undefined"){L.jqplot.CanvasManager.canvases=[];L.jqplot.CanvasManager.free=[]}var ah=[];this.getCanvas=function(){var ak;var aj=true;if(!L.jqplot.use_excanvas){for(var al=0,ai=L.jqplot.CanvasManager.canvases.length;al<ai;al++){if(L.jqplot.CanvasManager.free[al]===true){aj=false;ak=L.jqplot.CanvasManager.canvases[al];L.jqplot.CanvasManager.free[al]=false;ah.push(al);break}}}if(aj){ak=document.createElement("canvas");ah.push(L.jqplot.CanvasManager.canvases.length);L.jqplot.CanvasManager.canvases.push(ak);L.jqplot.CanvasManager.free.push(false)}return ak};this.initCanvas=function(ai){if(L.jqplot.use_excanvas){return window.G_vmlCanvasManager.initElement(ai)}return ai};this.freeAllCanvases=function(){for(var aj=0,ai=ah.length;aj<ai;aj++){this.freeCanvas(ah[aj])}ah=[]};this.freeCanvas=function(ai){if(L.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==u){window.G_vmlCanvasManager.uninitElement(L.jqplot.CanvasManager.canvases[ai]);L.jqplot.CanvasManager.canvases[ai]=null}else{var aj=L.jqplot.CanvasManager.canvases[ai];aj.getContext("2d").clearRect(0,0,aj.width,aj.height);L(aj).unbind().removeAttr("class").removeAttr("style");L(aj).css({left:"",top:"",position:""});aj.width=0;aj.height=0;L.jqplot.CanvasManager.free[ai]=true}}};L.jqplot.log=function(){if(window.console){window.console.log.apply(window.console,arguments)}};L.jqplot.config={addDomReference:false,enablePlugins:false,defaultHeight:300,defaultWidth:400,UTCAdjust:false,timezoneOffset:new Date(new Date().getTimezoneOffset()*60000),errorMessage:"",errorBackground:"",errorBorder:"",errorFontFamily:"",errorFontSize:"",errorFontStyle:"",errorFontWeight:"",catchErrors:false,defaultTickFormatString:"%.1f",defaultColors:["#4bb2c5","#EAA228","#c5b47f","#579575","#839557","#958c12","#953579","#4b5de4","#d8b83f","#ff5800","#0085cc","#c747a3","#cddf54","#FBD178","#26B4E3","#bd70c7"],defaultNegativeColors:["#498991","#C08840","#9F9274","#546D61","#646C4A","#6F6621","#6E3F5F","#4F64B0","#A89050","#C45923","#187399","#945381","#959E5C","#C7AF7B","#478396","#907294"],dashLength:4,gapLength:4,dotGapLength:2.5,srcLocation:"jqplot/src/",pluginLocation:"jqplot/src/plugins/"};L.jqplot.arrayMax=function(ah){return Math.max.apply(Math,ah)};L.jqplot.arrayMin=function(ah){return Math.min.apply(Math,ah)};L.jqplot.enablePlugins=L.jqplot.config.enablePlugins;L.jqplot.support_canvas=function(){if(typeof L.jqplot.support_canvas.result=="undefined"){L.jqplot.support_canvas.result=!!document.createElement("canvas").getContext}return L.jqplot.support_canvas.result};L.jqplot.support_canvas_text=function(){if(typeof L.jqplot.support_canvas_text.result=="undefined"){if(window.G_vmlCanvasManager!==u&&window.G_vmlCanvasManager._version>887){L.jqplot.support_canvas_text.result=true}else{L.jqplot.support_canvas_text.result=!!(document.createElement("canvas").getContext&&typeof document.createElement("canvas").getContext("2d").fillText=="function")}}return L.jqplot.support_canvas_text.result};L.jqplot.use_excanvas=((!L.support.boxModel||!L.support.objectAll||!$support.leadingWhitespace)&&!L.jqplot.support_canvas())?true:false;L.jqplot.preInitHooks=[];L.jqplot.postInitHooks=[];L.jqplot.preParseOptionsHooks=[];L.jqplot.postParseOptionsHooks=[];L.jqplot.preDrawHooks=[];L.jqplot.postDrawHooks=[];L.jqplot.preDrawSeriesHooks=[];L.jqplot.postDrawSeriesHooks=[];L.jqplot.preDrawLegendHooks=[];L.jqplot.addLegendRowHooks=[];L.jqplot.preSeriesInitHooks=[];L.jqplot.postSeriesInitHooks=[];L.jqplot.preParseSeriesOptionsHooks=[];L.jqplot.postParseSeriesOptionsHooks=[];L.jqplot.eventListenerHooks=[];L.jqplot.preDrawSeriesShadowHooks=[];L.jqplot.postDrawSeriesShadowHooks=[];L.jqplot.ElemContainer=function(){this._elem;this._plotWidth;this._plotHeight;this._plotDimensions={height:null,width:null}};L.jqplot.ElemContainer.prototype.createElement=function(ak,am,ai,aj,an){this._offsets=am;var ah=ai||"jqplot";var al=document.createElement(ak);this._elem=L(al);this._elem.addClass(ah);this._elem.css(aj);this._elem.attr(an);al=null;return this._elem};L.jqplot.ElemContainer.prototype.getWidth=function(){if(this._elem){return this._elem.outerWidth(true)}else{return null}};L.jqplot.ElemContainer.prototype.getHeight=function(){if(this._elem){return this._elem.outerHeight(true)}else{return null}};L.jqplot.ElemContainer.prototype.getPosition=function(){if(this._elem){return this._elem.position()}else{return{top:null,left:null,bottom:null,right:null}}};L.jqplot.ElemContainer.prototype.getTop=function(){return this.getPosition().top};L.jqplot.ElemContainer.prototype.getLeft=function(){return this.getPosition().left};L.jqplot.ElemContainer.prototype.getBottom=function(){return this._elem.css("bottom")};L.jqplot.ElemContainer.prototype.getRight=function(){return this._elem.css("right")};function w(ah){L.jqplot.ElemContainer.call(this);this.name=ah;this._series=[];this.show=false;this.tickRenderer=L.jqplot.AxisTickRenderer;this.tickOptions={};this.labelRenderer=L.jqplot.AxisLabelRenderer;this.labelOptions={};this.label=null;this.showLabel=true;this.min=null;this.max=null;this.autoscale=false;this.pad=1.2;this.padMax=null;this.padMin=null;this.ticks=[];this.numberTicks;this.tickInterval;this.renderer=L.jqplot.LinearAxisRenderer;this.rendererOptions={};this.showTicks=true;this.showTickMarks=true;this.showMinorTicks=true;this.drawMajorGridlines=true;this.drawMinorGridlines=false;this.drawMajorTickMarks=true;this.drawMinorTickMarks=true;this.useSeriesColor=false;this.borderWidth=null;this.borderColor=null;this.scaleToHiddenSeries=false;this._dataBounds={min:null,max:null};this._intervalStats=[];this._offsets={min:null,max:null};this._ticks=[];this._label=null;this.syncTicks=null;this.tickSpacing=75;this._min=null;this._max=null;this._tickInterval=null;this._numberTicks=null;this.__ticks=null;this._options={}}w.prototype=new L.jqplot.ElemContainer();w.prototype.constructor=w;w.prototype.init=function(){if(L.isFunction(this.renderer)){this.renderer=new this.renderer()}this.tickOptions.axis=this.name;if(this.tickOptions.showMark==null){this.tickOptions.showMark=this.showTicks}if(this.tickOptions.showMark==null){this.tickOptions.showMark=this.showTickMarks}if(this.tickOptions.showLabel==null){this.tickOptions.showLabel=this.showTicks}if(this.label==null||this.label==""){this.showLabel=false}else{this.labelOptions.label=this.label}if(this.showLabel==false){this.labelOptions.show=false}if(this.pad==0){this.pad=1}if(this.padMax==0){this.padMax=1}if(this.padMin==0){this.padMin=1}if(this.padMax==null){this.padMax=(this.pad-1)/2+1}if(this.padMin==null){this.padMin=(this.pad-1)/2+1}this.pad=this.padMax+this.padMin-1;if(this.min!=null||this.max!=null){this.autoscale=false}if(this.syncTicks==null&&this.name.indexOf("y")>-1){this.syncTicks=true}else{if(this.syncTicks==null){this.syncTicks=false}}this.renderer.init.call(this,this.rendererOptions)};w.prototype.draw=function(ah,ai){if(this.__ticks){this.__ticks=null}return this.renderer.draw.call(this,ah,ai)};w.prototype.set=function(){this.renderer.set.call(this)};w.prototype.pack=function(ai,ah){if(this.show){this.renderer.pack.call(this,ai,ah)}if(this._min==null){this._min=this.min;this._max=this.max;this._tickInterval=this.tickInterval;this._numberTicks=this.numberTicks;this.__ticks=this._ticks}};w.prototype.reset=function(){this.renderer.reset.call(this)};w.prototype.resetScale=function(ah){L.extend(true,this,{min:null,max:null,numberTicks:null,tickInterval:null,_ticks:[],ticks:[]},ah);this.resetDataBounds()};w.prototype.resetDataBounds=function(){var ao=this._dataBounds;ao.min=null;ao.max=null;var ai,ap,am;var aj=(this.show)?true:false;for(var al=0;al<this._series.length;al++){ap=this._series[al];if(ap.show||this.scaleToHiddenSeries){am=ap._plotData;if(ap._type==="line"&&ap.renderer.bands.show&&this.name.charAt(0)!=="x"){am=[[0,ap.renderer.bands._min],[1,ap.renderer.bands._max]]}var ah=1,an=1;if(ap._type!=null&&ap._type=="ohlc"){ah=3;an=2}for(var ak=0,ai=am.length;ak<ai;ak++){if(this.name=="xaxis"||this.name=="x2axis"){if((am[ak][0]!=null&&am[ak][0]<ao.min)||ao.min==null){ao.min=am[ak][0]}if((am[ak][0]!=null&&am[ak][0]>ao.max)||ao.max==null){ao.max=am[ak][0]}}else{if((am[ak][ah]!=null&&am[ak][ah]<ao.min)||ao.min==null){ao.min=am[ak][ah]}if((am[ak][an]!=null&&am[ak][an]>ao.max)||ao.max==null){ao.max=am[ak][an]}}}if(aj&&ap.renderer.constructor!==L.jqplot.BarRenderer){aj=false}else{if(aj&&this._options.hasOwnProperty("forceTickAt0")&&this._options.forceTickAt0==false){aj=false}else{if(aj&&ap.renderer.constructor===L.jqplot.BarRenderer){if(ap.barDirection=="vertical"&&this.name!="xaxis"&&this.name!="x2axis"){if(this._options.pad!=null||this._options.padMin!=null){aj=false}}else{if(ap.barDirection=="horizontal"&&(this.name=="xaxis"||this.name=="x2axis")){if(this._options.pad!=null||this._options.padMin!=null){aj=false}}}}}}}}if(aj&&this.renderer.constructor===L.jqplot.LinearAxisRenderer&&ao.min>=0){this.padMin=1;this.forceTickAt0=true}};function q(ah){L.jqplot.ElemContainer.call(this);this.show=false;this.location="ne";this.labels=[];this.showLabels=true;this.showSwatches=true;this.placement="insideGrid";this.xoffset=0;this.yoffset=0;this.border;this.background;this.textColor;this.fontFamily;this.fontSize;this.rowSpacing="0.5em";this.renderer=L.jqplot.TableLegendRenderer;this.rendererOptions={};this.preDraw=false;this.marginTop=null;this.marginRight=null;this.marginBottom=null;this.marginLeft=null;this.escapeHtml=false;this._series=[];L.extend(true,this,ah)}q.prototype=new L.jqplot.ElemContainer();q.prototype.constructor=q;q.prototype.setOptions=function(ah){L.extend(true,this,ah);if(this.placement=="inside"){this.placement="insideGrid"}if(this.xoffset>0){if(this.placement=="insideGrid"){switch(this.location){case"nw":case"w":case"sw":if(this.marginLeft==null){this.marginLeft=this.xoffset+"px"}this.marginRight="0px";break;case"ne":case"e":case"se":default:if(this.marginRight==null){this.marginRight=this.xoffset+"px"}this.marginLeft="0px";break}}else{if(this.placement=="outside"){switch(this.location){case"nw":case"w":case"sw":if(this.marginRight==null){this.marginRight=this.xoffset+"px"}this.marginLeft="0px";break;case"ne":case"e":case"se":default:if(this.marginLeft==null){this.marginLeft=this.xoffset+"px"}this.marginRight="0px";break}}}this.xoffset=0}if(this.yoffset>0){if(this.placement=="outside"){switch(this.location){case"sw":case"s":case"se":if(this.marginTop==null){this.marginTop=this.yoffset+"px"}this.marginBottom="0px";break;case"ne":case"n":case"nw":default:if(this.marginBottom==null){this.marginBottom=this.yoffset+"px"}this.marginTop="0px";break}}else{if(this.placement=="insideGrid"){switch(this.location){case"sw":case"s":case"se":if(this.marginBottom==null){this.marginBottom=this.yoffset+"px"}this.marginTop="0px";break;case"ne":case"n":case"nw":default:if(this.marginTop==null){this.marginTop=this.yoffset+"px"}this.marginBottom="0px";break}}}this.yoffset=0}};q.prototype.init=function(){if(L.isFunction(this.renderer)){this.renderer=new this.renderer()}this.renderer.init.call(this,this.rendererOptions)};q.prototype.draw=function(ai,aj){for(var ah=0;ah<L.jqplot.preDrawLegendHooks.length;ah++){L.jqplot.preDrawLegendHooks[ah].call(this,ai)}return this.renderer.draw.call(this,ai,aj)};q.prototype.pack=function(ah){this.renderer.pack.call(this,ah)};function y(ah){L.jqplot.ElemContainer.call(this);this.text=ah;this.show=true;this.fontFamily;this.fontSize;this.textAlign;this.textColor;this.renderer=L.jqplot.DivTitleRenderer;this.rendererOptions={};this.escapeHtml=false}y.prototype=new L.jqplot.ElemContainer();y.prototype.constructor=y;y.prototype.init=function(){if(L.isFunction(this.renderer)){this.renderer=new this.renderer()}this.renderer.init.call(this,this.rendererOptions)};y.prototype.draw=function(ah){return this.renderer.draw.call(this,ah)};y.prototype.pack=function(){this.renderer.pack.call(this)};function S(ah){ah=ah||{};L.jqplot.ElemContainer.call(this);this.show=true;this.xaxis="xaxis";this._xaxis;this.yaxis="yaxis";this._yaxis;this.gridBorderWidth=2;this.renderer=L.jqplot.LineRenderer;this.rendererOptions={};this.data=[];this.gridData=[];this.label="";this.showLabel=true;this.color;this.negativeColor;this.lineWidth=2.5;this.lineJoin="round";this.lineCap="round";this.linePattern="solid";this.shadow=true;this.shadowAngle=45;this.shadowOffset=1.25;this.shadowDepth=3;this.shadowAlpha="0.1";this.breakOnNull=false;this.markerRenderer=L.jqplot.MarkerRenderer;this.markerOptions={};this.showLine=true;this.showMarker=true;this.index;this.fill=false;this.fillColor;this.fillAlpha;this.fillAndStroke=false;this.disableStack=false;this._stack=false;this.neighborThreshold=4;this.fillToZero=false;this.fillToValue=0;this.fillAxis="y";this.useNegativeColors=true;this._stackData=[];this._plotData=[];this._plotValues={x:[],y:[]};this._intervals={x:{},y:{}};this._prevPlotData=[];this._prevGridData=[];this._stackAxis="y";this._primaryAxis="_xaxis";this.canvas=new L.jqplot.GenericCanvas();this.shadowCanvas=new L.jqplot.GenericCanvas();this.plugins={};this._sumy=0;this._sumx=0;this._type=""}S.prototype=new L.jqplot.ElemContainer();S.prototype.constructor=S;S.prototype.init=function(ak,ao,am){this.index=ak;this.gridBorderWidth=ao;var an=this.data;var aj=[],al,ah;for(al=0,ah=an.length;al<ah;al++){if(!this.breakOnNull){if(an[al]==null||an[al][0]==null||an[al][1]==null){continue}else{aj.push(an[al])}}else{aj.push(an[al])}}this.data=aj;if(!this.color){this.color=am.colorGenerator.get(this.index)}if(!this.negativeColor){this.negativeColor=am.negativeColorGenerator.get(this.index)}if(!this.fillColor){this.fillColor=this.color}if(this.fillAlpha){var ai=L.jqplot.normalize2rgb(this.fillColor);var ai=L.jqplot.getColorComponents(ai);this.fillColor="rgba("+ai[0]+","+ai[1]+","+ai[2]+","+this.fillAlpha+")"}if(L.isFunction(this.renderer)){this.renderer=new this.renderer()}this.renderer.init.call(this,this.rendererOptions,am);this.markerRenderer=new this.markerRenderer();if(!this.markerOptions.color){this.markerOptions.color=this.color}if(this.markerOptions.show==null){this.markerOptions.show=this.showMarker}this.showMarker=this.markerOptions.show;this.markerRenderer.init(this.markerOptions)};S.prototype.draw=function(an,ak,am){var ai=(ak==u)?{}:ak;an=(an==u)?this.canvas._ctx:an;var ah,al,aj;for(ah=0;ah<L.jqplot.preDrawSeriesHooks.length;ah++){L.jqplot.preDrawSeriesHooks[ah].call(this,an,ai)}if(this.show){this.renderer.setGridData.call(this,am);if(!ai.preventJqPlotSeriesDrawTrigger){L(an.canvas).trigger("jqplotSeriesDraw",[this.data,this.gridData])}al=[];if(ai.data){al=ai.data}else{if(!this._stack){al=this.data}else{al=this._plotData}}aj=ai.gridData||this.renderer.makeGridData.call(this,al,am);if(this._type==="line"&&this.renderer.smooth&&this.renderer._smoothedData.length){aj=this.renderer._smoothedData}this.renderer.draw.call(this,an,aj,ai,am)}for(ah=0;ah<L.jqplot.postDrawSeriesHooks.length;ah++){L.jqplot.postDrawSeriesHooks[ah].call(this,an,ai,am)}an=ak=am=ah=al=aj=null};S.prototype.drawShadow=function(an,ak,am){var ai=(ak==u)?{}:ak;an=(an==u)?this.shadowCanvas._ctx:an;var ah,al,aj;for(ah=0;ah<L.jqplot.preDrawSeriesShadowHooks.length;ah++){L.jqplot.preDrawSeriesShadowHooks[ah].call(this,an,ai)}if(this.shadow){this.renderer.setGridData.call(this,am);al=[];if(ai.data){al=ai.data}else{if(!this._stack){al=this.data}else{al=this._plotData}}aj=ai.gridData||this.renderer.makeGridData.call(this,al,am);this.renderer.drawShadow.call(this,an,aj,ai,am)}for(ah=0;ah<L.jqplot.postDrawSeriesShadowHooks.length;ah++){L.jqplot.postDrawSeriesShadowHooks[ah].call(this,an,ai)}an=ak=am=ah=al=aj=null};S.prototype.toggleDisplay=function(ai,ak){var ah,aj;if(ai.data.series){ah=ai.data.series}else{ah=this}if(ai.data.speed){aj=ai.data.speed}if(aj){if(ah.canvas._elem.is(":hidden")||!ah.show){ah.show=true;ah.canvas._elem.removeClass("jqplot-series-hidden");if(ah.shadowCanvas._elem){ah.shadowCanvas._elem.fadeIn(aj)}ah.canvas._elem.fadeIn(aj,ak);ah.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+ah.index).fadeIn(aj)}else{ah.show=false;ah.canvas._elem.addClass("jqplot-series-hidden");if(ah.shadowCanvas._elem){ah.shadowCanvas._elem.fadeOut(aj)}ah.canvas._elem.fadeOut(aj,ak);ah.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+ah.index).fadeOut(aj)}}else{if(ah.canvas._elem.is(":hidden")||!ah.show){ah.show=true;ah.canvas._elem.removeClass("jqplot-series-hidden");if(ah.shadowCanvas._elem){ah.shadowCanvas._elem.show()}ah.canvas._elem.show(0,ak);ah.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+ah.index).show()}else{ah.show=false;ah.canvas._elem.addClass("jqplot-series-hidden");if(ah.shadowCanvas._elem){ah.shadowCanvas._elem.hide()}ah.canvas._elem.hide(0,ak);ah.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-"+ah.index).hide()}}};function M(){L.jqplot.ElemContainer.call(this);this.drawGridlines=true;this.gridLineColor="#cccccc";this.gridLineWidth=1;this.background="#fffdf6";this.borderColor="#999999";this.borderWidth=2;this.drawBorder=true;this.shadow=true;this.shadowAngle=45;this.shadowOffset=1.5;this.shadowWidth=3;this.shadowDepth=3;this.shadowColor=null;this.shadowAlpha="0.07";this._left;this._top;this._right;this._bottom;this._width;this._height;this._axes=[];this.renderer=L.jqplot.CanvasGridRenderer;this.rendererOptions={};this._offsets={top:null,bottom:null,left:null,right:null}}M.prototype=new L.jqplot.ElemContainer();M.prototype.constructor=M;M.prototype.init=function(){if(L.isFunction(this.renderer)){this.renderer=new this.renderer()}this.renderer.init.call(this,this.rendererOptions)};M.prototype.createElement=function(ah,ai){this._offsets=ah;return this.renderer.createElement.call(this,ai)};M.prototype.draw=function(){this.renderer.draw.call(this)};L.jqplot.GenericCanvas=function(){L.jqplot.ElemContainer.call(this);this._ctx};L.jqplot.GenericCanvas.prototype=new L.jqplot.ElemContainer();L.jqplot.GenericCanvas.prototype.constructor=L.jqplot.GenericCanvas;L.jqplot.GenericCanvas.prototype.createElement=function(al,aj,ai,am){this._offsets=al;var ah="jqplot";if(aj!=u){ah=aj}var ak;ak=am.canvasManager.getCanvas();if(ai!=null){this._plotDimensions=ai}ak.width=this._plotDimensions.width-this._offsets.left-this._offsets.right;ak.height=this._plotDimensions.height-this._offsets.top-this._offsets.bottom;this._elem=L(ak);this._elem.css({position:"absolute",left:this._offsets.left,top:this._offsets.top});this._elem.addClass(ah);ak=am.canvasManager.initCanvas(ak);ak=null;return this._elem};L.jqplot.GenericCanvas.prototype.setContext=function(){this._ctx=this._elem.get(0).getContext("2d");return this._ctx};L.jqplot.GenericCanvas.prototype.resetCanvas=function(){if(this._elem){if(L.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==u){window.G_vmlCanvasManager.uninitElement(this._elem.get(0))}this._elem.emptyForce()}this._ctx=null};L.jqplot.HooksManager=function(){this.hooks=[];this.args=[]};L.jqplot.HooksManager.prototype.addOnce=function(ak,ai){ai=ai||[];var al=false;for(var aj=0,ah=this.hooks.length;aj<ah;aj++){if(this.hooks[aj]==ak){al=true}}if(!al){this.hooks.push(ak);this.args.push(ai)}};L.jqplot.HooksManager.prototype.add=function(ai,ah){ah=ah||[];this.hooks.push(ai);this.args.push(ah)};L.jqplot.EventListenerManager=function(){this.hooks=[]};L.jqplot.EventListenerManager.prototype.addOnce=function(al,ak){var am=false,aj,ai;for(var ai=0,ah=this.hooks.length;ai<ah;ai++){aj=this.hooks[ai];if(aj[0]==al&&aj[1]==ak){am=true}}if(!am){this.hooks.push([al,ak])}};L.jqplot.EventListenerManager.prototype.add=function(ai,ah){this.hooks.push([ai,ah])};var U=["yMidAxis","xaxis","yaxis","x2axis","y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis"];function R(){this.animate=false;this.animateReplot=false;this.axes={xaxis:new w("xaxis"),yaxis:new w("yaxis"),x2axis:new w("x2axis"),y2axis:new w("y2axis"),y3axis:new w("y3axis"),y4axis:new w("y4axis"),y5axis:new w("y5axis"),y6axis:new w("y6axis"),y7axis:new w("y7axis"),y8axis:new w("y8axis"),y9axis:new w("y9axis"),yMidAxis:new w("yMidAxis")};this.baseCanvas=new L.jqplot.GenericCanvas();this.captureRightClick=false;this.data=[];this.dataRenderer;this.dataRendererOptions;this.defaults={axesDefaults:{},axes:{xaxis:{},yaxis:{},x2axis:{},y2axis:{},y3axis:{},y4axis:{},y5axis:{},y6axis:{},y7axis:{},y8axis:{},y9axis:{},yMidAxis:{}},seriesDefaults:{},series:[]};this.defaultAxisStart=1;this.drawIfHidden=false;this.eventCanvas=new L.jqplot.GenericCanvas();this.fillBetween={series1:null,series2:null,color:null,baseSeries:0,fill:true};this.fontFamily;this.fontSize;this.grid=new M();this.legend=new q();this.noDataIndicator={show:false,indicator:"Loading Data...",axes:{xaxis:{min:0,max:10,tickInterval:2,show:true},yaxis:{min:0,max:12,tickInterval:3,show:true}}};this.negativeSeriesColors=L.jqplot.config.defaultNegativeColors;this.options={};this.previousSeriesStack=[];this.plugins={};this.series=[];this.seriesStack=[];this.seriesColors=L.jqplot.config.defaultColors;this.sortData=true;this.stackSeries=false;this.syncXTicks=true;this.syncYTicks=true;this.target=null;this.targetId=null;this.textColor;this.title=new y();this._drawCount=0;this._sumy=0;this._sumx=0;this._stackData=[];this._plotData=[];this._width=null;this._height=null;this._plotDimensions={height:null,width:null};this._gridPadding={top:null,right:null,bottom:null,left:null};this._defaultGridPadding={top:10,right:10,bottom:23,left:10};this._addDomReference=L.jqplot.config.addDomReference;this.preInitHooks=new L.jqplot.HooksManager();this.postInitHooks=new L.jqplot.HooksManager();this.preParseOptionsHooks=new L.jqplot.HooksManager();this.postParseOptionsHooks=new L.jqplot.HooksManager();this.preDrawHooks=new L.jqplot.HooksManager();this.postDrawHooks=new L.jqplot.HooksManager();this.preDrawSeriesHooks=new L.jqplot.HooksManager();this.postDrawSeriesHooks=new L.jqplot.HooksManager();this.preDrawLegendHooks=new L.jqplot.HooksManager();this.addLegendRowHooks=new L.jqplot.HooksManager();this.preSeriesInitHooks=new L.jqplot.HooksManager();this.postSeriesInitHooks=new L.jqplot.HooksManager();this.preParseSeriesOptionsHooks=new L.jqplot.HooksManager();this.postParseSeriesOptionsHooks=new L.jqplot.HooksManager();this.eventListenerHooks=new L.jqplot.EventListenerManager();this.preDrawSeriesShadowHooks=new L.jqplot.HooksManager();this.postDrawSeriesShadowHooks=new L.jqplot.HooksManager();this.colorGenerator=new L.jqplot.ColorGenerator();this.negativeColorGenerator=new L.jqplot.ColorGenerator();this.canvasManager=new L.jqplot.CanvasManager();this.themeEngine=new L.jqplot.ThemeEngine();var aj=0;this.init=function(av,ar,ay){ay=ay||{};for(var at=0;at<L.jqplot.preInitHooks.length;at++){L.jqplot.preInitHooks[at].call(this,av,ar,ay)}for(var at=0;at<this.preInitHooks.hooks.length;at++){this.preInitHooks.hooks[at].call(this,av,ar,ay)}this.targetId="#"+av;this.target=L("#"+av);if(this._addDomReference){this.target.data("jqplot",this)}this.target.removeClass("jqplot-error");if(!this.target.get(0)){throw new Error("No plot target specified")}if(this.target.css("position")=="static"){this.target.css("position","relative")}if(!this.target.hasClass("jqplot-target")){this.target.addClass("jqplot-target")}if(!this.target.height()){var au;if(ay&&ay.height){au=parseInt(ay.height,10)}else{if(this.target.attr("data-height")){au=parseInt(this.target.attr("data-height"),10)}else{au=parseInt(L.jqplot.config.defaultHeight,10)}}this._height=au;this.target.css("height",au+"px")}else{this._height=au=this.target.height()}if(!this.target.width()){var aw;if(ay&&ay.width){aw=parseInt(ay.width,10)}else{if(this.target.attr("data-width")){aw=parseInt(this.target.attr("data-width"),10)}else{aw=parseInt(L.jqplot.config.defaultWidth,10)}}this._width=aw;this.target.css("width",aw+"px")}else{this._width=aw=this.target.width()}for(var at=0,ap=U.length;at<ap;at++){this.axes[U[at]]=new w(U[at])}this._plotDimensions.height=this._height;this._plotDimensions.width=this._width;this.grid._plotDimensions=this._plotDimensions;this.title._plotDimensions=this._plotDimensions;this.baseCanvas._plotDimensions=this._plotDimensions;this.eventCanvas._plotDimensions=this._plotDimensions;this.legend._plotDimensions=this._plotDimensions;if(this._height<=0||this._width<=0||!this._height||!this._width){throw new Error("Canvas dimension not set")}if(ay.dataRenderer&&L.isFunction(ay.dataRenderer)){if(ay.dataRendererOptions){this.dataRendererOptions=ay.dataRendererOptions}this.dataRenderer=ay.dataRenderer;ar=this.dataRenderer(ar,this,this.dataRendererOptions)}if(ay.noDataIndicator&&L.isPlainObject(ay.noDataIndicator)){L.extend(true,this.noDataIndicator,ay.noDataIndicator)}if(ar==null||L.isArray(ar)==false||ar.length==0||L.isArray(ar[0])==false||ar[0].length==0){if(this.noDataIndicator.show==false){throw new Error("No data specified")}else{for(var al in this.noDataIndicator.axes){for(var an in this.noDataIndicator.axes[al]){this.axes[al][an]=this.noDataIndicator.axes[al][an]}}this.postDrawHooks.add(function(){var aD=this.eventCanvas.getHeight();var aA=this.eventCanvas.getWidth();var az=L('<div class="jqplot-noData-container" style="position:absolute;"></div>');this.target.append(az);az.height(aD);az.width(aA);az.css("top",this.eventCanvas._offsets.top);az.css("left",this.eventCanvas._offsets.left);var aC=L('<div class="jqplot-noData-contents" style="text-align:center; position:relative; margin-left:auto; margin-right:auto;"></div>');az.append(aC);aC.html(this.noDataIndicator.indicator);var aB=aC.height();var ax=aC.width();aC.height(aB);aC.width(ax);aC.css("top",(aD-aB)/2+"px")})}}this.data=L.extend(true,[],ar);this.parseOptions(ay);if(this.textColor){this.target.css("color",this.textColor)}if(this.fontFamily){this.target.css("font-family",this.fontFamily)}if(this.fontSize){this.target.css("font-size",this.fontSize)}this.title.init();this.legend.init();this._sumy=0;this._sumx=0;this.computePlotData();for(var at=0;at<this.series.length;at++){this.seriesStack.push(at);this.previousSeriesStack.push(at);this.series[at].shadowCanvas._plotDimensions=this._plotDimensions;this.series[at].canvas._plotDimensions=this._plotDimensions;for(var aq=0;aq<L.jqplot.preSeriesInitHooks.length;aq++){L.jqplot.preSeriesInitHooks[aq].call(this.series[at],av,this.data,this.options.seriesDefaults,this.options.series[at],this)}for(var aq=0;aq<this.preSeriesInitHooks.hooks.length;aq++){this.preSeriesInitHooks.hooks[aq].call(this.series[at],av,this.data,this.options.seriesDefaults,this.options.series[at],this)}this.series[at]._plotDimensions=this._plotDimensions;this.series[at].init(at,this.grid.borderWidth,this);for(var aq=0;aq<L.jqplot.postSeriesInitHooks.length;aq++){L.jqplot.postSeriesInitHooks[aq].call(this.series[at],av,this.data,this.options.seriesDefaults,this.options.series[at],this)}for(var aq=0;aq<this.postSeriesInitHooks.hooks.length;aq++){this.postSeriesInitHooks.hooks[aq].call(this.series[at],av,this.data,this.options.seriesDefaults,this.options.series[at],this)}this._sumy+=this.series[at]._sumy;this._sumx+=this.series[at]._sumx}var am,ao;for(var at=0,ap=U.length;at<ap;at++){am=U[at];ao=this.axes[am];ao._plotDimensions=this._plotDimensions;ao.init();if(this.axes[am].borderColor==null){if(am.charAt(0)!=="x"&&ao.useSeriesColor===true&&ao.show){ao.borderColor=ao._series[0].color}else{ao.borderColor=this.grid.borderColor}}}if(this.sortData){ah(this.series)}this.grid.init();this.grid._axes=this.axes;this.legend._series=this.series;for(var at=0;at<L.jqplot.postInitHooks.length;at++){L.jqplot.postInitHooks[at].call(this,av,this.data,ay)}for(var at=0;at<this.postInitHooks.hooks.length;at++){this.postInitHooks.hooks[at].call(this,av,this.data,ay)}};this.resetAxesScale=function(aq,am){var ao=am||{};var ap=aq||this.axes;if(ap===true){ap=this.axes}if(L.isArray(ap)){for(var an=0;an<ap.length;an++){this.axes[ap[an]].resetScale(ao[ap[an]])}}else{if(typeof(ap)==="object"){for(var al in ap){this.axes[al].resetScale(ao[al])}}}};this.reInitialize=function(au,al){var ay=L.extend(true,{},this.options,al);var aw=this.targetId.substr(1);var ar=(au==null)?this.data:au;for(var av=0;av<L.jqplot.preInitHooks.length;av++){L.jqplot.preInitHooks[av].call(this,aw,ar,ay)}for(var av=0;av<this.preInitHooks.hooks.length;av++){this.preInitHooks.hooks[av].call(this,aw,ar,ay)}this._height=this.target.height();this._width=this.target.width();if(this._height<=0||this._width<=0||!this._height||!this._width){throw new Error("Target dimension not set")}this._plotDimensions.height=this._height;this._plotDimensions.width=this._width;this.grid._plotDimensions=this._plotDimensions;this.title._plotDimensions=this._plotDimensions;this.baseCanvas._plotDimensions=this._plotDimensions;this.eventCanvas._plotDimensions=this._plotDimensions;this.legend._plotDimensions=this._plotDimensions;var am,ax,at,ao;for(var av=0,aq=U.length;av<aq;av++){am=U[av];ao=this.axes[am];ax=ao._ticks;for(var at=0,ap=ax.length;at<ap;at++){var an=ax[at]._elem;if(an){if(L.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==u){window.G_vmlCanvasManager.uninitElement(an.get(0))}an.emptyForce();an=null;ax._elem=null}}ax=null;delete ao.ticks;delete ao._ticks;this.axes[am]=new w(am);this.axes[am]._plotWidth=this._width;this.axes[am]._plotHeight=this._height}if(au){if(ay.dataRenderer&&L.isFunction(ay.dataRenderer)){if(ay.dataRendererOptions){this.dataRendererOptions=ay.dataRendererOptions}this.dataRenderer=ay.dataRenderer;au=this.dataRenderer(au,this,this.dataRendererOptions)}this.data=L.extend(true,[],au)}if(al){this.parseOptions(ay)}this.title._plotWidth=this._width;if(this.textColor){this.target.css("color",this.textColor)}if(this.fontFamily){this.target.css("font-family",this.fontFamily)}if(this.fontSize){this.target.css("font-size",this.fontSize)}this.title.init();this.legend.init();this._sumy=0;this._sumx=0;this.seriesStack=[];this.previousSeriesStack=[];this.computePlotData();for(var av=0,aq=this.series.length;av<aq;av++){this.seriesStack.push(av);this.previousSeriesStack.push(av);this.series[av].shadowCanvas._plotDimensions=this._plotDimensions;this.series[av].canvas._plotDimensions=this._plotDimensions;for(var at=0;at<L.jqplot.preSeriesInitHooks.length;at++){L.jqplot.preSeriesInitHooks[at].call(this.series[av],aw,this.data,this.options.seriesDefaults,this.options.series[av],this)}for(var at=0;at<this.preSeriesInitHooks.hooks.length;at++){this.preSeriesInitHooks.hooks[at].call(this.series[av],aw,this.data,this.options.seriesDefaults,this.options.series[av],this)}this.series[av]._plotDimensions=this._plotDimensions;this.series[av].init(av,this.grid.borderWidth,this);for(var at=0;at<L.jqplot.postSeriesInitHooks.length;at++){L.jqplot.postSeriesInitHooks[at].call(this.series[av],aw,this.data,this.options.seriesDefaults,this.options.series[av],this)}for(var at=0;at<this.postSeriesInitHooks.hooks.length;at++){this.postSeriesInitHooks.hooks[at].call(this.series[av],aw,this.data,this.options.seriesDefaults,this.options.series[av],this)}this._sumy+=this.series[av]._sumy;this._sumx+=this.series[av]._sumx}for(var av=0,aq=U.length;av<aq;av++){am=U[av];ao=this.axes[am];ao._plotDimensions=this._plotDimensions;ao.init();if(ao.borderColor==null){if(am.charAt(0)!=="x"&&ao.useSeriesColor===true&&ao.show){ao.borderColor=ao._series[0].color}else{ao.borderColor=this.grid.borderColor}}}if(this.sortData){ah(this.series)}this.grid.init();this.grid._axes=this.axes;this.legend._series=this.series;for(var av=0,aq=L.jqplot.postInitHooks.length;av<aq;av++){L.jqplot.postInitHooks[av].call(this,aw,this.data,ay)}for(var av=0,aq=this.postInitHooks.hooks.length;av<aq;av++){this.postInitHooks.hooks[av].call(this,aw,this.data,ay)}};this.quickInit=function(){this._height=this.target.height();this._width=this.target.width();if(this._height<=0||this._width<=0||!this._height||!this._width){throw new Error("Target dimension not set")}this._plotDimensions.height=this._height;this._plotDimensions.width=this._width;this.grid._plotDimensions=this._plotDimensions;this.title._plotDimensions=this._plotDimensions;this.baseCanvas._plotDimensions=this._plotDimensions;this.eventCanvas._plotDimensions=this._plotDimensions;this.legend._plotDimensions=this._plotDimensions;for(var aq in this.axes){this.axes[aq]._plotWidth=this._width;this.axes[aq]._plotHeight=this._height}this.title._plotWidth=this._width;if(this.textColor){this.target.css("color",this.textColor)}if(this.fontFamily){this.target.css("font-family",this.fontFamily)}if(this.fontSize){this.target.css("font-size",this.fontSize)}this._sumy=0;this._sumx=0;this.computePlotData();for(var ao=0;ao<this.series.length;ao++){if(this.series[ao]._type==="line"&&this.series[ao].renderer.bands.show){this.series[ao].renderer.initBands.call(this.series[ao],this.series[ao].renderer.options,this)}this.series[ao]._plotDimensions=this._plotDimensions;this.series[ao].canvas._plotDimensions=this._plotDimensions;this._sumy+=this.series[ao]._sumy;this._sumx+=this.series[ao]._sumx}var am;for(var al=0;al<12;al++){am=U[al];var an=this.axes[am]._ticks;for(var ao=0;ao<an.length;ao++){var ap=an[ao]._elem;if(ap){if(L.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==u){window.G_vmlCanvasManager.uninitElement(ap.get(0))}ap.emptyForce();ap=null;an._elem=null}}an=null;this.axes[am]._plotDimensions=this._plotDimensions;this.axes[am]._ticks=[]}if(this.sortData){ah(this.series)}this.grid._axes=this.axes;this.legend._series=this.series};function ah(ap){var au,av,aw,al,at;for(var aq=0;aq<ap.length;aq++){var am;var ar=[ap[aq].data,ap[aq]._stackData,ap[aq]._plotData,ap[aq]._prevPlotData];for(var an=0;an<4;an++){am=true;au=ar[an];if(ap[aq]._stackAxis=="x"){for(var ao=0;ao<au.length;ao++){if(typeof(au[ao][1])!="number"){am=false;break}}if(am){au.sort(function(ay,ax){return ay[1]-ax[1]})}}else{for(var ao=0;ao<au.length;ao++){if(typeof(au[ao][0])!="number"){am=false;break}}if(am){au.sort(function(ay,ax){return ay[0]-ax[0]})}}}}}this.computePlotData=function(){this._plotData=[];this._stackData=[];var at,au,ao;for(au=0,ao=this.series.length;au<ao;au++){at=this.series[au];this._plotData.push([]);this._stackData.push([]);var am=at.data;this._plotData[au]=L.extend(true,[],am);this._stackData[au]=L.extend(true,[],am);at._plotData=this._plotData[au];at._stackData=this._stackData[au];var ax={x:[],y:[]};if(this.stackSeries&&!at.disableStack){at._stack=true;var av=(at._stackAxis==="x")?0:1;for(var ap=0,al=am.length;ap<al;ap++){var aw=am[ap][av];if(aw==null){aw=0}this._plotData[au][ap][av]=aw;this._stackData[au][ap][av]=aw;if(au>0){for(var aq=au;aq--;){var an=this._plotData[aq][ap][av];if(aw*an>=0){this._plotData[au][ap][av]+=an;this._stackData[au][ap][av]+=an;break}}}}}else{for(var ar=0;ar<at.data.length;ar++){ax.x.push(at.data[ar][0]);ax.y.push(at.data[ar][1])}this._stackData.push(at.data);this.series[au]._stackData=at.data;this._plotData.push(at.data);at._plotData=at.data;at._plotValues=ax}if(au>0){at._prevPlotData=this.series[au-1]._plotData}at._sumy=0;at._sumx=0;for(ar=at.data.length-1;ar>-1;ar--){at._sumy+=at.data[ar][1];at._sumx+=at.data[ar][0]}}};this.populatePlotData=function(au,av){this._plotData=[];this._stackData=[];au._stackData=[];au._plotData=[];var ay={x:[],y:[]};if(this.stackSeries&&!au.disableStack){au._stack=true;var ax=(au._stackAxis==="x")?0:1;var az=L.extend(true,[],au.data);var aA=L.extend(true,[],au.data);var an,am,ao,aw,al;for(var ar=0;ar<av;ar++){var ap=this.series[ar].data;for(var aq=0;aq<ap.length;aq++){ao=ap[aq];an=(ao[0]!=null)?ao[0]:0;am=(ao[1]!=null)?ao[1]:0;az[aq][0]+=an;az[aq][1]+=am;aw=(ax)?am:an;if(au.data[aq][ax]*aw>=0){aA[aq][ax]+=aw}}}for(var at=0;at<aA.length;at++){ay.x.push(aA[at][0]);ay.y.push(aA[at][1])}this._plotData.push(aA);this._stackData.push(az);au._stackData=az;au._plotData=aA;au._plotValues=ay}else{for(var at=0;at<au.data.length;at++){ay.x.push(au.data[at][0]);ay.y.push(au.data[at][1])}this._stackData.push(au.data);this.series[av]._stackData=au.data;this._plotData.push(au.data);au._plotData=au.data;au._plotValues=ay}if(av>0){au._prevPlotData=this.series[av-1]._plotData}au._sumy=0;au._sumx=0;for(at=au.data.length-1;at>-1;at--){au._sumy+=au.data[at][1];au._sumx+=au.data[at][0]}};this.getNextSeriesColor=(function(am){var al=0;var an=am.seriesColors;return function(){if(al<an.length){return an[al++]}else{al=0;return an[al++]}}})(this);this.parseOptions=function(ay){for(var at=0;at<this.preParseOptionsHooks.hooks.length;at++){this.preParseOptionsHooks.hooks[at].call(this,ay)}for(var at=0;at<L.jqplot.preParseOptionsHooks.length;at++){L.jqplot.preParseOptionsHooks[at].call(this,ay)}this.options=L.extend(true,{},this.defaults,ay);var am=this.options;this.animate=am.animate;this.animateReplot=am.animateReplot;this.stackSeries=am.stackSeries;if(L.isPlainObject(am.fillBetween)){var ax=["series1","series2","color","baseSeries","fill"],au;for(var at=0,aq=ax.length;at<aq;at++){au=ax[at];if(am.fillBetween[au]!=null){this.fillBetween[au]=am.fillBetween[au]}}}if(am.seriesColors){this.seriesColors=am.seriesColors}if(am.negativeSeriesColors){this.negativeSeriesColors=am.negativeSeriesColors}if(am.captureRightClick){this.captureRightClick=am.captureRightClick}this.defaultAxisStart=(ay&&ay.defaultAxisStart!=null)?ay.defaultAxisStart:this.defaultAxisStart;this.colorGenerator.setColors(this.seriesColors);this.negativeColorGenerator.setColors(this.negativeSeriesColors);L.extend(true,this._gridPadding,am.gridPadding);this.sortData=(am.sortData!=null)?am.sortData:this.sortData;for(var at=0;at<12;at++){var an=U[at];var ap=this.axes[an];ap._options=L.extend(true,{},am.axesDefaults,am.axes[an]);L.extend(true,ap,am.axesDefaults,am.axes[an]);ap._plotWidth=this._width;ap._plotHeight=this._height}var aw=function(aD,aB,aE){var aA=[];var aC,az;aB=aB||"vertical";if(!L.isArray(aD[0])){for(aC=0,az=aD.length;aC<az;aC++){if(aB=="vertical"){aA.push([aE+aC,aD[aC]])}else{aA.push([aD[aC],aE+aC])}}}else{L.extend(true,aA,aD)}return aA};var av=0;this.series=[];for(var at=0;at<this.data.length;at++){var al=L.extend(true,{index:at},{seriesColors:this.seriesColors,negativeSeriesColors:this.negativeSeriesColors},this.options.seriesDefaults,this.options.series[at],{rendererOptions:{animation:{show:this.animate}}});var ax=new S(al);for(var ar=0;ar<L.jqplot.preParseSeriesOptionsHooks.length;ar++){L.jqplot.preParseSeriesOptionsHooks[ar].call(ax,this.options.seriesDefaults,this.options.series[at])}for(var ar=0;ar<this.preParseSeriesOptionsHooks.hooks.length;ar++){this.preParseSeriesOptionsHooks.hooks[ar].call(ax,this.options.seriesDefaults,this.options.series[at])}L.extend(true,ax,al);var ao="vertical";if(ax.renderer===L.jqplot.BarRenderer&&ax.rendererOptions&&ax.rendererOptions.barDirection=="horizontal"){ao="horizontal";ax._stackAxis="x";ax._primaryAxis="_yaxis"}ax.data=aw(this.data[at],ao,this.defaultAxisStart);switch(ax.xaxis){case"xaxis":ax._xaxis=this.axes.xaxis;break;case"x2axis":ax._xaxis=this.axes.x2axis;break;default:break}ax._yaxis=this.axes[ax.yaxis];ax._xaxis._series.push(ax);ax._yaxis._series.push(ax);if(ax.show){ax._xaxis.show=true;ax._yaxis.show=true}else{if(ax._xaxis.scaleToHiddenSeries){ax._xaxis.show=true}if(ax._yaxis.scaleToHiddenSeries){ax._yaxis.show=true}}if(!ax.label){ax.label="Series "+(at+1).toString()}this.series.push(ax);for(var ar=0;ar<L.jqplot.postParseSeriesOptionsHooks.length;ar++){L.jqplot.postParseSeriesOptionsHooks[ar].call(this.series[at],this.options.seriesDefaults,this.options.series[at])}for(var ar=0;ar<this.postParseSeriesOptionsHooks.hooks.length;ar++){this.postParseSeriesOptionsHooks.hooks[ar].call(this.series[at],this.options.seriesDefaults,this.options.series[at])}}L.extend(true,this.grid,this.options.grid);for(var at=0,aq=U.length;at<aq;at++){var an=U[at];var ap=this.axes[an];if(ap.borderWidth==null){ap.borderWidth=this.grid.borderWidth}}if(typeof this.options.title=="string"){this.title.text=this.options.title}else{if(typeof this.options.title=="object"){L.extend(true,this.title,this.options.title)}}this.title._plotWidth=this._width;this.legend.setOptions(this.options.legend);for(var at=0;at<L.jqplot.postParseOptionsHooks.length;at++){L.jqplot.postParseOptionsHooks[at].call(this,ay)}for(var at=0;at<this.postParseOptionsHooks.hooks.length;at++){this.postParseOptionsHooks.hooks[at].call(this,ay)}};this.destroy=function(){this.canvasManager.freeAllCanvases();if(this.eventCanvas&&this.eventCanvas._elem){this.eventCanvas._elem.unbind()}this.target.empty();this.target[0].innerHTML=""};this.replot=function(am){var an=am||{};var ap=an.data||null;var al=(an.clear===false)?false:true;var ao=an.resetAxes||false;delete an.data;delete an.clear;delete an.resetAxes;this.target.trigger("jqplotPreReplot");if(al){this.destroy()}if(ap||!L.isEmptyObject(an)){this.reInitialize(ap,an)}else{this.quickInit()}if(ao){this.resetAxesScale(ao,an.axes)}this.draw();this.target.trigger("jqplotPostReplot")};this.redraw=function(al){al=(al!=null)?al:true;this.target.trigger("jqplotPreRedraw");if(al){this.canvasManager.freeAllCanvases();this.eventCanvas._elem.unbind();this.target.empty()}for(var an in this.axes){this.axes[an]._ticks=[]}this.computePlotData();this._sumy=0;this._sumx=0;for(var am=0,ao=this.series.length;am<ao;am++){this._sumy+=this.series[am]._sumy;this._sumx+=this.series[am]._sumx}this.draw();this.target.trigger("jqplotPostRedraw")};this.draw=function(){if(this.drawIfHidden||this.target.is(":visible")){this.target.trigger("jqplotPreDraw");var aH,aF,aE,ao;for(aH=0,aE=L.jqplot.preDrawHooks.length;aH<aE;aH++){L.jqplot.preDrawHooks[aH].call(this)}for(aH=0,aE=this.preDrawHooks.hooks.length;aH<aE;aH++){this.preDrawHooks.hooks[aH].apply(this,this.preDrawSeriesHooks.args[aH])}this.target.append(this.baseCanvas.createElement({left:0,right:0,top:0,bottom:0},"jqplot-base-canvas",null,this));this.baseCanvas.setContext();this.target.append(this.title.draw());this.title.pack({top:0,left:0});var aL=this.legend.draw({},this);var al={top:0,left:0,bottom:0,right:0};if(this.legend.placement=="outsideGrid"){this.target.append(aL);switch(this.legend.location){case"n":al.top+=this.legend.getHeight();break;case"s":al.bottom+=this.legend.getHeight();break;case"ne":case"e":case"se":al.right+=this.legend.getWidth();break;case"nw":case"w":case"sw":al.left+=this.legend.getWidth();break;default:al.right+=this.legend.getWidth();break}aL=aL.detach()}var ar=this.axes;var aM;for(aH=0;aH<12;aH++){aM=U[aH];this.target.append(ar[aM].draw(this.baseCanvas._ctx,this));ar[aM].set()}if(ar.yaxis.show){al.left+=ar.yaxis.getWidth()}var aG=["y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis"];var az=[0,0,0,0,0,0,0,0];var aC=0;var aB;for(aB=0;aB<8;aB++){if(ar[aG[aB]].show){aC+=ar[aG[aB]].getWidth();az[aB]=aC}}al.right+=aC;if(ar.x2axis.show){al.top+=ar.x2axis.getHeight()}if(this.title.show){al.top+=this.title.getHeight()}if(ar.xaxis.show){al.bottom+=ar.xaxis.getHeight()}if(this.options.gridDimensions&&L.isPlainObject(this.options.gridDimensions)){var at=parseInt(this.options.gridDimensions.width,10)||0;var aI=parseInt(this.options.gridDimensions.height,10)||0;var an=(this._width-al.left-al.right-at)/2;var aK=(this._height-al.top-al.bottom-aI)/2;if(aK>=0&&an>=0){al.top+=aK;al.bottom+=aK;al.left+=an;al.right+=an}}var am=["top","bottom","left","right"];for(var aB in am){if(this._gridPadding[am[aB]]==null&&al[am[aB]]>0){this._gridPadding[am[aB]]=al[am[aB]]}else{if(this._gridPadding[am[aB]]==null){this._gridPadding[am[aB]]=this._defaultGridPadding[am[aB]]}}}var aA=this._gridPadding;if(this.legend.placement==="outsideGrid"){aA={top:this.title.getHeight(),left:0,right:0,bottom:0};if(this.legend.location==="s"){aA.left=this._gridPadding.left;aA.right=this._gridPadding.right}}ar.xaxis.pack({position:"absolute",bottom:this._gridPadding.bottom-ar.xaxis.getHeight(),left:0,width:this._width},{min:this._gridPadding.left,max:this._width-this._gridPadding.right});ar.yaxis.pack({position:"absolute",top:0,left:this._gridPadding.left-ar.yaxis.getWidth(),height:this._height},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top});ar.x2axis.pack({position:"absolute",top:this._gridPadding.top-ar.x2axis.getHeight(),left:0,width:this._width},{min:this._gridPadding.left,max:this._width-this._gridPadding.right});for(aH=8;aH>0;aH--){ar[aG[aH-1]].pack({position:"absolute",top:0,right:this._gridPadding.right-az[aH-1]},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top})}var au=(this._width-this._gridPadding.left-this._gridPadding.right)/2+this._gridPadding.left-ar.yMidAxis.getWidth()/2;ar.yMidAxis.pack({position:"absolute",top:0,left:au,zIndex:9,textAlign:"center"},{min:this._height-this._gridPadding.bottom,max:this._gridPadding.top});this.target.append(this.grid.createElement(this._gridPadding,this));this.grid.draw();var aq=this.series;var aJ=aq.length;for(aH=0,aE=aJ;aH<aE;aH++){aF=this.seriesStack[aH];this.target.append(aq[aF].shadowCanvas.createElement(this._gridPadding,"jqplot-series-shadowCanvas",null,this));aq[aF].shadowCanvas.setContext();aq[aF].shadowCanvas._elem.data("seriesIndex",aF)}for(aH=0,aE=aJ;aH<aE;aH++){aF=this.seriesStack[aH];this.target.append(aq[aF].canvas.createElement(this._gridPadding,"jqplot-series-canvas",null,this));aq[aF].canvas.setContext();aq[aF].canvas._elem.data("seriesIndex",aF)}this.target.append(this.eventCanvas.createElement(this._gridPadding,"jqplot-event-canvas",null,this));this.eventCanvas.setContext();this.eventCanvas._ctx.fillStyle="rgba(0,0,0,0)";this.eventCanvas._ctx.fillRect(0,0,this.eventCanvas._ctx.canvas.width,this.eventCanvas._ctx.canvas.height);this.bindCustomEvents();if(this.legend.preDraw){this.eventCanvas._elem.before(aL);this.legend.pack(aA);if(this.legend._elem){this.drawSeries({legendInfo:{location:this.legend.location,placement:this.legend.placement,width:this.legend.getWidth(),height:this.legend.getHeight(),xoffset:this.legend.xoffset,yoffset:this.legend.yoffset}})}else{this.drawSeries()}}else{this.drawSeries();if(aJ){L(aq[aJ-1].canvas._elem).after(aL)}this.legend.pack(aA)}for(var aH=0,aE=L.jqplot.eventListenerHooks.length;aH<aE;aH++){this.eventCanvas._elem.bind(L.jqplot.eventListenerHooks[aH][0],{plot:this},L.jqplot.eventListenerHooks[aH][1])}for(var aH=0,aE=this.eventListenerHooks.hooks.length;aH<aE;aH++){this.eventCanvas._elem.bind(this.eventListenerHooks.hooks[aH][0],{plot:this},this.eventListenerHooks.hooks[aH][1])}var ay=this.fillBetween;if(ay.fill&&ay.series1!==ay.series2&&ay.series1<aJ&&ay.series2<aJ&&aq[ay.series1]._type==="line"&&aq[ay.series2]._type==="line"){this.doFillBetweenLines()}for(var aH=0,aE=L.jqplot.postDrawHooks.length;aH<aE;aH++){L.jqplot.postDrawHooks[aH].call(this)}for(var aH=0,aE=this.postDrawHooks.hooks.length;aH<aE;aH++){this.postDrawHooks.hooks[aH].apply(this,this.postDrawHooks.args[aH])}if(this.target.is(":visible")){this._drawCount+=1}var av,aw,aD,ap;for(aH=0,aE=aJ;aH<aE;aH++){av=aq[aH];aw=av.renderer;aD=".jqplot-point-label.jqplot-series-"+aH;if(aw.animation&&aw.animation._supported&&aw.animation.show&&(this._drawCount<2||this.animateReplot)){ap=this.target.find(aD);ap.stop(true,true).hide();av.canvas._elem.stop(true,true).hide();av.shadowCanvas._elem.stop(true,true).hide();av.canvas._elem.jqplotEffect("blind",{mode:"show",direction:aw.animation.direction},aw.animation.speed);av.shadowCanvas._elem.jqplotEffect("blind",{mode:"show",direction:aw.animation.direction},aw.animation.speed);ap.fadeIn(aw.animation.speed*0.8)}}ap=null;this.target.trigger("jqplotPostDraw",[this])}};R.prototype.doFillBetweenLines=function(){var an=this.fillBetween;var ax=an.series1;var av=an.series2;var aw=(ax<av)?ax:av;var au=(av>ax)?av:ax;var ar=this.series[aw];var aq=this.series[au];if(aq.renderer.smooth){var ap=aq.renderer._smoothedData.slice(0).reverse()}else{var ap=aq.gridData.slice(0).reverse()}if(ar.renderer.smooth){var at=ar.renderer._smoothedData.concat(ap)}else{var at=ar.gridData.concat(ap)}var ao=(an.color!==null)?an.color:this.series[ax].fillColor;var ay=(an.baseSeries!==null)?an.baseSeries:aw;var am=this.series[ay].renderer.shapeRenderer;var al={fillStyle:ao,fill:true,closePath:true};am.draw(ar.shadowCanvas._ctx,at,al)};this.bindCustomEvents=function(){this.eventCanvas._elem.bind("click",{plot:this},this.onClick);this.eventCanvas._elem.bind("dblclick",{plot:this},this.onDblClick);this.eventCanvas._elem.bind("mousedown",{plot:this},this.onMouseDown);this.eventCanvas._elem.bind("mousemove",{plot:this},this.onMouseMove);this.eventCanvas._elem.bind("mouseenter",{plot:this},this.onMouseEnter);this.eventCanvas._elem.bind("mouseleave",{plot:this},this.onMouseLeave);if(this.captureRightClick){this.eventCanvas._elem.bind("mouseup",{plot:this},this.onRightClick);this.eventCanvas._elem.get(0).oncontextmenu=function(){return false}}else{this.eventCanvas._elem.bind("mouseup",{plot:this},this.onMouseUp)}};function ai(av){var au=av.data.plot;var ap=au.eventCanvas._elem.offset();var at={x:av.pageX-ap.left,y:av.pageY-ap.top};var aq={xaxis:null,yaxis:null,x2axis:null,y2axis:null,y3axis:null,y4axis:null,y5axis:null,y6axis:null,y7axis:null,y8axis:null,y9axis:null,yMidAxis:null};var ar=["xaxis","yaxis","x2axis","y2axis","y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis","yMidAxis"];var al=au.axes;var am,ao;for(am=11;am>0;am--){ao=ar[am-1];if(al[ao].show){aq[ao]=al[ao].series_p2u(at[ao.charAt(0)])}}return{offsets:ap,gridPos:at,dataPos:aq}}function ak(al,am){var aq=am.series;var aW,aU,aT,aO,aP,aJ,aI,aw,au,az,aA,aK;var aS,aX,aQ,ar,aH,aM,aV;var an,aN;for(aT=am.seriesStack.length-1;aT>=0;aT--){aW=am.seriesStack[aT];aO=aq[aW];aV=aO._highlightThreshold;switch(aO.renderer.constructor){case L.jqplot.BarRenderer:aJ=al.x;aI=al.y;for(aU=0;aU<aO._barPoints.length;aU++){aH=aO._barPoints[aU];aQ=aO.gridData[aU];if(aJ>aH[0][0]&&aJ<aH[2][0]&&aI>aH[2][1]&&aI<aH[0][1]){return{seriesIndex:aO.index,pointIndex:aU,gridData:aQ,data:aO.data[aU],points:aO._barPoints[aU]}}}break;case L.jqplot.PyramidRenderer:aJ=al.x;aI=al.y;for(aU=0;aU<aO._barPoints.length;aU++){aH=aO._barPoints[aU];aQ=aO.gridData[aU];if(aJ>aH[0][0]+aV[0][0]&&aJ<aH[2][0]+aV[2][0]&&aI>aH[2][1]&&aI<aH[0][1]){return{seriesIndex:aO.index,pointIndex:aU,gridData:aQ,data:aO.data[aU],points:aO._barPoints[aU]}}}break;case L.jqplot.DonutRenderer:az=aO.startAngle/180*Math.PI;aJ=al.x-aO._center[0];aI=al.y-aO._center[1];aP=Math.sqrt(Math.pow(aJ,2)+Math.pow(aI,2));if(aJ>0&&-aI>=0){aw=2*Math.PI-Math.atan(-aI/aJ)}else{if(aJ>0&&-aI<0){aw=-Math.atan(-aI/aJ)}else{if(aJ<0){aw=Math.PI-Math.atan(-aI/aJ)}else{if(aJ==0&&-aI>0){aw=3*Math.PI/2}else{if(aJ==0&&-aI<0){aw=Math.PI/2}else{if(aJ==0&&aI==0){aw=0}}}}}}if(az){aw-=az;if(aw<0){aw+=2*Math.PI}else{if(aw>2*Math.PI){aw-=2*Math.PI}}}au=aO.sliceMargin/180*Math.PI;if(aP<aO._radius&&aP>aO._innerRadius){for(aU=0;aU<aO.gridData.length;aU++){aA=(aU>0)?aO.gridData[aU-1][1]+au:au;aK=aO.gridData[aU][1];if(aw>aA&&aw<aK){return{seriesIndex:aO.index,pointIndex:aU,gridData:[al.x,al.y],data:aO.data[aU]}}}}break;case L.jqplot.PieRenderer:az=aO.startAngle/180*Math.PI;aJ=al.x-aO._center[0];aI=al.y-aO._center[1];aP=Math.sqrt(Math.pow(aJ,2)+Math.pow(aI,2));if(aJ>0&&-aI>=0){aw=2*Math.PI-Math.atan(-aI/aJ)}else{if(aJ>0&&-aI<0){aw=-Math.atan(-aI/aJ)}else{if(aJ<0){aw=Math.PI-Math.atan(-aI/aJ)}else{if(aJ==0&&-aI>0){aw=3*Math.PI/2}else{if(aJ==0&&-aI<0){aw=Math.PI/2}else{if(aJ==0&&aI==0){aw=0}}}}}}if(az){aw-=az;if(aw<0){aw+=2*Math.PI}else{if(aw>2*Math.PI){aw-=2*Math.PI}}}au=aO.sliceMargin/180*Math.PI;if(aP<aO._radius){for(aU=0;aU<aO.gridData.length;aU++){aA=(aU>0)?aO.gridData[aU-1][1]+au:au;aK=aO.gridData[aU][1];if(aw>aA&&aw<aK){return{seriesIndex:aO.index,pointIndex:aU,gridData:[al.x,al.y],data:aO.data[aU]}}}}break;case L.jqplot.BubbleRenderer:aJ=al.x;aI=al.y;var aF=null;if(aO.show){for(var aU=0;aU<aO.gridData.length;aU++){aQ=aO.gridData[aU];aX=Math.sqrt((aJ-aQ[0])*(aJ-aQ[0])+(aI-aQ[1])*(aI-aQ[1]));if(aX<=aQ[2]&&(aX<=aS||aS==null)){aS=aX;aF={seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}if(aF!=null){return aF}}break;case L.jqplot.FunnelRenderer:aJ=al.x;aI=al.y;var aL=aO._vertices,ap=aL[0],ao=aL[aL.length-1],at,aE,ay;function aR(a0,a2,a1){var aZ=(a2[1]-a1[1])/(a2[0]-a1[0]);var aY=a2[1]-aZ*a2[0];var a3=a0+a2[1];return[(a3-aY)/aZ,a3]}at=aR(aI,ap[0],ao[3]);aE=aR(aI,ap[1],ao[2]);for(aU=0;aU<aL.length;aU++){ay=aL[aU];if(aI>=ay[0][1]&&aI<=ay[3][1]&&aJ>=at[0]&&aJ<=aE[0]){return{seriesIndex:aO.index,pointIndex:aU,gridData:null,data:aO.data[aU]}}}break;case L.jqplot.LineRenderer:aJ=al.x;aI=al.y;aP=aO.renderer;if(aO.show){if((aO.fill||(aO.renderer.bands.show&&aO.renderer.bands.fill))&&(!am.plugins.highlighter||!am.plugins.highlighter.show)){var ax=false;if(aJ>aO._boundingBox[0][0]&&aJ<aO._boundingBox[1][0]&&aI>aO._boundingBox[1][1]&&aI<aO._boundingBox[0][1]){var aD=aO._areaPoints.length;var aG;var aU=aD-1;for(var aG=0;aG<aD;aG++){var aC=[aO._areaPoints[aG][0],aO._areaPoints[aG][1]];var aB=[aO._areaPoints[aU][0],aO._areaPoints[aU][1]];if(aC[1]<aI&&aB[1]>=aI||aB[1]<aI&&aC[1]>=aI){if(aC[0]+(aI-aC[1])/(aB[1]-aC[1])*(aB[0]-aC[0])<aJ){ax=!ax}}aU=aG}}if(ax){return{seriesIndex:aW,pointIndex:null,gridData:aO.gridData,data:aO.data,points:aO._areaPoints}}break}else{aN=aO.markerRenderer.size/2+aO.neighborThreshold;an=(aN>0)?aN:0;for(var aU=0;aU<aO.gridData.length;aU++){aQ=aO.gridData[aU];if(aP.constructor==L.jqplot.OHLCRenderer){if(aP.candleStick){var av=aO._yaxis.series_u2p;if(aJ>=aQ[0]-aP._bodyWidth/2&&aJ<=aQ[0]+aP._bodyWidth/2&&aI>=av(aO.data[aU][2])&&aI<=av(aO.data[aU][3])){return{seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}else{if(!aP.hlc){var av=aO._yaxis.series_u2p;if(aJ>=aQ[0]-aP._tickLength&&aJ<=aQ[0]+aP._tickLength&&aI>=av(aO.data[aU][2])&&aI<=av(aO.data[aU][3])){return{seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}else{var av=aO._yaxis.series_u2p;if(aJ>=aQ[0]-aP._tickLength&&aJ<=aQ[0]+aP._tickLength&&aI>=av(aO.data[aU][1])&&aI<=av(aO.data[aU][2])){return{seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}}}else{if(aQ[0]!=null&&aQ[1]!=null){aX=Math.sqrt((aJ-aQ[0])*(aJ-aQ[0])+(aI-aQ[1])*(aI-aQ[1]));if(aX<=an&&(aX<=aS||aS==null)){aS=aX;return{seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}}}}}break;default:aJ=al.x;aI=al.y;aP=aO.renderer;if(aO.show){aN=aO.markerRenderer.size/2+aO.neighborThreshold;an=(aN>0)?aN:0;for(var aU=0;aU<aO.gridData.length;aU++){aQ=aO.gridData[aU];if(aP.constructor==L.jqplot.OHLCRenderer){if(aP.candleStick){var av=aO._yaxis.series_u2p;if(aJ>=aQ[0]-aP._bodyWidth/2&&aJ<=aQ[0]+aP._bodyWidth/2&&aI>=av(aO.data[aU][2])&&aI<=av(aO.data[aU][3])){return{seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}else{if(!aP.hlc){var av=aO._yaxis.series_u2p;if(aJ>=aQ[0]-aP._tickLength&&aJ<=aQ[0]+aP._tickLength&&aI>=av(aO.data[aU][2])&&aI<=av(aO.data[aU][3])){return{seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}else{var av=aO._yaxis.series_u2p;if(aJ>=aQ[0]-aP._tickLength&&aJ<=aQ[0]+aP._tickLength&&aI>=av(aO.data[aU][1])&&aI<=av(aO.data[aU][2])){return{seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}}}else{aX=Math.sqrt((aJ-aQ[0])*(aJ-aQ[0])+(aI-aQ[1])*(aI-aQ[1]));if(aX<=an&&(aX<=aS||aS==null)){aS=aX;return{seriesIndex:aW,pointIndex:aU,gridData:aQ,data:aO.data[aU]}}}}}break}}return null}this.onClick=function(an){var am=ai(an);var ap=an.data.plot;var ao=ak(am.gridPos,ap);var al=L.Event("jqplotClick");al.pageX=an.pageX;al.pageY=an.pageY;L(this).trigger(al,[am.gridPos,am.dataPos,ao,ap])};this.onDblClick=function(an){var am=ai(an);var ap=an.data.plot;var ao=ak(am.gridPos,ap);var al=L.Event("jqplotDblClick");al.pageX=an.pageX;al.pageY=an.pageY;L(this).trigger(al,[am.gridPos,am.dataPos,ao,ap])};this.onMouseDown=function(an){var am=ai(an);var ap=an.data.plot;var ao=ak(am.gridPos,ap);var al=L.Event("jqplotMouseDown");al.pageX=an.pageX;al.pageY=an.pageY;L(this).trigger(al,[am.gridPos,am.dataPos,ao,ap])};this.onMouseUp=function(an){var am=ai(an);var al=L.Event("jqplotMouseUp");al.pageX=an.pageX;al.pageY=an.pageY;L(this).trigger(al,[am.gridPos,am.dataPos,null,an.data.plot])};this.onRightClick=function(an){var am=ai(an);var ap=an.data.plot;var ao=ak(am.gridPos,ap);if(ap.captureRightClick){if(an.which==3){var al=L.Event("jqplotRightClick");al.pageX=an.pageX;al.pageY=an.pageY;L(this).trigger(al,[am.gridPos,am.dataPos,ao,ap])}else{var al=L.Event("jqplotMouseUp");al.pageX=an.pageX;al.pageY=an.pageY;L(this).trigger(al,[am.gridPos,am.dataPos,ao,ap])}}};this.onMouseMove=function(an){var am=ai(an);var ap=an.data.plot;var ao=ak(am.gridPos,ap);var al=L.Event("jqplotMouseMove");al.pageX=an.pageX;al.pageY=an.pageY;L(this).trigger(al,[am.gridPos,am.dataPos,ao,ap])};this.onMouseEnter=function(an){var am=ai(an);var ao=an.data.plot;var al=L.Event("jqplotMouseEnter");al.pageX=an.pageX;al.pageY=an.pageY;al.relatedTarget=an.relatedTarget;L(this).trigger(al,[am.gridPos,am.dataPos,null,ao])};this.onMouseLeave=function(an){var am=ai(an);var ao=an.data.plot;var al=L.Event("jqplotMouseLeave");al.pageX=an.pageX;al.pageY=an.pageY;al.relatedTarget=an.relatedTarget;L(this).trigger(al,[am.gridPos,am.dataPos,null,ao])};this.drawSeries=function(an,al){var ap,ao,am;al=(typeof(an)==="number"&&al==null)?an:al;an=(typeof(an)==="object")?an:{};if(al!=u){ao=this.series[al];am=ao.shadowCanvas._ctx;am.clearRect(0,0,am.canvas.width,am.canvas.height);ao.drawShadow(am,an,this);am=ao.canvas._ctx;am.clearRect(0,0,am.canvas.width,am.canvas.height);ao.draw(am,an,this);if(ao.renderer.constructor==L.jqplot.BezierCurveRenderer){if(al<this.series.length-1){this.drawSeries(al+1)}}}else{for(ap=0;ap<this.series.length;ap++){ao=this.series[ap];am=ao.shadowCanvas._ctx;am.clearRect(0,0,am.canvas.width,am.canvas.height);ao.drawShadow(am,an,this);am=ao.canvas._ctx;am.clearRect(0,0,am.canvas.width,am.canvas.height);ao.draw(am,an,this)}}an=al=ap=ao=am=null};this.moveSeriesToFront=function(am){am=parseInt(am,10);var ap=L.inArray(am,this.seriesStack);if(ap==-1){return}if(ap==this.seriesStack.length-1){this.previousSeriesStack=this.seriesStack.slice(0);return}var al=this.seriesStack[this.seriesStack.length-1];var ao=this.series[am].canvas._elem.detach();var an=this.series[am].shadowCanvas._elem.detach();this.series[al].shadowCanvas._elem.after(an);this.series[al].canvas._elem.after(ao);this.previousSeriesStack=this.seriesStack.slice(0);this.seriesStack.splice(ap,1);this.seriesStack.push(am)};this.moveSeriesToBack=function(am){am=parseInt(am,10);var ap=L.inArray(am,this.seriesStack);if(ap==0||ap==-1){return}var al=this.seriesStack[0];var ao=this.series[am].canvas._elem.detach();var an=this.series[am].shadowCanvas._elem.detach();this.series[al].shadowCanvas._elem.before(an);this.series[al].canvas._elem.before(ao);this.previousSeriesStack=this.seriesStack.slice(0);this.seriesStack.splice(ap,1);this.seriesStack.unshift(am)};this.restorePreviousSeriesOrder=function(){var ar,aq,ap,ao,an,al,am;if(this.seriesStack==this.previousSeriesStack){return}for(ar=1;ar<this.previousSeriesStack.length;ar++){al=this.previousSeriesStack[ar];am=this.previousSeriesStack[ar-1];ap=this.series[al].canvas._elem.detach();ao=this.series[al].shadowCanvas._elem.detach();this.series[am].shadowCanvas._elem.after(ao);this.series[am].canvas._elem.after(ap)}an=this.seriesStack.slice(0);this.seriesStack=this.previousSeriesStack.slice(0);this.previousSeriesStack=an};this.restoreOriginalSeriesOrder=function(){var ap,ao,al=[],an,am;for(ap=0;ap<this.series.length;ap++){al.push(ap)}if(this.seriesStack==al){return}this.previousSeriesStack=this.seriesStack.slice(0);this.seriesStack=al;for(ap=1;ap<this.seriesStack.length;ap++){an=this.series[ap].canvas._elem.detach();am=this.series[ap].shadowCanvas._elem.detach();this.series[ap-1].shadowCanvas._elem.after(am);this.series[ap-1].canvas._elem.after(an)}};this.activateTheme=function(al){this.themeEngine.activate(this,al)}}L.jqplot.computeHighlightColors=function(ai){var ak;if(L.isArray(ai)){ak=[];for(var am=0;am<ai.length;am++){var al=L.jqplot.getColorComponents(ai[am]);var ah=[al[0],al[1],al[2]];var an=ah[0]+ah[1]+ah[2];for(var aj=0;aj<3;aj++){ah[aj]=(an>660)?ah[aj]*0.85:0.73*ah[aj]+90;ah[aj]=parseInt(ah[aj],10);(ah[aj]>255)?255:ah[aj]}ah[3]=0.3+0.35*al[3];ak.push("rgba("+ah[0]+","+ah[1]+","+ah[2]+","+ah[3]+")")}}else{var al=L.jqplot.getColorComponents(ai);var ah=[al[0],al[1],al[2]];var an=ah[0]+ah[1]+ah[2];for(var aj=0;aj<3;aj++){ah[aj]=(an>660)?ah[aj]*0.85:0.73*ah[aj]+90;ah[aj]=parseInt(ah[aj],10);(ah[aj]>255)?255:ah[aj]}ah[3]=0.3+0.35*al[3];ak="rgba("+ah[0]+","+ah[1]+","+ah[2]+","+ah[3]+")"}return ak};L.jqplot.ColorGenerator=function(ai){ai=ai||L.jqplot.config.defaultColors;var ah=0;this.next=function(){if(ah<ai.length){return ai[ah++]}else{ah=0;return ai[ah++]}};this.previous=function(){if(ah>0){return ai[ah--]}else{ah=ai.length-1;return ai[ah]}};this.get=function(ak){var aj=ak-ai.length*Math.floor(ak/ai.length);return ai[aj]};this.setColors=function(aj){ai=aj};this.reset=function(){ah=0};this.getIndex=function(){return ah};this.setIndex=function(aj){ah=aj}};L.jqplot.hex2rgb=function(aj,ah){aj=aj.replace("#","");if(aj.length==3){aj=aj.charAt(0)+aj.charAt(0)+aj.charAt(1)+aj.charAt(1)+aj.charAt(2)+aj.charAt(2)}var ai;ai="rgba("+parseInt(aj.slice(0,2),16)+", "+parseInt(aj.slice(2,4),16)+", "+parseInt(aj.slice(4,6),16);if(ah){ai+=", "+ah}ai+=")";return ai};L.jqplot.rgb2hex=function(am){var aj=/rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *(?:, *[0-9.]*)?\)/;var ah=am.match(aj);var al="#";for(var ak=1;ak<4;ak++){var ai;if(ah[ak].search(/%/)!=-1){ai=parseInt(255*ah[ak]/100,10).toString(16);if(ai.length==1){ai="0"+ai}}else{ai=parseInt(ah[ak],10).toString(16);if(ai.length==1){ai="0"+ai}}al+=ai}return al};L.jqplot.normalize2rgb=function(ai,ah){if(ai.search(/^ *rgba?\(/)!=-1){return ai}else{if(ai.search(/^ *#?[0-9a-fA-F]?[0-9a-fA-F]/)!=-1){return L.jqplot.hex2rgb(ai,ah)}else{throw new Error("Invalid color spec")}}};L.jqplot.getColorComponents=function(am){am=L.jqplot.colorKeywordMap[am]||am;var ak=L.jqplot.normalize2rgb(am);var aj=/rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *,? *([0-9.]* *)?\)/;var ah=ak.match(aj);var ai=[];for(var al=1;al<4;al++){if(ah[al].search(/%/)!=-1){ai[al-1]=parseInt(255*ah[al]/100,10)}else{ai[al-1]=parseInt(ah[al],10)}}ai[3]=parseFloat(ah[4])?parseFloat(ah[4]):1;return ai};L.jqplot.colorKeywordMap={aliceblue:"rgb(240, 248, 255)",antiquewhite:"rgb(250, 235, 215)",aqua:"rgb( 0, 255, 255)",aquamarine:"rgb(127, 255, 212)",azure:"rgb(240, 255, 255)",beige:"rgb(245, 245, 220)",bisque:"rgb(255, 228, 196)",black:"rgb( 0, 0, 0)",blanchedalmond:"rgb(255, 235, 205)",blue:"rgb( 0, 0, 255)",blueviolet:"rgb(138, 43, 226)",brown:"rgb(165, 42, 42)",burlywood:"rgb(222, 184, 135)",cadetblue:"rgb( 95, 158, 160)",chartreuse:"rgb(127, 255, 0)",chocolate:"rgb(210, 105, 30)",coral:"rgb(255, 127, 80)",cornflowerblue:"rgb(100, 149, 237)",cornsilk:"rgb(255, 248, 220)",crimson:"rgb(220, 20, 60)",cyan:"rgb( 0, 255, 255)",darkblue:"rgb( 0, 0, 139)",darkcyan:"rgb( 0, 139, 139)",darkgoldenrod:"rgb(184, 134, 11)",darkgray:"rgb(169, 169, 169)",darkgreen:"rgb( 0, 100, 0)",darkgrey:"rgb(169, 169, 169)",darkkhaki:"rgb(189, 183, 107)",darkmagenta:"rgb(139, 0, 139)",darkolivegreen:"rgb( 85, 107, 47)",darkorange:"rgb(255, 140, 0)",darkorchid:"rgb(153, 50, 204)",darkred:"rgb(139, 0, 0)",darksalmon:"rgb(233, 150, 122)",darkseagreen:"rgb(143, 188, 143)",darkslateblue:"rgb( 72, 61, 139)",darkslategray:"rgb( 47, 79, 79)",darkslategrey:"rgb( 47, 79, 79)",darkturquoise:"rgb( 0, 206, 209)",darkviolet:"rgb(148, 0, 211)",deeppink:"rgb(255, 20, 147)",deepskyblue:"rgb( 0, 191, 255)",dimgray:"rgb(105, 105, 105)",dimgrey:"rgb(105, 105, 105)",dodgerblue:"rgb( 30, 144, 255)",firebrick:"rgb(178, 34, 34)",floralwhite:"rgb(255, 250, 240)",forestgreen:"rgb( 34, 139, 34)",fuchsia:"rgb(255, 0, 255)",gainsboro:"rgb(220, 220, 220)",ghostwhite:"rgb(248, 248, 255)",gold:"rgb(255, 215, 0)",goldenrod:"rgb(218, 165, 32)",gray:"rgb(128, 128, 128)",grey:"rgb(128, 128, 128)",green:"rgb( 0, 128, 0)",greenyellow:"rgb(173, 255, 47)",honeydew:"rgb(240, 255, 240)",hotpink:"rgb(255, 105, 180)",indianred:"rgb(205, 92, 92)",indigo:"rgb( 75, 0, 130)",ivory:"rgb(255, 255, 240)",khaki:"rgb(240, 230, 140)",lavender:"rgb(230, 230, 250)",lavenderblush:"rgb(255, 240, 245)",lawngreen:"rgb(124, 252, 0)",lemonchiffon:"rgb(255, 250, 205)",lightblue:"rgb(173, 216, 230)",lightcoral:"rgb(240, 128, 128)",lightcyan:"rgb(224, 255, 255)",lightgoldenrodyellow:"rgb(250, 250, 210)",lightgray:"rgb(211, 211, 211)",lightgreen:"rgb(144, 238, 144)",lightgrey:"rgb(211, 211, 211)",lightpink:"rgb(255, 182, 193)",lightsalmon:"rgb(255, 160, 122)",lightseagreen:"rgb( 32, 178, 170)",lightskyblue:"rgb(135, 206, 250)",lightslategray:"rgb(119, 136, 153)",lightslategrey:"rgb(119, 136, 153)",lightsteelblue:"rgb(176, 196, 222)",lightyellow:"rgb(255, 255, 224)",lime:"rgb( 0, 255, 0)",limegreen:"rgb( 50, 205, 50)",linen:"rgb(250, 240, 230)",magenta:"rgb(255, 0, 255)",maroon:"rgb(128, 0, 0)",mediumaquamarine:"rgb(102, 205, 170)",mediumblue:"rgb( 0, 0, 205)",mediumorchid:"rgb(186, 85, 211)",mediumpurple:"rgb(147, 112, 219)",mediumseagreen:"rgb( 60, 179, 113)",mediumslateblue:"rgb(123, 104, 238)",mediumspringgreen:"rgb( 0, 250, 154)",mediumturquoise:"rgb( 72, 209, 204)",mediumvioletred:"rgb(199, 21, 133)",midnightblue:"rgb( 25, 25, 112)",mintcream:"rgb(245, 255, 250)",mistyrose:"rgb(255, 228, 225)",moccasin:"rgb(255, 228, 181)",navajowhite:"rgb(255, 222, 173)",navy:"rgb( 0, 0, 128)",oldlace:"rgb(253, 245, 230)",olive:"rgb(128, 128, 0)",olivedrab:"rgb(107, 142, 35)",orange:"rgb(255, 165, 0)",orangered:"rgb(255, 69, 0)",orchid:"rgb(218, 112, 214)",palegoldenrod:"rgb(238, 232, 170)",palegreen:"rgb(152, 251, 152)",paleturquoise:"rgb(175, 238, 238)",palevioletred:"rgb(219, 112, 147)",papayawhip:"rgb(255, 239, 213)",peachpuff:"rgb(255, 218, 185)",peru:"rgb(205, 133, 63)",pink:"rgb(255, 192, 203)",plum:"rgb(221, 160, 221)",powderblue:"rgb(176, 224, 230)",purple:"rgb(128, 0, 128)",red:"rgb(255, 0, 0)",rosybrown:"rgb(188, 143, 143)",royalblue:"rgb( 65, 105, 225)",saddlebrown:"rgb(139, 69, 19)",salmon:"rgb(250, 128, 114)",sandybrown:"rgb(244, 164, 96)",seagreen:"rgb( 46, 139, 87)",seashell:"rgb(255, 245, 238)",sienna:"rgb(160, 82, 45)",silver:"rgb(192, 192, 192)",skyblue:"rgb(135, 206, 235)",slateblue:"rgb(106, 90, 205)",slategray:"rgb(112, 128, 144)",slategrey:"rgb(112, 128, 144)",snow:"rgb(255, 250, 250)",springgreen:"rgb( 0, 255, 127)",steelblue:"rgb( 70, 130, 180)",tan:"rgb(210, 180, 140)",teal:"rgb( 0, 128, 128)",thistle:"rgb(216, 191, 216)",tomato:"rgb(255, 99, 71)",turquoise:"rgb( 64, 224, 208)",violet:"rgb(238, 130, 238)",wheat:"rgb(245, 222, 179)",white:"rgb(255, 255, 255)",whitesmoke:"rgb(245, 245, 245)",yellow:"rgb(255, 255, 0)",yellowgreen:"rgb(154, 205, 50)"};L.jqplot.AxisLabelRenderer=function(ah){L.jqplot.ElemContainer.call(this);this.axis;this.show=true;this.label="";this.fontFamily=null;this.fontSize=null;this.textColor=null;this._elem;this.escapeHTML=false;L.extend(true,this,ah)};L.jqplot.AxisLabelRenderer.prototype=new L.jqplot.ElemContainer();L.jqplot.AxisLabelRenderer.prototype.constructor=L.jqplot.AxisLabelRenderer;L.jqplot.AxisLabelRenderer.prototype.init=function(ah){L.extend(true,this,ah)};L.jqplot.AxisLabelRenderer.prototype.draw=function(ah,ai){if(this._elem){this._elem.emptyForce();this._elem=null}this._elem=L('<div style="position:absolute;" class="jqplot-'+this.axis+'-label"></div>');if(Number(this.label)){this._elem.css("white-space","nowrap")}if(!this.escapeHTML){this._elem.html(this.label)}else{this._elem.text(this.label)}if(this.fontFamily){this._elem.css("font-family",this.fontFamily)}if(this.fontSize){this._elem.css("font-size",this.fontSize)}if(this.textColor){this._elem.css("color",this.textColor)}return this._elem};L.jqplot.AxisLabelRenderer.prototype.pack=function(){};L.jqplot.AxisTickRenderer=function(ah){L.jqplot.ElemContainer.call(this);this.mark="outside";this.axis;this.showMark=true;this.showGridline=true;this.isMinorTick=false;this.size=4;this.markSize=6;this.show=true;this.showLabel=true;this.label=null;this.value=null;this._styles={};this.formatter=L.jqplot.DefaultTickFormatter;this.prefix="";this.suffix="";this.formatString="";this.fontFamily;this.fontSize;this.textColor;this.escapeHTML=false;this._elem;this._breakTick=false;L.extend(true,this,ah)};L.jqplot.AxisTickRenderer.prototype.init=function(ah){L.extend(true,this,ah)};L.jqplot.AxisTickRenderer.prototype=new L.jqplot.ElemContainer();L.jqplot.AxisTickRenderer.prototype.constructor=L.jqplot.AxisTickRenderer;L.jqplot.AxisTickRenderer.prototype.setTick=function(ah,aj,ai){this.value=ah;this.axis=aj;if(ai){this.isMinorTick=true}return this};L.jqplot.AxisTickRenderer.prototype.draw=function(){if(this.label===null){this.label=this.prefix+this.formatter(this.formatString,this.value)+this.suffix}var ai={position:"absolute"};if(Number(this.label)){ai.whitSpace="nowrap"}if(this._elem){this._elem.emptyForce();this._elem=null}this._elem=L(document.createElement("div"));this._elem.addClass("jqplot-"+this.axis+"-tick");if(!this.escapeHTML){this._elem.html(this.label)}else{this._elem.text(this.label)}this._elem.css(ai);for(var ah in this._styles){this._elem.css(ah,this._styles[ah])}if(this.fontFamily){this._elem.css("font-family",this.fontFamily)}if(this.fontSize){this._elem.css("font-size",this.fontSize)}if(this.textColor){this._elem.css("color",this.textColor)}if(this._breakTick){this._elem.addClass("jqplot-breakTick")}return this._elem};L.jqplot.DefaultTickFormatter=function(ah,ai){if(typeof ai=="number"){if(!ah){ah=L.jqplot.config.defaultTickFormatString}return L.jqplot.sprintf(ah,ai)}else{return String(ai)}};L.jqplot.PercentTickFormatter=function(ah,ai){if(typeof ai=="number"){ai=100*ai;if(!ah){ah=L.jqplot.config.defaultTickFormatString}return L.jqplot.sprintf(ah,ai)}else{return String(ai)}};L.jqplot.AxisTickRenderer.prototype.pack=function(){};L.jqplot.CanvasGridRenderer=function(){this.shadowRenderer=new L.jqplot.ShadowRenderer()};L.jqplot.CanvasGridRenderer.prototype.init=function(ai){this._ctx;L.extend(true,this,ai);var ah={lineJoin:"miter",lineCap:"round",fill:false,isarc:false,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.shadowWidth,closePath:false,strokeStyle:this.shadowColor};this.renderer.shadowRenderer.init(ah)};L.jqplot.CanvasGridRenderer.prototype.createElement=function(ak){var aj;if(this._elem){if(L.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==u){aj=this._elem.get(0);window.G_vmlCanvasManager.uninitElement(aj);aj=null}this._elem.emptyForce();this._elem=null}aj=ak.canvasManager.getCanvas();var ah=this._plotDimensions.width;var ai=this._plotDimensions.height;aj.width=ah;aj.height=ai;this._elem=L(aj);this._elem.addClass("jqplot-grid-canvas");this._elem.css({position:"absolute",left:0,top:0});aj=ak.canvasManager.initCanvas(aj);this._top=this._offsets.top;this._bottom=ai-this._offsets.bottom;this._left=this._offsets.left;this._right=ah-this._offsets.right;this._width=this._right-this._left;this._height=this._bottom-this._top;aj=null;return this._elem};L.jqplot.CanvasGridRenderer.prototype.draw=function(){this._ctx=this._elem.get(0).getContext("2d");var at=this._ctx;var aw=this._axes;at.save();at.clearRect(0,0,this._plotDimensions.width,this._plotDimensions.height);at.fillStyle=this.backgroundColor||this.background;at.fillRect(this._left,this._top,this._width,this._height);at.save();at.lineJoin="miter";at.lineCap="butt";at.lineWidth=this.gridLineWidth;at.strokeStyle=this.gridLineColor;var aA,az,ap,aq;var am=["xaxis","yaxis","x2axis","y2axis"];for(var ay=4;ay>0;ay--){var aD=am[ay-1];var ah=aw[aD];var aB=ah._ticks;var ar=aB.length;if(ah.show){if(ah.drawBaseline){var aC={};if(ah.baselineWidth!==null){aC.lineWidth=ah.baselineWidth}if(ah.baselineColor!==null){aC.strokeStyle=ah.baselineColor}switch(aD){case"xaxis":ao(this._left,this._bottom,this._right,this._bottom,aC);break;case"yaxis":ao(this._left,this._bottom,this._left,this._top,aC);break;case"x2axis":ao(this._left,this._bottom,this._right,this._bottom,aC);break;case"y2axis":ao(this._right,this._bottom,this._right,this._top,aC);break}}for(var au=ar;au>0;au--){var an=aB[au-1];if(an.show){var ak=Math.round(ah.u2p(an.value))+0.5;switch(aD){case"xaxis":if(an.showGridline&&this.drawGridlines&&((!an.isMinorTick&&ah.drawMajorGridlines)||(an.isMinorTick&&ah.drawMinorGridlines))){ao(ak,this._top,ak,this._bottom)}if(an.showMark&&an.mark&&((!an.isMinorTick&&ah.drawMajorTickMarks)||(an.isMinorTick&&ah.drawMinorTickMarks))){ap=an.markSize;aq=an.mark;var ak=Math.round(ah.u2p(an.value))+0.5;switch(aq){case"outside":aA=this._bottom;az=this._bottom+ap;break;case"inside":aA=this._bottom-ap;az=this._bottom;break;case"cross":aA=this._bottom-ap;az=this._bottom+ap;break;default:aA=this._bottom;az=this._bottom+ap;break}if(this.shadow){this.renderer.shadowRenderer.draw(at,[[ak,aA],[ak,az]],{lineCap:"butt",lineWidth:this.gridLineWidth,offset:this.gridLineWidth*0.75,depth:2,fill:false,closePath:false})}ao(ak,aA,ak,az)}break;case"yaxis":if(an.showGridline&&this.drawGridlines&&((!an.isMinorTick&&ah.drawMajorGridlines)||(an.isMinorTick&&ah.drawMinorGridlines))){ao(this._right,ak,this._left,ak)}if(an.showMark&&an.mark&&((!an.isMinorTick&&ah.drawMajorTickMarks)||(an.isMinorTick&&ah.drawMinorTickMarks))){ap=an.markSize;aq=an.mark;var ak=Math.round(ah.u2p(an.value))+0.5;switch(aq){case"outside":aA=this._left-ap;az=this._left;break;case"inside":aA=this._left;az=this._left+ap;break;case"cross":aA=this._left-ap;az=this._left+ap;break;default:aA=this._left-ap;az=this._left;break}if(this.shadow){this.renderer.shadowRenderer.draw(at,[[aA,ak],[az,ak]],{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}ao(aA,ak,az,ak,{strokeStyle:ah.borderColor})}break;case"x2axis":if(an.showGridline&&this.drawGridlines&&((!an.isMinorTick&&ah.drawMajorGridlines)||(an.isMinorTick&&ah.drawMinorGridlines))){ao(ak,this._bottom,ak,this._top)}if(an.showMark&&an.mark&&((!an.isMinorTick&&ah.drawMajorTickMarks)||(an.isMinorTick&&ah.drawMinorTickMarks))){ap=an.markSize;aq=an.mark;var ak=Math.round(ah.u2p(an.value))+0.5;switch(aq){case"outside":aA=this._top-ap;az=this._top;break;case"inside":aA=this._top;az=this._top+ap;break;case"cross":aA=this._top-ap;az=this._top+ap;break;default:aA=this._top-ap;az=this._top;break}if(this.shadow){this.renderer.shadowRenderer.draw(at,[[ak,aA],[ak,az]],{lineCap:"butt",lineWidth:this.gridLineWidth,offset:this.gridLineWidth*0.75,depth:2,fill:false,closePath:false})}ao(ak,aA,ak,az)}break;case"y2axis":if(an.showGridline&&this.drawGridlines&&((!an.isMinorTick&&ah.drawMajorGridlines)||(an.isMinorTick&&ah.drawMinorGridlines))){ao(this._left,ak,this._right,ak)}if(an.showMark&&an.mark&&((!an.isMinorTick&&ah.drawMajorTickMarks)||(an.isMinorTick&&ah.drawMinorTickMarks))){ap=an.markSize;aq=an.mark;var ak=Math.round(ah.u2p(an.value))+0.5;switch(aq){case"outside":aA=this._right;az=this._right+ap;break;case"inside":aA=this._right-ap;az=this._right;break;case"cross":aA=this._right-ap;az=this._right+ap;break;default:aA=this._right;az=this._right+ap;break}if(this.shadow){this.renderer.shadowRenderer.draw(at,[[aA,ak],[az,ak]],{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}ao(aA,ak,az,ak,{strokeStyle:ah.borderColor})}break;default:break}}}an=null}ah=null;aB=null}am=["y3axis","y4axis","y5axis","y6axis","y7axis","y8axis","y9axis","yMidAxis"];for(var ay=7;ay>0;ay--){var ah=aw[am[ay-1]];var aB=ah._ticks;if(ah.show){var ai=aB[ah.numberTicks-1];var al=aB[0];var aj=ah.getLeft();var av=[[aj,ai.getTop()+ai.getHeight()/2],[aj,al.getTop()+al.getHeight()/2+1]];if(this.shadow){this.renderer.shadowRenderer.draw(at,av,{lineCap:"butt",fill:false,closePath:false})}ao(av[0][0],av[0][1],av[1][0],av[1][1],{lineCap:"butt",strokeStyle:ah.borderColor,lineWidth:ah.borderWidth});for(var au=aB.length;au>0;au--){var an=aB[au-1];ap=an.markSize;aq=an.mark;var ak=Math.round(ah.u2p(an.value))+0.5;if(an.showMark&&an.mark){switch(aq){case"outside":aA=aj;az=aj+ap;break;case"inside":aA=aj-ap;az=aj;break;case"cross":aA=aj-ap;az=aj+ap;break;default:aA=aj;az=aj+ap;break}av=[[aA,ak],[az,ak]];if(this.shadow){this.renderer.shadowRenderer.draw(at,av,{lineCap:"butt",lineWidth:this.gridLineWidth*1.5,offset:this.gridLineWidth*0.75,fill:false,closePath:false})}ao(aA,ak,az,ak,{strokeStyle:ah.borderColor})}an=null}al=null}ah=null;aB=null}at.restore();function ao(aH,aG,aE,ax,aF){at.save();aF=aF||{};if(aF.lineWidth==null||aF.lineWidth!=0){L.extend(true,at,aF);at.beginPath();at.moveTo(aH,aG);at.lineTo(aE,ax);at.stroke();at.restore()}}if(this.shadow){var av=[[this._left,this._bottom],[this._right,this._bottom],[this._right,this._top]];this.renderer.shadowRenderer.draw(at,av)}if(this.borderWidth!=0&&this.drawBorder){ao(this._left,this._top,this._right,this._top,{lineCap:"round",strokeStyle:aw.x2axis.borderColor,lineWidth:aw.x2axis.borderWidth});ao(this._right,this._top,this._right,this._bottom,{lineCap:"round",strokeStyle:aw.y2axis.borderColor,lineWidth:aw.y2axis.borderWidth});ao(this._right,this._bottom,this._left,this._bottom,{lineCap:"round",strokeStyle:aw.xaxis.borderColor,lineWidth:aw.xaxis.borderWidth});ao(this._left,this._bottom,this._left,this._top,{lineCap:"round",strokeStyle:aw.yaxis.borderColor,lineWidth:aw.yaxis.borderWidth})}at.restore();at=null;aw=null};L.jqplot.DivTitleRenderer=function(){};L.jqplot.DivTitleRenderer.prototype.init=function(ah){L.extend(true,this,ah)};L.jqplot.DivTitleRenderer.prototype.draw=function(){if(this._elem){this._elem.emptyForce();this._elem=null}var ak=this.renderer;var aj=document.createElement("div");this._elem=L(aj);this._elem.addClass("jqplot-title");if(!this.text){this.show=false;this._elem.height(0);this._elem.width(0)}else{if(this.text){var ah;if(this.color){ah=this.color}else{if(this.textColor){ah=this.textColor}}var ai={position:"absolute",top:"0px",left:"0px"};if(this._plotWidth){ai.width=this._plotWidth+"px"}if(this.fontSize){ai.fontSize=this.fontSize}if(typeof this.textAlign==="string"){ai.textAlign=this.textAlign}else{ai.textAlign="center"}if(ah){ai.color=ah}if(this.paddingBottom){ai.paddingBottom=this.paddingBottom}if(this.fontFamily){ai.fontFamily=this.fontFamily}this._elem.css(ai);if(this.escapeHtml){this._elem.text(this.text)}else{this._elem.html(this.text)}}}aj=null;return this._elem};L.jqplot.DivTitleRenderer.prototype.pack=function(){};var r=0.1;L.jqplot.LinePattern=function(aw,aq){var ap={dotted:[r,L.jqplot.config.dotGapLength],dashed:[L.jqplot.config.dashLength,L.jqplot.config.gapLength],solid:null};if(typeof aq==="string"){if(aq[0]==="."||aq[0]==="-"){var ax=aq;aq=[];for(var ao=0,al=ax.length;ao<al;ao++){if(ax[ao]==="."){aq.push(r)}else{if(ax[ao]==="-"){aq.push(L.jqplot.config.dashLength)}else{continue}}aq.push(L.jqplot.config.gapLength)}}else{aq=ap[aq]}}if(!(aq&&aq.length)){return aw}var ak=0;var ar=aq[0];var au=0;var at=0;var an=0;var ah=0;var av=function(ay,az){aw.moveTo(ay,az);au=ay;at=az;an=ay;ah=az};var aj=function(ay,aE){var aC=aw.lineWidth;var aA=ay-au;var az=aE-at;var aB=Math.sqrt(aA*aA+az*az);if((aB>0)&&(aC>0)){aA/=aB;az/=aB;while(true){var aD=aC*ar;if(aD<aB){au+=aD*aA;at+=aD*az;if((ak&1)==0){aw.lineTo(au,at)}else{aw.moveTo(au,at)}aB-=aD;ak++;if(ak>=aq.length){ak=0}ar=aq[ak]}else{au=ay;at=aE;if((ak&1)==0){aw.lineTo(au,at)}else{aw.moveTo(au,at)}ar-=aB/aC;break}}}};var ai=function(){aw.beginPath()};var am=function(){aj(an,ah)};return{moveTo:av,lineTo:aj,beginPath:ai,closePath:am}};L.jqplot.LineRenderer=function(){this.shapeRenderer=new L.jqplot.ShapeRenderer();this.shadowRenderer=new L.jqplot.ShadowRenderer()};L.jqplot.LineRenderer.prototype.init=function(ai,an){ai=ai||{};this._type="line";this.renderer.animation={show:false,direction:"left",speed:2500,_supported:true};this.renderer.smooth=false;this.renderer.tension=null;this.renderer.constrainSmoothing=true;this.renderer._smoothedData=[];this.renderer._smoothedPlotData=[];this.renderer._hiBandGridData=[];this.renderer._lowBandGridData=[];this.renderer._hiBandSmoothedData=[];this.renderer._lowBandSmoothedData=[];this.renderer.bandData=[];this.renderer.bands={show:false,hiData:[],lowData:[],color:this.color,showLines:false,fill:true,fillColor:null,_min:null,_max:null,interval:"3%"};var al={highlightMouseOver:ai.highlightMouseOver,highlightMouseDown:ai.highlightMouseDown,highlightColor:ai.highlightColor};delete (ai.highlightMouseOver);delete (ai.highlightMouseDown);delete (ai.highlightColor);L.extend(true,this.renderer,ai);this.renderer.options=ai;if(this.renderer.bandData.length>1&&(!ai.bands||ai.bands.show==null)){this.renderer.bands.show=true}else{if(ai.bands&&ai.bands.show==null&&ai.bands.interval!=null){this.renderer.bands.show=true}}if(this.fill){this.renderer.bands.show=false}if(this.renderer.bands.show){this.renderer.initBands.call(this,this.renderer.options,an)}if(this._stack){this.renderer.smooth=false}var am={lineJoin:this.lineJoin,lineCap:this.lineCap,fill:this.fill,isarc:false,strokeStyle:this.color,fillStyle:this.fillColor,lineWidth:this.lineWidth,linePattern:this.linePattern,closePath:this.fill};this.renderer.shapeRenderer.init(am);var aj=ai.shadowOffset;if(aj==null){if(this.lineWidth>2.5){aj=1.25*(1+(Math.atan((this.lineWidth/2.5))/0.785398163-1)*0.6)}else{aj=1.25*Math.atan((this.lineWidth/2.5))/0.785398163}}var ah={lineJoin:this.lineJoin,lineCap:this.lineCap,fill:this.fill,isarc:false,angle:this.shadowAngle,offset:aj,alpha:this.shadowAlpha,depth:this.shadowDepth,lineWidth:this.lineWidth,linePattern:this.linePattern,closePath:this.fill};this.renderer.shadowRenderer.init(ah);this._areaPoints=[];this._boundingBox=[[],[]];if(!this.isTrendline&&this.fill||this.renderer.bands.show){this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColor=null;if(al.highlightMouseDown&&al.highlightMouseOver==null){al.highlightMouseOver=false}L.extend(true,this,{highlightMouseOver:al.highlightMouseOver,highlightMouseDown:al.highlightMouseDown,highlightColor:al.highlightColor});if(!this.highlightColor){var ak=(this.renderer.bands.show)?this.renderer.bands.fillColor:this.fillColor;this.highlightColor=L.jqplot.computeHighlightColors(ak)}if(this.highlighter){this.highlighter.show=false}}if(!this.isTrendline&&an){an.plugins.lineRenderer={};an.postInitHooks.addOnce(z);an.postDrawHooks.addOnce(af);an.eventListenerHooks.addOnce("jqplotMouseMove",h);an.eventListenerHooks.addOnce("jqplotMouseDown",e);an.eventListenerHooks.addOnce("jqplotMouseUp",ad);an.eventListenerHooks.addOnce("jqplotClick",g);an.eventListenerHooks.addOnce("jqplotRightClick",s)}};L.jqplot.LineRenderer.prototype.initBands=function(ak,av){var al=ak.bandData||[];var an=this.renderer.bands;an.hiData=[];an.lowData=[];var aB=this.data;an._max=null;an._min=null;if(al.length==2){if(L.isArray(al[0][0])){var ao;var ah=0,ar=0;for(var aw=0,at=al[0].length;aw<at;aw++){ao=al[0][aw];if((ao[1]!=null&&ao[1]>an._max)||an._max==null){an._max=ao[1]}if((ao[1]!=null&&ao[1]<an._min)||an._min==null){an._min=ao[1]}}for(var aw=0,at=al[1].length;aw<at;aw++){ao=al[1][aw];if((ao[1]!=null&&ao[1]>an._max)||an._max==null){an._max=ao[1];ar=1}if((ao[1]!=null&&ao[1]<an._min)||an._min==null){an._min=ao[1];ah=1}}if(ar===ah){an.show=false}an.hiData=al[ar];an.lowData=al[ah]}else{if(al[0].length===aB.length&&al[1].length===aB.length){var aj=(al[0][0]>al[1][0])?0:1;var aC=(aj)?0:1;for(var aw=0,at=aB.length;aw<at;aw++){an.hiData.push([aB[aw][0],al[aj][aw]]);an.lowData.push([aB[aw][0],al[aC][aw]])}}else{an.show=false}}}else{if(al.length>2&&!L.isArray(al[0][0])){var aj=(al[0][0]>al[0][1])?0:1;var aC=(aj)?0:1;for(var aw=0,at=al.length;aw<at;aw++){an.hiData.push([aB[aw][0],al[aw][aj]]);an.lowData.push([aB[aw][0],al[aw][aC]])}}else{var aq=an.interval;var aA=null;var az=null;var ai=null;var au=null;if(L.isArray(aq)){aA=aq[0];az=aq[1]}else{aA=aq}if(isNaN(aA)){if(aA.charAt(aA.length-1)==="%"){ai="multiply";aA=parseFloat(aA)/100+1}}else{aA=parseFloat(aA);ai="add"}if(az!==null&&isNaN(az)){if(az.charAt(az.length-1)==="%"){au="multiply";az=parseFloat(az)/100+1}}else{if(az!==null){az=parseFloat(az);au="add"}}if(aA!==null){if(az===null){az=-aA;au=ai;if(au==="multiply"){az+=2}}if(aA<az){var ax=aA;aA=az;az=ax;ax=ai;ai=au;au=ax}for(var aw=0,at=aB.length;aw<at;aw++){switch(ai){case"add":an.hiData.push([aB[aw][0],aB[aw][1]+aA]);break;case"multiply":an.hiData.push([aB[aw][0],aB[aw][1]*aA]);break}switch(au){case"add":an.lowData.push([aB[aw][0],aB[aw][1]+az]);break;case"multiply":an.lowData.push([aB[aw][0],aB[aw][1]*az]);break}}}else{an.show=false}}}var am=an.hiData;var ap=an.lowData;for(var aw=0,at=am.length;aw<at;aw++){if((am[aw][1]!=null&&am[aw][1]>an._max)||an._max==null){an._max=am[aw][1]}}for(var aw=0,at=ap.length;aw<at;aw++){if((ap[aw][1]!=null&&ap[aw][1]<an._min)||an._min==null){an._min=ap[aw][1]}}if(an.fillColor===null){var ay=L.jqplot.getColorComponents(an.color);ay[3]=ay[3]*0.5;an.fillColor="rgba("+ay[0]+", "+ay[1]+", "+ay[2]+", "+ay[3]+")"}};function K(ai,ah){return(3.4182054+ah)*Math.pow(ai,-0.3534992)}function n(aj,ai){var ah=Math.sqrt(Math.pow((ai[0]-aj[0]),2)+Math.pow((ai[1]-aj[1]),2));return 5.7648*Math.log(ah)+7.4456}function A(ah){var ai=(Math.exp(2*ah)-1)/(Math.exp(2*ah)+1);return ai}function J(aJ){var at=this.renderer.smooth;var aD=this.canvas.getWidth();var an=this._xaxis.series_p2u;var aG=this._yaxis.series_p2u;var aF=null;var am=null;var az=aJ.length/aD;var aj=[];var ay=[];if(!isNaN(parseFloat(at))){aF=parseFloat(at)}else{aF=K(az,0.5)}var aw=[];var ak=[];for(var aE=0,aA=aJ.length;aE<aA;aE++){aw.push(aJ[aE][1]);ak.push(aJ[aE][0])}function av(aK,aL){if(aK-aL==0){return Math.pow(10,10)}else{return aK-aL}}var ax,ar,aq,ap;var ah=aJ.length-1;for(var al=1,aB=aJ.length;al<aB;al++){var ai=[];var au=[];for(var aC=0;aC<2;aC++){var aE=al-1+aC;if(aE==0||aE==ah){ai[aC]=Math.pow(10,10)}else{if(aw[aE+1]-aw[aE]==0||aw[aE]-aw[aE-1]==0){ai[aC]=0}else{if(((ak[aE+1]-ak[aE])/(aw[aE+1]-aw[aE])+(ak[aE]-ak[aE-1])/(aw[aE]-aw[aE-1]))==0){ai[aC]=0}else{if((aw[aE+1]-aw[aE])*(aw[aE]-aw[aE-1])<0){ai[aC]=0}else{ai[aC]=2/(av(ak[aE+1],ak[aE])/(aw[aE+1]-aw[aE])+av(ak[aE],ak[aE-1])/(aw[aE]-aw[aE-1]))}}}}}if(al==1){ai[0]=3/2*(aw[1]-aw[0])/av(ak[1],ak[0])-ai[1]/2}else{if(al==ah){ai[1]=3/2*(aw[ah]-aw[ah-1])/av(ak[ah],ak[ah-1])-ai[0]/2}}au[0]=-2*(ai[1]+2*ai[0])/av(ak[al],ak[al-1])+6*(aw[al]-aw[al-1])/Math.pow(av(ak[al],ak[al-1]),2);au[1]=2*(2*ai[1]+ai[0])/av(ak[al],ak[al-1])-6*(aw[al]-aw[al-1])/Math.pow(av(ak[al],ak[al-1]),2);ap=1/6*(au[1]-au[0])/av(ak[al],ak[al-1]);aq=1/2*(ak[al]*au[0]-ak[al-1]*au[1])/av(ak[al],ak[al-1]);ar=(aw[al]-aw[al-1]-aq*(Math.pow(ak[al],2)-Math.pow(ak[al-1],2))-ap*(Math.pow(ak[al],3)-Math.pow(ak[al-1],3)))/av(ak[al],ak[al-1]);ax=aw[al-1]-ar*ak[al-1]-aq*Math.pow(ak[al-1],2)-ap*Math.pow(ak[al-1],3);var aI=(ak[al]-ak[al-1])/aF;var aH,ao;for(var aC=0,aA=aF;aC<aA;aC++){aH=[];ao=ak[al-1]+aC*aI;aH.push(ao);aH.push(ax+ar*ao+aq*Math.pow(ao,2)+ap*Math.pow(ao,3));aj.push(aH);ay.push([an(aH[0]),aG(aH[1])])}}aj.push(aJ[aE]);ay.push([an(aJ[aE][0]),aG(aJ[aE][1])]);return[aj,ay]}function F(ap){var ao=this.renderer.smooth;var aU=this.renderer.tension;var ah=this.canvas.getWidth();var aH=this._xaxis.series_p2u;var aq=this._yaxis.series_p2u;var aI=null;var aJ=null;var aT=null;var aO=null;var aM=null;var at=null;var aR=null;var am=null;var aK,aL,aD,aC,aA,ay;var ak,ai,av,au;var aB,az,aN;var aw=[];var aj=[];var al=ap.length/ah;var aS,ax,aF,aG,aE;var ar=[];var an=[];if(!isNaN(parseFloat(ao))){aI=parseFloat(ao)}else{aI=K(al,0.5)}if(!isNaN(parseFloat(aU))){aU=parseFloat(aU)}for(var aQ=0,aP=ap.length-1;aQ<aP;aQ++){if(aU===null){at=Math.abs((ap[aQ+1][1]-ap[aQ][1])/(ap[aQ+1][0]-ap[aQ][0]));aS=0.3;ax=0.6;aF=(ax-aS)/2;aG=2.5;aE=-1.4;am=at/aG+aE;aO=aF*A(am)-aF*A(aE)+aS;if(aQ>0){aR=Math.abs((ap[aQ][1]-ap[aQ-1][1])/(ap[aQ][0]-ap[aQ-1][0]))}am=aR/aG+aE;aM=aF*A(am)-aF*A(aE)+aS;aT=(aO+aM)/2}else{aT=aU}for(aK=0;aK<aI;aK++){aL=aK/aI;aD=(1+2*aL)*Math.pow((1-aL),2);aC=aL*Math.pow((1-aL),2);aA=Math.pow(aL,2)*(3-2*aL);ay=Math.pow(aL,2)*(aL-1);if(ap[aQ-1]){ak=aT*(ap[aQ+1][0]-ap[aQ-1][0]);ai=aT*(ap[aQ+1][1]-ap[aQ-1][1])}else{ak=aT*(ap[aQ+1][0]-ap[aQ][0]);ai=aT*(ap[aQ+1][1]-ap[aQ][1])}if(ap[aQ+2]){av=aT*(ap[aQ+2][0]-ap[aQ][0]);au=aT*(ap[aQ+2][1]-ap[aQ][1])}else{av=aT*(ap[aQ+1][0]-ap[aQ][0]);au=aT*(ap[aQ+1][1]-ap[aQ][1])}aB=aD*ap[aQ][0]+aA*ap[aQ+1][0]+aC*ak+ay*av;az=aD*ap[aQ][1]+aA*ap[aQ+1][1]+aC*ai+ay*au;aN=[aB,az];ar.push(aN);an.push([aH(aB),aq(az)])}}ar.push(ap[aP]);an.push([aH(ap[aP][0]),aq(ap[aP][1])]);return[ar,an]}L.jqplot.LineRenderer.prototype.setGridData=function(ap){var al=this._xaxis.series_u2p;var ah=this._yaxis.series_u2p;var am=this._plotData;var aq=this._prevPlotData;this.gridData=[];this._prevGridData=[];this.renderer._smoothedData=[];this.renderer._smoothedPlotData=[];this.renderer._hiBandGridData=[];this.renderer._lowBandGridData=[];this.renderer._hiBandSmoothedData=[];this.renderer._lowBandSmoothedData=[];var ak=this.renderer.bands;var ai=false;for(var an=0,aj=am.length;an<aj;an++){if(am[an][0]!=null&&am[an][1]!=null){this.gridData.push([al.call(this._xaxis,am[an][0]),ah.call(this._yaxis,am[an][1])])}else{if(am[an][0]==null){ai=true;this.gridData.push([null,ah.call(this._yaxis,am[an][1])])}else{if(am[an][1]==null){ai=true;this.gridData.push([al.call(this._xaxis,am[an][0]),null])}}}if(aq[an]!=null&&aq[an][0]!=null&&aq[an][1]!=null){this._prevGridData.push([al.call(this._xaxis,aq[an][0]),ah.call(this._yaxis,aq[an][1])])}else{if(aq[an]!=null&&aq[an][0]==null){this._prevGridData.push([null,ah.call(this._yaxis,aq[an][1])])}else{if(aq[an]!=null&&aq[an][0]!=null&&aq[an][1]==null){this._prevGridData.push([al.call(this._xaxis,aq[an][0]),null])}}}}if(ai){this.renderer.smooth=false;if(this._type==="line"){ak.show=false}}if(this._type==="line"&&ak.show){for(var an=0,aj=ak.hiData.length;an<aj;an++){this.renderer._hiBandGridData.push([al.call(this._xaxis,ak.hiData[an][0]),ah.call(this._yaxis,ak.hiData[an][1])])}for(var an=0,aj=ak.lowData.length;an<aj;an++){this.renderer._lowBandGridData.push([al.call(this._xaxis,ak.lowData[an][0]),ah.call(this._yaxis,ak.lowData[an][1])])}}if(this._type==="line"&&this.renderer.smooth&&this.gridData.length>2){var ao;if(this.renderer.constrainSmoothing){ao=J.call(this,this.gridData);this.renderer._smoothedData=ao[0];this.renderer._smoothedPlotData=ao[1];if(ak.show){ao=J.call(this,this.renderer._hiBandGridData);this.renderer._hiBandSmoothedData=ao[0];ao=J.call(this,this.renderer._lowBandGridData);this.renderer._lowBandSmoothedData=ao[0]}ao=null}else{ao=F.call(this,this.gridData);this.renderer._smoothedData=ao[0];this.renderer._smoothedPlotData=ao[1];if(ak.show){ao=F.call(this,this.renderer._hiBandGridData);this.renderer._hiBandSmoothedData=ao[0];ao=F.call(this,this.renderer._lowBandGridData);this.renderer._lowBandSmoothedData=ao[0]}ao=null}}};L.jqplot.LineRenderer.prototype.makeGridData=function(ao,aq){var am=this._xaxis.series_u2p;var ah=this._yaxis.series_u2p;var ar=[];var aj=[];this.renderer._smoothedData=[];this.renderer._smoothedPlotData=[];this.renderer._hiBandGridData=[];this.renderer._lowBandGridData=[];this.renderer._hiBandSmoothedData=[];this.renderer._lowBandSmoothedData=[];var al=this.renderer.bands;var ai=false;for(var an=0;an<ao.length;an++){if(ao[an][0]!=null&&ao[an][1]!=null){ar.push([am.call(this._xaxis,ao[an][0]),ah.call(this._yaxis,ao[an][1])])}else{if(ao[an][0]==null){ai=true;ar.push([null,ah.call(this._yaxis,ao[an][1])])}else{if(ao[an][1]==null){ai=true;ar.push([am.call(this._xaxis,ao[an][0]),null])}}}}if(ai){this.renderer.smooth=false;if(this._type==="line"){al.show=false}}if(this._type==="line"&&al.show){for(var an=0,ak=al.hiData.length;an<ak;an++){this.renderer._hiBandGridData.push([am.call(this._xaxis,al.hiData[an][0]),ah.call(this._yaxis,al.hiData[an][1])])}for(var an=0,ak=al.lowData.length;an<ak;an++){this.renderer._lowBandGridData.push([am.call(this._xaxis,al.lowData[an][0]),ah.call(this._yaxis,al.lowData[an][1])])}}if(this._type==="line"&&this.renderer.smooth&&ar.length>2){var ap;if(this.renderer.constrainSmoothing){ap=J.call(this,ar);this.renderer._smoothedData=ap[0];this.renderer._smoothedPlotData=ap[1];if(al.show){ap=J.call(this,this.renderer._hiBandGridData);this.renderer._hiBandSmoothedData=ap[0];ap=J.call(this,this.renderer._lowBandGridData);this.renderer._lowBandSmoothedData=ap[0]}ap=null}else{ap=F.call(this,ar);this.renderer._smoothedData=ap[0];this.renderer._smoothedPlotData=ap[1];if(al.show){ap=F.call(this,this.renderer._hiBandGridData);this.renderer._hiBandSmoothedData=ap[0];ap=F.call(this,this.renderer._lowBandGridData);this.renderer._lowBandSmoothedData=ap[0]}ap=null}}return ar};L.jqplot.LineRenderer.prototype.draw=function(ax,aI,ai,aB){var aC;var aq=L.extend(true,{},ai);var ak=(aq.shadow!=u)?aq.shadow:this.shadow;var aJ=(aq.showLine!=u)?aq.showLine:this.showLine;var aA=(aq.fill!=u)?aq.fill:this.fill;var ah=(aq.fillAndStroke!=u)?aq.fillAndStroke:this.fillAndStroke;var ar,ay,av,aE;ax.save();if(aI.length){if(aJ){if(aA){if(this.fillToZero){var aF=this.negativeColor;if(!this.useNegativeColors){aF=aq.fillStyle}var ao=false;var ap=aq.fillStyle;if(ah){var aH=aI.slice(0)}if(this.index==0||!this._stack){var aw=[];var aL=(this.renderer.smooth)?this.renderer._smoothedPlotData:this._plotData;this._areaPoints=[];var aG=this._yaxis.series_u2p(this.fillToValue);var aj=this._xaxis.series_u2p(this.fillToValue);aq.closePath=true;if(this.fillAxis=="y"){aw.push([aI[0][0],aG]);this._areaPoints.push([aI[0][0],aG]);for(var aC=0;aC<aI.length-1;aC++){aw.push(aI[aC]);this._areaPoints.push(aI[aC]);if(aL[aC][1]*aL[aC+1][1]<=0){if(aL[aC][1]<0){ao=true;aq.fillStyle=aF}else{ao=false;aq.fillStyle=ap}var an=aI[aC][0]+(aI[aC+1][0]-aI[aC][0])*(aG-aI[aC][1])/(aI[aC+1][1]-aI[aC][1]);aw.push([an,aG]);this._areaPoints.push([an,aG]);if(ak){this.renderer.shadowRenderer.draw(ax,aw,aq)}this.renderer.shapeRenderer.draw(ax,aw,aq);aw=[[an,aG]]}}if(aL[aI.length-1][1]<0){ao=true;aq.fillStyle=aF}else{ao=false;aq.fillStyle=ap}aw.push(aI[aI.length-1]);this._areaPoints.push(aI[aI.length-1]);aw.push([aI[aI.length-1][0],aG]);this._areaPoints.push([aI[aI.length-1][0],aG])}if(ak){this.renderer.shadowRenderer.draw(ax,aw,aq)}this.renderer.shapeRenderer.draw(ax,aw,aq)}else{var au=this._prevGridData;for(var aC=au.length;aC>0;aC--){aI.push(au[aC-1])}if(ak){this.renderer.shadowRenderer.draw(ax,aI,aq)}this._areaPoints=aI;this.renderer.shapeRenderer.draw(ax,aI,aq)}}else{if(ah){var aH=aI.slice(0)}if(this.index==0||!this._stack){var al=ax.canvas.height;aI.unshift([aI[0][0],al]);var aD=aI.length;aI.push([aI[aD-1][0],al])}else{var au=this._prevGridData;for(var aC=au.length;aC>0;aC--){aI.push(au[aC-1])}}this._areaPoints=aI;if(ak){this.renderer.shadowRenderer.draw(ax,aI,aq)}this.renderer.shapeRenderer.draw(ax,aI,aq)}if(ah){var az=L.extend(true,{},aq,{fill:false,closePath:false});this.renderer.shapeRenderer.draw(ax,aH,az);if(this.markerRenderer.show){if(this.renderer.smooth){aH=this.gridData}for(aC=0;aC<aH.length;aC++){this.markerRenderer.draw(aH[aC][0],aH[aC][1],ax,aq.markerOptions)}}}}else{if(this.renderer.bands.show){var am;var aK=L.extend(true,{},aq);if(this.renderer.bands.showLines){am=(this.renderer.smooth)?this.renderer._hiBandSmoothedData:this.renderer._hiBandGridData;this.renderer.shapeRenderer.draw(ax,am,aq);am=(this.renderer.smooth)?this.renderer._lowBandSmoothedData:this.renderer._lowBandGridData;this.renderer.shapeRenderer.draw(ax,am,aK)}if(this.renderer.bands.fill){if(this.renderer.smooth){am=this.renderer._hiBandSmoothedData.concat(this.renderer._lowBandSmoothedData.reverse())}else{am=this.renderer._hiBandGridData.concat(this.renderer._lowBandGridData.reverse())}this._areaPoints=am;aK.closePath=true;aK.fill=true;aK.fillStyle=this.renderer.bands.fillColor;this.renderer.shapeRenderer.draw(ax,am,aK)}}if(ak){this.renderer.shadowRenderer.draw(ax,aI,aq)}this.renderer.shapeRenderer.draw(ax,aI,aq)}}var ar=av=ay=aE=null;for(aC=0;aC<this._areaPoints.length;aC++){var at=this._areaPoints[aC];if(ar>at[0]||ar==null){ar=at[0]}if(aE<at[1]||aE==null){aE=at[1]}if(av<at[0]||av==null){av=at[0]}if(ay>at[1]||ay==null){ay=at[1]}}if(this.type==="line"&&this.renderer.bands.show){aE=this._yaxis.series_u2p(this.renderer.bands._min);ay=this._yaxis.series_u2p(this.renderer.bands._max)}this._boundingBox=[[ar,aE],[av,ay]];if(this.markerRenderer.show&&!aA){if(this.renderer.smooth){aI=this.gridData}for(aC=0;aC<aI.length;aC++){if(aI[aC][0]!=null&&aI[aC][1]!=null){this.markerRenderer.draw(aI[aC][0],aI[aC][1],ax,aq.markerOptions)}}}}ax.restore()};L.jqplot.LineRenderer.prototype.drawShadow=function(ah,aj,ai){};function z(ak,aj,ah){for(var ai=0;ai<this.series.length;ai++){if(this.series[ai].renderer.constructor==L.jqplot.LineRenderer){if(this.series[ai].highlightMouseOver){this.series[ai].highlightMouseDown=false}}}}function af(){if(this.plugins.lineRenderer&&this.plugins.lineRenderer.highlightCanvas){this.plugins.lineRenderer.highlightCanvas.resetCanvas();this.plugins.lineRenderer.highlightCanvas=null}this.plugins.lineRenderer.highlightedSeriesIndex=null;this.plugins.lineRenderer.highlightCanvas=new L.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.lineRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-lineRenderer-highlight-canvas",this._plotDimensions,this));this.plugins.lineRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind("mouseleave",{plot:this},function(ah){aa(ah.data.plot)})}function ac(an,am,ak,aj){var ai=an.series[am];var ah=an.plugins.lineRenderer.highlightCanvas;ah._ctx.clearRect(0,0,ah._ctx.canvas.width,ah._ctx.canvas.height);ai._highlightedPoint=ak;an.plugins.lineRenderer.highlightedSeriesIndex=am;var al={fillStyle:ai.highlightColor};if(ai.type==="line"&&ai.renderer.bands.show){al.fill=true;al.closePath=true}ai.renderer.shapeRenderer.draw(ah._ctx,aj,al);ah=null}function aa(aj){var ah=aj.plugins.lineRenderer.highlightCanvas;ah._ctx.clearRect(0,0,ah._ctx.canvas.width,ah._ctx.canvas.height);for(var ai=0;ai<aj.series.length;ai++){aj.series[ai]._highlightedPoint=null}aj.plugins.lineRenderer.highlightedSeriesIndex=null;aj.target.trigger("jqplotDataUnhighlight");ah=null}function h(al,ak,ao,an,am){if(an){var aj=[an.seriesIndex,an.pointIndex,an.data];var ai=jQuery.Event("jqplotDataMouseOver");ai.pageX=al.pageX;ai.pageY=al.pageY;am.target.trigger(ai,aj);if(am.series[aj[0]].highlightMouseOver&&!(aj[0]==am.plugins.lineRenderer.highlightedSeriesIndex)){var ah=jQuery.Event("jqplotDataHighlight");ah.which=al.which;ah.pageX=al.pageX;ah.pageY=al.pageY;am.target.trigger(ah,aj);ac(am,an.seriesIndex,an.pointIndex,an.points)}}else{if(an==null){aa(am)}}}function e(ak,aj,an,am,al){if(am){var ai=[am.seriesIndex,am.pointIndex,am.data];if(al.series[ai[0]].highlightMouseDown&&!(ai[0]==al.plugins.lineRenderer.highlightedSeriesIndex)){var ah=jQuery.Event("jqplotDataHighlight");ah.which=ak.which;ah.pageX=ak.pageX;ah.pageY=ak.pageY;al.target.trigger(ah,ai);ac(al,am.seriesIndex,am.pointIndex,am.points)}}else{if(am==null){aa(al)}}}function ad(aj,ai,am,al,ak){var ah=ak.plugins.lineRenderer.highlightedSeriesIndex;if(ah!=null&&ak.series[ah].highlightMouseDown){aa(ak)}}function g(ak,aj,an,am,al){if(am){var ai=[am.seriesIndex,am.pointIndex,am.data];var ah=jQuery.Event("jqplotDataClick");ah.which=ak.which;ah.pageX=ak.pageX;ah.pageY=ak.pageY;al.target.trigger(ah,ai)}}function s(al,ak,ao,an,am){if(an){var aj=[an.seriesIndex,an.pointIndex,an.data];var ah=am.plugins.lineRenderer.highlightedSeriesIndex;if(ah!=null&&am.series[ah].highlightMouseDown){aa(am)}var ai=jQuery.Event("jqplotDataRightClick");ai.which=al.which;ai.pageX=al.pageX;ai.pageY=al.pageY;am.target.trigger(ai,aj)}}L.jqplot.LinearAxisRenderer=function(){};L.jqplot.LinearAxisRenderer.prototype.init=function(ah){this.breakPoints=null;this.breakTickLabel="&asymp;";this.drawBaseline=true;this.baselineWidth=null;this.baselineColor=null;this.forceTickAt0=false;this.forceTickAt100=false;this.tickInset=0;this.minorTicks=0;this.alignTicks=false;this._autoFormatString="";this._overrideFormatString=false;this._scalefact=1;L.extend(true,this,ah);if(this.breakPoints){if(!L.isArray(this.breakPoints)){this.breakPoints=null}else{if(this.breakPoints.length<2||this.breakPoints[1]<=this.breakPoints[0]){this.breakPoints=null}}}if(this.numberTicks!=null&&this.numberTicks<2){this.numberTicks=2}this.resetDataBounds()};L.jqplot.LinearAxisRenderer.prototype.draw=function(ah,ao){if(this.show){this.renderer.createTicks.call(this,ao);var an=0;var ai;if(this._elem){this._elem.emptyForce();this._elem=null}this._elem=L(document.createElement("div"));this._elem.addClass("jqplot-axis jqplot-"+this.name);this._elem.css("position","absolute");if(this.name=="xaxis"||this.name=="x2axis"){this._elem.width(this._plotDimensions.width)}else{this._elem.height(this._plotDimensions.height)}this.labelOptions.axis=this.name;this._label=new this.labelRenderer(this.labelOptions);if(this._label.show){var am=this._label.draw(ah,ao);am.appendTo(this._elem);am=null}var al=this._ticks;var ak;for(var aj=0;aj<al.length;aj++){ak=al[aj];if(ak.show&&ak.showLabel&&(!ak.isMinorTick||this.showMinorTicks)){this._elem.append(ak.draw(ah,ao))}}ak=null;al=null}return this._elem};L.jqplot.LinearAxisRenderer.prototype.reset=function(){this.min=this._options.min;this.max=this._options.max;this.tickInterval=this._options.tickInterval;this.numberTicks=this._options.numberTicks;this._autoFormatString="";if(this._overrideFormatString&&this.tickOptions&&this.tickOptions.formatString){this.tickOptions.formatString=""}};L.jqplot.LinearAxisRenderer.prototype.set=function(){var ao=0;var aj;var ai=0;var an=0;var ah=(this._label==null)?false:this._label.show;if(this.show){var am=this._ticks;var al;for(var ak=0;ak<am.length;ak++){al=am[ak];if(!al._breakTick&&al.show&&al.showLabel&&(!al.isMinorTick||this.showMinorTicks)){if(this.name=="xaxis"||this.name=="x2axis"){aj=al._elem.outerHeight(true)}else{aj=al._elem.outerWidth(true)}if(aj>ao){ao=aj}}}al=null;am=null;if(ah){ai=this._label._elem.outerWidth(true);an=this._label._elem.outerHeight(true)}if(this.name=="xaxis"){ao=ao+an;this._elem.css({height:ao+"px",left:"0px",bottom:"0px"})}else{if(this.name=="x2axis"){ao=ao+an;this._elem.css({height:ao+"px",left:"0px",top:"0px"})}else{if(this.name=="yaxis"){ao=ao+ai;this._elem.css({width:ao+"px",left:"0px",top:"0px"});if(ah&&this._label.constructor==L.jqplot.AxisLabelRenderer){this._label._elem.css("width",ai+"px")}}else{ao=ao+ai;this._elem.css({width:ao+"px",right:"0px",top:"0px"});if(ah&&this._label.constructor==L.jqplot.AxisLabelRenderer){this._label._elem.css("width",ai+"px")}}}}}};L.jqplot.LinearAxisRenderer.prototype.createTicks=function(aj){var aT=this._ticks;var aK=this.ticks;var az=this.name;var aB=this._dataBounds;var ah=(this.name.charAt(0)==="x")?this._plotDimensions.width:this._plotDimensions.height;var an;var a6,aI;var ap,ao;var a4,a0;var aH=this.min;var a5=this.max;var aW=this.numberTicks;var ba=this.tickInterval;var am=30;this._scalefact=(Math.max(ah,am+1)-am)/300;if(aK.length){for(a0=0;a0<aK.length;a0++){var aO=aK[a0];var aU=new this.tickRenderer(this.tickOptions);if(L.isArray(aO)){aU.value=aO[0];if(this.breakPoints){if(aO[0]==this.breakPoints[0]){aU.label=this.breakTickLabel;aU._breakTick=true;aU.showGridline=false;aU.showMark=false}else{if(aO[0]>this.breakPoints[0]&&aO[0]<=this.breakPoints[1]){aU.show=false;aU.showGridline=false;aU.label=aO[1]}else{aU.label=aO[1]}}}else{aU.label=aO[1]}aU.setTick(aO[0],this.name);this._ticks.push(aU)}else{if(L.isPlainObject(aO)){L.extend(true,aU,aO);aU.axis=this.name;this._ticks.push(aU)}else{aU.value=aO;if(this.breakPoints){if(aO==this.breakPoints[0]){aU.label=this.breakTickLabel;aU._breakTick=true;aU.showGridline=false;aU.showMark=false}else{if(aO>this.breakPoints[0]&&aO<=this.breakPoints[1]){aU.show=false;aU.showGridline=false}}}aU.setTick(aO,this.name);this._ticks.push(aU)}}}this.numberTicks=aK.length;this.min=this._ticks[0].value;this.max=this._ticks[this.numberTicks-1].value;this.tickInterval=(this.max-this.min)/(this.numberTicks-1)}else{if(az=="xaxis"||az=="x2axis"){ah=this._plotDimensions.width}else{ah=this._plotDimensions.height}var ax=this.numberTicks;if(this.alignTicks){if(this.name==="x2axis"&&aj.axes.xaxis.show){ax=aj.axes.xaxis.numberTicks}else{if(this.name.charAt(0)==="y"&&this.name!=="yaxis"&&this.name!=="yMidAxis"&&aj.axes.yaxis.show){ax=aj.axes.yaxis.numberTicks}}}a6=((this.min!=null)?this.min:aB.min);aI=((this.max!=null)?this.max:aB.max);var av=aI-a6;var aS,ay;var at;if(this.tickOptions==null||!this.tickOptions.formatString){this._overrideFormatString=true}if(this.min==null||this.max==null&&this.tickInterval==null&&!this.autoscale){if(this.forceTickAt0){if(a6>0){a6=0}if(aI<0){aI=0}}if(this.forceTickAt100){if(a6>100){a6=100}if(aI<100){aI=100}}var aE=false,a1=false;if(this.min!=null){aE=true}else{if(this.max!=null){a1=true}}var aP=L.jqplot.LinearTickGenerator(a6,aI,this._scalefact,ax,aE,a1);var aw=(this.min!=null)?a6:a6+av*(this.padMin-1);var aQ=(this.max!=null)?aI:aI-av*(this.padMax-1);if(a6<aw||aI>aQ){aw=(this.min!=null)?a6:a6-av*(this.padMin-1);aQ=(this.max!=null)?aI:aI+av*(this.padMax-1);aP=L.jqplot.LinearTickGenerator(aw,aQ,this._scalefact,ax,aE,a1)}this.min=aP[0];this.max=aP[1];this.numberTicks=aP[2];this._autoFormatString=aP[3];this.tickInterval=aP[4]}else{if(a6==aI){var ai=0.05;if(a6>0){ai=Math.max(Math.log(a6)/Math.LN10,0.05)}a6-=ai;aI+=ai}if(this.autoscale&&this.min==null&&this.max==null){var ak,al,ar;var aC=false;var aN=false;var aA={min:null,max:null,average:null,stddev:null};for(var a0=0;a0<this._series.length;a0++){var aV=this._series[a0];var aD=(aV.fillAxis=="x")?aV._xaxis.name:aV._yaxis.name;if(this.name==aD){var aR=aV._plotValues[aV.fillAxis];var aG=aR[0];var a2=aR[0];for(var aZ=1;aZ<aR.length;aZ++){if(aR[aZ]<aG){aG=aR[aZ]}else{if(aR[aZ]>a2){a2=aR[aZ]}}}var au=(a2-aG)/a2;if(aV.renderer.constructor==L.jqplot.BarRenderer){if(aG>=0&&(aV.fillToZero||au>0.1)){aC=true}else{aC=false;if(aV.fill&&aV.fillToZero&&aG<0&&a2>0){aN=true}else{aN=false}}}else{if(aV.fill){if(aG>=0&&(aV.fillToZero||au>0.1)){aC=true}else{if(aG<0&&a2>0&&aV.fillToZero){aC=false;aN=true}else{aC=false;aN=false}}}else{if(aG<0){aC=false}}}}}if(aC){this.numberTicks=2+Math.ceil((ah-(this.tickSpacing-1))/this.tickSpacing);this.min=0;aH=0;al=aI/(this.numberTicks-1);at=Math.pow(10,Math.abs(Math.floor(Math.log(al)/Math.LN10)));if(al/at==parseInt(al/at,10)){al+=at}this.tickInterval=Math.ceil(al/at)*at;this.max=this.tickInterval*(this.numberTicks-1)}else{if(aN){this.numberTicks=2+Math.ceil((ah-(this.tickSpacing-1))/this.tickSpacing);var aJ=Math.ceil(Math.abs(a6)/av*(this.numberTicks-1));var a9=this.numberTicks-1-aJ;al=Math.max(Math.abs(a6/aJ),Math.abs(aI/a9));at=Math.pow(10,Math.abs(Math.floor(Math.log(al)/Math.LN10)));this.tickInterval=Math.ceil(al/at)*at;this.max=this.tickInterval*a9;this.min=-this.tickInterval*aJ}else{if(this.numberTicks==null){if(this.tickInterval){this.numberTicks=3+Math.ceil(av/this.tickInterval)}else{this.numberTicks=2+Math.ceil((ah-(this.tickSpacing-1))/this.tickSpacing)}}if(this.tickInterval==null){al=av/(this.numberTicks-1);if(al<1){at=Math.pow(10,Math.abs(Math.floor(Math.log(al)/Math.LN10)))}else{at=1}this.tickInterval=Math.ceil(al*at*this.pad)/at}else{at=1/this.tickInterval}ak=this.tickInterval*(this.numberTicks-1);ar=(ak-av)/2;if(this.min==null){this.min=Math.floor(at*(a6-ar))/at}if(this.max==null){this.max=this.min+ak}}}var aF=L.jqplot.getSignificantFigures(this.tickInterval);var aM;if(aF.digitsLeft>=aF.significantDigits){aM="%d"}else{var at=Math.max(0,5-aF.digitsLeft);at=Math.min(at,aF.digitsRight);aM="%."+at+"f"}this._autoFormatString=aM}else{aS=(this.min!=null)?this.min:a6-av*(this.padMin-1);ay=(this.max!=null)?this.max:aI+av*(this.padMax-1);av=ay-aS;if(this.numberTicks==null){if(this.tickInterval!=null){this.numberTicks=Math.ceil((ay-aS)/this.tickInterval)+1}else{if(ah>100){this.numberTicks=parseInt(3+(ah-100)/75,10)}else{this.numberTicks=2}}}if(this.tickInterval==null){this.tickInterval=av/(this.numberTicks-1)}if(this.max==null){ay=aS+this.tickInterval*(this.numberTicks-1)}if(this.min==null){aS=ay-this.tickInterval*(this.numberTicks-1)}var aF=L.jqplot.getSignificantFigures(this.tickInterval);var aM;if(aF.digitsLeft>=aF.significantDigits){aM="%d"}else{var at=Math.max(0,5-aF.digitsLeft);at=Math.min(at,aF.digitsRight);aM="%."+at+"f"}this._autoFormatString=aM;this.min=aS;this.max=ay}if(this.renderer.constructor==L.jqplot.LinearAxisRenderer&&this._autoFormatString==""){av=this.max-this.min;var a7=new this.tickRenderer(this.tickOptions);var aL=a7.formatString||L.jqplot.config.defaultTickFormatString;var aL=aL.match(L.jqplot.sprintf.regex)[0];var a3=0;if(aL){if(aL.search(/[fFeEgGpP]/)>-1){var aY=aL.match(/\%\.(\d{0,})?[eEfFgGpP]/);if(aY){a3=parseInt(aY[1],10)}else{a3=6}}else{if(aL.search(/[di]/)>-1){a3=0}}var aq=Math.pow(10,-a3);if(this.tickInterval<aq){if(aW==null&&ba==null){this.tickInterval=aq;if(a5==null&&aH==null){this.min=Math.floor(this._dataBounds.min/aq)*aq;if(this.min==this._dataBounds.min){this.min=this._dataBounds.min-this.tickInterval}this.max=Math.ceil(this._dataBounds.max/aq)*aq;if(this.max==this._dataBounds.max){this.max=this._dataBounds.max+this.tickInterval}var aX=(this.max-this.min)/this.tickInterval;aX=aX.toFixed(11);aX=Math.ceil(aX);this.numberTicks=aX+1}else{if(a5==null){var aX=(this._dataBounds.max-this.min)/this.tickInterval;aX=aX.toFixed(11);this.numberTicks=Math.ceil(aX)+2;this.max=this.min+this.tickInterval*(this.numberTicks-1)}else{if(aH==null){var aX=(this.max-this._dataBounds.min)/this.tickInterval;aX=aX.toFixed(11);this.numberTicks=Math.ceil(aX)+2;this.min=this.max-this.tickInterval*(this.numberTicks-1)}else{this.numberTicks=Math.ceil((a5-aH)/this.tickInterval)+1;this.min=Math.floor(aH*Math.pow(10,a3))/Math.pow(10,a3);this.max=Math.ceil(a5*Math.pow(10,a3))/Math.pow(10,a3);this.numberTicks=Math.ceil((this.max-this.min)/this.tickInterval)+1}}}}}}}}if(this._overrideFormatString&&this._autoFormatString!=""){this.tickOptions=this.tickOptions||{};this.tickOptions.formatString=this._autoFormatString}var aU,a8;for(var a0=0;a0<this.numberTicks;a0++){a4=this.min+a0*this.tickInterval;aU=new this.tickRenderer(this.tickOptions);aU.setTick(a4,this.name);this._ticks.push(aU);if(a0<this.numberTicks-1){for(var aZ=0;aZ<this.minorTicks;aZ++){a4+=this.tickInterval/(this.minorTicks+1);a8=L.extend(true,{},this.tickOptions,{name:this.name,value:a4,label:"",isMinorTick:true});aU=new this.tickRenderer(a8);this._ticks.push(aU)}}aU=null}}if(this.tickInset){this.min=this.min-this.tickInset*this.tickInterval;this.max=this.max+this.tickInset*this.tickInterval}aT=null};L.jqplot.LinearAxisRenderer.prototype.resetTickValues=function(aj){if(L.isArray(aj)&&aj.length==this._ticks.length){var ai;for(var ah=0;ah<aj.length;ah++){ai=this._ticks[ah];ai.value=aj[ah];ai.label=ai.formatter(ai.formatString,aj[ah]);ai.label=ai.prefix+ai.label;ai._elem.html(ai.label)}ai=null;this.min=L.jqplot.arrayMin(aj);this.max=L.jqplot.arrayMax(aj);this.pack()}};L.jqplot.LinearAxisRenderer.prototype.pack=function(aj,ai){aj=aj||{};ai=ai||this._offsets;var ay=this._ticks;var au=this.max;var at=this.min;var ao=ai.max;var am=ai.min;var aq=(this._label==null)?false:this._label.show;for(var ar in aj){this._elem.css(ar,aj[ar])}this._offsets=ai;var ak=ao-am;var al=au-at;if(this.breakPoints){al=al-this.breakPoints[1]+this.breakPoints[0];this.p2u=function(aA){return(aA-am)*al/ak+at};this.u2p=function(aA){if(aA>this.breakPoints[0]&&aA<this.breakPoints[1]){aA=this.breakPoints[0]}if(aA<=this.breakPoints[0]){return(aA-at)*ak/al+am}else{return(aA-this.breakPoints[1]+this.breakPoints[0]-at)*ak/al+am}};if(this.name.charAt(0)=="x"){this.series_u2p=function(aA){if(aA>this.breakPoints[0]&&aA<this.breakPoints[1]){aA=this.breakPoints[0]}if(aA<=this.breakPoints[0]){return(aA-at)*ak/al}else{return(aA-this.breakPoints[1]+this.breakPoints[0]-at)*ak/al}};this.series_p2u=function(aA){return aA*al/ak+at}}else{this.series_u2p=function(aA){if(aA>this.breakPoints[0]&&aA<this.breakPoints[1]){aA=this.breakPoints[0]}if(aA>=this.breakPoints[1]){return(aA-au)*ak/al}else{return(aA+this.breakPoints[1]-this.breakPoints[0]-au)*ak/al}};this.series_p2u=function(aA){return aA*al/ak+au}}}else{this.p2u=function(aA){return(aA-am)*al/ak+at};this.u2p=function(aA){return(aA-at)*ak/al+am};if(this.name=="xaxis"||this.name=="x2axis"){this.series_u2p=function(aA){return(aA-at)*ak/al};this.series_p2u=function(aA){return aA*al/ak+at}}else{this.series_u2p=function(aA){return(aA-au)*ak/al};this.series_p2u=function(aA){return aA*al/ak+au}}}if(this.show){if(this.name=="xaxis"||this.name=="x2axis"){for(var av=0;av<ay.length;av++){var ap=ay[av];if(ap.show&&ap.showLabel){var ah;if(ap.constructor==L.jqplot.CanvasAxisTickRenderer&&ap.angle){var ax=(this.name=="xaxis")?1:-1;switch(ap.labelPosition){case"auto":if(ax*ap.angle<0){ah=-ap.getWidth()+ap._textRenderer.height*Math.sin(-ap._textRenderer.angle)/2}else{ah=-ap._textRenderer.height*Math.sin(ap._textRenderer.angle)/2}break;case"end":ah=-ap.getWidth()+ap._textRenderer.height*Math.sin(-ap._textRenderer.angle)/2;break;case"start":ah=-ap._textRenderer.height*Math.sin(ap._textRenderer.angle)/2;break;case"middle":ah=-ap.getWidth()/2+ap._textRenderer.height*Math.sin(-ap._textRenderer.angle)/2;break;default:ah=-ap.getWidth()/2+ap._textRenderer.height*Math.sin(-ap._textRenderer.angle)/2;break}}else{ah=-ap.getWidth()/2}var az=this.u2p(ap.value)+ah+"px";ap._elem.css("left",az);ap.pack()}}if(aq){var an=this._label._elem.outerWidth(true);this._label._elem.css("left",am+ak/2-an/2+"px");if(this.name=="xaxis"){this._label._elem.css("bottom","0px")}else{this._label._elem.css("top","0px")}this._label.pack()}}else{for(var av=0;av<ay.length;av++){var ap=ay[av];if(ap.show&&ap.showLabel){var ah;if(ap.constructor==L.jqplot.CanvasAxisTickRenderer&&ap.angle){var ax=(this.name=="yaxis")?1:-1;switch(ap.labelPosition){case"auto":case"end":if(ax*ap.angle<0){ah=-ap._textRenderer.height*Math.cos(-ap._textRenderer.angle)/2}else{ah=-ap.getHeight()+ap._textRenderer.height*Math.cos(ap._textRenderer.angle)/2}break;case"start":if(ap.angle>0){ah=-ap._textRenderer.height*Math.cos(-ap._textRenderer.angle)/2}else{ah=-ap.getHeight()+ap._textRenderer.height*Math.cos(ap._textRenderer.angle)/2}break;case"middle":ah=-ap.getHeight()/2;break;default:ah=-ap.getHeight()/2;break}}else{ah=-ap.getHeight()/2}var az=this.u2p(ap.value)+ah+"px";ap._elem.css("top",az);ap.pack()}}if(aq){var aw=this._label._elem.outerHeight(true);this._label._elem.css("top",ao-ak/2-aw/2+"px");if(this.name=="yaxis"){this._label._elem.css("left","0px")}else{this._label._elem.css("right","0px")}this._label.pack()}}}ay=null};function i(ai){var ah;ai=Math.abs(ai);if(ai>=10){ah="%d"}else{if(ai>1){if(ai===parseInt(ai,10)){ah="%d"}else{ah="%.1f"}}else{var aj=-Math.floor(Math.log(ai)/Math.LN10);ah="%."+aj+"f"}}return ah}var b=[0.1,0.2,0.3,0.4,0.5,0.8,1,2,3,4,5];var c=function(ai){var ah=b.indexOf(ai);if(ah>0){return b[ah-1]}else{return b[b.length-1]/100}};var k=function(ai){var ah=b.indexOf(ai);if(ah<b.length-1){return b[ah+1]}else{return b[0]*100}};function d(al,au,at){var aq=Math.floor(at/2);var ai=Math.ceil(at*1.5);var ak=Number.MAX_VALUE;var ah=(au-al);var ax;var ap;var ar;var ay=L.jqplot.getSignificantFigures;var aw;var an;var ao;var av;for(var am=0,aj=ai-aq+1;am<aj;am++){ao=aq+am;ax=ah/(ao-1);ap=ay(ax);ax=Math.abs(at-ao)+ap.digitsRight;if(ax<ak){ak=ax;ar=ao;av=ap.digitsRight}else{if(ax===ak){if(ap.digitsRight<av){ar=ao;av=ap.digitsRight}}}}aw=Math.max(av,Math.max(ay(al).digitsRight,ay(au).digitsRight));if(aw===0){an="%d"}else{an="%."+aw+"f"}ax=ah/(ar-1);return[al,au,ar,an,ax]}function W(ai,al){al=al||7;var ak=ai/(al-1);var aj=Math.pow(10,Math.floor(Math.log(ak)/Math.LN10));var am=ak/aj;var ah;if(aj<1){if(am>5){ah=10*aj}else{if(am>2){ah=5*aj}else{if(am>1){ah=2*aj}else{ah=aj}}}}else{if(am>5){ah=10*aj}else{if(am>4){ah=5*aj}else{if(am>3){ah=4*aj}else{if(am>2){ah=3*aj}else{if(am>1){ah=2*aj}else{ah=aj}}}}}}return ah}function Q(ai,ah){ah=ah||1;var ak=Math.floor(Math.log(ai)/Math.LN10);var am=Math.pow(10,ak);var al=ai/am;var aj;al=al/ah;if(al<=0.38){aj=0.1}else{if(al<=1.6){aj=0.2}else{if(al<=4){aj=0.5}else{if(al<=8){aj=1}else{if(al<=16){aj=2}else{aj=5}}}}}return aj*am}function x(aj,ai){var al=Math.floor(Math.log(aj)/Math.LN10);var an=Math.pow(10,al);var am=aj/an;var ah;var ak;am=am/ai;if(am<=0.38){ak=0.1}else{if(am<=1.6){ak=0.2}else{if(am<=4){ak=0.5}else{if(am<=8){ak=1}else{if(am<=16){ak=2}else{ak=5}}}}}ah=ak*an;return[ah,ak,an]}L.jqplot.LinearTickGenerator=function(an,aq,aj,ak,ao,ar){ao=(ao===null)?false:ao;ar=(ar===null||ao)?false:ar;if(an===aq){aq=(aq)?0:1}aj=aj||1;if(aq<an){var at=aq;aq=an;an=at}var ai=[];var aw=Q(aq-an,aj);var av=L.jqplot.getSignificantFigures;if(ak==null){if(!ao&&!ar){ai[0]=Math.floor(an/aw)*aw;ai[1]=Math.ceil(aq/aw)*aw;ai[2]=Math.round((ai[1]-ai[0])/aw+1);ai[3]=i(aw);ai[4]=aw}else{if(ao){ai[0]=an;ai[2]=Math.ceil((aq-an)/aw+1);ai[1]=an+(ai[2]-1)*aw;var au=av(an).digitsRight;var ap=av(aw).digitsRight;if(au<ap){ai[3]=i(aw)}else{ai[3]="%."+au+"f"}ai[4]=aw}else{if(ar){ai[1]=aq;ai[2]=Math.ceil((aq-an)/aw+1);ai[0]=aq-(ai[2]-1)*aw;var al=av(aq).digitsRight;var ap=av(aw).digitsRight;if(al<ap){ai[3]=i(aw)}else{ai[3]="%."+al+"f"}ai[4]=aw}}}}else{var am=[];am[0]=Math.floor(an/aw)*aw;am[1]=Math.ceil(aq/aw)*aw;am[2]=Math.round((am[1]-am[0])/aw+1);am[3]=i(aw);am[4]=aw;if(am[2]===ak){ai=am}else{var ah=W(am[1]-am[0],ak);ai[0]=am[0];ai[2]=ak;ai[4]=ah;ai[3]=i(ah);ai[1]=ai[0]+(ai[2]-1)*ai[4]}}return ai};L.jqplot.LinearTickGenerator.bestLinearInterval=Q;L.jqplot.LinearTickGenerator.bestInterval=W;L.jqplot.LinearTickGenerator.bestLinearComponents=x;L.jqplot.LinearTickGenerator.bestConstrainedInterval=d;L.jqplot.MarkerRenderer=function(ah){this.show=true;this.style="filledCircle";this.lineWidth=2;this.size=9;this.color="#666666";this.shadow=true;this.shadowAngle=45;this.shadowOffset=1;this.shadowDepth=3;this.shadowAlpha="0.07";this.shadowRenderer=new L.jqplot.ShadowRenderer();this.shapeRenderer=new L.jqplot.ShapeRenderer();L.extend(true,this,ah)};L.jqplot.MarkerRenderer.prototype.init=function(ah){L.extend(true,this,ah);var aj={angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,lineWidth:this.lineWidth,depth:this.shadowDepth,closePath:true};if(this.style.indexOf("filled")!=-1){aj.fill=true}if(this.style.indexOf("ircle")!=-1){aj.isarc=true;aj.closePath=false}this.shadowRenderer.init(aj);var ai={fill:false,isarc:false,strokeStyle:this.color,fillStyle:this.color,lineWidth:this.lineWidth,closePath:true};if(this.style.indexOf("filled")!=-1){ai.fill=true}if(this.style.indexOf("ircle")!=-1){ai.isarc=true;ai.closePath=false}this.shapeRenderer.init(ai)};L.jqplot.MarkerRenderer.prototype.drawDiamond=function(aj,ai,am,al,ao){var ah=1.2;var ap=this.size/2/ah;var an=this.size/2*ah;var ak=[[aj-ap,ai],[aj,ai+an],[aj+ap,ai],[aj,ai-an]];if(this.shadow){this.shadowRenderer.draw(am,ak)}this.shapeRenderer.draw(am,ak,ao)};L.jqplot.MarkerRenderer.prototype.drawPlus=function(ak,aj,an,am,aq){var ai=1;var ar=this.size/2*ai;var ao=this.size/2*ai;var ap=[[ak,aj-ao],[ak,aj+ao]];var al=[[ak+ar,aj],[ak-ar,aj]];var ah=L.extend(true,{},this.options,{closePath:false});if(this.shadow){this.shadowRenderer.draw(an,ap,{closePath:false});this.shadowRenderer.draw(an,al,{closePath:false})}this.shapeRenderer.draw(an,ap,ah);this.shapeRenderer.draw(an,al,ah)};L.jqplot.MarkerRenderer.prototype.drawX=function(ak,aj,an,am,aq){var ai=1;var ar=this.size/2*ai;var ao=this.size/2*ai;var ah=L.extend(true,{},this.options,{closePath:false});var ap=[[ak-ar,aj-ao],[ak+ar,aj+ao]];var al=[[ak-ar,aj+ao],[ak+ar,aj-ao]];if(this.shadow){this.shadowRenderer.draw(an,ap,{closePath:false});this.shadowRenderer.draw(an,al,{closePath:false})}this.shapeRenderer.draw(an,ap,ah);this.shapeRenderer.draw(an,al,ah)};L.jqplot.MarkerRenderer.prototype.drawDash=function(aj,ai,am,al,ao){var ah=1;var ap=this.size/2*ah;var an=this.size/2*ah;var ak=[[aj-ap,ai],[aj+ap,ai]];if(this.shadow){this.shadowRenderer.draw(am,ak)}this.shapeRenderer.draw(am,ak,ao)};L.jqplot.MarkerRenderer.prototype.drawLine=function(am,al,ah,ak,ai){var aj=[am,al];if(this.shadow){this.shadowRenderer.draw(ah,aj)}this.shapeRenderer.draw(ah,aj,ai)};L.jqplot.MarkerRenderer.prototype.drawSquare=function(aj,ai,am,al,ao){var ah=1;var ap=this.size/2/ah;var an=this.size/2*ah;var ak=[[aj-ap,ai-an],[aj-ap,ai+an],[aj+ap,ai+an],[aj+ap,ai-an]];if(this.shadow){this.shadowRenderer.draw(am,ak)}this.shapeRenderer.draw(am,ak,ao)};L.jqplot.MarkerRenderer.prototype.drawCircle=function(ai,ao,ak,an,al){var ah=this.size/2;var aj=2*Math.PI;var am=[ai,ao,ah,0,aj,true];if(this.shadow){this.shadowRenderer.draw(ak,am)}this.shapeRenderer.draw(ak,am,al)};L.jqplot.MarkerRenderer.prototype.draw=function(ah,ak,ai,aj){aj=aj||{};if(aj.show==null||aj.show!=false){if(aj.color&&!aj.fillStyle){aj.fillStyle=aj.color}if(aj.color&&!aj.strokeStyle){aj.strokeStyle=aj.color}switch(this.style){case"diamond":this.drawDiamond(ah,ak,ai,false,aj);break;case"filledDiamond":this.drawDiamond(ah,ak,ai,true,aj);break;case"circle":this.drawCircle(ah,ak,ai,false,aj);break;case"filledCircle":this.drawCircle(ah,ak,ai,true,aj);break;case"square":this.drawSquare(ah,ak,ai,false,aj);break;case"filledSquare":this.drawSquare(ah,ak,ai,true,aj);break;case"x":this.drawX(ah,ak,ai,true,aj);break;case"plus":this.drawPlus(ah,ak,ai,true,aj);break;case"dash":this.drawDash(ah,ak,ai,true,aj);break;case"line":this.drawLine(ah,ak,ai,false,aj);break;default:this.drawDiamond(ah,ak,ai,false,aj);break}}};L.jqplot.ShadowRenderer=function(ah){this.angle=45;this.offset=1;this.alpha=0.07;this.lineWidth=1.5;this.lineJoin="miter";this.lineCap="round";this.closePath=false;this.fill=false;this.depth=3;this.strokeStyle="rgba(0,0,0,0.1)";this.isarc=false;L.extend(true,this,ah)};L.jqplot.ShadowRenderer.prototype.init=function(ah){L.extend(true,this,ah)};L.jqplot.ShadowRenderer.prototype.draw=function(av,at,ax){av.save();var ah=(ax!=null)?ax:{};var au=(ah.fill!=null)?ah.fill:this.fill;var ap=(ah.fillRect!=null)?ah.fillRect:this.fillRect;var ao=(ah.closePath!=null)?ah.closePath:this.closePath;var al=(ah.offset!=null)?ah.offset:this.offset;var aj=(ah.alpha!=null)?ah.alpha:this.alpha;var an=(ah.depth!=null)?ah.depth:this.depth;var aw=(ah.isarc!=null)?ah.isarc:this.isarc;var aq=(ah.linePattern!=null)?ah.linePattern:this.linePattern;av.lineWidth=(ah.lineWidth!=null)?ah.lineWidth:this.lineWidth;av.lineJoin=(ah.lineJoin!=null)?ah.lineJoin:this.lineJoin;av.lineCap=(ah.lineCap!=null)?ah.lineCap:this.lineCap;av.strokeStyle=ah.strokeStyle||this.strokeStyle||"rgba(0,0,0,"+aj+")";av.fillStyle=ah.fillStyle||this.fillStyle||"rgba(0,0,0,"+aj+")";for(var ak=0;ak<an;ak++){var ar=L.jqplot.LinePattern(av,aq);av.translate(Math.cos(this.angle*Math.PI/180)*al,Math.sin(this.angle*Math.PI/180)*al);ar.beginPath();if(aw){av.arc(at[0],at[1],at[2],at[3],at[4],true)}else{if(ap){if(ap){av.fillRect(at[0],at[1],at[2],at[3])}}else{if(at&&at.length){var ai=true;for(var am=0;am<at.length;am++){if(at[am][0]!=null&&at[am][1]!=null){if(ai){ar.moveTo(at[am][0],at[am][1]);ai=false}else{ar.lineTo(at[am][0],at[am][1])}}else{ai=true}}}}}if(ao){ar.closePath()}if(au){av.fill()}else{av.stroke()}}av.restore()};L.jqplot.ShapeRenderer=function(ah){this.lineWidth=1.5;this.linePattern="solid";this.lineJoin="miter";this.lineCap="round";this.closePath=false;this.fill=false;this.isarc=false;this.fillRect=false;this.strokeRect=false;this.clearRect=false;this.strokeStyle="#999999";this.fillStyle="#999999";L.extend(true,this,ah)};L.jqplot.ShapeRenderer.prototype.init=function(ah){L.extend(true,this,ah)};L.jqplot.ShapeRenderer.prototype.draw=function(at,aq,av){at.save();var ah=(av!=null)?av:{};var ar=(ah.fill!=null)?ah.fill:this.fill;var am=(ah.closePath!=null)?ah.closePath:this.closePath;var an=(ah.fillRect!=null)?ah.fillRect:this.fillRect;var ak=(ah.strokeRect!=null)?ah.strokeRect:this.strokeRect;var ai=(ah.clearRect!=null)?ah.clearRect:this.clearRect;var au=(ah.isarc!=null)?ah.isarc:this.isarc;var ao=(ah.linePattern!=null)?ah.linePattern:this.linePattern;var ap=L.jqplot.LinePattern(at,ao);at.lineWidth=ah.lineWidth||this.lineWidth;at.lineJoin=ah.lineJoin||this.lineJoin;at.lineCap=ah.lineCap||this.lineCap;at.strokeStyle=(ah.strokeStyle||ah.color)||this.strokeStyle;at.fillStyle=ah.fillStyle||this.fillStyle;at.beginPath();if(au){at.arc(aq[0],aq[1],aq[2],aq[3],aq[4],true);if(am){at.closePath()}if(ar){at.fill()}else{at.stroke()}at.restore();return}else{if(ai){at.clearRect(aq[0],aq[1],aq[2],aq[3]);at.restore();return}else{if(an||ak){if(an){at.fillRect(aq[0],aq[1],aq[2],aq[3])}if(ak){at.strokeRect(aq[0],aq[1],aq[2],aq[3]);at.restore();return}}else{if(aq&&aq.length){var aj=true;for(var al=0;al<aq.length;al++){if(aq[al][0]!=null&&aq[al][1]!=null){if(aj){ap.moveTo(aq[al][0],aq[al][1]);aj=false}else{ap.lineTo(aq[al][0],aq[al][1])}}else{aj=true}}if(am){ap.closePath()}if(ar){at.fill()}else{at.stroke()}}}}}at.restore()};L.jqplot.TableLegendRenderer=function(){};L.jqplot.TableLegendRenderer.prototype.init=function(ah){L.extend(true,this,ah)};L.jqplot.TableLegendRenderer.prototype.addrow=function(aq,ak,ah,ao){var al=(ah)?this.rowSpacing+"px":"0px";var ap;var aj;var ai;var an;var am;ai=document.createElement("tr");ap=L(ai);ap.addClass("jqplot-table-legend");ai=null;if(ao){ap.prependTo(this._elem)}else{ap.appendTo(this._elem)}if(this.showSwatches){aj=L(document.createElement("td"));aj.addClass("jqplot-table-legend jqplot-table-legend-swatch");aj.css({textAlign:"center",paddingTop:al});an=L(document.createElement("div"));an.addClass("jqplot-table-legend-swatch-outline");am=L(document.createElement("div"));am.addClass("jqplot-table-legend-swatch");am.css({backgroundColor:ak,borderColor:ak});ap.append(aj.append(an.append(am)))}if(this.showLabels){aj=L(document.createElement("td"));aj.addClass("jqplot-table-legend jqplot-table-legend-label");aj.css("paddingTop",al);ap.append(aj);if(this.escapeHtml){aj.text(aq)}else{aj.html(aq)}}aj=null;an=null;am=null;ap=null;ai=null};L.jqplot.TableLegendRenderer.prototype.draw=function(){if(this._elem){this._elem.emptyForce();this._elem=null}if(this.show){var am=this._series;var ai=document.createElement("table");this._elem=L(ai);this._elem.addClass("jqplot-table-legend");var ar={position:"absolute"};if(this.background){ar.background=this.background}if(this.border){ar.border=this.border}if(this.fontSize){ar.fontSize=this.fontSize}if(this.fontFamily){ar.fontFamily=this.fontFamily}if(this.textColor){ar.textColor=this.textColor}if(this.marginTop!=null){ar.marginTop=this.marginTop}if(this.marginBottom!=null){ar.marginBottom=this.marginBottom}if(this.marginLeft!=null){ar.marginLeft=this.marginLeft}if(this.marginRight!=null){ar.marginRight=this.marginRight}var ah=false,ao=false,aq;for(var an=0;an<am.length;an++){aq=am[an];if(aq._stack||aq.renderer.constructor==L.jqplot.BezierCurveRenderer){ao=true}if(aq.show&&aq.showLabel){var al=this.labels[an]||aq.label.toString();if(al){var aj=aq.color;if(ao&&an<am.length-1){ah=true}else{if(ao&&an==am.length-1){ah=false}}this.renderer.addrow.call(this,al,aj,ah,ao);ah=true}for(var ak=0;ak<L.jqplot.addLegendRowHooks.length;ak++){var ap=L.jqplot.addLegendRowHooks[ak].call(this,aq);if(ap){this.renderer.addrow.call(this,ap.label,ap.color,ah);ah=true}}al=null}}}return this._elem};L.jqplot.TableLegendRenderer.prototype.pack=function(aj){if(this.show){if(this.placement=="insideGrid"){switch(this.location){case"nw":var ai=aj.left;var ah=aj.top;this._elem.css("left",ai);this._elem.css("top",ah);break;case"n":var ai=(aj.left+(this._plotDimensions.width-aj.right))/2-this.getWidth()/2;var ah=aj.top;this._elem.css("left",ai);this._elem.css("top",ah);break;case"ne":var ai=aj.right;var ah=aj.top;this._elem.css({right:ai,top:ah});break;case"e":var ai=aj.right;var ah=(aj.top+(this._plotDimensions.height-aj.bottom))/2-this.getHeight()/2;this._elem.css({right:ai,top:ah});break;case"se":var ai=aj.right;var ah=aj.bottom;this._elem.css({right:ai,bottom:ah});break;case"s":var ai=(aj.left+(this._plotDimensions.width-aj.right))/2-this.getWidth()/2;var ah=aj.bottom;this._elem.css({left:ai,bottom:ah});break;case"sw":var ai=aj.left;var ah=aj.bottom;this._elem.css({left:ai,bottom:ah});break;case"w":var ai=aj.left;var ah=(aj.top+(this._plotDimensions.height-aj.bottom))/2-this.getHeight()/2;this._elem.css({left:ai,top:ah});break;default:var ai=aj.right;var ah=aj.bottom;this._elem.css({right:ai,bottom:ah});break}}else{if(this.placement=="outside"){switch(this.location){case"nw":var ai=this._plotDimensions.width-aj.left;var ah=aj.top;this._elem.css("right",ai);this._elem.css("top",ah);break;case"n":var ai=(aj.left+(this._plotDimensions.width-aj.right))/2-this.getWidth()/2;var ah=this._plotDimensions.height-aj.top;this._elem.css("left",ai);this._elem.css("bottom",ah);break;case"ne":var ai=this._plotDimensions.width-aj.right;var ah=aj.top;this._elem.css({left:ai,top:ah});break;case"e":var ai=this._plotDimensions.width-aj.right;var ah=(aj.top+(this._plotDimensions.height-aj.bottom))/2-this.getHeight()/2;this._elem.css({left:ai,top:ah});break;case"se":var ai=this._plotDimensions.width-aj.right;var ah=aj.bottom;this._elem.css({left:ai,bottom:ah});break;case"s":var ai=(aj.left+(this._plotDimensions.width-aj.right))/2-this.getWidth()/2;var ah=this._plotDimensions.height-aj.bottom;this._elem.css({left:ai,top:ah});break;case"sw":var ai=this._plotDimensions.width-aj.left;var ah=aj.bottom;this._elem.css({right:ai,bottom:ah});break;case"w":var ai=this._plotDimensions.width-aj.left;var ah=(aj.top+(this._plotDimensions.height-aj.bottom))/2-this.getHeight()/2;this._elem.css({right:ai,top:ah});break;default:var ai=aj.right;var ah=aj.bottom;this._elem.css({right:ai,bottom:ah});break}}else{switch(this.location){case"nw":this._elem.css({left:0,top:aj.top});break;case"n":var ai=(aj.left+(this._plotDimensions.width-aj.right))/2-this.getWidth()/2;this._elem.css({left:ai,top:aj.top});break;case"ne":this._elem.css({right:0,top:aj.top});break;case"e":var ah=(aj.top+(this._plotDimensions.height-aj.bottom))/2-this.getHeight()/2;this._elem.css({right:aj.right,top:ah});break;case"se":this._elem.css({right:aj.right,bottom:aj.bottom});break;case"s":var ai=(aj.left+(this._plotDimensions.width-aj.right))/2-this.getWidth()/2;this._elem.css({left:ai,bottom:aj.bottom});break;case"sw":this._elem.css({left:aj.left,bottom:aj.bottom});break;case"w":var ah=(aj.top+(this._plotDimensions.height-aj.bottom))/2-this.getHeight()/2;this._elem.css({left:aj.left,top:ah});break;default:this._elem.css({right:aj.right,bottom:aj.bottom});break}}}}};L.jqplot.ThemeEngine=function(){this.themes={};this.activeTheme=null};L.jqplot.ThemeEngine.prototype.init=function(){var ak=new L.jqplot.Theme({_name:"Default"});var an,ai,am;for(an in ak.target){if(an=="textColor"){ak.target[an]=this.target.css("color")}else{ak.target[an]=this.target.css(an)}}if(this.title.show&&this.title._elem){for(an in ak.title){if(an=="textColor"){ak.title[an]=this.title._elem.css("color")}else{ak.title[an]=this.title._elem.css(an)}}}for(an in ak.grid){ak.grid[an]=this.grid[an]}if(ak.grid.backgroundColor==null&&this.grid.background!=null){ak.grid.backgroundColor=this.grid.background}if(this.legend.show&&this.legend._elem){for(an in ak.legend){if(an=="textColor"){ak.legend[an]=this.legend._elem.css("color")}else{ak.legend[an]=this.legend._elem.css(an)}}}var aj;for(ai=0;ai<this.series.length;ai++){aj=this.series[ai];if(aj.renderer.constructor==L.jqplot.LineRenderer){ak.series.push(new p())}else{if(aj.renderer.constructor==L.jqplot.BarRenderer){ak.series.push(new T())}else{if(aj.renderer.constructor==L.jqplot.PieRenderer){ak.series.push(new f())}else{if(aj.renderer.constructor==L.jqplot.DonutRenderer){ak.series.push(new G())}else{if(aj.renderer.constructor==L.jqplot.FunnelRenderer){ak.series.push(new Z())}else{if(aj.renderer.constructor==L.jqplot.MeterGaugeRenderer){ak.series.push(new D())}else{ak.series.push({})}}}}}}for(an in ak.series[ai]){ak.series[ai][an]=aj[an]}}var ah,al;for(an in this.axes){al=this.axes[an];ah=ak.axes[an]=new P();ah.borderColor=al.borderColor;ah.borderWidth=al.borderWidth;if(al._ticks&&al._ticks[0]){for(am in ah.ticks){if(al._ticks[0].hasOwnProperty(am)){ah.ticks[am]=al._ticks[0][am]}else{if(al._ticks[0]._elem){ah.ticks[am]=al._ticks[0]._elem.css(am)}}}}if(al._label&&al._label.show){for(am in ah.label){if(al._label[am]){ah.label[am]=al._label[am]}else{if(al._label._elem){if(am=="textColor"){ah.label[am]=al._label._elem.css("color")}else{ah.label[am]=al._label._elem.css(am)}}}}}}this.themeEngine._add(ak);this.themeEngine.activeTheme=this.themeEngine.themes[ak._name]};L.jqplot.ThemeEngine.prototype.get=function(ah){if(!ah){return this.activeTheme}else{return this.themes[ah]}};function O(ai,ah){return ai-ah}L.jqplot.ThemeEngine.prototype.getThemeNames=function(){var ah=[];for(var ai in this.themes){ah.push(ai)}return ah.sort(O)};L.jqplot.ThemeEngine.prototype.getThemes=function(){var ai=[];var ah=[];for(var ak in this.themes){ai.push(ak)}ai.sort(O);for(var aj=0;aj<ai.length;aj++){ah.push(this.themes[ai[aj]])}return ah};L.jqplot.ThemeEngine.prototype.activate=function(av,aB){var ah=false;if(!aB&&this.activeTheme&&this.activeTheme._name){aB=this.activeTheme._name}if(!this.themes.hasOwnProperty(aB)){throw new Error("No theme of that name")}else{var am=this.themes[aB];this.activeTheme=am;var aA,at=false,ar=false;var ai=["xaxis","x2axis","yaxis","y2axis"];for(aw=0;aw<ai.length;aw++){var an=ai[aw];if(am.axesStyles.borderColor!=null){av.axes[an].borderColor=am.axesStyles.borderColor}if(am.axesStyles.borderWidth!=null){av.axes[an].borderWidth=am.axesStyles.borderWidth}}for(var az in av.axes){var ak=av.axes[az];if(ak.show){var aq=am.axes[az]||{};var ao=am.axesStyles;var al=L.jqplot.extend(true,{},aq,ao);aA=(am.axesStyles.borderColor!=null)?am.axesStyles.borderColor:al.borderColor;if(al.borderColor!=null){ak.borderColor=al.borderColor;ah=true}aA=(am.axesStyles.borderWidth!=null)?am.axesStyles.borderWidth:al.borderWidth;if(al.borderWidth!=null){ak.borderWidth=al.borderWidth;ah=true}if(ak._ticks&&ak._ticks[0]){for(var aj in al.ticks){aA=al.ticks[aj];if(aA!=null){ak.tickOptions[aj]=aA;ak._ticks=[];ah=true}}}if(ak._label&&ak._label.show){for(var aj in al.label){aA=al.label[aj];if(aA!=null){ak.labelOptions[aj]=aA;ah=true}}}}}for(var au in am.grid){if(am.grid[au]!=null){av.grid[au]=am.grid[au]}}if(!ah){av.grid.draw()}if(av.legend.show){for(au in am.legend){if(am.legend[au]!=null){av.legend[au]=am.legend[au]}}}if(av.title.show){for(au in am.title){if(am.title[au]!=null){av.title[au]=am.title[au]}}}var aw;for(aw=0;aw<am.series.length;aw++){var ap={};var ay=false;for(au in am.series[aw]){aA=(am.seriesStyles[au]!=null)?am.seriesStyles[au]:am.series[aw][au];if(aA!=null){ap[au]=aA;if(au=="color"){av.series[aw].renderer.shapeRenderer.fillStyle=aA;av.series[aw].renderer.shapeRenderer.strokeStyle=aA;av.series[aw][au]=aA}else{if((au=="lineWidth")||(au=="linePattern")){av.series[aw].renderer.shapeRenderer[au]=aA;av.series[aw][au]=aA}else{if(au=="markerOptions"){V(av.series[aw].markerOptions,aA);V(av.series[aw].markerRenderer,aA)}else{av.series[aw][au]=aA}}}ah=true}}}if(ah){av.target.empty();av.draw()}for(au in am.target){if(am.target[au]!=null){av.target.css(au,am.target[au])}}}};L.jqplot.ThemeEngine.prototype._add=function(ai,ah){if(ah){ai._name=ah}if(!ai._name){ai._name=Date.parse(new Date())}if(!this.themes.hasOwnProperty(ai._name)){this.themes[ai._name]=ai}else{throw new Error("jqplot.ThemeEngine Error: Theme already in use")}};L.jqplot.ThemeEngine.prototype.remove=function(ah){if(ah=="Default"){return false}return delete this.themes[ah]};L.jqplot.ThemeEngine.prototype.newTheme=function(ah,aj){if(typeof(ah)=="object"){aj=aj||ah;ah=null}if(aj&&aj._name){ah=aj._name}else{ah=ah||Date.parse(new Date())}var ai=this.copy(this.themes.Default._name,ah);L.jqplot.extend(ai,aj);return ai};function B(aj){if(aj==null||typeof(aj)!="object"){return aj}var ah=new aj.constructor();for(var ai in aj){ah[ai]=B(aj[ai])}return ah}L.jqplot.clone=B;function V(aj,ai){if(ai==null||typeof(ai)!="object"){return}for(var ah in ai){if(ah=="highlightColors"){aj[ah]=B(ai[ah])}if(ai[ah]!=null&&typeof(ai[ah])=="object"){if(!aj.hasOwnProperty(ah)){aj[ah]={}}V(aj[ah],ai[ah])}else{aj[ah]=ai[ah]}}}L.jqplot.merge=V;L.jqplot.extend=function(){var am=arguments[0]||{},ak=1,al=arguments.length,ah=false,aj;if(typeof am==="boolean"){ah=am;am=arguments[1]||{};ak=2}if(typeof am!=="object"&&!toString.call(am)==="[object Function]"){am={}}for(;ak<al;ak++){if((aj=arguments[ak])!=null){for(var ai in aj){var an=am[ai],ao=aj[ai];if(am===ao){continue}if(ah&&ao&&typeof ao==="object"&&!ao.nodeType){am[ai]=L.jqplot.extend(ah,an||(ao.length!=null?[]:{}),ao)}else{if(ao!==u){am[ai]=ao}}}}}return am};L.jqplot.ThemeEngine.prototype.rename=function(ai,ah){if(ai=="Default"||ah=="Default"){throw new Error("jqplot.ThemeEngine Error: Cannot rename from/to Default")}if(this.themes.hasOwnProperty(ah)){throw new Error("jqplot.ThemeEngine Error: New name already in use.")}else{if(this.themes.hasOwnProperty(ai)){var aj=this.copy(ai,ah);this.remove(ai);return aj}}throw new Error("jqplot.ThemeEngine Error: Old name or new name invalid")};L.jqplot.ThemeEngine.prototype.copy=function(ah,aj,al){if(aj=="Default"){throw new Error("jqplot.ThemeEngine Error: Cannot copy over Default theme")}if(!this.themes.hasOwnProperty(ah)){var ai="jqplot.ThemeEngine Error: Source name invalid";throw new Error(ai)}if(this.themes.hasOwnProperty(aj)){var ai="jqplot.ThemeEngine Error: Target name invalid";throw new Error(ai)}else{var ak=B(this.themes[ah]);ak._name=aj;L.jqplot.extend(true,ak,al);this._add(ak);return ak}};L.jqplot.Theme=function(ah,ai){if(typeof(ah)=="object"){ai=ai||ah;ah=null}ah=ah||Date.parse(new Date());this._name=ah;this.target={backgroundColor:null};this.legend={textColor:null,fontFamily:null,fontSize:null,border:null,background:null};this.title={textColor:null,fontFamily:null,fontSize:null,textAlign:null};this.seriesStyles={};this.series=[];this.grid={drawGridlines:null,gridLineColor:null,gridLineWidth:null,backgroundColor:null,borderColor:null,borderWidth:null,shadow:null};this.axesStyles={label:{},ticks:{}};this.axes={};if(typeof(ai)=="string"){this._name=ai}else{if(typeof(ai)=="object"){L.jqplot.extend(true,this,ai)}}};var P=function(){this.borderColor=null;this.borderWidth=null;this.ticks=new o();this.label=new t()};var o=function(){this.show=null;this.showGridline=null;this.showLabel=null;this.showMark=null;this.size=null;this.textColor=null;this.whiteSpace=null;this.fontSize=null;this.fontFamily=null};var t=function(){this.textColor=null;this.whiteSpace=null;this.fontSize=null;this.fontFamily=null;this.fontWeight=null};var p=function(){this.color=null;this.lineWidth=null;this.linePattern=null;this.shadow=null;this.fillColor=null;this.showMarker=null;this.markerOptions=new I()};var I=function(){this.show=null;this.style=null;this.lineWidth=null;this.size=null;this.color=null;this.shadow=null};var T=function(){this.color=null;this.seriesColors=null;this.lineWidth=null;this.shadow=null;this.barPadding=null;this.barMargin=null;this.barWidth=null;this.highlightColors=null};var f=function(){this.seriesColors=null;this.padding=null;this.sliceMargin=null;this.fill=null;this.shadow=null;this.startAngle=null;this.lineWidth=null;this.highlightColors=null};var G=function(){this.seriesColors=null;this.padding=null;this.sliceMargin=null;this.fill=null;this.shadow=null;this.startAngle=null;this.lineWidth=null;this.innerDiameter=null;this.thickness=null;this.ringMargin=null;this.highlightColors=null};var Z=function(){this.color=null;this.lineWidth=null;this.shadow=null;this.padding=null;this.sectionMargin=null;this.seriesColors=null;this.highlightColors=null};var D=function(){this.padding=null;this.backgroundColor=null;this.ringColor=null;this.tickColor=null;this.ringWidth=null;this.intervalColors=null;this.intervalInnerRadius=null;this.intervalOuterRadius=null;this.hubRadius=null;this.needleThickness=null;this.needlePad=null};L.fn.jqplotChildText=function(){return L(this).contents().filter(function(){return this.nodeType==3}).text()};L.fn.jqplotGetComputedFontStyle=function(){var ak=window.getComputedStyle?window.getComputedStyle(this[0],""):this[0].currentStyle;var ai=ak["font-style"]?["font-style","font-weight","font-size","font-family"]:["fontStyle","fontWeight","fontSize","fontFamily"];var al=[];for(var aj=0;aj<ai.length;++aj){var ah=String(ak[ai[aj]]);if(ah&&ah!="normal"){al.push(ah)}}return al.join(" ")};L.fn.jqplotToImageCanvas=function(aj){aj=aj||{};var av=(aj.x_offset==null)?0:aj.x_offset;var ax=(aj.y_offset==null)?0:aj.y_offset;var al=(aj.backgroundColor==null)?"rgb(255,255,255)":aj.backgroundColor;if(L(this).width()==0||L(this).height()==0){return null}if(L.jqplot.use_excanvas){return null}var an=document.createElement("canvas");var aA=L(this).outerHeight(true);var at=L(this).outerWidth(true);var am=L(this).offset();var ao=am.left;var aq=am.top;var au=0,ar=0;var ay=["jqplot-table-legend","jqplot-xaxis-tick","jqplot-x2axis-tick","jqplot-yaxis-tick","jqplot-y2axis-tick","jqplot-y3axis-tick","jqplot-y4axis-tick","jqplot-y5axis-tick","jqplot-y6axis-tick","jqplot-y7axis-tick","jqplot-y8axis-tick","jqplot-y9axis-tick","jqplot-xaxis-label","jqplot-x2axis-label","jqplot-yaxis-label","jqplot-y2axis-label","jqplot-y3axis-label","jqplot-y4axis-label","jqplot-y5axis-label","jqplot-y6axis-label","jqplot-y7axis-label","jqplot-y8axis-label","jqplot-y9axis-label"];var ap,ah,ai,aB;for(var az=0;az<ay.length;az++){L(this).find("."+ay[az]).each(function(){ap=L(this).offset().top-aq;ah=L(this).offset().left-ao;aB=ah+L(this).outerWidth(true)+au;ai=ap+L(this).outerHeight(true)+ar;if(ah<-au){at=at-au-ah;au=-ah}if(ap<-ar){aA=aA-ar-ap;ar=-ap}if(aB>at){at=aB}if(ai>aA){aA=ai}})}an.width=at+Number(av);an.height=aA+Number(ax);var ak=an.getContext("2d");ak.save();ak.fillStyle=al;ak.fillRect(0,0,an.width,an.height);ak.restore();ak.translate(au,ar);ak.textAlign="left";ak.textBaseline="top";function aC(aE){var aF=parseInt(L(aE).css("line-height"),10);if(isNaN(aF)){aF=parseInt(L(aE).css("font-size"),10)*1.2}return aF}function aD(aF,aE,aS,aG,aO,aH){var aQ=aC(aF);var aK=L(aF).innerWidth();var aL=L(aF).innerHeight();var aN=aS.split(/\s+/);var aR=aN.length;var aP="";var aM=[];var aU=aO;var aT=aG;for(var aJ=0;aJ<aR;aJ++){aP+=aN[aJ];if(aE.measureText(aP).width>aK){aM.push(aJ);aP="";aJ--}}if(aM.length===0){if(L(aF).css("textAlign")==="center"){aT=aG+(aH-aE.measureText(aP).width)/2-au}aE.fillText(aS,aT,aO)}else{aP=aN.slice(0,aM[0]).join(" ");if(L(aF).css("textAlign")==="center"){aT=aG+(aH-aE.measureText(aP).width)/2-au}aE.fillText(aP,aT,aU);aU+=aQ;for(var aJ=1,aI=aM.length;aJ<aI;aJ++){aP=aN.slice(aM[aJ-1],aM[aJ]).join(" ");if(L(aF).css("textAlign")==="center"){aT=aG+(aH-aE.measureText(aP).width)/2-au}aE.fillText(aP,aT,aU);aU+=aQ}aP=aN.slice(aM[aJ-1],aN.length).join(" ");if(L(aF).css("textAlign")==="center"){aT=aG+(aH-aE.measureText(aP).width)/2-au}aE.fillText(aP,aT,aU)}}function aw(aG,aJ,aE){var aN=aG.tagName.toLowerCase();var aF=L(aG).position();var aK=window.getComputedStyle?window.getComputedStyle(aG,""):aG.currentStyle;var aI=aJ+aF.left+parseInt(aK.marginLeft,10)+parseInt(aK.borderLeftWidth,10)+parseInt(aK.paddingLeft,10);var aL=aE+aF.top+parseInt(aK.marginTop,10)+parseInt(aK.borderTopWidth,10)+parseInt(aK.paddingTop,10);var aM=an.width;if((aN=="div"||aN=="span")&&!L(aG).hasClass("jqplot-highlighter-tooltip")){L(aG).children().each(function(){aw(this,aI,aL)});var aO=L(aG).jqplotChildText();if(aO){ak.font=L(aG).jqplotGetComputedFontStyle();ak.fillStyle=L(aG).css("color");aD(aG,ak,aO,aI,aL,aM)}}else{if(aN==="table"&&L(aG).hasClass("jqplot-table-legend")){ak.strokeStyle=L(aG).css("border-top-color");ak.fillStyle=L(aG).css("background-color");ak.fillRect(aI,aL,L(aG).innerWidth(),L(aG).innerHeight());if(parseInt(L(aG).css("border-top-width"),10)>0){ak.strokeRect(aI,aL,L(aG).innerWidth(),L(aG).innerHeight())}L(aG).find("div.jqplot-table-legend-swatch-outline").each(function(){var aU=L(this);ak.strokeStyle=aU.css("border-top-color");var aQ=aI+aU.position().left;var aR=aL+aU.position().top;ak.strokeRect(aQ,aR,aU.innerWidth(),aU.innerHeight());aQ+=parseInt(aU.css("padding-left"),10);aR+=parseInt(aU.css("padding-top"),10);var aT=aU.innerHeight()-2*parseInt(aU.css("padding-top"),10);var aP=aU.innerWidth()-2*parseInt(aU.css("padding-left"),10);var aS=aU.children("div.jqplot-table-legend-swatch");ak.fillStyle=aS.css("background-color");ak.fillRect(aQ,aR,aP,aT)});L(aG).find("td.jqplot-table-legend-label").each(function(){var aR=L(this);var aP=aI+aR.position().left;var aQ=aL+aR.position().top+parseInt(aR.css("padding-top"),10);ak.font=aR.jqplotGetComputedFontStyle();ak.fillStyle=aR.css("color");aD(aR,ak,aR.text(),aP,aQ,aM)});var aH=null}else{if(aN=="canvas"){ak.drawImage(aG,aI,aL)}}}}L(this).children().each(function(){aw(this,av,ax)});return an};L.fn.jqplotToImageStr=function(ai){var ah=L(this).jqplotToImageCanvas(ai);if(ah){return ah.toDataURL("image/png")}else{return null}};L.fn.jqplotToImageElem=function(ah){var ai=document.createElement("img");var aj=L(this).jqplotToImageStr(ah);ai.src=aj;return ai};L.fn.jqplotToImageElemStr=function(ah){var ai="<img src="+L(this).jqplotToImageStr(ah)+" />";return ai};L.fn.jqplotSaveImage=function(){var ah=L(this).jqplotToImageStr({});if(ah){window.location.href=ah.replace("image/png","image/octet-stream")}};L.fn.jqplotViewImage=function(){var ai=L(this).jqplotToImageElemStr({});var aj=L(this).jqplotToImageStr({});if(ai){var ah=window.open("");ah.document.open("image/png");ah.document.write(ai);ah.document.close();ah=null}};var ag=function(){this.syntax=ag.config.syntax;this._type="jsDate";this.proxy=new Date();this.options={};this.locale=ag.regional.getLocale();this.formatString="";this.defaultCentury=ag.config.defaultCentury;switch(arguments.length){case 0:break;case 1:if(l(arguments[0])=="[object Object]"&&arguments[0]._type!="jsDate"){var aj=this.options=arguments[0];this.syntax=aj.syntax||this.syntax;this.defaultCentury=aj.defaultCentury||this.defaultCentury;this.proxy=ag.createDate(aj.date)}else{this.proxy=ag.createDate(arguments[0])}break;default:var ah=[];for(var ai=0;ai<arguments.length;ai++){ah.push(arguments[ai])}this.proxy=new Date();this.proxy.setFullYear.apply(this.proxy,ah.slice(0,3));if(ah.slice(3).length){this.proxy.setHours.apply(this.proxy,ah.slice(3))}break}};ag.config={defaultLocale:"en",syntax:"perl",defaultCentury:1900};ag.prototype.add=function(aj,ai){var ah=E[ai]||E.day;if(typeof ah=="number"){this.proxy.setTime(this.proxy.getTime()+(ah*aj))}else{ah.add(this,aj)}return this};ag.prototype.clone=function(){return new ag(this.proxy.getTime())};ag.prototype.getUtcOffset=function(){return this.proxy.getTimezoneOffset()*60000};ag.prototype.diff=function(ai,al,ah){ai=new ag(ai);if(ai===null){return null}var aj=E[al]||E.day;if(typeof aj=="number"){var ak=(this.proxy.getTime()-ai.proxy.getTime())/aj}else{var ak=aj.diff(this.proxy,ai.proxy)}return(ah?ak:Math[ak>0?"floor":"ceil"](ak))};ag.prototype.getAbbrDayName=function(){return ag.regional[this.locale]["dayNamesShort"][this.proxy.getDay()]};ag.prototype.getAbbrMonthName=function(){return ag.regional[this.locale]["monthNamesShort"][this.proxy.getMonth()]};ag.prototype.getAMPM=function(){return this.proxy.getHours()>=12?"PM":"AM"};ag.prototype.getAmPm=function(){return this.proxy.getHours()>=12?"pm":"am"};ag.prototype.getCentury=function(){return parseInt(this.proxy.getFullYear()/100,10)};ag.prototype.getDate=function(){return this.proxy.getDate()};ag.prototype.getDay=function(){return this.proxy.getDay()};ag.prototype.getDayOfWeek=function(){var ah=this.proxy.getDay();return ah===0?7:ah};ag.prototype.getDayOfYear=function(){var ai=this.proxy;var ah=ai-new Date(""+ai.getFullYear()+"/1/1 GMT");ah+=ai.getTimezoneOffset()*60000;ai=null;return parseInt(ah/60000/60/24,10)+1};ag.prototype.getDayName=function(){return ag.regional[this.locale]["dayNames"][this.proxy.getDay()]};ag.prototype.getFullWeekOfYear=function(){var ak=this.proxy;var ah=this.getDayOfYear();var aj=6-ak.getDay();var ai=parseInt((ah+aj)/7,10);return ai};ag.prototype.getFullYear=function(){return this.proxy.getFullYear()};ag.prototype.getGmtOffset=function(){var ah=this.proxy.getTimezoneOffset()/60;var ai=ah<0?"+":"-";ah=Math.abs(ah);return ai+N(Math.floor(ah),2)+":"+N((ah%1)*60,2)};ag.prototype.getHours=function(){return this.proxy.getHours()};ag.prototype.getHours12=function(){var ah=this.proxy.getHours();return ah>12?ah-12:(ah==0?12:ah)};ag.prototype.getIsoWeek=function(){var ak=this.proxy;var aj=this.getWeekOfYear();var ah=(new Date(""+ak.getFullYear()+"/1/1")).getDay();var ai=aj+(ah>4||ah<=1?0:1);if(ai==53&&(new Date(""+ak.getFullYear()+"/12/31")).getDay()<4){ai=1}else{if(ai===0){ak=new ag(new Date(""+(ak.getFullYear()-1)+"/12/31"));ai=ak.getIsoWeek()}}ak=null;return ai};ag.prototype.getMilliseconds=function(){return this.proxy.getMilliseconds()};ag.prototype.getMinutes=function(){return this.proxy.getMinutes()};ag.prototype.getMonth=function(){return this.proxy.getMonth()};ag.prototype.getMonthName=function(){return ag.regional[this.locale]["monthNames"][this.proxy.getMonth()]};ag.prototype.getMonthNumber=function(){return this.proxy.getMonth()+1};ag.prototype.getSeconds=function(){return this.proxy.getSeconds()};ag.prototype.getShortYear=function(){return this.proxy.getYear()%100};ag.prototype.getTime=function(){return this.proxy.getTime()};ag.prototype.getTimezoneAbbr=function(){return this.proxy.toString().replace(/^.*\(([^)]+)\)$/,"$1")};ag.prototype.getTimezoneName=function(){var ah=/(?:\((.+)\)$| ([A-Z]{3}) )/.exec(this.toString());return ah[1]||ah[2]||"GMT"+this.getGmtOffset()};ag.prototype.getTimezoneOffset=function(){return this.proxy.getTimezoneOffset()};ag.prototype.getWeekOfYear=function(){var ah=this.getDayOfYear();var aj=7-this.getDayOfWeek();var ai=parseInt((ah+aj)/7,10);return ai};ag.prototype.getUnix=function(){return Math.round(this.proxy.getTime()/1000,0)};ag.prototype.getYear=function(){return this.proxy.getYear()};ag.prototype.next=function(ah){ah=ah||"day";return this.clone().add(1,ah)};ag.prototype.set=function(){switch(arguments.length){case 0:this.proxy=new Date();break;case 1:if(l(arguments[0])=="[object Object]"&&arguments[0]._type!="jsDate"){var aj=this.options=arguments[0];this.syntax=aj.syntax||this.syntax;this.defaultCentury=aj.defaultCentury||this.defaultCentury;this.proxy=ag.createDate(aj.date)}else{this.proxy=ag.createDate(arguments[0])}break;default:var ah=[];for(var ai=0;ai<arguments.length;ai++){ah.push(arguments[ai])}this.proxy=new Date();this.proxy.setFullYear.apply(this.proxy,ah.slice(0,3));if(ah.slice(3).length){this.proxy.setHours.apply(this.proxy,ah.slice(3))}break}return this};ag.prototype.setDate=function(ah){this.proxy.setDate(ah);return this};ag.prototype.setFullYear=function(){this.proxy.setFullYear.apply(this.proxy,arguments);return this};ag.prototype.setHours=function(){this.proxy.setHours.apply(this.proxy,arguments);return this};ag.prototype.setMilliseconds=function(ah){this.proxy.setMilliseconds(ah);return this};ag.prototype.setMinutes=function(){this.proxy.setMinutes.apply(this.proxy,arguments);return this};ag.prototype.setMonth=function(){this.proxy.setMonth.apply(this.proxy,arguments);return this};ag.prototype.setSeconds=function(){this.proxy.setSeconds.apply(this.proxy,arguments);return this};ag.prototype.setTime=function(ah){this.proxy.setTime(ah);return this};ag.prototype.setYear=function(){this.proxy.setYear.apply(this.proxy,arguments);return this};ag.prototype.strftime=function(ah){ah=ah||this.formatString||ag.regional[this.locale]["formatString"];return ag.strftime(this,ah,this.syntax)};ag.prototype.toString=function(){return this.proxy.toString()};ag.prototype.toYmdInt=function(){return(this.proxy.getFullYear()*10000)+(this.getMonthNumber()*100)+this.proxy.getDate()};ag.regional={en:{monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],formatString:"%Y-%m-%d %H:%M:%S"},fr:{monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],monthNamesShort:["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"],dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],dayNamesShort:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],formatString:"%Y-%m-%d %H:%M:%S"},de:{monthNames:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],monthNamesShort:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],dayNames:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],dayNamesShort:["So","Mo","Di","Mi","Do","Fr","Sa"],formatString:"%Y-%m-%d %H:%M:%S"},es:{monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Mi&eacute;rcoles","Jueves","Viernes","S&aacute;bado"],dayNamesShort:["Dom","Lun","Mar","Mi&eacute;","Juv","Vie","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"},ru:{monthNames:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],monthNamesShort:["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],dayNames:["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],dayNamesShort:["вск","пнд","втр","срд","чтв","птн","сбт"],formatString:"%Y-%m-%d %H:%M:%S"},ar:{monthNames:["كانون الثاني","شباط","آذار","نيسان","آذار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"],monthNamesShort:["1","2","3","4","5","6","7","8","9","10","11","12"],dayNames:["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"],dayNamesShort:["سبت","أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة"],formatString:"%Y-%m-%d %H:%M:%S"},pt:{monthNames:["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],dayNames:["Domingo","Segunda-feira","Ter&ccedil;a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S&aacute;bado"],dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"},"pt-BR":{monthNames:["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],dayNames:["Domingo","Segunda-feira","Ter&ccedil;a-feira","Quarta-feira","Quinta-feira","Sexta-feira","S&aacute;bado"],dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","S&aacute;b"],formatString:"%Y-%m-%d %H:%M:%S"},pl:{monthNames:["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],monthNamesShort:["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"],dayNames:["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"],dayNamesShort:["Ni","Pn","Wt","Śr","Cz","Pt","Sb"],formatString:"%Y-%m-%d %H:%M:%S"},nl:{monthNames:["Januari","Februari","Maart","April","Mei","Juni","July","Augustus","September","Oktober","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],dayNames:","["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"],dayNamesShort:["Zo","Ma","Di","Wo","Do","Vr","Za"],formatString:"%Y-%m-%d %H:%M:%S"},sv:{monthNames:["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],monthNamesShort:["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"],dayNames:["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"],dayNamesShort:["sön","mån","tis","ons","tor","fre","lör"],formatString:"%Y-%m-%d %H:%M:%S"}};ag.regional["en-US"]=ag.regional["en-GB"]=ag.regional.en;ag.regional.getLocale=function(){var ah=ag.config.defaultLocale;if(document&&document.getElementsByTagName("html")&&document.getElementsByTagName("html")[0].lang){ah=document.getElementsByTagName("html")[0].lang;if(!ag.regional.hasOwnProperty(ah)){ah=ag.config.defaultLocale}}return ah};var C=24*60*60*1000;var N=function(ah,ak){ah=String(ah);var ai=ak-ah.length;var aj=String(Math.pow(10,ai)).slice(1);return aj.concat(ah)};var E={millisecond:1,second:1000,minute:60*1000,hour:60*60*1000,day:C,week:7*C,month:{add:function(aj,ah){E.year.add(aj,Math[ah>0?"floor":"ceil"](ah/12));var ai=aj.getMonth()+(ah%12);if(ai==12){ai=0;aj.setYear(aj.getFullYear()+1)}else{if(ai==-1){ai=11;aj.setYear(aj.getFullYear()-1)}}aj.setMonth(ai)},diff:function(al,aj){var ah=al.getFullYear()-aj.getFullYear();var ai=al.getMonth()-aj.getMonth()+(ah*12);var ak=al.getDate()-aj.getDate();return ai+(ak/30)}},year:{add:function(ai,ah){ai.setYear(ai.getFullYear()+Math[ah>0?"floor":"ceil"](ah))},diff:function(ai,ah){return E.month.diff(ai,ah)/12}}};for(var Y in E){if(Y.substring(Y.length-1)!="s"){E[Y+"s"]=E[Y]}}var H=function(al,ak,ai){if(ag.formats[ai]["shortcuts"][ak]){return ag.strftime(al,ag.formats[ai]["shortcuts"][ak],ai)}else{var ah=(ag.formats[ai]["codes"][ak]||"").split(".");var aj=al["get"+ah[0]]?al["get"+ah[0]]():"";if(ah[1]){aj=N(aj,ah[1])}return aj}};ag.strftime=function(an,ak,aj,ao){var ai="perl";var am=ag.regional.getLocale();if(aj&&ag.formats.hasOwnProperty(aj)){ai=aj}else{if(aj&&ag.regional.hasOwnProperty(aj)){am=aj}}if(ao&&ag.formats.hasOwnProperty(ao)){ai=ao}else{if(ao&&ag.regional.hasOwnProperty(ao)){am=ao}}if(l(an)!="[object Object]"||an._type!="jsDate"){an=new ag(an);an.locale=am}if(!ak){ak=an.formatString||ag.regional[am]["formatString"]}var ah=ak||"%Y-%m-%d",ap="",al;while(ah.length>0){if(al=ah.match(ag.formats[ai].codes.matcher)){ap+=ah.slice(0,al.index);ap+=(al[1]||"")+H(an,al[2],ai);ah=ah.slice(al.index+al[0].length)}else{ap+=ah;ah=""}}return ap};ag.formats={ISO:"%Y-%m-%dT%H:%M:%S.%N%G",SQL:"%Y-%m-%d %H:%M:%S"};ag.formats.perl={codes:{matcher:/()%(#?(%|[a-z]))/i,Y:"FullYear",y:"ShortYear.2",m:"MonthNumber.2","#m":"MonthNumber",B:"MonthName",b:"AbbrMonthName",d:"Date.2","#d":"Date",e:"Date",A:"DayName",a:"AbbrDayName",w:"Day",H:"Hours.2","#H":"Hours",I:"Hours12.2","#I":"Hours12",p:"AMPM",M:"Minutes.2","#M":"Minutes",S:"Seconds.2","#S":"Seconds",s:"Unix",N:"Milliseconds.3","#N":"Milliseconds",O:"TimezoneOffset",Z:"TimezoneName",G:"GmtOffset"},shortcuts:{F:"%Y-%m-%d",T:"%H:%M:%S",X:"%H:%M:%S",x:"%m/%d/%y",D:"%m/%d/%y","#c":"%a %b %e %H:%M:%S %Y",v:"%e-%b-%Y",R:"%H:%M",r:"%I:%M:%S %p",t:"\t",n:"\n","%":"%"}};ag.formats.php={codes:{matcher:/()%((%|[a-z]))/i,a:"AbbrDayName",A:"DayName",d:"Date.2",e:"Date",j:"DayOfYear.3",u:"DayOfWeek",w:"Day",U:"FullWeekOfYear.2",V:"IsoWeek.2",W:"WeekOfYear.2",b:"AbbrMonthName",B:"MonthName",m:"MonthNumber.2",h:"AbbrMonthName",C:"Century.2",y:"ShortYear.2",Y:"FullYear",H:"Hours.2",I:"Hours12.2",l:"Hours12",p:"AMPM",P:"AmPm",M:"Minutes.2",S:"Seconds.2",s:"Unix",O:"TimezoneOffset",z:"GmtOffset",Z:"TimezoneAbbr"},shortcuts:{D:"%m/%d/%y",F:"%Y-%m-%d",T:"%H:%M:%S",X:"%H:%M:%S",x:"%m/%d/%y",R:"%H:%M",r:"%I:%M:%S %p",t:"\t",n:"\n","%":"%"}};ag.createDate=function(aj){if(aj==null){return new Date()}if(aj instanceof Date){return aj}if(typeof aj=="number"){return new Date(aj)}var ao=String(aj).replace(/^\s*(.+)\s*$/g,"$1");ao=ao.replace(/^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,4})/,"$1/$2/$3");ao=ao.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{4})/i,"$1 $2 $3");var an=ao.match(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i);if(an&&an.length>3){var at=parseFloat(an[3]);var am=ag.config.defaultCentury+at;am=String(am);ao=ao.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i,an[1]+" "+an[2]+" "+am)}an=ao.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})[^0-9]/);function ar(ax,aw){var aC=parseFloat(aw[1]);var aB=parseFloat(aw[2]);var aA=parseFloat(aw[3]);var az=ag.config.defaultCentury;var av,au,aD,ay;if(aC>31){au=aA;aD=aB;av=az+aC}else{au=aB;aD=aC;av=az+aA}ay=aD+"/"+au+"/"+av;return ax.replace(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})/,ay)}if(an&&an.length>3){ao=ar(ao,an)}var an=ao.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})$/);if(an&&an.length>3){ao=ar(ao,an)}var al=0;var ai=ag.matchers.length;var aq,ah,ap=ao,ak;while(al<ai){ah=Date.parse(ap);if(!isNaN(ah)){return new Date(ah)}aq=ag.matchers[al];if(typeof aq=="function"){ak=aq.call(ag,ap);if(ak instanceof Date){return ak}}else{ap=ao.replace(aq[0],aq[1])}al++}return NaN};ag.daysInMonth=function(ah,ai){if(ai==2){return new Date(ah,1,29).getDate()==29?29:28}return[u,31,u,31,30,31,30,31,31,30,31,30,31][ai]};ag.matchers=[[/(3[01]|[0-2]\d)\s*\.\s*(1[0-2]|0\d)\s*\.\s*([1-9]\d{3})/,"$2/$1/$3"],[/([1-9]\d{3})\s*-\s*(1[0-2]|0\d)\s*-\s*(3[01]|[0-2]\d)/,"$2/$3/$1"],function(ak){var ai=ak.match(/^(?:(.+)\s+)?([012]?\d)(?:\s*\:\s*(\d\d))?(?:\s*\:\s*(\d\d(\.\d*)?))?\s*(am|pm)?\s*$/i);if(ai){if(ai[1]){var aj=this.createDate(ai[1]);if(isNaN(aj)){return}}else{var aj=new Date();aj.setMilliseconds(0)}var ah=parseFloat(ai[2]);if(ai[6]){ah=ai[6].toLowerCase()=="am"?(ah==12?0:ah):(ah==12?12:ah+12)}aj.setHours(ah,parseInt(ai[3]||0,10),parseInt(ai[4]||0,10),((parseFloat(ai[5]||0))||0)*1000);return aj}else{return ak}},function(ak){var ai=ak.match(/^(?:(.+))[T|\s+]([012]\d)(?:\:(\d\d))(?:\:(\d\d))(?:\.\d+)([\+\-]\d\d\:\d\d)$/i);if(ai){if(ai[1]){var aj=this.createDate(ai[1]);if(isNaN(aj)){return}}else{var aj=new Date();aj.setMilliseconds(0)}var ah=parseFloat(ai[2]);aj.setHours(ah,parseInt(ai[3],10),parseInt(ai[4],10),parseFloat(ai[5])*1000);return aj}else{return ak}},function(al){var aj=al.match(/^([0-3]?\d)\s*[-\/.\s]{1}\s*([a-zA-Z]{3,9})\s*[-\/.\s]{1}\s*([0-3]?\d)$/);if(aj){var ak=new Date();var am=ag.config.defaultCentury;var ao=parseFloat(aj[1]);var an=parseFloat(aj[3]);var ai,ah,ap;if(ao>31){ah=an;ai=am+ao}else{ah=ao;ai=am+an}var ap=ab(aj[2],ag.regional[ag.regional.getLocale()]["monthNamesShort"]);if(ap==-1){ap=ab(aj[2],ag.regional[ag.regional.getLocale()]["monthNames"])}ak.setFullYear(ai,ap,ah);ak.setHours(0,0,0,0);return ak}else{return al}}];function ab(aj,ak){if(ak.indexOf){return ak.indexOf(aj)}for(var ah=0,ai=ak.length;ah<ai;ah++){if(ak[ah]===aj){return ah}}return -1}function l(ah){if(ah===null){return"[object Null]"}return Object.prototype.toString.call(ah)}L.jsDate=ag;L.jqplot.sprintf=function(){function an(au,ap,aq,at){var ar=(au.length>=ap)?"":Array(1+ap-au.length>>>0).join(aq);return at?au+ar:ar+au}function ak(ar){var aq=new String(ar);for(var ap=10;ap>0;ap--){if(aq==(aq=aq.replace(/^(\d+)(\d{3})/,"$1"+L.jqplot.sprintf.thousandsSeparator+"$2"))){break}}return aq}function aj(av,au,ax,ar,at,aq){var aw=ar-av.length;if(aw>0){var ap=" ";if(aq){ap="&nbsp;"}if(ax||!at){av=an(av,ar,ap,ax)}else{av=av.slice(0,au.length)+an("",aw,"0",true)+av.slice(au.length)}}return av}function ao(ay,aq,aw,ar,ap,av,ax,au){var at=ay>>>0;aw=aw&&at&&{"2":"0b","8":"0","16":"0x"}[aq]||"";ay=aw+an(at.toString(aq),av||0,"0",false);return aj(ay,aw,ar,ap,ax,au)}function ah(au,av,ar,ap,at,aq){if(ap!=null){au=au.slice(0,ap)}return aj(au,"",av,ar,at,aq)}var ai=arguments,al=0,am=ai[al++];return am.replace(L.jqplot.sprintf.regex,function(aM,ax,ay,aB,aO,aJ,av){if(aM=="%%"){return"%"}var aD=false,az="",aA=false,aL=false,aw=false,au=false;for(var aI=0;ay&&aI<ay.length;aI++){switch(ay.charAt(aI)){case" ":az=" ";break;case"+":az="+";break;case"-":aD=true;break;case"0":aA=true;break;case"#":aL=true;break;case"&":aw=true;break;case"'":au=true;break}}if(!aB){aB=0}else{if(aB=="*"){aB=+ai[al++]}else{if(aB.charAt(0)=="*"){aB=+ai[aB.slice(1,-1)]}else{aB=+aB}}}if(aB<0){aB=-aB;aD=true}if(!isFinite(aB)){throw new Error("$.jqplot.sprintf: (minimum-)width must be finite")}if(!aJ){aJ="fFeE".indexOf(av)>-1?6:(av=="d")?0:void (0)}else{if(aJ=="*"){aJ=+ai[al++]}else{if(aJ.charAt(0)=="*"){aJ=+ai[aJ.slice(1,-1)]}else{aJ=+aJ}}}var aF=ax?ai[ax.slice(0,-1)]:ai[al++];switch(av){case"s":if(aF==null){return""}return ah(String(aF),aD,aB,aJ,aA,aw);case"c":return ah(String.fromCharCode(+aF),aD,aB,aJ,aA,aw);case"b":return ao(aF,2,aL,aD,aB,aJ,aA,aw);case"o":return ao(aF,8,aL,aD,aB,aJ,aA,aw);case"x":return ao(aF,16,aL,aD,aB,aJ,aA,aw);case"X":return ao(aF,16,aL,aD,aB,aJ,aA,aw).toUpperCase();case"u":return ao(aF,10,aL,aD,aB,aJ,aA,aw);case"i":var ar=parseInt(+aF,10);if(isNaN(ar)){return""}var aH=ar<0?"-":az;var aK=au?ak(String(Math.abs(ar))):String(Math.abs(ar));aF=aH+an(aK,aJ,"0",false);return aj(aF,aH,aD,aB,aA,aw);case"d":var ar=Math.round(+aF);if(isNaN(ar)){return""}var aH=ar<0?"-":az;var aK=au?ak(String(Math.abs(ar))):String(Math.abs(ar));aF=aH+an(aK,aJ,"0",false);return aj(aF,aH,aD,aB,aA,aw);case"e":case"E":case"f":case"F":case"g":case"G":var ar=+aF;if(isNaN(ar)){return""}var aH=ar<0?"-":az;var at=["toExponential","toFixed","toPrecision"]["efg".indexOf(av.toLowerCase())];var aN=["toString","toUpperCase"]["eEfFgG".indexOf(av)%2];var aK=Math.abs(ar)[at](aJ);var aE=aK.toString().split(".");aE[0]=au?ak(aE[0]):aE[0];aK=aE.join(L.jqplot.sprintf.decimalMark);aF=aH+aK;var aC=aj(aF,aH,aD,aB,aA,aw)[aN]();return aC;case"p":case"P":var ar=+aF;if(isNaN(ar)){return""}var aH=ar<0?"-":az;var aE=String(Number(Math.abs(ar)).toExponential()).split(/e|E/);var aq=(aE[0].indexOf(".")!=-1)?aE[0].length-1:String(ar).length;var aG=(aE[1]<0)?-aE[1]-1:0;if(Math.abs(ar)<1){if(aq+aG<=aJ){aF=aH+Math.abs(ar).toPrecision(aq)}else{if(aq<=aJ-1){aF=aH+Math.abs(ar).toExponential(aq-1)}else{aF=aH+Math.abs(ar).toExponential(aJ-1)}}}else{var ap=(aq<=aJ)?aq:aJ;aF=aH+Math.abs(ar).toPrecision(ap)}var aN=["toString","toUpperCase"]["pP".indexOf(av)%2];return aj(aF,aH,aD,aB,aA,aw)[aN]();case"n":return"";default:return aM}})};L.jqplot.sprintf.thousandsSeparator=",";L.jqplot.sprintf.decimalMark=".";L.jqplot.sprintf.regex=/%%|%(\d+\$)?([-+#0&\' ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([nAscboxXuidfegpEGP])/g;L.jqplot.getSignificantFigures=function(al){var an=String(Number(Math.abs(al)).toExponential()).split(/e|E/);var am=(an[0].indexOf(".")!=-1)?an[0].length-1:an[0].length;var ai=(an[1]<0)?-an[1]-1:0;var ah=parseInt(an[1],10);var aj=(ah+1>0)?ah+1:0;var ak=(am<=aj)?0:am-ah-1;return{significantDigits:am,digitsLeft:aj,digitsRight:ak,zeros:ai,exponent:ah}};L.jqplot.getPrecision=function(ah){return L.jqplot.getSignificantFigures(ah).digitsRight};var X=L.uiBackCompat!==false;L.jqplot.effects={effect:{}};var m="jqplot.storage.";L.extend(L.jqplot.effects,{version:"1.9pre",save:function(ai,aj){for(var ah=0;ah<aj.length;ah++){if(aj[ah]!==null){ai.data(m+aj[ah],ai[0].style[aj[ah]])}}},restore:function(ai,aj){for(var ah=0;ah<aj.length;ah++){if(aj[ah]!==null){ai.css(aj[ah],ai.data(m+aj[ah]))}}},setMode:function(ah,ai){if(ai==="toggle"){ai=ah.is(":hidden")?"show":"hide"}return ai},createWrapper:function(ai){if(ai.parent().is(".ui-effects-wrapper")){return ai.parent()}var aj={width:ai.outerWidth(true),height:ai.outerHeight(true),"float":ai.css("float")},al=L("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),ah={width:ai.width(),height:ai.height()},ak=document.activeElement;ai.wrap(al);if(ai[0]===ak||L.contains(ai[0],ak)){L(ak).focus()}al=ai.parent();if(ai.css("position")==="static"){al.css({position:"relative"});ai.css({position:"relative"})}else{L.extend(aj,{position:ai.css("position"),zIndex:ai.css("z-index")});L.each(["top","left","bottom","right"],function(am,an){aj[an]=ai.css(an);if(isNaN(parseInt(aj[an],10))){aj[an]="auto"}});ai.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})}ai.css(ah);return al.css(aj).show()},removeWrapper:function(ah){var ai=document.activeElement;if(ah.parent().is(".ui-effects-wrapper")){ah.parent().replaceWith(ah);if(ah[0]===ai||L.contains(ah[0],ai)){L(ai).focus()}}return ah}});function j(ai,ah,aj,ak){if(L.isPlainObject(ai)){return ai}ai={effect:ai};if(ah===u){ah={}}if(L.isFunction(ah)){ak=ah;aj=null;ah={}}if(L.type(ah)==="number"||L.fx.speeds[ah]){ak=aj;aj=ah;ah={}}if(L.isFunction(aj)){ak=aj;aj=null}if(ah){L.extend(ai,ah)}aj=aj||ah.duration;ai.duration=L.fx.off?0:typeof aj==="number"?aj:aj in L.fx.speeds?L.fx.speeds[aj]:L.fx.speeds._default;ai.complete=ak||ah.complete;return ai}function ae(ah){if(!ah||typeof ah==="number"||L.fx.speeds[ah]){return true}if(typeof ah==="string"&&!L.jqplot.effects.effect[ah]){if(X&&L.jqplot.effects[ah]){return false}return true}return false}L.fn.extend({jqplotEffect:function(ap,aq,ai,ao){var an=j.apply(this,arguments),ak=an.mode,al=an.queue,am=L.jqplot.effects.effect[an.effect],ah=!am&&X&&L.jqplot.effects[an.effect];if(L.fx.off||!(am||ah)){if(ak){return this[ak](an.duration,an.complete)}else{return this.each(function(){if(an.complete){an.complete.call(this)}})}}function aj(au){var av=L(this),at=an.complete,aw=an.mode;function ar(){if(L.isFunction(at)){at.call(av[0])}if(L.isFunction(au)){au()}}if(av.is(":hidden")?aw==="hide":aw==="show"){ar()}else{am.call(av[0],an,ar)}}if(am){return al===false?this.each(aj):this.queue(al||"fx",aj)}else{return ah.call(this,{options:an,duration:an.duration,callback:an.complete,mode:an.mode})}}});var a=/up|down|vertical/,v=/up|left|vertical|horizontal/;L.jqplot.effects.effect.blind=function(aj,ao){var ak=L(this),ar=["position","top","bottom","left","right","height","width"],ap=L.jqplot.effects.setMode(ak,aj.mode||"hide"),au=aj.direction||"up",am=a.test(au),al=am?"height":"width",aq=am?"top":"left",aw=v.test(au),an={},av=ap==="show",ai,ah,at;if(ak.parent().is(".ui-effects-wrapper")){L.jqplot.effects.save(ak.parent(),ar)}else{L.jqplot.effects.save(ak,ar)}ak.show();at=parseInt(ak.css("top"),10);ai=L.jqplot.effects.createWrapper(ak).css({overflow:"hidden"});ah=am?ai[al]()+at:ai[al]();an[al]=av?String(ah):"0";if(!aw){ak.css(am?"bottom":"right",0).css(am?"top":"left","").css({position:"absolute"});an[aq]=av?"0":String(ah)}if(av){ai.css(al,0);if(!aw){ai.css(aq,ah)}}ai.animate(an,{duration:aj.duration,easing:aj.easing,queue:false,complete:function(){if(ap==="hide"){ak.hide()}L.jqplot.effects.restore(ak,ar);L.jqplot.effects.removeWrapper(ak);ao()}})}})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(c){c.jqplot.PointLabels=function(e){this.show=c.jqplot.config.enablePlugins;this.location="n";this.labelsFromSeries=false;this.seriesLabelIndex=null;this.labels=[];this._labels=[];this.stackedValue=false;this.ypadding=6;this.xpadding=6;this.escapeHTML=true;this.edgeTolerance=-5;this.formatter=c.jqplot.DefaultTickFormatter;this.formatString="";this.hideZeros=false;this._elems=[];c.extend(true,this,e)};var a=["nw","n","ne","e","se","s","sw","w"];var d={nw:0,n:1,ne:2,e:3,se:4,s:5,sw:6,w:7};var b=["se","s","sw","w","nw","n","ne","e"];c.jqplot.PointLabels.init=function(j,h,f,g,i){var e=c.extend(true,{},f,g);e.pointLabels=e.pointLabels||{};if(this.renderer.constructor===c.jqplot.BarRenderer&&this.barDirection==="horizontal"&&!e.pointLabels.location){e.pointLabels.location="e"}this.plugins.pointLabels=new c.jqplot.PointLabels(e.pointLabels);this.plugins.pointLabels.setLabels.call(this)};c.jqplot.PointLabels.prototype.setLabels=function(){var f=this.plugins.pointLabels;var h;if(f.seriesLabelIndex!=null){h=f.seriesLabelIndex}else{if(this.renderer.constructor===c.jqplot.BarRenderer&&this.barDirection==="horizontal"){h=(this._plotData[0].length<3)?0:this._plotData[0].length-1}else{h=(this._plotData.length===0)?0:this._plotData[0].length-1}}f._labels=[];if(f.labels.length===0||f.labelsFromSeries){if(f.stackedValue){if(this._plotData.length&&this._plotData[0].length){for(var e=0;e<this._plotData.length;e++){f._labels.push(this._plotData[e][h])}}}else{var g=this.data;if(this.renderer.constructor===c.jqplot.BarRenderer&&this.waterfall){g=this._data}if(g.length&&g[0].length){for(var e=0;e<g.length;e++){f._labels.push(g[e][h])}}g=null}}else{if(f.labels.length){f._labels=f.labels}}};c.jqplot.PointLabels.prototype.xOffset=function(f,e,g){e=e||this.location;g=g||this.xpadding;var h;switch(e){case"nw":h=-f.outerWidth(true)-this.xpadding;break;case"n":h=-f.outerWidth(true)/2;break;case"ne":h=this.xpadding;break;case"e":h=this.xpadding;break;case"se":h=this.xpadding;break;case"s":h=-f.outerWidth(true)/2;break;case"sw":h=-f.outerWidth(true)-this.xpadding;break;case"w":h=-f.outerWidth(true)-this.xpadding;break;default:h=-f.outerWidth(true)-this.xpadding;break}return h};c.jqplot.PointLabels.prototype.yOffset=function(f,e,g){e=e||this.location;g=g||this.xpadding;var h;switch(e){case"nw":h=-f.outerHeight(true)-this.ypadding;break;case"n":h=-f.outerHeight(true)-this.ypadding;break;case"ne":h=-f.outerHeight(true)-this.ypadding;break;case"e":h=-f.outerHeight(true)/2;break;case"se":h=this.ypadding;break;case"s":h=this.ypadding;break;case"sw":h=this.ypadding;break;case"w":h=-f.outerHeight(true)/2;break;default:h=-f.outerHeight(true)-this.ypadding;break}return h};c.jqplot.PointLabels.draw=function(x,j,v){var t=this.plugins.pointLabels;t.setLabels.call(this);for(var w=0;w<t._elems.length;w++){t._elems[w].emptyForce()}t._elems.splice(0,t._elems.length);if(t.show){var r="_"+this._stackAxis+"axis";if(!t.formatString){t.formatString=this[r]._ticks[0].formatString;t.formatter=this[r]._ticks[0].formatter}var E=this._plotData;var D=this._prevPlotData;var A=this._xaxis;var q=this._yaxis;var z,f;for(var w=0,u=t._labels.length;w<u;w++){var o=t._labels[w];if(o==null||(t.hideZeros&&parseInt(o,10)==0)){continue}o=t.formatter(t.formatString,o);f=document.createElement("div");t._elems[w]=c(f);z=t._elems[w];z.addClass("jqplot-point-label jqplot-series-"+this.index+" jqplot-point-"+w);z.css("position","absolute");z.insertAfter(x.canvas);if(t.escapeHTML){z.text(o)}else{z.html(o)}var g=t.location;if((this.fillToZero&&E[w][1]<0)||(this.fillToZero&&this._type==="bar"&&this.barDirection==="horizontal"&&E[w][0]<0)||(this.waterfall&&parseInt(o,10))<0){g=b[d[g]]}var n=A.u2p(E[w][0])+t.xOffset(z,g);var h=q.u2p(E[w][1])+t.yOffset(z,g);if(this._stack&&!t.stackedValue){if(this.barDirection==="vertical"){h=(this._barPoints[w][0][1]+this._barPoints[w][1][1])/2+v._gridPadding.top-0.5*z.outerHeight(true)}else{n=(this._barPoints[w][2][0]+this._barPoints[w][0][0])/2+v._gridPadding.left-0.5*z.outerWidth(true)}}if(this.renderer.constructor==c.jqplot.BarRenderer){if(this.barDirection=="vertical"){n+=this._barNudge}else{h-=this._barNudge}}z.css("left",n);z.css("top",h);var k=n+z.width();var s=h+z.height();var C=t.edgeTolerance;var e=c(x.canvas).position().left;var y=c(x.canvas).position().top;var B=x.canvas.width+e;var m=x.canvas.height+y;if(n-C<e||h-C<y||k+C>B||s+C>m){z.remove()}z=null;f=null}}};c.jqplot.postSeriesInitHooks.push(c.jqplot.PointLabels.init);c.jqplot.postDrawSeriesHooks.push(c.jqplot.PointLabels.draw)})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(a){a.jqplot.CategoryAxisRenderer=function(b){a.jqplot.LinearAxisRenderer.call(this);this.sortMergedLabels=false};a.jqplot.CategoryAxisRenderer.prototype=new a.jqplot.LinearAxisRenderer();a.jqplot.CategoryAxisRenderer.prototype.constructor=a.jqplot.CategoryAxisRenderer;a.jqplot.CategoryAxisRenderer.prototype.init=function(e){this.groups=1;this.groupLabels=[];this._groupLabels=[];this._grouped=false;this._barsPerGroup=null;this.reverse=false;a.extend(true,this,{tickOptions:{formatString:"%d"}},e);var b=this._dataBounds;for(var f=0;f<this._series.length;f++){var g=this._series[f];if(g.groups){this.groups=g.groups}var h=g.data;for(var c=0;c<h.length;c++){if(this.name=="xaxis"||this.name=="x2axis"){if(h[c][0]<b.min||b.min==null){b.min=h[c][0]}if(h[c][0]>b.max||b.max==null){b.max=h[c][0]}}else{if(h[c][1]<b.min||b.min==null){b.min=h[c][1]}if(h[c][1]>b.max||b.max==null){b.max=h[c][1]}}}}if(this.groupLabels.length){this.groups=this.groupLabels.length}};a.jqplot.CategoryAxisRenderer.prototype.createTicks=function(){var D=this._ticks;var z=this.ticks;var F=this.name;var C=this._dataBounds;var v,A;var q,w;var d,c;var b,x;if(z.length){if(this.groups>1&&!this._grouped){var r=z.length;var p=parseInt(r/this.groups,10);var e=0;for(var x=p;x<r;x+=p){z.splice(x+e,0," ");e++}this._grouped=true}this.min=0.5;this.max=z.length+0.5;var m=this.max-this.min;this.numberTicks=2*z.length+1;for(x=0;x<z.length;x++){b=this.min+2*x*m/(this.numberTicks-1);var h=new this.tickRenderer(this.tickOptions);h.showLabel=false;h.setTick(b,this.name);this._ticks.push(h);var h=new this.tickRenderer(this.tickOptions);h.label=z[x];h.showMark=false;h.showGridline=false;h.setTick(b+0.5,this.name);this._ticks.push(h)}var h=new this.tickRenderer(this.tickOptions);h.showLabel=false;h.setTick(b+1,this.name);this._ticks.push(h)}else{if(F=="xaxis"||F=="x2axis"){v=this._plotDimensions.width}else{v=this._plotDimensions.height}if(this.min!=null&&this.max!=null&&this.numberTicks!=null){this.tickInterval=null}if(this.min!=null&&this.max!=null&&this.tickInterval!=null){if(parseInt((this.max-this.min)/this.tickInterval,10)!=(this.max-this.min)/this.tickInterval){this.tickInterval=null}}var y=[];var B=0;var q=0.5;var w,E;var f=false;for(var x=0;x<this._series.length;x++){var k=this._series[x];for(var u=0;u<k.data.length;u++){if(this.name=="xaxis"||this.name=="x2axis"){E=k.data[u][0]}else{E=k.data[u][1]}if(a.inArray(E,y)==-1){f=true;B+=1;y.push(E)}}}if(f&&this.sortMergedLabels){if(typeof y[0]=="string"){y.sort()}else{y.sort(function(j,i){return j-i})}}this.ticks=y;for(var x=0;x<this._series.length;x++){var k=this._series[x];for(var u=0;u<k.data.length;u++){if(this.name=="xaxis"||this.name=="x2axis"){E=k.data[u][0]}else{E=k.data[u][1]}var n=a.inArray(E,y)+1;if(this.name=="xaxis"||this.name=="x2axis"){k.data[u][0]=n}else{k.data[u][1]=n}}}if(this.groups>1&&!this._grouped){var r=y.length;var p=parseInt(r/this.groups,10);var e=0;for(var x=p;x<r;x+=p+1){y[x]=" "}this._grouped=true}w=B+0.5;if(this.numberTicks==null){this.numberTicks=2*B+1}var m=w-q;this.min=q;this.max=w;var o=0;var g=parseInt(3+v/10,10);var p=parseInt(B/g,10);if(this.tickInterval==null){this.tickInterval=m/(this.numberTicks-1)}for(var x=0;x<this.numberTicks;x++){b=this.min+x*this.tickInterval;var h=new this.tickRenderer(this.tickOptions);if(x/2==parseInt(x/2,10)){h.showLabel=false;h.showMark=true}else{if(p>0&&o<p){h.showLabel=false;o+=1}else{h.showLabel=true;o=0}h.label=h.formatter(h.formatString,y[(x-1)/2]);h.showMark=false;h.showGridline=false}h.setTick(b,this.name);this._ticks.push(h)}}};a.jqplot.CategoryAxisRenderer.prototype.draw=function(b,j){if(this.show){this.renderer.createTicks.call(this);var h=0;var c;if(this._elem){this._elem.emptyForce()}this._elem=this._elem||a('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>');if(this.name=="xaxis"||this.name=="x2axis"){this._elem.width(this._plotDimensions.width)}else{this._elem.height(this._plotDimensions.height)}this.labelOptions.axis=this.name;this._label=new this.labelRenderer(this.labelOptions);if(this._label.show){var g=this._label.draw(b,j);g.appendTo(this._elem)}var f=this._ticks;for(var e=0;e<f.length;e++){var d=f[e];if(d.showLabel&&(!d.isMinorTick||this.showMinorTicks)){var g=d.draw(b,j);g.appendTo(this._elem)}}this._groupLabels=[];for(var e=0;e<this.groupLabels.length;e++){var g=a('<div style="position:absolute;" class="jqplot-'+this.name+'-groupLabel"></div>');g.html(this.groupLabels[e]);this._groupLabels.push(g);g.appendTo(this._elem)}}return this._elem};a.jqplot.CategoryAxisRenderer.prototype.set=function(){var e=0;var m;var k=0;var f=0;var d=(this._label==null)?false:this._label.show;if(this.show){var n=this._ticks;for(var c=0;c<n.length;c++){var g=n[c];if(g.showLabel&&(!g.isMinorTick||this.showMinorTicks)){if(this.name=="xaxis"||this.name=="x2axis"){m=g._elem.outerHeight(true)}else{m=g._elem.outerWidth(true)}if(m>e){e=m}}}var j=0;for(var c=0;c<this._groupLabels.length;c++){var b=this._groupLabels[c];if(this.name=="xaxis"||this.name=="x2axis"){m=b.outerHeight(true)}else{m=b.outerWidth(true)}if(m>j){j=m}}if(d){k=this._label._elem.outerWidth(true);f=this._label._elem.outerHeight(true)}if(this.name=="xaxis"){e+=j+f;this._elem.css({height:e+"px",left:"0px",bottom:"0px"})}else{if(this.name=="x2axis"){e+=j+f;this._elem.css({height:e+"px",left:"0px",top:"0px"})}else{if(this.name=="yaxis"){e+=j+k;this._elem.css({width:e+"px",left:"0px",top:"0px"});if(d&&this._label.constructor==a.jqplot.AxisLabelRenderer){this._label._elem.css("width",k+"px")}}else{e+=j+k;this._elem.css({width:e+"px",right:"0px",top:"0px"});if(d&&this._label.constructor==a.jqplot.AxisLabelRenderer){this._label._elem.css("width",k+"px")}}}}}};a.jqplot.CategoryAxisRenderer.prototype.pack=function(e,c){var C=this._ticks;var v=this.max;var s=this.min;var n=c.max;var l=c.min;var q=(this._label==null)?false:this._label.show;var x;for(var r in e){this._elem.css(r,e[r])}this._offsets=c;var g=n-l;var k=v-s;if(!this.reverse){this.u2p=function(h){return(h-s)*g/k+l};this.p2u=function(h){return(h-l)*k/g+s};if(this.name=="xaxis"||this.name=="x2axis"){this.series_u2p=function(h){return(h-s)*g/k};this.series_p2u=function(h){return h*k/g+s}}else{this.series_u2p=function(h){return(h-v)*g/k};this.series_p2u=function(h){return h*k/g+v}}}else{this.u2p=function(h){return l+(v-h)*g/k};this.p2u=function(h){return s+(h-l)*k/g};if(this.name=="xaxis"||this.name=="x2axis"){this.series_u2p=function(h){return(v-h)*g/k};this.series_p2u=function(h){return h*k/g+v}}else{this.series_u2p=function(h){return(s-h)*g/k};this.series_p2u=function(h){return h*k/g+s}}}if(this.show){if(this.name=="xaxis"||this.name=="x2axis"){for(x=0;x<C.length;x++){var o=C[x];if(o.show&&o.showLabel){var b;if(o.constructor==a.jqplot.CanvasAxisTickRenderer&&o.angle){var A=(this.name=="xaxis")?1:-1;switch(o.labelPosition){case"auto":if(A*o.angle<0){b=-o.getWidth()+o._textRenderer.height*Math.sin(-o._textRenderer.angle)/2}else{b=-o._textRenderer.height*Math.sin(o._textRenderer.angle)/2}break;case"end":b=-o.getWidth()+o._textRenderer.height*Math.sin(-o._textRenderer.angle)/2;break;case"start":b=-o._textRenderer.height*Math.sin(o._textRenderer.angle)/2;break;case"middle":b=-o.getWidth()/2+o._textRenderer.height*Math.sin(-o._textRenderer.angle)/2;break;default:b=-o.getWidth()/2+o._textRenderer.height*Math.sin(-o._textRenderer.angle)/2;break}}else{b=-o.getWidth()/2}var D=this.u2p(o.value)+b+"px";o._elem.css("left",D);o.pack()}}var z=["bottom",0];if(q){var m=this._label._elem.outerWidth(true);this._label._elem.css("left",l+g/2-m/2+"px");if(this.name=="xaxis"){this._label._elem.css("bottom","0px");z=["bottom",this._label._elem.outerHeight(true)]}else{this._label._elem.css("top","0px");z=["top",this._label._elem.outerHeight(true)]}this._label.pack()}var d=parseInt(this._ticks.length/this.groups,10)+1;for(x=0;x<this._groupLabels.length;x++){var B=0;var f=0;for(var u=x*d;u<(x+1)*d;u++){if(u>=this._ticks.length-1){continue}if(this._ticks[u]._elem&&this._ticks[u].label!=" "){var o=this._ticks[u]._elem;var r=o.position();B+=r.left+o.outerWidth(true)/2;f++}}B=B/f;this._groupLabels[x].css({left:(B-this._groupLabels[x].outerWidth(true)/2)});this._groupLabels[x].css(z[0],z[1])}}else{for(x=0;x<C.length;x++){var o=C[x];if(o.show&&o.showLabel){var b;if(o.constructor==a.jqplot.CanvasAxisTickRenderer&&o.angle){var A=(this.name=="yaxis")?1:-1;switch(o.labelPosition){case"auto":case"end":if(A*o.angle<0){b=-o._textRenderer.height*Math.cos(-o._textRenderer.angle)/2}else{b=-o.getHeight()+o._textRenderer.height*Math.cos(o._textRenderer.angle)/2}break;case"start":if(o.angle>0){b=-o._textRenderer.height*Math.cos(-o._textRenderer.angle)/2}else{b=-o.getHeight()+o._textRenderer.height*Math.cos(o._textRenderer.angle)/2}break;case"middle":b=-o.getHeight()/2;break;default:b=-o.getHeight()/2;break}}else{b=-o.getHeight()/2}var D=this.u2p(o.value)+b+"px";o._elem.css("top",D);o.pack()}}var z=["left",0];if(q){var y=this._label._elem.outerHeight(true);this._label._elem.css("top",n-g/2-y/2+"px");if(this.name=="yaxis"){this._label._elem.css("left","0px");z=["left",this._label._elem.outerWidth(true)]}else{this._label._elem.css("right","0px");z=["right",this._label._elem.outerWidth(true)]}this._label.pack()}var d=parseInt(this._ticks.length/this.groups,10)+1;for(x=0;x<this._groupLabels.length;x++){var B=0;var f=0;for(var u=x*d;u<(x+1)*d;u++){if(u>=this._ticks.length-1){continue}if(this._ticks[u]._elem&&this._ticks[u].label!=" "){var o=this._ticks[u]._elem;var r=o.position();B+=r.top+o.outerHeight()/2;f++}}B=B/f;this._groupLabels[x].css({top:B-this._groupLabels[x].outerHeight()/2});this._groupLabels[x].css(z[0],z[1])}}}}})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(d){d.jqplot.BarRenderer=function(){d.jqplot.LineRenderer.call(this)};d.jqplot.BarRenderer.prototype=new d.jqplot.LineRenderer();d.jqplot.BarRenderer.prototype.constructor=d.jqplot.BarRenderer;d.jqplot.BarRenderer.prototype.init=function(o,q){this.barPadding=8;this.barMargin=10;this.barDirection="vertical";this.barWidth=null;this.shadowOffset=2;this.shadowDepth=5;this.shadowAlpha=0.08;this.waterfall=false;this.groups=1;this.varyBarColor=false;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.transposedData=true;this.renderer.animation={show:false,direction:"down",speed:3000,_supported:true};this._type="bar";if(o.highlightMouseDown&&o.highlightMouseOver==null){o.highlightMouseOver=false}d.extend(true,this,o);d.extend(true,this.renderer,o);this.fill=true;if(this.barDirection==="horizontal"&&this.rendererOptions.animation&&this.rendererOptions.animation.direction==null){this.renderer.animation.direction="left"}if(this.waterfall){this.fillToZero=false;this.disableStack=true}if(this.barDirection=="vertical"){this._primaryAxis="_xaxis";this._stackAxis="y";this.fillAxis="y"}else{this._primaryAxis="_yaxis";this._stackAxis="x";this.fillAxis="x"}this._highlightedPoint=null;this._plotSeriesInfo=null;this._dataColors=[];this._barPoints=[];var p={lineJoin:"miter",lineCap:"round",fill:true,isarc:false,strokeStyle:this.color,fillStyle:this.color,closePath:this.fill};this.renderer.shapeRenderer.init(p);var n={lineJoin:"miter",lineCap:"round",fill:true,isarc:false,angle:this.shadowAngle,offset:this.shadowOffset,alpha:this.shadowAlpha,depth:this.shadowDepth,closePath:this.fill};this.renderer.shadowRenderer.init(n);q.postInitHooks.addOnce(h);q.postDrawHooks.addOnce(j);q.eventListenerHooks.addOnce("jqplotMouseMove",b);q.eventListenerHooks.addOnce("jqplotMouseDown",a);q.eventListenerHooks.addOnce("jqplotMouseUp",l);q.eventListenerHooks.addOnce("jqplotClick",e);q.eventListenerHooks.addOnce("jqplotRightClick",m)};function g(t,p,o,w){if(this.rendererOptions.barDirection=="horizontal"){this._stackAxis="x";this._primaryAxis="_yaxis"}if(this.rendererOptions.waterfall==true){this._data=d.extend(true,[],this.data);var s=0;var u=(!this.rendererOptions.barDirection||this.rendererOptions.barDirection==="vertical"||this.transposedData===false)?1:0;for(var q=0;q<this.data.length;q++){s+=this.data[q][u];if(q>0){this.data[q][u]+=this.data[q-1][u]}}this.data[this.data.length]=(u==1)?[this.data.length+1,s]:[s,this.data.length+1];this._data[this._data.length]=(u==1)?[this._data.length+1,s]:[s,this._data.length+1]}if(this.rendererOptions.groups>1){this.breakOnNull=true;var n=this.data.length;var v=parseInt(n/this.rendererOptions.groups,10);var r=0;for(var q=v;q<n;q+=v){this.data.splice(q+r,0,[null,null]);this._plotData.splice(q+r,0,[null,null]);this._stackData.splice(q+r,0,[null,null]);r++}for(q=0;q<this.data.length;q++){if(this._primaryAxis=="_xaxis"){this.data[q][0]=q+1;this._plotData[q][0]=q+1;this._stackData[q][0]=q+1}else{this.data[q][1]=q+1;this._plotData[q][1]=q+1;this._stackData[q][1]=q+1}}}}d.jqplot.preSeriesInitHooks.push(g);d.jqplot.BarRenderer.prototype.calcSeriesNumbers=function(){var r=0;var t=0;var q=this[this._primaryAxis];var p,o,u;for(var n=0;n<q._series.length;n++){o=q._series[n];if(o===this){u=n}if(o.renderer.constructor==d.jqplot.BarRenderer){r+=o.data.length;t+=1}}return[r,t,u]};d.jqplot.BarRenderer.prototype.setBarWidth=function(){var q;var n=0;var o=0;var t=this[this._primaryAxis];var x,r,v;var w=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);n=w[0];o=w[1];var u=t.numberTicks;var p=(u-1)/2;if(t.name=="xaxis"||t.name=="x2axis"){if(this._stack){this.barWidth=(t._offsets.max-t._offsets.min)/n*o-this.barMargin}else{this.barWidth=((t._offsets.max-t._offsets.min)/p-this.barPadding*(o-1)-this.barMargin*2)/o}}else{if(this._stack){this.barWidth=(t._offsets.min-t._offsets.max)/n*o-this.barMargin}else{this.barWidth=((t._offsets.min-t._offsets.max)/p-this.barPadding*(o-1)-this.barMargin*2)/o}}return[n,o]};function f(o){var q=[];for(var s=0;s<o.length;s++){var r=d.jqplot.getColorComponents(o[s]);var n=[r[0],r[1],r[2]];var t=n[0]+n[1]+n[2];for(var p=0;p<3;p++){n[p]=(t>570)?n[p]*0.8:n[p]+0.3*(255-n[p]);n[p]=parseInt(n[p],10)}q.push("rgb("+n[0]+","+n[1]+","+n[2]+")")}return q}function i(v,u,s,t,o){var q=v,w=v-1,n,p,r=(o==="x")?0:1;if(q>0){p=t.series[w]._plotData[u][r];if((s*p)<0){n=i(w,u,s,t,o)}else{n=t.series[w].gridData[u][r]}}else{n=(r===0)?t.series[q]._xaxis.series_u2p(0):t.series[q]._yaxis.series_u2p(0)}return n}d.jqplot.BarRenderer.prototype.draw=function(E,L,q,G){var I;var A=d.extend({},q);var w=(A.shadow!=undefined)?A.shadow:this.shadow;var O=(A.showLine!=undefined)?A.showLine:this.showLine;var F=(A.fill!=undefined)?A.fill:this.fill;var p=this.xaxis;var J=this.yaxis;var y=this._xaxis.series_u2p;var K=this._yaxis.series_u2p;var D,C;this._dataColors=[];this._barPoints=[];if(this.barWidth==null){this.renderer.setBarWidth.call(this)}var N=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);var x=N[0];var v=N[1];var s=N[2];var H=[];if(this._stack){this._barNudge=0}else{this._barNudge=(-Math.abs(v/2-0.5)+s)*(this.barWidth+this.barPadding)}if(O){var u=new d.jqplot.ColorGenerator(this.negativeSeriesColors);var B=new d.jqplot.ColorGenerator(this.seriesColors);var M=u.get(this.index);if(!this.useNegativeColors){M=A.fillStyle}var t=A.fillStyle;var r;var P;var o;if(this.barDirection=="vertical"){for(var I=0;I<L.length;I++){if(!this._stack&&this.data[I][1]==null){continue}H=[];r=L[I][0]+this._barNudge;if(this._stack&&this._prevGridData.length){o=i(this.index,I,this._plotData[I][1],G,"y")}else{if(this.fillToZero){o=this._yaxis.series_u2p(0)}else{if(this.waterfall&&I>0&&I<this.gridData.length-1){o=this.gridData[I-1][1]}else{if(this.waterfall&&I==0&&I<this.gridData.length-1){if(this._yaxis.min<=0&&this._yaxis.max>=0){o=this._yaxis.series_u2p(0)}else{if(this._yaxis.min>0){o=E.canvas.height}else{o=0}}}else{if(this.waterfall&&I==this.gridData.length-1){if(this._yaxis.min<=0&&this._yaxis.max>=0){o=this._yaxis.series_u2p(0)}else{if(this._yaxis.min>0){o=E.canvas.height}else{o=0}}}else{o=E.canvas.height}}}}}if((this.fillToZero&&this._plotData[I][1]<0)||(this.waterfall&&this._data[I][1]<0)){if(this.varyBarColor&&!this._stack){if(this.useNegativeColors){A.fillStyle=u.next()}else{A.fillStyle=B.next()}}else{A.fillStyle=M}}else{if(this.varyBarColor&&!this._stack){A.fillStyle=B.next()}else{A.fillStyle=t}}if(!this.fillToZero||this._plotData[I][1]>=0){H.push([r-this.barWidth/2,o]);H.push([r-this.barWidth/2,L[I][1]]);H.push([r+this.barWidth/2,L[I][1]]);H.push([r+this.barWidth/2,o])}else{H.push([r-this.barWidth/2,L[I][1]]);H.push([r-this.barWidth/2,o]);H.push([r+this.barWidth/2,o]);H.push([r+this.barWidth/2,L[I][1]])}this._barPoints.push(H);if(w&&!this._stack){var z=d.extend(true,{},A);delete z.fillStyle;this.renderer.shadowRenderer.draw(E,H,z)}var n=A.fillStyle||this.color;this._dataColors.push(n);this.renderer.shapeRenderer.draw(E,H,A)}}else{if(this.barDirection=="horizontal"){for(var I=0;I<L.length;I++){if(!this._stack&&this.data[I][0]==null){continue}H=[];r=L[I][1]-this._barNudge;P;if(this._stack&&this._prevGridData.length){P=i(this.index,I,this._plotData[I][0],G,"x")}else{if(this.fillToZero){P=this._xaxis.series_u2p(0)}else{if(this.waterfall&&I>0&&I<this.gridData.length-1){P=this.gridData[I-1][0]}else{if(this.waterfall&&I==0&&I<this.gridData.length-1){if(this._xaxis.min<=0&&this._xaxis.max>=0){P=this._xaxis.series_u2p(0)}else{if(this._xaxis.min>0){P=0}else{P=0}}}else{if(this.waterfall&&I==this.gridData.length-1){if(this._xaxis.min<=0&&this._xaxis.max>=0){P=this._xaxis.series_u2p(0)}else{if(this._xaxis.min>0){P=0}else{P=E.canvas.width}}}else{P=0}}}}}if((this.fillToZero&&this._plotData[I][0]<0)||(this.waterfall&&this._data[I][0]<0)){if(this.varyBarColor&&!this._stack){if(this.useNegativeColors){A.fillStyle=u.next()}else{A.fillStyle=B.next()}}else{A.fillStyle=M}}else{if(this.varyBarColor&&!this._stack){A.fillStyle=B.next()}else{A.fillStyle=t}}if(!this.fillToZero||this._plotData[I][0]>=0){H.push([P,r+this.barWidth/2]);H.push([P,r-this.barWidth/2]);H.push([L[I][0],r-this.barWidth/2]);H.push([L[I][0],r+this.barWidth/2])}else{H.push([L[I][0],r+this.barWidth/2]);H.push([L[I][0],r-this.barWidth/2]);H.push([P,r-this.barWidth/2]);H.push([P,r+this.barWidth/2])}this._barPoints.push(H);if(w&&!this._stack){var z=d.extend(true,{},A);delete z.fillStyle;this.renderer.shadowRenderer.draw(E,H,z)}var n=A.fillStyle||this.color;this._dataColors.push(n);this.renderer.shapeRenderer.draw(E,H,A)}}}}if(this.highlightColors.length==0){this.highlightColors=d.jqplot.computeHighlightColors(this._dataColors)}else{if(typeof(this.highlightColors)=="string"){var N=this.highlightColors;this.highlightColors=[];for(var I=0;I<this._dataColors.length;I++){this.highlightColors.push(N)}}}};d.jqplot.BarRenderer.prototype.drawShadow=function(z,G,p,B){var D;var w=(p!=undefined)?p:{};var t=(w.shadow!=undefined)?w.shadow:this.shadow;var I=(w.showLine!=undefined)?w.showLine:this.showLine;var A=(w.fill!=undefined)?w.fill:this.fill;var o=this.xaxis;var E=this.yaxis;var v=this._xaxis.series_u2p;var F=this._yaxis.series_u2p;var y,C,x,u,s,r;if(this._stack&&this.shadow){if(this.barWidth==null){this.renderer.setBarWidth.call(this)}var H=this._plotSeriesInfo=this.renderer.calcSeriesNumbers.call(this);u=H[0];s=H[1];r=H[2];if(this._stack){this._barNudge=0}else{this._barNudge=(-Math.abs(s/2-0.5)+r)*(this.barWidth+this.barPadding)}if(I){if(this.barDirection=="vertical"){for(var D=0;D<G.length;D++){if(this.data[D][1]==null){continue}C=[];var q=G[D][0]+this._barNudge;var n;if(this._stack&&this._prevGridData.length){n=i(this.index,D,this._plotData[D][1],B,"y")}else{if(this.fillToZero){n=this._yaxis.series_u2p(0)}else{n=z.canvas.height}}C.push([q-this.barWidth/2,n]);C.push([q-this.barWidth/2,G[D][1]]);C.push([q+this.barWidth/2,G[D][1]]);C.push([q+this.barWidth/2,n]);this.renderer.shadowRenderer.draw(z,C,w)}}else{if(this.barDirection=="horizontal"){for(var D=0;D<G.length;D++){if(this.data[D][0]==null){continue}C=[];var q=G[D][1]-this._barNudge;var J;if(this._stack&&this._prevGridData.length){J=i(this.index,D,this._plotData[D][0],B,"x")}else{if(this.fillToZero){J=this._xaxis.series_u2p(0)}else{J=0}}C.push([J,q+this.barWidth/2]);C.push([G[D][0],q+this.barWidth/2]);C.push([G[D][0],q-this.barWidth/2]);C.push([J,q-this.barWidth/2]);this.renderer.shadowRenderer.draw(z,C,w)}}}}}};function h(q,p,n){for(var o=0;o<this.series.length;o++){if(this.series[o].renderer.constructor==d.jqplot.BarRenderer){if(this.series[o].highlightMouseOver){this.series[o].highlightMouseDown=false}}}}function j(){if(this.plugins.barRenderer&&this.plugins.barRenderer.highlightCanvas){this.plugins.barRenderer.highlightCanvas.resetCanvas();this.plugins.barRenderer.highlightCanvas=null}this.plugins.barRenderer={highlightedSeriesIndex:null};this.plugins.barRenderer.highlightCanvas=new d.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.barRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-barRenderer-highlight-canvas",this._plotDimensions,this));this.plugins.barRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind("mouseleave",{plot:this},function(n){k(n.data.plot)})}function c(u,t,q,p){var o=u.series[t];var n=u.plugins.barRenderer.highlightCanvas;n._ctx.clearRect(0,0,n._ctx.canvas.width,n._ctx.canvas.height);o._highlightedPoint=q;u.plugins.barRenderer.highlightedSeriesIndex=t;var r={fillStyle:o.highlightColors[q]};o.renderer.shapeRenderer.draw(n._ctx,p,r);n=null}function k(p){var n=p.plugins.barRenderer.highlightCanvas;n._ctx.clearRect(0,0,n._ctx.canvas.width,n._ctx.canvas.height);for(var o=0;o<p.series.length;o++){p.series[o]._highlightedPoint=null}p.plugins.barRenderer.highlightedSeriesIndex=null;p.target.trigger("jqplotDataUnhighlight");n=null}function b(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];var o=jQuery.Event("jqplotDataMouseOver");o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p);if(s.series[p[0]].show&&s.series[p[0]].highlightMouseOver&&!(p[0]==s.plugins.barRenderer.highlightedSeriesIndex&&p[1]==s.series[p[0]]._highlightedPoint)){var n=jQuery.Event("jqplotDataHighlight");n.which=r.which;n.pageX=r.pageX;n.pageY=r.pageY;s.target.trigger(n,p);c(s,t.seriesIndex,t.pointIndex,t.points)}}else{if(t==null){k(s)}}}function a(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];if(r.series[o[0]].highlightMouseDown&&!(o[0]==r.plugins.barRenderer.highlightedSeriesIndex&&o[1]==r.series[o[0]]._highlightedPoint)){var n=jQuery.Event("jqplotDataHighlight");n.which=q.which;n.pageX=q.pageX;n.pageY=q.pageY;r.target.trigger(n,o);c(r,s.seriesIndex,s.pointIndex,s.points)}}else{if(s==null){k(r)}}}function l(p,o,s,r,q){var n=q.plugins.barRenderer.highlightedSeriesIndex;if(n!=null&&q.series[n].highlightMouseDown){k(q)}}function e(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];var n=jQuery.Event("jqplotDataClick");n.which=q.which;n.pageX=q.pageX;n.pageY=q.pageY;r.target.trigger(n,o)}}function m(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];var n=s.plugins.barRenderer.highlightedSeriesIndex;if(n!=null&&s.series[n].highlightMouseDown){k(s)}var o=jQuery.Event("jqplotDataRightClick");o.which=r.which;o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p)}}})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(d){d.jqplot.eventListenerHooks.push(["jqplotMouseMove",f]);d.jqplot.Highlighter=function(h){this.show=d.jqplot.config.enablePlugins;this.markerRenderer=new d.jqplot.MarkerRenderer({shadow:false});this.showMarker=true;this.lineWidthAdjust=2.5;this.sizeAdjust=5;this.showTooltip=true;this.tooltipLocation="nw";this.fadeTooltip=true;this.tooltipFadeSpeed="fast";this.tooltipOffset=2;this.tooltipAxes="both";this.tooltipSeparator=", ";this.tooltipContentEditor=null;this.useAxesFormatters=true;this.tooltipFormatString="%.5P";this.formatString=null;this.yvalues=1;this.bringSeriesToFront=false;this._tooltipElem;this.isHighlighting=false;this.currentNeighbor=null;d.extend(true,this,h)};var b=["nw","n","ne","e","se","s","sw","w"];var e={nw:0,n:1,ne:2,e:3,se:4,s:5,sw:6,w:7};var c=["se","s","sw","w","nw","n","ne","e"];d.jqplot.Highlighter.init=function(k,j,i){var h=i||{};this.plugins.highlighter=new d.jqplot.Highlighter(h.highlighter)};d.jqplot.Highlighter.parseOptions=function(i,h){this.showHighlight=true};d.jqplot.Highlighter.postPlotDraw=function(){if(this.plugins.highlighter&&this.plugins.highlighter.highlightCanvas){this.plugins.highlighter.highlightCanvas.resetCanvas();this.plugins.highlighter.highlightCanvas=null}if(this.plugins.highlighter&&this.plugins.highlighter._tooltipElem){this.plugins.highlighter._tooltipElem.emptyForce();this.plugins.highlighter._tooltipElem=null}this.plugins.highlighter.highlightCanvas=new d.jqplot.GenericCanvas();this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding,"jqplot-highlight-canvas",this._plotDimensions,this));this.plugins.highlighter.highlightCanvas.setContext();var h=document.createElement("div");this.plugins.highlighter._tooltipElem=d(h);h=null;this.plugins.highlighter._tooltipElem.addClass("jqplot-highlighter-tooltip");this.plugins.highlighter._tooltipElem.css({position:"absolute",display:"none"});this.eventCanvas._elem.before(this.plugins.highlighter._tooltipElem)};d.jqplot.preInitHooks.push(d.jqplot.Highlighter.init);d.jqplot.preParseSeriesOptionsHooks.push(d.jqplot.Highlighter.parseOptions);d.jqplot.postDrawHooks.push(d.jqplot.Highlighter.postPlotDraw);function a(m,o){var j=m.plugins.highlighter;var p=m.series[o.seriesIndex];var h=p.markerRenderer;var i=j.markerRenderer;i.style=h.style;i.lineWidth=h.lineWidth+j.lineWidthAdjust;i.size=h.size+j.sizeAdjust;var l=d.jqplot.getColorComponents(h.color);var n=[l[0],l[1],l[2]];var k=(l[3]>=0.6)?l[3]*0.6:l[3]*(2-l[3]);i.color="rgba("+n[0]+","+n[1]+","+n[2]+","+k+")";i.init();i.draw(p.gridData[o.pointIndex][0],p.gridData[o.pointIndex][1],j.highlightCanvas._ctx)}function g(A,q,m){var k=A.plugins.highlighter;var D=k._tooltipElem;var r=q.highlighter||{};var t=d.extend(true,{},k,r);if(t.useAxesFormatters){var w=q._xaxis._ticks[0].formatter;var h=q._yaxis._ticks[0].formatter;var E=q._xaxis._ticks[0].formatString;var s=q._yaxis._ticks[0].formatString;var z;var u=w(E,m.data[0]);var l=[];for(var B=1;B<t.yvalues+1;B++){l.push(h(s,m.data[B]))}if(typeof t.formatString==="string"){switch(t.tooltipAxes){case"both":case"xy":l.unshift(u);l.unshift(t.formatString);z=d.jqplot.sprintf.apply(d.jqplot.sprintf,l);break;case"yx":l.push(u);l.unshift(t.formatString);z=d.jqplot.sprintf.apply(d.jqplot.sprintf,l);break;case"x":z=d.jqplot.sprintf.apply(d.jqplot.sprintf,[t.formatString,u]);break;case"y":l.unshift(t.formatString);z=d.jqplot.sprintf.apply(d.jqplot.sprintf,l);break;default:l.unshift(u);l.unshift(t.formatString);z=d.jqplot.sprintf.apply(d.jqplot.sprintf,l);break}}else{switch(t.tooltipAxes){case"both":case"xy":z=u;for(var B=0;B<l.length;B++){z+=t.tooltipSeparator+l[B]}break;case"yx":z="";for(var B=0;B<l.length;B++){z+=l[B]+t.tooltipSeparator}z+=u;break;case"x":z=u;break;case"y":z=l.join(t.tooltipSeparator);break;default:z=u;for(var B=0;B<l.length;B++){z+=t.tooltipSeparator+l[B]}break}}}else{var z;if(typeof t.formatString==="string"){z=d.jqplot.sprintf.apply(d.jqplot.sprintf,[t.formatString].concat(m.data))}else{if(t.tooltipAxes=="both"||t.tooltipAxes=="xy"){z=d.jqplot.sprintf(t.tooltipFormatString,m.data[0])+t.tooltipSeparator+d.jqplot.sprintf(t.tooltipFormatString,m.data[1])}else{if(t.tooltipAxes=="yx"){z=d.jqplot.sprintf(t.tooltipFormatString,m.data[1])+t.tooltipSeparator+d.jqplot.sprintf(t.tooltipFormatString,m.data[0])}else{if(t.tooltipAxes=="x"){z=d.jqplot.sprintf(t.tooltipFormatString,m.data[0])}else{if(t.tooltipAxes=="y"){z=d.jqplot.sprintf(t.tooltipFormatString,m.data[1])}}}}}}if(d.isFunction(t.tooltipContentEditor)){z=t.tooltipContentEditor(z,m.seriesIndex,m.pointIndex,A)}D.html(z);var C={x:m.gridData[0],y:m.gridData[1]};var v=0;var j=0.707;if(q.markerRenderer.show==true){v=(q.markerRenderer.size+t.sizeAdjust)/2}var o=b;if(q.fillToZero&&q.fill&&m.data[1]<0){o=c}switch(o[e[t.tooltipLocation]]){case"nw":var p=C.x+A._gridPadding.left-D.outerWidth(true)-t.tooltipOffset-j*v;var n=C.y+A._gridPadding.top-t.tooltipOffset-D.outerHeight(true)-j*v;break;case"n":var p=C.x+A._gridPadding.left-D.outerWidth(true)/2;var n=C.y+A._gridPadding.top-t.tooltipOffset-D.outerHeight(true)-v;break;case"ne":var p=C.x+A._gridPadding.left+t.tooltipOffset+j*v;var n=C.y+A._gridPadding.top-t.tooltipOffset-D.outerHeight(true)-j*v;break;case"e":var p=C.x+A._gridPadding.left+t.tooltipOffset+v;var n=C.y+A._gridPadding.top-D.outerHeight(true)/2;break;case"se":var p=C.x+A._gridPadding.left+t.tooltipOffset+j*v;var n=C.y+A._gridPadding.top+t.tooltipOffset+j*v;break;case"s":var p=C.x+A._gridPadding.left-D.outerWidth(true)/2;var n=C.y+A._gridPadding.top+t.tooltipOffset+v;break;case"sw":var p=C.x+A._gridPadding.left-D.outerWidth(true)-t.tooltipOffset-j*v;var n=C.y+A._gridPadding.top+t.tooltipOffset+j*v;break;case"w":var p=C.x+A._gridPadding.left-D.outerWidth(true)-t.tooltipOffset-v;var n=C.y+A._gridPadding.top-D.outerHeight(true)/2;break;default:var p=C.x+A._gridPadding.left-D.outerWidth(true)-t.tooltipOffset-j*v;var n=C.y+A._gridPadding.top-t.tooltipOffset-D.outerHeight(true)-j*v;break}D.css("left",p);D.css("top",n);if(t.fadeTooltip){D.stop(true,true).fadeIn(t.tooltipFadeSpeed)}else{D.show()}D=null}function f(n,j,i,p,l){var h=l.plugins.highlighter;var m=l.plugins.cursor;if(h.show){if(p==null&&h.isHighlighting){var o=jQuery.Event("jqplotHighlighterUnhighlight");l.target.trigger(o);var q=h.highlightCanvas._ctx;q.clearRect(0,0,q.canvas.width,q.canvas.height);if(h.fadeTooltip){h._tooltipElem.fadeOut(h.tooltipFadeSpeed)}else{h._tooltipElem.hide()}if(h.bringSeriesToFront){l.restorePreviousSeriesOrder()}h.isHighlighting=false;h.currentNeighbor=null;q=null}else{if(p!=null&&l.series[p.seriesIndex].showHighlight&&!h.isHighlighting){var o=jQuery.Event("jqplotHighlighterHighlight");o.which=n.which;o.pageX=n.pageX;o.pageY=n.pageY;var k=[p.seriesIndex,p.pointIndex,p.data,l];l.target.trigger(o,k);h.isHighlighting=true;h.currentNeighbor=p;if(h.showMarker){a(l,p)}if(l.series[p.seriesIndex].show&&h.showTooltip&&(!m||!m._zoom.started)){g(l,l.series[p.seriesIndex],p)}if(h.bringSeriesToFront){l.moveSeriesToFront(p.seriesIndex)}}else{if(p!=null&&h.isHighlighting&&h.currentNeighbor!=p){if(l.series[p.seriesIndex].showHighlight){var q=h.highlightCanvas._ctx;q.clearRect(0,0,q.canvas.width,q.canvas.height);h.isHighlighting=true;h.currentNeighbor=p;if(h.showMarker){a(l,p)}if(l.series[p.seriesIndex].show&&h.showTooltip&&(!m||!m._zoom.started)){g(l,l.series[p.seriesIndex],p)}if(h.bringSeriesToFront){l.moveSeriesToFront(p.seriesIndex)}}}}}}}})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(a){a.jqplot.CanvasTextRenderer=function(b){this.fontStyle="normal";this.fontVariant="normal";this.fontWeight="normal";this.fontSize="10px";this.fontFamily="sans-serif";this.fontStretch=1;this.fillStyle="#666666";this.angle=0;this.textAlign="start";this.textBaseline="alphabetic";this.text;this.width;this.height;this.pt2px=1.28;a.extend(true,this,b);this.normalizedFontSize=this.normalizeFontSize(this.fontSize);this.setHeight()};a.jqplot.CanvasTextRenderer.prototype.init=function(b){a.extend(true,this,b);this.normalizedFontSize=this.normalizeFontSize(this.fontSize);this.setHeight()};a.jqplot.CanvasTextRenderer.prototype.normalizeFontSize=function(b){b=String(b);var c=parseFloat(b);if(b.indexOf("px")>-1){return c/this.pt2px}else{if(b.indexOf("pt")>-1){return c}else{if(b.indexOf("em")>-1){return c*12}else{if(b.indexOf("%")>-1){return c*12/100}else{return c/this.pt2px}}}}};a.jqplot.CanvasTextRenderer.prototype.fontWeight2Float=function(b){if(Number(b)){return b/400}else{switch(b){case"normal":return 1;break;case"bold":return 1.75;break;case"bolder":return 2.25;break;case"lighter":return 0.75;break;default:return 1;break}}};a.jqplot.CanvasTextRenderer.prototype.getText=function(){return this.text};a.jqplot.CanvasTextRenderer.prototype.setText=function(c,b){this.text=c;this.setWidth(b);return this};a.jqplot.CanvasTextRenderer.prototype.getWidth=function(b){return this.width};a.jqplot.CanvasTextRenderer.prototype.setWidth=function(c,b){if(!b){this.width=this.measure(c,this.text)}else{this.width=b}return this};a.jqplot.CanvasTextRenderer.prototype.getHeight=function(b){return this.height};a.jqplot.CanvasTextRenderer.prototype.setHeight=function(b){if(!b){this.height=this.normalizedFontSize*this.pt2px}else{this.height=b}return this};a.jqplot.CanvasTextRenderer.prototype.letter=function(b){return this.letters[b]};a.jqplot.CanvasTextRenderer.prototype.ascent=function(){return this.normalizedFontSize};a.jqplot.CanvasTextRenderer.prototype.descent=function(){return 7*this.normalizedFontSize/25};a.jqplot.CanvasTextRenderer.prototype.measure=function(d,g){var f=0;var b=g.length;for(var e=0;e<b;e++){var h=this.letter(g.charAt(e));if(h){f+=h.width*this.normalizedFontSize/25*this.fontStretch}}return f};a.jqplot.CanvasTextRenderer.prototype.draw=function(s,n){var r=0;var o=this.height*0.72;var p=0;var l=n.length;var k=this.normalizedFontSize/25;s.save();var h,f;if((-Math.PI/2<=this.angle&&this.angle<=0)||(Math.PI*3/2<=this.angle&&this.angle<=Math.PI*2)){h=0;f=-Math.sin(this.angle)*this.width}else{if((0<this.angle&&this.angle<=Math.PI/2)||(-Math.PI*2<=this.angle&&this.angle<=-Math.PI*3/2)){h=Math.sin(this.angle)*this.height;f=0}else{if((-Math.PI<this.angle&&this.angle<-Math.PI/2)||(Math.PI<=this.angle&&this.angle<=Math.PI*3/2)){h=-Math.cos(this.angle)*this.width;f=-Math.sin(this.angle)*this.width-Math.cos(this.angle)*this.height}else{if((-Math.PI*3/2<this.angle&&this.angle<Math.PI)||(Math.PI/2<this.angle&&this.angle<Math.PI)){h=Math.sin(this.angle)*this.height-Math.cos(this.angle)*this.width;f=-Math.cos(this.angle)*this.height}}}}s.strokeStyle=this.fillStyle;s.fillStyle=this.fillStyle;s.translate(h,f);s.rotate(this.angle);s.lineCap="round";var t=(this.normalizedFontSize>30)?2:2+(30-this.normalizedFontSize)/20;s.lineWidth=t*k*this.fontWeight2Float(this.fontWeight);for(var g=0;g<l;g++){var m=this.letter(n.charAt(g));if(!m){continue}s.beginPath();var e=1;var b=0;for(var d=0;d<m.points.length;d++){var q=m.points[d];if(q[0]==-1&&q[1]==-1){e=1;continue}if(e){s.moveTo(r+q[0]*k*this.fontStretch,o-q[1]*k);e=false}else{s.lineTo(r+q[0]*k*this.fontStretch,o-q[1]*k)}}s.stroke();r+=m.width*k*this.fontStretch}s.restore();return p};a.jqplot.CanvasTextRenderer.prototype.letters={" ":{width:16,points:[]},"!":{width:10,points:[[5,21],[5,7],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},'"':{width:16,points:[[4,21],[4,14],[-1,-1],[12,21],[12,14]]},"#":{width:21,points:[[11,25],[4,-7],[-1,-1],[17,25],[10,-7],[-1,-1],[4,12],[18,12],[-1,-1],[3,6],[17,6]]},"$":{width:20,points:[[8,25],[8,-4],[-1,-1],[12,25],[12,-4],[-1,-1],[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},"%":{width:24,points:[[21,21],[3,0],[-1,-1],[8,21],[10,19],[10,17],[9,15],[7,14],[5,14],[3,16],[3,18],[4,20],[6,21],[8,21],[10,20],[13,19],[16,19],[19,20],[21,21],[-1,-1],[17,7],[15,6],[14,4],[14,2],[16,0],[18,0],[20,1],[21,3],[21,5],[19,7],[17,7]]},"&":{width:26,points:[[23,12],[23,13],[22,14],[21,14],[20,13],[19,11],[17,6],[15,3],[13,1],[11,0],[7,0],[5,1],[4,2],[3,4],[3,6],[4,8],[5,9],[12,13],[13,14],[14,16],[14,18],[13,20],[11,21],[9,20],[8,18],[8,16],[9,13],[11,10],[16,3],[18,1],[20,0],[22,0],[23,1],[23,2]]},"'":{width:10,points:[[5,19],[4,20],[5,21],[6,20],[6,18],[5,16],[4,15]]},"(":{width:14,points:[[11,25],[9,23],[7,20],[5,16],[4,11],[4,7],[5,2],[7,-2],[9,-5],[11,-7]]},")":{width:14,points:[[3,25],[5,23],[7,20],[9,16],[10,11],[10,7],[9,2],[7,-2],[5,-5],[3,-7]]},"*":{width:16,points:[[8,21],[8,9],[-1,-1],[3,18],[13,12],[-1,-1],[13,18],[3,12]]},"+":{width:26,points:[[13,18],[13,0],[-1,-1],[4,9],[22,9]]},",":{width:10,points:[[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},"-":{width:18,points:[[6,9],[12,9]]},".":{width:10,points:[[5,2],[4,1],[5,0],[6,1],[5,2]]},"/":{width:22,points:[[20,25],[2,-7]]},"0":{width:20,points:[[9,21],[6,20],[4,17],[3,12],[3,9],[4,4],[6,1],[9,0],[11,0],[14,1],[16,4],[17,9],[17,12],[16,17],[14,20],[11,21],[9,21]]},"1":{width:20,points:[[6,17],[8,18],[11,21],[11,0]]},"2":{width:20,points:[[4,16],[4,17],[5,19],[6,20],[8,21],[12,21],[14,20],[15,19],[16,17],[16,15],[15,13],[13,10],[3,0],[17,0]]},"3":{width:20,points:[[5,21],[16,21],[10,13],[13,13],[15,12],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},"4":{width:20,points:[[13,21],[3,7],[18,7],[-1,-1],[13,21],[13,0]]},"5":{width:20,points:[[15,21],[5,21],[4,12],[5,13],[8,14],[11,14],[14,13],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},"6":{width:20,points:[[16,18],[15,20],[12,21],[10,21],[7,20],[5,17],[4,12],[4,7],[5,3],[7,1],[10,0],[11,0],[14,1],[16,3],[17,6],[17,7],[16,10],[14,12],[11,13],[10,13],[7,12],[5,10],[4,7]]},"7":{width:20,points:[[17,21],[7,0],[-1,-1],[3,21],[17,21]]},"8":{width:20,points:[[8,21],[5,20],[4,18],[4,16],[5,14],[7,13],[11,12],[14,11],[16,9],[17,7],[17,4],[16,2],[15,1],[12,0],[8,0],[5,1],[4,2],[3,4],[3,7],[4,9],[6,11],[9,12],[13,13],[15,14],[16,16],[16,18],[15,20],[12,21],[8,21]]},"9":{width:20,points:[[16,14],[15,11],[13,9],[10,8],[9,8],[6,9],[4,11],[3,14],[3,15],[4,18],[6,20],[9,21],[10,21],[13,20],[15,18],[16,14],[16,9],[15,4],[13,1],[10,0],[8,0],[5,1],[4,3]]},":":{width:10,points:[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},";":{width:10,points:[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},"<":{width:24,points:[[20,18],[4,9],[20,0]]},"=":{width:26,points:[[4,12],[22,12],[-1,-1],[4,6],[22,6]]},">":{width:24,points:[[4,18],[20,9],[4,0]]},"?":{width:18,points:[[3,16],[3,17],[4,19],[5,20],[7,21],[11,21],[13,20],[14,19],[15,17],[15,15],[14,13],[13,12],[9,10],[9,7],[-1,-1],[9,2],[8,1],[9,0],[10,1],[9,2]]},"@":{width:27,points:[[18,13],[17,15],[15,16],[12,16],[10,15],[9,14],[8,11],[8,8],[9,6],[11,5],[14,5],[16,6],[17,8],[-1,-1],[12,16],[10,14],[9,11],[9,8],[10,6],[11,5],[-1,-1],[18,16],[17,8],[17,6],[19,5],[21,5],[23,7],[24,10],[24,12],[23,15],[22,17],[20,19],[18,20],[15,21],[12,21],[9,20],[7,19],[5,17],[4,15],[3,12],[3,9],[4,6],[5,4],[7,2],[9,1],[12,0],[15,0],[18,1],[20,2],[21,3],[-1,-1],[19,16],[18,8],[18,6],[19,5]]},A:{width:18,points:[[9,21],[1,0],[-1,-1],[9,21],[17,0],[-1,-1],[4,7],[14,7]]},B:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[-1,-1],[4,11],[13,11],[16,10],[17,9],[18,7],[18,4],[17,2],[16,1],[13,0],[4,0]]},C:{width:21,points:[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5]]},D:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[11,21],[14,20],[16,18],[17,16],[18,13],[18,8],[17,5],[16,3],[14,1],[11,0],[4,0]]},E:{width:19,points:[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11],[-1,-1],[4,0],[17,0]]},F:{width:18,points:[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11]]},G:{width:21,points:[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[18,8],[-1,-1],[13,8],[18,8]]},H:{width:22,points:[[4,21],[4,0],[-1,-1],[18,21],[18,0],[-1,-1],[4,11],[18,11]]},I:{width:8,points:[[4,21],[4,0]]},J:{width:16,points:[[12,21],[12,5],[11,2],[10,1],[8,0],[6,0],[4,1],[3,2],[2,5],[2,7]]},K:{width:21,points:[[4,21],[4,0],[-1,-1],[18,21],[4,7],[-1,-1],[9,12],[18,0]]},L:{width:17,points:[[4,21],[4,0],[-1,-1],[4,0],[16,0]]},M:{width:24,points:[[4,21],[4,0],[-1,-1],[4,21],[12,0],[-1,-1],[20,21],[12,0],[-1,-1],[20,21],[20,0]]},N:{width:22,points:[[4,21],[4,0],[-1,-1],[4,21],[18,0],[-1,-1],[18,21],[18,0]]},O:{width:22,points:[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21]]},P:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,14],[17,12],[16,11],[13,10],[4,10]]},Q:{width:22,points:[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21],[-1,-1],[12,4],[18,-2]]},R:{width:21,points:[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[4,11],[-1,-1],[11,11],[18,0]]},S:{width:20,points:[[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},T:{width:16,points:[[8,21],[8,0],[-1,-1],[1,21],[15,21]]},U:{width:22,points:[[4,21],[4,6],[5,3],[7,1],[10,0],[12,0],[15,1],[17,3],[18,6],[18,21]]},V:{width:18,points:[[1,21],[9,0],[-1,-1],[17,21],[9,0]]},W:{width:24,points:[[2,21],[7,0],[-1,-1],[12,21],[7,0],[-1,-1],[12,21],[17,0],[-1,-1],[22,21],[17,0]]},X:{width:20,points:[[3,21],[17,0],[-1,-1],[17,21],[3,0]]},Y:{width:18,points:[[1,21],[9,11],[9,0],[-1,-1],[17,21],[9,11]]},Z:{width:20,points:[[17,21],[3,0],[-1,-1],[3,21],[17,21],[-1,-1],[3,0],[17,0]]},"[":{width:14,points:[[4,25],[4,-7],[-1,-1],[5,25],[5,-7],[-1,-1],[4,25],[11,25],[-1,-1],[4,-7],[11,-7]]},"\\":{width:14,points:[[0,21],[14,-3]]},"]":{width:14,points:[[9,25],[9,-7],[-1,-1],[10,25],[10,-7],[-1,-1],[3,25],[10,25],[-1,-1],[3,-7],[10,-7]]},"^":{width:16,points:[[6,15],[8,18],[10,15],[-1,-1],[3,12],[8,17],[13,12],[-1,-1],[8,17],[8,0]]},_:{width:16,points:[[0,-2],[16,-2]]},"`":{width:10,points:[[6,21],[5,20],[4,18],[4,16],[5,15],[6,16],[5,17]]},a:{width:19,points:[[15,14],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},b:{width:19,points:[[4,21],[4,0],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},c:{width:18,points:[[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},d:{width:19,points:[[15,21],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},e:{width:18,points:[[3,8],[15,8],[15,10],[14,12],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},f:{width:12,points:[[10,21],[8,21],[6,20],[5,17],[5,0],[-1,-1],[2,14],[9,14]]},g:{width:19,points:[[15,14],[15,-2],[14,-5],[13,-6],[11,-7],[8,-7],[6,-6],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},h:{width:19,points:[[4,21],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},i:{width:8,points:[[3,21],[4,20],[5,21],[4,22],[3,21],[-1,-1],[4,14],[4,0]]},j:{width:10,points:[[5,21],[6,20],[7,21],[6,22],[5,21],[-1,-1],[6,14],[6,-3],[5,-6],[3,-7],[1,-7]]},k:{width:17,points:[[4,21],[4,0],[-1,-1],[14,14],[4,4],[-1,-1],[8,8],[15,0]]},l:{width:8,points:[[4,21],[4,0]]},m:{width:30,points:[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0],[-1,-1],[15,10],[18,13],[20,14],[23,14],[25,13],[26,10],[26,0]]},n:{width:19,points:[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},o:{width:19,points:[[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3],[16,6],[16,8],[15,11],[13,13],[11,14],[8,14]]},p:{width:19,points:[[4,14],[4,-7],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},q:{width:19,points:[[15,14],[15,-7],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},r:{width:13,points:[[4,14],[4,0],[-1,-1],[4,8],[5,11],[7,13],[9,14],[12,14]]},s:{width:17,points:[[14,11],[13,13],[10,14],[7,14],[4,13],[3,11],[4,9],[6,8],[11,7],[13,6],[14,4],[14,3],[13,1],[10,0],[7,0],[4,1],[3,3]]},t:{width:12,points:[[5,21],[5,4],[6,1],[8,0],[10,0],[-1,-1],[2,14],[9,14]]},u:{width:19,points:[[4,14],[4,4],[5,1],[7,0],[10,0],[12,1],[15,4],[-1,-1],[15,14],[15,0]]},v:{width:16,points:[[2,14],[8,0],[-1,-1],[14,14],[8,0]]},w:{width:22,points:[[3,14],[7,0],[-1,-1],[11,14],[7,0],[-1,-1],[11,14],[15,0],[-1,-1],[19,14],[15,0]]},x:{width:17,points:[[3,14],[14,0],[-1,-1],[14,14],[3,0]]},y:{width:16,points:[[2,14],[8,0],[-1,-1],[14,14],[8,0],[6,-4],[4,-6],[2,-7],[1,-7]]},z:{width:17,points:[[14,14],[3,0],[-1,-1],[3,14],[14,14],[-1,-1],[3,0],[14,0]]},"{":{width:14,points:[[9,25],[7,24],[6,23],[5,21],[5,19],[6,17],[7,16],[8,14],[8,12],[6,10],[-1,-1],[7,24],[6,22],[6,20],[7,18],[8,17],[9,15],[9,13],[8,11],[4,9],[8,7],[9,5],[9,3],[8,1],[7,0],[6,-2],[6,-4],[7,-6],[-1,-1],[6,8],[8,6],[8,4],[7,2],[6,1],[5,-1],[5,-3],[6,-5],[7,-6],[9,-7]]},"|":{width:8,points:[[4,25],[4,-7]]},"}":{width:14,points:[[5,25],[7,24],[8,23],[9,21],[9,19],[8,17],[7,16],[6,14],[6,12],[8,10],[-1,-1],[7,24],[8,22],[8,20],[7,18],[6,17],[5,15],[5,13],[6,11],[10,9],[6,7],[5,5],[5,3],[6,1],[7,0],[8,-2],[8,-4],[7,-6],[-1,-1],[8,8],[6,6],[6,4],[7,2],[8,1],[9,-1],[9,-3],[8,-5],[7,-6],[5,-7]]},"~":{width:24,points:[[3,6],[3,8],[4,11],[6,12],[8,12],[10,11],[14,8],[16,7],[18,7],[20,8],[21,10],[-1,-1],[3,8],[4,10],[6,11],[8,11],[10,10],[14,7],[16,6],[18,6],[20,7],[21,10],[21,12]]}};a.jqplot.CanvasFontRenderer=function(b){b=b||{};if(!b.pt2px){b.pt2px=1.5}a.jqplot.CanvasTextRenderer.call(this,b)};a.jqplot.CanvasFontRenderer.prototype=new a.jqplot.CanvasTextRenderer({});a.jqplot.CanvasFontRenderer.prototype.constructor=a.jqplot.CanvasFontRenderer;a.jqplot.CanvasFontRenderer.prototype.measure=function(c,e){var d=this.fontSize+" "+this.fontFamily;c.save();c.font=d;var b=c.measureText(e).width;c.restore();return b};a.jqplot.CanvasFontRenderer.prototype.draw=function(e,g){var c=0;var h=this.height*0.72;e.save();var d,b;if((-Math.PI/2<=this.angle&&this.angle<=0)||(Math.PI*3/2<=this.angle&&this.angle<=Math.PI*2)){d=0;b=-Math.sin(this.angle)*this.width}else{if((0<this.angle&&this.angle<=Math.PI/2)||(-Math.PI*2<=this.angle&&this.angle<=-Math.PI*3/2)){d=Math.sin(this.angle)*this.height;b=0}else{if((-Math.PI<this.angle&&this.angle<-Math.PI/2)||(Math.PI<=this.angle&&this.angle<=Math.PI*3/2)){d=-Math.cos(this.angle)*this.width;b=-Math.sin(this.angle)*this.width-Math.cos(this.angle)*this.height}else{if((-Math.PI*3/2<this.angle&&this.angle<Math.PI)||(Math.PI/2<this.angle&&this.angle<Math.PI)){d=Math.sin(this.angle)*this.height-Math.cos(this.angle)*this.width;b=-Math.cos(this.angle)*this.height}}}}e.strokeStyle=this.fillStyle;e.fillStyle=this.fillStyle;var f=this.fontSize+" "+this.fontFamily;e.font=f;e.translate(d,b);e.rotate(this.angle);e.fillText(g,c,h);e.restore()}})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(a){a.jqplot.CanvasAxisLabelRenderer=function(b){this.angle=0;this.axis;this.show=true;this.showLabel=true;this.label="";this.fontFamily='"Trebuchet MS", Arial, Helvetica, sans-serif';this.fontSize="11pt";this.fontWeight="normal";this.fontStretch=1;this.textColor="#666666";this.enableFontSupport=true;this.pt2px=null;this._elem;this._ctx;this._plotWidth;this._plotHeight;this._plotDimensions={height:null,width:null};a.extend(true,this,b);if(b.angle==null&&this.axis!="xaxis"&&this.axis!="x2axis"){this.angle=-90}var c={fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily};if(this.pt2px){c.pt2px=this.pt2px}if(this.enableFontSupport){if(a.jqplot.support_canvas_text()){this._textRenderer=new a.jqplot.CanvasFontRenderer(c)}else{this._textRenderer=new a.jqplot.CanvasTextRenderer(c)}}else{this._textRenderer=new a.jqplot.CanvasTextRenderer(c)}};a.jqplot.CanvasAxisLabelRenderer.prototype.init=function(b){a.extend(true,this,b);this._textRenderer.init({fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily})};a.jqplot.CanvasAxisLabelRenderer.prototype.getWidth=function(d){if(this._elem){return this._elem.outerWidth(true)}else{var f=this._textRenderer;var c=f.getWidth(d);var e=f.getHeight(d);var b=Math.abs(Math.sin(f.angle)*e)+Math.abs(Math.cos(f.angle)*c);return b}};a.jqplot.CanvasAxisLabelRenderer.prototype.getHeight=function(d){if(this._elem){return this._elem.outerHeight(true)}else{var f=this._textRenderer;var c=f.getWidth(d);var e=f.getHeight(d);var b=Math.abs(Math.cos(f.angle)*e)+Math.abs(Math.sin(f.angle)*c);return b}};a.jqplot.CanvasAxisLabelRenderer.prototype.getAngleRad=function(){var b=this.angle*Math.PI/180;return b};a.jqplot.CanvasAxisLabelRenderer.prototype.draw=function(c,f){if(this._elem){if(a.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined){window.G_vmlCanvasManager.uninitElement(this._elem.get(0))}this._elem.emptyForce();this._elem=null}var e=f.canvasManager.getCanvas();this._textRenderer.setText(this.label,c);var b=this.getWidth(c);var d=this.getHeight(c);e.width=b;e.height=d;e.style.width=b;e.style.height=d;e=f.canvasManager.initCanvas(e);this._elem=a(e);this._elem.css({position:"absolute"});this._elem.addClass("jqplot-"+this.axis+"-label");e=null;return this._elem};a.jqplot.CanvasAxisLabelRenderer.prototype.pack=function(){this._textRenderer.draw(this._elem.get(0).getContext("2d"),this.label)}})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(e){e.jqplot.PieRenderer=function(){e.jqplot.LineRenderer.call(this)};e.jqplot.PieRenderer.prototype=new e.jqplot.LineRenderer();e.jqplot.PieRenderer.prototype.constructor=e.jqplot.PieRenderer;e.jqplot.PieRenderer.prototype.init=function(q,u){this.diameter=null;this.padding=20;this.sliceMargin=0;this.fill=true;this.shadowOffset=2;this.shadowAlpha=0.07;this.shadowDepth=5;this.highlightMouseOver=true;this.highlightMouseDown=false;this.highlightColors=[];this.dataLabels="percent";this.showDataLabels=false;this.dataLabelFormatString=null;this.dataLabelThreshold=3;this.dataLabelPositionFactor=0.52;this.dataLabelNudge=2;this.dataLabelCenterOn=true;this.startAngle=0;this.tickRenderer=e.jqplot.PieTickRenderer;this._drawData=true;this._type="pie";if(q.highlightMouseDown&&q.highlightMouseOver==null){q.highlightMouseOver=false}e.extend(true,this,q);if(this.sliceMargin<0){this.sliceMargin=0}this._diameter=null;this._radius=null;this._sliceAngles=[];this._highlightedPoint=null;if(this.highlightColors.length==0){for(var s=0;s<this.seriesColors.length;s++){var r=e.jqplot.getColorComponents(this.seriesColors[s]);var o=[r[0],r[1],r[2]];var t=o[0]+o[1]+o[2];for(var p=0;p<3;p++){o[p]=(t>570)?o[p]*0.8:o[p]+0.3*(255-o[p]);o[p]=parseInt(o[p],10)}this.highlightColors.push("rgb("+o[0]+","+o[1]+","+o[2]+")")}}this.highlightColorGenerator=new e.jqplot.ColorGenerator(this.highlightColors);u.postParseOptionsHooks.addOnce(m);u.postInitHooks.addOnce(g);u.eventListenerHooks.addOnce("jqplotMouseMove",b);u.eventListenerHooks.addOnce("jqplotMouseDown",a);u.eventListenerHooks.addOnce("jqplotMouseUp",l);u.eventListenerHooks.addOnce("jqplotClick",f);u.eventListenerHooks.addOnce("jqplotRightClick",n);u.postDrawHooks.addOnce(i)};e.jqplot.PieRenderer.prototype.setGridData=function(t){var p=[];var u=[];var o=this.startAngle/180*Math.PI;var s=0;this._drawData=false;for(var r=0;r<this.data.length;r++){if(this.data[r][1]!=0){this._drawData=true}p.push(this.data[r][1]);u.push([this.data[r][0]]);if(r>0){p[r]+=p[r-1]}s+=this.data[r][1]}var q=Math.PI*2/p[p.length-1];for(var r=0;r<p.length;r++){u[r][1]=p[r]*q;u[r][2]=this.data[r][1]/s}this.gridData=u};e.jqplot.PieRenderer.prototype.makeGridData=function(t,u){var p=[];var v=[];var s=0;var o=this.startAngle/180*Math.PI;this._drawData=false;for(var r=0;r<t.length;r++){if(this.data[r][1]!=0){this._drawData=true}p.push(t[r][1]);v.push([t[r][0]]);if(r>0){p[r]+=p[r-1]}s+=t[r][1]}var q=Math.PI*2/p[p.length-1];for(var r=0;r<p.length;r++){v[r][1]=p[r]*q;v[r][2]=t[r][1]/s}return v};function h(o){return Math.sin((o-(o-Math.PI)/8/Math.PI)/2)}function j(u,t,o,v,r){var w=0;var q=t-u;var s=Math.abs(q);var p=o;if(v==false){p+=r}if(p>0&&s>0.01&&s<6.282){w=parseFloat(p)/2/h(q)}return w}e.jqplot.PieRenderer.prototype.drawSlice=function(B,z,y,u,w){if(this._drawData){var p=this._radius;var A=this.fill;var x=this.lineWidth;var s=this.sliceMargin;if(this.fill==false){s+=this.lineWidth}B.save();B.translate(this._center[0],this._center[1]);var D=j(z,y,this.sliceMargin,this.fill,this.lineWidth);var o=D*Math.cos((z+y)/2);var C=D*Math.sin((z+y)/2);if((y-z)<=Math.PI){p-=D}else{p+=D}B.translate(o,C);if(w){for(var v=0,t=this.shadowDepth;v<t;v++){B.save();B.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI),this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));q(p)}for(var v=0,t=this.shadowDepth;v<t;v++){B.restore()}}else{q(p)}B.restore()}function q(r){if(y>6.282+this.startAngle){y=6.282+this.startAngle;if(z>y){z=6.281+this.startAngle}}if(z>=y){return}B.beginPath();B.fillStyle=u;B.strokeStyle=u;B.lineWidth=x;B.arc(0,0,r,z,y,false);B.lineTo(0,0);B.closePath();if(A){B.fill()}else{B.stroke()}}};e.jqplot.PieRenderer.prototype.draw=function(B,z,E,o){var W;var H=(E!=undefined)?E:{};var t=0;var s=0;var N=1;var L=new e.jqplot.ColorGenerator(this.seriesColors);if(E.legendInfo&&E.legendInfo.placement=="insideGrid"){var J=E.legendInfo;switch(J.location){case"nw":t=J.width+J.xoffset;break;case"w":t=J.width+J.xoffset;break;case"sw":t=J.width+J.xoffset;break;case"ne":t=J.width+J.xoffset;N=-1;break;case"e":t=J.width+J.xoffset;N=-1;break;case"se":t=J.width+J.xoffset;N=-1;break;case"n":s=J.height+J.yoffset;break;case"s":s=J.height+J.yoffset;N=-1;break;default:break}}var K=(H.shadow!=undefined)?H.shadow:this.shadow;var A=(H.fill!=undefined)?H.fill:this.fill;var C=B.canvas.width;var I=B.canvas.height;var Q=C-t-2*this.padding;var X=I-s-2*this.padding;var M=Math.min(Q,X);var Y=M;this._sliceAngles=[];var v=this.sliceMargin;if(this.fill==false){v+=this.lineWidth}var q;var G=0;var R,aa,Z,ab;var D=this.startAngle/180*Math.PI;for(var W=0,V=z.length;W<V;W++){aa=(W==0)?D:z[W-1][1]+D;Z=z[W][1]+D;this._sliceAngles.push([aa,Z]);q=j(aa,Z,this.sliceMargin,this.fill,this.lineWidth);if(Math.abs(Z-aa)>Math.PI){G=Math.max(q,G)}}if(this.diameter!=null&&this.diameter>0){this._diameter=this.diameter-2*G}else{this._diameter=Y-2*G}if(this._diameter<6){e.jqplot.log("Diameter of pie too small, not rendering.");return}var S=this._radius=this._diameter/2;this._center=[(C-N*t)/2+N*t+G*Math.cos(D),(I-N*s)/2+N*s+G*Math.sin(D)];if(this.shadow){for(var W=0,V=z.length;W<V;W++){ab="rgba(0,0,0,"+this.shadowAlpha+")";this.renderer.drawSlice.call(this,B,this._sliceAngles[W][0],this._sliceAngles[W][1],ab,true)}}for(var W=0;W<z.length;W++){this.renderer.drawSlice.call(this,B,this._sliceAngles[W][0],this._sliceAngles[W][1],L.next(),false);if(this.showDataLabels&&z[W][2]*100>=this.dataLabelThreshold){var F,U=(this._sliceAngles[W][0]+this._sliceAngles[W][1])/2,T;if(this.dataLabels=="label"){F=this.dataLabelFormatString||"%s";T=e.jqplot.sprintf(F,z[W][0])}else{if(this.dataLabels=="value"){F=this.dataLabelFormatString||"%d";T=e.jqplot.sprintf(F,this.data[W][1])}else{if(this.dataLabels=="percent"){F=this.dataLabelFormatString||"%d%%";T=e.jqplot.sprintf(F,z[W][2]*100)}else{if(this.dataLabels.constructor==Array){F=this.dataLabelFormatString||"%s";T=e.jqplot.sprintf(F,this.dataLabels[W])}}}}var p=(this._radius)*this.dataLabelPositionFactor+this.sliceMargin+this.dataLabelNudge;var P=this._center[0]+Math.cos(U)*p+this.canvas._offsets.left;var O=this._center[1]+Math.sin(U)*p+this.canvas._offsets.top;var u=e('<div class="jqplot-pie-series jqplot-data-label" style="position:absolute;">'+T+"</div>").insertBefore(o.eventCanvas._elem);if(this.dataLabelCenterOn){P-=u.width()/2;O-=u.height()/2}else{P-=u.width()*Math.sin(U/2);O-=u.height()/2}P=Math.round(P);O=Math.round(O);u.css({left:P,top:O})}}};e.jqplot.PieAxisRenderer=function(){e.jqplot.LinearAxisRenderer.call(this)};e.jqplot.PieAxisRenderer.prototype=new e.jqplot.LinearAxisRenderer();e.jqplot.PieAxisRenderer.prototype.constructor=e.jqplot.PieAxisRenderer;e.jqplot.PieAxisRenderer.prototype.init=function(o){this.tickRenderer=e.jqplot.PieTickRenderer;e.extend(true,this,o);this._dataBounds={min:0,max:100};this.min=0;this.max=100;this.showTicks=false;this.ticks=[];this.showMark=false;this.show=false};e.jqplot.PieLegendRenderer=function(){e.jqplot.TableLegendRenderer.call(this)};e.jqplot.PieLegendRenderer.prototype=new e.jqplot.TableLegendRenderer();e.jqplot.PieLegendRenderer.prototype.constructor=e.jqplot.PieLegendRenderer;e.jqplot.PieLegendRenderer.prototype.init=function(o){this.numberRows=null;this.numberColumns=null;e.extend(true,this,o)};e.jqplot.PieLegendRenderer.prototype.draw=function(){var r=this;if(this.show){var B=this._series;this._elem=e(document.createElement("table"));this._elem.addClass("jqplot-table-legend");var E={position:"absolute"};if(this.background){E.background=this.background}if(this.border){E.border=this.border}if(this.fontSize){E.fontSize=this.fontSize}if(this.fontFamily){E.fontFamily=this.fontFamily}if(this.textColor){E.textColor=this.textColor}if(this.marginTop!=null){E.marginTop=this.marginTop}if(this.marginBottom!=null){E.marginBottom=this.marginBottom}if(this.marginLeft!=null){E.marginLeft=this.marginLeft}if(this.marginRight!=null){E.marginRight=this.marginRight}this._elem.css(E);var I=false,A=false,o,y;var C=B[0];var p=new e.jqplot.ColorGenerator(C.seriesColors);if(C.show){var J=C.data;if(this.numberRows){o=this.numberRows;if(!this.numberColumns){y=Math.ceil(J.length/o)}else{y=this.numberColumns}}else{if(this.numberColumns){y=this.numberColumns;o=Math.ceil(J.length/this.numberColumns)}else{o=J.length;y=1}}var H,G;var q,w,v;var x,z,F;var D=0;var u,t;for(H=0;H<o;H++){q=e(document.createElement("tr"));q.addClass("jqplot-table-legend");if(A){q.prependTo(this._elem)}else{q.appendTo(this._elem)}for(G=0;G<y;G++){if(D<J.length){x=this.labels[D]||J[D][0].toString();F=p.next();if(!A){if(H>0){I=true}else{I=false}}else{if(H==o-1){I=false}else{I=true}}z=(I)?this.rowSpacing:"0";w=e(document.createElement("td"));w.addClass("jqplot-table-legend jqplot-table-legend-swatch");w.css({textAlign:"center",paddingTop:z});u=e(document.createElement("div"));u.addClass("jqplot-table-legend-swatch-outline");t=e(document.createElement("div"));t.addClass("jqplot-table-legend-swatch");t.css({backgroundColor:F,borderColor:F});w.append(u.append(t));v=e(document.createElement("td"));v.addClass("jqplot-table-legend jqplot-table-legend-label");v.css("paddingTop",z);if(this.escapeHtml){v.text(x)}else{v.html(x)}if(A){v.prependTo(q);w.prependTo(q)}else{w.appendTo(q);v.appendTo(q)}I=true}D++}}}}return this._elem};e.jqplot.PieRenderer.prototype.handleMove=function(q,p,t,s,r){if(s){var o=[s.seriesIndex,s.pointIndex,s.data];r.target.trigger("jqplotDataMouseOver",o);if(r.series[o[0]].highlightMouseOver&&!(o[0]==r.plugins.pieRenderer.highlightedSeriesIndex&&o[1]==r.series[o[0]]._highlightedPoint)){r.target.trigger("jqplotDataHighlight",o);d(r,o[0],o[1])}}else{if(s==null){k(r)}}};function c(s,r,p){p=p||{};p.axesDefaults=p.axesDefaults||{};p.legend=p.legend||{};p.seriesDefaults=p.seriesDefaults||{};var o=false;if(p.seriesDefaults.renderer==e.jqplot.PieRenderer){o=true}else{if(p.series){for(var q=0;q<p.series.length;q++){if(p.series[q].renderer==e.jqplot.PieRenderer){o=true}}}}if(o){p.axesDefaults.renderer=e.jqplot.PieAxisRenderer;p.legend.renderer=e.jqplot.PieLegendRenderer;p.legend.preDraw=true;p.seriesDefaults.pointLabels={show:false}}}function g(r,q,o){for(var p=0;p<this.series.length;p++){if(this.series[p].renderer.constructor==e.jqplot.PieRenderer){if(this.series[p].highlightMouseOver){this.series[p].highlightMouseDown=false}}}}function m(o){for(var p=0;p<this.series.length;p++){this.series[p].seriesColors=this.seriesColors;this.series[p].colorGenerator=e.jqplot.colorGenerator}}function d(t,r,q){var p=t.series[r];var o=t.plugins.pieRenderer.highlightCanvas;o._ctx.clearRect(0,0,o._ctx.canvas.width,o._ctx.canvas.height);p._highlightedPoint=q;t.plugins.pieRenderer.highlightedSeriesIndex=r;p.renderer.drawSlice.call(p,o._ctx,p._sliceAngles[q][0],p._sliceAngles[q][1],p.highlightColorGenerator.get(q),false)}function k(q){var o=q.plugins.pieRenderer.highlightCanvas;o._ctx.clearRect(0,0,o._ctx.canvas.width,o._ctx.canvas.height);for(var p=0;p<q.series.length;p++){q.series[p]._highlightedPoint=null}q.plugins.pieRenderer.highlightedSeriesIndex=null;q.target.trigger("jqplotDataUnhighlight")}function b(s,r,v,u,t){if(u){var q=[u.seriesIndex,u.pointIndex,u.data];var p=jQuery.Event("jqplotDataMouseOver");p.pageX=s.pageX;p.pageY=s.pageY;t.target.trigger(p,q);if(t.series[q[0]].highlightMouseOver&&!(q[0]==t.plugins.pieRenderer.highlightedSeriesIndex&&q[1]==t.series[q[0]]._highlightedPoint)){var o=jQuery.Event("jqplotDataHighlight");o.which=s.which;o.pageX=s.pageX;o.pageY=s.pageY;t.target.trigger(o,q);d(t,q[0],q[1])}}else{if(u==null){k(t)}}}function a(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];if(s.series[p[0]].highlightMouseDown&&!(p[0]==s.plugins.pieRenderer.highlightedSeriesIndex&&p[1]==s.series[p[0]]._highlightedPoint)){var o=jQuery.Event("jqplotDataHighlight");o.which=r.which;o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p);d(s,p[0],p[1])}}else{if(t==null){k(s)}}}function l(q,p,t,s,r){var o=r.plugins.pieRenderer.highlightedSeriesIndex;if(o!=null&&r.series[o].highlightMouseDown){k(r)}}function f(r,q,u,t,s){if(t){var p=[t.seriesIndex,t.pointIndex,t.data];var o=jQuery.Event("jqplotDataClick");o.which=r.which;o.pageX=r.pageX;o.pageY=r.pageY;s.target.trigger(o,p)}}function n(s,r,v,u,t){if(u){var q=[u.seriesIndex,u.pointIndex,u.data];var o=t.plugins.pieRenderer.highlightedSeriesIndex;if(o!=null&&t.series[o].highlightMouseDown){k(t)}var p=jQuery.Event("jqplotDataRightClick");p.which=s.which;p.pageX=s.pageX;p.pageY=s.pageY;t.target.trigger(p,q)}}function i(){if(this.plugins.pieRenderer&&this.plugins.pieRenderer.highlightCanvas){this.plugins.pieRenderer.highlightCanvas.resetCanvas();this.plugins.pieRenderer.highlightCanvas=null}this.plugins.pieRenderer={highlightedSeriesIndex:null};this.plugins.pieRenderer.highlightCanvas=new e.jqplot.GenericCanvas();var p=e(this.targetId+" .jqplot-data-label");if(p.length){e(p[0]).before(this.plugins.pieRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-pieRenderer-highlight-canvas",this._plotDimensions,this))}else{this.eventCanvas._elem.before(this.plugins.pieRenderer.highlightCanvas.createElement(this._gridPadding,"jqplot-pieRenderer-highlight-canvas",this._plotDimensions,this))}var o=this.plugins.pieRenderer.highlightCanvas.setContext();this.eventCanvas._elem.bind("mouseleave",{plot:this},function(q){k(q.data.plot)})}e.jqplot.preInitHooks.push(c);e.jqplot.PieTickRenderer=function(){e.jqplot.AxisTickRenderer.call(this)};e.jqplot.PieTickRenderer.prototype=new e.jqplot.AxisTickRenderer();e.jqplot.PieTickRenderer.prototype.constructor=e.jqplot.PieTickRenderer})(jQuery);
/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(a){a.jqplot.CanvasAxisTickRenderer=function(b){this.mark="outside";this.showMark=true;this.showGridline=true;this.isMinorTick=false;this.angle=0;this.markSize=4;this.show=true;this.showLabel=true;this.labelPosition="auto";this.label="";this.value=null;this._styles={};this.formatter=a.jqplot.DefaultTickFormatter;this.formatString="";this.prefix="";this.fontFamily='"Trebuchet MS", Arial, Helvetica, sans-serif';this.fontSize="10pt";this.fontWeight="normal";this.fontStretch=1;this.textColor="#666666";this.enableFontSupport=true;this.pt2px=null;this._elem;this._ctx;this._plotWidth;this._plotHeight;this._plotDimensions={height:null,width:null};a.extend(true,this,b);var c={fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily};if(this.pt2px){c.pt2px=this.pt2px}if(this.enableFontSupport){if(a.jqplot.support_canvas_text()){this._textRenderer=new a.jqplot.CanvasFontRenderer(c)}else{this._textRenderer=new a.jqplot.CanvasTextRenderer(c)}}else{this._textRenderer=new a.jqplot.CanvasTextRenderer(c)}};a.jqplot.CanvasAxisTickRenderer.prototype.init=function(b){a.extend(true,this,b);this._textRenderer.init({fontSize:this.fontSize,fontWeight:this.fontWeight,fontStretch:this.fontStretch,fillStyle:this.textColor,angle:this.getAngleRad(),fontFamily:this.fontFamily})};a.jqplot.CanvasAxisTickRenderer.prototype.getWidth=function(d){if(this._elem){return this._elem.outerWidth(true)}else{var f=this._textRenderer;var c=f.getWidth(d);var e=f.getHeight(d);var b=Math.abs(Math.sin(f.angle)*e)+Math.abs(Math.cos(f.angle)*c);return b}};a.jqplot.CanvasAxisTickRenderer.prototype.getHeight=function(d){if(this._elem){return this._elem.outerHeight(true)}else{var f=this._textRenderer;var c=f.getWidth(d);var e=f.getHeight(d);var b=Math.abs(Math.cos(f.angle)*e)+Math.abs(Math.sin(f.angle)*c);return b}};a.jqplot.CanvasAxisTickRenderer.prototype.getTop=function(b){if(this._elem){return this._elem.position().top}else{return null}};a.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad=function(){var b=this.angle*Math.PI/180;return b};a.jqplot.CanvasAxisTickRenderer.prototype.setTick=function(b,d,c){this.value=b;if(c){this.isMinorTick=true}return this};a.jqplot.CanvasAxisTickRenderer.prototype.draw=function(c,f){if(!this.label){this.label=this.prefix+this.formatter(this.formatString,this.value)}if(this._elem){if(a.jqplot.use_excanvas&&window.G_vmlCanvasManager.uninitElement!==undefined){window.G_vmlCanvasManager.uninitElement(this._elem.get(0))}this._elem.emptyForce();this._elem=null}var e=f.canvasManager.getCanvas();this._textRenderer.setText(this.label,c);var b=this.getWidth(c);var d=this.getHeight(c);e.width=b;e.height=d;e.style.width=b;e.style.height=d;e.style.textAlign="left";e.style.position="absolute";e=f.canvasManager.initCanvas(e);this._elem=a(e);this._elem.css(this._styles);this._elem.addClass("jqplot-"+this.axis+"-tick");e=null;return this._elem};a.jqplot.CanvasAxisTickRenderer.prototype.pack=function(){this._textRenderer.draw(this._elem.get(0).getContext("2d"),this.label)}})(jQuery);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
















;
