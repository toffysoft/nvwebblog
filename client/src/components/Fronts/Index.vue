<template>   
  <div id="front">
    <main-header navsel="front"></main-header>
    <div class="component-wrapper container">      
    <div class="hero">
      <img src="@/assets/logo.png" class="logo" style="float:left"> 
      <h1>Webblog from nodejs + vuejs Ebook</h1>
      <p>By Gooddev.ME</p>      
    </div>
    <div class="clearfix"></div>
    <div class="blog-header">
      <div>
        <form class="form-inline form-search">             
          <span><strong> จำนวน blog: </strong> {{results.length}} </span>
          &nbsp;    
          <div class="form-group">              
            <div class="input-group">                        
            <input type="text" v-model="search" class="form-control" id="exampleInputAmount" placeholder="Search">
            <div class="input-group-addon"><i class="fas fa-search"></i></div>
            </div>
          </div>         
        </form>        
      </div>          
      <ul class="categories"> 
        <li v-for="cate in category" v-bind:key="cate.index"><a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a></li>
        <li class="clear" ><a v-on:click.prevent="setCategory(' ')" href="#">Clear</a></li>
      </ul>
      <div class="clearfix"></div>   
    </div>    
    <transition-group name="fade">
      <div v-for="blog in blogs" v-bind:key="blog.id" class="blog-list">
        <!-- <p>id: {{ blog.id }}</p> -->
        <div class="blog-pic">
          <!-- <transition name="fade"> -->
            <div class="thumbnail-pic" v-if="blog.thumbnail != 'null'">
              <img :src="BASE_URL+blog.thumbnail" alt="thumbnail">
            </div>
          <!-- </transition>   -->
        </div>
        <h3>{{ blog.title }}</h3>
        <div v-html="blog.content.slice(0,200) + '...'"></div>      
        <div class="blog-info">
          <p><strong>Category:</strong> {{ blog.category }}</p>
          <p><strong>Create:</strong> {{ blog.createdAt | formatedDate }}</p>
          <!-- <p>status: {{ blog.status }}</p> -->
          <p>
            <button class="btn btn-sm btn-info" v-on:click="navigateTo('/front/read/'+ blog.id)"><i class="fab fa-readme"></i> View Blog</button> 
          </p>
        </div>
        <div class="clearfix"></div>      
      </div>
    </transition-group>
    <div v-if="blogs.length === 0 && loading === false" class="empty-blog">
        *** ไม่มีข้อมูล ***
    </div>
    <div id="blog-list-bottom">
      <div class="blog-load-finished" v-if="blogs.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
  </div>
</template>
<script>

import BlogsService from '@/services/BlogsService'
import _ from 'lodash'
import ScrollMonitor from 'scrollMonitor'
import moment from 'moment'

let LOAD_NUM = 3
let pageWatcher

export default {
  filters: {
    formatedDate (value) {
      return moment(String(value)).format('DD-MM-YYYY')
    },
  },
  watch: {  
    search: _.debounce(async function (value) {
      const route = {
        name: 'front'
      }

      if(this.search !== '') {
        route.query = {
          search: this.search
        }
      }

      console.log('search: ' + this.search)
      this.$router.push(route)
    }, 700),

    '$route.query.search': {
      immediate: true,
      async handler (value) {            
        this.blogs = []
        this.results = []      
        this.loading = true    
        this.results = (await BlogsService.frontIndex(value)).data       
        this.appendResults()

        this.results.forEach(blog => {       
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(blog.category))
            if(this.category.indexOf(blog.category) === -1) {
              this.category.push(blog.category)
            }
          } else {
            
            this.category.push(blog.category)
          }
        })  
        this.loading = false
        this.search = value
        // console.log(this.category)              
      }       
    }
  },
  data () {
    return {
      blogs: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: '',
      results: [],
      category: [],
      loading: false,
    }
  },
  // async created () {
  //   this.blogs = (await BlogsService.index()).data 
  // },
  methods: { 
    appendResults: function () {
      if (this.blogs.length < this.results.length) {
        let toAppend = this.results.slice(
          this.blogs.length,
          LOAD_NUM + this.blogs.length
        )
        this.blogs = this.blogs.concat(toAppend)
      }
    },   
    navigateTo (route) {
      this.$router.push(route)
    },
    async deleteBlog (blog) {
      try {
        await BlogsService.delete(blog)
        this.refreshData()
      } catch (err) {
        console.log(err)
      }
    },
    async refreshData() {
      this.blogs = (await BlogsService.index()).data
    },
    setCategory (keyword) {  
      if(keyword === ' '){        
        this.search = ''      
        console.log('null')  
      } else {
        this.search = keyword      
      }         
    },
  },
  updated () {
    let sens = document.querySelector('#blog-list-bottom')
    pageWatcher = ScrollMonitor.create(sens)
    pageWatcher.enterViewport(this.appendResults)
  },
  beforeUpdated () {
    if (pageWatcher) {
      pageWatcher.destroy()
      pageWatcher = null
    }
  }
}
</script>
<style scoped>

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
.logo {
  padding-right: 20px;
}
.empty-blog {
  width: 100%;
  text-align: center;
  padding:10px;
  background:darksalmon;
  color:white;
}

/* thumbnail */
.thumbnail-pic img{
  width: 200px;
  padding: 5px 5px 5px 5px;
  border: solid 1px #ccc;
  margin: 10px 10px 0px 0px;
}

.blog-info {
  float: left;
}

.blog-pic {
  float: left;
}

.clearfix {
  clear: both;
}

.blog-list {
  border:solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
}

.blog-header {
  margin-top: 80px;
}

#blog-list-bottom{
  padding-top:4px;
}

.blog-load-finished{
  padding:4px;
  text-align: center;
  background: seagreen;
  color:white;
}

.categories {
  margin-top: 20px;
  padding: 0;
  list-style: none;
  float: left;
}

.categories li {
  float: left;
  padding: 2px;
}

.categories li a {
  padding: 5px 10px 5px 10px;
  background:paleturquoise; 
  color: black;
  text-decoration: none;
}

.categories li.clear a {
  background: tomato;
  color: white
}

.create-blog {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .logo {
    width: 120px;
  }
}

</style>