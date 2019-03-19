<template>
  <div id="edit-comment" v-on:click.prevent="editComment(true, comment.id)">
    <h4>{{ userName }}</h4>
    <hr>
    <transition name="fade">
      <p v-if="!editable" >{{comment.comment}}</p>   
    </transition> 
    <transition name="fade">    
    <div v-if="updateEditable" class="form-edit-wrapper">
      <form v-on:submit.prevent="updateComment">
        <p><textarea rows="5" class="form-control" v-model="comment.comment"></textarea></p>
        <p>
          <button type="submit" class="btn btn-warning btn-xs"><i class="fas fa-save"></i> Update</button>
          <button type="button" v-on:click.prevent="editComment(false, comment.id)" class="btn btn-success btn-xs"><i class="fas fa-times-circle"></i> Close</button>
        </p>
      </form>
    </div>
    </transition>
    <p v-if="!editable && user != null"><button v-on:click="deleteComment(comment)" class="btn btn-xs btn-danger"><i class="fas fa-trash-alt"></i> Delete</button></p>
  </div>
</template>
<script>
import CommentsService from '@/services/CommentsService'

export default {
  props:['comment', 'users', 'user', 'editable'],
  data () {
    return {
      userName: null,       
    }
  },
  created () {    
    this.getUser()
  },
  methods: {
    getUser () {
      this.users.forEach(user => {
        if (user.id == this.comment.userId) {       
          this.userName = user.name
        }
      })
      // console.log('users')
      // console.log(this.users)
    },
    editComment (status, commentId) {
      // check permission first
      if (this.user != null) {        
        this.$emit('editable-update', commentId)
      }      
    },
    updateComment () {
      this.editable = false
      let updateResult = "updated"      
      this.$emit('comment-part', updateResult)
    },
    async deleteComment (comment) {
     
      let result = confirm("Want to delete?")
      if (result) {
        try {
          await CommentsService.delete(comment)          
          let deleteResult = "deleted"
          this.$emit('comment-part', deleteResult)
        } catch (err) {
          console.log(err)
          let deleteResult = "error"
          this.$emit('comment-part', deleteResult)
        }
      }

      let deleteResult = "deleted"
      this.$emit('comment-part', deleteResult)
    }
  },
  computed: {
    updateEditable () {
      return this.editable
    }
  }
}
</script>
<style scoped>
</style>

