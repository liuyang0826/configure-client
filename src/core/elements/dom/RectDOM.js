import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../enums";
import { eachObj, extend } from "../../helpers";

function RectDOM(opts) {
  BaseRect.call(this, opts);
}

RectDOM.prototype = {
  constructor: RectDOM,

  platform: platformEnum.dom,

  create() {
    const div = document.createElement("div");
    eachObj(
      {
        position: "absolute",
        left: "0px",
        top: "0px",
        "box-sizing": "border-box",
        border: "1px solid #000"
      },
      (value, key) => {
        div.style[key] = value;
      }
    );
    div.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    div.style.width = `${this.width}px`;
    div.style.height = `${this.height}px`;
    if (this.image) {
      div.style.background = `url(${this.image}) center/100% 100%`;
    }
    this.el = div;
  },

  update() {
    BaseRect.prototype.update.call(this);
    this.el.style.transform = `translate3d(${this.x + (this.width < 0 ? this.width : 0)}px, ${this.y + (this.height < 0 ? this.height : 0)}px, 0)`;
    this.el.style.width = `${Math.abs(this.width)}px`;
    this.el.style.height = `${Math.abs(this.height)}px`;
    if (this.image) {
      this.el.style.background = `url(${this.image}) center/100% 100%`;
    }
  }
};

extend(RectDOM, BaseRect);

export { RectDOM };
