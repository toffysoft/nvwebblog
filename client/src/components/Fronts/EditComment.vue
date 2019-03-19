<template>
  <div id="edit-comment">
    <div>
      <h1>Edit Comment</h1>
      <div><button v-on:click.prevent="send(1)">Send 1</button></div>
      <div><button v-on:click.prevent="send(2)">Send 2</button></div>
    </div>
  </div>
</template>
<script>
export default {
  props:['comment', 'user', 'users'],

  methods: {
    send (sel) {
      if (sel == 1) {
        this.$emit('send-one', 'one')
      } else if (sel == 2) {
        this.$emit('send-two', 'two')
      }
    }
  }
}
</script>
<style scoped>

</style>


