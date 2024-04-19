<template>
  <HeaderComponent />
  <div>
    <div style="font-size: 32px;">Booking</div>
    <hr />
  </div>
  <div class="card">
    <form>
      <div class="form-group row mb-3">
        <label for="equipment" class="col-12 col-sm-2 col-form-label form_text_big">Type of Equipment</label>
        <div class="col-sm-6">
          <select name="equipment" id="equipment" v-model="selectedEquipment" class="form-control form_input_width">
            <option value="">Select Type of Equipment</option>
            <option v-for="equipment in equipments" :key="equipment._id" :value="equipment">{{ equipment.name }}
            </option>
          </select>

        </div>
      </div>

      <div class="form-group row mb-3" v-show="selectedEquipment">
        <label for="area" class="col-12 col-sm-2 col-form-label form_text_big">Area</label>
        <div class="col-sm-6">
          <select name="area" id="area" v-model="selectedArea" class="form-control form_input_width">
            <option value="">Select Area</option>
            <option v-for="area in areas" :key="area._id" :value="area">{{ area.name }}</option>
          </select>

        </div>
      </div>
      <div class="form-group row mb-3" v-show="selectedArea">
        <label for="equipment" class="col-12 col-sm-2 col-form-label form_text_big">Equipment</label>
        <div class="col-sm-6">
          <select name="AreaEquipments" id="AreaEquipments" v-model="selectedAreaEquipment"
            class="form-control form_input_width">
            <option v-for="AreaEquipment in AreaEquipments" :key="AreaEquipment._id" :value="AreaEquipment">{{
            AreaEquipment.name }}</option>
          </select>

        </div>
      </div>

      <hr>
      <div>Booking Date</div>
      <!-- <p v-if="eventData">Start Time: {{ eventData }}</p> -->

      <!-- Input Group for "From" and "To" -->
      <!-- From Input -->
      <div class="form-group row mb-3">
        <label for="fromBookingDate" class="col-12 col-sm-2 col-form-label form_text_big">From:</label>
        <div class="col-sm-6">
          <select v-model="selectedFromTimeSlot" class="form-control form_input_width">
            <option value="">Select From Time Slot</option>
            <option v-for="time in timeSlots" :key="`from-${time}`" :value="time">{{ time }}</option>
          </select>
        </div>
</div>
      <!-- To Input -->
      <div class="form-group row mb-3">
        <label for="toBookingDate" class="col-12 col-sm-2 col-form-label form_text_big">To:</label>
        <div class="col-sm-6">
          <select v-model="selectedToTimeSlot" class="form-control form_input_width">
              <option value="">Select To Time Slot</option>
              <option v-for="time in filteredToTimeSlots" :key="`to-${time}`" :value="time">{{ time }}</option>
          </select>
        </div>
      </div>
      <!-- Date Picker -->
      <bookingCalculatorComponent v-model:selectedDate="selectedDate" />


      <br />

      <div v-show="selectedAreaEquipmentText">
        <TimetableComponent :selectedDate="selectedDate" :labels="[{ label: selectedAreaEquipmentText }]"
          :updatedBookings />
      </div>

      <div class="form-group row mb-3">
        <label for="request" class="col-12 col-sm-2 col-form-label form_text_big">Additional Request</label>
        <div class="col-sm-6">
          <textarea id="request" name="request" rows="4" cols="50" v-model="selectedrequest"
            class="form-control"></textarea>
        </div>
      </div>
      <div style="color: red;">{{ errorMessages }} </div>

      <hr />
      <div class="col-auto my-1">
        <button type="button" class="btn-submit" :disabled="isSubmitDisabled" data-bs-toggle="modal"
          data-bs-target="#exampleModal">Submit</button>
      </div>

    </form>

  </div>
  <div class="parent-container">

    <div>




    </div>

  </div>


  <!-- Model Start  -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Confirm Your Booking</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="submitBooking">

          <div class="modal-body" style="align:left">
            <h2>Booking Information:</h2>
            <p>Area: {{ selectedAreaText }}</p>
            <p>Equipment: {{ selectedAreaEquipmentText }}</p>

            <p>Booking Date: {{ selectedDate }}</p>
            <p>From: {{ selectedFromTimeSlot }}</p>
            <p>To: {{ selectedToTimeSlot }}</p>
            <p>Additional Request: {{ selectedrequest }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
          </div>
        </form>

      </div>
    </div>
  </div>
  <!-- Model End  -->
</template>


<script setup>
import HeaderComponent from '../components/TheHeader.vue';
import bookingCalculatorComponent from '../components/bookingCalculator.vue';
import TimetableComponent from '../components/bookingTimeTable.vue';

// Documentation: https://antoniandre.github.io/vue-cal
import { ref, onMounted, watch, computed } from 'vue'
import { systemParametersService } from '../service/systemParametersService';


import 'vue-cal/dist/vuecal.css'
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { useRoute } from 'vue-router';

const router = useRouter();
const booking = ref([]);
console.log(router);
const selectedAreaText = ref('');
const areas = ref([]);
const equipments = ref([]);
const AreaEquipments = ref([]);
const selectedEquipment = ref('');
const selectedAreaEquipment = ref('');
const selectedAreaEquipmentText = ref('');
const ssoid = ref("");
const role = ref("");



const route = useRoute();

const eventData = route.query.startTime;

console.log("real", eventData)
const token = localStorage.getItem('token');




const decoded = jwtDecode(token);
const token2 = `${decoded.token2}`;
const decoded2 = jwtDecode(token2);
console.log("decoded", decoded);
ssoid.value = `${decoded.user.ssoid}  `;
role.value = `${decoded2.employee_type}`;
console.log("toby",ssoid.value)

const selectedArea = ref('');

const selectedDate = ref('')


const bookingSystemParameter = ref();
const bookingForm = ref();
const bookingTo = ref();

function formatTimeForDropdown(dateTimeString) {
  const date = new Date(dateTimeString);
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
onMounted(async () => {

  const startTime = route.query.startTime;
  const endTime = route.query.endTime;
  const new_date = route.query.date;
  selectedDate.value = new_date;


  selectedFromTimeSlot.value = formatTimeForDropdown(startTime);
  selectedToTimeSlot.value = formatTimeForDropdown(endTime);
  bookingSystemParameter.value = await systemParametersService.getByConditions({ _id: "65ed9d7187c53aaf2a78506c" });
  bookingForm.value = parseInt(bookingSystemParameter.value.value1);
  bookingTo.value = parseInt(bookingSystemParameter.value.value2);

  getAreas();
  getEquipment();
  getBooking();
   getArea_equipment();
})

const selectedAreaEquipmentT = ref([]);
watch(selectedAreaEquipment, newValue => {
  selectedAreaEquipment.value = newValue;
  console.log("selectedAreaEquipment newValue", selectedAreaEquipment.value);

  selectedAreaEquipmentText.value = selectedAreaEquipment.value.name + "(" + selectedAreaEquipment.value.room + ")";
  selectedAreaEquipmentT.value = newValue;
  console.log("selectedAreaEquipmentText ", selectedAreaEquipmentText.value);


  getBooking();
});


//watch(AreaEquipments, (newValue, oldValue) => {
//labels.value = AreaEquipments.value.map((equipment, index) => ({
//label: equipment.name,
//}));
//});

watch(selectedEquipment, newValue => {
  selectedEquipment.value = newValue;
  selectedArea.value = '';
  getBooking();
  getArea_equipment();

});
watch(selectedArea, newValue => {
  selectedArea.value = newValue;
  selectedAreaText.value = selectedArea.value.name;
  getArea_equipment();

  getBooking();
});

watch(selectedDate, () => {
  getBooking();
});



const getAreas = async function () {
  let url = '/api/areas/allArea'; // 基础URL

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("The allareas is" + data);
    areas.value = data;
    console.log("hhh", areas.value)
    let areaName = '';
    switch (route.query.split) {
      case '1':
      case '2':
      case '3':
        areaName = 'RRS102';
        break;
      case '4':
        areaName = 'FSC';
        break;
      default:
        break;
    }

    if (areaName) {
      const selected = areas.value.find(area => area.name === areaName);
      if (selected) {
        selectedArea.value = selected;
        getArea_equipment();
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

const getEquipment = async function () {
  let url = '/api/equipments/allEquipment'; // 基础URL
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("The allEquipment is" + data);
    equipments.value = data;

    let equipmentName = '';
    switch (route.query.split) {
      case '1':
        equipmentName = 'FESEM/EDX';
        break;
      case '2':
        equipmentName = 'FESEM/EDX';
        break;
      case '3':
        equipmentName = 'TEM/EDX';
        break;
      case '4':
        equipmentName = 'XPS';
        break;
      default:
        break;
    }

    if (equipmentName) {
      const selected = equipments.value.find(equipment => equipment.name === equipmentName);
      if (selected) {
        selectedEquipment.value = selected;
      }
    }
    getAreas();
  } catch (error) {
    console.error('Error:', error);
  }
}


const getArea_equipment = async function () {
  let url = '/api/area_equipment/allArea_equipment'; // 基础URL
  const queryParams = [];

  if (selectedEquipment.value != "" && selectedEquipment.value != "all") {
    console.log("selectedEquipment", selectedEquipment.value); // 处理返回的数据

    queryParams.push(`equipment_id=${encodeURIComponent(selectedEquipment.value._id)}`);
  }
  if (selectedArea.value != "" && selectedArea.value != "all") {
    queryParams.push(`area_id=${encodeURIComponent(selectedArea.value._id)}`);
  }

  if (queryParams.length) {
    url += '?' + queryParams.join('&');
  }
  try {


    const response = await fetch(url);
    const data = await response.json();
    AreaEquipments.value = data;
    console.log("hhhh", AreaEquipments.value)

    let equipmentName = '';
    switch (route.query.split) {
      case '1': equipmentName = 'FESEM/EDX(1)'; break;
      case '2': equipmentName = 'FESEM/EDX(2)'; break;
      case '3': equipmentName = 'ES2'; break;
      case '4': equipmentName = 'XPS(1)'; break;
      default: break;
    }


    if (equipmentName) {
      const selected = AreaEquipments.value.find(equipment => equipment.name === equipmentName);
      if (selected) {
        selectedAreaEquipment.value = selected;
      }
    }

  } catch (error) {
    console.error('sad Error:', error);
  }
}

const getBooking = async function () {
  let url = '/api/bookings/bookings'; // 基础URL
  const queryParams = [];
  // const new_date = route.query.date;
  //queryParams.push(`date=${encodeURIComponent(new_date)}`);
  queryParams.push(`date=${encodeURIComponent(selectedDate.value)}`);
  queryParams.push(`role=${encodeURIComponent(role.value)}`);
  queryParams.push(`userId=${encodeURIComponent(ssoid.value)}`);
  //queryParams.push(`userId=${encodeURIComponent("65b9f0fdfc13ae1ef6234709")}`);
  if (selectedEquipment.value != "" && selectedEquipment.value != "all") {
    console.log("201", selectedEquipment.value); 
    queryParams.push(`equipment=${encodeURIComponent(selectedEquipment.value._id)}`);
  }
  if (selectedArea.value != "" && selectedArea.value != "all") {
    queryParams.push(`area=${encodeURIComponent(selectedArea.value._id)}`);
  }

  if (queryParams.length) {
    url += '?' + queryParams.join('&');
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    booking.value = data;
    console.log("283 The booking is", booking.value);
  } catch (error) {
    console.error('287 Error:', error);
  }
}





//Booking information  start !!!!//

const updatedBookings = ref([]);




watch(booking, () => {


  updatedBookings.value = booking.value.map(book => {
    console.log("book.area_equipment_id :", book.area_equipment_id, "selectedAreaEquipmentT", selectedAreaEquipmentT.value)
    if (book.area_equipment_id == selectedAreaEquipmentT.value._id) {
      return { ...book, split: 1 };
    }
    return book;
  });

});



//Booking information  end !!!!//


const selectedFromTimeSlot = ref('');
const selectedToTimeSlot = ref('');
const selectedrequest = ref('');




// Generate time slots
const timeSlots = computed(() => {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  const isSelectedDateToday = new Date(selectedDate.value).toDateString() === now.toDateString();

  for (let hour = bookingForm.value; hour <= bookingTo.value; hour++) {
    if (isSelectedDateToday && hour <= currentHour) continue;  
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
});

//-----------------------------

// Filtered "To" time slots based on the "From" selection
const filteredToTimeSlots = computed(() => {
  if (!selectedFromTimeSlot.value) {
    return [];
  }
  const fromIndex = timeSlots.value.indexOf(selectedFromTimeSlot.value);
  return timeSlots.value.slice(fromIndex + 1);
});
// Watchers to set default time slots
watch(timeSlots, (newSlots) => {
  if (newSlots.length > 0 && selectedFromTimeSlot.value === '') {
    selectedFromTimeSlot.value = newSlots[0]; 
  }
}, { immediate: true });
watch(filteredToTimeSlots, (newFilteredSlots) => {
  if (newFilteredSlots.length > 0 && !selectedToTimeSlot.value) {
    selectedToTimeSlot.value = newFilteredSlots[0];
  }
});

const errorMessages = ref("");

const isSubmitDisabled = computed(() => {
    if(!selectedEquipment.value){
      errorMessages.value = "Please select Type of Equipment";
    }else if(!selectedArea.value){

      errorMessages.value = "Please select Area";

    }
    else if (!selectedAreaEquipment.value ) {
        errorMessages.value = "Please select Equipment";
      }
  else if(!selectedFromTimeSlot.value ){
      errorMessages.value = "Please select From Time Slot";
    }else if(!selectedToTimeSlot.value ){
      errorMessages.value = "Please select To Time Slot";
    }else{
      errorMessages.value = "";

    }
    
  return !selectedEquipment.value || !selectedArea.value || !selectedAreaEquipmentText.value || !selectedFromTimeSlot.value || !selectedToTimeSlot.value;
});
//-----------------------------
async function submitBooking() {
  const bookingData = {
    placeId: selectedArea.value._id,
    equipment_id: selectedEquipment.value._id,
    area_equipment_id: selectedAreaEquipment.value._id,
    selectedDate: selectedDate.value,
    selectedFromTimeSlot: selectedFromTimeSlot.value,
    selectedToTimeSlot: selectedToTimeSlot.value,
    request: selectedrequest.value,
    ssoid: ssoid.value
  };

  try {
    const response = await fetch('/api/bookings/submitBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    if (response.status === 409) {
      const data = await response.json();
      // Trigger browser's confirm dialog
      if (confirm(data.message)) {
        // If user confirms, retry the booking possibly with additional data
        submitBookingConfirmed(true);
      }
    } else if (response.ok) {
      alert('Booking successfully submitted!');
      router.push('/profile');

      // Additional success logic here
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Failed to submit booking:', error);
    alert('Failed to submit booking due to network error.');
  }
}

async function submitBookingConfirmed(confirmed) {
  const bookingData = {
    // Assuming same data needed, with an additional confirmed flag
    placeId: selectedArea.value._id,
    equipment_id: selectedEquipment.value._id,
    area_equipment_id: selectedAreaEquipment.value._id,
    selectedDate: selectedDate.value,
    selectedFromTimeSlot: selectedFromTimeSlot.value,
    selectedToTimeSlot: selectedToTimeSlot.value,
    request: selectedrequest.value,
    ssoid: ssoid.value,
    confirmed // This flag indicates user confirmation of conflict
  };

  try {
    const response = await fetch('/api/bookings/submitBooking1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    if (response.ok) {
      alert('Booking confirmed and successfully submitted!');
      router.push('/profile');

    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Failed to confirm booking:', error);
    alert('Failed to confirm booking due to network error.');
  }
}



//-------------
      

</script>

<style>

.btn-submit {
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

.btn-submit:hover {
  background-color: white; 
  color: black;
  border: 1px solid #007bff;
}

.time-input {
  margin-bottom: 10px;
  /* Space between the inputs */
}

.form-control.form_input_width {
  /* Adjust the width as needed */
  width: 100%;
}


.booking-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.input-group {
  display: flex;
  flex-grow: 1;
  /* Allows the input group to take up available space */
}

.time-input {
  display: flex;
  align-items: center;
  gap: 10px;
  /* Space between label and input */
  margin-right: 20px;
  /* Space between input groups */
}

.form-label {
  white-space: nowrap;
  /* Prevents label from wrapping */
}

.form-control {
  width: auto;
  /* Allows the input to size according to its content */
}

.date-picker-container {
  margin-left: 20px;
  /* Adds space between the last input group and the date picker */
  flex-shrink: 0;
  /* Prevents the date picker from shrinking */
}


.booking-date-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.date-picker-container,
.time-selection-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.date-picker {
  margin-right: 20px;
  /* Adjust based on your layout */
}

/* Adjust the width of the vue-cal component if needed */
.vuecal--date-picker {
  width: auto;
  /* Adjust this to control the width of the date picker */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .booking-date-container {
    flex-direction: column;
  }

  .date-picker {
    margin-right: 0;
    margin-bottom: 20px;
    /* Add space between date picker and time inputs on smaller screens */
  }
}

.col-form-label {
  width: 20%;
  text-align: left;
}

.form_text_big {
  margin-left: 10px;

  font-size: 1.25rem;
  white-space: keep-all;
}

.card {
  margin: 0 auto;
  /* Added */
  padding: 20px;

  float: none;
  /* Added */
  width: 80%;
  box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 2px;
}

.vuecal__event.booked {
  background: red;
  /* IE 10+ */
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vuecal__event.lunch .vuecal__event-time {
  display: none;
  align-items: center;
}

@media (min-width: 100px) {
  .w3 {
    width: 100%;
    background-color: red;
  }
}

.vuecal__menu {
  display: none;
}

.vuecal__time-cell-label {
  color: #42b983;
  font-size: 120%;
}

.vuecal__time-column {
  width: 10%;
}

.vuecal__split-days-headers {
  padding-left: 5.8%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.vuecal {
  height: 90vh;
}


.nav-header {
  display: flex;
  flex-wrap: wrap;
  /* Allows items to wrap on smaller screens */
  justify-content: space-between;
  /* Spaces the children evenly */
  align-items: flex-start;
  /* Aligns items at the start of the container */
}

.split-left,
.split-right {
  /* Assuming both should take equal width on larger screens */
  flex: 1;
  min-width: 250px;
  /* Adjust based on your minimum width requirements */
  max-width: 50%;
  /* Ensures each takes up to 50% of the container's width */
}

.split-right {
  display: flex;
  /* Makes .split-right a flex container */
  justify-content: flex-end;
  /* Aligns children (vue-cal) to the right */
  align-items: start;
  /* Aligns items to the top, if needed */
  height: 100%;
  /* Ensures the container fills the height, adjust as needed */
  min-height: 100px;
  /* Your existing minimum height */
}

.parent-container {
  display: flex;
  flex-direction: column;
  /* Stack children vertically */
  align-items: stretch;
  /* Stretch items to fill the container width */
  gap: 20px;
  /* Space between items */
}

.table {
  width: 100%;
  /* Make tables fill their containers */
  margin-bottom: 20px;
  /* Space between tables */
}

@media (max-width:900px) {
  .form_text_big {
    font-size: 1rem;
    /* 调整小屏幕上的字体大小 */
  }

  .col-form-label,
  .form-control {
    width: 100%;
    /* 使标签和输入框各占一行 */
    margin-left: 0;
    /* 重置外边距 */
  }
}

@media (max-width: 408px) {
  .nav-header {
    flex-direction: column;
  }

  .split-left,
  .split-right {
    flex-basis: 100%;
    /* Ensure they take full width on smaller screens */
    max-width: 100%;
    /* Prevent any overflow */
  }
}
</style>
