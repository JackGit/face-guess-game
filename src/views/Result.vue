<template>
  <div class="c-resultView">
    <div class="c-clouds">
      <img class="c-resultView__cloud c0" src="http://qiniu.jackyang.me/h5/image/cloud_01.png">
      <img class="c-resultView__cloud c1" src="http://qiniu.jackyang.me/h5/image/cloud_02.png">
    </div>
    <div class="c-logo">
      <img class="c-logo__img" src="http://qiniu.jackyang.me/h5/image/logo.png">
      <img class="c-logo__txt" src="http://qiniu.jackyang.me/h5/image/logo_text.png">
    </div>

    <div class="c-resultView__result">
      <span>成功抓获<span class="c-resultView__total">{{total}}</span>名贪腐分子</span>
      <span>{{level}}</span>
    </div>

    <footer class="c-resultView__footer">
      H5定制 | <a href="http://www.yotta-tech.cn">武汉尧拓科技服务有限公司</a>
    </footer>
  </div>
</template>

<script>
import '@/assets/css/result-view.css'

function getLevel (total) {
  let text = ''
  switch(total) {
    case 0: text = '有意包庇犯罪？小心最高检找你去喝茶'; break;
    case 1: text = '你是在学外语吗？'; break;
    case 2: text = '你是黄毛派来的吧'; break;
    case 3: text = '你可以去检察院应聘侦查员'; break;
    case 4: text = '好样的，吴老师请你吃螃蟹~'; break;
    case 5: text = '沙书记给你点个赞！'; break;
    default: break;
  }
  return text
}

export default {
  data () {
    let game = window.game
    let total = game.result.filter(r => r).length
    return {
      total,
      level: getLevel(total)
    }
  }
}
</script>
