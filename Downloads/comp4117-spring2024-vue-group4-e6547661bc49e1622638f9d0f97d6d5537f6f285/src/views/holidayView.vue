
<template>
  <HeaderComponent />
  <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="text-center flex-grow-1">
              <h2>Holiday</h2>
          </div>
          <div class="toolBar">

              <a class="btn-create" href="/holidayEdit">Create</a>
          </div>
      </div>
      <div class="card">
          <div class="card-body">
              <table class="table">
                  <thead>
                      <tr>
                          <th>Date</th>
                          <th>Holiday</th>
                          <th>Description</th>
                          <th>Edit</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="holiday in holidays" :key="holiday._id">
                          <td>{{ holiday.date }}</td>
                          <td>{{ holiday.name }}</td>
                          <td>{{ holiday.description }}</td>
                          <td>
                            <a  class="btn-edit" :href="'/holidayEdit?id=' + holiday._id" >Edit</a>
                            <button class="btn-del" @click="deleteForm(holiday)">Delete</button>


                          </td>


                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
      <br>
      <pagination :current-page="currentPage" :total-pages="totalPages" @update:currentPage="fetchHolidays" />
      <bookingCalculatorComponent v-model:selectedDate="selectedDate" />

  </div>

</template>


<script setup>
import bookingCalculatorComponent from '../components/bookingCalculator.vue';

import { ref, onMounted } from 'vue';
import { holidayService } from '../service/holidayService';
import HeaderComponent from '../components/TheHeader.vue';
import Pagination from '../components/paginationComponent.vue'; // Make sure this path is correct

const holidays = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);

async function fetchHolidays(page = 1) {
const response = await holidayService.getAllNPage({ page });
holidays.value = response.data;
totalPages.value = response.totalPages;
currentPage.value = response.page;
}

onMounted(() => {
fetchHolidays(currentPage.value);
});

async function deleteForm(holiday) {
if (confirm(`Are you sure you want to delete ${holiday.name}?`)) {
    await holidayService.delete(holiday._id);
    alert("Holiday is deleted");
    fetchHolidays(currentPage.value); // Refresh the list
}
}


</script>


<style scoped>

.btn-create {
cursor: pointer;
background-color: #4CAF50;
/* Green */
border: 1px solid #4CAF50;
color: white;
padding: 10px 20px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
margin: 4px 2px;
transition-duration: 0.4s;
border-radius: 12px;
}

.btn-create:hover {
background-color: white;
color: black;
border: 1px solid #4CAF50;
}

.btn-edit {
cursor: pointer;
background-color: #007bff; 
border: 1px solid #007bff; 
color: white; 
padding: 10px 20px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
margin: 4px 2px;
transition-duration: 0.4s;
border-radius: 12px;
}

.btn-edit:hover {
background-color: white; 
color: black;
border: 1px solid #007bff;
}

.btn-del {
  cursor: pointer;
  background-color: #dc3545; /* Red */
  border: 1px solid #dc3545; /* Red border */
  color: white; /* Keep text color white for contrast */
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  border-radius: 12px;
}

.btn-del:hover {
  background-color: white; /* White background on hover */
  color: #dc3545; /* Red text on hover */
  border: 1px solid #dc3545; /* Red border on hover */
}
</style>