class CardSlide {
  constructor(dom, opts) {
    let defaultOpts = {
      autoplay: 0,
      speed: 350,
      effect: "ease-out",
      drag: true,
      dragRelation: "ltr",
      dragDistance: 50,
      dragNextable: true,
      dragPrevable: true,
      childrenTouchStop: false,
      childrenTouchPrevent: true,
      nextBtn: ".card-slide-next",
      prevBtn: ".card-slide-prev",
      direction: "horizontal",
      activeClass: "card-slide-active",
      width: undefined,
      height: undefined,
      gutter: 10,
      swiperStart: function (activeIndex, nextIndex) {},
    };
    this.opts = Object.assign(defaultOpts, opts);
    this.$dom = dom;
    this.init();
    return this;
  }
  init() {
    let { opts, $dom } = this;
    let prefix = this.getPrefix();
    this.settings = {
      prefix,
      killIe: /msie [6|7|8|9]/i.test(navigator.userAgent),
      transform: prefix.css + "transform",
      transition: prefix.css + "transition",
      isMob: this.isMob(),
      autoplay: 0,
    };
    this.$wrap = $dom.querySelector(".card-slide-wrapper");
    this.$slides = [].slice.apply($dom.querySelectorAll(".card-slide"));
    this.activeIndex = 0;
    this.slidesLength = this.$slides.length;
    if (!opts.width || !opts.height) {
      let { width, height } = this.$slides[0].getBoundingClientRect();
      opts.width = width;
      opts.height = height;
    }
    if (this.opts.direction === "horizontal") {
      this.setStyle(this.$wrap, {
        width:
          (
            opts.width +
            opts.gutter -
            ((opts.gutter * opts.gutter) / opts.width) * (this.slidesLength - 1)
          ).toFixed(4) + "px",
        height: opts.height + "px",
      });
    } else {
      this.setStyle(this.$wrap, {
        width: opts.width + "px",
        height: opts.height + "px",
      });
    }

    this.setSlideStyles();
    this.addEventListener();
    this.setAutoplay();
  }
  next() {
    this.setAutoplay();
    let next = this.activeIndex + 1;
    if (next === this.slidesLength) {
      next = 0;
    }
    this.opts.swiperStart.call(
      this,
      this.activeIndex,
      (this.activeIndex = next)
    );
    this.setSlideStyles();
  }
  prev() {
    this.setAutoplay();
    let next = this.activeIndex - 1;
    if (next === -1) {
      next = this.slidesLength - 1;
    }
    this.opts.swiperStart.call(
      this,
      this.activeIndex,
      (this.activeIndex = next)
    );
    this.setSlideStyles();
  }
  setSlideStyles() {
    let styles = this.formatSlideStyles();
    styles.forEach((v, i) => {
      let slide = this.$slides[i];
      if (i === this.activeIndex) {
        slide.classList.add(this.opts.activeClass);
      } else {
        slide.classList.remove(this.opts.activeClass);
      }
      slide.setAttribute(
        "data-slide-index",
        this.slidesLength - v["z-index"] + 1
      );
      this.setStyle(slide, v);
    });
  }
  formatSlideStyles() {
    let { activeIndex, slidesLength, opts, settings, $slides } = this;
    return $slides.map((v, i) => {
      let zIndex = 1,
        translateX = 0,
        translateY = 0,
        scale = 1,
        stepNum = 0;
      let step = opts.gutter / opts.width;
      if (i === activeIndex) {
        zIndex = slidesLength;
      } else {
        if (i - activeIndex > 0) {
          stepNum = i - activeIndex;
          zIndex = slidesLength - stepNum;
        } else {
          stepNum = slidesLength - activeIndex + i;
          zIndex = activeIndex - i;
        }
        scale = (1 - step * stepNum).toFixed(4);
        if (opts.direction === "horizontal") {
          translateX = (step * stepNum * 100).toFixed(2) + "%";
        } else {
          translateY = -(step * stepNum * 100).toFixed(2) + "%";
        }
      }
      return {
        "z-index": zIndex,
        [settings.transform]: `translateX(${translateX}) translateY(${translateY}) scale(${scale})`,
        [settings.transition]: `${settings.transform} ${opts.speed}ms ${opts.effect}`,
      };
    });
  }
  setAutoplay() {
    if (this.opts.autoplay) {
      this.settings.autoplay && clearInterval(this.settings.autoplay);
      this.settings.autoplay = setInterval(() => {
        this.next();
      }, this.opts.autoplay + this.opts.speed);
    }
  }
  addEventListener() {
    let { opts, settings, $dom } = this;
    if (opts.nextBtn) {
      this.$nextBtn = $dom.querySelector(opts.nextBtn);
      this.$nextBtn &&
        this.$nextBtn.addEventListener("click", this.next.bind(this), false);
    }
    if (opts.prevBtn) {
      this.$prevBtn = $dom.querySelector(opts.prevBtn);
      this.$prevBtn &&
        this.$prevBtn.addEventListener("click", this.prev.bind(this), false);
    }
    if (opts.drag) {
      settings.draging = true;
      this.$slides.forEach((slide) => {
        this.swipe(slide, (direction, offset) => {
          if (settings.draging) {
            let _offset =
              this.opts.direction === "horizontal" ? offset.x : offset.y;
            if (_offset > opts.dragDistance && opts.dragNextable) {
              settings.draging = false;
              this[opts.dragRelation === "ltr" ? "prev" : "next"]();
            }
            if (_offset < -opts.dragDistance && opts.dragPrevable) {
              settings.draging = false;
              this[opts.dragRelation === "ltr" ? "next" : "prev"]();
            }
          }
        });
      });
    }
  }
  h(name, obj, children) {
    return this._createElement(name, obj, children);
  }
  _createElement(name, obj, children) {
    let el = document.createElement(name);
    Object.keys(obj).forEach((v) => {
      if (v === "style") {
        this.setStyle(el, obj[v]);
      } else {
        el.setAttribute(v, obj[v]);
      }
    });
    if (this.isType(children, "String")) {
      el.innerHTML = children;
    }
    return el;
  }
  getStyleStr(style = {}) {
    return Object.keys(style)
      .map((v) => {
        return `${this.str2label(v)}:${style[v]};`;
      })
      .join("");
  }
  setStyle(el, style) {
    Object.keys(style).forEach((v) => {
      el.style[this.label2str(v)] = style[v];
    });
  }
  isType(value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  }
  str2label(str, tag = "-") {
    let result = "";
    if (!str[0].match(/[A-Z]+/)) {
      let strs = str.split(/[A-Z]+/);
      strs.forEach((value, index) => {
        if (index > 0) {
          let sublength = 0;
          for (let i = index; i > 0; i--) {
            sublength += strs[i - 1].length;
          }
          result +=
            tag +
            (strs[index] = str.substr(sublength, 1) + value).toLowerCase();
        } else {
          result += strs[index].toLowerCase();
        }
      });
    } else {
      result = str.toLowerCase();
    }
    return result;
  }
  label2str(str, tag = "-") {
    return str
      .split(tag)
      .filter((v) => v)
      .map((v, i) => {
        if (i !== 0) {
          v = v.substring(0, 1).toUpperCase() + v.substring(1);
        }
        return v;
      })
      .join("");
  }
  getPrefix() {
    return (function () {
      let styles = window.getComputedStyle(document.documentElement, ""),
        pre = (Array.prototype.slice
          .call(styles)
          .join("")
          .match(/-(moz|webkit|ms)-/) ||
          (styles.OLink === "" && ["", "o"]))[1],
        dom = "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1];
      return {
        dom: dom,
        lowercase: pre,
        css: "-" + pre + "-",
        js: pre[0].toUpperCase() + pre.substr(1),
      };
    })();
  }
  isMob() {
    let arr = [
      "Android",
      "iPhone",
      "SymbianOS",
      "Windows Phone",
      "iPad",
      "iPod",
    ];
    let mob = false;
    for (let v in arr) {
      if (new RegExp(arr[v], "i").test(window.navigator.userAgent)) {
        mob = true;
      }
    }
    return mob;
  }
  swipe($el, callback) {
    let isMob = this.settings.isMob,
      touchDown = false,
      originalPosition = null,
      start = isMob ? "touchstart" : "mousedown",
      move = isMob ? "touchmove" : "mousemove",
      end = isMob ? "touchend" : "mouseup";
    function swipeInfo(event) {
      var x = event.pageX || event.touches[0].pageX,
        y = event.pageY || event.touches[0].pageY,
        dx,
        dy;

      dx = x > originalPosition.x ? "right" : "left";
      dy = y > originalPosition.y ? "bottom" : "top";

      return {
        direction: {
          x: dx,
          y: dy,
        },
        offset: {
          x: x - originalPosition.x,
          y: y - originalPosition.y,
        },
      };
    }

    $el.addEventListener(
      start,
      (event) => {
        touchDown = true;
        originalPosition = {
          x: event.pageX || event.touches[0].pageX,
          y: event.pageY || event.touches[0].pageY,
        };
        if ( this.opts.childrenTouchStop ){
          event.stopPropagation();
        }
        if ( !isMob && this.opts.childrenTouchPrevent ){
          event.preventDefault();
        }
      },
      false
    );

    $el.addEventListener(
      end,
      () => {
        touchDown = false;
        originalPosition = null;
        this.settings.draging = true;
      },
      false
    );

    $el.addEventListener(
      move,
      (event) => {
        if (!touchDown) {
          return;
        }
        var info = swipeInfo(event);
        callback(info.direction, info.offset);
      },
      false
    );

    return true;
  }
}
window.CardSlide = CardSlide;

/*===========================
CardSlide AMD Export
===========================*/
if (typeof module !== "undefined") {
  module.exports = window.CardSlide;
} else if (typeof define === "function" && define.amd) {
  define([], function () {
    "use strict";
    return window.CardSlide;
  });
}
