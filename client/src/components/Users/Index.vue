<template>
  <div>
    <h1>Get All Users</h1>
    <div v-for="user in users" v-bind:key="user.id">
      <div>จำนวนผู้ใช้งาน {{ users.length }}</div>
      <div>id: {{ user.id }}</div>
      <div>ชื่อ-นามสกุล: {{ user.name }} - {{ user.lastname }}</div>
      <div>email: {{ user.email }}</div>
      <div>password: {{ user.password }}</div>
      <p><button v-on:click="navigateTo('/user/'+user.id)">ดูข้อมูลผู้ใช้</button></p>
      <hr>
    </div>
  </div>
</template>
<script>
import UsersService from '@/services/UsersService'

export default {
  data () {
    return {
      users: []
    }
  },
  async created () {
    this.users = (await UsersService.index()).data
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }, 
  }
}
</script>
<style scoped>
</style>