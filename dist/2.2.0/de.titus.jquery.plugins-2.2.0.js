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
de.titus.core.Namespace.create("de.titus.core.DomHelper", function() {
	
	/**
	 * 
	 */
	/**
	 * @author xce3560
	 * 
	 */
	de.titus.core.DomHelper = /* constructor */function() {
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.core.DomHelper.prototype.toDomObject = function(aElement) {
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.core.DomHelper.prototype.cloneDomObject = function(aElement) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 */
	de.titus.core.DomHelper.prototype.getAttribute = function(aDomElementObject, anAttribute) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getAttributes = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param value
	 *            if the value undefined the attribute need to be removed!
	 */
	de.titus.core.DomHelper.prototype.setAttribute = function(aDomElementObject, /* string */anAttribute, /* string */value) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 */
	de.titus.core.DomHelper.prototype.getProperty = function(aDomElementObject, anAttribute) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param aValue
	 */
	de.titus.core.DomHelper.prototype.setProperty = function(aDomElementObject, anAttribute, aValue) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getChildCount = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getChilds = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getParent = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getHtml = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aHtml
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.core.DomHelper.prototype.setHtml = function(aDomElementObject, aHtml, aType) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.getText = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aText
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.core.DomHelper.prototype.setText = function(aDomElementObject, aText, aType) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.doRemove = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.core.DomHelper.prototype.doRemoveChilds = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aId
	 */
	de.titus.core.DomHelper.prototype.getDomElementById = function(aId) {
	};
	
	/**
	 * 
	 * @param theSettings
	 *            The minimum settings properties are url, async, cache! The settingsObject would be extents by costum data!
	 * @param aCallback
	 *            The callback function signature is function(template)
	 */
	de.titus.core.DomHelper.prototype.doRemoteLoadHtml = function(theSettings, aCallback) {
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.core.DomHelper.prototype.doRemoteLoadJson = function(theSettings, aCallback) {
	};
	
	/**
	 * 
	 * @param aObject1
	 * @param aObject2
	 * @returns The function need to be return the "aObject1"!
	 */
	de.titus.core.DomHelper.prototype.mergeObjects = function(aObject1, aObject2) {
	};
	
	/**
	 * 
	 * @param aObject1
	 * @param aObject2
	 * @returns The function need to be return the "aObject1"!
	 */
	de.titus.core.DomHelper.prototype.extendObjects = function(aObject1, aObject2) {
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a function. Undefined is false!
	 */
	de.titus.core.DomHelper.prototype.isFunction = function(aVariable) {
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a array;
	 */
	de.titus.core.DomHelper.prototype.isArray = function(aVariable) {
	};
	
	/**
	 * Call the function, after dom is ready!
	 * 
	 * @param afunction
	 * 
	 */
	de.titus.core.DomHelper.prototype.doOnReady = function(afunction) {
	};
	
	/**
	 * 
	 * @param aKey
	 * @param aData
	 */
	de.titus.core.DomHelper.prototype.setBindData = function(aDomElementObject, aKey, aData) {
	};
	
	/**
	 * 
	 * @param aKey
	 */
	de.titus.core.DomHelper.prototype.getBindData = function(aDomElementObject, aKey) {
	};
	
	/**
	 * 
	 * @param aValue
	 *            true = show item or false = hide item
	 */
	de.titus.core.DomHelper.prototype.doShow = function(aDomElementObject, aValue) {
	};
	
	/**
	 * 
	 */
	de.titus.core.DomHelper.prototype.getValue = function(aDomElementObject) {
	};
	
	/**
	 * 
	 * @param aValue
	 */
	de.titus.core.DomHelper.prototype.setValue = function(aDomElementObject, aValue) {
	};
	
	/**
	 * 
	 * @param aEvent
	 *            click, keyup, change
	 * @param aCallback
	 */
	de.titus.core.DomHelper.prototype.addEvent = function(aDomElementObject, aEvent, aCallback) {
	};
	
	/**
	 * 
	 * @param aStatement
	 * @param aDefault
	 * @param aCallback
	 * @returns
	 */
	de.titus.core.DomHelper.prototype.doEval = function(aStatement, aDefault, aCallback) {
		return this.doEvalWithContext(aStatement, {}, aDefault, aCallback);
	};
	
	/**
	 * 
	 * @param aStatement
	 * @param aContext
	 * @param aDefault
	 * @param aCallback
	 * @returns
	 */
	de.titus.core.DomHelper.prototype.doEvalWithContext = function(aStatement, aContext, aDefault, aCallback) {
		if (aCallback != undefined && this.isFunction(aCallback)) {
			var $__THIS__$ = this;
			window.setTimeout(function() {
				var result = $__THIS__$.doEvalWithContext(aStatement, aContext, aDefault, undefined);
				aCallback(result, aContext, this);
			}, 10);
			
		} else {
			var result = de.titus.core.SpecialFunctions.doEval(this, aStatement, aContext);
			
			// var result = $___DE_TITUS_CORE_EVAL_WITH_CONTEXT_EXTENTION___$(this, aStatement, aContext);
			if (result == undefined) {
				return aDefault;
			}
			return result;
		}
	};
	
	/**
	 * @returns de.titus.core.DomHelper
	 */
	de.titus.core.DomHelper.getInstance = function() {
		if (de.titus.core.GLOBAL_DOMHELPER_INSTANCE == undefined) {
			de.titus.core.GLOBAL_DOMHELPER_INSTANCE = new de.titus.core.DomHelper();
		}
		return de.titus.core.GLOBAL_DOMHELPER_INSTANCE;
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
				var element = fiduciagad.$(this);
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
de.titus.core.Namespace.create("de.titus.jquery.DomHelper", function() {
	/**
	 * Constructor of DomHelper for JQuery
	 */
	de.titus.jquery.DomHelper = function() {
	};
	
	/**
	 * extents de.titus.jquery.DomHelper
	 */
	de.titus.jquery.DomHelper.prototype = new de.titus.core.DomHelper();
	de.titus.jquery.DomHelper.prototype.constructor = de.titus.jquery.DomHelper;
	
	/**
	 * 
	 * @param aElement
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.toDomObject = function(aElement) {
		return $(aElement);
	};
	
	/**
	 * 
	 * @param aElement
	 */
	de.titus.jquery.DomHelper.prototype.cloneDomObject = function(aElement) {
		return aElement.clone();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getAttribute = function(aDomElementObject, /* string */anAttribute) {
		return aDomElementObject.attr(anAttribute);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.getAttributes = function(aDomElementObject) {
		var attributes = {};
		$.each(aDomElementObject.get(0).attributes, function(i, attrib) {
			attributes[attrib.name] = attrib.value;
		});
		return attributes;
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param aValue
	 */
	de.titus.jquery.DomHelper.prototype.setAttribute = function(aDomElementObject, /* string */anAttribute, /* string */aValue) {
		if (aValue == undefined)
			aDomElementObject.removeAttr(anAttribute);
		else
			aDomElementObject.attr(anAttribute, aValue);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 */
	de.titus.jquery.DomHelper.prototype.getProperty = function(aDomElementObject, anAttribute) {
		return aDomElementObject.prop(anAttribute);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param anAttribute
	 * @param aValue
	 */
	de.titus.jquery.DomHelper.prototype.setProperty = function(aDomElementObject, anAttribute, aValue) {
		aDomElementObject.prop(anAttribute, aValue);
	};
	
	/**
	 * Get the width of element.
	 * 
	 * @param aDomElementObject
	 * @returns int, width in px
	 */
	de.titus.jquery.DomHelper.prototype.getWith = function(aDomElementObject) {
		return aDomElementObject.width();
	};
	
	/**
	 * Set the width of element.
	 * 
	 * 
	 * @param aDomElementObject
	 * @param aWidth,
	 *            width in px
	 */
	de.titus.jquery.DomHelper.prototype.setWith = function(aDomElementObject, aWidth) {
		aDomElementObject.width(aWidth);
	};
	
	/**
	 * Get the width from the content area of element. (width of element - padding-left -padding-right)
	 * 
	 * @param aDomElementObject
	 * @returns int, width in px
	 */
	de.titus.jquery.DomHelper.prototype.getContentWith = function(aDomElementObject) {
		return aDomElementObject.innerWidth();
	};
	
	/**
	 * Set the width from the content area of element.
	 * 
	 * @param aDomElementObject
	 * @param aWidth
	 */
	de.titus.jquery.DomHelper.prototype.setContentWith = function(aDomElementObject, aWidth) {
		aDomElementObject.innerWidth(aWidth);
	};
	
	/**
	 * Get the height of element.
	 * 
	 * @param aDomElementObject
	 * @returns int, height in px
	 */
	de.titus.jquery.DomHelper.prototype.getHeight = function(aDomElementObject) {
		return aDomElementObject.height();
	};
	
	/**
	 * Set the height of element.
	 * 
	 * @param aDomElementObject
	 * @param aHeight
	 */
	de.titus.jquery.DomHelper.prototype.setHeight = function(aDomElementObject, aHeight) {
		aDomElementObject.height(aHeight);
	};
	
	/**
	 * Get the height from the content area of element. (width of element - padding-top -padding-bottom)
	 * 
	 * @param aDomElementObject
	 * @returns int, height in px
	 */
	de.titus.jquery.DomHelper.prototype.getContentHeight = function(aDomElementObject) {
		return aDomElementObject.innerHeight();
	};
	
	/**
	 * Get the height from the content area of element.
	 * 
	 * @param aDomElementObject
	 * @param aHeight
	 */
	de.titus.jquery.DomHelper.prototype.setContentHeight = function(aDomElementObject, aHeight) {
		aDomElementObject.innerHeight(aHeight);
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getChilds = function(aDomElementObject) {
		return aDomElementObject.children() || new Array();
	};
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.getChildCount = function(aDomElementObject) {
		return this.getChilds(aDomElementObject).length;
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getParent = function(aDomElementObject) {
		return aDomElementObject.parent();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.getHtml = function(aDomElementObject) {
		return aDomElementObject.html();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aHtml
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.jquery.DomHelper.prototype.setHtml = function(aDomElementObject, aHtml, aType) {
		if (aType == undefined) {
			aDomElementObject.html(aHtml);
		} else if (aType == "append") {
			aDomElementObject.append(aHtml);
		} else if (aType == "prepend") {
			aDomElementObject.prepend(aHtml);
		} else if (aType == "replace") {
			aDomElementObject.html(aHtml);
		} else {
			throw "The type \"" + aType + "\" is not supported!";
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.getText = function(aDomElementObject) {
		return aDomElementObject.text();
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 * @param aText
	 * @param aType
	 *            values -> append, prepend, replace, [undefined]
	 */
	de.titus.jquery.DomHelper.prototype.setText = function(aDomElementObject, aText, aType) {
		if (aType == undefined) {
			aDomElementObject.text(aText);
		} else if (aType == "append") {
			var currentText = aDomElementObject.text();
			aDomElementObject.append(aText + currentText);
		} else if (aType == "prepend") {
			var currentText = aDomElementObject.text();
			aDomElementObject.append(currentText + aText);
		} else if (aType == "replace") {
			aDomElementObject.text(aText);
		} else {
			throw "The type \"" + aType + "\" is not supported!";
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.doRemove = function(aDomElementObject) {
		if ($.isArray(aDomElementObject)) {
			for (var i = 0; i < aDomElementObject.length; i++) {
				aDomElementObject[i].remove();
			}
		} else {
			aDomElementObject.remove();
		}
	};
	
	/**
	 * 
	 * @param aDomElementObject
	 */
	de.titus.jquery.DomHelper.prototype.doRemoveChilds = function(aDomElementObject) {
		aDomElementObject.empty();
	};
	
	/**
	 * 
	 * @param aId
	 */
	de.titus.jquery.DomHelper.prototype.getDomElementById = function(aId) {
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.jquery.DomHelper.prototype.doRemoteLoadHtml = function(theSettings, aCallback) {
		var settings = {
		    dataType : "html",
		    success : aCallback
		};
		settings = $().extend(theSettings, settings);
		$.ajax(settings);
	};
	
	/**
	 * 
	 * @param theSettings
	 * @param aCallback
	 */
	de.titus.jquery.DomHelper.prototype.doRemoteLoadJson = function(theSettings, aCallback) {
		var settings = {
		    dataType : "json",
		    success : aCallback
		};
		settings = $().extend(theSettings, settings);
		$.ajax(settings);
	};
	
	/**
	 * 
	 * @param aObject1
	 * @param aObject2
	 * @returns
	 */
	de.titus.jquery.DomHelper.prototype.mergeObjects = function(aObject1, aObject2) {
		return $().extend(aObject1, aObject2);
	};
	
	/**
	 * @param aVariable
	 * 
	 * @returns true, it the parameter a function.
	 */
	de.titus.jquery.DomHelper.prototype.isFunction = function(aVariable) {
		return $.isFunction(aVariable);
	};
	
	/**
	 * 
	 * @param aKey
	 * @param aData
	 */
	de.titus.jquery.DomHelper.prototype.setBindData = function(aDomElementObject, aKey, aData) {
		aDomElementObject.data(aKey, aData);
	};
	
	/**
	 * 
	 * @param aKey
	 */
	de.titus.jquery.DomHelper.prototype.getBindData = function(aDomElementObject, aKey) {
		return aDomElementObject.data(aKey);
	};
	
	/**
	 * 
	 * @param aValue
	 *            true = show item or false = hide item
	 */
	de.titus.jquery.DomHelper.prototype.doShow = function(aDomElementObject, aValue) {
		if (aValue)
			aDomElementObject.show();
		else
			aDomElementObject.hide();
	};
	
	/**
	 * 
	 */
	de.titus.jquery.DomHelper.prototype.getValue = function(aDomElementObject) {
		return aDomElementObject.val();
	};
	
	/**
	 * 
	 * @param aValue
	 */
	de.titus.jquery.DomHelper.prototype.setValue = function(aDomElementObject, aValue) {
		aDomElementObject.val(aValue);
	};
	
	/**
	 * 
	 * @param aEvent
	 *            click, keyup, change
	 * @param aCallback
	 */
	de.titus.jquery.DomHelper.prototype.addEvent = function(aDomElementObject, aEvent, aCallback) {
		aDomElementObject.bind(aEvent, aCallback);
	};
	
	/**
	 * 
	 * @param aVariable
	 * 
	 * @returns true, if the parameter a array;
	 */
	de.titus.jquery.DomHelper.prototype.isArray = function(aVariable) {
		return $.isArray(aVariable) || aVariable.length != undefined;
	};
	
	/**
	 * Call the function, after dom is ready!
	 * 
	 * @param afunction
	 * 
	 */
	de.titus.jquery.DomHelper.prototype.doOnReady = function(aFunction) {
		$(document).ready(aFunction);
	};
	
	/**
	 * 
	 */
	de.titus.jquery.DomHelper.getInstance = function() {
		return new de.titus.jquery.DomHelper();
	};
	
	if ($ != undefined) {
		de.titus.core.DomHelper.getInstance = function() {
			return new de.titus.jquery.DomHelper();
		};
	}
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
			if (aText == undefined || aText !== "string" || aText == "")
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
	
	de.titus.logging.ConsolenAppender = function(){
	};
	
	de.titus.logging.ConsolenAppender.prototype = new de.titus.logging.LogAppender();
	de.titus.logging.ConsolenAppender.prototype.constructor = de.titus.logging.ConsolenAppender;
	
	de.titus.logging.ConsolenAppender.prototype.logMessage=  function(aMessage, anException, aLoggerName, aDate, aLogLevel){
		var log = "";
		if(aDate)
			log += log = this.formatedDateString(aDate) + " ";
		
		log += "***" + aLogLevel.title + "*** " + aLoggerName + "";
		
		if(aMessage)
			log += " -> " + aMessage;
		if(anException)
			log += ": " + anException;
		
		console.log(log);
	};
});de.titus.core.Namespace.create("de.titus.logging.HtmlAppender", function() {
	
	
	
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
	de.titus.jstl.Constants = {};
	de.titus.jstl.Constants.EVENTS = {};
	de.titus.jstl.Constants.EVENTS.onLoad = "jstl-on-load";
	de.titus.jstl.Constants.EVENTS.onSuccess = "jstl-on-success";
	de.titus.jstl.Constants.EVENTS.onFail = "jstl-on-fail";
	de.titus.jstl.Constants.EVENTS.onReady = "jstl-on-ready";
	
});de.titus.core.Namespace.create("de.titus.jstl.FunctionRegistry", function() {	
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
de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {	
	de.titus.jstl.functions.If = function(){};
	de.titus.jstl.functions.If.prototype = new de.titus.jstl.IFunction("if");
	de.titus.jstl.functions.If.prototype.constructor = de.titus.jstl.functions.If;
	
	/****************************************************************
	 * static variables
	 ***************************************************************/
	de.titus.jstl.functions.If.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If");
	
	
	de.titus.jstl.functions.If.prototype.run = /*boolean*/function(aElement, aDataContext, aProcessor){
		if(de.titus.jstl.functions.If.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.If.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if(expression != undefined){
			var expressionResult = expressionResolver.resolveExpression(expression, aDataContext, false);
			if(typeof expressionResult === "function")
				expressionResult = expressionResult(aElement, aDataContext, aProcessor);
			
			
			expressionResult = expressionResult == true || expressionResult == "true";
			if(!expressionResult){
				aElement.remove();
				return new de.titus.jstl.FunctionResult(false, false);
			}
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
	de.titus.jstl.functions.Choose = function() {
	};
	de.titus.jstl.functions.Choose.prototype = new de.titus.jstl.IFunction("choose");
	de.titus.jstl.functions.Choose.prototype.constructor = de.titus.jstl.functions.Choose;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	de.titus.jstl.functions.Choose.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	de.titus.jstl.functions.Choose.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			
			this.processChilds(aElement, aDataContext, processor, expressionResolver);
			return new de.titus.jstl.FunctionResult(true, true);
		}		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.Choose.prototype.processChilds = function(aChooseElement, aDataContext, aProcessor, aExpressionResolver) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute processChilds(" + aChooseElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var childs = aChooseElement.children();
		var resolved = false;
		var $__THIS__$ = this;
		childs.each(function() {			
			var child = $(this);
			if (!resolved && $__THIS__$.processChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver)) {
				if (de.titus.jstl.functions.Choose.LOGGER.isTraceEnabled())
					de.titus.jstl.functions.Choose.LOGGER.logTrace("compute child: " + child);
				resolved = true;
			} else {
				if (de.titus.jstl.functions.Choose.LOGGER.isTraceEnabled())
					de.titus.jstl.functions.Choose.LOGGER.logTrace("remove child: " + child);
				child.remove();
			}
		});
	};
	
	de.titus.jstl.functions.Choose.prototype.processChild = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute processChild(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		if (this.processWhenElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver)) {
			return true;
		} else if (this.processOtherwiseElement(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver)) {
			return true;
		} else {
			return false;
		}
	};
	
	de.titus.jstl.functions.Choose.prototype.processWhenElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute processWhenElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.attr(aProcessor.config.attributePrefix + 'when');
		if (expression != undefined) {
			return aExpressionResolver.resolveExpression(expression, aDataContext, false);
		}
		return false;
	};
	
	de.titus.jstl.functions.Choose.prototype.processOtherwiseElement = function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
		if (de.titus.jstl.functions.Choose.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");
		
		var expression = aElement.attr(aProcessor.config.attributePrefix + 'otherwise');
		if (expression != undefined) {
			return true;
		}
		return false;
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
	de.titus.jstl.functions.Foreach = function() {
	};
	de.titus.jstl.functions.Foreach.prototype = new de.titus.jstl.IFunction("foreach");
	de.titus.jstl.functions.Foreach.prototype.constructor = de.titus.jstl.functions.Foreach;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	de.titus.jstl.functions.Foreach.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	de.titus.jstl.functions.Foreach.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.Foreach.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcession(expression, aElement, aDataContext, processor, expressionResolver);
			return new de.titus.jstl.FunctionResult(false, false);
		}
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.Foreach.prototype.internalProcession = function(aExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		if (de.titus.jstl.functions.Foreach.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Foreach.LOGGER.logDebug("execute processList(" + aElement + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
		
		var tempalte = this.getRepeatableContent(aElement);
		aElement.empty();
		if (tempalte == undefined)
			return;
		
		var varName = this.getVarname(aElement, aProcessor);
		var statusName = this.getStatusName(aElement, aProcessor);
		var list = undefined;
		if (aExpression == "") {
			de.titus.jstl.functions.Foreach.LOGGER.logWarn("No list data specified. Using the data context!");
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
	
	de.titus.jstl.functions.Foreach.prototype.processList = function(aListData, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, anExpressionResolver) {
		if (aListData == undefined || aListData.length == undefined || aListData.length < 1)
			return;
		
		var startIndex = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-start-index") || 0;
		startIndex = anExpressionResolver.resolveExpression(startIndex, aDataContext, 0) || 0;
		for (var i = startIndex; i < aListData.length; i++) {
			var newContent = $("<div>").html(aTemplate);
			var newContext = jQuery.extend({}, aDataContext);
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
	
	de.titus.jstl.functions.Foreach.prototype.processMap = function(aMap, aTemplate, aVarname, aStatusName, aBreakCondition, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var count = 0;
		for ( var name in aMap)
			count++;
		
		var i = 0;
		for ( var name in aMap) {
			var newContent = $("<div>").html(aTemplate);
			var newContext = jQuery.extend({}, aDataContext);
			newContext[aVarname] = aMap[name];
			newContext[aStatusName] = {
			"index" : i,
			"number" : (i + 1),
			"key": name,
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
	
	de.titus.jstl.functions.Foreach.prototype.processBreakCondition = function(aContext, aBreakCondition, aElement, aProcessor) {
		var expressionResolver = aProcessor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		var expressionResult = expressionResolver.resolveExpression(aBreakCondition, aContext, false);
		if (typeof expressionResult === "function")
			expressionResult = expressionResult(aElement, aContext, aProcessor);
		
		return expressionResult == true || expressionResult == "true";
	};
	
	de.titus.jstl.functions.Foreach.prototype.processNewContent = function(aNewContent, aNewContext, aElement, aProcessor) {		
		aProcessor.compute(	aNewContent, aNewContext);
		aElement.append(aNewContent.contents());
	};
	
	de.titus.jstl.functions.Foreach.prototype.getVarname = function(aElement, aProcessor) {
		var varname = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-var");
		if (varname == undefined)
			return "itemVar";
		
		return varname;
	};
	
	de.titus.jstl.functions.Foreach.prototype.getStatusName = function(aElement, aProcessor) {
		var statusName = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-status");
		if (statusName == undefined)
			return "statusVar";
		
		return statusName;
	};
	
	de.titus.jstl.functions.Foreach.prototype.getRepeatableContent = function(aElement) {
		return aElement.html();
	};
});
de.titus.core.Namespace.create("de.titus.jstl.functions.TextContent", function() {
	de.titus.jstl.functions.TextContent = function() {
	};
	de.titus.jstl.functions.TextContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.TextContent.prototype.constructor = de.titus.jstl.functions.TextContent;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	de.titus.jstl.functions.TextContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.TextContent");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	de.titus.jstl.functions.TextContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.TextContent.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.TextContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		var ignore = aElement.attr(processor.config.attributePrefix + "text-ignore");
		
		if (ignore != true || ignore != "true") {
			aElement.contents().filter(function() {
				return this.nodeType === 3 && this.textContent != undefined && this.textContent.trim() != "";
			}).each(function() {
				var contenttype = aElement.attr(processor.config.attributePrefix + "text-content-type") || "text";
				var node = this;
				var text = node.textContent;

				text = expressionResolver.resolveText(text, aDataContext);
				var contentFunction = de.titus.jstl.functions.TextContent.CONTENTTYPE[contenttype];
				if (contentFunction)
					contentFunction(node, text, aElement, processor, aDataContext);
			});
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	de.titus.jstl.functions.TextContent.CONTENTTYPE = {};
	de.titus.jstl.functions.TextContent.CONTENTTYPE["html"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		$(aNode).replaceWith($(aText));
	};
	de.titus.jstl.functions.TextContent.CONTENTTYPE["text/html"] = de.titus.jstl.functions.TextContent.CONTENTTYPE["html"];
	
	de.titus.jstl.functions.TextContent.CONTENTTYPE["json"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
		if (typeof aText === "string")
			aNode.textContent = aText;
		else
			aNode.textContent = JSON.stringify(aText);
	};
	de.titus.jstl.functions.TextContent.CONTENTTYPE["application/json"] = de.titus.jstl.functions.TextContent.CONTENTTYPE["json"];
	
	de.titus.jstl.functions.TextContent.CONTENTTYPE["text"] = function(aNode, aText, aBaseElement, aProcessor, aDataContext) {
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
			preventformat = aProcessor.expressionResolver.resolveExpression(preventformat, aDataContext, true);
			if (preventformat == "true" || preventformat == true) {
				text = de.titus.core.StringUtils.formatToHtml(text);
				addAsHtml = true;
			}
		}
		
		if (addAsHtml)
			$(aNode).replaceWith(text);
		else
			aNode.textContent = aText;
	};
	de.titus.jstl.functions.TextContent.CONTENTTYPE["text/plain"] = de.titus.jstl.functions.TextContent.CONTENTTYPE["text"];
});
de.titus.core.Namespace.create("de.titus.jstl.functions.AttributeContent", function() {
	de.titus.jstl.functions.AttributeContent = function() {
	};
	de.titus.jstl.functions.AttributeContent.prototype = new de.titus.jstl.IFunction();
	de.titus.jstl.functions.AttributeContent.prototype.constructor = de.titus.jstl.functions.AttributeContent;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	de.titus.jstl.functions.AttributeContent.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AttributeContent");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	de.titus.jstl.functions.AttributeContent.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.AttributeContent.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.AttributeContent.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
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
								if (de.titus.jstl.functions.AttributeContent.LOGGER.isDebugEnabled()) {
									de.titus.jstl.functions.AttributeContent.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
								}
								aElement.attr(name, newValue);
							}
						} catch (e) {
							de.titus.jstl.functions.AttributeContent.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
						}
					}
				}
			}
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
	de.titus.jstl.functions.Data = function() {
	};
	de.titus.jstl.functions.Data.prototype = new de.titus.jstl.IFunction("data");
	de.titus.jstl.functions.Data.prototype.constructor = de.titus.jstl.functions.Data;
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * static variables
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	de.titus.jstl.functions.Data.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data");
	
	/**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
	 * functions
	 *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
	
	de.titus.jstl.functions.Data.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.Data.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Data.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.core.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.Data.prototype.internalProcessing = function(anExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var varname = this.getVarname(aElement, aDataContext, aProcessor, anExpressionResolver);
		var mode = this.getMode(aElement, aProcessor, anExpressionResolver);
		if (this[mode] != undefined && typeof this[mode] === "function")
			this[mode].call(this, anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver);
		else
			this["direct"].call(this, anExpression, aElement, varname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	de.titus.jstl.functions.Data.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var options = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	de.titus.jstl.functions.Data.prototype.getMode = function(aElement, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-mode") || "direct";
	};
	
	de.titus.jstl.functions.Data.prototype.getVarname = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		return aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-var");
	};
	
	de.titus.jstl.functions.Data.prototype["direct"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		var newData = anExpressionResolver.resolveExpression(anExpression, aDataContext);
		this.addNewData(newData, aVarname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	de.titus.jstl.functions.Data.prototype["remote"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {		
		var $__THIS__$ = this;		
		var url = anExpressionResolver.resolveText(anExpression, aDataContext);
		var option = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
		
		var ajaxSettings = {
		'url' : de.titus.core.Page.getInstance().buildUrl(url),
		'async' : false,
		'cache' : false,
		'dataType' : "json"
		};
		ajaxSettings = $.extend(ajaxSettings, option);
		ajaxSettings.success = function(newData) {
			$__THIS__$.addNewData(newData, aVarname, aDataContext, aProcessor, anExpressionResolver);
		};
		
		$.ajax(ajaxSettings);
	};
	
	de.titus.jstl.functions.Data.prototype["url-parameter"] = function(anExpression, aElement, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		var parameterName = anExpressionResolver.resolveText(anExpression, aDataContext);
		var value = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
		this.addNewData(value, aVarname, aDataContext, aProcessor, anExpressionResolver);
	};
	
	de.titus.jstl.functions.Data.prototype.addNewData = function(aNewData, aVarname, aDataContext, aProcessor, anExpressionResolver) {
		if (de.titus.jstl.functions.Data.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Data.LOGGER.logDebug("execute addNewData(" + aNewData + ", " + aVarname + ", " + aDataContext + ", " + aProcessor + ", " + anExpressionResolver + ")");
		if (aVarname == undefined) {
			$.extend(true, aDataContext, aNewData);
		} else {
			aDataContext[aVarname] = aNewData;
		}
	};
});
de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {
	de.titus.jstl.functions.Include = function() {
		this.cache = {};
	};
	de.titus.jstl.functions.Include.prototype = new de.titus.jstl.IFunction("include");
	de.titus.jstl.functions.Include.prototype.constructor = de.titus.jstl.functions.Include;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	de.titus.jstl.functions.Include.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	de.titus.jstl.functions.Include.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.Include.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Include.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
		var processor = aProcessor || new de.titus.jstl.Processor();
		var expressionResolver = processor.expressionResolver || new de.titus.jstl.ExpressionResolver();
		
		var expression = aElement.attr(processor.config.attributePrefix + this.attributeName);
		if (expression != undefined) {
			this.internalProcessing(expression, aElement, aDataContext, processor, expressionResolver);
		}
		return new de.titus.jstl.FunctionResult(true, true);
	};
	
	de.titus.jstl.functions.Include.prototype.internalProcessing = function(anIncludeExpression, aElement, aDataContext, aProcessor, anExpressionResolver) {
		var url = anExpressionResolver.resolveText(anIncludeExpression, aDataContext);
		var disableCaching = url.indexOf("?") >= 0 || aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-cache-disabled") != undefined;
		var content = "";
		if (!disableCaching)
			content = this.cache[url];
		
		var includeMode = this.getIncludeMode(aElement, aDataContext, aProcessor, anExpressionResolver);
		if (content)
			this.addHtml(aElement, content, includeMode);
		else {
			var options = this.getOptions(aElement, aDataContext, aProcessor, anExpressionResolver);
			var ajaxSettings = {
			'url' : de.titus.core.Page.getInstance().buildUrl(url),
			'async' : false,
			'cache' : aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-ajax-cache-disabled") == undefined,
			"dataType" : "html"
			};
			ajaxSettings = $.extend(true, ajaxSettings, options);
			
			var $__this__$ = this;
			ajaxSettings.success = function(template) {
				$__this__$.cache[url] = template;
				$__this__$.addHtml(aElement, template, includeMode);
			};
			
			ajaxSettings.error = function(error) {
				throw JSON.stringify(error);
			};
			$.ajax(ajaxSettings)
		}
	};
	
	de.titus.jstl.functions.Include.prototype.getOptions = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var options = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-options");
		if (options != undefined) {
			options = anExpressionResolver.resolveText(options, aDataContext);
			options = anExpressionResolver.resolveExpression(options, aDataContext);
			return options || {};
		}
		
		return {};
	};
	
	de.titus.jstl.functions.Include.prototype.getIncludeMode = function(aElement, aDataContext, aProcessor, anExpressionResolver) {
		var mode = aElement.attr(aProcessor.config.attributePrefix + this.attributeName + "-mode");
		if (mode == undefined)
			return "replace";
		
		mode = mode.toLowerCase();
		if (mode == "append" || mode == "replace" || mode == "prepend")
			return mode;
		
		return "replace";
	};
	
	de.titus.jstl.functions.Include.prototype.addHtml = function(aElement, aTemplate, aIncludeMode) {
		if (de.titus.jstl.functions.Include.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.Include.LOGGER.logDebug("execute addHtml(" + aElement + ", " + aTemplate + ", " + aIncludeMode + ")");
		if (aIncludeMode == "replace")
			aElement.html(aTemplate);
		else if (aIncludeMode == "append")
			aElement.append(aTemplate);
		else if (aIncludeMode == "prepend")
			aElement.prepend(aTemplate);
		else
			aElement.html(aTemplate);
		
	};
	
});
de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
	de.titus.jstl.functions.AddAttribute = function() {
	};
	de.titus.jstl.functions.AddAttribute.prototype = new de.titus.jstl.IFunction("add-attribute");
	de.titus.jstl.functions.AddAttribute.prototype.constructor = de.titus.jstl.functions.AddAttribute;
	
	/***************************************************************************
	 * static variables
	 **************************************************************************/
	de.titus.jstl.functions.AddAttribute.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AddAttribute");
	
	/***************************************************************************
	 * functions
	 **************************************************************************/
	
	de.titus.jstl.functions.AddAttribute.prototype.run = function(aElement, aDataContext, aProcessor) {
		if (de.titus.jstl.functions.AddAttribute.LOGGER.isDebugEnabled())
			de.titus.jstl.functions.AddAttribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
		
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
	
	de.titus.jstl.functions.AddAttribute.prototype.processArray = function(theDataArray, aElement, aDataContext, aProcessor) {
		for (var i = 0; i < theDataArray.length; i++) {
			this.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
		}
	};
	
	de.titus.jstl.functions.AddAttribute.prototype.processObject = function(theData, aElement, aDataContext, aProcessor) {
		if (theData.name != undefined) {
			aElement.attr(theData.name, theData.value);
		} else {
			de.titus.jstl.functions.AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
		}
	};
	
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
		de.titus.jstl.Processor = function(aConfig) {
			
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
		de.titus.jstl.Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");
		
		/***********************************************************************
		 * functions
		 **********************************************************************/
		
		de.titus.jstl.Processor.prototype.compute = /* boolean */function(aElement, aDataContext) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute compute(" + (aElement != undefined ? aElement.prop("tagName") : aElement) + ", " + aDataContext + ")");
			if (aElement == undefined)
				return this.internalComputeRoot();
			
			if (!this.isElementProcessable(aElement)) {
				return true;
			}
			
			var events = this.getEvents(aElement) || {};
			return this.internalComputeElement(aElement, aDataContext, events, false);
		};
		
		de.titus.jstl.Processor.prototype.internalComputeRoot = /* boolean */function() {
			var events = this.getEvents(this.config.element) || {};
			if (this.config.onLoad)
				events.onLoad = this.config.onLoad;
			if (this.config.onSuccess)
				events.onSuccess = this.config.onSuccess;
			if (this.config.onFail)
				events.onFail = this.config.onFail;
			return this.internalComputeElement(this.config.element, this.config.data, events, true);
		};
		
		de.titus.jstl.Processor.prototype.internalComputeElement = /* boolean */function(aElement, aDataContext, theEvents, isRoot) {
			var dataContext = aDataContext || this.config.data;
			if (!isRoot) {
				var ignore = aElement.attr(this.config.attributePrefix + "ignore");
				if (ignore != undefined && ignore != "")
					ignore = de.titus.core.SpecialFunctions.doEvalWithContext(ignore, aDataContext, false);
				
				if (ignore == true || ignore == "true") {
					return true;
				}
			}
			
			if (theEvents.onLoad != undefined && typeof theEvents.onLoad === "function")
				theEvents.onLoad(aElement, aDataContext, this);
			aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, aDataContext);
			
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
				$(document).ready(function() {
					processor.onReady();
				});
			}
			
			return processResult;
		};
		
		de.titus.jstl.Processor.prototype.isElementProcessable = function(aElement) {
			var tagname = aElement.tagName();
			if (tagname != undefined) {
				if (tagname == "br")
					return false;
				
				return true;
			}
			return false;
		};
		
		de.titus.jstl.Processor.prototype.internalExecuteFunction = /* boolean */function(aElement, aDataContext) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute internalExecuteFunction(" + aElement + ", " + aDataContext + ")");
			
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
		
		de.titus.jstl.Processor.prototype.internalComputeChilds = /* boolean */function(aElement, aDataContext) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute internalComputeChilds(" + aElement + ", " + aDataContext + ")");
			
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
		
		de.titus.jstl.Processor.prototype.getEvents = function(aElement) {
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
		
		de.titus.jstl.Processor.prototype.isFunctionNeeded = function(aFunction, aElement) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute isFunctionNeeded(" + aFunction + ", " + aElement + ")");
			
			var executeFunction = true;
			if (aFunction.attributeName != undefined && aFunction.attributeName != "") {
				var expression = aElement.attr(this.config.attributePrefix + aFunction.attributeName);
				executeFunction = expression !== undefined;
			}
			
			return executeFunction;
		};
		
		de.titus.jstl.Processor.prototype.executeFunction = function(aFunction, aElement, aDataContext, aCurrentFunctionResult) {
			if (de.titus.jstl.Processor.LOGGER.isDebugEnabled())
				de.titus.jstl.Processor.LOGGER.logDebug("execute executeFunction(" + aFunction + ", " + aElement + ", " + aDataContext + ", " + aCurrentFunctionResult + ")");
			
			var result = aFunction.run(aElement, aDataContext, this);
			if (result != undefined) {
				aCurrentFunctionResult.runNextFunction = aCurrentFunctionResult.runNextFunction && result.runNextFunction;
				aCurrentFunctionResult.processChilds = aCurrentFunctionResult.processChilds && result.processChilds;
			}
			
			return aCurrentFunctionResult;
		};
		
		de.titus.jstl.Processor.prototype.onReady = function(aFunction) {
			if (aFunction) {
				// this.onReadyEvent.push(aFunction);
				this.config.element.on(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else {
				for (var i = 0; i < this.onReadyEvent.length; i++) {
					try {
						this.onReadyEvent[i](this.config.element, this);
					} catch (e) {
						de.titus.jstl.Processor.LOGGER.logError("Error by process an on ready event! -> " + (e.message || e));
					}
				}
				
				this.config.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, this);
			}
		};
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
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.TextContent());
	de.titus.jstl.FunctionRegistry.getInstance().add(new de.titus.jstl.functions.AttributeContent());
	
});

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
	
	(function($) {
		$.fn.jstl = function(/* config */aConfig) {
			var config = {
				"element" : this
			};
			config = $.extend(config, aConfig);
			new de.titus.jstl.Processor(config).compute();
		};
		
	}(jQuery));
	
	$(document).ready(function() {
		$("[jstl-autorun]").each(function() {
			$(this).jstl();
		});
	});
	
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


