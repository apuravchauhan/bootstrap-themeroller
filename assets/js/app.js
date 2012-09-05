/* ============================================================
 * app.js v1.0
 * http://bootstrapthemeroller.com
 * ============================================================
 * Copyright Apurav Chauhan, 2012
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
 * ========================================================== 
 */
var themeRoller;
$(function(){
	//initialize BootstrapThemeroller service
	themeRoller = new BootstrapThemeroller();

	//register events
	$('.input-append.color').colorpicker().on('hide', function(ev){
		 $(this).find('input').change();
	});
	$('.input-append.color input').change(themeRoller.updateColorPicker);
	$('[themeroller="true"]').change(themeRoller.updateTextFields);
	$('[name="downloadTheme"]').click(themeRoller.downloadTheme);

	// Modified from the original jsonpi https://github.com/benvinegar/jquery-jsonpi
	$.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
	  var url = opts.url;
	  return {
		send: function(_, completeCallback) {
		  var name = 'jQuery_iframe_' + jQuery.now()
			, iframe, form

		  iframe = $('<iframe>')
			.attr('name', name)
			.appendTo('head')

		  form = $('<form>')
			.attr('method', opts.type) // GET or POST
			.attr('action', url)
			.attr('target', name)

		  $.each(opts.params, function(k, v) {

			$('<input>')
			  .attr('type', 'hidden')
			  .attr('name', k)
			  .attr('value', typeof v == 'string' ? v : JSON.stringify(v))
			  .appendTo(form)
		  })

		  form.appendTo('body').submit()
		}
	  }
 });

themeRoller.initTheme();
})//end loader function

/*
* BootstrapThemeroller service class
*/
function BootstrapThemeroller(){
	/*
	 *check if less variables are provided in url #, if yes, then reload the style
	 */
	this.initTheme = function(){
		var lessKeyValStringArray = location.hash.substring(1).split('&');
		var lessKeyValStringArraySize =  lessKeyValStringArray.length;

		for(keyValStrinIndex=0;keyValStrinIndex<lessKeyValStringArraySize;keyValStrinIndex++){
			lessKeyValPair = lessKeyValStringArray[keyValStrinIndex].split('=');
			if(lessKeyValPair.length==2){
				var selector = '[less-var="'+lessKeyValPair[0]+'"]';
				$(selector).val(lessKeyValPair[1]).change();
			}
		}
	}

	this.getUpdatedLessVars = function(){
		var finalLessMap = {};
		$('[themeroller="true"] , .input-append.color input').each(function(index){
		  var val = $(this).val();
		  var lessVar = $(this).attr('less-var');
			 
		  if($.trim(val)!=''){
			finalLessMap[lessVar] = val;
		  }
		});
		return finalLessMap;
	};

	this.updateUrl = function(){
			var finalLessMap = this.getUpdatedLessVars();
			var lessString ='';
			for(key in  finalLessMap){
				lessString += key+ '='+finalLessMap[key]+'&';

			}
			location.hash = lessString;
	};
	this.downloadTheme = function(){
			var finalLessMap = themeRoller.getUpdatedLessVars();
			var css = ["reset.less","scaffolding.less","grid.less","layouts.less","type.less","code.less","labels-badges.less","tables.less","forms.less","buttons.less","sprites.less","button-groups.less","navs.less","navbar.less","breadcrumbs.less","pagination.less","pager.less","thumbnails.less","alerts.less","progress-bars.less","hero-unit.less","tooltip.less","popovers.less","modals.less","dropdowns.less","accordion.less","carousel.less","wells.less","close.less","utilities.less","component-animations.less","responsive-utilities.less","responsive-767px-max.less","responsive-768px-979px.less","responsive-1200px-min.less","responsive-navbar.less"]
			, js = ["bootstrap-transition.js","bootstrap-modal.js","bootstrap-dropdown.js","bootstrap-scrollspy.js","bootstrap-tab.js","bootstrap-tooltip.js","bootstrap-popover.js","bootstrap-alert.js","bootstrap-button.js","bootstrap-collapse.js","bootstrap-carousel.js","bootstrap-typeahead.js"]
			, vars = finalLessMap
			, img = ["glyphicons-halflings.png","glyphicons-halflings-white.png"];
			
			
			$.ajax({
			type: 'POST'
		  , url: 'http://bootstrap.herokuapp.com'
		  , dataType: 'jsonpi'
		  , params: {
			  js: js
			, css: css
			, vars: vars
			, img: img
		  }
		  })
		};

	this.updateColorPicker = function(){
		  var val = $(this).val();
		  var lessVar = $(this).attr('less-var');
		 
		  var parentEle = $(this).parent();
		  if($.trim(val)==''){
			val = parentEle.attr('data-color');
		  }
			var colorpicker =  parentEle.data('colorpicker');
			colorpicker.update(val);
			var lessMap = {};
			lessMap[lessVar] = val;
			less.modifyVars(lessMap);
			themeRoller.updateUrl();
	  };
	this.updateTextFields = function(){
		  var val = $(this).val();
		  var lessVar = $(this).attr('less-var');
			 
		  if($.trim(val)==''){
			val = $(this).attr('placeholder');
		  }
			
			var lessMap = {};
			lessMap[lessVar] = val;
			less.modifyVars(lessMap);
			themeRoller.updateUrl();
	  };
	
}

