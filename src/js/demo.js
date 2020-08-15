var card = new CardSlide(document.querySelector(".card-slide-box"), {
  autoplay: 0,
  gutter: 20,
  speed: 350,
  dragRelation: "rtl",
  dragPrevable: false,
  //direction: "vertical",
  swiperStart: function (activeIndex) {
    let _this = this
    _this.setStyle(_this.$slides[activeIndex],{
      background: '#fff'
    })
    setTimeout(function(){
      _this.setStyle(_this.$slides[activeIndex],{
        background: ""
      })
    },150)
  },
});