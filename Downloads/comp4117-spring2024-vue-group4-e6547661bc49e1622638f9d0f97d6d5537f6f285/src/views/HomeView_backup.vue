<template>
  <HeaderComponent  @getUserData="handleUserData" />


    <div class="nav-header" >
        <div id="studentHistory" class="split-left"   >
          <table class="table my-2" style="padding-right: 30px; text-align: center;">
            <thead>
               <tr v-if="role == 'STUDENT'">
                <th scope="col">Equipment</th>
                <th scope="col">Date</th>
                <th scope="col">Time-slot</th>
                <th scope="col">Edit</th>
              </tr>
              <tr v-else>
                <u>Areas</u>
                <a href="/Area/Central Facility Lab"  class="dropdown-item">Central Facility Lab</a>
                <a href="/Area/IAMSML"  class="dropdown-item">IAM/SML</a>
                <a href="/Area/new" class="dropdown-item">new</a>
              </tr>
            </thead>
        </table>
        </div>

        <div class="split-right">
          <!-- Date Picker Input -->
        <bookingCalculatorComponent v-model:selectedDate="selectedDate" />
    </div>
      </div>

      <select v-model="selectedArea" name="area" id="area"  class="form-control"  style="margin-right: 20px;">
        <option value="all" >All Area</option>
        <option v-for="area in areas" :key="area._id" :value="area">{{ area.name }}</option>
      </select>
      <select v-model="selectedEquipment" name="equipment" id="equipment"  class="form-control"  style="margin-right: 20px;">
        <option value="all">All Equipment</option>
        <option v-for="equipment in equipments" :key="equipment._id" :value="equipment">{{ equipment.name }}</option>
      </select>

      <span style="font-size: 40px;">{{  selectedAreaDisplay   }}</span>

      <TimetableComponent :selectedDate="selectedDate" :labels="labels" :updatedBookings/>

</template>

<script setup>
import HeaderComponent from '../components/TheHeader.vue';
import TimetableComponent from '../components/bookingTimeTable.vue';
import bookingCalculatorComponent from '../components/bookingCalculator.vue';
import { jwtDecode } from 'jwt-decode';


// Documentation: https://antoniandre.github.io/vue-cal
import { ref , computed , watch , onMounted} from 'vue'

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
const booking = ref([]);


const selectedEquipment = ref('all');
const selectedArea = ref('all');
const selectedDate = ref('');
const AreaEquipment = ref([]);
const selectedAreaEquipment = ref([]);

const ssoid = ref("");
const role = ref("");
// Use a computed property to dynamically return today's date if selectedDay is empty
const loadAsyncData = async () => {
  try {
    // Get the token from local storage    
    const token = localStorage.getItem('token');

    const decoded = jwtDecode(token);
    const token2 = `${decoded.token2}`;
    const decoded2 = jwtDecode(token2);
    console.log(decoded);
    console.log(token);
    ssoid.value = `${decoded.user.ssoid}  `;
    role.value = `${decoded2.employee_type}`;

  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  loadAsyncData();
  getAreas();
  getEquipment();
  getBooking(); 
 });

 const userData = ref({ stuID:'',name: '', role: '' });

 const handleUserData = (data) => {
  userData.value = data;
  console.log("userData", userData.value); // 使用数据
};


watch(selectedArea, (newValue, oldValue) => {
      selectedArea.value = newValue;
      getBooking();
    });

const selectedAreaDisplay = computed(() => {
  if (selectedArea.value === 'all') {
    return areas.value.map(area => area.name).join(' & ');
  } else if (selectedArea.value) {
    return selectedArea.value.name;
  } else {
    return 'No Area Selected';
  }
});

watch(selectedEquipment, (newValue, oldValue) => {
    selectedEquipment.value = newValue;
      getBooking();
    });
watch(selectedDate, (newValue, oldValue) => {
      getBooking();
    });

    const labels = ref([]);

    

    watch(AreaEquipment, (newValue, oldValue) => {
      labels.value = AreaEquipment.value.map((equipment, index) => ({
      label: equipment.name + "(" + equipment.room + ")",
    }));
    });

    const updatedBookings = ref([]);

    watch(booking, (newValue, oldValue) => {
      labels.value = AreaEquipment.value.map((equipment, index) => ({
        label: equipment.name + "(" + equipment.room + ")",
    }));


          updatedBookings.value = booking.value.map(book => {
            //const equipmentIndex = AreaEquipment.value.findIndex(areaEquipment => areaEquipment.equipment_id == item.equipment_id);
            const equipmentIndex = AreaEquipment.value.findIndex(areaEquipment => areaEquipment._id == book.area_equipment_id);
            if (equipmentIndex !== -1) {
              return { ...book, split: equipmentIndex + 1 }; // 索引加1，因为数组是从0开始的
            }
            return book;
            });


    });
const areas = ref([]);


const equipments = ref([]);



// Use a computed property to dynamically return today's date if selectedDay is empty
const getBooking = async function () {
        getArea_equipment();
        let url = '/api/bookings/bookings'; // 基础URL
        const queryParams = [];

          queryParams.push(`date=${encodeURIComponent(selectedDate.value)}`);
          queryParams.push(`role=${encodeURIComponent(role.value)}`);
          console.log("toby",role.value)
        queryParams.push(`userId=${encodeURIComponent(ssoid.value)}`);
        //queryParams.push(`userId=${encodeURIComponent("65b9f0fdfc13ae1ef6234709")}`);

        if (selectedEquipment.value !="" && selectedEquipment.value != "all" ) {
          console.log(selectedEquipment.value); // 处理返回的数据

          queryParams.push(`equipment=${encodeURIComponent(selectedEquipment.value._id)}`);
        }
        if (selectedArea.value !="" && selectedArea.value != "all" ) {
          queryParams.push(`area=${encodeURIComponent(selectedArea.value._id)}`);
        }

        if (queryParams.length) {
          url += '?' + queryParams.join('&');
        }
        try {
          const response = await fetch(url);
          const data = await response.json();
          booking.value = data;
        } catch (error) {
  
          console.error('287 Error:', error);
        }
}

const getAreas = async function () {
        let url = '/api/areas/allArea'; // 基础URL
       
        try {
          const response = await fetch(url);
          const data = await response.json();
          areas.value = data;

        } catch (error) {
          console.error('Error:', error);
        }
}

const getEquipment = async function () {
        let url = '/api/equipments/allEquipment';
        try {
          const response = await fetch(url);
          const data = await response.json();
          equipments.value = data;
        } catch (error) {
          console.error('Error:', error);
        }
}


const getArea_equipment = async function () {
        let url = '/api/area_equipment/allArea_equipment'; 
        const queryParams = [];
        if (selectedEquipment.value !="" && selectedEquipment.value != "all" ) {

          queryParams.push(`equipment_id=${encodeURIComponent(selectedEquipment.value._id)}`);
        }
        if (selectedArea.value !="" && selectedArea.value != "all" ) {
          queryParams.push(`area_id=${encodeURIComponent(selectedArea.value._id)}`);
        }

        if (queryParams.length) {
          url += '?' + queryParams.join('&');
        }
        try {
          const response = await fetch(url);
          const data = await response.json();
          AreaEquipment.value = data;
          selectedAreaEquipment.value =  AreaEquipment.value.map(AreaEquipment => AreaEquipment.name);
        } catch (error) {
          console.error('sad Error:', error);
        }
}


</script>

<style>

.vuecal__title-bar{
  background-color: white ; 
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

}

.vuecal__event.booked {
  background: red;/* IE 10+ */
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.vuecal__event.lunch .vuecal__event-time {display: none;align-items: center;}
@media (min-width: 100px) {
  .w3 {
    width: 100%;
    background-color: red;
  }
}
.vuecal__menu {display: none;}
.vuecal__time-cell-label {color: #42b983;}
.vuecal__time-column {width: 10%;}
.vuecal__split-days-headers {padding-left: 5.8%;}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.vuecal {height: 90vh;}


.nav-header {
  display: flex;
  flex-wrap: wrap; /* Allows items to wrap on smaller screens */
  justify-content: space-between; /* Spaces the children evenly */
  align-items: flex-start; /* Aligns items at the start of the container */
}

.split-left, .split-right {
  /* Assuming both should take equal width on larger screens */
  flex: 1;
  min-width: 250px; /* Adjust based on your minimum width requirements */
  max-width: 50%; /* Ensures each takes up to 50% of the container's width */
}

.split-right {
  display: flex; /* Makes .split-right a flex container */
  justify-content: flex-end; /* Aligns children (vue-cal) to the right */
  align-items: start; /* Aligns items to the top, if needed */
  height: 100%; /* Ensures the container fills the height, adjust as needed */
  min-height: 100px; /* Your existing minimum height */
}


.table {
  width: 100%; /* Make tables fill their containers */
  margin-bottom: 20px; /* Space between tables */
}

@media (max-width: 408px) {
  .nav-header {
    flex-direction: column;
  }
  .split-left, .split-right {
    flex-basis: 100%; /* Ensure they take full width on smaller screens */
    max-width: 100%; /* Prevent any overflow */
  }
}
</style>
