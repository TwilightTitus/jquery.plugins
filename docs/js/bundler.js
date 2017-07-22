(function($) {
	de.titus.core.Namespace.create("de.titus.js.Bundler", function() {
		var Bundler = de.titus.js.Bundler = function(element) {
			this.element = element;

		};

		Bundler.prototype.doHandleDependencies = function(aEvent) {
			if (aEvent == undefined)
				return Bundler.prototype.doHandleDependencies.bind(this);
			var element = $(aEvent.target);
			if (element.is(":checked")) {
				var dependencies = element.attr("data-module-dependencies") || "";

				if (dependencies != "") {
					var dependencies = dependencies.split(",");
					for (var i = 0; i < dependencies.length; i++)
						this.element.find("[data-module=" + dependencies[i].trim() + "]").prop("checked", true);
				}
			}
		};

		Bundler.prototype.doHandleDownloadButtons = function(aEvent) {
			if (aEvent == undefined)
				return Bundler.prototype.doHandleDownloadButtons.bind(this);

			if (this.element.find("[data-module]:checked").length > 0)
				this.element.removeClass("state-no-selection");
			else
				this.element.addClass("state-no-selection");
		};

		Bundler.prototype.doBundle = function(aEvent) {
			if (aEvent == undefined)
				return Bundler.prototype.doBundle.bind(this);

			this.element.removeClass("state-waiting").addClass("state-bundling");

			var jsType = $(aEvent.currentTarget).attr("data-js-type");
			var codes = [ "js/license-header.js" ];
			this.element.find("[data-module]:checked").each(function() {
				var element = $(this);
				codes.push(element.attr("data-module-" + jsType));
				element.prop("disabled", true);
			});

			var filename = "de.titus.bundle" + (jsType == "js" ? ".js" : ".min.js");
			var concat = function(aCodes, aBundleCode, aCallback, aResponse) {
				if (aResponse) {
					aBundleCode += aResponse;
				}
				if (aCodes.length > 0) {
					var request = {
						url : aCodes.splice(0, 1)
					};
					$.ajax(request).done(concat.bind({}, aCodes, aBundleCode, aCallback));
				} else
					aCallback(aBundleCode);
			};
			concat(codes, "", Bundler.prototype.__generateDownloadLink.bind(this, filename));
		};

		Bundler.prototype.__generateDownloadLink = function(aFilename, aBundleCode) {
			var file = new Blob([ aBundleCode ], {
				type : "text/javascript"
			});
			var element = this.element.find(".module-bundler-result .download");
			element.attr('href', URL.createObjectURL(file));
			element.attr('download', aFilename);

			this.element.removeClass("state-bundling").addClass("state-finished");
		};

		de.titus.core.jquery.Components.asComponent("de.titus.js.Bundler", de.titus.js.Bundler);
	});
})($);
