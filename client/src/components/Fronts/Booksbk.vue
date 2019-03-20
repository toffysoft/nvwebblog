<template>   
  <div>
    <main-header navsel="front"></main-header>
    <div class="component-wrapper container">      
    <div class="hero">
      <img src="@/assets/logonode.png" class="logo" style="float:left"> 
      <h1>ร้านหนังสือออนไลน์ สั่งซื่อได้เลยครับ</h1>
      <p>By Gooddev.ME</p>      
    </div>
    <div class="clearfix"></div>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1>หนังสือมาใหม่</h1>
          <ul>
            <li v-for="book in newBooks" v-bind:key="book.id">
              <p>{{ book.title }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="book-header">
      <div>
        <form class="form-inline form-search">             
          <span><strong> จำนวน book: </strong> {{results.length}} </span>
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
      <div v-for="book in books" v-bind:key="book.id" class="book-list">
        <!-- <p>id: {{ book.id }}</p> -->
        <div class="book-pic">
          <!-- <transition name="fade"> -->
            <div class="thumbnail-pic" v-if="book.thumbnail != 'null'">
              <img :src="BASE_URL+book.thumbnail" alt="thumbnail">
            </div>
          <!-- </transition>   -->
        </div>
        <h3>{{ book.title }}</h3>
        <div v-html="book.content.slice(0,200) + '...'"></div>      
        <div class="book-info">
          <p><strong>Category:</strong> {{ book.category }}</p>
          <p><strong>Create:</strong> {{ book.createdAt | formatedDate }}</p>
          <!-- <p>status: {{ book.status }}</p> -->
          <p>
            <button class="btn btn-sm btn-info" v-on:click="navigateTo('/front/read/'+ book.id)"><i class="fab fa-readme"></i> View Book</button> 
          </p>
        </div>
        <div class="clearfix"></div>      
      </div>
    </transition-group>
    <div v-if="books.length === 0 && loading === false" class="empty-book">
        *** ไม่มีข้อมูล ***
    </div>
    <div id="book-list-bottom">
      <div class="book-load-finished" v-if="books.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
  </div>
</template>
<script>

import BooksService from '@/services/BooksService'
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
        name: 'front-books'
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
        this.books = []
        this.results = []      
        this.loading = true    
        this.results = (await BooksService.index(value)).data       
        this.appendResults()

        this.results.forEach(book => {       
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(book.category))
            if(this.category.indexOf(book.category) === -1) {
              this.category.push(book.category)
            }
          } else {
            
            this.category.push(book.category)
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
      books: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: '',
      results: [],
      category: [],
      loading: false,
      newBooks: []
    }
  },
  // async updated () {
  //   this.newBooks = this.results.slice(0,5)
  // },
  methods: { 
    appendResults: function () {
      if (this.books.length < this.results.length) {
        let toAppend = this.results.slice(
          this.books.length,
          LOAD_NUM + this.books.length
        )
        this.books = this.books.concat(toAppend)
      }
    },   
    navigateTo (route) {
      this.$router.push(route)
    },
    async deleteBook (book) {
      try {
        await BooksService.delete(book)
        this.refreshData()
      } catch (err) {
        console.log(err)
      }
    },
    async refreshData() {
      this.books = (await BooksService.index()).data
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
    // this.newBooks = this.results.slice(0,4)
    // console.log('results on updated: ' + this.results)

    let sens = document.querySelector('#book-list-bottom')
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
  background:lightslategray;
  height:250px;
  color:white;
  padding: 20px;
}

.hero h1 {
  margin-top: 30px;
  font-family: 'kanit';
}
.logo {
  padding-right: 20px;
  max-width: 200px;
}
.empty-book {
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

.book-info {
  float: left;
}

.book-pic {
  float: left;
}


.book-list {
  border:solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
}

.book-header {
  margin-top: 80px;
}

#book-list-bottom{
  padding-top:4px;
}

.book-load-finished{
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

.create-book {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .logo {
    width: 120px;
  }
}

</style>