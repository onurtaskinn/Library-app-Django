<script setup>
import { ref, onMounted } from 'vue';
import HeaderComponent from '../components/TheHeader.vue';
//import { jwtDecode } from "jwt-decode";
//import axios from 'axios';

const students = ref([]);




const isPaginated = ref(true);
const isPaginationSimple = ref(false);
const paginationPosition = ref("bottom");
const sortIcon = ref("arrow-up");
const sortIconSize = ref("small");
const defaultSortDirection = ref("asc");
const currentPage = ref(1);
const perPage = ref(10);
const data = students;



// const loadAsyncData = async () => {
//     try {
//         // Get the token from local storage    
//         const token = localStorage.getItem('token');
//         console.log("123")
//         // Send a request to the endpoint with the token in the Authorization header
//         var response = await fetch("/callback", {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             }
//         });
//         console.log("123")
//         if (!response.ok) {
//             throw new Error(response.statusText);
//         }

//         // convert the response to json
//         const json = await response.json();
//         console.log("321")
//         // log the json
//         console.log(json);
//         const decoded = jwtDecode(token);
//         console.log(decoded);
//         console.log("123")
//         // set the data
//         //users.value = json;
//     } catch (error) {
//         console.log(error);
//     }
// };







const fetchStudents = async () => {
  try {
    const response = await fetch('/api/trained');
    const json = await response.json();
    console.log(json);
    students.value = json;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};



onMounted(() => {
  fetchStudents();
  //loadAsyncData();
});
</script>

<template>
  <HeaderComponent />
  <br>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h2>All Trained Students</h2>
          </div>
          <div class="card-body">
            <div class="admin-approve-students">


              <o-table v-model:current-page="currentPage" :data="data" :paginated="isPaginated" :per-page="perPage"
                :pagination-simple="isPaginationSimple" :pagination-position="paginationPosition"
                :default-sort-direction="defaultSortDirection" :sort-icon="sortIcon" :sort-icon-size="sortIconSize"
                default-sort="ssoid">

                <o-table-column field="ssoid" label="Student ID" width="100" sortable>
                  <template #default="{ row }">
                    {{ row.ssoid }}
                  </template>
                </o-table-column>

                <o-table-column field="name" label="Name" width="100" sortable>
                  <template #default="{ row }">
                    {{ row.name }}
                  </template>
                </o-table-column>

                <o-table-column field="trainedOn" label="Trained On" width="200">
                  <template #default="{ row }">
                    <ul>
                      <li v-for="training in row.trained" :key="training.equipment">
                        {{ training.equipment }}
                      </li>
                    </ul>
                  </template>
                </o-table-column>

                <o-table-column field="expires" label="Expires" width="200">
                  <template #default="{ row }">
                    <ul>
                      <li v-for="training in row.trained" :key="training.expires">
                        {{ training.expires }}
                      </li>
                    </ul>
                  </template>
                </o-table-column>

              </o-table>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>





<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

button {
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

button:hover {
  background-color: white;
  color: black;
  border: 1px solid #4CAF50;
}

.card-header {
  background-color: rgba(103, 237, 80, 0.956);
}
</style>