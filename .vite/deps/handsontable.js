import {
  BasePlugin,
  date_exports,
  ghostTable_default,
  registerAllModules
} from "./chunk-PCJSHUET.js";
import {
  base_default
} from "./chunk-EA2GDYZS.js";
import {
  _getItem,
  _getItem2,
  _getItem3,
  _getItem4,
  _register,
  _register2,
  _register3,
  _register4,
  arrayEach,
  array_exports,
  browser_exports,
  coords_default,
  data_exports,
  element_exports,
  eventManager_default,
  event_exports,
  feature_exports,
  function_exports,
  getListenersCounter,
  getNames,
  getNames2,
  getNames3,
  getNames4,
  getPlugin,
  getPluginsNames,
  getRegisteredMapsCounter,
  mixed_exports,
  number_exports,
  object_exports,
  parseTable_exports,
  range_default,
  registerPlugin,
  string_exports,
  toUpperCaseFirst,
  unicode_exports
} from "./chunk-NKMIMUPW.js";
import "./chunk-PR4QN5HX.js";

// node_modules/handsontable/helpers/wrappers/jquery.mjs
function jQueryWrapper(Handsontable) {
  const jQuery = typeof window === "undefined" ? false : window.jQuery;
  if (!jQuery) {
    return;
  }
  jQuery.fn.handsontable = function(action) {
    const $this = this.first();
    let instance = $this.data("handsontable");
    if (typeof action !== "string") {
      const userSettings = action || {};
      if (instance) {
        instance.updateSettings(userSettings);
      } else {
        instance = new Handsontable.Core($this[0], userSettings);
        $this.data("handsontable", instance);
        instance.init();
      }
      return $this;
    }
    let output;
    if (instance) {
      if (typeof instance[action] !== "undefined") {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        output = instance[action].call(instance, ...args);
        if (action === "destroy") {
          $this.removeData();
        }
      } else {
        throw new Error(`Handsontable do not provide action: ${action}`);
      }
    }
    return output;
  };
}

// node_modules/handsontable/index.mjs
var _Handsontable$cellTyp;
var _Handsontable$editors;
var _Handsontable$rendere;
var _Handsontable$validat;
var _Handsontable$plugins;
registerAllModules();
jQueryWrapper(base_default);
base_default.__GhostTable = ghostTable_default;
base_default._getListenersCounter = getListenersCounter;
base_default._getRegisteredMapsCounter = getRegisteredMapsCounter;
base_default.EventManager = eventManager_default;
var HELPERS = [array_exports, browser_exports, data_exports, date_exports, feature_exports, function_exports, mixed_exports, number_exports, object_exports, string_exports, unicode_exports, parseTable_exports];
var DOM = [element_exports, event_exports];
base_default.helper = {};
base_default.dom = {};
arrayEach(HELPERS, (helper) => {
  arrayEach(Object.getOwnPropertyNames(helper), (key) => {
    if (key.charAt(0) !== "_") {
      base_default.helper[key] = helper[key];
    }
  });
});
arrayEach(DOM, (helper) => {
  arrayEach(Object.getOwnPropertyNames(helper), (key) => {
    if (key.charAt(0) !== "_") {
      base_default.dom[key] = helper[key];
    }
  });
});
base_default.cellTypes = (_Handsontable$cellTyp = base_default.cellTypes) !== null && _Handsontable$cellTyp !== void 0 ? _Handsontable$cellTyp : {};
arrayEach(getNames4(), (cellTypeName) => {
  base_default.cellTypes[cellTypeName] = _getItem4(cellTypeName);
});
base_default.cellTypes.registerCellType = _register4;
base_default.cellTypes.getCellType = _getItem4;
base_default.editors = (_Handsontable$editors = base_default.editors) !== null && _Handsontable$editors !== void 0 ? _Handsontable$editors : {};
arrayEach(getNames(), (editorName) => {
  base_default.editors[`${toUpperCaseFirst(editorName)}Editor`] = _getItem(editorName);
});
base_default.editors.registerEditor = _register;
base_default.editors.getEditor = _getItem;
base_default.renderers = (_Handsontable$rendere = base_default.renderers) !== null && _Handsontable$rendere !== void 0 ? _Handsontable$rendere : {};
arrayEach(getNames2(), (rendererName) => {
  const renderer = _getItem2(rendererName);
  if (rendererName === "base") {
    base_default.renderers.cellDecorator = renderer;
  }
  base_default.renderers[`${toUpperCaseFirst(rendererName)}Renderer`] = renderer;
});
base_default.renderers.registerRenderer = _register2;
base_default.renderers.getRenderer = _getItem2;
base_default.validators = (_Handsontable$validat = base_default.validators) !== null && _Handsontable$validat !== void 0 ? _Handsontable$validat : {};
arrayEach(getNames3(), (validatorName) => {
  base_default.validators[`${toUpperCaseFirst(validatorName)}Validator`] = _getItem3(validatorName);
});
base_default.validators.registerValidator = _register3;
base_default.validators.getValidator = _getItem3;
base_default.plugins = (_Handsontable$plugins = base_default.plugins) !== null && _Handsontable$plugins !== void 0 ? _Handsontable$plugins : {};
arrayEach(getPluginsNames(), (pluginName) => {
  base_default.plugins[pluginName] = getPlugin(pluginName);
});
base_default.plugins[`${toUpperCaseFirst(BasePlugin.PLUGIN_KEY)}Plugin`] = BasePlugin;
base_default.plugins.registerPlugin = registerPlugin;
base_default.plugins.getPlugin = getPlugin;
var handsontable_default = base_default;
export {
  coords_default as CellCoords,
  range_default as CellRange,
  handsontable_default as default
};
//# sourceMappingURL=handsontable.js.map
