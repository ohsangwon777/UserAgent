/**
 * Library for cross browsing, client enviroments controll.
 *
 * While this is a rewrite, it is heavily inspired by google closure library:
 *    
 *    google closure liblary
 *    Copyright (c) google Inc, Apache License, Version 2.0
 *
 * @copyright CyberImagination [All rights reserved]
 * @licence MIT licence
 * 
 */
(function(UserAgent){

	var _this = {
		//platform
		os: {
			name: '',
			platform: '' //TODO
		},

		//renderer
		renderer: {
			name: '',
			version: '',
			isGecko: false,
			isIe: false,
			isOpera: false,
			isWebkit: false
		},

		//browser
		product: {
			name: '', //browser name
			version: '', //browser version
		},

		version: undefined,

		isAndroid : false,
		isCamino : false,
		isChrome : false,
		isFirefox : false,
		isIe : false,
		isIpad : false,
		isIphone : false,
		isOpera : false,
		isSafari : false,
		isMobile: false,

		isLinux: false,
		isWindows: false,
		isMac: false,
		isX11: false,

		documnetMode: undefined //IE
	};

	var userAgentString = window.navigator.userAgent;
	var navigator = window.navigator;
	var platform = navigator && navigator.platform || '';

	//utility functions
	var contains = function(s, ss){
		return s.indexOf(ss) != -1;
	}

	//initialize browser render and is mobile
	var init = function(){
		var ua = userAgentString;

		_this.renderer.isOpera = ua.indexOf('Opera') == 0;
		_this.renderer.isIe = !_this.renderer.isOpera && contains(ua,'MSIE');
		_this.renderer.isWebkit = !_this.renderer.isOpera && contains(ua,'WebKit');
		_this.isMobile = _this.renderer.isWebkit && contains(ua,'Mobile');
		_this.renderer.isGecko = !_this.renderer.isOpera && !_this.renderer.isWebkit && navigator.product == 'Gecko';

		if(_this.renderer.isIe){
			var doc = document;
			_this.documnetMode = doc ? doc['documentMode'] : undefined;
		}

	};

	init();

	//determine browser version
	var determineRendererVersion = function(){
		var version = '', re;

		if (_this.renderer.isOpera) {
			var operaVersion = opera.version;
			version = typeof operaVersion == 'function' ? operaVersion() : operaVersion;
		} else {
			if (_this.renderer.isGecko) {
				re = /rv\:([^\);]+)(\)|;)/;
			} else if (_this.renderer.isIe) {
				re = /MSIE\s+([^\);]+)(\)|;)/;
			} else if (_this.renderer.isWebkit) {
			  	// WebKit/125.4
				re = /WebKit\/(\S+)/;
			}
			if (re) {
				var arr = re.exec(userAgentString);
				version = arr ? arr[1] : '';
			}
		}
		// IE9 can be in document mode 9 but be reporting an inconsistent user agent
		// version.  If it is identifying as a version lower than 9 we take the
		// documentMode as the version instead.  IE8 has similar behavior.
		// It is recommended to set the X-UA-Compatible header to ensure that IE9
		// uses documentMode 9.
		if (_this.renderer.isIe) {
			var docMode = _this.documnetMode;
			if (docMode > parseFloat(version)) {
				return String(docMode);
			}
		}
		return version;
	};

	_this.renderer.version = determineRendererVersion();

	//initialize os platform
	var initPlatform = function(){
		if(contains(platform, 'Win')){
			_this.isWindows = true;
			_this.os.name = 'windows';
		} else if(contains(platform, 'Mac')){
			_this.isMac = true;
			_this.os.name = 'mac';
		} else if(contains(platform, 'Linux')){
			_this.isLinux = true;
			_this.os.name = 'linux';
		} else if(contains(navigator['appVersion'] || '', 'X11')){
			_this.isX11 = true;
			_this.os.name = 'x11';
		}
	};

	initPlatform();


	//initialize product
	var initProduct = function(){
		var ua = userAgentString;

		if(_this.renderer.isOpera){
			_this.isOpera = true;
			_this.product.name = 'opera';
		} else if (_this.renderer.isIe) {
			_this.isIe = true;
			_this.product.name = 'ie';
		} else if (ua.indexOf('Firefox') != -1) {
			_this.isFirefox = true;
			_this.product.name = 'firefox';
		} else if (ua.indexOf('Camino') != -1) {
			_this.isCamino = true;
			_this.product.name = 'camino';
		} else if (ua.indexOf('iPhone') != -1 || ua.indexOf('iPod') != -1) {
			_this.isIphone = true;
			_this.product.name = 'iPhone';
		} else if (ua.indexOf('iPad') != -1) {
			_this.isIpad = true;
			_this.product.name = 'iPad';
		} else if (ua.indexOf('Android') != -1) {
			_this.isAndroid = true;
			_this.product.name = 'android';
		} else if (ua.indexOf('Chrome') != -1) {
			_this.isChrome = true;
			_this.product.name = 'chrome';
		} else if (ua.indexOf('Safari') != -1) {
			_this.isSafari = true;
			_this.product.name = 'safari';
		}
	};

	initProduct();


	//initialize product version
	var initProductVersion = function(){
		if (_this.isFirefox) {
			// Firefox/2.0.0.1 or Firefox/3.5.3
			return getFirstRegExpGroup(/Firefox\/([0-9.]+)/);
		}
		if (_this.isIe || _this.isOpera) {
			return _this.renderer.version;
		}
		
		if (_this.isChrome) {
			// Chrome/4.0.223.1
			return getFirstRegExpGroup(/Chrome\/([0-9.]+)/);
		}
		if (_this.isSafari) {
			// Version/5.0.3
			//
			// NOTE: Before version 3, Safari did not report a product version number.
			// The product version number for these browsers will be the empty string.
			// They may be differentiated by WebKit version number in goog.userAgent.
			return getFirstRegExpGroup(/Version\/([0-9.]+)/);
		}

		if (_this.isIphone || _this.isIpad) {
			// Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1
			// (KHTML, like Gecko) Version/3.0 Mobile/3A100a Safari/419.3
			// Version is the browser version, Mobile is the build number. We combine
			// the version string with the build number: 3.0.3A100a for the example.
			var arr = execRegExp(/Version\/(\S+).*Mobile\/(\S+)/);
			if (arr) {
				return arr[1] + '.' + arr[2];
			}
		} else if (_this.isAndroid) {
			// Mozilla/5.0 (Linux; U; Android 0.5; en-us) AppleWebKit/522+
			// (KHTML, like Gecko) Safari/419.3
			//
			// Mozilla/5.0 (Linux; U; Android 1.0; en-us; dream) AppleWebKit/525.10+
			// (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2
			//
			// Prefer Version number if present, else make do with the OS number
			var version = getFirstRegExpGroup(/Android\s+([0-9.]+)/);
			if (version) {
				return version;
			}
			return getFirstRegExpGroup(/Version\/([0-9.]+)/);
		} else if (_this.isCamino) {
			return getFirstRegExpGroup(/Camino\/([0-9.]+)/);
		}

		return '';

		function getFirstRegExpGroup(re){
			var arr = execRegExp(re);
  			return arr ? arr[1] : '';
		}

		function execRegExp(re){
			return re.exec(userAgentString);
		}
	};

	_this.version = parseFloat(initProductVersion());

	//add class to html element
	var addUserAgentClass = function(){
		var htmlElem = document.getElementsByTagName('html')[0];
		var classString = '';

		classString += _this.os.name+' ';
		classString += _this.product.name+' ';
		classString += _this.product.name+_this.version;

		if(_this.isMobile){
			classString += ' '+'mobile';
		}

		htmlElem.className = classString;
	};

	addUserAgentClass();

	//regist _this object to global scope
	if(!UserAgent) {
		window.UserAgent = _this;	
	} else {
		
	}

})(window.UserAgent);