<template>
  <div>    
    <!-- new navbar -->
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand navbar-link" href="#" v-on:click.prevent="navigateTo('/dashboard')">
            <img src="@/assets/logo.png" id="logo">
          </a>
          <button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span><span class="icon-bar"></span>front-cartlist
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navcol-1">
          <ul class="nav navbar-nav navbar-right">
            <li role="presentation"><router-link :to="{name: 'front'}" ><i class="fas fa-home" ></i> Home</router-link></li>
            <li role="presentation"><router-link :to="{name: 'front-books'}" ><i class="fas fa-book-open"></i> Books</router-link></li>          
            <li v-if="!isUserLoggedIn" role="presentation"><a href="#" v-on:click.prevent="showLogin = true" >Login</a></li>
            <li v-if="!isUserLoggedIn" role="presentation"><a href="#" v-on:click.prevent="showRegister = true" >Register</a></li>
            <transition name="fade">
            <li v-if="isUserLoggedIn" role="presentation"><router-link :to="{name: 'cartlist'}" ><i class="fas fa-user"></i> {{user.name}}</router-link></li>
            </transition>            
            <li v-if="isUserLoggedIn" role="presentation"><a href="#" v-on:click.prevent="logout">Logout</a></li>
          </ul>
        </div>        
      </div>
    </div>
    <div class="modal" v-if="showLogin"> 
      <transition name="fade">
        <div class="login-wrapper">
          <h3>Client Login</h3>
          <form v-on:submit.prevent="clientLogin" class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-md-3">Email:</label>
              <div class="col-md-9">
                <input required placeholder="email" type="email" v-model="email" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3">Password:</label>
              <div class="col-md-9">
                <input required type="password" placeholder="password" v-model="password" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-offset-3 col-md-9">                    
                <button class="btn btn-success btn-sm" type="submit"><i class="fas fa-key"></i> Login</button>
                <button v-on:click.prevent="showLogin = false" class="btn btn-danger btn-sm" type="button"><i class="fas fa-times-circle"></i> Close</button>
              </div>
            </div>
            <div class="error">
              <div v-html="error" v-if="error"></div>
            </div>
          </form>
        </div> 
      </transition> 
    </div> 
    <div class="modal" v-if="showRegister"> 
      <transition name="fade">
        <div class="login-wrapper">
          <h3>Client Register</h3>
          <form v-on:submit.prevent="clientRegister" class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-md-3">Email:</label>
              <div class="col-md-9">
                <input required placeholder="email" type="email" v-model="client.email" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3">Password:</label>
              <div class="col-md-9">
                <input required type="password" placeholder="password" v-model="client.password" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3">Name:</label>
              <div class="col-md-9">
                <input required type="text" placeholder="name" v-model="client.name" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3">Lastname:</label>
              <div class="col-md-9">
                <input required type="text" placeholder="lastname" v-model="client.lastname" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-offset-3 col-md-9">                    
                <button class="btn btn-success btn-sm" type="submit"><i class="fas fa-key"></i> Register</button>
                <button v-on:click.prevent="showRegister = false" class="btn btn-danger btn-sm" type="button"><i class="fas fa-times-circle"></i> Close</button>
              </div>
            </div>
            <div class="error">
              <p v-if="error">{{error}}</p>
            </div>
          </form>
        </div> 
      </transition> 
    </div>  
    <transition name="fade">
      <div v-if="resultUpdated != ''" class="popup-msg">      
        <p>{{ resultUpdated }}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import AuthenService from '@/services/AuthenService'
import UsersService from '@/services/UsersService'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: '',
      showLogin: false,
      showRegister: false,
      resultUpdated: '',
      client: {
        name: '',
        lastname: '',
        email: '',
        password: '',
        status: 'active',
        type: 'user'
      }   
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ]),
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'front'
      })
      this.resultUpdated = "Logout successful."
      setTimeout(() => this.resultUpdated = '', 5000)
    },
    async clientRegister () {
      console.log(this.client)
      try {
        await UsersService.post(this.client)   
        this.client = {}   
        this.showRegister = false
        this.resultUpdated = "Register successful, Please login first."
        setTimeout(() => this.resultUpdated = '', 5000) 
      } catch (error) {
        console.log(error)
        this.client = {}
        this.error = error.response.data.error
        setTimeout(() => this.error = '', 5000)
      }

    },
    async clientLogin () {
      console.log(`acc: ${this.email} -${this.password}`)
      try {
        const response = await AuthenService.clientLogin({
          email: this.email,
          password: this.password
        })

        this.error = ''

        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)

        // this.$router.push({
        //   name: 'blogs'
        // })
        // console.log(response.data)
        this.email = '',
        this.password = '',
        this.showLogin = false
        this.resultUpdated = "Login successful."
        setTimeout(() => this.resultUpdated = '', 5000)
        
      } catch (error) {
        console.log(error)      
        this.error = error.response.data.error
        this.email = ''
        this.password = ''  
        setTimeout(() => this.error = '', 5000)
      }
    },
  }
}
</script>
<style scoped>
a.router-link-active {
  color:turquoise !important;
} 
.error {
  color: red;
  text-align: center;
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
.navbar-brand > img {
  width: 36px;
  padding: 12px 0;
  margin-top: -20px;
}
.navbar-inverse {
  background-color:#51415F;
}

.navbar-inverse .navbar-nav>li>a {
    color: #DBDBF6;
}

.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 10; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.login-wrapper {
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.5);
  border: solid 1px #ddd;
  width: 320px;
  padding: 10px 30px 20px 30px;
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  /* padding: 20px;   */
}

.login-wrapper h3 {
  text-align: center;
  padding-bottom: 10px;
}
</style>


