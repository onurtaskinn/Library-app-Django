<style scoped>
input[type="radio"] {
    margin: 0 2.5px 0 10px;
}

table {
    border: 1px solid black;
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid black;
    padding: 8px;
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

.btn-back {
    background-color: #dc3545;
    color: white;
    border: 1px solid #dc3545;
}

.btn-back:hover {
    background-color: white;
    color: black;
    border: 1px solid #dc3545;
}
</style>
<template>
    <HeaderComponent />
    <!-- <form v-on:submit="adding">
    <div class="add-room" style="text-align: left; padding-left:30px">
        <h4>Add Facility</h4><hr>
        <fieldset> -->
    <!-- Area:
            <select v-model="facilities.area">
                <option value="Central Facility Lab">Central Facility Lab</option>
                <option value="IAM/SML">IAM/SML</option>
            </select><br>   
                name: <input type="text" id="name" class="name" v-model="facilities.name"><br>
                location: <input type="text" id="location" class="location" v-model="facilities.location"><br>
                Capacity: <input type="text" id="capacity" class="capacity" v-model="facilities.capacity"><br>
                Description: <input type="text" id="description" class="description" v-model="facilities.description"><br>
                <button type="button" class="btn btn-danger" @click="$router.push('/area')">Back</button>
                <button type="submit" class ="btn btn-success">Add Facility</button>  -->
    <!-- Area:
            <select v-model="facilities.area">
                <option value="Central Facility Lab">Central Facility Lab</option>
                <option value="IAM/SML">IAM/SML</option>
            </select><br>   
                name: <input type="text" id="name" class="name" v-model="facilities.name"><br>
               Status: 
                    <input type="radio" id="status" class="status" v-model="facilities.status" value="Enable">Enable
                    <input type="radio" id="status" class="status" v-model="facilities.status" value="Disable">Disable
                <br>
                Description: <input type="text" id="description" class="description" v-model="facilities.description"><br>
                Capacity: <input type="text" id="capacity" class="capacity" v-model="facilities.capacity"><br>                
                Facility Status: <input type="text" id="facilityStat" class="facilityStat" v-model="facilities.facilityStat"><br>
                Office In Charger: <input type="text" id="inCharger" class="inCharger" v-model="facilities.inCharger"/><br> 
                <button type="button" class="btn-back"  @click="$router.push('/area')">Back</button>
                <button type="submit" class ="button">Add Facility</button> 
         </fieldset>
    </div>
</form> -->
    <form @submit.prevent="adding">
        <div class="add-room" style="text-align: left; padding-left:30px">
            <h4>Add Facility</h4>
            <hr>
            <fieldset>
                <div class="form-group">
                    <label for="area">Area:</label>
                    <select v-model="selectedArea" id="area" class="form-control" @change="toggleNewItemInput">
                        <option value="Central Facility Lab">Central Facility Lab</option>
                        <option value="IAM/SML">IAM/SML</option>
                        <option value="new">Add New...</option>
                      </select>
                      <input
                        v-if="isNewItem"
                        type="text"
                        v-model="newArea"
                        id="newArea"
                        class="form-control"
                        placeholder="Enter new area"
                        
                        @keyup.enter="adding"
                      />
                </div>

                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" class="form-control" v-model="facilities.name">
                </div>

                <div class="form-group">
                    <label>Status:</label>
                    <div class="form-check">
                        <input type="radio" id="status-enable" class="form-check-input" v-model="facilities.status"
                            value="Enable">
                        <label class="form-check-label" for="status-enable">Enable</label>
                    </div>
                    <div class="form-check">
                        <input type="radio" id="status-disable" class="form-check-input" v-model="facilities.status"
                            value="Disable">
                        <label class="form-check-label" for="status-disable">Disable</label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="description">Description:</label>
                    <input type="text" id="description" class="form-control" v-model="facilities.description">
                </div>

                <div class="form-group">
                    <label for="capacity">Capacity:</label>
                    <input type="text" id="capacity" class="form-control" v-model="facilities.capacity">
                </div>

                <div class="form-group">
                    <label for="facilityStat">Facility Status:</label>
                    <input type="text" id="facilityStat" class="form-control" v-model="facilities.facilityStat">
                </div>

                <div class="form-group">
                <label for="inCharge">Officers in Charge:</label>
                <select id="inCharge" class="form-control" v-model="facilities.inCharger">
                    <option v-for="admin in admins" :value="admin._id" :key="admin._id">{{ admin.ssoid }}</option>
                </select>
            </div>

                <div class="form-group">
                    <button type="button" class="btn-back" @click="$router.push(`/Area/${area}`)">Back</button>
                    <button type="submit" class="button">Add Facility</button>
                </div>
            </fieldset>
        </div>
    </form>

</template>

<script setup>
// import { useRouter } from 'vue-router';
import HeaderComponent from '../components/TheHeader.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();


const area = route.params.area;

const selectedArea = ref('');
const newArea = ref('');
const isNewItem = ref(false);

const admins = ref([]);

const fetchAdmins = async () => {
    try {
        const response = await fetch('/api/allEQStaff'); 
        if (response.ok) {
            const { results } = await response.json();
            admins.value = results;
            console.log("jam", admins.value.ssoid)
        } else {
            throw new Error('Failed to fetch admins');
        }
    } catch (error) {
        console.error('Error fetching admin users:', error);
    }
};

const facilities = ref({
    area: '',
    name: '',
    status: '',
    description: '',
    capacity: 1,
    facilityStat: '',
    inCharger: ''
});
const toggleNewItemInput = () => {
  isNewItem.value = selectedArea.value === 'new';
  if (!isNewItem.value) {
    newArea.value = selectedArea.value;
  }
};




// const facilities = ref({
//     name: '',
//     location:'',
//     capacity:1,
//     description:''
// });

const adding = async () => {
  facilities.value.area = isNewItem.value ? newArea.value : selectedArea.value;
  if (!facilities.value.area) {
    alert("Please enter an area name.");
    return;
  }
  try {
    const response = await fetch('/api/addArea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facilities.value),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    alert(`Facility added: ${JSON.stringify(json)}`);
    
    isNewItem.value = false;
    selectedArea.value = '';
    newArea.value = '';
    facilities.value = { area: '', name: '', status: '', description: '', capacity: 1, facilityStat: '', inCharger: '' };
  } catch (error) {
    console.error('Error adding facility:', error);
    alert(`Error adding facility: ${error.message}`);
  }
};
</script>