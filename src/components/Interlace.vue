<template>
  <div></div>
</template>

<script>
import Interlace from '@/libs/Interlace'

export default {
  interlace: null,

  props: {
    size: Number
  },

  mounted () {
    this.initInterlace()
  },

  methods: {
    initInterlace () {
      const interlace = new Interlace(this.$el, {
        width: this.size,
        height: this.size
      })
      this.$options.interlace = interlace
    }
  }
  
}
</script>
