<template>
  <div>    
    <main-header navsel="back"></main-header>
    <div class="book-header container">
      <h2>ส่วนจัดการหนังสือ</h2> 
       <div>
        <form class="form-inline form-search">
          <div class="form-group">              
            <div class="input-group">                        
            <input type="text" v-model="search" class="form-control" id="exampleInputAmount" placeholder="Search">
            <div class="input-group-addon"><i class="fas fa-search"></i></div>
            </div>
          </div>                
        </form>
      </div>             
      <div class="create-book">
        <button class="btn btn-success btn-sm" v-on:click="navigateTo('/book/create')"><i class="fas fa-file"></i> Create book</button>        
        <strong> จำนวน book: </strong> {{results.length}}
      </div>
      <ul class="categories"> 
        <li v-for="cate in category" v-bind:key="cate.index"><a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a></li>
        <li class="clear" ><a v-on:click.prevent="setCategory(' ')" href="#">Clear</a></li>
      </ul>
      <div class="clearfix"></div>   
    </div>        
    <div class="container">
      <transition-group name="fade">
        <div v-for="book in books" v-bind:key="book.id" class="book-list">
          <!-- <p>id: {{ book.id }}</p> -->
          <div class="book-pic">
            <transition name="fade">
              <div class="thumbnail-pic" v-if="book.thumbnail != 'null'">
                <img :src="BASE_URL+book.thumbnail" alt="thumbnail">
              </div>
            </transition>  
          </div>
          <h3>{{ book.title }}</h3>
          <div v-html="book.content.slice(0,200) + '...'"></div>      
          <div class="book-info">
            <p><strong>Category:</strong> {{ book.category }}</p>
            <p><strong>Create:</strong> {{ book.createdAt | formatedDate }}</p>
            <p><strong>Status:</strong> {{ book.status }}</p>
            <p><strong>Prices:</strong> {{ book.prices | getNumberWithCommas }} บาท</p>
            <!-- <p>status: {{ book.status }}</p> -->
            <p>
              <button class="btn btn-sm btn-info" v-on:click="navigateTo('/book/'+ book.id)"><i class="fab fa-readme"></i> View Book</button> 
              <button class="btn btn-sm btn-warning" v-on:click="navigateTo('/book/edit/'+ book.id)"><i class="fas fa-edit"></i> Edit Book</button>
              <button class="btn btn-sm btn-danger" v-on:click="deleteBook(book)"><i class="fas fa-trash-alt"></i> Delete</button>
            </p>
            <p>
              <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="suspend(book.id)"><i class="fas fa-pause"></i> Suspend</a>&nbsp;
              <a class="btn btn-success btn-sm" href="#" v-on:click.prevent="publish(book.id)"><i class="fas fa-check"></i> Published</a>&nbsp;
            </p>
          </div>
          <div class="clearfix"></div>      
        </div>
      </transition-group>
    </div>
    <div v-if="results.length === 0 && loading != true" class="empty-book">
        *** ไม่มีข้อมูล ***
    </div>
    <div id="book-list-bottom">
      <div class="book-load-finished" v-if="books.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
</template>
<script>
import BooksService from '@/services/BooksService'
import _ from 'lodash'
import ScrollMonitor from 'scrollMonitor'
import moment from 'moment'
import {mapState} from 'vuex'

let LOAD_NUM = 3
let pageWatcher

export default {
  data () {
    return {
      books: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: '',
      results: [],
      category: [],
      loading: false,
    }
  },
  filters: {
    formatedDate (value) {
      return moment(String(value)).format('DD-MM-YYYY')
    },
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ]),
  },
  watch: {  
    search: _.debounce(async function (value) {
      const route = {
        name: 'books'
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
        try {
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
        } catch (error) {
          this.loading = false
        }       
                    
      }       
    }
  },
  mounted () {
    if (!this.isUserLoggedIn) {
      this.$router.push({
        name: 'login'        
      })
    }
  },
  updated () {
    let sens = document.querySelector('#book-list-bottom')
    pageWatcher = ScrollMonitor.create(sens)
    pageWatcher.enterViewport(this.appendResults)
  },
  beforeUpdated () {
    if (pageWatcher) {
      pageWatcher.destroy()
      pageWatcher = null
    }
  },
  methods: {
    async suspend (bookId) {
      let user = {
        "id": bookId,
        "status":"saved"
      }

      try {
        await BooksService.put(user)
        this.refreshData()
      } catch (error) {
        console.log(error)
      }
    },
    async publish (bookId) {
      let user = {
        "id": bookId,
        "status":"published"
      }

      try {
        await BooksService.put(user)
        this.refreshData()
      } catch (error) {
        console.log(error)
      }
    },
    setCategory (keyword) {  
      if(keyword === ' '){        
        this.search = ''      
        console.log('null')  
      } else {
        this.search = keyword      
      }         
    },
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
      let result = confirm("Want to delete?")
      if (result) {
        try {
          await BooksService.delete(book)
          this.refreshData()
        } catch (err) {
          console.log(err)
        }
      }
    },
    async refreshData() {
      this.books = (await BooksService.index()).data
    }
  }
}
</script>
<style scoped>
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

.clearfix {
  clear: both;
}

.book-list {
  border:solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
}

.book-header {
  margin-top: 80px;  
  margin-left: auto;
  margin-right: auto;
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
  margin-top: 10px;
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
</style>
