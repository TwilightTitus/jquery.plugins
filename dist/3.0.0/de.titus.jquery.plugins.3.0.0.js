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
de.titus.core = de.titus.core || {
	Version : "1.8.4"
};
if (de.titus.core.Namespace == undefined) {
	de.titus.core.Namespace = {};
	/**
	 * creates a namespace and run the function, if the Namespace new
	 * 
	 * @param aNamespace
	 *            the namespace(requiered)
	 * @param aFunction
	 *            a function that be executed, if the namespace created
	 *            (optional)
	 * 
	 * @returns boolean, true if the namespace created
	 */
	de.titus.core.Namespace.create = function(aNamespace, aFunction) {
		var namespaces = aNamespace.split(".");
		var currentNamespace = window || global;
		for (var i = 0; i < namespaces.length; i++) {
			if (currentNamespace[namespaces[i]] == undefined)
				currentNamespace[namespaces[i]] = {};
			currentNamespace = currentNamespace[namespaces[i]];			
		}
		aFunction();
	};
};de.titus.core.Namespace.create("de.titus.core.SpecialFunctions", function() {
	
	var SpecialFunctions = de.titus.core.SpecialFunctions = {
	    doEval : function(aStatement, aContext, aCallback) {
		    if (aCallback)
		    	SpecialFunctions.doEvalWithContext(aStatement, (aContext || {}), undefined, aCallback);
		    else {
			    if (typeof aStatement !== "string")
				    return aStatement;
			    else {
				    var result = undefined;
				    var runContext = aContext || {};
				    with (runContext) {
					    try {
						    eval("result = " + aStatement + ";");
					    } catch (e) {
						    if (!console)
							    return;
						    else if (console.error)
							    console.error("de.titus.core.SpecialFunctions.doEval ***Error*** expression: " + aStatement + ": ", e);
						    else if (console.log)
							    console.log("de.titus.core.SpecialFunctions.doEval ***Error*** expression: " + aStatement + ": ", e);
						    return undefined;
					    }
				    }
				    return result;
			    }
			    
			    return undefined;
		    }
	    },
	    
	    /**
		 * 
		 * @param aStatement
		 * @param aContext
		 * @param aDefault
		 * @param aCallback
		 * @returns
		 */
	    doEvalWithContext : function(aStatement, aContext, aDefault, aCallback) {
		    if (typeof aCallback === "function") {
			    window.setTimeout(function() {
				    var result = SpecialFunctions.doEvalWithContext(aStatement, aContext, aDefault, undefined);
				    aCallback(result, aContext);
			    }, 1);
			    
		    } else
			    try {
				    var result = SpecialFunctions.doEval(aStatement, aContext);
				    if (result == undefined)
					    return aDefault;
				    return result;
			    } catch (e) {
				    return aDefault;
			    }
	    }
	};
	
});
(function($) {
	de.titus.core.Namespace.create("de.titus.core.jquery.Components",
			function() {
				var Components = de.titus.core.jquery.Components = {};
				Components.asComponent = function(aName, aConstructor) {
					$.fn[Components.__buildFunctionName(aName)] = function(
							aData) {
						return Components.__createInstance(this, aName,
								aConstructor, aData);
					};
				};

				Components.__buildFunctionName = function(aName) {
					return aName.replace(/\./g, "_");
				};

				Components.__createInstance = function(aElement, aName,
						aConstructor, aData) {
					if (aElement.length == 0)
						return;
					else if (aElement.length > 1) {
						var result = [];
						aElement.each(function() {
							result.push($(this).de_titus_Typeahead(aData));
						});
						return result;
					} else {
						var component = aElement.data(aName);
						if (!component) {
							component = new aConstructor(aElement, aData);
							aElement.data(aName, component);
						}

						return component;
					}
				}

			});
})($);
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
(function() {
    "use strict";
    de.titus.core.Namespace.create("de.titus.core.ArrayUtils", function() {
	var ArrayUtils = de.titus.core.ArrayUtils = {
	    
	}
    });
})($);
(function() {
	"use strict";
	de.titus.core.Namespace.create("de.titus.core.PagingUtils", function() {
		var PagingUtils = de.titus.core.PagingUtils = {
		    pagerData : function(aPage, aPages, aSize) {
			    var half = Math.round(aPages / 2);
			    var result = {
			        firstPage : 1,
			        startPage : 1,
			        endPage : aSize,
			        lastPage : aPages,
			        current : aPage,
			        pageCount : aPages
			    };
			    if (aSize > aPages)
				    result.endPage = aPages;
			    else if (aPage + half > aPages) {
				    result.endPage = aPages;
				    result.startPage = (end - aSize) + 1;
			    } else if (aPage - half > 1) {
				    result.endPage = (aPage + half);
				    result.startPage = (end - aSize) + 1;
			    }
			    result.count = result.endPage - result.startPage;
			    return result;
		    },
		    
		    pageArray : function(aPage, aSize, aArray) {
			    return aArray.slice((aPage - 1) * aSize, aSize);
		    }
		
		}
	});
})($);
de.titus.core.Namespace.create("de.titus.core.regex.Matcher", function() {
	var Matcher = de.titus.core.regex.Matcher = function(/* RegExp */aRegExp, /* String */aText) {
		this.internalRegex = aRegExp;
		this.processingText = aText;
		this.currentMatch = undefined;
	}

	Matcher.prototype.isMatching = /* boolean */function() {
		return this.internalRegex.test(this.processingText);
	};
	
	Matcher.prototype.next = /* boolean */function() {
		this.currentMatch = this.internalRegex.exec(this.processingText);
		if (this.currentMatch != undefined) {
			this.processingText = this.processingText.replace(this.currentMatch[0], "");
			return true;
		}
		return false;
	};
	
	Matcher.prototype.getMatch = /* String */function() {
		if (this.currentMatch != undefined)
			return this.currentMatch[0];
		return undefined;
	};
	
	Matcher.prototype.getGroup = /* String */function(/* int */aGroupId) {
		if (this.currentMatch != undefined)
			return this.currentMatch[aGroupId];
		return undefined;
	};
	
	Matcher.prototype.replaceAll = /*String*/ function(/* String */aReplaceValue, /* String */aText) {
		if (this.currentMatch != undefined)
			return aText.replace(this.currentMatch[0], aReplaceValue);
		return aText;
	};
});

de.titus.core.Namespace.create("de.titus.core.regex.Regex", function() {
	
	var Regex = de.titus.core.regex.Regex = function(/* String */aRegex, /* String */aOptions) {
		this.internalRegex = new RegExp(aRegex, aOptions);
	};
	
	Regex.prototype.parse = /* de.titus.core.regex.Matcher */function(/* String */aText) {
		return new de.titus.core.regex.Matcher(this.internalRegex, aText);
	};
});
de.titus.core.Namespace.create("de.titus.core.ExpressionResolver", function() {
	
	var ExpressionResolver = de.titus.core.ExpressionResolver = function(varRegex) {
		this.regex = new de.titus.core.regex.Regex(varRegex || de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX);
	};
	
	/**
	 * static variables
	 */
	ExpressionResolver.TEXT_EXPRESSION_REGEX = "\\$\\{([^\\$\\{\\}]*)\\}";
	
	/**
	 * @param aText
	 * @param aDataContext
	 * @param aDefaultValue
	 * 
	 * @returns
	 */
	ExpressionResolver.prototype.resolveText = function(aText, aDataContext, aDefaultValue) {
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
	ExpressionResolver.prototype.resolveExpression = function(aExpression, aDataContext, aDefaultValue) {
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
	ExpressionResolver.prototype.internalResolveExpression = function(aExpression, aDataContext, aDefaultValue) {
		try {
			return de.titus.core.SpecialFunctions.doEvalWithContext(aExpression, aDataContext, aDefaultValue);			
		} catch (e) {
			return aDefaultValue;
		}
	};
	
});
(function($) {
	de.titus.core.Namespace.create("de.titus.core.URL", function() {
		var URL = de.titus.core.URL = function(aProtocol, aDomain, aPort, aPath, theParameter, aMarker) {
			
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
		
		URL.prototype.getParameter = function(aKey) {
			var value = this.getParameters()[aKey];
			if (value == undefined)
				return undefined;
			if (value.length > 1)
				return value;
			else
				return value[0];
		};
		
		URL.prototype.getParameters = function(aKey) {
			return this.getParameters()[aKey];
		};
		
		URL.prototype.addParameter = function(aKey, aValue, append) {
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
		
		URL.prototype.getQueryString = function() {
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
		
		URL.prototype.asString = function() {
			var result = this.getProtocol() + "://" + this.getDomain() + ":" + this.getPort();
			
			if (this.getPath() != undefined)
				result = result + this.getPath();
			
			if (this.getMarker() != undefined)
				result = result + "#" + this.getMarker();
			
			result = result + this.getQueryString();
			
			return result;
		};
		
		URL.prototype.toString = function() {
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
		
		var Page = de.titus.core.Page = function() {
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
		Page.CSSTEMPLATE = '<link rel="stylesheet" type="text/css"/>';
		Page.JSTEMPLATE = '<script type="text/javascript"></script>';
		
		Page.prototype.addJsFile = function(aUrl, aFunction, forceFunction) {
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
		
		Page.prototype.addJsFiles = function(aUrls, aFunction, forceFunction) {
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
		
		Page.prototype.addCssFile = function(aUrl) {
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
		
		Page.prototype.addCssFiles = function(aUrls) {
			if ($.isArray(aUrls)) {
				for (i = 0; i < aUrls.length; i++) {
					this.addCssFile(aUrls[i]);
				}
			}
		};
		
		Page.prototype.getUrl = function() {
			return de.titus.core.URL.getCurrentUrl();
		};
		
		Page.prototype.buildUrl = function(aUrl) {
			var browser = this.detectBrowser();
			if (browser.ie && browser.ie < 11) {
				var tempUrl = aUrl.toLowerCase().trim();
				if (this.hasBaseTag && !tempUrl.indexOf("http:") == 0 && !tempUrl.indexOf("https:") == 0 && !tempUrl.indexOf("ftp:") == 0 && !tempUrl.indexOf("ftps:") == 0 && !tempUrl.indexOf("mailto:") == 0 && !tempUrl.indexOf("notes:") == 0 && !tempUrl.indexOf("/") == 0) {
					return this.baseTagValue + aUrl;
				}
			}
			return aUrl;
		};
		
		Page.prototype.detectBrowser = function() {
			if(Page.BROWSER)
				return Page.BROWSER;
			
			Page.BROWSER = {};
			if(document.documentMode)
				Page.BROWSER.ie = document.documentMode;			
			else
				Page.BROWSER.other = true;
			
			return Page.BROWSER;
		};
		
		Page.prototype.setData = function(aKey, aValue) {
			this.data[aKey] = aValue;
		};
		
		Page.prototype.getData = function(aKey) {
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
		var StringUtils = $.fn.de_titus_core_StringUtils = de.titus.core.StringUtils = {};
		StringUtils.DEFAULTS = {};
		StringUtils.DEFAULTS.formatToHtml = {
		"tabsize" : 4,
		"tabchar" : "&nbsp;",
		"newlineTag" : "<br/>"
		};
		
		StringUtils.DEFAULTS.trimTextLength = {
			"postfix" : "..."
		};
		
		StringUtils.trimTextLength = function(aText, maxLength, theSettings) {
			if (aText == undefined || typeof aText !== "string" || aText == "")
				return aText;
			
			var settings = $.extend({}, theSettings, StringUtils.DEFAULTS.trimTextLength);
			
			if (aText.length > maxLength) {
				var end = maxLength - settings.postfix.length;
				if ((aText.length - end) > 0)
					return aText.substring(0, end) + settings.postfix;
			}
			return aText;
		};
		
		StringUtils.formatToHtml = function(aText, theSettings) {
			if (aText == undefined || typeof aText !== "string" || aText == "")
				return aText;
			
			var settings = $.extend({}, theSettings, StringUtils.DEFAULTS.formatToHtml);
			var text = aText.replace(new RegExp("\n\r", "g"), "\n");
			var text = aText.replace(new RegExp("\r", "g"), "\n");
			var lines = text.split("\n");
			var text = "";
			for (var i = 0; i < lines.length; i++) {
				if (i != 0)
					text = text + settings.newlineTag;
				text = text + StringUtils.preventTabs(lines[i], settings.tabsize, settings.tabchar);
			}
			return text;
		};
		
		StringUtils.getTabStopMap = function(tabSize, tabString) {
			var tabstopMap = [];
			for (var i = 0; i <= tabSize; i++) {
				if (i == 0)
					tabstopMap[0] = "";
				else
					tabstopMap[i] = tabstopMap[i - 1] + tabString;
			}
			
			return tabstopMap;
		};
		
		StringUtils.preventTabs = function(aText, theTabStops, theTabStopChar) {
			var tabstopMap = StringUtils.getTabStopMap(theTabStops, theTabStopChar);
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
		StringUtils.format = function(aText, args) {
			var objects = arguments;
			return aText.replace(StringUtils.format.VARREGEX, function(item) {
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
		StringUtils.format.VARREGEX = new RegExp("{-?[0-9]+}", "g");
		
	});
})($);
(function($) {
	de.titus.core.Namespace.create("de.titus.core.EventBind", function() {
		"use strict";
		var EventBind = de.titus.core.EventBind = function(anElement, aContext) {
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
		
		EventBind.EXPRESSIONRESOLVER = new de.titus.core.ExpressionResolver();
		EventBind.STATE = {
			FINISHED : "$$EventBind.FINISHED$$"
		};
		EventBind.FINISHEDSTATE = {
		FAIL : "fail",
		READY : "ready"
		};
		
		EventBind.$$__execute__$$ = function(anEvent) {
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
		de.titus.core.jquery.Components.asComponent("de.titus.core.EventBind", de.titus.core.EventBind);
		
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
	    } else if (aNode.nodeType == 3 || aNode.nodeType == 4) // text
		return aNode.textContent.trim();

	    // do children
	    if (aNode.hasChildNodes()) {
		var textContent = undefined;
		var hasChildren = false;
		for (var i = 0; i < aNode.childNodes.length; i++) {
		    var item = aNode.childNodes.item(i);
		    if (item.nodeType == 1) {
			hasChildren = true;
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
		    } else if (item.nodeType == 3 || item.nodeType == 4)
			if (item.textContent != "")
			    textContent = (textContent ? textContent + item.textContent : item.textContent);
		}

		if (textContent) {
		    if (obj["@attributes"] == undefined && !hasChildren)
			obj = textContent.trim();
		    else
			obj.text = textContent.trim();
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

de.titus.core.Namespace.create("de.titus.logging.Version", function() {
	de.titus.logging.Version = "2.0.0";
});de.titus.core.Namespace.create("de.titus.logging.LogLevel", function() {
	
	var LogLevel = de.titus.logging.LogLevel = function(aOrder, aTitle){
		this.order = aOrder;
		this.title = aTitle;
	};
	
	LogLevel.prototype.isIncluded = function(aLogLevel){
		return this.order >= aLogLevel.order;
	};
	
	LogLevel.getLogLevel = function(aLogLevelName){
		if(aLogLevelName == undefined)
			return de.titus.logging.LogLevel.NOLOG;
		
		var levelName = aLogLevelName.toUpperCase();
		return de.titus.logging.LogLevel[levelName];
	};
	
	LogLevel.NOLOG = new LogLevel(0, "NOLOG");
	LogLevel.ERROR = new LogLevel(1, "ERROR");
	LogLevel.WARN 	= new LogLevel(2, "WARN");
	LogLevel.INFO 	= new LogLevel(3, "INFO");
	LogLevel.DEBUG = new LogLevel(4, "DEBUG");
	LogLevel.TRACE = new LogLevel(5, "TRACE");	
});
de.titus.core.Namespace.create("de.titus.logging.LogAppender", function() {
	
	var LogAppender = de.titus.logging.LogAppender = function() {	};
	
	LogAppender.prototype.formatedDateString = function(aDate){
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
	LogAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel){};
	
	
});

de.titus.core.Namespace.create("de.titus.logging.Logger", function() {
	
	var Logger = de.titus.logging.Logger = function(aName, aLogLevel, aLogAppenders) {
		this.name = aName;
		this.logLevel = aLogLevel;
		this.logAppenders = aLogAppenders;
	};
	
	Logger.prototype.isErrorEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.ERROR);
	};
	Logger.prototype.isWarnEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.WARN);
	};
	Logger.prototype.isInfoEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.INFO);
	};
	Logger.prototype.isDebugEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.DEBUG);
	};
	Logger.prototype.isTraceEnabled = function() {
		return this.logLevel.isIncluded(de.titus.logging.LogLevel.TRACE);
	};
	
	Logger.prototype.logError = function(aMessage, aException) {
		if (this.isErrorEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.ERROR);
	};
	
	Logger.prototype.logWarn = function(aMessage, aException) {
		if (this.isWarnEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.WARN);
	};
	
	Logger.prototype.logInfo = function(aMessage, aException) {
		if (this.isInfoEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.INFO);
	};
	
	Logger.prototype.logDebug = function(aMessage, aException) {
		if (this.isDebugEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.DEBUG);
	};
	
	Logger.prototype.logTrace = function(aMessage, aException) {
		if (this.isTraceEnabled())
			this.log(aMessage, aException, de.titus.logging.LogLevel.TRACE);
	};
	
	Logger.prototype.log = function(aMessage, anException, aLogLevel) {
		if(this.logAppenders == undefined)
			return;
		
		if(this.logAppenders.length > 0){
			for(var i = 0; i < this.logAppenders.length; i++)
				this.logAppenders[i].logMessage(aMessage, anException, this.name, new Date(), aLogLevel);
		}
	};
});
de.titus.core.Namespace.create("de.titus.logging.LoggerRegistry", function() {
	
	var LoggerRegistry = de.titus.logging.LoggerRegistry = function(){
		this.loggers = {};
	};		
	
	LoggerRegistry.prototype.addLogger = function(aLogger){
		if(aLogger == undefined)
			return;
		
		if(this.loggers[aLogger.name] == undefined)
			this.loggers[aLogger.name] = aLogger;
	};	
	
	LoggerRegistry.prototype.getLogger = function(aLoggerName){
		if(aLoggerName == undefined)
			return;
		
		return this.loggers[aLoggerName];
	};	
	
	
	LoggerRegistry.getInstance = function(){
		if(LoggerRegistry.INSTANCE == undefined)
			LoggerRegistry.INSTANCE = new LoggerRegistry();
		
		return LoggerRegistry.INSTANCE;
	};	
	
});de.titus.core.Namespace.create("de.titus.logging.LoggerFactory", function() {
	
	var LoggerFactory = de.titus.logging.LoggerFactory = function() {
		this.configs = undefined;
		this.appenders = {};
		this.loadLazyCounter = 0;
	};
	
	LoggerFactory.prototype.newLogger = function(aLoggerName) {
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
	
	LoggerFactory.prototype.getConfig = function() {
		if (this.configs == undefined)
			this.updateConfigs();
		
		return this.configs;
	};
	
	LoggerFactory.prototype.setConfig = function(aConfig) {
		if (aConfig != undefined) {
			this.configs = aConfig;
			this.updateLogger();
		}
	};
	
	LoggerFactory.prototype.updateConfigs = function(aConfig) {
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
	
	LoggerFactory.prototype.doLoadLazy = function() {
		if (this.loadLazyCounter > 10)
			return;
		this.loadLazyCounter++;
		window.setTimeout(function() {
			de.titus.logging.LoggerFactory.getInstance().loadConfig();
		}, 1);
	};
	
	LoggerFactory.prototype.loadConfig = function(aConfig) {
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
	
	LoggerFactory.prototype.loadConfigRemote = function(aRemoteData) {
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
	
	LoggerFactory.prototype.updateLogger = function() {
		
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
	
	LoggerFactory.prototype.findConfig = function(aLoggerName) {
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
	
	LoggerFactory.prototype.isConfigActiv = function(aLoggerName, aConfig, anActualConfig) {
		if (anActualConfig && anActualConfig.filter.length >= aConfig.filter.filter)
			return false;
		return aLoggerName.search(aConfig.filter) == 0;
	};
	
	LoggerFactory.prototype.getAppenders = function(theAppenders) {
		var result = new Array();
		for (var i = 0; i < theAppenders.length; i++) {
			var appenderString = theAppenders[i];
			var appender = this.appenders[appenderString];
			if (!appender) {
				appender = de.titus.core.SpecialFunctions.doEval("new " + appenderString + "();");
				if (appender) {
					this.appenders[appenderString] = appender;
				}
			}
			if (appender != undefined)
				result.push(appender);
		}
		
		return result;
	};
	
	LoggerFactory.getInstance = function() {
		if (LoggerFactory.INSTANCE == undefined)
			LoggerFactory.INSTANCE = new LoggerFactory();
		
		return LoggerFactory.INSTANCE;
	};
	
});
de.titus.core.Namespace.create("de.titus.logging.ConsolenAppender", function() {
	
	var ConsolenAppender = de.titus.logging.ConsolenAppender = function() {};
	
	ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	ConsolenAppender.prototype.constructor = ConsolenAppender;
	
	ConsolenAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
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
(function($) {
	de.titus.core.Namespace.create("de.titus.logging.HtmlAppender", function() {
		
		var HtmlAppender = de.titus.logging.HtmlAppender = function() {};
		
		HtmlAppender.CONTAINER_QUERY = "#log";
		
		HtmlAppender.prototype = new de.titus.logging.LogAppender();
		HtmlAppender.prototype.constructor = HtmlAppender;
		
		HtmlAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
			var container = $(de.titus.logging.HtmlAppender.CONTAINER_QUERY);
			if (container == undefined)
				return;
			
			var log = $("<div />").addClass("log-entry " + aLogLevel.title);
			var logEntry = "";
			if (aDate)
				logEntry += logEntry = this.formatedDateString(aDate) + " ";
			
			logEntry += "***" + aLogLevel.title + "*** " + aLoggerName + "";
			
			if (aMessage)
				logEntry += " -> " + aMessage;
			if (anException)
				logEntry += ": " + anException;
			
			log.text(logEntry);
			container.append(log);
		};
	});
})($);
de.titus.core.Namespace.create("de.titus.logging.MemoryAppender", function() {
	
	window.MEMORY_APPENDER_LOG = new Array();
	
	var MemoryAppender = de.titus.logging.MemoryAppender = function(){};
	
	MemoryAppender.prototype = new de.titus.logging.LogAppender();
	MemoryAppender.prototype.constructor = MemoryAppender;
	
	MemoryAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){		
		var log = {"date": aDate, 
				"logLevel": aLogLevel,
				"loggerName": aLoggerName,
				"message": aMessage,
				"exception": anException
		};
		if(!window.MEMORY_APPENDER_LOG)
			window.MEMORY_APPENDER_LOG = [];
		window.MEMORY_APPENDER_LOG.push(log);
	};
});de.titus.core.Namespace.create("de.titus.logging.InteligentBrowserAppender", function() {
	var InteligentBrowserAppender = de.titus.logging.InteligentBrowserAppender = function() {
		this.appender = undefined;
	};
	
	InteligentBrowserAppender.prototype = new de.titus.logging.LogAppender();
	InteligentBrowserAppender.prototype.constructor =InteligentBrowserAppender;
	
	InteligentBrowserAppender.prototype.getAppender = function() {
		if (this.appender == undefined) {
			var consoleAvalible = console && console.log === "function";
			
			if (consoleAvalible)
				this.appender = new de.titus.logging.ConsolenAppender();
			else if ($(de.titus.logging.HtmlAppender.CONTAINER_QUERY))
				this.appender = new de.titus.logging.HtmlAppender();
			else
				this.appender = new de.titus.logging.MemoryAppender();
		}
		
		return this.appender;
	}

	InteligentBrowserAppender.prototype.logMessage = function(aMessage, anException, aLoggerName, aDate, aLogLevel) {
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

(function($){
	de.titus.core.Namespace.create("de.titus.jstl", function() {
		de.titus.jstl.Version = "3.0.0";
	});
})($);
de.titus.core.Namespace.create("de.titus.jstl.Constants", function() {
	de.titus.jstl.Constants = {
		EVENTS : {
		onStart : "jstl-on-start",
		onLoad : "jstl-on-load",
		onSuccess : "jstl-on-success",
		onFail : "jstl-on-fail",
		onReady : "jstl-on-ready"
		},
		PHASE : {
			INIT:0,
			CONDITION:1,
			CONTEXT:2,
			MANIPULATION:3,
			CONTENT:4,
			CLEANING: 5,
			CHILDREN:6,
			BINDING:7,
			FINISH:8
		}
	};	
});
(function($, GlobalSettings) {
	"use strict";
	de.titus.jstl.GlobalSettings = $.extend(true, {
		DEFAULT_TIMEOUT_VALUE: 1,
		DEFAULT_INCLUDE_BASEPATH : ""		
	}, GlobalSettings);
})($, de.titus.jstl.GlobalSettings);
de.titus.core.Namespace.create("de.titus.jstl.TaskRegistry", function() {
	
	var TaskRegistry = {
		taskchain : undefined
	};
	
	TaskRegistry.append = function(aName, aPhase, aSelector, aFunction, aChain) {
		if (!aChain && !TaskRegistry.taskchain)
			TaskRegistry.taskchain = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
		else if (!aChain && TaskRegistry.taskchain)
			TaskRegistry.append(aName, aPhase, aSelector, aFunction, TaskRegistry.taskchain);
		else if (aChain.phase <= aPhase && aChain.next && aChain.next.phase <= aPhase)
			TaskRegistry.append(aName, aPhase, aSelector, aFunction, aChain.next);
		else if (aChain.phase <= aPhase && aChain.next && aChain.next.phase > aPhase) {
			var tempChain = aChain.next;
			aChain.next = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
			aChain.next.next = tempChain;
		} else if (aChain.phase <= aPhase && !aChain.next)
			aChain.next = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
		else if (aChain.phase > aPhase) {
			var tempChain = aChain;
			TaskRegistry.taskchain = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
			TaskRegistry.taskchain.next = aChain;
		}
	}

	TaskRegistry.__buildEntry = function(aName, aPhase, aSelector, aFunction) {
		return {
		    name : aName,
		    phase : aPhase,
		    selector : aSelector,
		    task : aFunction
		};
	}

	de.titus.jstl.TaskRegistry = TaskRegistry;
});
(function($, GlobalSettings) {
    "use strict";
    de.titus.core.Namespace.create("de.titus.jstl.ExecuteChain", function() {
	var ExecuteChain = de.titus.jstl.ExecuteChain = function(aTaskChain, aCount, aCallback) {
	    this.count = aCount || 0;
	    this.taskChain = aTaskChain;
	    this.callback = aCallback;
	};
	ExecuteChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.ExecuteChain");

	ExecuteChain.prototype.finish = function() {
	    if (ExecuteChain.LOGGER.isDebugEnabled())
		ExecuteChain.LOGGER.logDebug("count: " + this.count);
	    
	    this.count--;
	    if (this.count == 0){
		if (typeof this.callback === "function")
		    this.callback(this);
		this.taskChain.nextTask();
	    }
	};
    });
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.TaskChain", function() {
		var TaskChain = function(aElement, aContext, aProcessor, isRoot, aCallback) {
			this.element = aElement;
			this.context = aContext;
			this.processor = aProcessor;
			this.root = isRoot;
			if(typeof aCallback === "function" || Array.isArray(aCallback))
				this.callback = aCallback;
			this.__preventChilds = false;
			this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;
			this.__currentTask = undefined;
		};
		TaskChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.TaskChain");
		
		TaskChain.prototype.skipToPhase = function(aPhase) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("skipToPhase()");
			
			while (this.__taskchain && this.__taskchain.phase < aPhase)
				this.__taskchain = this.__taskchain.next;
			
			return this;
		};
		
		TaskChain.prototype.preventChilds = function() {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("preventChilds()");
			this.__preventChilds = true;
			return this;
		};
		
		TaskChain.prototype.isPreventChilds = function() {
			return this.__preventChilds;
		};
		
		TaskChain.prototype.updateContext = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("updateContext()");
			if (doMerge)
				this.context = $.extend(this.context, aContext);
			else
				this.context = aContext;
			
			return this;
		};
		
		TaskChain.prototype.appendCallback = function(aCallback) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("appendCallback()");
			if(typeof aCallback !== "function")
				return;
			
			if(Array.isArray(this.callback))				
				this.callback.push(aCallback);
			else if(this.callback)
				this.callback = [this.callback, aCallback]
			else
				this.callback = aCallback;
			
			return this;
		};
		
		TaskChain.prototype.nextTask = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("nextTask( \"" + aContext + "\")");
			
			if (aContext)
				this.updateContext(aContext, doMerge);
			
			if (this.__taskchain) {
				var name = this.__taskchain.name;
				var task = this.__taskchain.task;
				var phase = this.__taskchain.phase;
				var selector = this.__taskchain.selector;
				this.__currentTask = this.__taskchain;
				this.__taskchain = this.__taskchain.next;
				
				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug("nextTask() -> next task: \"" + name + "\", phase: \"" + phase + "\", selector \"" + selector + "\"!");
				if (selector == undefined || this.element.is(selector))
					task(this.element, this.__buildContext(), this.processor, this);
				else {
					if (TaskChain.LOGGER.isDebugEnabled())
						TaskChain.LOGGER.logDebug("nextTask() -> skip task: \"" + name + "\", phase: \"" + phase + "\", selector \"" + selector + "\"!");
					this.nextTask();
				}
			} else {
				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug("nextTask() -> task chain is finished!");
				this.finish();
			}
			
			return this;
		};
		TaskChain.prototype.__buildContext = function() {
			this.context["$element"] = this.element;
			this.context["$root"] = this.processor.element;
			return this.context;			
		};
		
		TaskChain.prototype.finish = function() {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("finish()");
			
			if (typeof this.callback === "function")
				this.callback(this.element, this.context, this.processor, this);
			else if(Array.isArray(this.callback))
				for(var i = 0; i < this.callback.length; i++)
					if (typeof this.callback[i] === "function")
						this.callback[i](this.element, this.context, this.processor, this);
			
			this.element.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [
				this.context, this.processor
			]);
			return this;
		};
		
		de.titus.jstl.TaskChain = TaskChain;
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Children", function() {
		var Children = de.titus.jstl.functions.Children = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Children"),
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Children.LOGGER.isDebugEnabled())
				    Children.LOGGER.logDebug("TASK");
			    
			    if (!aTaskChain.isPreventChilds()) {
				    var ignoreChilds = aElement.attr("jstl-ignore-childs");
				    if (ignoreChilds && ignoreChilds != "")
					    ignoreChilds = aProcessor.resolver.resolveExpression(ignoreChilds, aContext, true);
				    
				    if (ignoreChilds == "false" || ignoreChilds == true)
					    return aTaskChain.preventChilds().nextTask();
				    
				    var children = aElement.children();
				    if (children.length == 0)
					    aTaskChain.nextTask();
				    else{
				    	var child = $(children[0]);
				    	if(child && child.length == 1)
				    		aProcessor.compute(child, aTaskChain.context, Children.ElementChain.bind({}, children, 1, aTaskChain));
				    }
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    UpdateContext : function(aParentTaskChain, aTaskChain) {
			    aParentTaskChain.updateContext(aTaskChain.context, true);
		    },
		    
		    ElementChain : function(theChildren, aIndex, aParentTaskChain, aElement, aContext, aProcessor) {
			    aParentTaskChain.updateContext(aContext, true);
			    if (aIndex < theChildren.length) {
				    var next = $(theChildren[aIndex]);
				    if(next && next.length == 1)
				    	aProcessor.compute(next, aParentTaskChain.context, Children.ElementChain.bind({}, theChildren, aIndex + 1, aParentTaskChain));
			    } else
				    aParentTaskChain.nextTask();
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("children", de.titus.jstl.Constants.PHASE.CHILDREN, undefined, de.titus.jstl.functions.Children.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		var If = de.titus.jstl.functions.If = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If"),
		    TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			    if (If.LOGGER.isDebugEnabled())
				    If.LOGGER.logDebug("TASK");
			    
			    var expression = aElement.attr("jstl-if");
			    if (expression != undefined) {
				    var expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (!(expression == true || expression == "true")) {
					    aElement.remove();
					    aExecuteChain.preventChilds().finish();
				    } else
					    aExecuteChain.nextTask();
			    } else
				    aExecuteChain.nextTask();
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("if", de.titus.jstl.Constants.PHASE.CONDITION, "[jstl-if]", de.titus.jstl.functions.If.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
    de.titus.core.Namespace.create("de.titus.jstl.functions.Preprocessor", function() {
	var Preprocessor = de.titus.jstl.functions.Preprocessor = {
	LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Preprocessor"),

	STATICEVENTHANDLER : function(aExpression, aEvent, aContext, aProcessor) {
	    if (aExpression && aExpression != "") {
		var eventAction = aProcessor.resolver.resolveExpression(aExpression, aContext);
		if (typeof eventAction === "function")
		    eventAction(aContext.$element, aContext, aProcessor);
	    }
	},

	TASK : function(aElement, aContext, aProcessor, aTaskChain) {
	    if (Preprocessor.LOGGER.isDebugEnabled())
		Preprocessor.LOGGER.logDebug("TASK");

	    if (aElement[0].nodeType != 1 || aElement.tagName() == "br")
		return aTaskChain.preventChilds().finish();

	    if (!aTaskChain.root) {
		var ignore = aElement.attr("jstl-ignore");
		if (ignore && ignore != "")
		    ignore = aProcessor.resolver.resolveExpression(ignore, aContext, false);
		if (ignore == "" || ignore == true || ignore == "true")
		    return aTaskChain.preventChilds().finish();

		var async = aElement.attr("jstl-async");
		if (async && async != "")
		    async = aProcessor.resolver.resolveExpression(async, dataContext, false);
		if (async == "" || async == true || async == "true") {
		    aProcessor.onReady((function(aContext) {
			this.jstlAsync({
			    data : aContext
			});
		    }).bind(aElement, $.extend({}, aContext)));
		    return aTaskChain.preventChilds().finish();
		}

	    }

	    Preprocessor.__appendEvents(aElement);

	    aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [ aContext, aProcessor ]);
	    aTaskChain.nextTask();
	},

	__appendEvents : function(aElement) {
	    if (aElement.attr("jstl-load"))
		aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-load")));
	    if (aElement.attr("jstl-success"))
		aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, Preprocessor.STATICEVENTHANDLER.bind(null, aElement.attr("jstl-success")));
	}

	};

	de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.Constants.PHASE.INIT, undefined, de.titus.jstl.functions.Preprocessor.TASK);
    });
})($, de.titus.jstl.GlobalSettings);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
		var Choose = de.titus.jstl.functions.Choose = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-choose");
			    if (expression != undefined){
			    	Choose.__compute(aElement, aDataContext, aProcessor, aProcessor.resolver);
			    	aTaskChain.preventChilds();
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    __compute : function(aChooseElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processChilds(" + aChooseElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    var resolved = false;
			    aChooseElement.children().each(function() {
				    var child = $(this);
				    if (!resolved && Choose.__computeChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver)) {
					    if (Choose.LOGGER.isTraceEnabled())
						    Choose.LOGGER.logTrace("compute child: " + child);
					    aProcessor.compute(child, aDataContext);
					    resolved = true;
				    } else {
					    if (Choose.LOGGER.isTraceEnabled())
						    Choose.LOGGER.logTrace("remove child: " + child);
					    child.remove();
				    }
			    });
		    },
		    
		    __computeChild : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processChild(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    if (Choose.__computeWhen(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver))
				    return true;
			    else if (Choose.__computeOtherwise(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver))
				    return true;
			    else
				    return false;
		    },
		    
		    __computeWhen : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processWhenElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    var expression = aElement.attr("jstl-when");
			    if (expression != undefined)
				    return aExpressionResolver.resolveExpression(expression, aDataContext, false);
			    return false;
		    },
		    
		    __computeOtherwise : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
			    
			    if (aElement.attr("jstl-otherwise") != undefined)
				    return true;
			    return false;
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("choose", de.titus.jstl.Constants.PHASE.CONDITION, "[jstl-choose]", de.titus.jstl.functions.Choose.TASK);
	});
})($);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		var Foreach = de.titus.jstl.functions.Foreach = {
		    
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach"),
		    
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-foreach");
			    if (expression != undefined) {
				    aTaskChain.preventChilds();
				    Foreach.__compute(expression, aElement, aContext, aProcessor, aProcessor.resolver, aTaskChain);
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __compute : function(aExpression, aElement, aContext, aProcessor, anExpressionResolver, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute __compute(" + aElement + ", " + aContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
			    
			    var tempalte = Foreach.__template(aElement);
			    if (tempalte == undefined)
				    return;
			    
			    aElement.empty();
			    
			    var varName = aElement.attr("jstl-foreach-var") || "itemVar";
			    var statusName = aElement.attr("jstl-foreach-status") || "statusVar";			    
			    var list = anExpressionResolver.resolveExpression(aExpression, aContext, undefined);
			    
			    if (aExpression == "")
				    Foreach.__count(tempalte, statusName, aElement, aContext, aProcessor, aTaskChain);
			    else if (Array.isArray(list))
				    Foreach.__list(list, tempalte, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
			    else if (typeof list === "object")
				    Foreach.__map(list, tempalte, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
			    else
				aTaskChain.nextTask();
		    },
		    __count : function(aTemplate, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var count = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-count"));
			    var step = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-step") || 1);
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain);
			    
			    for (var i = startIndex; i < count; i += step) {
				    var template = aTemplate.clone();
				    var context = $.extend({}, aContext);
				    context[aStatusName] = {
				        "index" : i,
				        "count" : count,
				        "context" : aContext
				    };
				    executeChain.count++;
				    Foreach.__computeContent(template, context, aElement, aProcessor, executeChain);				    
			    }
		    },
		    
		    __list : function(aListData, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, 1);
			    
			    for (var i = startIndex; i < aListData.length; i++) {
				    var template = aTemplate.clone();
				    var context = $.extend({}, aContext);
				    context[aVarname] = aListData[i];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "count" : aListData.length,
				        "data" : aListData,
				        "context" : aContext
				    };
				    if (breakCondition && Foreach.__break(context, breakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(template, context, aElement, aProcessor, executeChain);
				    }
			    }
			    executeChain.finish();
		    },
		    
		    __map : function(aMap, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, 1);
			    var i = 0;
			    for ( var name in aMap) {
				    var content = aTemplate.clone();
				    var context = $.extend({}, aContext);
				    context[aVarname] = aMap[name];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "key" : name,
				        "data" : aMap,
				        "context" : aContext
				    };
				    
				    if (breakCondition && Foreach.__break(context, breakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(content, context, aElement, aProcessor, executeChain);
					    i++;
				    }
			    }
			    executeChain.finish();
		    },
		    
		    __break : function(aContext, aBreakCondition, aElement, aProcessor) {
			    var expression = aProcessor.resolver.resolveExpression(aBreakCondition, aContext, false);
			    if (typeof expression === "function")
				    expression = expression(aElement, aContext, aProcessor);
			    
			    return expression == true || expression == "true";
		    },
		    
		    __computeContent : function(aContent, aContext, aElement, aProcessor, aExecuteChain) {
			    aContent.appendTo(aElement);
			    aProcessor.compute(aContent, aContext, (function(aElement, aContent, aExecuteChain) {
				    aExecuteChain.finish();
			    }).bind({}, aElement, aContent, aExecuteChain));
		    },
		    
		    __template : function(aElement) {
			    var template = aElement.data("de.titus.jstl.functions.Foreach.Template");
			    if (template == undefined) {
				    template = $("<jstl/>").append(aElement.contents());
				    aElement.data("de.titus.jstl.functions.Foreach.Template", template);
			    }
			    return template;
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("foreach", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-foreach]", de.titus.jstl.functions.Foreach.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Text", function() {
		var Text = de.titus.jstl.functions.Text = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Text"),
		    
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Text.LOGGER.isDebugEnabled())
				    Text.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");
			    
			    var ignore = aElement.attr("jstl-text-ignore");
			    if (!ignore) {
			    	if(!de.titus.core.Page.getInstance().detectBrowser().other)//IE BUG
			    		Text.normalize(aElement[0]);
				    var contenttype = aElement.attr("jstl-text-content-type") || "text";
				    aElement.contents().filter(function() {
					    return (this.nodeType === 3 || this.nodeType === 4) && this.textContent != undefined && this.textContent.trim() != "";
				    }).each(function() {
					    var text = this.textContent;
					    if (text) {
						    text = aProcessor.resolver.resolveText(text, aContext);
						    var contentFunction = Text.CONTENTTYPE[contenttype];
						    if (contentFunction)
							    contentFunction(this, text, aElement, aProcessor, aContext);
					    }
				    });
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    normalize : function(aNode) {
			    if (!aNode)
				    return;
			    if (aNode.nodeType == 3) {
				    var text = aNode.textContent;
				    while (aNode.nextSibling && aNode.nextSibling.nodeType == 3) {
					    text += aNode.nextSibling.textContent;
					    aNode.parentNode.removeChild(aNode.nextSibling);
				    }
				    aNode.textContent = text;
			    } else {
				    Text.normalize(aNode.firstChild);
			    }
			    Text.normalize(aNode.nextSibling);
		    },
		    
		    CONTENTTYPE : {
		        "html" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        $(aNode).replaceWith($.parseHTML(aText));
		        },
		        "json" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        if (typeof aText === "string")
				        aNode.textContent = aText;
			        else
				        aNode.textContent = JSON.stringify(aText);
		        },
		        "text" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        var text = aText;
			        var addAsHtml = false;
			        
			        var trimLength = aBaseElement.attr("jstl-text-trim-length");
			        if (trimLength != undefined && trimLength != "") {
				        trimLength = aProcessor.resolver.resolveExpression(trimLength, aContext, "-1");
				        trimLength = parseInt(trimLength);
				        if (trimLength && trimLength > 0)
					        text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
			        }
			        
			        var preventformat = aBaseElement.attr("jstl-text-prevent-format");
			        if (preventformat) {
				        preventformat = aProcessor.resolver.resolveExpression(preventformat, aContext, true) || true;
				        if (preventformat) {
					        text = de.titus.core.StringUtils.formatToHtml(text);
					        addAsHtml = true;
				        }
			        }
			        
			        if (addAsHtml)
				        $(aNode).replaceWith($.parseHTML(text));
			        else
				        aNode.textContent = text;
		        }
		    }
		};
		
		Text.CONTENTTYPE["text/html"] = Text.CONTENTTYPE["html"];
		Text.CONTENTTYPE["application/json"] = Text.CONTENTTYPE["json"];
		Text.CONTENTTYPE["text/plain"] = Text.CONTENTTYPE["text"];
		
		de.titus.jstl.TaskRegistry.append("text", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Text.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Attribute", function() {
		var Attribute = de.titus.jstl.functions.Attribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Attribute"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Attribute.LOGGER.isDebugEnabled())
				    Attribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var attributes = aElement[0].attributes || [];
			    for (var i = 0; i < attributes.length; i++) {
				    var name = attributes[i].name;
				    if (name.indexOf("jstl-") != 0) {
					    var value = attributes[i].value;
					    if (value != undefined && value != "") {
						    try {
							    var newValue = aProcessor.resolver.resolveText(value, aDataContext);
							    if (value != newValue) {
								    if (Attribute.LOGGER.isDebugEnabled()) {
									    Attribute.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
								    }
								    aElement.attr(name, newValue);
							    }
						    } catch (e) {
							    Attribute.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
						    }
					    }
				    }
			    }
			    
			    aTaskChain.nextTask();
		    }
		}
		
		de.titus.jstl.TaskRegistry.append("attribute", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Attribute.TASK);
	});
})($);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
		var Data = de.titus.jstl.functions.Data = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug("TASK");
			    
			    var expression = aElement.attr("jstl-data");
			    if (expression) {
				    var varname = aElement.attr("jstl-data-var");
				    var mode = aElement.attr("jstl-data-mode") || "direct";
				    Data.MODES[mode](expression, aElement, varname, aDataContext, aProcessor, aTaskChain);
				    
			    } else
				    aTaskChain.nextTask();
		    },
		    
		    __options : function(aElement, aDataContext, aProcessor) {
			    var options = aElement.attr("jstl-data-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aDataContext);
				    options = aProcessor.resolver.resolveExpression(options, aDataContext);
				    return options || {};
			    }
			    return {};
		    },
		    __updateContext : function(aVarname, aData, aTaskChain) {
			    if (aData) {
				    if (!aVarname)
					    aTaskChain.updateContext(aData, true);
				    else
					    aTaskChain.context[aVarname] = aData;
			    }
		    },
		    
		    MODES : {
		        "direct" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var data = aProcessor.resolver.resolveExpression(anExpression, aDataContext, anExpression);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        },
		        
		        "remote" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var url = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        var option = Data.__options(aElement, aDataContext, aProcessor);
			        var datatype = (aElement.attr("jstl-data-datatype") || "json").toLowerCase();
			        
			        var ajaxSettings = {
			            'url' : de.titus.core.Page.getInstance().buildUrl(url),
			            'async' : true,
			            'cache' : false,
			            'dataType' : datatype
			        };
			        ajaxSettings = $.extend(ajaxSettings, option);
			        
			        $.ajax(ajaxSettings).done(Data.__remoteResponse.bind({}, aVarname, datatype, aTaskChain));
		        },
		        
		        "url-parameter" : function(anExpression, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        var parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        var data = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        }
		    },
		    CONTENTYPE : {
		        "xml" : de.titus.core.Converter.xmlToJson,
		        "json" : function(aData) {
			        return aData
		        }
		    },
		    
		    __remoteResponse : function(aVarname, aDatatype, aTaskChain, aData) {
			    var data = Data.CONTENTYPE[aDatatype](aData);
			    Data.__updateContext(aVarname, data, aTaskChain);
			    aTaskChain.nextTask();
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("data", de.titus.jstl.Constants.PHASE.CONTEXT, "[jstl-data]", de.titus.jstl.functions.Data.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
		
		var Include = de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    CACHE : {},
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-include");
			    if (expression)
				    Include.__compute(expression, aElement, aContext, aProcessor, aTaskChain);
			    else
				    aTaskChain.nextTask();
		    },
		    
		    __cacheCallback : function(aElement, aProcessor, aContext, aTaskChain, aTemplate) {
			    Include.__include(aElement, aTemplate, aProcessor, aContext, aTaskChain);
		    },
		    
		    __executeCacheCallback : function(aUrl, aTemplate) {
			    Include.CACHE[aUrl].template = $("<jstl/>").append(aTemplate);
			    Include.CACHE[aUrl].onload = false;
			    var cache = Include.CACHE[aUrl];
			    for (var i = 0; i < cache.callback.length; i++)
				    cache.callback[i](cache.template);
		    },
		    
		    __compute : function(anIncludeExpression, aElement, aContext, aProcessor, aTaskChain) {
			    var url = aProcessor.resolver.resolveText(anIncludeExpression, aContext);
			    var disableCaching = url.indexOf("?") >= 0 || aElement.attr("jstl-include-cache-disabled") != undefined;
			    var cache = undefined;
			    if (!disableCaching)
				    cache = Include.CACHE[url];
			    
			    if (cache) {
				    if (cache.onload)
					    cache.callback.push(Include.__cacheCallback.bind({}, aElement, aProcessor, aContext, aTaskChain));
				    else
					    Include.__include(aElement, cache.template, aProcessor, aContext, aTaskChain);
			    } else {
				    cache = Include.CACHE[url] = {
				        onload : true,
				        callback : [
					        Include.__cacheCallback.bind({}, aElement, aProcessor, aContext, aTaskChain)
				        ]
				    };
				    var options = Include.__options(aElement, aContext, aProcessor);
				    var ajaxSettings = {
				        'url' : Include.__buildUrl(url),
				        'async' : true,
				        'cache' : aElement.attr("jstl-include-ajax-cache-disabled") == undefined,
				        "dataType" : "html"
				    };
				    ajaxSettings = $.extend(true, ajaxSettings, options);
				    
				    $.ajax(ajaxSettings).done(Include.__executeCacheCallback.bind({}, ajaxSettings.url)).fail(function(error) {
					    throw JSON.stringify(error);
				    });
			    }
		    },
		    URLPATTERN : new RegExp("^((https?://)|/).*", "i"),
		    
		    __buildUrl : function(aUrl) {
			    var url = aUrl;
			    if (!Include.URLPATTERN.test(aUrl))
				    url = GlobalSettings.DEFAULT_INCLUDE_BASEPATH + aUrl;
			    url = de.titus.core.Page.getInstance().buildUrl(url);
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __buildUrl(\"" + aUrl + "\") -> result: " + url);
			    
			    return url;
		    },
		    
		    __options : function(aElement, aContext, aProcessor) {
			    var options = aElement.attr("jstl-include-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aContext);
				    options = aProcessor.resolver.resolveExpression(options, aContext);
				    return options || {};
			    }
			    
			    return {};
		    },
		    
		    __mode : function(aElement, aContext, aProcessor) {
			    var mode = aElement.attr("jstl-include-mode");
			    if (mode == undefined)
				    return "replace";
			    
			    mode = mode.toLowerCase();
			    if (mode == "append" || mode == "replace" || mode == "prepend")
				    return mode;
			    
			    return "replace";
		    },
		    
		    __include : function(aElement, aTemplate, aProcessor, aContext, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __include()");
			    var content = aTemplate.clone();
			    var includeMode = Include.__mode(aElement, aContext, aProcessor);
			    
			    if (includeMode == "replace") {
				    aElement.empty();
				    content.appendTo(aElement);
			    } else if (includeMode == "append")
				    content.appendTo(aElement);
			    else if (includeMode == "prepend")
				    content.prependTo(aElement);
			    
			    aTaskChain.nextTask();
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("include", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-include]", de.titus.jstl.functions.Include.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
		var AddAttribute = de.titus.jstl.functions.AddAttribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AddAttribute"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (AddAttribute.LOGGER.isDebugEnabled())
				    AddAttribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-add-attribute");
			    if (expression) {
				    expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (expression && typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (expression && Array.isArray(expression))
					    AddAttribute.processArray(expression, aElement, aDataContext, aProcessor);
				    else if (expression && typeof expression === "object")
					    AddAttribute.processObject(expression, aElement, aDataContext, aProcessor);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    processArray : function(theDataArray, aElement, aDataContext, aProcessor) {
			    for (var i = 0; i < theDataArray.length; i++) {
				    AddAttribute.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
			    }
		    },
		    
		    processObject : function(theData, aElement, aDataContext, aProcessor) {
			    if (theData.name)
				    aElement.attr(theData.name, theData.value);
			    else
				    AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("add-attribute", de.titus.jstl.Constants.PHASE.CONTENT, "[jstl-add-attribute]", de.titus.jstl.functions.AddAttribute.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
		var Databind = de.titus.jstl.functions.Databind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Databind"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Databind.LOGGER.isDebugEnabled())
				    Databind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var varname = aElement.attr("jstl-databind-name");
			    if (varname && varname.trim() != "") {
				    var value = Databind.__value(aElement, aDataContext, aProcessor);
				    if (value != undefined)
					    aElement.data(varname, value);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    __value : function(aElement, aDataContext, aProcessor) {
			    return aProcessor.resolver.resolveExpression(aElement.attr("jstl-databind"), aDataContext, undefined);
		    }		
		};
		
		de.titus.jstl.TaskRegistry.append("databind", de.titus.jstl.Constants.PHASE.BINDING, "[jstl-databind]", de.titus.jstl.functions.Databind.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Eventbind", function() {
		var Eventbind = de.titus.jstl.functions.Eventbind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Eventbind"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Eventbind.LOGGER.isDebugEnabled())
				    Eventbind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    if (aElement.attr("jstl-eventbind") != undefined)
				    aElement.de_titus_core_EventBind(aDataContext);
			    
			    aTaskChain.nextTask();
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("eventbind", de.titus.jstl.Constants.PHASE.BINDING, "[jstl-eventbind]", de.titus.jstl.functions.Eventbind.TASK);
	});
})($);
(function($, SpecialFunctions, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		var Processor = function(aElement, aContext, aCallback) {
			this.element = aElement;
			this.parent = this.element.parent();
			this.context = aContext || {};
			this.callback = aCallback;
			this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
		};
		
		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		
		Processor.prototype.compute = function(aElement, aContext, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aContext + ")");
			if (!aElement) {
				this.element.removeClass("jstl-ready");
				this.element.addClass("jstl-running");
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [
				        aContext, this
				]);
				this.__computeElement(this.element, this.context, true, this.callback);
			} else
				this.__computeElement(aElement, aContext, false, aCallback);
		};
		
		Processor.prototype.__computeElement = function(aElement, aContext, isRoot, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("__computeElement() -> root: " + isRoot);
			
			var taskChain = new de.titus.jstl.TaskChain(aElement, aContext, this, isRoot, Processor.prototype.__computeFinished.bind(this, isRoot, aCallback));
			taskChain.nextTask();
		};
		
		Processor.prototype.__computeFinished = function(isRoot, aCallback, aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("__computeFinished() -> is root: " + isRoot);
			
			if (typeof aCallback === "function")
				aCallback(aElement, aContext, this, isRoot);
			
			var tagName = aElement.tagName();
			if ((tagName == "x-jstl" || tagName == "jstl") && aElement.contents().length > 0)
				aElement.replaceWith(aElement.contents());
			
			if (isRoot) {
				this.context = aContext;
				this.onReady();
			}
		};
		
		Processor.prototype.onReady = function(aFunction) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("onReady()");
			
			if (aFunction) {
				this.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else {				
				setTimeout((function(aProcessor) {
					this.removeClass("jstl-running");
					this.addClass("jstl-ready");
					this.trigger(de.titus.jstl.Constants.EVENTS.onReady, [
						aProcessor
					]);
				}).bind(this.element, this), GlobalSettings.DEFAULT_TIMEOUT_VALUE * 10);
			}
		};
		
		de.titus.jstl.Processor = Processor;
	});
})(jQuery, de.titus.core.SpecialFunctions, de.titus.jstl.GlobalSettings);
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
	"use strict";
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {
		$.fn.jstl = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aData);
				});
			} else {
				var processor = this.data("de.titus.jstl.Processor");
				if (!processor) {
				    	var data = aData || {};
					processor = new de.titus.jstl.Processor(this, data.data, data.callback || data.success);
					this.data("de.titus.jstl.Processor", processor);
				}
				else if(aData){
				    var data = aData || {};
				    if(data.data)
					processor.context = data.data;
				    if(typeof data.callback === 'function')
					processor.callback = data.callback
				}
				processor.compute();
				return processor;
			}
		};
		
		$.fn.jstlAsync = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstlAsync(aData);
				});
			} else {
				setTimeout($.fn.jstl.bind(this, aData), 1);
				return this;
			}
		};
		
		$(document).ready(function() {
			$("[jstl-autorun]").jstlAsync();
		});
		
	});
}(jQuery));

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


