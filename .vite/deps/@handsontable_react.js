import {
  require_react_dom
} from "./chunk-ZU5SFTFX.js";
import {
  require_react
} from "./chunk-QTVD6AVW.js";
import {
  base_default
} from "./chunk-EA2GDYZS.js";
import {
  _getItem,
  _getItem2
} from "./chunk-NKMIMUPW.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/@handsontable/react/es/react-handsontable.mjs
var import_react = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function() {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf(t, e);
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
var bulkComponentContainer = null;
var AUTOSIZE_WARNING = "Your `HotTable` configuration includes `autoRowSize`/`autoColumnSize` options, which are not compatible with  the component-based renderers`. Disable `autoRowSize` and `autoColumnSize` to prevent row and column misalignment.";
var HOT_DESTROYED_WARNING = "The Handsontable instance bound to this component was destroyed and cannot be used properly.";
var GLOBAL_EDITOR_SCOPE = "global";
var DEFAULT_CLASSNAME = "hot-wrapper-editor-container";
function warn() {
  if (typeof console !== "undefined") {
    var _console;
    (_console = console).warn.apply(_console, arguments);
  }
}
function getChildElementByType(children, type) {
  var childrenArray = import_react.default.Children.toArray(children);
  var childrenCount = import_react.default.Children.count(children);
  var wantedChild = null;
  if (childrenCount !== 0) {
    if (childrenCount === 1 && childrenArray[0].props[type]) {
      wantedChild = childrenArray[0];
    } else {
      wantedChild = childrenArray.find(function(child) {
        return child.props[type] !== void 0;
      });
    }
  }
  return wantedChild || null;
}
function getOriginalEditorClass(editorElement) {
  if (!editorElement) {
    return null;
  }
  return editorElement.type.WrappedComponent ? editorElement.type.WrappedComponent : editorElement.type;
}
function createEditorPortal(doc, editorElement) {
  if (typeof doc === "undefined" || editorElement === null) {
    return null;
  }
  var containerProps = getContainerAttributesProps(editorElement.props, false);
  containerProps.className = "".concat(DEFAULT_CLASSNAME, " ").concat(containerProps.className);
  return import_react_dom.default.createPortal(import_react.default.createElement("div", Object.assign({}, containerProps), editorElement), doc.body);
}
function getExtendedEditorElement(children, editorCache) {
  var editorColumnScope = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : GLOBAL_EDITOR_SCOPE;
  var editorElement = getChildElementByType(children, "hot-editor");
  var editorClass = getOriginalEditorClass(editorElement);
  if (!editorElement) {
    return null;
  }
  return import_react.default.cloneElement(editorElement, {
    emitEditorInstance: function emitEditorInstance(editorInstance, editorColumnScope2) {
      if (!editorCache.get(editorClass)) {
        editorCache.set(editorClass, /* @__PURE__ */ new Map());
      }
      var cacheEntry = editorCache.get(editorClass);
      cacheEntry.set(editorColumnScope2 !== null && editorColumnScope2 !== void 0 ? editorColumnScope2 : GLOBAL_EDITOR_SCOPE, editorInstance);
    },
    editorColumnScope,
    isEditor: true
  });
}
function createPortal(rElement, props) {
  var ownerDocument = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : document;
  var portalKey = arguments.length > 3 ? arguments[3] : void 0;
  var cachedContainer = arguments.length > 4 ? arguments[4] : void 0;
  if (!ownerDocument) {
    ownerDocument = document;
  }
  if (!bulkComponentContainer) {
    bulkComponentContainer = ownerDocument.createDocumentFragment();
  }
  var portalContainer = cachedContainer !== null && cachedContainer !== void 0 ? cachedContainer : ownerDocument.createElement("DIV");
  bulkComponentContainer.appendChild(portalContainer);
  var extendedRendererElement = import_react.default.cloneElement(rElement, _objectSpread2({
    key: "".concat(props.row, "-").concat(props.col)
  }, props));
  return {
    portal: import_react_dom.default.createPortal(extendedRendererElement, portalContainer, portalKey),
    portalContainer
  };
}
function getContainerAttributesProps(props) {
  var randomizeId = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  return {
    id: props.id || (randomizeId ? "hot-" + Math.random().toString(36).substring(5) : void 0),
    className: props.className || "",
    style: props.style || {}
  };
}
function isCSR() {
  return typeof window !== "undefined";
}
var SettingsMapper = function() {
  function SettingsMapper2() {
    _classCallCheck(this, SettingsMapper2);
  }
  return _createClass(SettingsMapper2, null, [{
    key: "getSettings",
    value: (
      /**
       * Parse component settings into Handosntable-compatible settings.
       *
       * @param {Object} properties Object containing properties from the HotTable object.
       * @param {Object} additionalSettings Additional settings.
       * @param {boolean} additionalSettings.isInit Flag determining whether the settings are being set during initialization.
       * @param {string[]} additionalSettings.initOnlySettingKeys Array of keys that can be set only during initialization.
       * @returns {Object} Handsontable-compatible settings object.
       */
      function getSettings(properties) {
        var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$prevProps = _ref.prevProps, prevProps = _ref$prevProps === void 0 ? {} : _ref$prevProps, _ref$isInit = _ref.isInit, isInit = _ref$isInit === void 0 ? false : _ref$isInit, _ref$initOnlySettingK = _ref.initOnlySettingKeys, initOnlySettingKeys = _ref$initOnlySettingK === void 0 ? [] : _ref$initOnlySettingK;
        var shouldSkipProp = function shouldSkipProp2(key2) {
          if (!isInit && initOnlySettingKeys.includes(key2)) {
            return prevProps[key2] === properties[key2];
          }
          return false;
        };
        var newSettings = {};
        if (properties.settings) {
          var settings = properties.settings;
          for (var key in settings) {
            if (settings.hasOwnProperty(key) && !shouldSkipProp(key)) {
              newSettings[key] = settings[key];
            }
          }
        }
        for (var _key in properties) {
          if (_key !== "settings" && _key !== "children" && !shouldSkipProp(_key) && properties.hasOwnProperty(_key)) {
            newSettings[_key] = properties[_key];
          }
        }
        return newSettings;
      }
    )
  }]);
}();
var HotColumn = function(_React$Component) {
  function HotColumn2() {
    _classCallCheck(this, HotColumn2);
    return _callSuper(this, HotColumn2, arguments);
  }
  _inherits(HotColumn2, _React$Component);
  return _createClass(HotColumn2, [{
    key: "getSettingsProps",
    value: (
      /**
       * Filter out all the internal properties and return an object with just the Handsontable-related props.
       *
       * @returns {Object}
       */
      function getSettingsProps() {
        var _this = this;
        this.internalProps = ["_componentRendererColumns", "_emitColumnSettings", "_columnIndex", "_getChildElementByType", "_getRendererWrapper", "_getEditorClass", "_getEditorCache", "_getOwnerDocument", "hot-renderer", "hot-editor", "children"];
        return Object.keys(this.props).filter(function(key) {
          return !_this.internalProps.includes(key);
        }).reduce(function(obj, key) {
          obj[key] = _this.props[key];
          return obj;
        }, {});
      }
    )
    /**
     * Get the editor element for the current column.
     *
     * @returns {React.ReactElement} React editor component element.
     */
  }, {
    key: "getLocalEditorElement",
    value: function getLocalEditorElement() {
      return getExtendedEditorElement(this.props.children, this.props._getEditorCache(), this.props._columnIndex);
    }
    /**
     * Create the column settings based on the data provided to the `HotColumn` component and it's child components.
     */
  }, {
    key: "createColumnSettings",
    value: function createColumnSettings() {
      var rendererElement = this.props._getChildElementByType(this.props.children, "hot-renderer");
      var editorElement = this.getLocalEditorElement();
      this.columnSettings = SettingsMapper.getSettings(this.getSettingsProps());
      if (rendererElement !== null) {
        this.columnSettings.renderer = this.props._getRendererWrapper(rendererElement);
        this.props._componentRendererColumns.set(this.props._columnIndex, true);
      }
      if (editorElement !== null) {
        this.columnSettings.editor = this.props._getEditorClass(editorElement, this.props._columnIndex);
      }
    }
    /**
     * Emit the column settings to the parent using a prop passed from the parent.
     */
  }, {
    key: "emitColumnSettings",
    value: function emitColumnSettings() {
      this.props._emitColumnSettings(this.columnSettings, this.props._columnIndex);
    }
    /*
    ---------------------------------------
    ------- React lifecycle methods -------
    ---------------------------------------
    */
    /**
     * Logic performed after the mounting of the HotColumn component.
     */
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createColumnSettings();
      this.emitColumnSettings();
    }
    /**
     * Logic performed after the updating of the HotColumn component.
     */
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.createColumnSettings();
      this.emitColumnSettings();
    }
    /**
     * Render the portals of the editors, if there are any.
     *
     * @returns {React.ReactElement}
     */
  }, {
    key: "render",
    value: function render() {
      var ownerDocument = this.props._getOwnerDocument();
      var editorPortal = createEditorPortal(ownerDocument, this.getLocalEditorElement());
      return import_react.default.createElement(import_react.default.Fragment, null, editorPortal);
    }
  }]);
}(import_react.default.Component);
var RenderersPortalManager = function(_React$Component) {
  function RenderersPortalManager2() {
    var _this;
    _classCallCheck(this, RenderersPortalManager2);
    _this = _callSuper(this, RenderersPortalManager2, arguments);
    _this.state = {
      portals: []
    };
    return _this;
  }
  _inherits(RenderersPortalManager2, _React$Component);
  return _createClass(RenderersPortalManager2, [{
    key: "render",
    value: function render() {
      return import_react.default.createElement(import_react.default.Fragment, null, this.state.portals);
    }
  }]);
}(import_react.default.Component);
var version = "14.6.2";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var propTypes = { exports: {} };
var reactIs = { exports: {} };
var reactIs_development = {};
var hasRequiredReactIs_development;
function requireReactIs_development() {
  if (hasRequiredReactIs_development) return reactIs_development;
  hasRequiredReactIs_development = 1;
  if (true) {
    (function() {
      var hasSymbol = typeof Symbol === "function" && Symbol["for"];
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 60103;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol["for"]("react.portal") : 60106;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol["for"]("react.fragment") : 60107;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol["for"]("react.strict_mode") : 60108;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol["for"]("react.profiler") : 60114;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol["for"]("react.provider") : 60109;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol["for"]("react.context") : 60110;
      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol["for"]("react.async_mode") : 60111;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol["for"]("react.concurrent_mode") : 60111;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol["for"]("react.forward_ref") : 60112;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol["for"]("react.suspense") : 60113;
      var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol["for"]("react.suspense_list") : 60120;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol["for"]("react.memo") : 60115;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol["for"]("react.lazy") : 60116;
      var REACT_BLOCK_TYPE = hasSymbol ? Symbol["for"]("react.block") : 60121;
      var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol["for"]("react.fundamental") : 60117;
      var REACT_RESPONDER_TYPE = hasSymbol ? Symbol["for"]("react.responder") : 60118;
      var REACT_SCOPE_TYPE = hasSymbol ? Symbol["for"]("react.scope") : 60119;
      function isValidElementType(type) {
        return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || _typeof(type) === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
      }
      function typeOf(object) {
        if (_typeof(object) === "object" && object !== null) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;
              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;
                default:
                  var $$typeofType = type && type.$$typeof;
                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
        return void 0;
      }
      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;
      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }
      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }
      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return _typeof(object) === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }
      reactIs_development.AsyncMode = AsyncMode;
      reactIs_development.ConcurrentMode = ConcurrentMode;
      reactIs_development.ContextConsumer = ContextConsumer;
      reactIs_development.ContextProvider = ContextProvider;
      reactIs_development.Element = Element;
      reactIs_development.ForwardRef = ForwardRef;
      reactIs_development.Fragment = Fragment;
      reactIs_development.Lazy = Lazy;
      reactIs_development.Memo = Memo;
      reactIs_development.Portal = Portal;
      reactIs_development.Profiler = Profiler;
      reactIs_development.StrictMode = StrictMode;
      reactIs_development.Suspense = Suspense;
      reactIs_development.isAsyncMode = isAsyncMode;
      reactIs_development.isConcurrentMode = isConcurrentMode;
      reactIs_development.isContextConsumer = isContextConsumer;
      reactIs_development.isContextProvider = isContextProvider;
      reactIs_development.isElement = isElement;
      reactIs_development.isForwardRef = isForwardRef;
      reactIs_development.isFragment = isFragment;
      reactIs_development.isLazy = isLazy;
      reactIs_development.isMemo = isMemo;
      reactIs_development.isPortal = isPortal;
      reactIs_development.isProfiler = isProfiler;
      reactIs_development.isStrictMode = isStrictMode;
      reactIs_development.isSuspense = isSuspense;
      reactIs_development.isValidElementType = isValidElementType;
      reactIs_development.typeOf = typeOf;
    })();
  }
  return reactIs_development;
}
var hasRequiredReactIs;
function requireReactIs() {
  if (hasRequiredReactIs) return reactIs.exports;
  hasRequiredReactIs = 1;
  if (false) {
    reactIs.exports = requireReactIs_production_min();
  } else {
    reactIs.exports = requireReactIs_development();
  }
  return reactIs.exports;
}
var objectAssign;
var hasRequiredObjectAssign;
function requireObjectAssign() {
  if (hasRequiredObjectAssign) return objectAssign;
  hasRequiredObjectAssign = 1;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  function toObject(val) {
    if (val === null || val === void 0) {
      throw new TypeError("Object.assign cannot be called with null or undefined");
    }
    return Object(val);
  }
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
      var test1 = new String("abc");
      test1[5] = "de";
      if (Object.getOwnPropertyNames(test1)[0] === "5") {
        return false;
      }
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2["_" + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
        return test2[n];
      });
      if (order2.join("") !== "0123456789") {
        return false;
      }
      var test3 = {};
      "abcdefghijklmnopqrst".split("").forEach(function(letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  objectAssign = shouldUseNative() ? Object.assign : function(target, source) {
    var from;
    var to = toObject(target);
    var symbols;
    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
    return to;
  };
  return objectAssign;
}
var ReactPropTypesSecret_1;
var hasRequiredReactPropTypesSecret;
function requireReactPropTypesSecret() {
  if (hasRequiredReactPropTypesSecret) return ReactPropTypesSecret_1;
  hasRequiredReactPropTypesSecret = 1;
  var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  ReactPropTypesSecret_1 = ReactPropTypesSecret;
  return ReactPropTypesSecret_1;
}
var has;
var hasRequiredHas;
function requireHas() {
  if (hasRequiredHas) return has;
  hasRequiredHas = 1;
  has = Function.call.bind(Object.prototype.hasOwnProperty);
  return has;
}
var checkPropTypes_1;
var hasRequiredCheckPropTypes;
function requireCheckPropTypes() {
  if (hasRequiredCheckPropTypes) return checkPropTypes_1;
  hasRequiredCheckPropTypes = 1;
  var printWarning = function printWarning2() {
  };
  if (true) {
    var ReactPropTypesSecret = requireReactPropTypesSecret();
    var loggedTypeFailures = {};
    var has2 = requireHas();
    printWarning = function printWarning2(text) {
      var message = "Warning: " + text;
      if (typeof console !== "undefined") {
        console.error(message);
      }
      try {
        throw new Error(message);
      } catch (x) {
      }
    };
  }
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    if (true) {
      for (var typeSpecName in typeSpecs) {
        if (has2(typeSpecs, typeSpecName)) {
          var error;
          try {
            if (typeof typeSpecs[typeSpecName] !== "function") {
              var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + _typeof(typeSpecs[typeSpecName]) + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
              err.name = "Invariant Violation";
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning((componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + _typeof(error) + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).");
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            loggedTypeFailures[error.message] = true;
            var stack = getStack ? getStack() : "";
            printWarning("Failed " + location + " type: " + error.message + (stack != null ? stack : ""));
          }
        }
      }
    }
  }
  checkPropTypes.resetWarningCache = function() {
    if (true) {
      loggedTypeFailures = {};
    }
  };
  checkPropTypes_1 = checkPropTypes;
  return checkPropTypes_1;
}
var factoryWithTypeCheckers;
var hasRequiredFactoryWithTypeCheckers;
function requireFactoryWithTypeCheckers() {
  if (hasRequiredFactoryWithTypeCheckers) return factoryWithTypeCheckers;
  hasRequiredFactoryWithTypeCheckers = 1;
  var ReactIs = requireReactIs();
  var assign = requireObjectAssign();
  var ReactPropTypesSecret = requireReactPropTypesSecret();
  var has2 = requireHas();
  var checkPropTypes = requireCheckPropTypes();
  var printWarning = function printWarning2() {
  };
  if (true) {
    printWarning = function printWarning2(text) {
      var message = "Warning: " + text;
      if (typeof console !== "undefined") {
        console.error(message);
      }
      try {
        throw new Error(message);
      } catch (x) {
      }
    };
  }
  function emptyFunctionThatReturnsNull() {
    return null;
  }
  factoryWithTypeCheckers = function factoryWithTypeCheckers2(isValidElement, throwOnDirectAccess) {
    var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = "@@iterator";
    function getIteratorFn(maybeIterable) {
      var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
      if (typeof iteratorFn === "function") {
        return iteratorFn;
      }
    }
    var ANONYMOUS = "<<anonymous>>";
    var ReactPropTypes = {
      array: createPrimitiveTypeChecker("array"),
      bigint: createPrimitiveTypeChecker("bigint"),
      bool: createPrimitiveTypeChecker("boolean"),
      func: createPrimitiveTypeChecker("function"),
      number: createPrimitiveTypeChecker("number"),
      object: createPrimitiveTypeChecker("object"),
      string: createPrimitiveTypeChecker("string"),
      symbol: createPrimitiveTypeChecker("symbol"),
      any: createAnyTypeChecker(),
      arrayOf: createArrayOfTypeChecker,
      element: createElementTypeChecker(),
      elementType: createElementTypeTypeChecker(),
      instanceOf: createInstanceTypeChecker,
      node: createNodeChecker(),
      objectOf: createObjectOfTypeChecker,
      oneOf: createEnumTypeChecker,
      oneOfType: createUnionTypeChecker,
      shape: createShapeTypeChecker,
      exact: createStrictShapeTypeChecker
    };
    function is(x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    }
    function PropTypeError(message, data) {
      this.message = message;
      this.data = data && _typeof(data) === "object" ? data : {};
      this.stack = "";
    }
    PropTypeError.prototype = Error.prototype;
    function createChainableTypeChecker(validate) {
      if (true) {
        var manualPropTypeCallCache = {};
        var manualPropTypeWarningCount = 0;
      }
      function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;
        if (secret !== ReactPropTypesSecret) {
          if (throwOnDirectAccess) {
            var err = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");
            err.name = "Invariant Violation";
            throw err;
          } else if (typeof console !== "undefined") {
            var cacheKey = componentName + ":" + propName;
            if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3) {
              printWarning("You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.");
              manualPropTypeCallCache[cacheKey] = true;
              manualPropTypeWarningCount++;
            }
          }
        }
        if (props[propName] == null) {
          if (isRequired) {
            if (props[propName] === null) {
              return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
            }
            return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
          }
          return null;
        } else {
          return validate(props, propName, componentName, location, propFullName);
        }
      }
      var chainedCheckType = checkType.bind(null, false);
      chainedCheckType.isRequired = checkType.bind(null, true);
      return chainedCheckType;
    }
    function createPrimitiveTypeChecker(expectedType) {
      function validate(props, propName, componentName, location, propFullName, secret) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== expectedType) {
          var preciseType = getPreciseType(propValue);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."), {
            expectedType
          });
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createAnyTypeChecker() {
      return createChainableTypeChecker(emptyFunctionThatReturnsNull);
    }
    function createArrayOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== "function") {
          return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
        }
        var propValue = props[propName];
        if (!Array.isArray(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
        }
        for (var i = 0; i < propValue.length; i++) {
          var error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createElementTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!isValidElement(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createElementTypeTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!ReactIs.isValidElementType(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createInstanceTypeChecker(expectedClass) {
      function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
          var expectedClassName = expectedClass.name || ANONYMOUS;
          var actualClassName = getClassName(props[propName]);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createEnumTypeChecker(expectedValues) {
      if (!Array.isArray(expectedValues)) {
        if (true) {
          if (arguments.length > 1) {
            printWarning("Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).");
          } else {
            printWarning("Invalid argument supplied to oneOf, expected an array.");
          }
        }
        return emptyFunctionThatReturnsNull;
      }
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        for (var i = 0; i < expectedValues.length; i++) {
          if (is(propValue, expectedValues[i])) {
            return null;
          }
        }
        var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
          var type = getPreciseType(value);
          if (type === "symbol") {
            return String(value);
          }
          return value;
        });
        return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
      }
      return createChainableTypeChecker(validate);
    }
    function createObjectOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== "function") {
          return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
        }
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== "object") {
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
        }
        for (var key in propValue) {
          if (has2(propValue, key)) {
            var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createUnionTypeChecker(arrayOfTypeCheckers) {
      if (!Array.isArray(arrayOfTypeCheckers)) {
        true ? printWarning("Invalid argument supplied to oneOfType, expected an instance of array.") : void 0;
        return emptyFunctionThatReturnsNull;
      }
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (typeof checker !== "function") {
          printWarning("Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i + ".");
          return emptyFunctionThatReturnsNull;
        }
      }
      function validate(props, propName, componentName, location, propFullName) {
        var expectedTypes = [];
        for (var i2 = 0; i2 < arrayOfTypeCheckers.length; i2++) {
          var checker2 = arrayOfTypeCheckers[i2];
          var checkerResult = checker2(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
          if (checkerResult == null) {
            return null;
          }
          if (checkerResult.data && has2(checkerResult.data, "expectedType")) {
            expectedTypes.push(checkerResult.data.expectedType);
          }
        }
        var expectedTypesMessage = expectedTypes.length > 0 ? ", expected one of type [" + expectedTypes.join(", ") + "]" : "";
        return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`" + expectedTypesMessage + "."));
      }
      return createChainableTypeChecker(validate);
    }
    function createNodeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        if (!isNode(props[propName])) {
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function invalidValidatorError(componentName, location, propFullName, key, type) {
      return new PropTypeError((componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`.");
    }
    function createShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== "object") {
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
        }
        for (var key in shapeTypes) {
          var checker = shapeTypes[key];
          if (typeof checker !== "function") {
            return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
          }
          var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createStrictShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== "object") {
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
        }
        var allKeys = assign({}, props[propName], shapeTypes);
        for (var key in allKeys) {
          var checker = shapeTypes[key];
          if (has2(shapeTypes, key) && typeof checker !== "function") {
            return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
          }
          if (!checker) {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  "));
          }
          var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function isNode(propValue) {
      switch (_typeof(propValue)) {
        case "number":
        case "string":
        case "undefined":
          return true;
        case "boolean":
          return !propValue;
        case "object":
          if (Array.isArray(propValue)) {
            return propValue.every(isNode);
          }
          if (propValue === null || isValidElement(propValue)) {
            return true;
          }
          var iteratorFn = getIteratorFn(propValue);
          if (iteratorFn) {
            var iterator = iteratorFn.call(propValue);
            var step;
            if (iteratorFn !== propValue.entries) {
              while (!(step = iterator.next()).done) {
                if (!isNode(step.value)) {
                  return false;
                }
              }
            } else {
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  if (!isNode(entry[1])) {
                    return false;
                  }
                }
              }
            }
          } else {
            return false;
          }
          return true;
        default:
          return false;
      }
    }
    function isSymbol(propType, propValue) {
      if (propType === "symbol") {
        return true;
      }
      if (!propValue) {
        return false;
      }
      if (propValue["@@toStringTag"] === "Symbol") {
        return true;
      }
      if (typeof Symbol === "function" && propValue instanceof Symbol) {
        return true;
      }
      return false;
    }
    function getPropType(propValue) {
      var propType = _typeof(propValue);
      if (Array.isArray(propValue)) {
        return "array";
      }
      if (propValue instanceof RegExp) {
        return "object";
      }
      if (isSymbol(propType, propValue)) {
        return "symbol";
      }
      return propType;
    }
    function getPreciseType(propValue) {
      if (typeof propValue === "undefined" || propValue === null) {
        return "" + propValue;
      }
      var propType = getPropType(propValue);
      if (propType === "object") {
        if (propValue instanceof Date) {
          return "date";
        } else if (propValue instanceof RegExp) {
          return "regexp";
        }
      }
      return propType;
    }
    function getPostfixForTypeWarning(value) {
      var type = getPreciseType(value);
      switch (type) {
        case "array":
        case "object":
          return "an " + type;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + type;
        default:
          return type;
      }
    }
    function getClassName(propValue) {
      if (!propValue.constructor || !propValue.constructor.name) {
        return ANONYMOUS;
      }
      return propValue.constructor.name;
    }
    ReactPropTypes.checkPropTypes = checkPropTypes;
    ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
    ReactPropTypes.PropTypes = ReactPropTypes;
    return ReactPropTypes;
  };
  return factoryWithTypeCheckers;
}
if (true) {
  ReactIs = requireReactIs();
  throwOnDirectAccess = true;
  propTypes.exports = requireFactoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
} else {
  propTypes.exports = requireFactoryWithThrowingShims()();
}
var ReactIs;
var throwOnDirectAccess;
var propTypesExports = propTypes.exports;
var PropTypes = getDefaultExportFromCjs(propTypesExports);
var HotTableClass = function(_React$Component) {
  function HotTableClass2() {
    var _this;
    _classCallCheck(this, HotTableClass2);
    _this = _callSuper(this, HotTableClass2, arguments);
    _this.id = null;
    _this.__hotInstance = null;
    _this.hotElementRef = null;
    _this.columnSettings = [];
    _this.renderersPortalManager = null;
    _this.portalCache = /* @__PURE__ */ new Map();
    _this.portalContainerCache = /* @__PURE__ */ new Map();
    _this.renderedCellCache = /* @__PURE__ */ new Map();
    _this.editorCache = /* @__PURE__ */ new Map();
    _this.componentRendererColumns = /* @__PURE__ */ new Map();
    return _this;
  }
  _inherits(HotTableClass2, _React$Component);
  return _createClass(HotTableClass2, [{
    key: "hotInstance",
    get: (
      /**
       * Getter for the property storing the Handsontable instance.
       */
      function get() {
        if (!this.__hotInstance || this.__hotInstance && !this.__hotInstance.isDestroyed) {
          return this.__hotInstance;
        } else {
          console.warn(HOT_DESTROYED_WARNING);
          return null;
        }
      }
    ),
    set: (
      /**
       * Setter for the property storing the Handsontable instance.
       * @param {Handsontable} hotInstance The Handsontable instance.
       */
      function set(hotInstance) {
        this.__hotInstance = hotInstance;
      }
    )
    /**
     * Get Portal Container Cache
     *
     * @returns {Map}
     */
  }, {
    key: "_isHotInstanceDestroyed",
    value: function _isHotInstanceDestroyed() {
      return this.__hotInstance && this.__hotInstance.isDestroyed;
    }
  }, {
    key: "getPortalContainerCache",
    value: function getPortalContainerCache() {
      return this.portalContainerCache;
    }
    /**
     * Get the rendered table cell cache.
     *
     * @returns {Map}
     */
  }, {
    key: "getRenderedCellCache",
    value: function getRenderedCellCache() {
      return this.renderedCellCache;
    }
    /**
     * Get the editor cache and return it.
     *
     * @returns {Map}
     */
  }, {
    key: "getEditorCache",
    value: function getEditorCache() {
      return this.editorCache;
    }
    /**
     * Clear both the editor and the renderer cache.
     */
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.getRenderedCellCache().clear();
      this.componentRendererColumns.clear();
    }
    /**
     * Get the `Document` object corresponding to the main component element.
     *
     * @returns The `Document` object used by the component.
     */
  }, {
    key: "getOwnerDocument",
    value: function getOwnerDocument() {
      if (isCSR()) {
        return this.hotElementRef ? this.hotElementRef.ownerDocument : document;
      }
      return null;
    }
    /**
     * Set the reference to the main Handsontable DOM element.
     *
     * @param {HTMLElement} element The main Handsontable DOM element.
     */
  }, {
    key: "setHotElementRef",
    value: function setHotElementRef(element) {
      this.hotElementRef = element;
    }
    /**
     * Return a renderer wrapper function for the provided renderer component.
     *
     * @param {React.ReactElement} rendererElement React renderer component.
     * @returns {Handsontable.renderers.Base} The Handsontable rendering function.
     */
  }, {
    key: "getRendererWrapper",
    value: function getRendererWrapper(rendererElement) {
      var hotTableComponent = this;
      return function __internalRenderer(instance, TD, row, col, prop, value, cellProperties) {
        var renderedCellCache = hotTableComponent.getRenderedCellCache();
        var portalContainerCache = hotTableComponent.getPortalContainerCache();
        var key = "".concat(row, "-").concat(col);
        var instanceGuid = instance.guid;
        var portalContainerKey = "".concat(instanceGuid, "-").concat(key);
        var portalKey = "".concat(key, "-").concat(instanceGuid);
        if (renderedCellCache.has(key)) {
          TD.innerHTML = renderedCellCache.get(key).innerHTML;
        }
        if (TD && !TD.getAttribute("ghost-table")) {
          var cachedPortal = hotTableComponent.portalCache.get(portalKey);
          var cachedPortalContainer = portalContainerCache.get(portalContainerKey);
          while (TD.firstChild) {
            TD.removeChild(TD.firstChild);
          }
          if (cachedPortal && cachedPortalContainer) {
            TD.appendChild(cachedPortalContainer);
          } else {
            var _createPortal = createPortal(rendererElement, {
              TD,
              row,
              col,
              prop,
              value,
              cellProperties,
              isRenderer: true
            }, TD.ownerDocument, portalKey, cachedPortalContainer), portal = _createPortal.portal, portalContainer = _createPortal.portalContainer;
            portalContainerCache.set(portalContainerKey, portalContainer);
            TD.appendChild(portalContainer);
            hotTableComponent.portalCache.set(portalKey, portal);
          }
        }
        renderedCellCache.set(key, TD);
        return TD;
      };
    }
    /**
     * Create a fresh class to be used as an editor, based on the provided editor React element.
     *
     * @param {React.ReactElement} editorElement React editor component.
     * @param {string|number} [editorColumnScope] The editor scope (column index or a 'global' string). Defaults to
     * 'global'.
     * @returns {Function} A class to be passed to the Handsontable editor settings.
     */
  }, {
    key: "getEditorClass",
    value: function getEditorClass(editorElement) {
      var _this$getEditorCache$;
      var editorColumnScope = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : GLOBAL_EDITOR_SCOPE;
      var editorClass = getOriginalEditorClass(editorElement);
      var cachedComponent = (_this$getEditorCache$ = this.getEditorCache().get(editorClass)) === null || _this$getEditorCache$ === void 0 ? void 0 : _this$getEditorCache$.get(editorColumnScope);
      return this.makeEditorClass(cachedComponent);
    }
    /**
     * Create a class to be passed to the Handsontable's settings.
     *
     * @param {React.ReactElement} editorComponent React editor component.
     * @returns {Function} A class to be passed to the Handsontable editor settings.
     */
  }, {
    key: "makeEditorClass",
    value: function makeEditorClass(editorComponent) {
      var customEditorClass = function(_Handsontable$editors) {
        function CustomEditor(hotInstance) {
          var _this2;
          _classCallCheck(this, CustomEditor);
          _this2 = _callSuper(this, CustomEditor, [hotInstance]);
          editorComponent.hotCustomEditorInstance = _this2;
          _this2.editorComponent = editorComponent;
          return _this2;
        }
        _inherits(CustomEditor, _Handsontable$editors);
        return _createClass(CustomEditor, [{
          key: "focus",
          value: function focus() {
          }
        }, {
          key: "getValue",
          value: function getValue() {
          }
        }, {
          key: "setValue",
          value: function setValue() {
          }
        }, {
          key: "open",
          value: function open() {
          }
        }, {
          key: "close",
          value: function close() {
          }
        }]);
      }(base_default.editors.BaseEditor);
      Object.getOwnPropertyNames(base_default.editors.BaseEditor.prototype).forEach(function(propName) {
        if (propName === "constructor") {
          return;
        }
        customEditorClass.prototype[propName] = function() {
          var _editorComponent$prop;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return (_editorComponent$prop = editorComponent[propName]).call.apply(_editorComponent$prop, [editorComponent].concat(args));
        };
      });
      return customEditorClass;
    }
    /**
     * Get the renderer element for the entire HotTable instance.
     *
     * @returns {React.ReactElement} React renderer component element.
     */
  }, {
    key: "getGlobalRendererElement",
    value: function getGlobalRendererElement() {
      return getChildElementByType(this.props.children, "hot-renderer");
    }
    /**
     * Get the editor element for the entire HotTable instance.
     *
     * @param {React.ReactNode} [children] Children of the HotTable instance. Defaults to `this.props.children`.
     * @returns {React.ReactElement} React editor component element.
     */
  }, {
    key: "getGlobalEditorElement",
    value: function getGlobalEditorElement() {
      return getExtendedEditorElement(this.props.children, this.getEditorCache());
    }
    /**
     * Create a new settings object containing the column settings and global editors and renderers.
     *
     * @param {boolean} [init=false] `true` if called on Handsontable initialization.
     * @param {HotTableProps} [prevProps] The previous properties object.
     * @returns {Handsontable.GridSettings} New global set of settings for Handsontable.
     */
  }, {
    key: "createNewGlobalSettings",
    value: function createNewGlobalSettings() {
      var _this$hotInstance;
      var init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var prevProps = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var initOnlySettingKeys = !this._isHotInstanceDestroyed() ? (
        // Needed for React's double-rendering.
        ((_this$hotInstance = this.hotInstance) === null || _this$hotInstance === void 0 || (_this$hotInstance = _this$hotInstance.getSettings()) === null || _this$hotInstance === void 0 ? void 0 : _this$hotInstance._initOnlySettings) || []
      ) : [];
      var newSettings = SettingsMapper.getSettings(this.props, {
        prevProps,
        isInit: init,
        initOnlySettingKeys
      });
      var globalRendererNode = this.getGlobalRendererElement();
      var globalEditorNode = this.getGlobalEditorElement();
      newSettings.columns = this.columnSettings.length ? this.columnSettings : newSettings.columns;
      if (globalEditorNode) {
        newSettings.editor = this.getEditorClass(globalEditorNode, GLOBAL_EDITOR_SCOPE);
      } else {
        var _this$props$settings;
        if (this.props.editor || (_this$props$settings = this.props.settings) !== null && _this$props$settings !== void 0 && _this$props$settings.editor) {
          newSettings.editor = this.props.editor || this.props.settings.editor;
        } else {
          newSettings.editor = _getItem("text");
        }
      }
      if (globalRendererNode) {
        newSettings.renderer = this.getRendererWrapper(globalRendererNode);
        this.componentRendererColumns.set("global", true);
      } else {
        var _this$props$settings2;
        if (this.props.renderer || (_this$props$settings2 = this.props.settings) !== null && _this$props$settings2 !== void 0 && _this$props$settings2.renderer) {
          newSettings.renderer = this.props.renderer || this.props.settings.renderer;
        } else {
          newSettings.renderer = _getItem2("text");
        }
      }
      return newSettings;
    }
    /**
     * Detect if `autoRowSize` or `autoColumnSize` is defined, and if so, throw an incompatibility warning.
     *
     * @param {Handsontable.GridSettings} newGlobalSettings New global settings passed as Handsontable config.
     */
  }, {
    key: "displayAutoSizeWarning",
    value: function displayAutoSizeWarning(newGlobalSettings) {
      var _this$hotInstance$get, _this$hotInstance$get2;
      if (this.hotInstance && ((_this$hotInstance$get = this.hotInstance.getPlugin("autoRowSize")) !== null && _this$hotInstance$get !== void 0 && _this$hotInstance$get.enabled || (_this$hotInstance$get2 = this.hotInstance.getPlugin("autoColumnSize")) !== null && _this$hotInstance$get2 !== void 0 && _this$hotInstance$get2.enabled)) {
        if (this.componentRendererColumns.size > 0) {
          warn(AUTOSIZE_WARNING);
        }
      }
    }
    /**
     * Sets the column settings based on information received from HotColumn.
     *
     * @param {HotTableProps} columnSettings Column settings object.
     * @param {Number} columnIndex Column index.
     */
  }, {
    key: "setHotColumnSettings",
    value: function setHotColumnSettings(columnSettings, columnIndex) {
      this.columnSettings[columnIndex] = columnSettings;
    }
    /**
     * Handsontable's `beforeViewRender` hook callback.
     */
  }, {
    key: "handsontableBeforeViewRender",
    value: function handsontableBeforeViewRender() {
      this.portalCache.clear();
      this.getRenderedCellCache().clear();
    }
    /**
     * Handsontable's `afterViewRender` hook callback.
     */
  }, {
    key: "handsontableAfterViewRender",
    value: function handsontableAfterViewRender() {
      this.renderersPortalManager.setState({
        portals: _toConsumableArray(this.portalCache.values())
      });
    }
    /**
     * Call the `updateSettings` method for the Handsontable instance.
     *
     * @param {Object} newSettings The settings object.
     */
  }, {
    key: "updateHot",
    value: function updateHot(newSettings) {
      if (this.hotInstance) {
        this.hotInstance.updateSettings(newSettings, false);
      }
    }
    /**
     * Set the renderers portal manager ref.
     *
     * @param {React.ReactComponent} pmComponent The PortalManager component.
     */
  }, {
    key: "setRenderersPortalManagerRef",
    value: function setRenderersPortalManagerRef(pmComponent) {
      this.renderersPortalManager = pmComponent;
    }
    /*
    ---------------------------------------
    ------- React lifecycle methods -------
    ---------------------------------------
    */
    /**
     * Initialize Handsontable after the component has mounted.
     */
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;
      var newGlobalSettings = this.createNewGlobalSettings(true);
      this.hotInstance = new base_default.Core(this.hotElementRef, newGlobalSettings);
      this.hotInstance.addHook("beforeViewRender", function() {
        return _this3.handsontableBeforeViewRender();
      });
      this.hotInstance.addHook("afterViewRender", function() {
        return _this3.handsontableAfterViewRender();
      });
      this.hotInstance.init();
      this.displayAutoSizeWarning(newGlobalSettings);
    }
    /**
     * Logic performed after the component update.
     */
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      this.clearCache();
      var newGlobalSettings = this.createNewGlobalSettings(false, prevProps);
      this.updateHot(newGlobalSettings);
      this.displayAutoSizeWarning(newGlobalSettings);
    }
    /**
     * Destroy the Handsontable instance when the parent component unmounts.
     */
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearCache();
      if (this.hotInstance) {
        this.hotInstance.destroy();
      }
    }
    /**
     * Render the component.
     */
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var isHotColumn = function isHotColumn2(childNode) {
        return childNode.type === HotColumn;
      };
      var children = import_react.default.Children.toArray(this.props.children);
      var hotColumnClones = children.filter(function(childNode) {
        return isHotColumn(childNode);
      }).map(function(childNode, columnIndex) {
        return import_react.default.cloneElement(childNode, {
          _componentRendererColumns: _this4.componentRendererColumns,
          _emitColumnSettings: _this4.setHotColumnSettings.bind(_this4),
          _columnIndex: columnIndex,
          _getChildElementByType: getChildElementByType.bind(_this4),
          _getRendererWrapper: _this4.getRendererWrapper.bind(_this4),
          _getEditorClass: _this4.getEditorClass.bind(_this4),
          _getOwnerDocument: _this4.getOwnerDocument.bind(_this4),
          _getEditorCache: _this4.getEditorCache.bind(_this4),
          children: childNode.props.children
        });
      });
      var containerProps = getContainerAttributesProps(this.props);
      var editorPortal = createEditorPortal(this.getOwnerDocument(), this.getGlobalEditorElement());
      return import_react.default.createElement(import_react.default.Fragment, null, import_react.default.createElement("div", Object.assign({
        ref: this.setHotElementRef.bind(this)
      }, containerProps), hotColumnClones), import_react.default.createElement(RenderersPortalManager, {
        ref: this.setRenderersPortalManagerRef.bind(this)
      }), editorPortal);
    }
  }], [{
    key: "version",
    get: function get() {
      return version;
    }
  }]);
}(import_react.default.Component);
HotTableClass.propTypes = {
  style: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string
};
var _excluded = ["children"];
var HotTable = import_react.default.forwardRef(function(_ref, ref) {
  var _props$id;
  var children = _ref.children, props = _objectWithoutProperties(_ref, _excluded);
  var generatedId = typeof import_react.default.useId === "function" ? import_react.default.useId() : void 0;
  var componentId = (_props$id = props.id) !== null && _props$id !== void 0 ? _props$id : generatedId;
  return import_react.default.createElement(HotTableClass, Object.assign({
    id: componentId
  }, props, {
    ref
  }), children);
});
HotTable.version = HotTableClass.version;
var BaseEditorComponent = function(_React$Component) {
  function BaseEditorComponent2() {
    var _this;
    _classCallCheck(this, BaseEditorComponent2);
    _this = _callSuper(this, BaseEditorComponent2, arguments);
    _this.name = "BaseEditorComponent";
    _this.instance = null;
    _this.row = null;
    _this.col = null;
    _this.prop = null;
    _this.TD = null;
    _this.originalValue = null;
    _this.cellProperties = null;
    _this.state = null;
    _this.hotInstance = null;
    _this.hotCustomEditorInstance = null;
    _this.hot = null;
    return _this;
  }
  _inherits(BaseEditorComponent2, _React$Component);
  return _createClass(BaseEditorComponent2, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.emitEditorInstance) {
        this.props.emitEditorInstance(this, this.props.editorColumnScope);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.emitEditorInstance) {
        this.props.emitEditorInstance(this, this.props.editorColumnScope);
      }
    }
    // BaseEditor methods:
  }, {
    key: "_fireCallbacks",
    value: function _fireCallbacks() {
      var _Handsontable$editors;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_Handsontable$editors = base_default.editors.BaseEditor.prototype._fireCallbacks).call.apply(_Handsontable$editors, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "beginEditing",
    value: function beginEditing() {
      var _Handsontable$editors2;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return (_Handsontable$editors2 = base_default.editors.BaseEditor.prototype.beginEditing).call.apply(_Handsontable$editors2, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "cancelChanges",
    value: function cancelChanges() {
      var _Handsontable$editors3;
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return (_Handsontable$editors3 = base_default.editors.BaseEditor.prototype.cancelChanges).call.apply(_Handsontable$editors3, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "checkEditorSection",
    value: function checkEditorSection() {
      var _Handsontable$editors4;
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return (_Handsontable$editors4 = base_default.editors.BaseEditor.prototype.checkEditorSection).call.apply(_Handsontable$editors4, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "close",
    value: function close() {
      var _Handsontable$editors5;
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      return (_Handsontable$editors5 = base_default.editors.BaseEditor.prototype.close).call.apply(_Handsontable$editors5, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "discardEditor",
    value: function discardEditor() {
      var _Handsontable$editors6;
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      return (_Handsontable$editors6 = base_default.editors.BaseEditor.prototype.discardEditor).call.apply(_Handsontable$editors6, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "enableFullEditMode",
    value: function enableFullEditMode() {
      var _Handsontable$editors7;
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      return (_Handsontable$editors7 = base_default.editors.BaseEditor.prototype.enableFullEditMode).call.apply(_Handsontable$editors7, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "extend",
    value: function extend() {
      var _Handsontable$editors8;
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      return (_Handsontable$editors8 = base_default.editors.BaseEditor.prototype.extend).call.apply(_Handsontable$editors8, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "finishEditing",
    value: function finishEditing() {
      var _Handsontable$editors9;
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      return (_Handsontable$editors9 = base_default.editors.BaseEditor.prototype.finishEditing).call.apply(_Handsontable$editors9, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "focus",
    value: function focus() {
      var _Handsontable$editors10;
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }
      return (_Handsontable$editors10 = base_default.editors.BaseEditor.prototype.focus).call.apply(_Handsontable$editors10, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var _Handsontable$editors11;
      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }
      return (_Handsontable$editors11 = base_default.editors.BaseEditor.prototype.getValue).call.apply(_Handsontable$editors11, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "init",
    value: function init() {
      var _Handsontable$editors12;
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }
      return (_Handsontable$editors12 = base_default.editors.BaseEditor.prototype.init).call.apply(_Handsontable$editors12, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "isInFullEditMode",
    value: function isInFullEditMode() {
      var _Handsontable$editors13;
      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }
      return (_Handsontable$editors13 = base_default.editors.BaseEditor.prototype.isInFullEditMode).call.apply(_Handsontable$editors13, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "isOpened",
    value: function isOpened() {
      var _Handsontable$editors14;
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }
      return (_Handsontable$editors14 = base_default.editors.BaseEditor.prototype.isOpened).call.apply(_Handsontable$editors14, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "isWaiting",
    value: function isWaiting() {
      var _Handsontable$editors15;
      for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }
      return (_Handsontable$editors15 = base_default.editors.BaseEditor.prototype.isWaiting).call.apply(_Handsontable$editors15, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "open",
    value: function open() {
      var _Handsontable$editors16;
      for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }
      return (_Handsontable$editors16 = base_default.editors.BaseEditor.prototype.open).call.apply(_Handsontable$editors16, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "prepare",
    value: function prepare(row, col, prop, TD, originalValue, cellProperties) {
      this.hotInstance = cellProperties.instance;
      this.row = row;
      this.col = col;
      this.prop = prop;
      this.TD = TD;
      this.originalValue = originalValue;
      this.cellProperties = cellProperties;
      return base_default.editors.BaseEditor.prototype.prepare.call(this.hotCustomEditorInstance, row, col, prop, TD, originalValue, cellProperties);
    }
  }, {
    key: "saveValue",
    value: function saveValue() {
      var _Handsontable$editors17;
      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
      }
      return (_Handsontable$editors17 = base_default.editors.BaseEditor.prototype.saveValue).call.apply(_Handsontable$editors17, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "setValue",
    value: function setValue() {
      var _Handsontable$editors18;
      for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
        args[_key18] = arguments[_key18];
      }
      return (_Handsontable$editors18 = base_default.editors.BaseEditor.prototype.setValue).call.apply(_Handsontable$editors18, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "addHook",
    value: function addHook() {
      var _Handsontable$editors19;
      for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
        args[_key19] = arguments[_key19];
      }
      return (_Handsontable$editors19 = base_default.editors.BaseEditor.prototype.addHook).call.apply(_Handsontable$editors19, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "removeHooksByKey",
    value: function removeHooksByKey() {
      var _Handsontable$editors20;
      for (var _len20 = arguments.length, args = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
        args[_key20] = arguments[_key20];
      }
      return (_Handsontable$editors20 = base_default.editors.BaseEditor.prototype.removeHooksByKey).call.apply(_Handsontable$editors20, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "clearHooks",
    value: function clearHooks() {
      var _Handsontable$editors21;
      for (var _len21 = arguments.length, args = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
        args[_key21] = arguments[_key21];
      }
      return (_Handsontable$editors21 = base_default.editors.BaseEditor.prototype.clearHooks).call.apply(_Handsontable$editors21, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "getEditedCell",
    value: function getEditedCell() {
      var _Handsontable$editors22;
      for (var _len22 = arguments.length, args = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
        args[_key22] = arguments[_key22];
      }
      return (_Handsontable$editors22 = base_default.editors.BaseEditor.prototype.getEditedCell).call.apply(_Handsontable$editors22, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "getEditedCellRect",
    value: function getEditedCellRect() {
      var _Handsontable$editors23;
      for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
      }
      return (_Handsontable$editors23 = base_default.editors.BaseEditor.prototype.getEditedCellRect).call.apply(_Handsontable$editors23, [this.hotCustomEditorInstance].concat(args));
    }
  }, {
    key: "getEditedCellsZIndex",
    value: function getEditedCellsZIndex() {
      var _Handsontable$editors24;
      for (var _len24 = arguments.length, args = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
        args[_key24] = arguments[_key24];
      }
      return (_Handsontable$editors24 = base_default.editors.BaseEditor.prototype.getEditedCellsZIndex).call.apply(_Handsontable$editors24, [this.hotCustomEditorInstance].concat(args));
    }
  }]);
}(import_react.default.Component);
export {
  BaseEditorComponent,
  HotColumn,
  HotTable,
  HotTableClass,
  HotTable as default
};
/*! Bundled license information:

@handsontable/react/es/react-handsontable.mjs:
  (*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  *)
*/
//# sourceMappingURL=@handsontable_react.js.map
