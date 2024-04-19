<template>
  <HeaderComponent />
  <div>
    <div style="font-size: 32px;">Booking</div>
     <hr />
  </div >
  <div class="card" >
    <form >

      <div class="form-group row mb-3">
        <label for="equipment" class="col-12 col-sm-2 col-form-label form_text_big"  >Type of Equipment</label>
        <div class="col-sm-6">
          <select name="equipment" id="equipment" v-model="selectedEquipment" class="form-control form_input_width"  >
            <option value="">Select Type of Equipment</option> 
            <option v-for="equipment in equipments" :key="equipment._id" :value="equipment">{{ equipment.name }}</option>
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
      <div class="form-group row mb-3"  v-show="selectedArea">
        <label for="equipment" class="col-12 col-sm-2 col-form-label form_text_big"  >Equipment</label>
        <div class="col-sm-6">
          <select name="AreaEquipments" id="AreaEquipments" v-model="selectedAreaEquipment" class="form-control form_input_width"  >
            <option v-for="AreaEquipment in AreaEquipments" :key="AreaEquipment._id" :value="AreaEquipment">{{ AreaEquipment.name }}</option>
          </select>

          </div>
      </div>

<hr>
      <div>Booking Date</div>


          <!-- Input Group for "From" and "To" -->
            <!-- From Input -->
            <div class="form-group row mb-3">
              <label for="fromBookingDate" class="col-12 col-sm-2 col-form-label form_text_big">From:</label>
              <div class="col-sm-6">
                <select v-model="selectedFromTimeSlot" class="form-control form_input_width">
                  <option v-for="time in timeSlots" :key="`from-${time}`" :value="time">
                    {{ time }}
                  </option>
                </select>

             </div>
          </div>
            <!-- To Input -->
            <div class="form-group row mb-3">
                  <label for="toBookingDate" class="col-12 col-sm-2 col-form-label form_text_big">To:</label>
                  <div class="col-sm-6">
                  <select v-model="selectedToTimeSlot" class="form-control form_input_width">
                    <option v-for="time in filteredToTimeSlots" :key="`to-${time}`" :value="time">
                      {{ time }}
                    </option>
                  </select>
                </div>
              </div>
          <!-- Date Picker -->
            <vue-cal xsmall 
            hide-view-selector 
            :min-date="minDate"
            :disable-days="arrayHolidays"

            :transitions="false" 
            active-view="month"
             :disable-views="['years', 'year', 'week', 'day']"
              @cell-focus="selectedDate = $event "
               @cell-click="selectedDate = $event " 
               class="vuecal--date-picker" 
               style="width: 200px;height: 200px"></vue-cal>
          
            <br/>
            
            <div  v-show="selectedAreaEquipmentText">
              <TimetableComponent :selectedDate="selectedDate":labels="labels" :updatedBookings/>

              </div>

      <div class="form-group row mb-3">
        <label for="request" class="col-12 col-sm-2 col-form-label form_text_big">Additional Request</label>
        <div class="col-sm-6">
          <textarea id="request" name="request" rows="4" cols="50" v-model="selectedrequest" class="form-control"></textarea>
        </div>
      </div>
   
    <hr/>
    <div class="col-auto my-1">
      <button type="button" class="btn btn-primary"  :disabled="isSubmitDisabled" data-bs-toggle="modal" data-bs-target="#exampleModal">Submit</button>
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
                        <h5 class="modal-title" id="exampleModalLabel">onfirm Your Booking</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <form @submit.prevent="submitForm">

                      <div class="modal-body" style="align:left">
                        <h2>Booking Information:</h2>
                        <p>Area: {{ selectedAreaText  }}</p>
                        <p>Equipment: {{ selectedAreaEquipmentText }}</p>
                        
                        <p>Booking Date: {{ formattedDate }}</p>
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
import TimetableComponent from '../components/bookingTimeTable.vue';

// Documentation: https://antoniandre.github.io/vue-cal
import { ref ,onMounted, watch ,computed   } from 'vue'
import { holidayService } from '../service/holidayService'

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useRouter  } from "vue-router";
import { jwtDecode } from "jwt-decode";

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



const token = localStorage.getItem('token');

        

        
        const decoded = jwtDecode(token);
        console.log("decoded",decoded);
        ssoid.value = `${decoded.user.ssoid}  `;
        

const selectedArea = ref('');

const selectedDate = ref('') 

const formattedDate = computed(() => {
  // Ensure selectedDate.value is converted back to a Date object for manipulation
  if (!selectedDate.value) return '';
  const date = new Date(selectedDate.value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
});


onMounted(async() => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000; // convert offset to milliseconds
  const localISODate = new Date(today - timezoneOffset).toISOString().slice(0, 10);
  selectedDate.value = localISODate;
  console.log('today is ' , today);
  getAreas();
  getEquipment();
  getBooking();
  getArea_equipment();

  holidays.value = await holidayService.getAll();
  arrayHolidays.value = await extractHolidayDates(holidays);
})
// get holiday
const holidays = ref([]);
const arrayHolidays = ref([]);
function extractHolidayDates(holidays) {
  return holidays.value.map(holiday => holiday.date);
}
const selectedAreaEquipmentT = ref([]);
watch(selectedAreaEquipment,newValue  => {
    selectedAreaEquipment.value = newValue;
    console.log("selectedAreaEquipment newValue" , newValue);

    selectedAreaEquipmentText.value = selectedAreaEquipment.value.name;
    selectedAreaEquipmentT.value = newValue;
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


const minDate  = computed(() => {
  return new Date().subtractDays(0)

})


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
        let url = '/api/equipments/allEquipment'; // 基础URL
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
          AreaEquipments.value = data;
          selectedAreaEquipment.value =  AreaEquipments.value.map(AreaEquipments => AreaEquipments.name);
          selectedAreaEquipmentText.value = selectedAreaEquipment.value.name;
          console.log("293" , selectedAreaEquipment.value);

        } catch (error) {
          console.error('sad Error:', error);
        }
}

const getBooking = async function () {
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
          const response = await fetch(url);
          const data = await response.json();
          booking.value = data;
          console.log("283 The booking is" , booking.value); 

        } catch (error) {
          console.error('287 Error:', error);
        }
}





//Booking information  start !!!!//

const updatedBookings = ref([]);

watch(booking, () => {


    updatedBookings.value = booking.value.map(book => {
      console.log("book.area_equipment_id :" , book.area_equipment_id  , "selectedAreaEquipmentT" , selectedAreaEquipmentT.value)
      if (book.area_equipment_id == selectedAreaEquipmentT.value._id) {
        return { ...book, split: 1 }; // 如果匹配，则设置 split 为 1
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
  const currentMinutes = now.getMinutes();

  for (let hour = 8; hour <= 22; hour++) {
    // Only add slots that are in the future
    if (hour > currentHour || (hour === currentHour && currentMinutes < 30)) {
      const formattedHour = hour.toString().padStart(2, '0');
      slots.push(`${formattedHour}:00`);
    }
  }
  return slots;
});

// Filtered "To" time slots based on the "From" selection
const filteredToTimeSlots = computed(() => {
  if (!selectedFromTimeSlot.value) {
    return [];
  }

  const fromIndex = timeSlots.value.indexOf(selectedFromTimeSlot.value);
  return timeSlots.value.slice(fromIndex + 1);
});

const isSubmitDisabled = computed(() => {
  return !selectedEquipment.value || !selectedArea.value || !selectedAreaEquipmentText.value || !selectedFromTimeSlot.value || !selectedToTimeSlot.value;
});
//-----------------------------

const submitForm = async () => {
      const formData = {
        placeId: selectedArea.value._id,
        equipment_id: selectedEquipment.value._id,
        area_equipment_id: selectedAreaEquipment.value._id,
        selectedDate: formattedDate.value,
        selectedFromTimeSlot:selectedFromTimeSlot.value,
        selectedToTimeSlot: selectedToTimeSlot.value,
        request:selectedrequest.value,
        ssoid: ssoid.value
      };

      try {
        const response = await fetch('/api/bookings/submitBooking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('response problem');
        }

        const result = await response.json();
        console.log(result);
        document.getElementById('exampleModal').classList.remove('show');
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop').remove();
        router.push({ path: '/dashboard' }).then(() => {
      // 处理成功导航，例如显示成功消息或执行其他逻辑
      console.log("导航到仪表板成功");
    }).catch((err) => {
      // 处理导航过程中的错误
      console.error('导航错误:', err);
    });
      } catch (error) {

        console.error('error:', error);
      }
    };
    //-------------


</script>

<style>

.time-input {
  margin-bottom: 10px; /* Space between the inputs */
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
  flex-grow: 1; /* Allows the input group to take up available space */
}

.time-input {
  display: flex;
  align-items: center;
  gap: 10px; /* Space between label and input */
  margin-right: 20px; /* Space between input groups */
}

.form-label {
  white-space: nowrap; /* Prevents label from wrapping */
}
.form-control {
  width: auto; /* Allows the input to size according to its content */
}

.date-picker-container {
  margin-left: 20px; /* Adds space between the last input group and the date picker */
  flex-shrink: 0; /* Prevents the date picker from shrinking */
}


.booking-date-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.date-picker-container, .time-selection-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.date-picker {
  margin-right: 20px; /* Adjust based on your layout */
}

/* Adjust the width of the vue-cal component if needed */
.vuecal--date-picker {
  width: auto; /* Adjust this to control the width of the date picker */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .booking-date-container {
    flex-direction: column;
  }

  .date-picker {
    margin-right: 0;
    margin-bottom: 20px; /* Add space between date picker and time inputs on smaller screens */
  }
}

.col-form-label{
  width: 20%;
  text-align: left;
}

.form_text_big{
  margin-left: 10px;

 font-size: 1.25rem;
 white-space:  keep-all;
}
.card {
  margin: 0 auto; /* Added */
  padding: 20px;

  float: none; /* Added */
  width: 80%;
  box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 2px;}
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
.vuecal__time-cell-label {color: #42b983;font-size: 120%;}
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

.parent-container {
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: stretch; /* Stretch items to fill the container width */
  gap: 20px; /* Space between items */
}

.table {
  width: 100%; /* Make tables fill their containers */
  margin-bottom: 20px; /* Space between tables */
}
@media (max-width:900px) {
  .form_text_big {
    font-size: 1rem; /* 调整小屏幕上的字体大小 */
  }
  .col-form-label, .form-control {
    width: 100%; /* 使标签和输入框各占一行 */
    margin-left: 0; /* 重置外边距 */
  }
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

