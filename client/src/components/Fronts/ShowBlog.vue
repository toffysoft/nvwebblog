<template>
  <div class="component-wrapper container">
    <main-header navsel="front"></main-header>   
    <div class="hero-wrapper">
      <div class="hero">
        <img src="@/assets/logo.png" class="logo" style="float:left"> 
        <h1>Webblot from nodejs + vuejs Ebook</h1>
        <p>By Gooddev.ME</p>      
      </div>
    </div>  
    <div class="blog-wrapper" v-if="blog != null">        
      <h1>{{ blog.title }}</h1>
      <p><strong>Category: </strong>: <a href="#" v-on:click.prevent="navigateTo(`/front?search=${blog.category}`)">{{ blog.category }}</a></p>      
      <div class="content" v-html="blog.content"></div>
      <!-- <p>category: {{ blog.category }}</p>
      <p>status: {{ blog.status }}</p> -->    
    </div>
    <div class="back-nav"><button class="btn btn-success" v-on:click="navigateTo('/front')"><i class="fas fa-arrow-left"></i> Back..</button></div>
    <div class="comments-wrapper">
      <div class="comment-form-wrapper">
        <h4>Comments</h4>
        <form v-on:submit.prevent="sendComment">
          <p><textarea rows="5" class="form-control" v-model="comment"></textarea></p>
          <p v-if="user == null">Login / Register for commented.</p>
          <p v-else ><button type="submit" class="btn btn-primary"><i class="fas fa-comment"></i> Send Comment</button></p>
        </form>
      </div>      
      <transition-group tag="ul" name="fade" class="comment-list">
        <li v-for="comment in comments" :key="comment.id">
          <h4>user id: {{comment.userId}}</h4>
          <p>{{comment.comment}}</p>
        </li>        
      </transition-group>
    </div>
    <transition name="fade">
      <div v-if="resultUpdated != ''" class="popup-msg">      
        <p>{{ resultUpdated }}</p>
      </div>
    </transition>
    <br>
  </div>
</template>
<script>

import {mapState} from 'vuex'
import BlogsService from '@/services/BlogsService'
import UsersService from '@/services/UsersService'
import CommentsService from '@/services/CommentsService'

export default {
  data () {
    return {
      blog: null,
      resultUpdated: '',
      users:null,
      comment: null,
      comments: '',
    }
  },
  delete () {
    console.log('delete blog')
  },
  async created () {
    // get blog

    // check permission first
    try {
      let blogId = this.$route.params.blogId
      this.blog = (await BlogsService.show(blogId)).data       
    } catch (error) {
      console.log (error)
    }   

    this.reloadComment()
  },
  methods: {    
    navigateTo (route) {
      this.$router.push(route)
    },
    async sendComment () {
      // console.log(`comment: ${this.comment}`)
      try {
        let comment = {
          blogId:this.blog.id,
          comment:this.comment,
          userId:this.user.id
        }

        console.log(comment)
        await CommentsService.post(comment)
        this.comment = ''
        this.resultUpdated = "We are recieved" 
        setTimeout(() => this.resultUpdated = '', 3000)
        this.reloadComment()  
      } catch (err) {
        console.log(err)
      }
    },
    async reloadComment () {
      try {
        this.comments = (await CommentsService.blog(this.blog.id)).data      
      } catch (error) {
        console.log (error)
      } 
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  }
}
</script>
<style scoped>
.comment-list {
  list-style: none;  
  padding : 0;
  margin : 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.comment-form-wrapper {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
}

.comment-list li {
  border:solid 1px #dfdfdf;
  margin-bottom: 10px;   
  padding: 10px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  border-radius: 5px;
}

.popup-msg {
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
  border: solid 1px #ddd;
  background: #fff;
  max-width:200px;
  padding: 10px;
  position:fixed;
  bottom:0;
  right:0;  
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right:  5px;
}

.hero {
  margin-top: 80px;
  border-radius: 5px;
  background: darkcyan;
  height:250px;
  color:white;
  padding: 20px;
}

.hero h1 {
  margin-top: 30px;
}


.blog-wrapper {
  margin-top:20px;
  padding: 40px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
}
.back-nav {
  margin-top: 20px;
  text-align: center;
}
.blog-wrapper h1{
  text-align: center;
  font-family: 'kanit';
  padding-bottom: 50px;
}

.blog-wrapper p {
  font-family: 'kanit';
  font-size: 1.4em;
  padding-bottom:20px;
}

.blog-wrapper .content {
  font-family: 'kanit';
  font-size: 1.2em;
}
</style>