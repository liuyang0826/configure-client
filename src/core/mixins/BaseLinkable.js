import { makeEventPacket } from "../Eventful";
import { lastItem } from "../helpers";

// 可以添加连接线的类的混入类的抽象类 用于表示其公共部分 只用于混入 不能继承 继承无效
function BaseLinkable() {
  this.lines = this.lines || [];
}

BaseLinkable.prototype = {
  constructor: BaseLinkable,

  addDrawLinkLine() {
    const root = this.root;

    const click = e => {
      e.event.stopPropagation();

      if (root.curDrawLine) {
        root.offCurDrawLine();
        clickToEnd.call(this, e);
      } else {
        // 鼠标移动绘制线段
        const mousemove = e => {
          this.lineDrawing(makeEventPacket(e));
        };

        const clickRoot = () => {
          root.isNewPoint = true;
        };

        root.offCurDrawLine = () => {
          root.el.removeEventListener("mousemove", mousemove);
          root.el.removeEventListener("click", clickRoot);
        };
        root.el.addEventListener("mousemove", mousemove);
        root.el.addEventListener("click", clickRoot);
        clickToStart.call(this, e);
      }
    };

    this.on("click", click);

    this.removeDrawLine = () => {
      this.off("click", click);
    };
  },

  // Interface 开始画线 用于确定起始点
  makeLineStartPoint() {},

  // Interface 开始画线 用于生成对应实现类的实例
  makeLinkLine() {},

  // Interface 画线过程中
  lineDrawing() {},

  // Interface 结束画线时的逻辑
  makeLineEndPoint() {},

  updateLines() {
    this.lines.forEach(item => {
      const line = item.line;

      line.isFollowStart = item.isStart;

      line.followHost(this.makeLineVertexByAngle(item.sin, item.cos));
    });
  },

  // 通过与宿主元素的 sin cos关系得到在宿主元素上的交点 用于更新当前线的端点
  makeLineVertexByAngle() {},

  removeLine(line) {
    this.lines.splice(
      this.lines.findIndex(d => d.line === line),
      1
    );
  },

  clearLine() {
    while (this.lines.length) {
      this.lines[0].line.unmount();
    }
  },

  export() {
    return {
      lines: this.lines.map(item => {
        return {
          id: item.id,
          isStart: item.isStart,
          sin: item.sin,
          cos: item.cos
        };
      })
    };
  }
};

// 开始画线
function clickToStart(e) {
  const { line, sin, cos } = this.makeLinkLine(e);

  this.lines.push({
    id: line.id,
    isStart: true,
    sin,
    cos,
    line: line
  });

  const root = this.root;
  root.curDrawLineStartElement = this;

  line.el.silent = true;

  line.startElement = this;

  root.add(line);

  root.curDrawLine = line;

  root.isNewPoint = true;
}

// 结束画线
function clickToEnd() {
  const root = this.root;
  if (root.curDrawLineStartElement === this) {
    // root.remove(root.curDrawLine);
    // root.curDrawLine
  }
  const line = root.curDrawLine;
  const points = line.points;
  const last2 = lastItem(points, 2);

  const { point, sin, cos } = this.makeLineEndPoint(last2);

  points[points.length - 1] = point;

  this.lines.push({
    id: line.id,
    isStart: false,
    sin,
    cos,
    line: line
  });

  line.isStartVertical = points[0][1] !== points[1][1];
  line.isEndVertical = root.isCurLineVertical;

  line.update();
  line.endElement = this;
  line.el.silent = false;
  root.curDrawLine = null;
  root.curDrawLineStartElement = null;
}

export { BaseLinkable };