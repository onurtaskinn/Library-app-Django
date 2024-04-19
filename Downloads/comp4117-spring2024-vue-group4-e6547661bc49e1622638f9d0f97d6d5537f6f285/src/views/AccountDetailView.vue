<script setup>
import { onMounted, ref, reactive } from "vue";
import { jwtDecode } from "jwt-decode";
// import { useRouter } from 'vue-router';
import HeaderComponent from '../components/TheHeader.vue';
//import {bootstrap} from 'bootstrap/dist/js/bootstrap.bundle.min.js';
//const users = ref([]);
const name = ref("");
const studentNum = ref("");
const trained = ref("");
const type = ref("");
const bookings = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const totalRecords = ref(0);
const selectedBooking = reactive({
    _id: null,
    equipmentName: '',
    date: '',
    timeslot: {
        startTime: '',
        endTime: ''
    }
});

const loadAsyncData = async () => {
    try {
        const token = localStorage.getItem('token');




        const decoded = jwtDecode(token);
        console.log("222",decoded);
        //console.log(token);
        name.value = `${decoded.name}`;
        studentNum.value = `${decoded.user.ssoid}  `;

        trained.value = `${decoded.trained}  `;
        type.value = `${decoded.user.employee_type}  `;



    } catch (error) {
        console.log(error);
    }
};


const fetchBookingHistory = async () => {
    const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const decoded = jwtDecode(token);
        const userId = decoded.user.ssoid; 
        const url = `/api/booking-history/${userId}?page=${currentPage.value}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch booking history');
        const { bookingHistory, page,totalPages: total, totalRecords: totalRecs } = await response.json();
        bookings.value = bookingHistory;
        currentPage.value = page;
        totalPages.value = total;
        totalRecords.value = totalRecs;
        
    } catch (error) {
        console.error('Error fetching booking history:', error.message);
    }
};

const selectBooking = (booking) => {
    selectedBooking._id = booking._id;
    selectedBooking.equipmentName = booking.equipmentDetails.name;
    selectedBooking.date = booking.date;
    selectedBooking.timeslot = booking.timeslot;
};

const deleteBooking = async (bookingId) => {
  try {
    const response = await fetch(`/api/bookings/delete/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to delete booking');
    bookings.value = bookings.value.filter(booking => booking._id !== bookingId);

    console.log("Booking deleted successfully");
    window.location.reload();
  } catch (error) {
    console.error('Error deleting booking:', error);
  }
};


const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const bookingDate = new Date(date);
  return bookingDate > today;
};

const changePage = (offset) => {
  const newPage = currentPage.value + offset;
  if (newPage < 1 || newPage > totalPages.value) {
    return;
  }
  currentPage.value = newPage;
  fetchBookingHistory();
};

onMounted(() => {
    loadAsyncData();
    fetchBookingHistory();
});
</script>

<template>
    <HeaderComponent />
    <br>
    <main>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                  <h2 class="mb-4">Personal Information</h2>
                    <div class="card">
                        <table class="table my-2" style="padding-right: 30px; text-align: center;">
                            <tbody style="text-align: left;">
                                <tr>
                                    <th scope="row">Name </th>
                                    <td>{{ name }}</td>

                                </tr>
                                <tr>
                                    <th scope="row" v-if="type == 'STUDENT'">Student Number </th>
                                    <th scope="row" v-else>Staff ID </th>
                                    <td>{{ studentNum }}</td>

                                </tr>
                                <!-- <tr>
                                    <th scope="row">Trained </th>
                                    <td>{{ trained }}</td>

                                </tr> -->
                                <!-- <tr>
                    <th scope="row">Type </th>
                    <td>{{ type }}</td>
                     
                </tr> -->
                            </tbody>
                        </table>

                    </div>
                </div>

                <br>

                <div class="col-md-6">
                  <h2 class="mb-4">Booking History</h2>
                    <div class="card">
                        <div class="page-container">
                            <button class="btn" @click="changePage(-1)" :disabled="currentPage.value <= 1">
                              << </button>
              
                                <span class="page-show-word">Showing {{ ((currentPage - 1) * 10) + 1 }}-{{ Math.min(currentPage * 10,
                              totalRecords) }} of {{
                              totalRecords }}</span>
                                
                                <span style="margin-right: 3px;"> Page: </span>
                                <!-- <span> Page {{ currentPage }} of {{ totalPages }}</span> -->
                                <select class="form-select text-select" v-model="currentPage" @change="changePage(0)">
                                  <option v-for="page in totalPages" :key="page" :value="page"> {{ page }}</option>
                                </select>
                                <button class="btn" @click="changePage(1)" :disabled="currentPage.value >= totalPages.value"> >>
                                </button>
                          </div>

                        <table class="table my-2" style="padding-right: 30px; text-align: center;">
                            <thead>
                                <tr>
                                    <th scope="col">Equipment</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time-slot</th>
                                    <th scope="col">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="booking in bookings" :key="booking._id">
                                    <td>{{ booking.equipmentDetails.name }}</td>
                                    <td>{{ booking.date }}</td>
                                    <td>{{ booking.timeslot.startTime }} - {{ booking.timeslot.endTime }}</td>
                                    <td>
                                        
                                        <button class="button" @click="selectBooking(booking)" data-bs-toggle="modal" data-bs-target="#bookingDetailsModal">View
                      training details</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                <!-- pop up -->
                    <div class="modal fade" id="bookingDetailsModal" tabindex="-1" aria-labelledby="bookingDetailsModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="bookingDetailsModalLabel">Booking Details</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <p><strong>Equipment Name:</strong> {{ selectedBooking.equipmentName }}</p>
                              <p><strong>Date:</strong> {{ selectedBooking.date }}</p>
                              <p><strong>Time-slot:</strong> {{ selectedBooking.timeslot.startTime }} - {{ selectedBooking.timeslot.endTime }}</p>
                              
                            </div>
                            <div class="modal-footer">
                                <button v-if="isFutureDate(selectedBooking.date)" @click="deleteBooking(selectedBooking._id)" class="btn btn-danger">Delete</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                          </div>
                        </div>
                      </div>

                </div>

            </div>

        </div>

    </main>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #ddd;
}

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;

}

.button {
  cursor: pointer;
  background-color: #4CAF50;
  /* Green */
  border: 1px solid #4CAF50;
  color: white;
  padding: 7px 18px;
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

.page-show-word {
  font-style: italic;
  color: rgb(95, 95, 95);
  margin-right: 15px;
}

.text-select {
  border: 1px;
  width: 60px;
  background-color: #e7e7e7;
}

.card-header {
  background-color: rgb(213, 244, 245);
}

.modal-dialog {
  max-width: 800px;
}

.modal-content {
  padding: 20px;
}
</style>