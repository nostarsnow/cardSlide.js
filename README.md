# CardSlide.js 卡片切换，超进化组件 S

## Demo

[在线预览：Demo](https://nostarsnow.github.io/cardSlide.js/dist/)

## How to use

```bash
npm i @nostar/card-slide -S
```

```html
<div class="card-slide-box">
  <div class="card-slide-wrapper">
    <div class="card-slide">
      1
    </div>
    <div class="card-slide">
      2
    </div>
    <div class="card-slide">
      3
    </div>
  </div>
</div>
```

```js
import CardSlide from "@nostar/CardSlide";
var card = new CardSlide(document.querySelector(".card-slide-box"), {
  autoplay: 0,
  gutter: 20,
  speed: 350,
  dragRelation: "rtl",
  dragPrevable: false,
  swiperStart: function (activeIndex) {
    let _this = this;
    _this.setStyle(_this.$slides[activeIndex], {
      background: "#fff",
    });
    setTimeout(function () {
      _this.setStyle(_this.$slides[activeIndex], {
        background: "",
      });
    }, 150);
  },
});
```

## API

<table>
<thead>
<tr>
	<th>Option</th>
	<th>Type</th>
	<th>Default</th>
	<th>Description</th>
</tr>
<tr>
	<td>autoplay</td>
	<td>int</td>
	<td>0</td>
	<td>自动切换的毫秒数，为0则不开启</td>
</tr>
<tr>
	<td>speed</td>
	<td>int</td>
	<td>350</td>
	<td>卡片切换的动画毫秒数</td>
</tr>
<tr>
	<td>effect</td>
	<td>string</td>
	<td>'ease-out'</td>
	<td>卡片切换的time function</td>
</tr>
<tr>
	<td>drag</td>
	<td>boolean</td>
	<td>true</td>
	<td>是否开启拖拽切换</td>
</tr>
<tr>
	<td>dragRelation</td>
	<td>string</td>
	<td>'ltr'</td>
	<td>拖拽方向识别，ltr或rtl，正反方向</td>
</tr>
<tr>
	<td>dragDistance</td>
	<td>int</td>
	<td>50</td>
	<td>拖拽识别的像素距离</td>
</tr>
<tr>
	<td>dragPrevable</td>
	<td>boolean</td>
	<td>true</td>
	<td>是否支持拖拽向前翻页</td>
</tr>
<tr>
	<td>dragNextable</td>
	<td>boolean</td>
	<td>true</td>
	<td>是否支持拖拽向后翻页</td>
</tr>
<tr>
	<td>nextBtn</td>
	<td>string</td>
	<td>'.card-slide-next'</td>
	<td>dom下的下一张按钮的选择器</td>
</tr>
<tr>
	<td>prevBtn</td>
	<td>string</td>
	<td>'.card-slide-prev'</td>
	<td>dom下的上一张按钮的选择器</td>
</tr>
<tr>
	<td>direction</td>
	<td>string</td>
	<td>'horizontal'</td>
	<td>设置方向。水平：horizontal 垂直：vertical</td>
</tr>
<tr>
	<td>activeClass</td>
	<td>string</td>
	<td>'card-slide-active'</td>
	<td>当前卡片的追加样式</td>
</tr>
<tr>
	<td>gutter</td>
	<td>int</td>
	<td>10</td>
	<td>3D视角下的偏移量</td>
</tr>
<tr>
	<td>width</td>
	<td>int</td>
	<td>undefined</td>
	<td>卡片宽度。不传会读取第一个卡片的宽度</td>
</tr>
<tr>
	<td>height</td>
	<td>int</td>
	<td>undefined</td>
	<td>卡片高度。不传会读取第一个卡片的高度</td>
</tr>
<tr>
	<td>swiperStart</td>
	<td>function</td>
	<td>function(activeIndex,nextIndex){}</td>
	<td>this指向当前实例化对象。参数有opts/settings/$dom/$wrap/$slides/next/prev/activeIndex等</td>
</tr>
</tbody></table>
