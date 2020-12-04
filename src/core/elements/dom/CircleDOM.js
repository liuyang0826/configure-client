import { platformEnum } from "../../Event";
import { BaseCircle } from "../BaseCircle";
import { extend, mixin } from "../../helpers";
import { VertexDOM } from "./VertexDOM";
import { CircleImplDOM } from "../../mixins/CircleImplDOM";

export function CircleDOM(opts) {
  BaseCircle.call(this, opts);
  CircleImplDOM.call(this, opts);
  this.platform = platformEnum.dom;
}

CircleDOM.prototype = {
  constructor: CircleDOM,

  dirty(shape) {
    BaseCircle.prototype.dirty.call(this, shape);
    CircleImplDOM.prototype.dirty.call(this, shape);
  },

  makeVertex(opts) {
    return new VertexDOM(opts);
  }
};

extend(CircleDOM, BaseCircle);
mixin(CircleDOM, CircleImplDOM);
