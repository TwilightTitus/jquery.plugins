/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var de = de || {};
de.titus = de.titus || {};
de.titus.core = de.titus.core || {};
if (de.titus.core.Namespace == undefined) {
	de.titus.core.Namespace = {};
	/**
	 * creates a namespace and run the function, if the Namespace new
	 * 
	 * @param aNamespace
	 *            the namespace(requiered)
	 * @param aFunction
	 *            a function that be executed, if the namespace created (optional)
	 * 
	 * @returns boolean, true if the namespace created
	 */
	de.titus.core.Namespace.create = function(aNamespace, aFunction) {
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		var namespaceCreated = false;
		for (var i = 0; i < namespaces.length; i++) {
			if (currentNamespace[namespaces[i]] == undefined) {
				currentNamespace[namespaces[i]] = {};
				namespaceCreated = true;
			}
			currentNamespace = currentNamespace[namespaces[i]];
		}
		if (namespaceCreated && aFunction != undefined) {
			aFunction();
		}
		
		return namespaceCreated;
	};
	
	/**
	 * exist the namespace?
	 * 
	 * @param aNamespace
	 *            the namespace(requiered)
	 * 
	 * @returns boolean, true if the namespace existing
	 */
	de.titus.core.Namespace.exist = function(aNamespace) {
		var namespaces = aNamespace.split(".");
		var currentNamespace = window;
		for (var i = 0; i < namespaces.length; i++) {
			if (currentNamespace[namespaces[i]] == undefined) {
				return false;
			}
			currentNamespace = currentNamespace[namespaces[i]];
		}
		return true;
	};
};de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	de.titus.core.SpecialFunctions = {};
	de.titus.core.SpecialFunctions.EVALRESULTVARNAME = {};
	de.titus.core.SpecialFunctions.EVALRESULTS = {};
	
	de.titus.core.SpecialFunctions.doEval = function(aStatement, aContext, aCallback) {
		if (aCallback) {
			de.titus.core.SpecialFunctions.doEvalWithContext(aStatement, (aContext || {}), undefined, aCallback);
		} else {
			if(aStatement != undefined && typeof aStatement !== "string" )
				return aStatement;
			else if (aStatement != undefined) {
				var varname = de.titus.core.SpecialFunctions.newVarname();
				var runContext = aContext || {};
				with (runContext) {
					eval("de.titus.core.SpecialFunctions.EVALRESULTS." + varname + " = " + aStatement + ";");
				}
				
				var result = de.titus.core.SpecialFunctions.EVALRESULTS[varname];
				de.titus.core.SpecialFunctions.EVALRESULTS[varname] = undefined;
				de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname] = undefined;
				return result;
			}
			
			return undefined;
		}
	};
	
	de.titus.core.SpecialFunctions.newVarname = function() {
		var varname = "var" + (new Date().getTime());
		if (de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname] == undefined) {
			de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname] = "";
			return varname;
		} else
			return de.titus.core.SpecialFunctions.newVarname();
	};
	
	/**
	 * 
	 * @param aStatement
	 * @param aContext
	 * @param aDefault
	 * @param aCallback
	 * @returns
	 */
	de.titus.core.SpecialFunctions.doEvalWithContext = function(aStatement, aContext, aDefault, aCallback) {
		if (aCallback != undefined && typeof aCallback === "function") {
			window.setTimeout(function() {
				var result = de.titus.core.SpecialFunctions.doEvalWithContext(aStatement, aContext, aDefault, undefined);
				aCallback(result, aContext, this);
			}, 10);
			
		} else {
			var result = de.titus.core.SpecialFunctions.doEval(aStatement, aContext);
			if (result == undefined) {
				return aDefault;
			}
			return result;
		}
	};
	
});
(function($) {
	$.fn.tagName = $.fn.tagName || function() {
		if (this.length == undefined || this.length == 0)
			return undefined;
		else if (this.length > 1) {
			return this.each(function() {
				return $(this).tagName();
			});
		} else {
			var tagname = this.prop("tagName");
			if(tagname != undefined && tagname != "")
				return tagname.toLowerCase();
			
			return undefined;				
		}
	};
})(jQuery);
(function($){
	if($.fn.Selector == undefined){
		$.fn.Selector = function() {
			var pathes = [];
			
			this.each(function() {
				var element = $(this);
				if(element[0].id != undefined && element[0].id != "")
					pathes.push("#" + element[0].id);
				else {
					var path;
					while (element.length) {
						var realNode = element.get(0), name = realNode.localName;
						if (!name) {
							break;
						}
						
						name = name.toLowerCase();
						var parent = element.parent();
						var sameTagSiblings = parent.children(name);
						
						if (sameTagSiblings.length > 1) {
							allSiblings = parent.children();
							var index = allSiblings.index(realNode) + 1;
							if (index > 0) {
								name += ':nth-child(' + index + ')';
							}
						}
						
						path = name + (path ? ' > ' + path : '');
						element = parent;
					}			
					pathes.push(path);
				}
			});
			
			return pathes.join(',');
		};
	};
})($);
de.titus.core.Namespace.create("de.titus.core.regex.Matcher", function() {
	de.titus.core.regex.Matcher = function(/* RegExp */aRegExp, /* String */aText) {
		this.internalRegex = aRegExp;
		this.processingText = aText;
		this.currentMatch = undefined;
	}

	de.titus.core.regex.Matcher.prototype.isMatching = /* boolean */function() {
		return this.internalRegex.test(this.processingText);
	};
	
	de.titus.core.regex.Matcher.prototype.next = /* boolean */function() {
		this.currentMatch = this.internalRegex.exec(this.processingText);
		if (this.currentMatch != undefined) {
			this.processingText = this.processingText.replace(this.currentMatch[0], "");
			return true;
		}
		return false;
	};
	
	de.titus.core.regex.Matcher.prototype.getMatch = /* String */function() {
		if (this.currentMatch != undefined)
			return this.currentMatch[0];
		return undefined;
	};
	
	de.titus.core.regex.Matcher.prototype.getGroup = /* String */function(/* int */aGroupId) {
		if (this.currentMatch != undefined)
			return this.currentMatch[aGroupId];
		return undefined;
	};
	
	de.titus.core.regex.Matcher.prototype.replaceAll = /*String*/ function(/* String */aReplaceValue, /* String */aText) {
		if (this.currentMatch != undefined)
			return aText.replace(this.currentMatch[0], aReplaceValue);
		return aText;
	};
});

de.titus.core.Namespace.create("de.titus.core.regex.Regex", function() {
	
	de.titus.core.regex.Regex = function(/* String */aRegex, /* String */aOptions) {
		this.internalRegex = new RegExp(aRegex, aOptions);
	};
	
	de.titus.core.regex.Regex.prototype.parse = /* de.titus.core.regex.Matcher */function(/* String */aText) {
		return new de.titus.core.regex.Matcher(this.internalRegex, aText);
	};
});
de.titus.core.Namespace.create("de.titus.core.ExpressionResolver", function() {
	
	de.titus.core.ExpressionResolver = function(varRegex) {
		this.regex = new de.titus.core.regex.Regex(varRegex || de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX);
	};
	
	/**
	 * static variables
	 */
	de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX = "\\$\\{([^\\$\\{\\}]*)\\}";
	
	/**
	 * @param aText
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	de.titus.core.ExpressionResolver.prototype.resolveText = function(aText, aDataContext, aDefaultValue) {
		var text = aText;
		var matcher = this.regex.parse(text);
		while (matcher.next()) {
			var expression = matcher.getMatch();
			var expressionResult = this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
			if (expressionResult != undefined)
				text = matcher.replaceAll(expressionResult, text);
		}
		return text;
	}

	/**
	 * functions
	 */
	
	/**
	 * @param aExpression
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	de.titus.core.ExpressionResolver.prototype.resolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		var matcher = this.regex.parse(aExpression);
		if (matcher.next()) {
			return this.internalResolveExpression(matcher.getGroup(1), aDataContext, aDefaultValue);
		}
		
		return this.internalResolveExpression(aExpression, aDataContext, aDefaultValue);
	};
	
	/**
	 * @param aExpression
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	de.titus.core.ExpressionResolver.prototype.internalResolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		try {
			var result = de.titus.core.SpecialFunctions.doEvalWithContext(aExpression, aDataContext, aDefaultValue);
			if (result == undefined)
				return aDefaultValue;
			
			return result;
		} catch (e) {
			return undefined;
		}
	};
	
});
(function($) {
	de.titus.core.Namespace.create("de.titus.core.URL", function() {
		de.titus.core.URL = function(aProtocol, aDomain, aPort, aPath, theParameter, aMarker) {
			
			var protocol = aProtocol;
			var domain = aDomain;
			var port = aPort;
			var path = aPath;
			var parameters = theParameter;
			var marker = aMarker

			this.getMarker = function() {
				return marker;
			}

			this.setMarker = function(aMarker) {
				marker = aMarker;
			}

			this.getProtocol = function() {
				if (protocol == undefined) {
					protocol = "http";
				}
				return protocol;
			};
			
			this.setProtocol = function(aProtocol) {
				protokoll = aProtocol;
			};
			
			this.getDomain = function() {
				return domain;
			};
			
			this.setDomain = function(aDomain) {
				domain = aDomain;
			};
			
			this.getPath = function() {
				return path;
			};
			
			this.setPath = function(aPath) {
				path = aPath;
			};
			
			this.getPort = function() {
				if (port == undefined) {
					port = 80;
				}
				return port;
			};
			
			this.setPort = function(aPort) {
				
				port = aPort;
			};
			
			this.getParameters = function() {
				return parameters;
			};
			
			this.setParameters = function(theParameter) {
				parameters = theParameter;
			};
		};
		
		de.titus.core.URL.prototype.getParameter = function(aKey) {
			var value = this.getParameters()[aKey];
			if (value == undefined)
				return undefined;
			if (value.length > 1)
				return value;
			else
				return value[0];
		};
		
		de.titus.core.URL.prototype.getParameters = function(aKey) {
			return this.getParameters()[aKey];
		};
		
		de.titus.core.URL.prototype.addParameter = function(aKey, aValue, append) {
			if (this.getParameters()[aKey] == undefined) {
				this.getParameters()[aKey] = [];
			}
			if (!append && aValue == undefined) {
				this.getParameters()[aKey] = undefined;
			} else if (!append && aValue != undefined && aValue.length != undefined) {
				this.getParameters()[aKey] = aValue;
			} else if (append && aValue != undefined && aValue.length != undefined) {
				$.merge(this.getParameters()[aKey], aValue);
			} else if (!append && aValue != undefined) {
				this.getParameters()[aKey] = [ aValue ];
			} else if (append && aValue != undefined) {
				this.getParameters()[aKey].push(aValue);
			}
		};
		
		de.titus.core.URL.prototype.getQueryString = function() {
			if (this.getParameters() != undefined) {
				var parameters = this.getParameters();
				var result = "?";
				var isFirstParameter = true;
				for ( var propertyName in parameters) {
					if (!isFirstParameter) {
						result = result + "&";
					} else {
						isFirstParameter = false;
					}
					var parameterValues = parameters[propertyName];
					if (parameterValues.length == undefined) {
						result = result + encodeURIComponent(propertyName) + "=" + encodeURIComponent(parameterValues);
					} else {
						for (j = 0; j < parameterValues.length; j++) {
							if (j > 0) {
								result = result + "&";
							}
							result = result + encodeURIComponent(propertyName) + "=" + encodeURIComponent(parameterValues[j]);
						}
					}
				}
				return result;
			} else {
				return "";
			}
		};
		
		de.titus.core.URL.prototype.asString = function() {
			var result = this.getProtocol() + "://" + this.getDomain() + ":" + this.getPort();
			
			if (this.getPath() != undefined)
				result = result + this.getPath();
			
			if (this.getMarker() != undefined)
				result = result + "#" + this.getMarker();
			
			result = result + this.getQueryString();
			
			return result;
		};
		
		de.titus.core.URL.prototype.toString = function() {
			return this.asString();
		};
		
		de.titus.core.URL.fromString = function(aUrlString) {
			var tempUrl = aUrlString;
			var protocol = "http";
			var host;
			var port = 80;
			var path = "/";
			var marker = "";
			var parameterString;
			var splitIndex = -1;
			var parameter = {};
			
			var regex = new RegExp("\\?([^#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined)
				parameterString = match[1];
			
			var regex = new RegExp("#([^\\?#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined)
				marker = decodeURIComponent(match[1]);
			
			splitIndex = tempUrl.indexOf("://");
			if (splitIndex > 0) {
				protocol = tempUrl.substr(0, splitIndex);
				tempUrl = tempUrl.substr(splitIndex + 3);
			}
			
			var regex = new RegExp("([^\/:\\?#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined)
				host = match[1];
			
			var regex = new RegExp(":([^\\/\\?#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined) {
				port = match[1];
			} else if (protocol.toLowerCase() == "https")
				port = 443;
			else if (protocol.toLowerCase() == "ftp")
				port = 21;
			else if (protocol.toLowerCase() == "ftps")
				port = 21;
			
			var regex = new RegExp("(/[^\\?#]*)");
			var match = regex.exec(tempUrl);
			if (match != undefined) {
				path = match[1];
			}
			
			var regex = new RegExp("([^&\\?#=]*)=([^&\\?#=]*)");
			if (parameterString != undefined && "" != parameterString) {
				var parameterEntries = parameterString.split("&");
				for (i = 0; i < parameterEntries.length; i++) {
					var match = regex.exec(parameterEntries[i]);
					var pName = decodeURIComponent(match[1]);
					var pValue = decodeURIComponent(match[2]);
					parameter[pName] ? parameter[pName].push(pValue) : parameter[pName] = [ pValue ];
				}
			}
			
			return new de.titus.core.URL(protocol, host, port, path, parameter, marker);
			
		};
		de.titus.core.URL.getCurrentUrl = function() {
			if (de.titus.core.URL.STATIC__CURRENTURL == undefined) {
				de.titus.core.URL.STATIC__CURRENTURL = de.titus.core.URL.fromString(location.href);
			}
			
			return de.titus.core.URL.STATIC__CURRENTURL;
		};
	});
})($);
(function($) {
	de.titus.core.Namespace.create("de.titus.core.Page", function() {
		
		de.titus.core.Page = function() {
			this.baseTagValue = undefined;
			this.hasBaseTag = false;
			var baseTag = $('base');
			if (baseTag != undefined) {
				this.baseTagValue = baseTag.attr("href");
				this.hasBaseTag = true;
			}
			this.files = {};
			this.data = {};
		};
		
		// KONSTANTEN
		de.titus.core.Page.CSSTEMPLATE = '<link rel="stylesheet" type="text/css"/>';
		de.titus.core.Page.JSTEMPLATE = '<script type="text/javascript"></script>';
		
		de.titus.core.Page.prototype.addJsFile = function(aUrl, aFunction, forceFunction) {
			if ($.isArray(aUrl)) {
				return this.addJsFiles(aUrl, aFunction, forceFunction);
			}
			if (this.files[aUrl] == undefined) {
				this.files[aUrl] = true;
				var jsScript = $(de.titus.core.Page.JSTEMPLATE).clone();
				jsScript.attr("src", aUrl);
				$("head").append(jsScript);
				
				if (aFunction != undefined)
					aFunction();
			} else if (forceFunction && aFunction != undefined) {
				aFunction();
			}
		};
		
		de.titus.core.Page.prototype.addJsFiles = function(aUrls, aFunction, forceFunction) {
			if ($.isArray(aUrls)) {
				var url = aUrls.shift();
				if (aUrls.length != 0) {
					var $__THIS__$ = this;
					this.addJsFile(url, function() {
						$__THIS__$.addJsFiles(aUrls, aFunction, forceFunction)
					}, true);
				} else
					this.addJsFile(url, aFunction, forceFunction);
			} else {
				this.addJsFile(aUrls, aFunction, forceFunction);
			}
		};
		
		de.titus.core.Page.prototype.addCssFile = function(aUrl) {
			if ($.isArray(aUrl)) {
				this.addCssFiles(aUrl);
				return;
			}
			
			if (this.files[aUrl] == undefined) {
				this.files[aUrl] = true;
				var cssScript = $(de.titus.core.Page.CSSTEMPLATE).clone();
				cssScript.attr("href", aUrl);
				$("head").append(cssScript);
			}
		};
		
		de.titus.core.Page.prototype.addCssFiles = function(aUrls) {
			if ($.isArray(aUrls)) {
				for (i = 0; i < aUrls.length; i++) {
					this.addCssFile(aUrls[i]);
				}
			}
		};
		
		de.titus.core.Page.prototype.getUrl = function() {
			return de.titus.core.URL.getCurrentUrl();
		};
		
		de.titus.core.Page.prototype.buildUrl = function(aUrl) {
			var browser = this.detectBrowser();
			if (browser.ie && browser.ie < 11) {
				var tempUrl = aUrl.toLowerCase().trim();
				if (this.hasBaseTag && !tempUrl.indexOf("http:") == 0 && !tempUrl.indexOf("https:") == 0 && !tempUrl.indexOf("ftp:") == 0 && !tempUrl.indexOf("ftps:") == 0 && !tempUrl.indexOf("mailto:") == 0 && !tempUrl.indexOf("notes:") == 0 && !tempUrl.indexOf("/") == 0) {
					return this.baseTagValue + aUrl;
				}
			}
			return aUrl;
		};
		
		de.titus.core.Page.prototype.detectBrowser = function() {
			/* http://stackoverflow.com/a/21712356/2120330 */
			var result = {
			"ie" : false,
			"edge": false,
			"other" : false
			};
			var ua = window.navigator.userAgent;			
			if (ua.indexOf('MSIE ') > 0)
				result.ie = 8;
			else if (ua.indexOf("Trident/7.0") > 0)
				result.ie = 11;
			else if (ua.indexOf("Trident/6.0") > 0)
				result.ie = 10;
			else if (ua.indexOf("Trident/5.0") > 0)
				result.ie = 9;	
			else if (ua.indexOf('Edge/') > 0)
				result.edge = 1;	
			else
				result.other = true;
			
			return result;
		};
		
		de.titus.core.Page.prototype.setData = function(aKey, aValue) {
			this.data[aKey] = aValue;
		};
		
		de.titus.core.Page.prototype.getData = function(aKey) {
			return this.data[aKey];
		};
		
		de.titus.core.Page.getInstance = function() {
			if (de.titus.core.Page.INSTANCE == undefined) {
				de.titus.core.Page.INSTANCE = new de.titus.core.Page();
			}
			
			return de.titus.core.Page.INSTANCE;
		};
		
		if ($.fn.de_titus_core_Page == undefined) {
			$.fn.de_titus_core_Page = de.titus.core.Page.getInstance;
		}
		;
	});
})($);
de.titus.core.Namespace.create("de.titus.core.UUID", function() {
	de.titus.core.UUID = function(customSpacer) {
		var spacer = customSpacer || "-";
		var template = 'xxxxxxxx' + spacer + 'xxxx' + spacer + '4xxx' + spacer + 'yxxx' + spacer + 'xxxxxxxxxxxx';
		return template.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0
			var v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
});(function($) {
	de.titus.core.Namespace.create("de.titus.core.StringUtils", function() {
		de.titus.core.StringUtils = {};
		de.titus.core.StringUtils.DEFAULTS = {};
		de.titus.core.StringUtils.DEFAULTS.formatToHtml = {
		"tabsize" : 4,
		"tabchar" : "&nbsp;",
		"newlineTag" : "<br/>"
		};
		
		de.titus.core.StringUtils.DEFAULTS.trimTextLength = {
			"postfix" : "..."
		};
		
		de.titus.core.StringUtils.trimTextLength = function(aText, maxLength, theSettings) {
			if (aText == undefined || typeof aText !== "string" || aText == "")
				return aText;
			
			var settings = $.extend({}, theSettings, de.titus.core.StringUtils.DEFAULTS.trimTextLength);
			
			if (aText.length > maxLength) {
				var end = maxLength - settings.postfix.length;
				if ((aText.length - end) > 0)
					return aText.substring(0, end) + settings.postfix;
			}
			return aText;
		};
		
		de.titus.core.StringUtils.formatToHtml = function(aText, theSettings) {
			if (aText == undefined || typeof aText !== "string" || aText == "")
				return aText;
			
			var settings = $.extend({}, theSettings, de.titus.core.StringUtils.DEFAULTS.formatToHtml);
			var text = aText.replace(new RegExp("\n\r", "g"), "\n");
			var text = aText.replace(new RegExp("\r", "g"), "\n");
			var lines = text.split("\n");
			var text = "";
			for (var i = 0; i < lines.length; i++) {
				if (i != 0)
					text = text + settings.newlineTag;
				text = text + de.titus.core.StringUtils.preventTabs(lines[i], settings.tabsize, settings.tabchar);
			}
			return text;
		};
		
		de.titus.core.StringUtils.getTabStopMap = function(tabSize, tabString) {
			var tabstopMap = [];
			for (var i = 0; i <= tabSize; i++) {
				if (i == 0)
					tabstopMap[0] = "";
				else
					tabstopMap[i] = tabstopMap[i - 1] + tabString;
			}
			
			return tabstopMap;
		};
		
		de.titus.core.StringUtils.preventTabs = function(aText, theTabStops, theTabStopChar) {
			var tabstopMap = de.titus.core.StringUtils.getTabStopMap(theTabStops, theTabStopChar);
			var tabStops = theTabStops;
			var text = "";
			var tabs = aText.split("\t");
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].length != 0 && i != 0) {
					var size = text.length;
					var tabSize = size % tabStops;
					text = text + tabstopMap[theTabStops - tabSize] + tabs[i];
				} else if (tabs[i].length == 0 && i != 0)
					text = text + tabstopMap[theTabStops];
				else
					text = text + tabs[i];
			}
			
			return text;
		};
		
		// This is the function.
		de.titus.core.StringUtils.format = function(aText, args) {
			var objects = arguments;
			return aText.replace(de.titus.core.StringUtils.format.VARREGEX, function(item) {
				var index = parseInt(item.substring(1, item.length - 1)) + 1;
				var replace;
				if (index > 0 && index < objects.length ) {
					replace = objects[index];
					if(typeof replace !== "string")
						replace = JSON.stringify(replace);
				} else if (index === -1) {
					replace = "{";
				} else if (index === -2) {
					replace = "}";
				} else {
					replace = "";
				}
				return replace;
			});
		};
		de.titus.core.StringUtils.format.VARREGEX = new RegExp("{-?[0-9]+}", "g");
		
		$.fn.de_titus_core_StringUtils = de.titus.core.StringUtils;
	});
})($);
(function($) {
	de.titus.core.Namespace.create("de.titus.core.EventBind", function() {
		"use strict";
		de.titus.core.EventBind = function(anElement, aContext) {
			if (anElement.data(de.titus.core.EventBind.STATE.FINISHED) == undefined) {
				
				var eventType = anElement.attr("event-type");
				if (eventType == undefined || eventType.trim().length == 0) {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return this;
				}
				
				var action = anElement.attr("event-action");
				if (action == undefined || action.trim().length == 0) {
					anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.FAIL);
					return this;
				}
				
				var data = undefined;
				var eventData = anElement.attr("event-data");
				if (eventData != undefined && eventData.trim().length > 0){
					data = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(eventData, aContext , {});
				}
				else if(aContext != undefined){
					data = $().extend({}, aContext);
				}
				else {
					data = {};
				}
				
				anElement.on(eventType, null, data, de.titus.core.EventBind.$$__execute__$$);
				anElement.data(de.titus.core.EventBind.STATE.FINISHED, de.titus.core.EventBind.FINISHEDSTATE.READY);
				return this;
			}
		};
		
		de.titus.core.EventBind.EXPRESSIONRESOLVER = new de.titus.core.ExpressionResolver();
		de.titus.core.EventBind.STATE = {
			FINISHED : "$$EventBind.FINISHED$$"
		};
		de.titus.core.EventBind.FINISHEDSTATE = {
		FAIL : "fail",
		READY : "ready"
		};
		
		de.titus.core.EventBind.$$__execute__$$ = function(anEvent) {
			var element = $(this);
			if (element.attr("event-prevent-default") != undefined)
				anEvent.preventDefault();
			if (element.attr("event-stop-propagation") != undefined)
				anEvent.stopPropagation();
			
			var action = element.attr("event-action");
			action = de.titus.core.EventBind.EXPRESSIONRESOLVER.resolveExpression(action, anEvent.data, undefined);
			if (typeof action === "function"){
				var args = Array.from(arguments);
				if(args != undefined && args.length >= 1 && anEvent.data != undefined){
					args.splice(1,0,anEvent.data);
				}
				action.apply(action, args);
			}
			
			return !anEvent.isDefaultPrevented();
		};
		
		$.fn.de_titus_core_EventBind = function(aContext) {
			if (this.length == 1)
				return de.titus.core.EventBind(this, aContext);
			else if (this.length >= 1) {
				return this.each(function() {
					return $(this).de_titus_core_EventBind(aContext);
				});
			}
		};
		
		$(document).ready(function() {
			var hasAutorun = $("[event-autorun]");
			if (hasAutorun != undefined && hasAutorun.length != 0) {
				$("[event-autorun]").de_titus_core_EventBind();
				$("[event-autorun]").find("[event-type]").de_titus_core_EventBind();
				
				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						for (var i = 0; i < mutation.addedNodes.length; i++) {
							if (mutation.addedNodes[i].nodetype != Node.TEXT_NODE) {
								$(mutation.addedNodes[i]).find("[event-type]").de_titus_core_EventBind();
							}
						}
					});
				});
				
				// configuration of the observer:
				var config = {
				attributes : false,
				childList : true,
				subtree : true,
				characterData : false
				};
				
				// pass in the target node, as well as the observer options
				observer.observe(document.querySelector("[event-autorun]"), config);
			}
		});
	});
})($, document);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.core.Converter", function() {
		de.titus.core.Converter.xmlToJson = function(aNode) {
			// Create the return object
			var obj = {};
			if (aNode.nodeType == 1 || aNode.nodeType == 9) { // element
				// do attributes
				if (aNode.attributes != undefined && aNode.attributes.length > 0) {
					var attributes = {};
					for (var j = 0; j < aNode.attributes.length; j++) {
						var attribute = aNode.attributes.item(j);
						attributes[attribute.nodeName] = attribute.nodeValue;
					}
					obj["@attributes"] = attributes;
				}
			}else if (aNode.nodeType == 3 || aNode.nodeType == 4) { // text
				return aNode.nodeValue;
			}
			
			// do children
			if (aNode.hasChildNodes()) {
				if (aNode.childNodes.length == 1){
					var item = aNode.childNodes.item(0);
					if(item.nodeType != 3 &&  item.nodeType != 4) {
						obj[item.nodeName] =  de.titus.core.Converter.xmlToJson(item);
					}
					else if ((item.nodeType == 3 || item.nodeType == 4) && obj["@attributes"] == undefined) {
						return  de.titus.core.Converter.xmlToJson(item);
					}
					else if ((item.nodeType == 3 || item.nodeType == 4) && obj["@attributes"] != undefined) {
						obj.text =  de.titus.core.Converter.xmlToJson(item);
					}
				}
				else {
					for (var i = 0; i < aNode.childNodes.length; i++) {
						var item = aNode.childNodes.item(i);
						if (item.nodeType == 1) {	
							var nodeName = item.nodeName;
							if (typeof (obj[nodeName]) == "undefined") {
								obj[nodeName] = de.titus.core.Converter.xmlToJson(item);
							} else {
								if (typeof (obj[nodeName].push) == "undefined") {
									var old = obj[nodeName];
									obj[nodeName] = [];
									obj[nodeName].push(old);
								}
								obj[nodeName].push(de.titus.core.Converter.xmlToJson(item));
							}
						}
					}
				}
			}
			return obj;
		};
		
	});
})($);
/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

de.titus.core.Namespace.create("de.titus.logging.LogLevel", function() {
	
	de.titus.logging.LogLevel = function(aOrder, aTitle){
		this.order = aOrder;
		this.title = aTitle;
	};
	
	de.titus.logging.LogLevel.prototype.isIncluded = function(aLogLevel){
		return this.order >= aLogLevel.order;
	};
	
	de.titus.logging.LogLevel.getLogLevel = function(aLogLevelName){
		if(aLogLevelName == undefined)
			return de.titus.logging.LogLevel.NOLOG;
		
		var levelName = aLogLevelName.toUpperCase();
		return de.titus.logging.LogLevel[levelName];
	};
	
	de.titus.logging.LogLevel.NOLOG = new de.titus.logging.LogLevel(0, "NOLOG");
	de.titus.logging.LogLevel.ERROR = new de.titus.logging.LogLevel(1, "ERROR");
	de.titus.logging.LogLevel.WARN 	= new de.titus.logging.LogLevel(2, "WARN");
	de.titus.logging.LogLevel.INFO 	= new de.titus.logging.LogLevel(3, "INFO");
	de.titus.logging.LogLevel.DEBUG = new de.titus.logging.LogLevel(4, "DEBUG");
	de.titus.logging.LogLevel.TRACE = new de.titus.logging.LogLevel(5, "TRACE");	
});
de.titus.core.Namespace.create("de.titus.logging.LogAppender", function() {
	
	de.titus.logging.LogAppender = function() {
	};
	
	de.titus.logging.LogAppender.prototype.formatedDateString = function(aDate){
		if(aDate == undefined)
			return "";
		
		var dateString = "";
		
		dateString += aDate.getFullYear() + ".";
		if(aDate.getMonth() < 10) dateString += "0" + aDate.getMonth();
		else dateString += aDate.getMonth();
		dateString += ".";
		if(aDate.getDate() < 10) dateString += "0" + aDate.getDate();
		else dateString += aDate.getDate();		
		dateString +=  " ";
		if(aDate.getHours() < 10) dateString += "0" + aDate.getHours();
		else dateString += aDate.getHours();
		dateString += ":";
		if(aDate.getMinutes() < 10) dateString += "0" + aDate.getMinutes();
		else dateString += aDate.getMinutes();
		dateString += ":";
		if(aDate.getSeconds() < 10) dateString += "0" + aDate.getSeconds();
		else dateString += aDate.getSeconds();
		dateString += ":";
		if(aDate.getMilliseconds() < 10) dateString += "00" + aDate.getMilliseconds();
		if(aDate.getMilliseconds() < 100) dateString += "0" + aDate.getMilliseconds();
		else dateString += aDate.getMilliseconds();
		
		return dateString;
	};

	
	/*This need to be Implemented*/
	de.titus.logging.LogAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel){};
	
	
});

de.titus.core.Namespace.create("de.titus.logging.Logger", function() {
	
	de.titus.logging.Logger = function(aName, aLogLevel, aLogAppenders) {
		this.name = aName;
		this.logLevel = aLogLevel;
		this.logAppenders = aLogAppenders;
	};
	
	de.titus.logging.Logger.prototype.isErrorEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.ERROR);
	};
	de.titus.logging.Logger.prototype.isWarnEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.WARN);
	};
	de.titus.logging.Logger.prototype.isInfoEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.INFO);
	};
	de.titus.logging.Logger.prototype.isDebugEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.DEBUG);
	};
	de.titus.logging.Logger.prototype.isTraceEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.TRACE);
	};
	
	de.titus.logging.Logger.prototype.logError = function(aMessage, aException) {
		if (this.isErrorEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.ERROR);
	};
	
	de.titus.logging.Logger.prototype.logWarn = function(aMessage, aException) {
		if (this.isWarnEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.WARN);
	};
	
	de.titus.logging.Logger.prototype.logInfo = function(aMessage, aException) {
		if (this.isInfoEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.INFO);
	};
	
	de.titus.logging.Logger.prototype.logDebug = function(aMessage, aException) {
		if (this.isDebugEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.DEBUG);
	};
	
	de.titus.logging.Logger.prototype.logTrace = function(aMessage, aException) {
		if (this.isTraceEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.TRACE);
	};
	
	de.titus.logging.Logger.prototype.log = function(aMessage, anException, aLogLevel) {
		if(this.logAppenders == undefined)
			return;
		
		if(this.logAppenders.length > 0){
			for(var i = 0; i < this.logAppenders.length; i++)
				this.logAppenders[i].logMessage(aMessage, anException, this.name, new Date(), aLogLevel);
		}
	};
});
de.titus.core.Namespace.create("de.titus.logging.LoggerRegistry", function() {
	
	de.titus.logging.LoggerRegistry = function(){
		this.loggers = {};
	};		
	
	de.titus.logging.LoggerRegistry.prototype.addLogger = function(aLogger){
		if(aLogger == undefined)
			return;
		
		if(this.loggers[aLogger.name] == undefined)
			this.loggers[aLogger.name] = aLogger;
	};	
	
	de.titus.logging.LoggerRegistry.prototype.getLogger = function(aLoggerName){
		if(aLoggerName == undefined)
			return;
		
		return this.loggers[aLoggerName];
	};	
	
	
	de.titus.logging.LoggerRegistry.getInstance = function(){
		if(de.titus.logging.LoggerRegistry.INSTANCE == undefined)
			de.titus.logging.LoggerRegistry.INSTANCE = new de.titus.logging.LoggerRegistry();
		
		return de.titus.logging.LoggerRegistry.INSTANCE;
	};	
	
});de.titus.core.Namespace.create("de.titus.logging.LoggerFactory", function() {
	
	de.titus.logging.LoggerFactory = function() {
		this.configs = undefined;
		this.appenders = {};
		this.loadLazyCounter = 0;
	};
	
	de.titus.logging.LoggerFactory.prototype.newLogger = function(aLoggerName) {
		var logger = de.titus.logging.LoggerRegistry.getInstance().getLogger(aLoggerName);
		if (logger == undefined) {
			var config = this.findConfig(aLoggerName);
			var logLevel = de.titus.logging.LogLevel.getLogLevel(config.logLevel);
			var appenders = this.getAppenders(config.appenders);
			
			logger = new de.titus.logging.Logger(aLoggerName, logLevel, appenders);
			de.titus.logging.LoggerRegistry.getInstance().addLogger(logger);
		}
		
		return logger;
	};
	
	de.titus.logging.LoggerFactory.prototype.getConfig = function() {
		if (this.configs == undefined)
			this.updateConfigs();
		
		return this.configs;
	};
	
	de.titus.logging.LoggerFactory.prototype.setConfig = function(aConfig) {
		if (aConfig != undefined) {
			this.configs = aConfig;
			this.updateLogger();
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.updateConfigs = function(aConfig) {
		if (this.configs == undefined)
			this.configs = {};
		
		var configElement = $("[logging-properties]").first();
		if (configElement != undefined && (configElement.length == undefined || configElement.length == 1)) {
			var propertyString = configElement.attr("logging-properties");
			var properties = de.titus.core.SpecialFunctions.doEval(propertyString, {});
			this.loadConfig(properties);
		} else {
			de.titus.logging.LoggerFactory.getInstance().doLoadLazy();
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.doLoadLazy = function() {
		if (this.loadLazyCounter > 10)
			return;
		this.loadLazyCounter++;
		window.setTimeout(function() {
			de.titus.logging.LoggerFactory.getInstance().loadConfig();
		}, 1);
	};
	
	de.titus.logging.LoggerFactory.prototype.loadConfig = function(aConfig) {
		if (aConfig == undefined)
			this.updateConfigs();
		else {
			if (aConfig.remote)
				this.loadConfigRemote(aConfig.remote);
			else if (aConfig.data) {
				this.setConfig(aConfig.data.configs);
			}
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.loadConfigRemote = function(aRemoteData) {
		var this_ = this;
		var ajaxSettings = {
		"async" : false,
		"cache" : false,
		"dataType" : "json"
		};
		ajaxSettings = $.extend(ajaxSettings, aRemoteData);
		ajaxSettings.success = function(data) {
			this_.setConfig(data.configs);
		};
		ajaxSettings.error = function(error) {
			console.log(error);
		};
		$.ajax(ajaxSettings)
	};
	
	de.titus.logging.LoggerFactory.prototype.updateLogger = function() {
		
		var loggers = de.titus.logging.LoggerRegistry.getInstance().loggers;
		
		for ( var loggerName in loggers) {
			var logger = loggers[loggerName];
			
			var config = this.findConfig(loggerName);
			var logLevel = de.titus.logging.LogLevel.getLogLevel(config.logLevel);
			var appenders = this.getAppenders(config.appenders);
			
			logger.logLevel = logLevel;
			logger.logAppenders = appenders;
		}
	};
	
	de.titus.logging.LoggerFactory.prototype.findConfig = function(aLoggerName) {
		var defaultConfig = {
		"filter" : "",
		"logLevel" : "NOLOG",
		"appenders" : []
		};
		var actualConfig = undefined;
		var configs = this.getConfig();
		for (var i = 0; i < configs.length; i++) {
			var config = configs[i];
			if (this.isConfigActiv(aLoggerName, config, actualConfig))
				actualConfig = config;
			else if (config.filter == undefined || config.filter == "")
				defaultConfig = config;
			if (actualConfig != undefined && actualConfig.filter == aLoggerName)
				return actualConfig;
		}
		
		return actualConfig || defaultConfig;
	};
	
	de.titus.logging.LoggerFactory.prototype.isConfigActiv = function(aLoggerName, aConfig, anActualConfig) {
		if (anActualConfig != undefined && anActualConfig.filter.length >= aConfig.filter.filter)
			return false;
		return aLoggerName.search(aConfig.filter) == 0;
	};
	
	de.titus.logging.LoggerFactory.prototype.getAppenders = function(theAppenders) {
		var result = new Array();
		for (var i = 0; i < theAppenders.length; i++) {
			var appenderString = theAppenders[i];
			var appender = this.appenders[appenderString];
			if (appender == undefined) {
				appender = de.titus.core.SpecialFunctions.doEval("new " + appenderString + "();");
				if (appender != undefined) {
					this.appenders[appenderString] = appender;
				}
			}
			if (appender != undefined)
				result.push(appender);
		}
		
		return result;
	};
	
	de.titus.logging.LoggerFactory.getInstance = function() {
		if (de.titus.logging.LoggerFactory.INSTANCE == undefined)
			de.titus.logging.LoggerFactory.INSTANCE = new de.titus.logging.LoggerFactory();
		
		return de.titus.logging.LoggerFactory.INSTANCE;
	};
	
});
de.titus.core.Namespace.create("de.titus.logging.ConsolenAppender", function() {
	
	de.titus.logging.ConsolenAppender = function() {
	};
	
	de.titus.logging.ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.ConsolenAppender.prototype.constructor = de.titus.logging.ConsolenAppender;
	
	de.titus.logging.ConsolenAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
		if (de.titus.logging.LogLevel.NOLOG == aLogLevel)
			return;
		var log = "";
		if (aDate)
			log += log = this.formatedDateString(aDate) + " ";
		
		log += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if (aMessage)
			log += " -> " + aMessage;
		if (anException)
			log += ": " + anException;
		
		if (de.titus.logging.LogLevel.ERROR == aLogLevel)
			console.error == undefined ? console.error(log) : console.log(log);
		else if (de.titus.logging.LogLevel.WARN == aLogLevel)
			console.warn == undefined ? console.warn(log) : console.log(log);
		else if (de.titus.logging.LogLevel.INFO == aLogLevel)
			console.info == undefined ? console.info(log) : console.log(log);
		else if (de.titus.logging.LogLevel.DEBUG == aLogLevel)
			console.debug == undefined ? console.debug(log) : console.log(log);
		else if (de.titus.logging.LogLevel.TRACE == aLogLevel)
			console.trace == undefined ? console.trace(log) : console.log(log);
		
	};
});
de.titus.core.Namespace.create("de.titus.logging.HtmlAppender", function() {
	
	
	
	de.titus.logging.HtmlAppender = function(){
	};
	
	de.titus.logging.HtmlAppender.CONTAINER_QUERY = "#log";
	
	de.titus.logging.HtmlAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.HtmlAppender.prototype.constructor = de.titus.logging.HtmlAppender;
	
	de.titus.logging.HtmlAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){
		var container = $(de.titus.logging.HtmlAppender.CONTAINER_QUERY);
		if(container == undefined)
			return;
		
		var log = $("<div />").addClass("log-entry " + aLogLevel.title);
		var logEntry = "";
		if(aDate)
			logEntry += logEntry = this.formatedDateString(aDate) + " ";
		
		logEntry += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if(aMessage)
			logEntry += " -> " + aMessage;
		if(anException)
			logEntry += ": " + anException;
		
		log.text(logEntry);		
		container.append(log);
	};
});de.titus.core.Namespace.create("de.titus.logging.MemoryAppender", function() {
	
	window.MEMORY_APPENDER_LOG = new Array();
	
	de.titus.logging.MemoryAppender = function(){
	};
	
	de.titus.logging.MemoryAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.MemoryAppender.prototype.constructor = de.titus.logging.MemoryAppender;
	
	de.titus.logging.MemoryAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
		var log = {"date": aDate, 
				"logLevel": aLogLevel,
				"loggerName": aLoggerName,
				"message": aMessage,
				"exception": anException
		};
		
		window.MEMORY_APPENDER_LOG.push(log);
	};
});de.titus.core.Namespace.create("de.titus.logging.InteligentBrowserAppender", function() {	
	de.titus.logging.InteligentBrowserAppender = function(){
		this.appender = undefined;
	};
	
	de.titus.logging.InteligentBrowserAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.InteligentBrowserAppender.prototype.constructor = de.titus.logging.InteligentBrowserAppender;
	
	de.titus.logging.InteligentBrowserAppender.prototype.getAppender = function(){
		if(this.appender == undefined)
		{
			var consoleAvalible = console && console.log === "function";			
			
			if(consoleAvalible)
				this.appender = new de.titus.logging.ConsolenAppender();
			else if($(de.titus.logging.HtmlAppender.CONTAINER_QUERY))
				this.appender = new de.titus.logging.HtmlAppender();
			else
				this.appender = new de.titus.logging.MemoryAppender();			
		}
		
		return this.appender;
	}
	
	de.titus.logging.InteligentBrowserAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
		this.getAppender().logMessage(aMessage, anException, aLoggerName, aDate, aLogLevel);
	};
});
/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

de.titus.core.Namespace.create("de.titus.jstl.Constants", function() {
	de.titus.jstl.Constants = {
		EVENTS : {
		onStart : "jstl-on-start",
		onLoad : "jstl-on-load",
		onSuccess : "jstl-on-success",
		onFail : "jstl-on-fail",
		onReady : "jstl-on-ready"
		}
	};	
});
de.titus.core.Namespace.create("de.titus.jstl.FunctionRegistry", function() {	
	de.titus.jstl.FunctionRegistry = function(){
		this.functions = new Array();
	};
	
	de.titus.jstl.FunctionRegistry.prototype.add = function(aFunction){
		this.functions.push(aFunction);
	};
	
	
	de.titus.jstl.FunctionRegistry.getInstance = function(){
		if(de.titus.jstl.FunctionRegistry.INSTANCE == undefined){
			de.titus.jstl.FunctionRegistry.INSTANCE = new de.titus.jstl.FunctionRegistry();
		}
		
		return de.titus.jstl.FunctionRegistry.INSTANCE;
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.FunctionResult", function() {	
	de.titus.jstl.FunctionResult = function(runNextFunction, processChilds){
		this.runNextFunction = runNextFunction || runNextFunction == undefined;
		this.processChilds = processChilds || processChilds == undefined;
	};	
});
de.titus.core.Namespace.create("de.titus.jstl.IFunction", function() {	
	de.titus.jstl.IFunction = function(theAttributeName){
		this.attributeName = theAttributeName;	
	};
	
	de.titus.jstl.IFunction.prototype.run = /*de.titus.jstl.FunctionResult*/ function(aElement, aDataContext, aProcessor){return true;};
	
});
(function() {
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		var If = function() {};
		If.prototype = new de.titus.jstl.IFunction("if");
		If.prototype.constructor = If;
		
		/***********************************************************************
		 * static variables
		 **********************************************************************/
		If.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If");
		
		If.prototype.run = /* boolean */function(aElement, aDataContext, aProcessor) {
			if (If.LOGGER.isDebugEnabled())
				If.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var processor = aProcessor || new de.titus.jstl.Processor();
			var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
			
			var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
			if (expression != undefined) {
				var expressionResult = expressionResolver.resolveExpression(expression, aDataContext, false);
				if (typeof expressionResult === "function")
					expressionResult = expressionResult(aElement, aDataContext, aProcessor);
				
				expressionResult = expressionResult == true || expressionResult == "true";
				if (!expressionResult) {
					aElement.remove();
					return new de.titus.jstl.FunctionResult(false, false);
				}
			}
			
			return new de.titus.jstl.FunctionResult(true, true);
		};
		
		de.titus.jstl.functions.If = If;
		
	});
})();
de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
	var Choose = function() {};
	Choose.prototype = new de.titus.jstl.IFunction("choose");
	Choose.prototype.constructor = Choose;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	Choose.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	Choose.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			
			this.processChilds(aElement, aDataContext, processor, expressionResolver);
			return new de.titus.jstl.FunctionResult(true, true);
		}		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Choose.prototype.processChilds = function(aChooseElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processChilds(" + aChooseElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var childs = aChooseElement.children();
		var resolved = false;
		var $__THIS__$ = this;
		childs.each(function() {			
			var child = $(this);
			if (!resolved && $__THIS__$.processChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver)) {
				if (Choose.LOGGER.isTraceEnabled())
					Choose.LOGGER.logTrace("compute child: " + child);
				resolved = true;
			} else {
				if (Choose.LOGGER.isTraceEnabled())
					Choose.LOGGER.logTrace("remove child: " + child);
				child.remove();
			}
		});
	};
	
	Choose.prototype.processChild = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processChild(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		if (this.processWhenElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver)) {
			return true;
		} else if (this.processOtherwiseElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver)) {
			return true;
		} else {
			return false;
		}
	};
	
	Choose.prototype.processWhenElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processWhenElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.attr(aProcessor.config.attributePrefix + 'when');
		if (expression != undefined) {
			return aExpressionResolver.resolveExpression(expression, aDataContext, false);
		}
		return false;
	};
	
	Choose.prototype.processOtherwiseElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (Choose.LOGGER.isDebugEnabled())
			Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.attr(aProcessor.config.attributePrefix + 'otherwise');
		if (expression != undefined) {
			return true;
		}
		return false;
	};
	
	
	de.titus.jstl.functions.Choose = Choose;
});
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		var Foreach = function() {
		};
		Foreach.prototype = new de.titus.jstl.IFunction("foreach");
		Foreach.prototype.constructor = Foreach;
		
		/***********************************************************************
		 * static variables
		 **********************************************************************/
		Foreach.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach");
		
		/***********************************************************************
		 * functions
		 **********************************************************************/
		
		Foreach.prototype.run = function(aElement, aDataContext, aProcessor) {
			if (Foreach.LOGGER.isDebugEnabled())
				Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			
			var processor = aProcessor || new de.titus.jstl.Processor();
			var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
			
			var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
			if (expression != undefined) {
				this.internalProcession(expression, aElement, aDataContext, processor, expressionResolver);
				return new de.titus.jstl.FunctionResult(false, false);
			}
			return new de.titus.jstl.FunctionResult(true, true);
		};
		
		Foreach.prototype.internalProcession = function(aExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
			if (Foreach.LOGGER.isDebugEnabled())
				Foreach.LOGGER.logDebug("execute processList(" + aElement + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
			
			var tempalte = this.getRepeatableContent(aElement);
			aElement.empty();
			if (tempalte == undefined)
				return;
			
			var varName = this.getVarname(aElement, aProcessor);
			var statusName = this.getStatusName(aElement, aProcessor);
			var list = undefined;
			if (aExpression == "") {
				Foreach.LOGGER.logWarn("No list data specified. Using the data context!");
				list = aDataContext;
			} else
				list = anExpressionResolver.resolveExpression(aExpression, aDataContext, new Array());
			
			var breakCondition = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-break-condition");
			if (list != undefined && (typeof list === "array" || list.length != undefined)) {
				this.processList(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor, anExpressionResolver);
			} else if (list != undefined) {
				this.processMap(list, tempalte, varName, statusName, breakCondition, aElement, aDataContext, aProcessor, anExpressionResolver);
			}
		};
		
		Foreach.prototype.processList = function(aListData, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, anExpressionResolver) {
			if (aListData == undefined || aListData.length == undefined || aListData.length < 1)
				return;
			
			var startIndex = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-start-index") || 0;
			startIndex = anExpressionResolver.resolveExpression(startIndex, aDataContext, 0) || 0;
			for (var i = startIndex; i < aListData.length; i++) {
				var newContent = aTemplate.clone();
				var newContext = $.extend({}, aDataContext);
				newContext[aVarname] = aListData[i];
				newContext[aStatusName] = {
				"index" : i,
				"number" : (i + 1),
				"count" : aListData.length,
				"data" : aListData,
				"context" : aDataContext
				};
				if (aBreakCondition != undefined && this.processBreakCondition(newContext, aBreakCondition, aElement, aProcessor)) {
					return;
				}
				
				this.processNewContent(newContent, newContext, aElement, aProcessor);
				newContext[aVarname] = undefined;
				newContext[aStatusName] = undefined;
			}
		};
		
		Foreach.prototype.processMap = function(aMap, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, anExpressionResolver) {
			var count = 0;
			for ( var name in aMap)
				count++;
			
			var i = 0;
			for ( var name in aMap) {
				var newContent = aTemplate.clone();
				var newContext = jQuery.extend({}, aDataContext);
				newContext[aVarname] = aMap[name];
				newContext[aStatusName] = {
				"index" : i,
				"number" : (i + 1),
				"key" : name,
				"count" : count,
				"data" : aMap,
				"context" : aDataContext
				};
				
				if (aBreakCondition != undefined && this.processBreakCondition(newContext, aBreakCondition, aElement, aProcessor)) {
					return;
				}
				
				i++;
				this.processNewContent(newContent, newContext, aElement, aProcessor);
				newContext[aVarname] = undefined;
				newContext[aStatusName] = undefined;
			}
		};
		
		Foreach.prototype.processBreakCondition = function(aContext, aBreakCondition, aElement, aProcessor) {
			var expressionResolver = aProcessor.expressionResolver || new de.titus.jstl.ExpressionResolver();
			var expressionResult = expressionResolver.resolveExpression(aBreakCondition, aContext, false);
			if (typeof expressionResult === "function")
				expressionResult = expressionResult(aElement, aContext, aProcessor);
			
			return expressionResult == true || expressionResult == "true";
		};
		
		Foreach.prototype.processNewContent = function(aNewContent, aNewContext, aElement, aProcessor) {
			aProcessor.compute(aNewContent, aNewContext);
			aElement.append(aNewContent.contents());
		};
		
		Foreach.prototype.getVarname = function(aElement, aProcessor) {
			var varname = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-var");
			if (varname == undefined)
				return "itemVar";
			
			return varname;
		};
		
		Foreach.prototype.getStatusName = function(aElement, aProcessor) {
			var statusName = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-status");
			if (statusName == undefined)
				return "statusVar";
			
			return statusName;
		};
		
		Foreach.prototype.getRepeatableContent = function(aElement) {
			return $("<div>").append(aElement.contents());
		};
		
		de.titus.jstl.functions.Foreach = Foreach;
	});
})($);
de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {
	var TextContent = function() {};
	TextContent.prototype = new de.titus.jstl.IFunction();
	TextContent.prototype.constructor = TextContent;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	TextContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (TextContent.LOGGER.isDebugEnabled())
			TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		var ignore = aElement.attr(processor.config.attributePrefix + "text-ignore");
		
		if (ignore != true || ignore != "true") {
			
			if(!aElement.is("pre"))
				this.normalize(aElement[0]);
			
			aElement.contents().filter(function() {
				return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
			}).each(function() {
				var contenttype = aElement.attr(processor.config.attributePrefix + "text-content-type") || "text";
				var node = this;
				var text = node.textContent;
				if(text)
					text = text.trim();

				text = expressionResolver.resolveText(text, aDataContext);
				var contentFunction = TextContent.CONTENTTYPE[contenttype];
				if (contentFunction)
					contentFunction(node, text, aElement, processor, aDataContext);
			});
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	TextContent.prototype.normalize = function(node) {
		if (!node) {
			return;
		}
		if (node.nodeType == 3) {
			while (node.nextSibling && node.nextSibling.nodeType == 3) {
				node.nodeValue += node.nextSibling.nodeValue;
				node.parentNode.removeChild(node.nextSibling);
			}
		} else {
			this.normalize(node.firstChild);
		}
		this.normalize(node.nextSibling);
	}
	
	
	TextContent.CONTENTTYPE = {};
	TextContent.CONTENTTYPE["html"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		$(aNode).replaceWith($.parseHTML(aText));
	};
	TextContent.CONTENTTYPE["text/html"] = TextContent.CONTENTTYPE["html"];
	
	TextContent.CONTENTTYPE["json"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		if (typeof aText === "string")
			aNode.textContent = aText;
		else
			aNode.textContent = JSON.stringify(aText);
	};
	TextContent.CONTENTTYPE["application/json"] = TextContent.CONTENTTYPE["json"];
	
	TextContent.CONTENTTYPE["text"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		var text = aText;
		var addAsHtml = false;
		
		var trimLength = aBaseElement.attr(aProcessor.config.attributePrefix + "text-trim-length");
		if (trimLength != undefined && trimLength != "") {
			trimLength = aProcessor.expressionResolver.resolveExpression(trimLength, aDataContext, "-1");
			trimLength = parseInt(trimLength);
			if (trimLength && trimLength > 0)
				text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
		}
		
		var preventformat = aBaseElement.attr(aProcessor.config.attributePrefix + "text-prevent-format");
		if (preventformat != undefined && preventformat != "false") {
			preventformat = preventformat == "" || aProcessor.expressionResolver.resolveExpression(preventformat, aDataContext, true) || true;
			if (preventformat == "true" || preventformat == true) {
				text = de.titus.core.StringUtils.formatToHtml(text);
				addAsHtml = true;
			}
		}
		
		if (addAsHtml)
			$(aNode).replaceWith($.parseHTML(text));
		else
			aNode.textContent = text;
	};
	TextContent.CONTENTTYPE["text/plain"] = TextContent.CONTENTTYPE["text"];
	
	de.titus.jstl.functions.TextContent = TextContent;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {
	var AttributeContent = function() {};
	AttributeContent.prototype = new de.titus.jstl.IFunction();
	AttributeContent.prototype.constructor = AttributeContent;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	AttributeContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AttributeContent");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (AttributeContent.LOGGER.isDebugEnabled())
			AttributeContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		if (aElement.length == 1) {
			var attributes = aElement[0].attributes || [];
			for (var i = 0; i< attributes.length; i++) {
				var name = attributes[i].name;				
				if (name.indexOf(processor.config.attributePrefix) != 0) {
					var value = attributes[i].value;
					if (value != undefined && value != null && value != "" && value != "null") {
						try {
							var newValue = expressionResolver.resolveText(value, aDataContext);
							if (value != newValue) {
								if (AttributeContent.LOGGER.isDebugEnabled()) {
									AttributeContent.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
								}
								aElement.attr(name, newValue);
							}
						} catch (e) {
							AttributeContent.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
						}
					}
				}
			}
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.AttributeContent = AttributeContent;	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
	var Data = function() {};
	Data.prototype = new de.titus.jstl.IFunction("data");
	Data.prototype.constructor = Data;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	Data.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	Data.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Data.LOGGER.isDebugEnabled())
			Data.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Data.prototype.internalProcessing = function(anExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var varname = this.getVarname(aElement, aDataContext, aProcessor, anExpressionResolver);
		var mode = this.getMode(aElement, aProcessor, anExpressionResolver);
		if (this[mode] != undefined && typeof this[mode] === "function")
			this[mode].call(this, anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver);
		else
			this["direct"].call(this, anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var options = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	Data.prototype.getMode = function(aElement, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-mode") || "direct";
	};
	
	Data.prototype.getVarname = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-var");
	};
	
	Data.prototype["direct"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		var newData = anExpressionResolver.resolveExpression(anExpression, aDataContext);
		this.addNewData(newData, aVarname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype["remote"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {		
		var $__THIS__$ = this;		
		var url = anExpressionResolver.resolveText(anExpression, aDataContext);
		var option = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
		var dataType = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-datatype") || "json";
		
		var ajaxSettings = {
		'url' : de.titus.core.Page.getInstance().buildUrl(url),
		'async' : false,
		'cache' : false,
		'dataType' : dataType
		};
		ajaxSettings = $.extend(ajaxSettings, option);
		ajaxSettings.success = function(newData) {
			var data = newData;
			if(dataType.toLowerCase() == "xml")
				data = de.titus.core.Converter.xmlToJson(newData);			
			$__THIS__$.addNewData(data, aVarname, aDataContext, aProcessor, anExpressionResolver);
		};
		
		$.ajax(ajaxSettings);
	};
	
	Data.prototype["url-parameter"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		var parameterName = anExpressionResolver.resolveText(anExpression, aDataContext);
		var value = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
		this.addNewData(value, aVarname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	Data.prototype.addNewData = function(aNewData, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		if (Data.LOGGER.isDebugEnabled())
			Data.LOGGER.logDebug("execute addNewData(" + aNewData + ", " + aVarname + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
		if (aVarname == undefined) {
			$.extend(true, aDataContext, aNewData);
		} else {
			aDataContext[aVarname] = aNewData;
		}
	};
	
	de.titus.jstl.functions.Data = Data;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
	var Include = function() {
		this.cache = {};
	};
	Include.prototype = new de.titus.jstl.IFunction("include");
	Include.prototype.constructor = Include;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	Include.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	Include.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Include.LOGGER.isDebugEnabled())
			Include.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		return new de.titus.jstl.FunctionResult(true, false);
	};
	
	Include.prototype.internalProcessing = function(anIncludeExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var url = anExpressionResolver.resolveText(anIncludeExpression, aDataContext);
		var disableCaching = url.indexOf("?") >= 0 || aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-cache-disabled") != undefined;
		var content = "";
		if (!disableCaching)
			content = this.cache[url];
		
		var includeMode = this.getIncludeMode(aElement, aDataContext, aProcessor, anExpressionResolver);
		if (content)
			this.addHtml(aElement, content, includeMode, aProcessor, aDataContext);
		else {
			var options = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
			var ajaxSettings = {
			'url' : de.titus.core.Page.getInstance().buildUrl(url),
			'async' : false,
			'cache' : aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-ajax-cache-disabled") == undefined,
			"dataType" : "html"
			};
			ajaxSettings = $.extend(true, ajaxSettings, options);
			var $__THIS__$ = this;
			ajaxSettings.success = function(template) {
				var $template = $("<div/>").append(template);
				$__THIS__$.cache[url] = $template 
				$__THIS__$.addHtml(aElement, $template, includeMode, aProcessor, aDataContext);
			};
			
			ajaxSettings.error = function(error) {
				throw JSON.stringify(error);
			};
			$.ajax(ajaxSettings)
		}
	};
	
	Include.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var options = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	Include.prototype.getIncludeMode = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var mode = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-mode");
		if (mode == undefined)
			return "replace";
		
		mode = mode.toLowerCase();
		if (mode == "append" || mode == "replace" || mode == "prepend")
			return mode;
		
		return "replace";
	};
	
	Include.prototype.addHtml = function(aElement, aTemplate, aIncludeMode, aProcessor, aDataContext) {
		if (Include.LOGGER.isDebugEnabled())
			Include.LOGGER.logDebug("execute addHtml(" + aElement + ", " + aTemplate + ", " + aIncludeMode + ")");
		var content = aTemplate.clone();
		aProcessor.compute(content, aDataContext);
		
		if (aIncludeMode == "replace"){
			aElement.empty();
			content.contents().appendTo(aElement);
			//aElement.html(content.html());
		}
		else if (aIncludeMode == "append")
		{			
			content.contents().appendTo(aElement);
			//aElement.append(content.html());
		}
		else if (aIncludeMode == "prepend"){
			content.contents().prependTo(aElement);
			//aElement.prepend(content.html());
		}
		else
		{
			aElement.empty();
			content.contents().appendTo(aElement);
		}		
	};
	
	de.titus.jstl.functions.Include = Include;	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
	var AddAttribute = function() {};
	AddAttribute.prototype = new de.titus.jstl.IFunction("add-attribute");
	AddAttribute.prototype.constructor = AddAttribute;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	AddAttribute.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AddAttribute");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	AddAttribute.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (AddAttribute.LOGGER.isDebugEnabled())
			AddAttribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			
			var expressionResult = expressionResolver.resolveExpression(expression, aDataContext, false);
			
			if (expressionResult != undefined && typeof expressionResult === "function")
				expressionResult = expressionResult(aElement, aDataContext, aProcessor);			
			else if (expressionResult != undefined && typeof expressionResult === "array")
				this.processArray(expressionResult, aElement, aDataContext, processor);
			else
				this.processObject(expressionResult, aElement, aDataContext, processor);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	AddAttribute.prototype.processArray = function(theDataArray, aElement, aDataContext, aProcessor) {
		for (var i = 0; i < theDataArray.length; i++) {
			this.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
		}
	};
	
	AddAttribute.prototype.processObject = function(theData, aElement, aDataContext, aProcessor) {
		if (theData.name != undefined) {
			aElement.attr(theData.name, theData.value);
		} else {
			AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
		}
	};
	
	de.titus.jstl.functions.AddAttribute = AddAttribute;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
	var Databind = function() {};
	Databind.prototype = new de.titus.jstl.IFunction("databind");
	Databind.prototype.constructor = Databind;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	Databind.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Databind");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	Databind.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Databind.LOGGER.isDebugEnabled())
			Databind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var expressionResolver = aProcessor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var varname = this.getVarname(aElement, aDataContext, aProcessor, expressionResolver);
		if (varname != undefined && varname.trim().length != 0) {
			var value = this.getValue(aElement, aDataContext, aProcessor, expressionResolver);
			if(value != undefined)
				aElement.data(varname, value);			
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	Databind.prototype.getVarname = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-name");
	};
	
	Databind.prototype.getValue = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var valueString =  aElement.attr(aProcessor.config.attributePrefix + this.attributeName);
		
		return anExpressionResolver.resolveExpression(valueString, aDataContext, undefined);
	};
	
	de.titus.jstl.functions.Databind = Databind;
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Eventbind", function() {
	var Eventbind = function() {};
	Eventbind.prototype = new de.titus.jstl.IFunction("eventbind");
	Eventbind.prototype.constructor = Eventbind;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	Eventbind.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Eventbind");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	Eventbind.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (Eventbind.LOGGER.isDebugEnabled())
			Eventbind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		aElement.de_titus_core_EventBind(aDataContext);
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	
	de.titus.jstl.functions.Eventbind = Eventbind;
});
(function($) {
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		
		/**
		 * <code>
		 * config: {
		 * "element": element,
		 * "data": dataContext,
		 * "expressionRegex": expressionRegex,
		 * "onLoad": function(){},
		 * "onSuccess":function(){},
		 * "onFail": function(){},
		 * "attributePrefix" : "jstl-" 
		 * }
		 * </code>
		 */
		var Processor = function(aConfig) {
			
			this.config = {
			"element" : undefined,
			"data" : {},
			"attributePrefix" : "jstl-",
			"expressionRegex" : undefined
			};
			
			this.config = $.extend(true, this.config, aConfig);
			var expressionRegex = this.config.element.attr(this.config.attributePrefix + "expression-regex");
			if (expressionRegex != undefined && expressionRegex != "")
				this.config.expressionRegex = expressionRegex;
			
			this.expressionResolver = new de.titus.core.ExpressionResolver(this.config.expressionRegex);
			
			this.onReadyEvent = new Array();
		};
		
		/***********************************************************************
		 * static variables
		 **********************************************************************/
		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		
		/***********************************************************************
		 * functions
		 **********************************************************************/
		
		Processor.prototype.compute = /* boolean */function(aElement, aDataContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute compute(" + (aElement != undefined ? aElement.prop("tagName") : aElement) + ", " + aDataContext + ")");
			if (aElement == undefined)
				return this.internalComputeRoot();
			
			if (!this.isElementProcessable(aElement)) {
				return true;
			}
			
			var events = this.getEvents(aElement) || {};
			return this.internalComputeElement(aElement, aDataContext, events, false);
		};
		
		Processor.prototype.internalComputeRoot = /* boolean */function() {
			
			var events = this.getEvents(this.config.element) || {};
			if (this.config.onLoad)
				events.onLoad = this.config.onLoad;
			if (this.config.onSuccess)
				events.onSuccess = this.config.onSuccess;
			if (this.config.onFail)
				events.onFail = this.config.onFail;
			
			this.config.element.trigger(de.titus.jstl.Constants.EVENTS.onStart,[this.config.data, this ]);
			return this.internalComputeElement(this.config.element, this.config.data, events, true);
		};
		
		Processor.prototype.internalComputeElement = function(aElement, aDataContext, theEvents, isRoot) {			
			var dataContext = aDataContext || this.config.data;
			dataContext.$element = aElement;			
			if (!isRoot) {
				var ignore = aElement.attr(this.config.attributePrefix + "ignore");
				if (ignore != undefined && ignore != "")
					ignore = de.titus.core.SpecialFunctions.doEvalWithContext(ignore, dataContext, false);
				
				if (ignore == "" || ignore == true || ignore == "true") {
					return true;
				}
				
				var async = aElement.attr(this.config.attributePrefix + "async");
				if (async != undefined && async != "")
					async = de.titus.core.SpecialFunctions.doEvalWithContext(async, dataContext, false);
				
				if (async == "" || async == true || async == "true") {
					//this.onReady((function(aElement, aDataContext){aElement.jstl({data:aDataContext})}).bind(null,aElement, aDataContext));	
					
					this.onReady((function(aElement, aDataContext){
						console.log(aElement, aDataContext);
						setTimeout($.fn.jstl.bind(aElement,{data:aDataContext}), 10);
					}).bind(null,aElement, dataContext));
					return true;
				}				
			}
			
			if (theEvents.onLoad != undefined && typeof theEvents.onLoad === "function")
				theEvents.onLoad(aElement, aDataContext, this);
			
			aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad,[aDataContext, this ]);			
			var processResult = true;
			var result = this.internalExecuteFunction(aElement, dataContext);
			if (result.processChilds) {
				
				var ignoreChilds = aElement.attr(this.config.attributePrefix + "ignore-childs");
				if (ignoreChilds != undefined && ignoreChilds != "")
					ignoreChilds = de.titus.core.SpecialFunctions.doEvalWithContext(ignoreChilds, aDataContext, true);
				else if(ignoreChilds == "")
					ignoreChilds = true;
				else {
					var childprocessing = aElement.attr(this.config.attributePrefix + "processor-child-processing");
					if (childprocessing != undefined && childprocessing != "")
						ignoreChilds = !de.titus.core.SpecialFunctions.doEvalWithContext(childprocessing, aDataContext, true);
					else
						ignoreChilds = false;
				}
				if (ignoreChilds != true && ignoreChilds != "true")
					this.internalComputeChilds(aElement, dataContext);
			}
			
			if (aElement.tagName() == "jstl" && aElement.contents().length > 0)
				aElement.replaceWith(aElement.contents());
			
			if (processResult) {
				if (theEvents.onSuccess != undefined && typeof theEvents.onSuccess === "function")
					theEvents.onSuccess(aElement, aDataContext, this);
				aElement.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, aDataContext);
			} else if (theEvents.onFail != undefined && typeof theEvents.onFail === "function") {
				theEvents.onFail(aElement, aDataContext, this);
				aElement.trigger(de.titus.jstl.Constants.EVENTS.onFail, aDataContext);
			}
			
			if (isRoot) {
				var processor = this;
				$(document).ready(function() {processor.onReady();});
			}
			
			return processResult;
		};
		
		Processor.prototype.isElementProcessable = function(aElement) {
			var tagname = aElement.tagName();
			if (tagname != undefined) {
				if (tagname == "br")
					return false;
				
				return true;
			}
			return false;
		};
		
		Processor.prototype.internalExecuteFunction = /* boolean */function(aElement, aDataContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute internalExecuteFunction(" + aElement + ", " + aDataContext + ")");
			
			var functions = de.titus.jstl.FunctionRegistry.getInstance().functions;
			var result = new de.titus.jstl.FunctionResult();
			for (var i = 0; i < functions.length; i++) {
				var functionObject = functions[i];
				var executeFunction = this.isFunctionNeeded(functionObject, aElement);
				if (executeFunction) {
					var newResult = this.executeFunction(functionObject, aElement, aDataContext, result) || new de.titus.jstl.FunctionResult();
					result.runNextFunction = newResult.runNextFunction && result.runNextFunction;
					result.processChilds = newResult.processChilds && result.processChilds;
					if (!result.runNextFunction)
						return result;
				}
			}
			return result;
		};
		
		Processor.prototype.internalComputeChilds = /* boolean */function(aElement, aDataContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute internalComputeChilds(" + aElement + ", " + aDataContext + ")");
			
			var childs = aElement.children();
			if (childs == undefined)
				return true;
			
			var processor = this;
			var result = true;
			childs.each(function() {
				if (result && !processor.compute($(this), aDataContext))
					result = false;
			});
			
			return result;
			
		};
		
		Processor.prototype.getEvents = function(aElement) {
			var events = {};
			
			var onLoad = aElement.attr(this.config.attributePrefix + "load");
			var onSuccess = aElement.attr(this.config.attributePrefix + "success");
			var onFail = aElement.attr(this.config.attributePrefix + "fail");
			
			if (onLoad != null)
				events.onLoad = this.expressionResolver.resolveExpression(onLoad, {});
			if (onSuccess != null)
				events.onSuccess = this.expressionResolver.resolveExpression(onSuccess, {});
			if (onFail != null)
				events.onFail = this.expressionResolver.resolveExpression(onFail, {});
			
			return events;
		};
		
		Processor.prototype.isFunctionNeeded = function(aFunction, aElement) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute isFunctionNeeded(" + aFunction + ", " + aElement + ")");
			
			var executeFunction = true;
			if (aFunction.attributeName != undefined && aFunction.attributeName != "") {
				var expression = aElement.attr(this.config.attributePrefix + aFunction.attributeName);
				executeFunction = expression !== undefined;
			}
			
			return executeFunction;
		};
		
		Processor.prototype.executeFunction = function(aFunction, aElement, aDataContext, aCurrentFunctionResult) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute executeFunction(" + aFunction + ", " + aElement + ", " + aDataContext + ", " + aCurrentFunctionResult + ")");
			
			var result = aFunction.run(aElement, aDataContext, this);
			if (result != undefined) {
				aCurrentFunctionResult.runNextFunction = aCurrentFunctionResult.runNextFunction && result.runNextFunction;
				aCurrentFunctionResult.processChilds = aCurrentFunctionResult.processChilds && result.processChilds;
			}
			
			return aCurrentFunctionResult;
		};
		
		Processor.prototype.onReady = function(aFunction) {
			if (aFunction) {
				// this.onReadyEvent.push(aFunction);
				this.config.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else {
				for (var i = 0; i < this.onReadyEvent.length; i++) {
					try {
						this.onReadyEvent[i](this.config.element, this);
					} catch (e) {
						Processor.LOGGER.logError("Error by process an on ready event! -> " + (e.message || e));
					}
				}
				
				this.config.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, this);
			}
		};
		
		de.titus.jstl.Processor = Processor;
	});
})(jQuery);
de.titus.core.Namespace.create("de.titus.jstl.Setup", function() {
	de.titus.jstl.Setup = function() {
	};
	
	
	
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.If());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Data());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Include());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Choose());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Foreach());	
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AddAttribute());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Databind());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.Eventbind());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.TextContent());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AttributeContent());
});
de.titus.core.Namespace.create("de.titus.jstl.javascript.polyfills", function() {
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill	


	if (!Array.from) {
	  Array.from = (function () {
	    var toStr = Object.prototype.toString;
	    var isCallable = function (fn) {
	      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
	    };
	    var toInteger = function (value) {
	      var number = Number(value);
	      if (isNaN(number)) { return 0; }
	      if (number === 0 || !isFinite(number)) { return number; }
	      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
	    };
	    var maxSafeInteger = Math.pow(2, 53) - 1;
	    var toLength = function (value) {
	      var len = toInteger(value);
	      return Math.min(Math.max(len, 0), maxSafeInteger);
	    };
	
	    // The length property of the from method is 1.
	    return function from(arrayLike/*, mapFn, thisArg */) {
	      // 1. Let C be the this value.
	      var C = this;
	
	      // 2. Let items be ToObject(arrayLike).
	      var items = Object(arrayLike);
	
	      // 3. ReturnIfAbrupt(items).
	      if (arrayLike == null) {
	        throw new TypeError("Array.from requires an array-like object - not null or undefined");
	      }
	
	      // 4. If mapfn is undefined, then let mapping be false.
	      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
	      var T;
	      if (typeof mapFn !== 'undefined') {
	        // 5. else
	        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
	        if (!isCallable(mapFn)) {
	          throw new TypeError('Array.from: when provided, the second argument must be a function');
	        }
	
	        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
	        if (arguments.length > 2) {
	          T = arguments[2];
	        }
	      }
	
	      // 10. Let lenValue be Get(items, "length").
	      // 11. Let len be ToLength(lenValue).
	      var len = toLength(items.length);
	
	      // 13. If IsConstructor(C) is true, then
	      // 13. a. Let A be the result of calling the [[Construct]] internal method 
	      // of C with an argument list containing the single item len.
	      // 14. a. Else, Let A be ArrayCreate(len).
	      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
	
	      // 16. Let k be 0.
	      var k = 0;
	      // 17. Repeat, while k < len… (also steps a - h)
	      var kValue;
	      while (k < len) {
	        kValue = items[k];
	        if (mapFn) {
	          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
	        } else {
	          A[k] = kValue;
	        }
	        k += 1;
	      }
	      // 18. Let putStatus be Put(A, "length", len, true).
	      A.length = len;
	      // 20. Return A.
	      return A;
	    };
	  }());
	}

});(function($) {
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {
		
		/**
		 * <code>
		 * config: {
		 * "data": dataContext,
		 * "onLoad": function(){},
		 * "onSuccess":function(){},
		 * "onFail": function(){},
		 * "attributePrefix" : "jstl-" 
		 * }
		 * </code>
		 */
		
		$.fn.jstl = function(/* config */aConfig) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aConfig);
				});
			} else {
				var config = {
					"element" : this
				};
				config = $.extend(config, aConfig);
				var processor = new de.titus.jstl.Processor(config);
				processor.compute();
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(/* config */aConfig) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aConfig);
				});
			} else {
				var config = $.extend({"element" : this}, aConfig);
				setTimeout((function(aConfig){
						var processor = new de.titus.jstl.Processor(aConfig);
						processor.compute();
					}).bind(null, config), 10);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));
/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Setup", function(){
		de.titus.form.Setup = {
			prefix : "data-form",
			fieldtypes : {}
		};
	});	
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Constants", function() {
		de.titus.form.Constants.EVENTS = {
		FORM_INITIALIZED : "form-initialized",
		FORM_ACTION_CANCEL : "form-cancel",
		FORM_ACTION_SUBMIT : "form-submit",
		
		FORM_PAGE_INITIALIZED : "form-page-initalized",
		FORM_PAGE_CHANGED : "form-page-changed",
		FORM_PAGE_SHOW : "form-page-show",
		
		FORM_STEP_BACK : "form-step-back",
		FORM_STEP_NEXT : "form-step-next",
		FORM_STEP_SUMMARY : "form-step-summary",
		FORM_STEP_SUMMARY : "form-step-submit",
		
		FIELD_ACTIVE : "form-field-active",
		FIELD_INACTIVE : "form-field-inactive",
		FIELD_VALUE_CHANGED : "form-field-value-changed",
		FIELD_VALID : "form-field-valid",
		FIELD_INVALID : "form-field-invalid"
		};
		
		de.titus.form.Constants.STATE = {
		PAGES : "form-state-pages",
		SUMMARY : "form-state-summary",
		SUBMITED : "form-state-submited",
		};
		
		de.titus.form.Constants.ATTRIBUTE = {
		VALIDATION : "-validation",
		VALIDATION_FAIL_ACTION : "-validation-fail-action",
		CONDITION : "-condition",
		MESSAGE : "-message"
		}
		
	});
})();
(function(){
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Registry", function(){
		de.titus.form.Registry.registFieldController = function(aTypename, aFunction){
			de.titus.form.Setup.fieldtypes[aTypename] = aFunction;
		};
	});	
})();(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Condition", function() {
		var Condition = function(aElement, aDataController, aExpressionResolver) {
			if(Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		Condition.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Condition");
		
		Condition.prototype.doCheck = function(aCallback, callOnlyByChange) {
			if(Condition.LOGGER.isDebugEnabled())
				Condition.LOGGER.logDebug("doCheck()");
				
			var state = false;
			var condition = this.data.element.attr(de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.CONDITION);			
			if(condition != undefined && condition.trim() != ""){
				if(Condition.LOGGER.isDebugEnabled())
					Condition.LOGGER.logDebug("doCheck() -> condition: " + condition);
				
				var data = this.data.dataController.getData();
				if(Condition.LOGGER.isDebugEnabled())
					Condition.LOGGER.logDebug("doCheck() -> data: " + JSON.stringify(data));
				
				var condition = this.data.expressionResolver.resolveExpression(condition, data, false);
				if(typeof condition === "function")
					state = condition(data, this);
				else
					state = condition === true; 
			}
			else			
				state = true;	
			
			if(aCallback == undefined)
				this.data.state = state;
			else if(aCallback != undefined && callOnlyByChange && this.data.state != state){
				this.data.state = state;
				aCallback(this.data.state);
			}
			else if(aCallback != undefined && callOnlyByChange && this.data.state == state){
				this.data.state = state;
			}
			else{
				this.data.state = state;
				aCallback(this.data.state);
			}
			
			return this.data.state;					
		};
		
		de.titus.form.Condition = Condition
	});	
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Field", function() {
		var Field = function(aElement, aDataController, aExpressionResolver) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-field");
			this.data.type = aElement.attr(de.titus.form.Setup.prefix + "-field-type");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.validationHandle = new de.titus.form.Validation(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.messageHandle = new de.titus.form.Message(this.data.element, this.data.dataController, this.data.expressionResolver);
			this.data.firstCall = true;
			this.data.active = undefined;
			this.data.valid = false;
			
			this.init();
		};
		
		Field.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Field");
		
		Field.prototype.init = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("init()");
			
			var initializeFunction = de.titus.form.Setup.fieldtypes[this.data.type] || de.titus.form.Setup.fieldtypes["default"];
			if (initializeFunction == undefined || typeof initializeFunction !== "function")
				throw "The fieldtype \"" + this.data.type + "\" is not available!";

			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Field.prototype.doValueChange.bind(this));
			this.fieldController = initializeFunction(this.data.element);
		};
		
		Field.prototype.doConditionCheck = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doConditionCheck()");
			
			this.data.active = this.data.conditionHandle.doCheck();			
			if (this.data.active)
				this.fieldController.showField(this.data.dataController.getData(this.data.name), this.data.dataController.getData());
			else
				this.setInactiv();			
			
			if (this.data.active) {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);				
			} else {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_ACTIVE);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INACTIVE);
			}
			
			if(this.data.firstCall){
				this.data.firstCall = false;
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);				
			}
			
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doConditionCheck() -> result: " + this.data.active);
			
			this.data.messageHandle.showMessage();
			return this.data.active;
		};
		
		Field.prototype.setInactiv = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("setInactiv()");
			this.data.dataController.changeValue(this.data.name, undefined, this);
			this.fieldController.hideField();
		};
		
		Field.prototype.showSummary = function() {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("showSummary()");
			
			if (!this.data.active)
				return;
			
			this.fieldController.showSummary();
		};
		
		Field.prototype.doValueChange = function(aEvent) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValueChange() -> event type: " + (aEvent != undefined ? aEvent.type : ""));
			
			var value = this.fieldController.getValue();
			if (this.doValidate(value))
				this.data.dataController.changeValue(this.data.name, value, this);
			else
				this.data.dataController.changeValue(this.data.name, undefined, this);
			
			if (aEvent == undefined)
				this.data.element.trigger($.Event(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED));
			else if (aEvent.type != de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED) {
				aEvent.preventDefault();
				aEvent.stopPropagation();
				this.data.element.trigger($.Event(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED));
			}
			
			this.data.messageHandle.showMessage();
		};
		
		Field.prototype.doValidate = function(aValue) {
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name);
			
			this.data.valid = this.data.validationHandle.doCheck(aValue);			
			if (this.data.valid) {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALID);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
			} else {
				this.data.element.trigger(de.titus.form.Constants.EVENTS.FIELD_INVALID);
				this.data.element.removeClass(de.titus.form.Constants.EVENTS.FIELD_VALID);
				this.data.element.addClass(de.titus.form.Constants.EVENTS.FIELD_INVALID);
			}
			
			if (Field.LOGGER.isDebugEnabled())
				Field.LOGGER.logDebug("doValidate() -> field: " + this.data.name + " - result: " + this.data.valid);
			
			return this.data.valid;
		};
		
		de.titus.form.Field = Field;
		
		$.fn.FormularField = function(aDataController) {
			if (this.length == undefined || this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					result.push($(this).FormularField(aDataController));
				});
				return result;
			} else {
				var data = this.data("de.titus.form.Field");
				if (data == undefined) {
					data = new de.titus.form.Field(this, aDataController);
					this.data("de.titus.form.Field", data);
				}
				return data;
			}
		};
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Message", function() {
		var Message = function(aElement, aDataController, aExpressionResolver) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("constructor");
			
			this.data = {
			element : aElement,
			dataController : aDataController,
			expressionResolver : aExpressionResolver
			};
		};
		
		Message.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Message");
		
		Message.prototype.showMessage = function() {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("showMessage()");
			
			var messageAttr = de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.MESSAGE;
			var messages = this.data.element.find("[" + messageAttr + "]");
			messages.removeClass("active");
			var data = this.data.dataController.getData();
			
			for (var i = 0; i < messages.length; i++) {
				var element = $(messages[i]);
				var expression = element.attr(messageAttr);
				if (expression != undefined && expression.trim() != "") {
					if (Message.LOGGER.isDebugEnabled())
						Message.LOGGER.logDebug("showMessage() -> expression: \"" + expression + "\"; data: \"" + JSON.stringify(data) + "\"");
					
					var result = false;
					var result = this.data.expressionResolver.resolveExpression(expression, data, false);
					if (typeof result === "function")
						result = result(data.value, data.data, this) || false;
					else
						result = result === true;
					
					if (Message.LOGGER.isDebugEnabled())
						Message.LOGGER.logDebug("showMessage() -> expression: \"" + expression + "\"; result: \"" + result + "\"");
					
					if (result)
						element.addClass("active");
				}
			}
		};
		
		Message.prototype.doValidate = function(aValue) {
			if (Message.LOGGER.isDebugEnabled())
				Message.LOGGER.logDebug("doValidate()");
			
		};
		
		de.titus.form.Message = Message;
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Validation", function() {
		var Validation = function(aElement, aDataController, aExpressionResolver) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.dataController = aDataController;
			this.data.expressionResolver = aExpressionResolver;
			this.data.state = false;
		};
		
		Validation.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Validation");
		
		Validation.prototype.doCheck = function(aValue) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doCheck()");
			
			this.data.state = this.doValidate(aValue);
			
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doCheck() -> " + this.data.state);
			return this.data.state;
		};
		
		Validation.prototype.doValidate = function(aValue) {
			if (Validation.LOGGER.isDebugEnabled())
				Validation.LOGGER.logDebug("doValidate()");
			
			var validationAttr = de.titus.form.Setup.prefix + de.titus.form.Constants.ATTRIBUTE.VALIDATION;
			var validationElements = this.data.element.find("[" + validationAttr + "]");
			validationElements.removeClass("active");
			var data = {
			value : aValue,
			data : this.data.dataController.getData()
			};
			
			for (var i = 0; i < validationElements.length; i++) {
				var element = $(validationElements[i]);
				var validation = element.attr(validationAttr);
				if (validation != undefined && validation.trim() != "") {
					if (Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("doCheck() -> expression: \"" + validation + "\"; data: \"" + JSON.stringify(data) + "\"");
					
					var result = false;
					var result = this.data.expressionResolver.resolveExpression(validation, data, false);
					if (typeof result === "function")
						result = result(data.value, data.data, this) || false;
					else
						result = result === true;
					
					if (Validation.LOGGER.isDebugEnabled())
						Validation.LOGGER.logDebug("doCheck() -> expression: \"" + validation + "\"; result: \"" + result + "\"");
					
					if (result) {
						element.addClass("active");
						return false;
					}
				}
			}
			
			return true;
		};
		
		de.titus.form.Validation = Validation;
	});
})();
(function() {
    "use strict";
    de.titus.core.Namespace.create("de.titus.form.DataController", function() {
	var DataController = function() {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("constructor");

	    this.data = {};
	};

	DataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataController");

	DataController.prototype.getData = function(aName) {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("getData() -> aName: " + aName);

	    if (aName) {
		var names = aName.split(".");
		var data = this.data;
		for (var i = 0; i < (names.length - 1); i++) {
		    if (data[names[i]] != undefined) {
			data = data[names[i]];
		    }
		}
		return data;
	    } else
		return this.data;
	};

	DataController.prototype.changeValue = function(aName, aValue, aField) {
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("changeValue()");

	    var names = aName.split(".");
	    var data = this.data;
	    for (var i = 0; i < (names.length - 1); i++) {
		if (data[names[i]] == undefined) {
		    data[names[i]] = {};
		}
		data = data[names[i]];
	    }
	    data[names[names.length - 1]] = aValue;
	    
	    if (DataController.LOGGER.isDebugEnabled())
		DataController.LOGGER.logDebug("changeValue() -> data: " + JSON.stringify(this.data));
	};

	de.titus.form.DataController = DataController;
    });
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DataControllerProxy", function() {
		var DataControllerProxy = function(aDataController, aName) {
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("constructor");
			this.name = aName;
			this.dataController = aDataController;
		};
		
		DataControllerProxy.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DataControllerProxy");
		
		DataControllerProxy.prototype.getData = function(aName){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("getData() -> aName: " + aName);
				
			return this.dataController.getData(aName);
		};
		
		DataControllerProxy.prototype.changeValue = function(aName, aValue, aField){
			if(DataControllerProxy.LOGGER.isDebugEnabled())
				DataControllerProxy.LOGGER.logDebug("changeValue()");			
			
			this.dataController.changeValue(this.name != undefined ? this.name + "." + aName : aName, aValue, aField);
		};	
		
		de.titus.form.DataControllerProxy = DataControllerProxy;
	});	
})();
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ListFieldDataController", function() {
		var ListFieldDataController = function(aDataController, aName) {
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("constructor");
			this.name = aName;
			this.internalDataController = new de.titus.form.DataController();
			this.dataController = aDataController;
		};
		
		ListFieldDataController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ListFieldDataController");
		
		ListFieldDataController.prototype.getData = function(aName){
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("getData() -> aName: " + aName);
			
			if(aName != undefined){
				var data = this.dataController.getData();
				data = $.extend(data, this.internalDataController.getData());
				return data;
			}
			else {
				var value= this.internalDataController.getData(aName);
				if(value == undefined)
					return this.dataController.getData(aName);
				else
					return value;
			}			
		};
		
		ListFieldDataController.prototype.changeValue = function(aName, aValue, aField){
			if(ListFieldDataController.LOGGER.isDebugEnabled())
				ListFieldDataController.LOGGER.logDebug("changeValue()");			
			
			this.internalDataController.changeValue(aName, aValue, aField);
		};	
		
		de.titus.form.ListFieldDataController = ListFieldDataController;
	});	
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Formular", function() {
		var Formular = function(aElement) {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix);
			this.data.pages = [];
			this.data.dataController = new de.titus.form.DataController();
			this.data.stepControl = undefined;
			this.data.currentPage = -1;
			this.data.state = de.titus.form.Constants.STATE.PAGES;
			this.expressionResolver = new de.titus.core.ExpressionResolver();
			this.init();
		};
		
		Formular.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Formular");
		
		Formular.prototype.init = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("init()");
			
			if (this.data.element.is("form"))
				this.data.element.on("submit", function(aEvent) {
					aEvent.preventDefault();
					aEvent.stopPropagation();
				});

			this.initAction();
			this.data.stepPanel = new de.titus.form.StepPanel(this);
			this.data.stepControl = new de.titus.form.StepControl(this);
			this.initEvents();
			this.initPages();
			
		};
		
		Formular.prototype.initAction = function() {
			var initAction = this.data.element.attr("data-form-init");
			if (initAction != undefined && initAction != "") {
				var data = this.expressionResolver.resolveExpression(initAction, this.data, undefined);
				if (typeof data === "function")
					data = data(this.data.element, this);
				
				if (typeof data === "object")
					this.data.dataController.data = data;
			}
		};
		
		Formular.prototype.initPages = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("initPages()");
			
			var pageElements = this.data.element.find("[" + de.titus.form.Setup.prefix + "-page" + "]");
			if (pageElements.length == 0) {
				var page = this.data.element.FormularPage(this.data.dataController, this.expressionResolver);
				page.data.number = 1;
				this.data.pages.push(page);
			} else {
				for (var i = 0; i < pageElements.length; i++) {
					var page = $(pageElements[i]).FormularPage(this.data.dataController);
					page.data.number = (i + 1);
					this.data.pages.push(page);
					page.hide();
				}
			}
			
			var page = de.titus.form.PageUtils.findNextPage(this.data.pages, -1);
			page.show();
			this.data.currentPage = page.data.number - 1;
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.initEvents = function() {
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_ACTIVE, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_INACTIVE, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALID, Formular.prototype.valueChanged.bind(this));
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_INVALID, Formular.prototype.valueChanged.bind(this));
		};
		
		Formular.prototype.valueChanged = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("valueChanged()");
			
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.doValidate = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("doValidate()");
			
			for (var i = 0; i < this.data.pages.length; i++)
				if (this.data.pages[i].data.active && !this.data.pages[i].doValidate())
					return false;
			
			return true;
		};
		
		Formular.prototype.showSummary = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("showSummary()");
			
			for (var i = 0; i < this.data.pages.length; i++)
				if (this.data.pages[i].data.active)
					this.data.pages[i].showSummary();
			
			this.data.state = de.titus.form.Constants.STATE.SUMMARY;
			this.data.stepPanel.update();
			this.data.stepControl.update();
		};
		
		Formular.prototype.getCurrentPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("currentPage() -> current index: " + this.data.currentPage);
			
			return this.data.pages[this.data.currentPage];
		};
		
		Formular.prototype.prevPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("prevPage()");
			
			if (this.data.state == de.titus.form.Constants.STATE.SUBMITED)
				return;
			else if (this.data.state == de.titus.form.Constants.STATE.SUMMARY) {
				this.data.state = de.titus.form.Constants.STATE.PAGES;
				for (var i = 0; i < this.data.pages.length; i++)
					if (i != this.data.currentPage)
						this.data.pages[i].hide();
				
				this.data.pages[this.data.currentPage].show();
				
				this.data.stepPanel.update();
				this.data.stepControl.update();
				
			} else if (this.data.currentPage > 0) {
				this.data.pages[this.data.currentPage].hide();
				var page = de.titus.form.PageUtils.findPrevPage(this.data.pages, this.data.currentPage);
				this.data.currentPage = page.data.number - 1;
				this.data.pages[this.data.currentPage].show();
				this.data.state = de.titus.form.Constants.STATE.PAGES;
				this.data.stepPanel.update();
				this.data.stepControl.update();
			}
			
		};
		
		Formular.prototype.nextPage = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("nextPage()");
			
			if (this.data.currentPage < (this.data.pages.length - 1)) {
				if (!this.data.pages[this.data.currentPage].doValidate())
					return;
				
				var page = de.titus.form.PageUtils.findNextPage(this.data.pages, this.data.currentPage);
				if (page != undefined) {
					this.data.state = de.titus.form.Constants.STATE.PAGES;
					this.data.pages[this.data.currentPage].hide();
					this.data.currentPage = page.data.number - 1;
					this.data.pages[this.data.currentPage].show();
					this.data.stepPanel.update();
					this.data.stepControl.update();
					return;
				}
			} else {
				this.data.state = de.titus.form.Constants.STATE.SUMMARY;
				this.showSummary();
				this.data.stepPanel.update();
				this.data.stepControl.update();
			}
		};
		
		Formular.prototype.submit = function() {
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit()");
			
			this.data.state = de.titus.form.Constants.STATE.SUBMITED;
			this.data.stepPanel.update();
			this.data.stepControl.update();
			var data = this.data.dataController.getData();
			if (Formular.LOGGER.isDebugEnabled())
				Formular.LOGGER.logDebug("submit() -> data: " + JSON.stringify(data));
			
			var action = this.data.element.attr("data-form-submit");
			if (action != undefined && action != "") {
				if (Formular.LOGGER.isDebugEnabled())
					Formular.LOGGER.logDebug("submit() -> use a submit action!");
				var data = this.expressionResolver.resolveExpression(action, data, undefined);
				if (typeof data === "function")
					data(form);
			} else {
				if (Formular.LOGGER.isDebugEnabled())
					Formular.LOGGER.logDebug("submit() -> use a default ajax!");
				
				var action = this.data.element.attr("action");
				var method = this.data.element.attr("method") || "post";
				var contentType = this.data.element.attr("enctype") || "application/json";
				
				var request = {
				"url" : action,
				"type" : method,
				"contentType" : contentType,
				"data" : contentType == "application/json" ? JSON.stringify(data) : data
				};
				// TODO Response processing
				$.ajax(request);
			}
		};
		
		de.titus.form.Formular = Formular;
	});
	
	$.fn.Formular = function() {
		if (this.length == undefined || this.length == 0)
			return;
		else if (this.length > 1) {
			var result = [];
			this.each(function() {
				result.push($(this).Formular());
			});
			return result;
		} else {
			var data = this.data("Formular");
			if (data == undefined) {
				data = new de.titus.form.Formular(this);
				this.data("Formular", data);
			}
			return data;
		}
	};
	
	$(document).ready(function() {
		$('[data-form]').Formular();
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.Page", function() {
		var Page = function(aElement, aDataController, aExpressionResolver) {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("constructor");
			this.data = {};
			this.data.number = undefined;
			this.data.element = aElement;
			this.data.name = aElement.attr(de.titus.form.Setup.prefix + "-page");
			this.data.step = aElement.attr(de.titus.form.Setup.prefix + "-step");
			this.data.expressionResolver = aExpressionResolver || new de.titus.core.ExpressionResolver();
			this.data.dataController = aDataController;
			this.data.conditionHandle = new de.titus.form.Condition(this.data.element,this.data.dataController,this.data.expressionResolver);
			this.data.fieldMap = {};
			this.data.fields = [];
			this.data.active = false;
			
			this.init();
		};
		
		Page.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.Page");
		
		Page.prototype.init = function() {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("init()");
			
			this.data.element.on(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED, Page.prototype.valueChangeListener.bind(this));
			this.initFields(this.data.element);
		};
		
		Page.prototype.valueChangeListener = function(aEvent) {
			for(var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].doConditionCheck();
		};
		

		Page.prototype.initFields = function(aElement) {
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("initFields()");
			
			if (aElement.attr(de.titus.form.Setup.prefix + "-field") != undefined) {
				var field = aElement.FormularField(this.data.dataController, this.data.expressionResolver);
				this.data.fieldMap[field.name] = field;
				this.data.fields.push(field);
			} else {
				var children = aElement.children();
				for (var i = 0; i < children.length; i++) {
					this.initFields($(children[i]));
				}
			}
		};
		
		
		Page.prototype.checkCondition = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("checkCondition()");
			
			this.data.active = this.data.conditionHandle.doCheck();
			if(!this.data.active)
				for(var i = 0; i < this.data.fields.length; i++)
					this.data.fields[i].setInactiv();
			
			return this.data.active;
		};		
		
		Page.prototype.show = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("show()");
			
			for(var i = 0; i < this.data.fields.length; i++)
				this.data.fields[i].doConditionCheck();
			
			this.data.element.show();
		};
		
		Page.prototype.hide = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("hide()");
			
			this.data.element.hide();
		};
		
		Page.prototype.showSummary = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("showSummary()");
			
			if(!this.data.active)
				return;
			
			this.show();
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.active)
					this.data.fields[i].showSummary();
		};
		
		Page.prototype.doValidate = function(){
			if(Page.LOGGER.isDebugEnabled())
				Page.LOGGER.logDebug("doValidate()");
			
			for(var i = 0; i < this.data.fields.length; i++)
				if(this.data.fields[i].data.active && !this.data.fields[i].data.valid)
					return false;
			
			return true;
		};
		
		de.titus.form.Page = Page;
		
		$.fn.FormularPage = function(aDataController) {
			if (this.length == undefined || this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					result.push($(this).FormularPage(aDataController));
				});
				return result;
			} else {
				var data = this.data("de.titus.form.Page");
				if (data == undefined) {
					data = new Page(this, aDataController);
					this.data("de.titus.form.Page", data);
				}
				return data;
			}
		};
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.PageUtils", function() {
		var PageUtils = {};		
		PageUtils.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.PageUtils");
		
		PageUtils.findPrevPage = function(thePages, aCurrentIndex){
			if(PageUtils.LOGGER.isDebugEnabled())
				PageUtils.LOGGER.logDebug("findPrevPage() -> aCurrentIndex: " + aCurrentIndex);
			
			for(var i = (aCurrentIndex - 1); i >= 0; i--){
				PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a previous page!";
		}
		
		PageUtils.findNextPage = function(thePages, aCurrentIndex){
			if(PageUtils.LOGGER.isDebugEnabled())
				PageUtils.LOGGER.logDebug("findNextPage() -> aCurrentIndex: " + aCurrentIndex );
			
			for(var i = (aCurrentIndex + 1); i < thePages.length; i++){
				PageUtils.LOGGER.logDebug(i);
				var page = thePages[i];
				if(page.checkCondition())
					return page;
			}
			
			throw "Can't evaluate a next page!";
		}
		de.titus.form.PageUtils = PageUtils;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepControl", function() {
		var StepControl = function(aForm) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-control" + "]");
			this.data.stepControlBack = undefined;
			this.data.stepControlNext = undefined;
			this.data.stepControlSummary = undefined;
			this.data.stepControlSubmit = undefined;
			this.data.form = aForm;
			this.init();
		};
		
		StepControl.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepControl");
		
		StepControl.prototype.init = function() {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("init()");
			
			this.data.stepControlBack = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-back" + "]");
			this.data.stepControlBack.hide();
			this.data.stepControlBack.on("click", StepControl.prototype.__StepBackHandle.bind(this));
			
			this.data.stepControlNext = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-next" + "]");
			this.data.stepControlNext.on("click", StepControl.prototype.__StepNextHandle.bind(this));
			
			this.data.stepControlSummary = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-summary" + "]");
			this.data.stepControlSummary.hide();
			this.data.stepControlSummary.on("click", StepControl.prototype.__StepSummaryHandle.bind(this));
			
			this.data.stepControlSubmit = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step-submit" + "]");
			this.data.stepControlSubmit.hide();
			this.data.stepControlSubmit.on("click", StepControl.prototype.__StepSubmitHandle.bind(this));
		};
		
		StepControl.prototype.update = function() {
			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED) {
				this.data.element.hide();
				return;
			} else {
							
				if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
					var page = this.data.form.getCurrentPage();
					if (page && page.doValidate())
						this.data.stepControlNext.show();
					else
						this.data.stepControlNext.hide();
					
					this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.PAGES) {
					var page = this.data.form.getCurrentPage();
					this.data.stepControlNext.hide();
					if (page && page.doValidate())
						this.data.stepControlSummary.show();
					else
						this.data.stepControlSummary.hide();
					this.data.stepControlSubmit.hide();
				} else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY) {
					this.data.stepControlNext.hide();
					this.data.stepControlSummary.hide();
					if(this.data.form.doValidate())
						this.data.stepControlSubmit.show();
					else
						this.data.stepControlSubmit.hide();
				}
			}
			
			if (this.data.form.data.currentPage > 0)
				this.data.stepControlBack.show();
			else
				this.data.stepControlBack.hide();
		};
		
		StepControl.prototype.__StepBackHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepBackHandle()");
			
			if (this.data.form.data.currentPage > 0) {
				this.data.form.prevPage();
			}
		};
		
		StepControl.prototype.__StepNextHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepNextHandle()");
			
			if ((this.data.form.data.pages.length - 1) > this.data.form.data.currentPage) {
				this.data.form.nextPage();
			}
		};
		
		StepControl.prototype.__StepSummaryHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepSummaryHandle()");
			
			this.data.form.showSummary();
		};
		
		StepControl.prototype.__StepSubmitHandle = function(aEvent) {
			if (StepControl.LOGGER.isDebugEnabled())
				StepControl.LOGGER.logDebug("__StepSubmitHandle()");
			
			this.data.form.submit();
		};
		
		de.titus.form.StepControl = StepControl;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.StepPanel", function() {
		var StepPanel = function(aForm) {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("constructor");
			
			this.data = {};
			this.data.element = aForm.data.element.find("[" + de.titus.form.Setup.prefix + "-step-panel" + "]");
			this.data.stepPanel = undefined;
			this.data.stepPanelSummaryState = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + de.titus.form.Constants.STATE.SUMMARY + "']");
			this.data.stepPanelSubmitedState = this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + de.titus.form.Constants.STATE.SUBMITED + "']");
			this.data.form = aForm;
			this.init();
		};
		
		StepPanel.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.StepPanel");
		
		StepPanel.prototype.init = function() {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("init()");
			
		};
		
		StepPanel.prototype.update = function() {
			if (StepPanel.LOGGER.isDebugEnabled())
				StepPanel.LOGGER.logDebug("update()");
			this.data.element.find(".active").removeClass("active")

			if (this.data.form.data.state == de.titus.form.Constants.STATE.SUMMARY && this.data.stepPanelSummaryState != undefined)
				this.data.stepPanelSummaryState.addClass("active");
			else if (this.data.form.data.state == de.titus.form.Constants.STATE.SUBMITED && this.data.stepPanelSubmitedState != undefined)
				this.data.stepPanelSubmitedState.addClass("active");
			else {
				var page = this.data.form.getCurrentPage();
				if (page)
					this.data.element.find("[" + de.titus.form.Setup.prefix + "-step='" + page.data.step + "']").addClass("active");
			}
		};
		
		de.titus.form.StepPanel = StepPanel;
	});
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ContainerFieldController", function() {
		de.titus.form.ContainerFieldController = function(aElement) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			
			this.init();
		};
		de.titus.form.ContainerFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ContainerFieldController");
		
		de.titus.form.ContainerFieldController.prototype.init = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("init()");
			
		};		

		de.titus.form.ContainerFieldController.prototype.showField = function(aData) {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		de.titus.form.ContainerFieldController.prototype.showSummary = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("showSummary()");
						
		};
		
		de.titus.form.ContainerFieldController.prototype.hideField = function() {
			if (de.titus.form.ContainerFieldController.LOGGER.isDebugEnabled())
				de.titus.form.ContainerFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		de.titus.form.ContainerFieldController.prototype.getValue = function() {
			
		};
		
		de.titus.form.Registry.registFieldController("container", function(aElement, aFieldname, aValueChangeListener) {
			return new de.titus.form.ContainerFieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.DefaultFieldController", function() {
		var DefaultFieldController = function(aElement) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.input = undefined;
			this.type = undefined;
			this.filedata = undefined;
			this.timeoutId == undefined;
			this.init();
		};
		DefaultFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.DefaultFieldController");
		
		DefaultFieldController.prototype.valueChanged = function(aEvent) {
			aEvent.preventDefault();
			this.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
		};
		
		DefaultFieldController.prototype.init = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init()");
			
			if (this.element.find("select").length == 1) {
				this.type = "select";
				this.element.find("select").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
			} else {
				if (this.element.find("input[type='radio']").length > 0) {
					this.type = "radio";
					this.element.find("input[type='radio']").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
				}
				if (this.element.find("input[type='checkbox']").length > 0) {
					this.type = "checkbox";
					this.element.find("input[type='checkbox']").on("change", DefaultFieldController.prototype.valueChanged.bind(this));
				} else if (this.element.find("input[type='file']").length == 1) {
					this.type = "file";
					this.element.find("input[type='file']").on("change", DefaultFieldController.prototype.readFileData.bind(this));
				} else {
					this.type = "text";
					this.element.find("input, textarea").on("keyup change", (function(aEvent) {
						if (this.timeoutId != undefined) {
							window.clearTimeout(this.timeoutId);
						}
						
						this.timeoutId = window.setTimeout((function() {
							this.valueChanged(aEvent);
						}).bind(this), 300);
						
					}).bind(this));
				}
				
			}
			
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("init() -> detect type: " + this.type);
		};
		
		DefaultFieldController.prototype.readFileData = function(aEvent) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("readFileData()");
			
			var input = aEvent.target;
			var multiple = input.files.length > 1;
			if (multiple)
				this.fileData = [];
			else
				this.fileData = undefined;
			
			var $__THIS__$ = this;
			var reader = new FileReader();
			var count = input.files.length;
			reader.addEventListener("load", function() {
				if (DefaultFieldController.LOGGER.isDebugEnabled())
					DefaultFieldController.LOGGER.logDebug("readFileData() -> reader load event!");
				
				count--;
				if (multiple)
					$__THIS__$.fileData.push(reader.result);
				else
					$__THIS__$.fileData = reader.result;
				
				if (count == 0)
					$__THIS__$.element.trigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
			}, false);
			
			var textField = this.element.find("input[type='text'][readonly]");
			if (textField.length == 1)
				textField.val("");
			for (var i = 0; i < input.files.length; i++) {
				reader.readAsDataURL(input.files[i]);
				if (textField.length == 1)
					textField.val(textField.val() != "" ? textField.val() + ", " + input.files[i].name : input.files[i].name);
			}
		};
		
		DefaultFieldController.prototype.showField = function(aValue, aData) {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("showField()");
			
			if (this.type == "select")
				this.element.find("select").prop("disabled", false);
			else
				this.element.find("input, textarea").prop("disabled", false);
			this.element.show();
		};
		
		DefaultFieldController.prototype.showSummary = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("showSummary()");
			
			if (this.type == "select")
				this.element.find("select").prop("disabled", true);
			else
				this.element.find("input, textarea").prop("disabled", true);
			
		};
		
		DefaultFieldController.prototype.hideField = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		DefaultFieldController.prototype.getValue = function() {
			if (DefaultFieldController.LOGGER.isDebugEnabled())
				DefaultFieldController.LOGGER.logDebug("getValue()");
			
			if (this.type == "select")
				return this.element.find("select").val();
			else if (this.type == "radio")
				return this.element.find("input:checked").val();
			else if (this.type == "checkbox") {
				var result = [];
				this.element.find("input:checked").each(function() {
					result.push($(this).val());
				});
				return result;
			} else if (this.type == "file")
				return this.fileData;
			else
				return this.element.find("input, textarea").first().val();
		};
		
		de.titus.form.Registry.registFieldController("default", function(aElement, aFieldname, aValueChangeListener) {
			return new DefaultFieldController(aElement, aFieldname, aValueChangeListener);
		});
		
		de.titus.form.DefaultFieldController = DefaultFieldController;
	});
})();
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.form.ListFieldController", function() {
		var ListFieldController = function(aElement) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			this.template = this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-template]");
			this.content = this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-content]");
			this.listFields = [];
			
			
			this.init();
		};
		ListFieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.form.ListFieldController");
		
		ListFieldController.prototype.init = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("init()");
			this.element.find("[" + de.titus.form.Setup.prefix + "-field-list-add-action]").on("click", ListFieldController.prototype.addAction.bind(this));
		};
		
		ListFieldController.prototype.addAction = function(aEvent) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("addAction()");
			
			var dataController = new de.titus.form.ListFieldDataController(this.element.FormularField().data.dataController);
			
			
			var newRow = this.template.clone();
			console.log(newRow);
			newRow.removeAttr(de.titus.form.Setup.prefix + "-field-list-template");
			newRow.attr(de.titus.form.Setup.prefix + "-field-list-row", "");
			
			this.content.append(newRow);
			newRow.find("[" + de.titus.form.Setup.prefix + "-field]").FormularField(dataController);
			this.listFields.push(dataController);
		};		

		ListFieldController.prototype.showField = function(aData) {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("showField()");
			
			this.element.show();
		};
		
		ListFieldController.prototype.hideField = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("hideField()");
			
			this.element.hide()
		};
		
		ListFieldController.prototype.showSummary = function() {
			if (ListFieldController.LOGGER.isDebugEnabled())
				ListFieldController.LOGGER.logDebug("showSummary()");
						
		};
		
		ListFieldController.prototype.getValue = function() {
			var result = [];
			for(var i = 0; i < this.listFields.length; i++)
				result.push(this.listFields[i].internalDataController.getData());
			
			return result;
		};
		
		de.titus.form.ListFieldController = ListFieldController; 
		
		de.titus.form.Registry.registFieldController("list", function(aElement, aFieldname, aValueChangeListener) {
			return new ListFieldController(aElement, aFieldname, aValueChangeListener);
		});
	});
})();
(function() {
	de.titus.core.Namespace.create("template.FieldController", function() {
		template.FieldController = function(aElement) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("constructor");
			
			this.element = aElement;
			/*
			 * Every time if your field make a value change trigger the
			 * following jquery event on this.element:
			 * 
			 * this.element.tigger(de.titus.form.Constants.EVENTS.FIELD_VALUE_CHANGED);
			 */

		};
		template.FieldController.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("template.FieldController");
		
		template.FieldController.prototype.showField = function(aValue, aData) {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showField()");
			
			/*
			 * make your field visible aValue -> a Preseted value aData -> the
			 * data object from all of the formular
			 * 
			 * This function would be called every time, if your field need to display
			 */

			this.element.show();
		};
		
		template.FieldController.prototype.hideField = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("hideField()");
			
			// hide this field
			
			this.element.hide()
		};
		
		template.FieldController.prototype.showSummary = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("showSummary() -> isSummary: " + isSummery);
			
			// show your field as summary
		};
		
		template.FieldController.prototype.getValue = function() {
			if (template.FieldController.LOGGER.isDebugEnabled())
				template.FieldController.LOGGER.logDebug("getValue() -> " + JSON.stringify(this.employee));
			
			// return field value
			
			return "[value]";
		};
		
		de.titus.form.Registry.registFieldController("[my-costum-field-type]", function(aElement, aFieldname, aValueChangeListener) {
			// registrate field type + function to create the field controller
			return new template.FieldController(aElement, aFieldname, aValueChangeListener);
		});
		
	});
})($);

de.titus.core.Namespace.create("de.titus.jquery.plugins", function() {	
	
});
/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


