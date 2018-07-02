<template>
  <div>
    <ul>
      <li v-for="opt in options" :key="opt.value" @click="clickHandler(opt)">{{opt.label}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array, // [{ value, label }]
      default: () => {}
    }
  },

  data () {
    return {
      selected: null
    }
  },

  methods: {
    clickHandler (option) {
      this.selected = option.value
      this.$emit('change', option)
    }
  }
}
</script>

<style>

</style>
