<template>
  <HeaderComponent />
  <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="text-center flex-grow-1">
            <div class="title" style="float: left;">
              <h2>Booking Approval</h2>
              <div><h4>{{ subTitle }}</h4></div>
              <div>Number of  Booking {{ totalRecord }}</div>
            </div>
          </div>
          <div class="toolBar">
            <a class="btn-booking" @click="fetchFutureBookings()" style="margin: 8px;">Future  Booking</a>
            <a class="btn-booking" @click="getAllBooking()" style="margin: 8px;">All Booking</a>
          </div>
      </div>
      <!--
              <table class="table"  >
                  <thead>
                      <tr>
                          <th>Booker Id</th>
                          <th>Record Create Time</th>
                          <th>Equipment name</th>
                          <th>Booking Date</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Requestion</th>
                          <th>State</th>
                          <th>Approval</th>

                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="booking in bookings" :key="booking._id">
                          <td>{{ booking.userId }}</td>
                          <td>{{ booking.createdAt }}</td>
                          <td>{{ booking.equipmentName }}</td>
                          <td>{{ booking.date }}</td>
                          <td>{{ booking.timeslot.startTime }}</td>
                          <td>{{ booking.timeslot.endTime }}</td>
                          <td>{{ booking.request }}</td>
                          <td>{{ booking.approvement }}</td>

                          
                          <td><a  class="btn btn-primary" :href="'/EditApproval?id=' + booking._id" >Approval</a></td>
                          <td><a  class="btn btn-danger" :href="'/EditApproval?id=' + booking._id" >Approval</a></td>
                          <td><a  class="btn btn-secondary" :href="'/EditApproval?id=' + booking._id" >Approval</a></td>

                        </tr>
                  </tbody>
              </table>
-->
<table>
  <thead>
    <tr>
      <th scope="col">Booking Id</th>
      <th scope="col">Booker Id</th>
      <th scope="col">Record Create Time</th>
      <th scope="col">Equipment Name</th>
      <th scope="col">Booking Date</th>
      <th scope="col">Booking Time</th>
      <th scope="col">Requestion</th>
      <th scope="col">State</th>
      <th scope="col">Approval</th>

  </tr>
  </thead>
  <tbody>
    <tr v-for="booking in displayBookings" :key="booking._id" :class="booking.approvement">
      <td  data-label="Booking Id" style="  word-wrap: break-word;">{{ booking._id }}</td>
      <td  data-label="Booker Id" style="  word-wrap: break-word;">{{ booking.userId.ssoid }}</td>


      <td data-label="Record Create Time">{{ booking.displayCreatedAt }}</td>
      <td  data-label="Equipment Name">{{ booking.equipmentName }}<br>{{ booking.areaEquipmentName }}</td>
      <td  data-label="Booking Date">{{ booking.date }}</td>
      <td  data-label="Booking Time">{{ booking.timeslot.startTime }} - {{ booking.timeslot.endTime }}</td>
<td data-label="Requestion">{{ booking.request ? booking.request : 'Null' }}</td>
      <td  data-label="State" >{{ booking.approvement }}</td>

      
      <td data-label="Approval">
        <div v-if="booking.approvement == 'approved'">
        </div>
        <div v-else>
          <button class="btn-a" @click="submitApproval(booking._id, 'approved')" style="margin: 8px;">Approval</button>
        </div>

        <div v-if="booking.approvement == 'disapproved'">
        </div>
        <div v-else>
          <button class="btn-dis" @click="submitApproval(booking._id, 'disapproved')" style="margin: 8px;">Disapproval</button>
        </div>

        <button class="btn-m"   style="margin: 8px;" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">More Info</button>
      </td>
    
    </tr>
    
  </tbody>
</table>
      <pagination :current-page="currentPage" :total-pages="totalPages" @update:currentPage="handlePageChange" />

  </div>
<!-- Button trigger modal -->

  <!-- Model Start  -->

  <!-- Modal -->
<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
        
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitEmail">

          <div class="modal-body" style="align:left">
            <div class="form-group">
              <label for="exampleFormControlTextarea1">Massage to booker</label>
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
          </div>
          </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter">Close</button>
        <button type="button" class="btn btn-primary">Send</button>
      </div>
    </div>
  </div>
</div>

  <!-- Model End  -->

</template>


<script setup>
import { ref, onMounted , computed } from 'vue';
import { bookingsService } from '../service/bookingService';
import HeaderComponent from '../components/TheHeader.vue';
import Pagination from '../components/paginationComponent.vue'; // Make sure this path is correct
const totalRecord = ref(0);

const currentPage = ref(1);
const totalPages = ref(0);
const currentPaginationFunction = ref();

const bookings = ref([]);
const subTitle = ref('');


async function fetchFutureBookings(page = 1) {
  const response = await bookingsService.getfutureBooking({ page });
  response.data.forEach(booking => {
      booking.createdAt = formatMongoDBDate(booking.createdAt);
  
      });
  currentPaginationFunction.value = fetchFutureBookings;  // Update current function

  bookings.value = response.data;
  totalPages.value = response.totalPages;
  currentPage.value = response.page;
  totalRecord.value = response.total;

  subTitle.value = "Future Bookings";
}



onMounted(() => {
  fetchFutureBookings(currentPage.value);
});



async function getAllBooking(page = 1) {
  const response = await bookingsService.getAllNPage({ page });
  response.data.forEach(booking => {
        booking.createdAt = formatMongoDBDate(booking.createdAt);
      });

      currentPaginationFunction.value = getAllBooking;  // Update current function

  bookings.value = response.data;
  totalPages.value = response.totalPages;
  currentPage.value = response.page;
  totalRecord.value = response.total;

  subTitle.value = "All Bookings";
}

function handlePageChange(page) {
  if (currentPaginationFunction.value) {
    currentPaginationFunction.value(page);
  }
}
function formatMongoDBDate(dateString) {

try{
  const dateObj = new Date(dateString);
  const date = dateObj.toISOString().split('T')[0];
  const time = dateObj.toTimeString().split(' ')[0];
  return `${date} ${time}`;

}catch (error) {
  return dateString;
}

}

//Start Submit
async function submitApproval(recordId, approvalStatus) {
  const localISODate = new Date(new Date() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  try {
    const recordToUpdate = {
      approvement: approvalStatus,
      updatedAt: localISODate
    };
    if(confirm('Are you sure ' + (approvalStatus === 'approved' ? 'approval' : 'disapproval') + " record " + recordId , '?')){
      await bookingsService.update(recordId, recordToUpdate);
      alert('Booking ' + (approvalStatus === 'approved' ? 'approved' : 'disapproved') + ' successfully.');
    }
   
  } catch (error) {
    console.error('Error updating Booking:', error);
    alert('Failed to update the Booking. Please try again.');
  }
}
//End submit
const displayBookings = computed(() => {
  return bookings.value.map(booking => ({
    ...booking,
    // Create a new property for the formatted date/time for display
    displayCreatedAt: formatMongoDBDate(booking.createdAt),
    // Add other properties as needed
  }));
});
function bookingsOverlap(booking1, booking2) {
  const start1 = new Date(`${booking1.BookingDate} ${booking1.startTime}`).getTime();
  const end1 = new Date(`${booking1.BookingDate} ${booking1.endTime}`).getTime();
  const start2 = new Date(`${booking2.BookingDate} ${booking2.startTime}`).getTime();
  const end2 = new Date(`${booking2.BookingDate} ${booking2.endTime}`).getTime();

  return start1 < end2 && start2 < end1;
}
function markOverlappingBookings(bookings) {
  for (let i = 0; i < bookings.length; i++) {
    for (let j = i + 1; j < bookings.length; j++) {
      if (bookingsOverlap(bookings[i], bookings[j])) {
        // Assuming each booking object has a `style` property for simplicity
        bookings[i].style = bookings[i].style || 'green';
        bookings[j].style = bookings[j].style || 'red'; // Assuming you want to mark the second booking differently
      }
    }
  }
  return bookings;
}</script>
<style>


.disapproved{
  background-color: rgb(235, 101, 101);
}
.approved{
  background-color: rgb(192, 241, 192);
}


table {
  border: 1px solid #ffffff;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
}

table caption {
  font-size: 1.5em;
  margin: .5em 0 .75em;
}

table tr {
  border: 1px solid #ddd;
  padding: .35em;
}

table th,
table td {
  padding: .625em;
  text-align: center;
}

table th {
  font-size: .85em;
}

@media screen and (max-width: 1100px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }
  
  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  
  table tr {
    display: block;
    margin-bottom: .625em;
  }
  
  table td {
    display: block;
    font-size: .8em;
    text-align: right;
  } 
  
  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
  }
  
  table td:last-child {
    border-bottom: 0;
  }
}


.btn-booking {
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

.btn-booking:hover {
  background-color: white; 
  color: black;
  border: 1px solid #007bff;
}

.btn-dis {
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

.btn-dis:hover {
  background-color: white; /* White background on hover */
  color: #dc3545; /* Red text on hover */
  border: 1px solid #dc3545; /* Red border on hover */
}

.btn-m {
  cursor: pointer;
  background-color: grey; 
  border: 1px solid grey; 
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

.btn-m:hover {
  background-color: white; 
  color: black;
  border: 1px solid grey;
}

.btn-a {
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

.btn-a:hover {
  background-color: white; 
  color: black;
  border: 1px solid #007bff;
}



/* general styling */

</style>