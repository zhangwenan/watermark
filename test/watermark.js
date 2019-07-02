(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function toString(target) {
  return Object.prototype.toString.call(target);
}

function hasOwnProp(prop, obj) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, prop);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/**
 * 判断是否为布尔类型
 * 
 * @param {*} target 目标
 */
function isBoolean(target) {
  return toString(target) === "[object Boolean]";
}

/**
 * 判断是否为数字类型
 * 
 * 如果是 `NaN` 的话则返回 `false`
 * 
 * @param {*} target 目标
 */
function isNumber(target) {
  return toString(target) === "[object Number]" && !isNaN(target);
}

/**
 * 判断是否为字符串类型
 * 
 * @param {*} target 目标
 */
function isString(target) {
  return toString(target) === "[object String]";
}

/**
 * 判断是否为函数类型
 * 
 * @param {*} target 目标
 */
function isFunction(target) {
  return toString(target) === "[object Function]";
}

/**
 * 判断是否为数组类型
 * 
 * @param {*} target 目标
 */
function isArray(target) {
  return toString(target) === "[object Array]";
}

/**
 * 判断是否为对象类型
 * 
 * @param {*} target 目标
 */
function isObject(target) {
  return toString(target) === "[object Object]";
}

/**
 * 宽松地判断是否为对象类型
 * 
 * @param {*} target 目标
 */
function isLooseObject(target) {
  return (typeof target === "undefined" ? "undefined" : _typeof$1(target)) === "object";
}

/**
 * 判断是否为宿主环境全局对象
 * 
 * 在浏览器环境中就是 `window` 对象
 * 
 * @param {*} target 目标
 */
function isGlobal(target) {
  return target && isLooseObject(target) && "setInterval" in target;
}

/**
 * 判断是否为类数组对象
 * 
 * @param {*} target 目标
 */
function isArrayLike(target) {
  var result = false;

  if (isLooseObject(target) && !isGlobal(target)) {
    var length = target.length;

    if (target.nodeType === 1 && length || !isArray(target) && !isFunction(target) && (length === 0 || isNumber(length) && length > 0 && length - 1 in target)) {
      result = true;
    }
  }

  return result;
}

/**
 * 判断是否为纯对象
 * 
 * @param {*} target 目标
 */
function isPlainObject(target) {
  if (!target || !isLooseObject(target) || target.nodeType || isGlobal(target)) {
    return false;
  }

  try {
    if (target.constructor && !hasOwnProp("constructor", target) && !hasOwnProp("isPrototypeOf", target.constructor.prototype)) {
      return false;
    }
  } catch (err) {
    return false;
  }

  var key = void 0;

  for (key in target) {
  }

  return key === undefined || hasOwnProp(key, target);
}

/**
 * 电子邮箱
 * 
 * 参考自：https://html.spec.whatwg.org/multipage/forms.html#e-mail-state-(type=email)
 */

/**
 * 获取用户代理字符串
 */

/**
 * 判断是否当作数组进行处理
 * 
 * @param {*} target 目标
 */
function treatAsArray(target) {
  return isString(target) || isArray(target) || isArrayLike(target);
}

/**
 * 遍历指定对象
 * 
 * 与 `jQuery.each()` 效果类似
 * 
 * 详见：http://api.jquery.com/jQuery.each/
 * 
 * @param {*} target 目标
 * @param {*} callback 应用到每个元素的处理函数
 */
function eachItem(target, callback) {
  if (treatAsArray(target)) {
    var idx = 0;
    var ele = void 0;

    while (idx < target.length) {
      ele = isString(target) ? target.charAt(idx) : target[idx];

      if (callback.apply(ele, [ele, idx++, target]) === false) {
        break;
      }
    }
  } else if (isObject(target) || isFunction(target)) {
    var name = void 0,
        value = void 0;

    for (name in target) {
      value = target[name];

      if (callback.apply(value, [value, name, target]) === false) {
        break;
      }
    }
  }
}

/**
 * 扩展指定对象
 * 
 * 与 `jQuery.extend()` 效果一样
 * 
 * 详见：http://api.jquery.com/jQuery.extend/
 */
function extendTarget() {
  var args = arguments;
  var length = args.length;

  var target = args[0] || {};
  var i = 1;
  var deep = false;
  var clone = void 0,
      copy = void 0,
      copyIsArray = void 0,
      name = void 0,
      opts = void 0,
      src = void 0;

  if (isBoolean(target)) {
    deep = target;
    target = args[1] || {};
    i = 2;
  }

  if (!isLooseObject(target) && !isFunction(target)) {
    target = {};
  }

  if (length === 1) {
    target = this;
    i--;
  }

  while (i < length) {
    opts = args[i];

    if (opts != null) {
      for (name in opts) {
        copy = opts[name];
        src = target[name];

        if (copy === target) {
          continue;
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extendTarget(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }

    i++;
  }

  return target;
}

var WATERMARK_DEFAULTS = {
  id: "watermark",
  preventTamper: false,
  width: 140,
  height: 100,
  text: "watermark",
  font: "20px Sans-serif",
  rotate: Math.PI / 180 * 30,
  shadow: {
    offsetX: 2,
    offsetY: 2,
    blur: 2
  },
  style: {
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    "z-index": 1000,
    "pointer-events": "none"
  }
};

function getElementById(id) {
  document.getElementById(id.indexOf("#") === 0 ? id.substring(1) : id);
}

function createNewElement(tagName) {
  return document.createElement(tagName);
}

function generateDataUrl(opts) {
  var canvas = createNewElement("canvas");

  canvas.width = opts.width;
  canvas.height = opts.height;

  var ctx = canvas.getContext("2d");

  // X 轴阴影距离，负值表示往上，正值表示往下
  ctx.shadowOffsetX = opts.shadow.offsetX;
  // Y 轴阴影距离，负值表示往左，正值表示往右
  ctx.shadowOffsetY = opts.shadow.offsetX;
  // 阴影的模糊程度
  ctx.shadowBlur = opts.shadow.offsetX;
  // 阴影颜色
  // ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.font = opts.font;
  ctx.fillStyle = "rgba(204, 204, 204, 0.45)";
  ctx.rotate(opts.rotate);
  ctx.translate(opts.translateX, opts.translateY);
  ctx.textAlign = "left";
  // 实体文字
  ctx.fillText(opts.text, 35, 32);

  return canvas.toDataURL("image/png");
}

function resolveStyleText(opts) {
  var rules = [];

  eachItem(opts, function (v, k) {
    return rules.push(k + ": " + v + ";");
  });

  return rules.join(" ");
}

function createWatermarkContainer(opts) {
  var url = generateDataUrl(opts);
  var old = getElementById(opts.id);
  var div = old || createNewElement("div");

  div.id = opts.id;

  var parentEl = opts.preventTamper === true ? document.body : opts.container || document.body;

  if (isString(parentEl)) {
    parentEl = getElementById(parentEl);
  }

  var rect = parentEl.getBoundingClientRect();

  opts.style.left = (isNumber(opts.left) ? opts.left : rect.left) + "px";
  opts.style.top = (isNumber(opts.top) ? opts.top : rect.top) + "px";

  div.style.cssText = resolveStyleText(opts.style);
  div.setAttribute("class", "");

  div.style.background = "url(" + url + ") repeat top left";

  !old && parentEl.appendChild(div);

  return div;
}

function init(opts) {
  opts = extendTarget(true, {}, WATERMARK_DEFAULTS, opts);

  if (isFunction(opts.container)) {
    opts.container = opts.container.call(null);
  }

  return createWatermarkContainer(opts);
}

window.mhc = window.mhc || {};
window.mhc.watermark = { init: init };

})));
