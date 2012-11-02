define(function(require,exports){
	var m = MODE || 'DEBUG';

	var source = {
		"querySearchHints"	: {//头部搜索提示
			"DEBUG" : "data/json27.js",
			"NORMAL": "querySearchHints.do"
		},
		"querySearchHints2"	: {
			"DEBUG" : "data/json21.js",
			"NORMAL": "querySearchHints1.do"
		},
		"querySearchHints3"	: {
			"DEBUG" : "data/json22.js",
			"NORMAL": "querySearchHints2.do"
		},
		"querySearchHints4"	: {
			"DEBUG" : "data/json23.js",
			"NORMAL": "querySearchHint3.do"
		}
	}

	function retrieveData (data){
		for (key in source){
			if(key === data){
				return source[data][m];
				break;
			}
		}
	}

	exports.retrieveData = retrieveData;
});