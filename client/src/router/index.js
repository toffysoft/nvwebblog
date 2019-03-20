import Vue from 'vue'
import Router from 'vue-router'

// Users
import UserIndex from '@/components/Users/Index'
import UserCreate from '@/components/Users/CreateUser'
import UserEdit from '@/components/Users/EditUser'
import UserShow from '@/components/Users/ShowUser'

// Authen
import Login from '@/components/Login'

// Comments
import CommentIndex from '@/components/Comments/Index'

// Blogs
import BlogIndex from '@/components/Blogs/Index'
import BlogCreate from '@/components/Blogs/CreateBlog'
import BlogEdit from '@/components/Blogs/EditBlog'
import BlogShow from '@/components/Blogs/ShowBlog'

// Books
import BookIndex from '@/components/Books/Index'
import BookCreate from '@/components/Books/CreateBook'
import BookEdit from '@/components/Books/EditBook'
import BookShow from '@/components/Books/ShowBook'

// Upload Testing
import Upload from '@/components/Utils/Upload'

// Front
import FrontIndex from '@/components/Fronts/Index'
import FrontShow from '@/components/Fronts/ShowBlog'
import FrontBooks from '@/components/Fronts/Books'
import FrontViewBook from '@/components/Fronts/ViewBookMore'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // front
    {
      path: '/front',
      name: 'front',
      component: FrontIndex
    },
    {
      path: '/front/read/:blogId',
      name: 'front-read',
      component: FrontShow
    },
    {
      path: '/front-books',
      name: 'front-books',
      component: FrontBooks
    },
    {
      path: '/front-view-book/:bookId',
      name: 'front-view-books',
      component: FrontViewBook
    },
    // {
    //   path: '/front/view/:blogId',
    //   name: 'front-view',
    //   component: FrontShow
    // },
    
    // upload testing
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },

    // blogs
    {
      path: '/blogs',
      name: 'blogs',
      component: BlogIndex
    },
    {
      path: '/blog/create',
      name: 'blogs-edit',
      component: BlogCreate
    },
    {
      path: '/blog/edit/:blogId',
      name: 'blog-edit',
      component: BlogEdit
    },
    {
      path: '/blog/:blogId',
      name: 'blog',
      component: BlogShow
    },

    // books
    {
      path: '/books',
      name: 'books',
      component: BookIndex
    },
    {
      path: '/book/create',
      name: 'books-edit',
      component: BookCreate
    },
    {
      path: '/book/edit/:bookId',
      name: 'book-edit',
      component: BookEdit
    },
    {
      path: '/book/:bookId',
      name: 'book',
      component: BookShow
    },

    // comments
    {
      path: '/comments',
      name: 'comments',
      component: CommentIndex
    },


    // authen
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    // user
    {
      path: '/users',
      name: 'users',
      component: UserIndex
    },
    {
      path: '/user/create',
      name: 'users-create',
      component: UserCreate
    },
    {
      path: '/user/edit/:userId',
      name: 'user-edit',
      component: UserEdit
    },
    {
      path: '/user/:userId',
      name: 'user',
      component: UserShow
    },  
    {
      path: '*',
      redirect: '/front'
    }  
  ]
})
