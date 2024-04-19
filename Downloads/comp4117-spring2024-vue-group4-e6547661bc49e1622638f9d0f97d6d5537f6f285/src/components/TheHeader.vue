<script setup>
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'vue-router';
const router = useRouter();
// const user = ref({
//   name: '',
// });
const ssoid = ref("");
const role = ref("");
const loadAsyncData = async () => {

  try {                                                                //test token

    const token = localStorage.getItem('token');



    if (!token) {
      alert("please login first!");
      router.push('/login');
    }

    //console.log(token);
    //console.log("30");
    const decoded = jwtDecode(token);
    const token2 = `${decoded.token2}`;
    const decoded2 = jwtDecode(token2);

    console.log("40");
    console.log("30", decoded);
    //  console.log(role.value);
    console.log("decoded", decoded);
    //console.log(role.value);
    ssoid.value = `${decoded.user.ssoid}`;
    //console.log(ssoid);
    //name.value = `${decoded.name}`;
    role.value = `${decoded2.employee_type}`;
    console.log(role);
    console.log(role.value);
    //this.$emit('getUserData', { ssoid: decoded.user.ssoid, role: decoded.user.employee_type });  // 唔知有咩用
    //console.log(ssoid);
    //console.log("1");
  } catch (error) {
    console.log(error);
  }
};
const logout2 = function () {
  localStorage.removeItem('token');

  //location.reload()
  router.push('/login')
}



const isLoggedIn = ref(true);
onMounted(() => {
  loadAsyncData();

});
</script>


<template>
  <nav v-if="isLoggedIn" class="navbar navbar-expand-lg bg-body-tertiary" style="z-index:999">
    <div class="container-fluid">
      <a class="navbar-brand" href="/profile">
        <h4>Booking System</h4>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="/profile">Dashboard</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/dashboard">View Booking</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/bookings">Booking</a>
          </li>
          

          <li v-if="role == 'STAFF'||role == 'ADMIN' ||role == 'EQ STAFF'" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              Approval Bookings
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="/viewBooking">All Booking</a></li>
              <li><a class="dropdown-item" href="/pending">Pending Booking</a></li>
              <li><a class="dropdown-item" href="/approved">Approved Booking</a></li>
              <li><a class="dropdown-item" href="/disapproved">Dispproved Booking</a></li>


            </ul>
          </li>

          <!--<li v-if="role === 'ADMIN'" class="nav-item dropdown">-->
            <li v-if="role == 'STAFF'||role == 'ADMIN' ||role == 'EQ STAFF'" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              Admin
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="/management">Admin Management</a></li>
              <li><a class="dropdown-item" href="/holiday">Holiday</a></li>
              <li><a class="dropdown-item" href="/parameters">System Parameters</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
                <li><a class="dropdown-item" href="/trained">Trained Student</a></li>
                <li><a class="dropdown-item" href="/untrained">Untrained Student</a></li>
                <li><a class="dropdown-item" href="/edittrained">Edit</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="/report">Report</a></li>
            </ul>
          </li>
        </ul>
        <button class="btn btn-sm btn-outline-dark" type="button" @click="logout2">Logout</button>
      </div>
      <span>Welcome, {{ ssoid }}! {{ role }}</span>
    </div>
  </nav>
  <nav v-else>
    <ul>
      <li><a href="/login">Login</a></li>
      <li><a href="/register">Register</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isDropdownVisible: false
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    logout2() {
      // Your logout code here
    }
  }
};
</script>


<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown-item {
  padding: 10px 20px;
  display: block;
  width: 100%;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
}

.dropdown-item:hover {
  background-color: #f2f2f2;
}

.nav-item {
  position: relative;
}

</style>