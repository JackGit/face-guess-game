import random from 'lodash.random'
import { FACES } from '@/constants/images'
const JSAPI_CONFIG_URL = 'http://wx-service.yotta-tech.cn/jsapi/config'

export function init () {
  fetch(`${JSAPI_CONFIG_URL}?url=${encodeURIComponent(window.location.href)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    mode: 'cors'
  }).then(
    r => r.json()
  ).then(r => {
    configWX(r.appId, r.timestamp, r.nonceStr, r.signature)
    setWXShare()
  })
}

/* weixin configs */
function configWX(appId, timestamp, nonceStr, signature) {
  wx.config({
    debug: true,
    appId,
    timestamp,
    nonceStr,
    signature,
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
  })
}

function setWXShare() {
  const title = 'FIFA世界杯人脸识别'
  const link = 'http://h5.jackyang.me/face-guess-game'
  const desc = '考验资深球迷的时候到了'
  const faceKeys = Object.keys(FACES)
  const imgUrl = FACES[faceKeys[random(0, faceKeys.length - 1)]]

  wx.ready(() => {
    wx.onMenuShareTimeline({ title, link, imgUrl })
    wx.onMenuShareAppMessage({ title, desc, link, imgUrl })
  })
}
