<style scoped>
table {
    width: 100%;
    border-spacing: 0;

}

tr:nth-child(even){
    background-color: #e9e9e980;
}

a { text-decoration: none; }
a:hover, a:focus {text-decoration: underline; }

th{
    cursor: pointer;
}
th,
td {
    padding: 6px;
    text-align: center;
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

.button:hover {
  background-color: white;
  color: black;
  border: 1px solid #4CAF50;
}

.btn {
  background-color: white;
  border: 0px;
  color: black;
  margin-right: 10px;
}

.btn:hover {
  background-color: white;
  border: 0px;
  color: rgb(112, 110, 110);
}

.btn-edit {
  background-color: #007bff; 
  color: white;
  border: 1px solid #007bff; 
}

.btn-edit:hover {
  background-color: white;
  color: black;
  border: 1px solid #007bff;
}

.btn-delete {
  background-color: #dc3545; 
  color: white; 
  border: 1px solid #dc3545; 
}

.btn-delete:hover {
  background-color: white; 
  color: black;
  border: 1px solid #dc3545;
}


.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto; 
  max-width: 50%
}

.page-show-word {
  font-style: italic;
  color: rgb(95, 95, 95);
  margin-right: 15px;
}

</style>

<template>
    <HeaderComponent />
    <form>
        <div class="add-room" style="text-align: left; padding:0 18px 0 18px">
            <h4>Room Details</h4>
            <hr>
            <div>
                Add Facility: <RouterLink :to="`/addArea/${area}`"><button class="button">Add </button></RouterLink>
            </div>
        </div>
        <br>
        <div class="page-container">
          <o-table
          v-model:current-page="currentPage"
          :data="facilities"
          :paginated="isPaginated"
          :per-page="perPage"
          :pagination-simple="isPaginationSimple"
          :pagination-position="paginationPosition"
          :default-sort-direction="defaultSortDirection"
          :sort-icon="sortIcon"
          :sort-icon-size="sortIconSize"
          default-sort="_id"
          class="table-striped"
          @sort="sortData">
          
          <o-table-column
          v-slot="{ row }"
            field="index"
            label="Index"
            width="40"
            numeric
            sortable>
            {{ row.area }}
          </o-table-column>
      
          <o-table-column
          v-slot="{ row }"
            field="_id"
            label="ID"
            sortable>
            {{ row.name }}
          </o-table-column>
      
          <o-table-column
          v-slot="{ row }"
            field="name"
            label="Name"
            sortable>
            {{ row.name }}
          </o-table-column>
      
          <o-table-column
          v-slot="{ row }"
            field="status"
            label="Enabled"
            sortable>
            {{ row.stat }}
          </o-table-column>
      
          <o-table-column
          v-slot="{ row }"
            field="description"
            label="Description"
            sortable>
            {{ row.description }}
          </o-table-column>
      
          <o-table-column
          v-slot="{ row }"
            field="capacity"
            label="Capacity"
            sortable>
            {{ row.capacity }}
          </o-table-column>
      
          <o-table-column
          v-slot="{ row }"
            field="facilityStat"
            label="Facility Status">
            {{ row.status }}
          </o-table-column>
      
          <o-table-column
          v-slot="{ row }"
            field="inCharger"
            label="Scientific Officers in charge"
            sortable>
            {{ row.inCharger }}
          </o-table-column>
      
          <o-table-column
            label="Action">
            <template #default="{ row }">
              <router-link :to="`/Area/${area}/editArea/` + row._id">
                <button type="button" class="btn btn-edit">Edit</button>
              </router-link>
              <button type="button" @click="deleteFac(row._id)" class="btn btn-delete">Delete</button>
            </template>
          </o-table-column>
      
        </o-table>
        </div>
    </form>
</template>

<script setup>
import HeaderComponent from '../components/TheHeader.vue';
import { ref, onMounted , watch, computed } from 'vue'



const searchArea = ref('');
const facilities = ref([]); 
// const facilities = ref({
//     area:'',
//     name:'',
//     status: 'Enable',
//     description:'',
//     capacity: 1,
//     facilityStat: '',
//     inCharger:''
// });

const currentPage = ref(1);
const itemsPerPage = ref(5); // items per page set to 5
const totalRecords = ref(0);
const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage.value));

const isPaginated = ref(true);
const perPage = ref(10);
const isPaginationSimple = ref(false);
const paginationPosition = ref("bottom");
const defaultSortDirection = ref("asc");
const sortIcon = ref("arrow-up");
const sortIconSize = ref("small");
const route = useRoute();
import { useRoute } from 'vue-router';

const changePage = (offset) => {
  const newPage = currentPage.value + offset;
  if (newPage < 1 || newPage > totalPages.value) {
    return;
  }
  currentPage.value = newPage;
  getData();
};
// const facilities = ref({
//     area: '',
//     name: '',
//     location: '',
//     capacity: 1,
//     description: '',
//     availability: [{
//         date: '',
//         timeslot: [{
//             startTime: '',
//             endTime: '',
//             isBooked: false,
//         }]
//     }],
// });
const area = route.params.area;
const getData = async function () {
    // get the booking from the backend
  
    const response = await fetch(`/api/area/${area}`);
    // convert the response to json
    const json = await response.json();
    // log the json
    console.log(json);
    // set the booking, copy by value instead of reference
    facilities.value = json;
    console.log("jam",facilities.value)
}

onMounted(async () => {
    getData();
});

const sortData = async function(number) {
  var tableToSort, rows, switching, i, x, y, ToSwitch, direction, count = 0;
  tableToSort = document.getElementById("myTable");
  direction = "ASC";
  switching = true;
  console.log(number)
  while (switching) {
    switching = false;
    rows = tableToSort.getElementsByTagName('tr');
    for (i=1; i < (rows.length-1); i++){
        ToSwitch = false;
        x = rows[i].getElementsByTagName("td")[number];
        y = rows[i + 1].getElementsByTagName("td")[number];
      if (direction == "ASC"){
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()){
            ToSwitch= true;
            break;
        }
      }else if(direction == "DESC"){
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()){
            ToSwitch = true;
            break;
        }
      }
    }
    if (ToSwitch){
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      count ++;      
    }else{
      if (count == 0 && direction == "ASC"){
        direction = "DESC";
        switching = true;
      }
    }
  }
}

const deleteFac = async (id) => {
  const userInput = prompt('Please enter "confirm" to delete the record.');

  if (userInput !== null && userInput.toLowerCase() === "confirm") {
    try {
      const response = await fetch(`/api/area/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
      alert('Record deleted successfully.');
      location.reload();
    } catch (error) {
      console.error('Error deleting the record:', error);
      alert(`Error deleting record: ${error.message}`);
    }
  } else {
    alert('Delete action canceled.');
  }
};

const searching = async () => {
    let url = '/api/area/:area';
    if (searchArea.value)
        url = `/api/area/:area/search?name=${searchArea.value}`; //dont search by given id

    try {
        console.log(url)
        const response = await fetch(url);
        const json = await response.json();
        facilities.value = json;
    } catch (error) {
        console.log("error");
        facilities.value = [];

    }
}

// const sortData = async function (val,direction){
//     if(direction == 'ASC'){
//          if(cmpX > cmpY)
//         facilities.value.sort((a,b) => (a[val] > b[val] ? 1 : -1));
//         direction = 'DESC';
//         console.log('hi1')
//          break;
//     }else if(direction == 'DESC'){
//          if(cmpX < cmpY)
//         facilities.value.sort((a,b) => (a[val] < b[val] ? 1 : -1 ));
//         direction = 'ASC';
//         console.log('hi2')
//          break;

        
//     }
// }



</script>