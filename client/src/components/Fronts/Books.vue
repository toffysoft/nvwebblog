<template>   
  <div id="front">
    <main-header navsel="front"></main-header>
    <div class="component-wrapper container">      
      <div class="hero">
        <img src="@/assets/logonode.png" class="logo" style="float:left"> 
        <h1>ร้าน Ebook สั่งซื่อได้เลยครับ</h1>
        <p>By Gooddev.ME</p>      
      </div>
      <div class="clearfix"></div>
      <br>
      <div class="container new-book">
        <h2>หนังสือมาใหม่</h2>
        <div class="row">
          <div class="col-md-3" v-for="book in newBooks" v-bind:key="book.id" >
            <div v-if="book.thumbnail != 'null'">
              <img class="img-responsive" :src="BASE_URL+book.thumbnail" alt="thumbnail">
            </div>
            <h4>{{ book.title }}</h4>
            <div v-html="book.content.slice(0,200) + '...'"></div> 
            <p><strong>ราคา: </strong>{{ book.prices | getNumberWithCommas }}</p>
            <div>
              <button v-on:click.prevent="addCart(book)" class="btn btn-sm btn-danger"><i class="fas fa-shopping-cart"></i> เพิ่มลงตระกร้า</button>
              <button class="btn btn-sm btn-info" v-on:click="navigateTo('/front-view-book/'+ book.id)"><i class="fab fa-readme"></i> อ่านเพิ่ม</button> 
            </div>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
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
              <button v-on:click.prevent="addCart(book)" class="btn btn-sm btn-danger"><i class="fas fa-shopping-cart"></i> เพิ่มลงตระกร้า</button>
              <button class="btn btn-sm btn-info" v-on:click="navigateTo('/front-view-book/'+ book.id)"><i class="fab fa-readme"></i> อ่านเพิ่ม</button> 
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

    <!-- my carts -->
    <transition name="fade">
      <div class="popup-cart" v-if="carts.length">
        <h3>ตระกร้าสินค้า</h3>
        <ul class="cart">
          <li v-for="cart in carts" >
            <div>
              {{ cart.booktitle }} จำนวน {{ cart.qty}} x {{ cart.prices }}
            </div>            
            <div>
              <button v-on:click.prevent="inc(cart)" class="btn btn-default btn-xs">&nbsp;+&nbsp;</button> 
              <button v-on:click.prevent="dec(cart)" class="btn btn-default btn-xs">&nbsp;-&nbsp;</button>
            </div>
          </li>
        </ul>
        <hr>
        <p>รวมทั้งสิ้น: {{total | getNumberWithCommas}} บาท </p>
        <button class="btn btn-xs btn-danger" v-on:click.prevent="sendBuy" ><i class="fas fa-check-square"></i> ทำการสั่งซื้อ</button>
      </div>
    </transition>
  </div>
</template>
<script>

import BooksService from '@/services/BooksService'
import BuysService from '@/services/BuysService'
import _ from 'lodash'
import ScrollMonitor from 'scrollMonitor'
import moment from 'moment'
import {mapState} from 'vuex'

let LOAD_NUM = 3
let pageWatcher

export default {
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  filters: {
    formatedDate (value) {
      return moment(String(value)).format('DD-MM-YYYY')
    },
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

      // console.log('search: ' + this.search)
      this.$router.push(route)
    }, 700),

    '$route.query.search': {
      immediate: true,
      async handler (value) {            
        this.books = []
        this.results = []      
        this.loading = true    
        this.results = (await BooksService.frontIndex(value)).data       
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
      newBooks:[],
      carts:[],   
      total: 0
    }
  },
  // async created () {
  //   this.books = (await BooksService.index()).data 
  // },
  methods: { 
    sendBuy () {
      this.carts.forEach(async (cart) => {
        console.log("cart: " + JSON.stringify(cart))

        try {
          await BuysService.post(cart)
          this.$router.push({
            name: 'cartlist'
          })
        } catch (err) {
          console.log(err)
        }
      })
    },
    inc (item) {
        item.qty++
        this.total += parseInt(item.prices)
    },
    dec (item) {
      item.qty--
      this.total -= parseInt(item.prices)

      if(item.qty <= 0) {
        let i = this.carts.indexOf(item)
        this.carts.splice(i, 1)
        // this.total = 0
      }
    },
    addCart (book) {
      if (this.user == null) {
        alert('Please, Register or Login before.\n\nThank you.')
      } else {
        this.total += parseInt(book.prices)
        
        let found = false
        this.carts.map((cart) => { 
          if(cart.bookid == book.id) {
            cart.qty++
            found = true
          }
        })
        
        if (!found) {
          let cart = {
            bookid:book.id,
            userid:this.user.id,
            email:this.user.email,
            qty:1,
            booktitle:book.title,
            username:this.user.name,
            userlastname:this.user.lastname,
            prices:book.prices,
            clientStatus:"รอชำระ",
            shopStatus:"รอส่ง",
          }
          this.carts.push(cart)
        }
        
        // console.log('carts length: ' + this.carts.length)
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
  async created () {    
    let allBooks = (await BooksService.frontIndex()).data
    this.newBooks = allBooks.slice(0,4)
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
  }
}
</script>
<style scoped>
.popup-cart {
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
  border: solid 1px #ddd;
  background: #fff;
  width:360px;
  padding: 10px;
  position:fixed;
  bottom:0;
  right:0;  
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right:  5px;
}

ul.cart {
  list-style: none;
  padding: 0;
}

.new-book h2 {
  font-family: kanit;
  padding-bottom: 20px;
  margin-top: 30px;
}

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