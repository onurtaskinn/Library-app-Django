<template>
  <HeaderComponent />
  <div class="container mt-4">
    <div v-if="action == 'edit'">
      Edit Holiday
    </div>
    <div v-else>
      Create Holiday
    </div>
    <div class="card" style="padding:1%;">
      <form>
        <div class="form-group row">
          <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="name" placeholder="Holiday Name" v-model="holiday.name">
            <div name="error_name"></div>
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword" class="col-sm-2 col-form-label">Date</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="date" placeholder="yyyy-mm-dd" v-model="holiday.date">
            <div name="error_date"></div>
          </div>
        </div>

        <div class="form-group row">
          <label for="inputPassword" class="col-sm-2 col-form-label">Description</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="description" v-model="holiday.description">
            <div name="error_date"></div>

          </div>
        </div>

        <div v-if="action === 'edit'">
          <button class="btn-del" style="float: left;" @click="deleteForm($event)">Delete</button>
        </div>
        <div class="buttonBar" style="float: right; padding-right: 5%;">

          <div v-if="action === 'edit'">

            <button class="btn-edit me-3" @click="submitForm">
              Edit
            </button>
            <a class="btn-back me-3" href="/holiday">Back</a>
          </div>
          <div v-else>
            <button class="btn-edit me-3" @click="submitForm">
              Create
            </button>
            <a class="btn-back me-3" href="/holiday">Back</a>

          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import HeaderComponent from '../components/TheHeader.vue';
import { holidayService } from '../service/holidayService'
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const holiday = ref({
});
const router = useRouter();
const action = ref("edit");

onMounted(async () => {
  if (route.query.id) {
    loadHolidayData(route.query.id);
    action.value = "edit";
  } else {
    action.value = "create";
  }
});


async function loadHolidayData(holidayId) {
  try {
    const data = await holidayService.getById(holidayId);
    if (!data) {
      console.log("Data is:", data);

    } else {
      console.log("Data is:", data);
      holiday.value = data;
    }
  } catch (error) {
    console.error('Error fetching holiday:', error);
    alert("Error fetching holiday data");
  }
}
const deleteForm = async (event) => {
  event.preventDefault(); // Prevent default form submission
  if (confirm(`Are you sure you want to delete ${holiday.value.name}?`)) {
    await holidayService.delete(holiday.value._id);
    alert("Holiday is deleted");
    router.push({ name: 'holiday', query: route.query });
  } else {
    // If cancelled, no action is needed, stay on the page
    console.log('Deletion cancelled');
  }
}

const submitForm = async (event) => {
  // Optional: Prevent default form submission behavior if using form submit event
  event.preventDefault();

  let validationErrors = {};
  if (!holiday.value.name || holiday.value.name.trim() === '') {
    validationErrors.name = 'Holiday name is required.';
    alert('Holiday name is required.');
    return; // Stop further execution to allow user to correct the form without navigating away
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(holiday.value.date)) {
    alert('The date must be in yyyy-mm-dd format.');
    return; // Stop further execution
  }

  try {
    if (action.value == 'edit') {
      await holidayService.update(holiday.value._id, holiday.value);
      alert('Holiday updated successfully.');
      // Retain the query parameters if needed
      router.push({ path: '/holidayEdit', query: route.query });
    } else {
      await holidayService.create(holiday.value);
      alert('Holiday created successfully.');
      router.push('/holiday');
    }
  } catch (error) {
    console.error('Error submitting holiday:', error);
    alert('Failed to submit the holiday. Please try again.');
  }
}
</script>

<style>
.row {
  margin: 1%;
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

.btn-back {
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

.btn-back:hover {
  background-color: white; 
  color: black;
  border: 1px solid grey;
}
</style>