import * as is from "@mhc/ntks/utils/is/type";
import { each, mixin } from "@mhc/ntks/utils/collection";

const WATERMARK_DEFAULTS = {
  id: "watermark",
  preventTamper: false,
  width: 140,
  height: 100,
  text: "watermark",
  font: "20px Sans-serif",
  rotate: (Math.PI / 180) * 30,
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

function getElementById( id ) {
  document.getElementById(id.indexOf("#") === 0 ? id.substring(1) : id);
}

function createNewElement( tagName ) {
  return document.createElement(tagName);
}

function generateDataUrl( opts ) {
  const canvas = createNewElement("canvas");

  canvas.width = opts.width;
  canvas.height = opts.height;

  const ctx = canvas.getContext("2d");

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

function resolveStyleText( opts ) {
  const rules = [];

  each(opts, ( v, k ) => rules.push(`${k}: ${v};`));

  return rules.join(" ");
}

function createWatermarkContainer( opts ) {
  const url = generateDataUrl(opts);
  const old = getElementById(opts.id);
  const div = old || createNewElement("div");

  div.id = opts.id

  let parentEl = opts.preventTamper === true ? document.body : (opts.container || document.body);

  if ( is.string(parentEl) ) {
    parentEl = getElementById(parentEl);
  }

  const rect = parentEl.getBoundingClientRect();

  opts.style.left = `${is.number(opts.left) ? opts.left : rect.left}px`;
  opts.style.top = `${is.number(opts.top) ? opts.top : rect.top}px`;

  div.style.cssText = resolveStyleText(opts.style);
  div.setAttribute("class", "");

  div.style.background = `url(${url}) repeat top left`;

  !old && parentEl.appendChild(div);

  return div;
}

export function init( opts ) {
  opts = mixin(true, {}, WATERMARK_DEFAULTS, opts);

  if ( is.func( opts.container ) ) {
    opts.container = opts.container.call(null);
  }

  return createWatermarkContainer(opts);
}
