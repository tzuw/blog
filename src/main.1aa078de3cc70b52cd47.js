/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/main.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/ArchivePagination.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ArchivePagination.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_archive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js/archive */ \"./src/js/archive.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'ArchivePagination',\n  data: function () {\n    return {\n      totalPage: -1,\n      perPage: 5,\n      currentPage: 1,\n      html4ArticleTitles: '',\n      articleTitles: [],\n      delimiter: '<h5></h5>',\n      observer: null\n    };\n  },\n\n  created() {\n    console.log(this.itemType);\n  },\n\n  beforeDestroy: function () {\n    this.observer.disconnect();\n  },\n  computed: {\n    articleTitlesTemp() {\n      return this.articleTitles.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage);\n    },\n\n    totalRows() {\n      return this.articleTitles.length;\n    }\n\n  },\n  watch: {},\n\n  mounted() {\n    /* WHY USE IN MOUNT HERE ? */\n    this.parseArticleTitlesHtml(this.html4ArticleTitles);\n    /* MutationObserver */\n\n    this.observer = new MutationObserver(function (mutations) {\n      this.parseArticleTitlesHtml(document.getElementById('htmlToVue').outerHTML);\n    }.bind(this));\n    this.observer.observe(document.getElementById('htmlToVue'), {\n      attributes: true,\n      childList: true,\n      characterData: true,\n      subtree: true\n    });\n  },\n\n  updated: function () {\n    this.$nextTick(function () {\n      /**\n       * Code that will run only after the entire view has been re-rendered\n       */\n      this.itemType === 'tag' && Object(_js_archive__WEBPACK_IMPORTED_MODULE_0__[\"onTagSelect\"])(false, 'tags');\n      this.itemType === 'category' && Object(_js_archive__WEBPACK_IMPORTED_MODULE_0__[\"onTagSelect\"])(false, 'categories');\n    });\n  },\n  props: {\n    itemType: String\n  },\n  methods: {\n    parseArticleTitlesHtml: function (html4Titles) {\n      /**\n       * split the rendered html using 'delimiter'\n       */\n      let pos = html4Titles.lastIndexOf(\"</div>\");\n      let temp = html4Titles.slice(0, pos) + html4Titles.slice(pos).replace(\"</div>\", \"\");\n      temp = temp.split(\"<section>\").join(\"\").split(\"</section>\").join(\"\"); // delete <section>\n\n      /**\n       * eliminate htmlToVue id, which should only be found in template during replacing html content in slot.\n       */\n\n      this.articleTitles = temp.replace(\"<div id=\\\"htmlToVue\\\">\", \"\").split(this.delimiter).slice(0, -1);\n      /**\n       * filter of articles for tag selection\n       */\n\n      this.articleTitles = this.articleTitles.filter(function (part) {\n        return part.indexOf(\"d-none\") === -1;\n      });\n    },\n    handler4TagClick: function () {}\n  }\n});\n\n//# sourceURL=webpack:///./src/components/ArchivePagination.vue?./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ArchivePagination.vue?vue&type=template&id=15691bfc&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ArchivePagination.vue?vue&type=template&id=15691bfc& ***!
  \***********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    { staticClass: \"mt-3\" },\n    [\n      _c(\"vnode-to-html\", {\n        attrs: { vnode: _vm.$slots.default },\n        on: {\n          html: function($event) {\n            _vm.html4ArticleTitles = $event\n          }\n        }\n      }),\n      _vm._v(\" \"),\n      _vm._l(_vm.articleTitlesTemp, function(item, index) {\n        return _c(\n          \"div\",\n          { key: index, domProps: { innerHTML: _vm._s(item) } },\n          [_vm._v(\"\\n        \" + _vm._s(item) + \"\\n    \")]\n        )\n      }),\n      _vm._v(\" \"),\n      _c(\"b-pagination\", {\n        attrs: { \"total-rows\": _vm.totalRows, \"per-page\": _vm.perPage },\n        model: {\n          value: _vm.currentPage,\n          callback: function($$v) {\n            _vm.currentPage = $$v\n          },\n          expression: \"currentPage\"\n        }\n      }),\n      _vm._v(\" \"),\n      _c(\"ul\", { staticClass: \"pagination\" }, [\n        _c(\"li\", { staticClass: \"page-item active\" }, [\n          _c(\"a\", { staticClass: \"page-link\" }, [\n            _vm._v(\"Total \" + _vm._s(_vm.totalRows))\n          ])\n        ])\n      ])\n    ],\n    2\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/ArchivePagination.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/components/ArchivePagination.vue":
/*!**********************************************!*\
  !*** ./src/components/ArchivePagination.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ArchivePagination_vue_vue_type_template_id_15691bfc___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArchivePagination.vue?vue&type=template&id=15691bfc& */ \"./src/components/ArchivePagination.vue?vue&type=template&id=15691bfc&\");\n/* harmony import */ var _ArchivePagination_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArchivePagination.vue?vue&type=script&lang=js& */ \"./src/components/ArchivePagination.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _ArchivePagination_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _ArchivePagination_vue_vue_type_template_id_15691bfc___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _ArchivePagination_vue_vue_type_template_id_15691bfc___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/ArchivePagination.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/ArchivePagination.vue?");

/***/ }),

/***/ "./src/components/ArchivePagination.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./src/components/ArchivePagination.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ArchivePagination_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib!../../node_modules/vue-loader/lib??vue-loader-options!./ArchivePagination.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/components/ArchivePagination.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ArchivePagination_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/ArchivePagination.vue?");

/***/ }),

/***/ "./src/components/ArchivePagination.vue?vue&type=template&id=15691bfc&":
/*!*****************************************************************************!*\
  !*** ./src/components/ArchivePagination.vue?vue&type=template&id=15691bfc& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ArchivePagination_vue_vue_type_template_id_15691bfc___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./ArchivePagination.vue?vue&type=template&id=15691bfc& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ArchivePagination.vue?vue&type=template&id=15691bfc&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ArchivePagination_vue_vue_type_template_id_15691bfc___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ArchivePagination_vue_vue_type_template_id_15691bfc___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/ArchivePagination.vue?");

/***/ }),

/***/ "./src/js/archive.js":
/*!***************************!*\
  !*** ./src/js/archive.js ***!
  \***************************/
/*! exports provided: onTagSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"onTagSelect\", function() { return onTagSelect; });\n/*\nCredits: this script is shamelessly borrowed from\nhttps://github.com/kitian616/jekyll-TeXt-theme\n*/\nfunction onTagSelect(isInit = false, name, targetName, query) {\n  var setUrlQuery = function () {\n    var baseUrl = window.location.href.split('?')[0];\n    return function (query) {\n      if (typeof query === 'string') {\n        window.history.replaceState(null, '', baseUrl + query);\n      } else {\n        window.history.replaceState(null, '', baseUrl);\n      }\n    };\n  }();\n\n  function init() {\n    var i,\n        index = 0;\n\n    for (i = 0; i < $sections.length; i++) {\n      sectionTopArticleIndex.push(index);\n      index += $sections.eq(i).find('.item').length;\n    }\n\n    sectionTopArticleIndex.push(index);\n  }\n\n  function searchButtonsByTag(tag\n  /*raw tag*/\n  ) {\n    if (!tag) {\n      return $tagShowAll;\n    }\n\n    var _buttons = $articleTags.filter('[data-' + name + '-encode=\"' + tag + '\"]');\n\n    if (_buttons.length === 0) {\n      return $tagShowAll;\n    }\n\n    return _buttons;\n  }\n\n  function tagSelect(tag\n  /*raw tag*/\n  , target) {\n    var result = {},\n        $articles;\n\n    var i, j, k, _tag;\n\n    for (i = 0; i < sectionArticles.length; i++) {\n      $articles = sectionArticles[i];\n\n      for (j = 0; j < $articles.length; j++) {\n        if (tag === '' || tag === undefined) {\n          result[i] || (result[i] = {});\n          result[i][j] = true;\n        } else {\n          var tags = $articles.eq(j).data(name).split(',');\n\n          for (k = 0; k < tags.length; k++) {\n            if (tags[k] === tag) {\n              result[i] || (result[i] = {});\n              result[i][j] = true;\n              break;\n            }\n          }\n        }\n      }\n    }\n\n    for (i = 0; i < sectionArticles.length; i++) {\n      result[i] && $sections.eq(i).removeClass('d-none');\n      result[i] || $sections.eq(i).addClass('d-none');\n\n      for (j = 0; j < sectionArticles[i].length; j++) {\n        if (result[i] && result[i][j]) {\n          sectionArticles[i].eq(j).removeClass('d-none');\n        } else {\n          sectionArticles[i].eq(j).addClass('d-none');\n        }\n      }\n    }\n\n    hasInit || ($result.removeClass('d-none'), hasInit = true);\n\n    if (target) {\n      buttonFocus(searchButtonsByTag(tag)); // buttonFocus(target);\n\n      _tag = target.attr('data-' + name + '-encode');\n\n      if (_tag === '' || typeof _tag !== 'string') {\n        setUrlQuery();\n      } else {\n        setUrlQuery('?' + name + '=' + _tag);\n      }\n    } else {\n      buttonFocus(searchButtonsByTag(tag));\n    }\n  }\n\n  function onSelect(items) {\n    $articleTags = items.find('.tag-button');\n    $tagShowAll = items.find('.tag-button--all'); // var $result = $('.js-result');\n\n    $result = $('.template-4-select');\n    $sections = $result.find('section');\n    $sections.each(function () {\n      sectionArticles.push($(this).find('.item'));\n    });\n    items.on('click', 'a', function () {\n      /* only change */\n      tagSelect($(this).data(name + '-encode'), $(this));\n      let tagTitle = this.title ? ' - ' + this.title : \"\";\n      document.getElementById(\"intro-header-item\").innerHTML = '<h3>' + name + tagTitle + '</h3>';\n\n      window.onload = function () {\n        $result = $('.template-4-select');\n        $sections = $result.find('section');\n        document.getElementById(htmlToVue).innerHTML = $sections;\n      };\n    });\n  }\n\n  var sectionArticles = [];\n  var $articleTags;\n  var $sections;\n  var $result;\n  var $tagShowAll;\n  var hasInit;\n\n  if (isInit) {\n    // var $result = $('.js-result');\n    var sectionTopArticleIndex = [];\n    hasInit = false;\n\n    window.onload = function () {\n      if (name === 'tags') {\n        onSelect($('.js-tags'));\n      } else {\n        onSelect($('.js-categories'));\n      }\n\n      init();\n      tagSelect(targetName);\n      document.getElementById(\"intro-header-item\").innerHTML = '<h3>' + name + ' - ' + decodeURI(targetName).replace(/\\+/g, ' ') + '</h3>';\n    };\n  } else {\n    hasInit = true;\n\n    if (name === 'tags') {\n      $('.js-tags').off('click');\n      onSelect($('.js-tags'));\n    } else {\n      $('.js-categories').off('click');\n      onSelect($('.js-categories'));\n    }\n  }\n}\n\n;\n\n(function () {\n  function queryString() {\n    // This function is anonymous, is executed immediately and\n    // the return value is assigned to QueryString!\n    var i = 0,\n        queryObj = {},\n        pair;\n    var queryStr = window.location.search.substring(1);\n    var queryArr = queryStr.split('&');\n\n    for (i = 0; i < queryArr.length; i++) {\n      pair = queryArr[i].split('='); // If first entry with this name\n\n      if (typeof queryObj[pair[0]] === 'undefined') {\n        queryObj[pair[0]] = pair[1]; // If second entry with this name\n      } else if (typeof queryObj[pair[0]] === 'string') {\n        queryObj[pair[0]] = [queryObj[pair[0]], pair[1]]; // If third or later entry with this name\n      } else {\n        queryObj[pair[0]].push(pair[1]);\n      }\n    }\n\n    return queryObj;\n  }\n\n  window.buttonFocus = function (target) {\n    if (target) {\n      target.addClass('focus');\n      window.lastFocusButton && !window.lastFocusButton.is(target) && window.lastFocusButton.removeClass('focus');\n      window.lastFocusButton = target;\n    }\n  };\n\n  var lastFocusButton = null;\n  var query = queryString();\n  query.tags && onTagSelect(true, 'tags', query.tags, query);\n  query.categories && onTagSelect(true, 'categories', query.categories, query);\n  !query.tags && '/tags.html' === window.location.pathname && buttonFocus($('.js-tags').find('.tag-button--all'));\n  !query.categories && '/categories.html' === window.location.pathname && buttonFocus($('.js-categories').find('.tag-button--all'));\n})();\n\n\n\n//# sourceURL=webpack:///./src/js/archive.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm.js\");\n/* harmony import */ var _components_ArchivePagination__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/ArchivePagination */ \"./src/components/ArchivePagination.vue\");\n/* harmony import */ var bootstrap_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bootstrap-vue */ \"./node_modules/bootstrap-vue/esm/index.js\");\n // import HelloWorld from './components/HelloWorld'\n// import TagColorLoader from './components/TagColorLoader'\n\n // import {mapState, mapGetters, mapActions} from 'vuex';\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].component('b-table', bootstrap_vue__WEBPACK_IMPORTED_MODULE_2__[\"BTable\"]);\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].component('b-pagination', bootstrap_vue__WEBPACK_IMPORTED_MODULE_2__[\"BPagination\"]);\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].component('vnode-to-html', {\n  props: ['vnode'],\n\n  render(createElement) {\n    return createElement(\"template\", {\n      'class': {\n        'template-4-select': true\n      }\n    }, [this.vnode]);\n  },\n\n  mounted() {\n    this.$emit('html', [...this.$el.childNodes].map(n => n.outerHTML).join('\\n'));\n  }\n\n});\nconst app = new vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n  el: '#app',\n  delimiters: ['#{', '}'],\n  components: {\n    archivePagination: _components_ArchivePagination__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n  }\n});\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });