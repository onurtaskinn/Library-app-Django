import {
  createRouter,
  createWebHistory
} from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/students/:studentNum',
      name: 'getDetail',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/(Coco)AccountDetailView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AccountDetailView.vue')
    },
    {
      path: '/bookings',
      name: 'bookings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BookingView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HomeView_backup.vue')
    },
    {
      path: '/untrained',
      name: 'untrained',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UnTrainedView.vue')
    },
    {
      path: '/trained',
      name: 'trained',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TrainedView.vue')
    },
    {
      path: '/edittrained',
      name: 'edittrained',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EditTrainedView.vue')
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('../views/ReportView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test.vue')
    },
    {
      path: '/Area/:area',
      name: 'Area',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AreaView.vue')
    },
    {
      path: '/addArea/:area',
      name: 'addArea',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/addAreaView.vue')
    },
    {
      path: '/Area/:area/editArea/:id',
      name: 'editArea',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EditAreaView.vue')
    },
    {
      path: '/management',
      name: 'management',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/InChargedView.vue')
    },
    {
      path: '/login-success',
      name: 'login-success',
      // route level code-splittingp
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginSuccessView.vue')
    },
    {
      path: '/qweView',
      name: 'qweView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/qweView.vue')
    },
    {
      path: '/holiday',
      name: 'holiday',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/holidayView.vue')
    },
    {
      path: '/parameters',
      name: 'parameters',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/systemParameters.vue')
    } ,
    {
      path: '/holidayEdit',
      name: 'holidayEdit',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EditHolidayView.vue')
    }
    ,
    {
      path: '/approval',
      name: 'approval',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ApprovalBooking.vue')
    }
    ,
    {
      path: '/viewBooking',
      name: 'viewBooking',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ApprovalBooking.vue')
    }
    ,
    {
      path: '/approved',
      name: 'approval',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ApprovedBooking.vue')
    }
    ,
    {
      path: '/disapproved',
      name: 'disapproved',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DisapprovedBooking.vue')
    }
    ,
    {
      path: '/pending',
      name: 'pending',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PendingBooking.vue')
    }

    ,

    {
      path: '/EditApproval',
      name: 'EditApproval',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EditApprovalBooking.vue')
    }
    
    
  ]
})

export default router