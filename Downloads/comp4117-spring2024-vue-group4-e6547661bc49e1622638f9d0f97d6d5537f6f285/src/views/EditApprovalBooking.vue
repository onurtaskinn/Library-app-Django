
<template>
  <HeaderComponent />
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="text-center flex-grow-1">
            <div class="title" style="float: left;">
              <h2>Booking Approval</h2>
            </div>
          </div>
          <div class="toolBar">
          </div>
      </div>
      <div class="card" style="padding:1%;">
<div v-if="booking && Object.keys(booking).length > 0">
<form>
  

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Record Created Time</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="date" v-model="createdDate" readonly>
                    <div name="error_name"></div>
                    </div>
                </div>   
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Booker</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="date" v-model="booking.userId" readonly>
                    <div name="error_name"></div>
                    </div>
                </div>     
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Equipment</label>
                    <div class="col-sm-10">
                      
                    <input type="text" class="form-control" id="date" v-model="booking.equipmentName" readonly>

                    <div name="error_name"></div>
                    </div>
                </div>    
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Booking Date</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="date" v-model="booking.date" readonly>
                    <div name="error_name"></div>
                    </div>
                </div>  
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">From</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="date" v-model="booking.timeslot.endTime" readonly>

                    <div name="error_name"></div>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">To</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="date" v-model="booking.timeslot.endTime" readonly>

                    <div name="error_name"></div>
                    </div>
                </div>  

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Request</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="date" v-model="booking.request" readonly>

                    <div name="error_name"></div>
                    </div>
                </div>      


                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Approvement</label>
                    <div class="col-sm-10">
                      <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="approvement" v-model="booking.approvement">
                        <option value="pending">Pending</option>
                        <option value="approval">Approval</option>
                        <option value="unapprove">Unapprove</option>
                      </select>
                    <div name="error_name"></div>
                    </div>
                </div>  

                <div class="buttonBar" style="float: right; padding-right: 5%;">
                <a class="btn btn-secondary me-3" href="/approval">Back</a>
                <button class="btn btn-primary me-3" @click="submitForm">
                  <div>Update</div>
                </button>
              </div>
  </form>

  </div>
</div>
</div>
</template>


<script setup>
import { ref ,onMounted   } from 'vue'
import HeaderComponent from '../components/TheHeader.vue';
import { bookingsService } from '../service/bookingService';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();


const booking = ref({});
const createdDate = ref({});

onMounted(async () => {
  if (route.query.id) {
     loadBookingData(route.query.id);
  }else{
    router.push('/approval');
  }


});

async function loadBookingData(bookingId) {
  try {
    const data = await bookingsService.getById(bookingId);
    if (!data) {
      console.log("Not Data is:", data);

    } else {
      console.log("Data is:", data);
      booking.value = data[0];
      createdDate.value = formatMongoDBDate(booking.value.createdAt);

    }
  } catch (error) {
    console.error('Error fetching bookingsService:', error);
    alert("Error fetching bookingsService data");
  }
}




const submitForm = async () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000; // convert offset to milliseconds
  const localISODate = new Date(today - timezoneOffset).toISOString().slice(0, 10);
  try {
      booking.value.updatedAt = localISODate;
      await bookingsService.update(booking.value._id, booking.value);
      alert('Booking updated successfully.');
      router.push('/approval');

    
    // Navigate to another route after successful operation
    // For example, back to the holidays list. Adjust the route as needed.
  } catch (error) {
    console.error('Error submitting Booking:', error);
    alert('Failed to submit the Booking. Please try again.');
  }
}


function formatMongoDBDate(dateString) {

  const dateObj = new Date(dateString);
  const date = dateObj.toISOString().split('T')[0];
  const time = dateObj.toTimeString().split(' ')[0];
  return `${date} | ${time}`;
}

</script>

<style>
.row{ 
margin: 1%;
}

.form-text{
  float: left;
}
</style>