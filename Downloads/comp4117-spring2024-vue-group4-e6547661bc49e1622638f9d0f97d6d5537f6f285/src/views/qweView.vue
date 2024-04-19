<script setup>
import { ref, onMounted } from 'vue'
import { jwtDecode } from "jwt-decode";
import HeaderComponent from '../components/TheHeader.vue';

const name = ref("");
const role = ref("");

const tableData = [
    {
        id: 1,
        user: { first_name: "Jesse", last_name: "Simmons" },
        date: "2016/10/15 13:43:27",
        gender: "Male",
    },
    {
        id: 2,
        user: { first_name: "John", last_name: "Jacobs" },
        date: "2016/12/15 06:00:53",
        gender: "Male",
    },
    {
        id: 3,
        user: { first_name: "Tina", last_name: "Gilbert" },
        date: "2016/04/26 06:26:28",
        gender: "Female",
    },
    {
        id: 4,
        user: { first_name: "Clarence", last_name: "Flores" },
        date: "2016/04/10 10:28:46",
        gender: "Male",
    },
    {
        id: 5,
        user: { first_name: "Anne", last_name: "Lee" },
        date: "2016/12/06 14:38:38",
        gender: "Female",
    },
    {
        id: 6,
        user: { first_name: "Sara", last_name: "Armstrong" },
        date: "2016/09/23 18:50:04",
        gender: "Female",
    },
    {
        id: 7,
        user: { first_name: "Anthony", last_name: "Webb" },
        date: "2016/08/30 23:49:38",
        gender: "Male",
    },
    {
        id: 8,
        user: { first_name: "Andrew", last_name: "Greene" },
        date: "2016/11/20 14:57:47",
        gender: "Male",
    },
    {
        id: 9,
        user: { first_name: "Russell", last_name: "White" },
        date: "2016/07/13 09:29:49",
        gender: "Male",
    },
    {
        id: 10,
        user: { first_name: "Lori", last_name: "Hunter" },
        date: "2016/12/09 01:44:05",
        gender: "Female",
    },
    {
        id: 11,
        user: { first_name: "Ronald", last_name: "Wood" },
        date: "2016/12/04 02:23:48",
        gender: "Male",
    },
    {
        id: 12,
        user: { first_name: "Michael", last_name: "Harper" },
        date: "2016/07/27 13:28:15",
        gender: "Male",
    },
    {
        id: 13,
        user: { first_name: "George", last_name: "Dunn" },
        date: "2017/03/07 12:26:52",
        gender: "Male",
    },
    {
        id: 14,
        user: { first_name: "Eric", last_name: "Rogers" },
        date: "2016/06/07 05:41:52",
        gender: "Male",
    },
    {
        id: 15,
        user: { first_name: "Juan", last_name: "Meyer" },
        date: "2017/02/01 04:56:34",
        gender: "Male",
    },
    {
        id: 16,
        user: { first_name: "Silvia", last_name: "Rosa" },
        date: "2017/01/26 11:50:04",
        gender: "Female",
    },
    {
        id: 17,
        user: { first_name: "Lori", last_name: "Cunningham" },
        date: "2016/05/01 10:00:56",
        gender: "Female",
    },
    {
        id: 18,
        user: { first_name: "Charles", last_name: "Graham" },
        date: "2016/05/31 06:43:30",
        gender: "Male",
    },
    {
        id: 19,
        user: { first_name: "Henry", last_name: "Morrison" },
        date: "2016/09/27 16:15:44",
        gender: "Male",
    },
    {
        id: 20,
        user: { first_name: "Albert", last_name: "Mendoza" },
        date: "2016/08/08 05:29:24",
        gender: "Male",
    },
    {
        id: 21,
        user: { first_name: "Ruby", last_name: "Snyder" },
        date: "2017/04/01 12:04:39",
        gender: "Female",
    },
    {
        id: 22,
        user: { first_name: "Jesse", last_name: "Warren" },
        date: "2016/08/20 01:36:38",
        gender: "Male",
    },
    {
        id: 23,
        user: { first_name: "Carlos", last_name: "Ferguson" },
        date: "2016/05/31 10:40:29",
        gender: "Male",
    },
    {
        id: 24,
        user: { first_name: "Melissa", last_name: "Peters" },
        date: "2016/07/23 00:41:54",
        gender: "Female",
    },
    {
        id: 25,
        user: { first_name: "Arthur", last_name: "Garza" },
        date: "2017/03/11 14:11:37",
        gender: "Male",
    },
    {
        id: 26,
        user: { first_name: "Joe", last_name: "Berry" },
        date: "2016/07/09 15:16:56",
        gender: "Male",
    },
    {
        id: 27,
        user: { first_name: "Joseph", last_name: "Bishop" },
        date: "2016/10/04 19:44:54",
        gender: "Male",
    },
    {
        id: 28,
        user: { first_name: "Sarah", last_name: "Harper" },
        date: "2016/09/23 05:09:11",
        gender: "Female",
    },
    {
        id: 29,
        user: { first_name: "Christopher", last_name: "Fuller" },
        date: "2016/04/12 00:05:35",
        gender: "Male",
    },
];
const data1 = ref(tableData);

const students = ref([]);

const isPaginated = ref(true);
const isPaginationSimple = ref(false);
const paginationPosition = ref("bottom");
const sortIcon = ref("arrow-up");
const sortIconSize = ref("small");
const defaultSortDirection = ref("asc");
const currentPage = ref(1);
const perPage = ref(4);
const data = students;

const fetchStudents = async () => {
  let url = `/api/allStudent`;
  // if (searchQuery.value) {
  //   url += `&ssoid=${searchQuery.value}`;
  // }

  try {
    const response = await fetch(url);
    const { results} = await response.json();
    students.value = results;
    console.log("student:",students.value)
    console.log("student:",data1.value)
  } catch (error) {
    console.error("Error fetching students:", error);
    students.value = [];
  }
};

const loadAsyncData = async () => {

try {
  // if (window.location.search.includes('token=')) {
  // const token = new URLSearchParams(window.location.search).get('token');
  // localStorage.setItem('token', token);
  const token = localStorage.getItem(token);

  // Get the token from local storage    
  //console.log("1");
  // const token = localStorage.getItem('token');
  //console.log(token);
  const decoded = jwtDecode(token);
  console.log("55555555555");
  
  name.value = `${decoded.name}`;
  role.value = `${decoded.role}`;
  this.$emit('getUserData', { stuID: decoded.stuID, name: decoded.name, role: decoded.role });
  //}
} catch (error) {
  //console.log(error);
}
};

onMounted(async () => {
  fetchStudents();
  
  loadAsyncData();
});
</script>

<template>
  <HeaderComponent />
  
<section>
  

  <p><b>Page:</b> {{ currentPage }}</p>

  <o-table
      v-model:current-page="currentPage"
      :data="data"
      :paginated="isPaginated"
      :per-page="perPage"
      :pagination-simple="isPaginationSimple"
      :pagination-position="paginationPosition"
      :default-sort-direction="defaultSortDirection"
      :sort-icon="sortIcon"
      :sort-icon-size="sortIconSize"
      default-sort="name">
      <o-table-column
          v-slot="props"
          field="name"
          label="ID"
          width="40"
          sortable
          numeric>
          {{ props.row.name }}
      </o-table-column>

      
  </o-table>
</section>

</template>



<style></style>