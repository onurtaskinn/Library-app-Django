<template>
  <HeaderComponent  @getUserData="handleUserData" />


    <div class="nav-header" >
        <div id="studentHistory" class="split-left"   >
          <table class="table my-2" style="padding-right: 30px; text-align: center;background-color: orange;">
            <thead>
               <tr v-if="role == 'student'">
                <th scope="col">Equipment</th>
                <th scope="col">Date</th>
                <th scope="col">Time-slot</th>
                <th scope="col">Edit</th>
              </tr>
              <tr v-else>
                <u>Areas</u>
                <a href="/Area"  class="dropdown-item">Central Facility Lab</a>
                <a href="/Area"  class="dropdown-item">IAM/SML</a>
              </tr>
            </thead>
            <!-- <tbody>
                <template v-if="Object.keys(credentials.value).length > 0">
                    <tr v-for="(student, index) in credentials.value.bookingHistory" :key="student._id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ student.equipment }}</td>
                        <td>{{ student.date }}</td>
                        <td>{{ student.timeslot }}</td>
                        <td>{{ student.edit }}</td>
                        <td>
                            <div class="d-flex justify-content-around">
                                <a :href="`/students/${student.studentNum}`" class="btn btn-secondary">Edit</a>
                                <button class="btn btn-secondary raised-pink">X</button>
                            </div>
                        </td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="4">No booking history available.</td>
                </tr>
            </tbody> -->
        </table>
        </div>

        <div class="split-right">
          <!-- Date Picker Input -->
          <vue-cal
          xsmall
          :time="false"
          hide-view-selector
          :transitions="false"
          today-button
          :disable-days="arrayHolidays"
          :selected-date="selectedDate"
          active-view="month"
          :disable-views="['years', 'year', 'week', 'day']"
          @cell-focus="selectedDate = $event "
          @cell-click="selectedDate = $event "

          class="vuecal--date-picker"
          style="width: 200px;height: 200px"
          >
        </vue-cal>    

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

     <vue-cal
      style="width: 100%;"
    
      :disable-views="['years', 'year', 'month', 'week']"
      active-view="day"
      :selected-date="selectedDate"
      :split-days="labels"
      :time-from="5 * 60"

      :events="updatedBookings"

      :timeFrom="480"
      :timeTo="1260"
      :hide-weekdays="[6,7]"
      minCellWidth=4
      sticky-split-labels>


    </vue-cal>


</template>

<script setup>
import HeaderComponent from '../components/TheHeader.vue';

// Documentation: https://antoniandre.github.io/vue-cal
import { ref , computed , watch , onMounted} from 'vue'
import { holidayService } from '../service/holidayService'

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
const booking = ref([]);


const selectedEquipment = ref('all');
const selectedArea = ref('all');
const selectedDate = ref('');
const AreaEquipment = ref([]);
const selectedAreaEquipment = ref([]);
const holidays = ref([]);
const arrayHolidays = ref([]);

const role = ref("");
// Use a computed property to dynamically return today's date if selectedDay is empty
const loadAsyncData = async () => {
  try {
    // Get the token from local storage    
    const token = localStorage.getItem('token');

    const decoded = jwtDecode(token);
    console.log(decoded);
    console.log(token);
    role.value = `${decoded.role}`;

  } catch (error) {
    console.log(error);
  }
};
onMounted(async() => {
 holidays.value = await holidayService.getAll();
  arrayHolidays.value = await extractHolidayDates(holidays);  loadAsyncData();
 
});


function extractHolidayDates(holidays) {
  return holidays.value.map(holiday => holiday.date);
}

onMounted(() => {
  //if (areas.value.length > 0) selectedArea.value = areas.value[0];
  //if (equipments.value.length > 0) selectedEquipment.value = equipments.value[0];

  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000; // convert offset to milliseconds
  const localISODate = new Date(today - timezoneOffset).toISOString().slice(0, 10);
  selectedDate.value = localISODate;
  console.log('today is ' , today);
// Format the date as YYYY-MM-DD
getAreas();
  getEquipment();
  getBooking(); // Fetch booking data when the component mounts
 });

 const userData = ref({ stuID:'',name: '', role: '' });

 const handleUserData = (data) => {
  userData.value = data;
  console.log("userData", userData.value); // 使用数据
};

 const formattedDate = computed(() => {
  // Ensure selectedDate.value is converted back to a Date object for manipulation
  if (!selectedDate.value) return '';
  const date = new Date(selectedDate.value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
});

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
const labelEquipments = computed(() => {
  if (Array.isArray(AreaEquipment.value)) {
    return AreaEquipment.value.map((equipment, index) => ({
      label: equipment.name,
      id: equipment.equipment_id
    }));
  } else {
    console.error('Expected AreaEquipment.value to be an array, received:', AreaEquipment.value);
    return [];
  }
});









// Use a computed property to dynamically return today's date if selectedDay is empty

const equipment = 'laptop';
const area = 'newyork';



const getBooking = async function () {
        getArea_equipment();
        let url = '/api/bookings/bookings'; // 基础URL
        const queryParams = [];

        if(!formattedDate.value){
          queryParams.push(`date=${encodeURIComponent(selectedDate.value)}`);
        }else{
          queryParams.push(`date=${encodeURIComponent(formattedDate.value)}`);
        }
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
          console.log("equipment", selectedEquipment.value); 
          console.log("The url is " +url); 

          const response = await fetch(url);
          const data = await response.json();
          booking.value = data;
          console.log("283 The booking is" , booking.value); 


        } catch (error) {
          
          console.error('287 Error:', error);
        }
}

const getAreas = async function () {
        let url = '/api/areas/allArea'; // 基础URL
       
        try {
          const response = await fetch(url);
          const data = await response.json();
          console.log("The allareas is" + data); 
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
          console.log("The allEquipment is" + data); 
          equipments.value = data;
        } catch (error) {
          console.error('Error:', error);
        }
}


const getArea_equipment = async function () {
        let url = '/api/area_equipment/allArea_equipment'; // 基础URL
        const queryParams = [];
        if (selectedEquipment.value !="" && selectedEquipment.value != "all" ) {
          console.log(selectedEquipment.value); // 处理返回的数据

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
