<style scoped>
input[type="radio"] {
    margin: 0 2.5px 0 10px;
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
    <!-- <h2 style="text-align: left">Edit Area/Facility description</h2>
    <h3 style="text-align: left">Edit Facility</h3>
    <hr>
    <form>
        <div style="text-align: left; padding-left: 30px;">
            name:
            <input type="text" id="name" class="name" v-model="facilities.name"/>
            <br>
            location:
            <input type="text" id="location" class="location" v-model="facilities.location"/><br>
            Capacity:
            <input type="text" id="capacity" class="capacity" v-model="facilities.capacity"/><br>
            Description:
            <input type="text" id="description" class="description" v-model="facilities.description"/><br>
            <button type="button" class="btn btn-outline-danger"  @click="$router.push('/area')">&laquo; Back</button>
            <button type="submit" @click="edit()" class="btn btn-success">Change</button>
        </div>
        
    </form> -->

    
    <h3 style="text-align: left">Edit Equipment</h3>
    <hr>
    <form @submit.prevent="updateFacility">
        <div style="text-align: left; padding-left: 30px;">
            <div class="form-group">
                <label for="area">Area:</label>
                
                <select v-model="facilities.area" class="form-control" @change="confirmAreaChange">
                    <option v-for="area in areas" :value="area" :key="area">{{ area }}</option>
                  </select>
            </div>

            <div class="form-group">
                <label for="name">Equipment Name:</label>
                <input type="text" id="name" class="form-control" v-model="facilities.name" />
            </div>

            <div class="form-group">
                <fieldset>
                    <legend>Status</legend>
                    <div class="form-check">
                        <input type="radio" id="enable" class="form-check-input" v-model="facilities.status"
                            value="Enable" />
                        <label class="form-check-label" for="enable">Enable</label>
                    </div>
                    <div class="form-check">
                        <input type="radio" id="disable" class="form-check-input" v-model="facilities.status"
                            value="Disable" />
                        <label class="form-check-label" for="disable">Disable</label>
                    </div>
                </fieldset>
            </div>

            <div class="form-group">
                <label for="description">Description:</label>
                <input type="text" id="description" class="form-control" v-model="facilities.description" />
            </div>

            <div class="form-group">
                <label for="capacity">Capacity:</label>
                <input type="text" id="capacity" class="form-control" v-model="facilities.capacity" />
            </div>

            <div class="form-group">
                <label for="facStat">Facility Status:</label>
                <input type="text" id="facStat" class="form-control" v-model="facilities.facilityStat" />
            </div>

            <div class="form-group">
                <label for="inCharge">Officers in Charge:</label>
                <select id="inCharge" class="form-control" v-model="facilities.inCharger">
                    <option v-for="admin in admins" :value="admin._id" :key="admin._id">{{ admin.ssoid }}</option>

                </select>
            </div>

            <div class="form-group">
                <button type="button" class="btn-back" @click="$router.push(`/Area/${area}`)">Back</button>
                <button type="submit" class="button">Update Equipment</button>
            </div>

        </div>
    </form>

    <!-- <form>
        <div style="text-align: left; padding-left: 30px;">
            Area:
            <select v-model="facilities.area">
                <option value="Central Facility Lab">Central Facility Lab</option>
                <option value="IAM/SML">IAM/SML</option>
            </select>
            <br>
            name:
            <input type="text" id="name" class="name" v-model="facilities.name"/>
            <br>

            Status:
            <input type="radio" id="enable" v-model="facilities.status" value="Enable"  />
            <label for="enable">Enable</label>
            <input type="radio" id="disable" v-model="facilities.status" value="Disable" />
            <label for="disable">Disable</label>

            <br>
            Description:
            <input type="text" id="description" class="description" v-model="facilities.description"/><br>
            Capacity:
            <input type="text" name="capacity" class="capacity" v-model="facilities.capacity"/><br>
            Facility status:
            <input type="text" id="facStat" name="facStat" v-model="facilities.facilityStat"><br>
            Officers in charge:
            <input type="text" id="inCharge" class="inCharge"  v-model="facilities.inCharger"/><br>
            <button type="button" class="btn btn-outline-danger"  @click="$router.push('/area')">&laquo; Back</button>
            <button type="submit" @click="edit()" class="btn btn-success">Change</button> -->
    <!-- Area:
            <select v-model="facilities.area">
                <option value="Central Facility Lab">Central Facility Lab</option>
                <option value="IAM/SML">IAM/SML</option>
            </select>
            <br>
            name:
            <input type="text" id="name" class="name" v-model="facilities.name"/>
            <br>

            Status:
            <input type="radio" id="enable" v-model="facilities.status" value="Enable"  />
            <label for="enable">Enable</label>
            <input type="radio" id="disable" v-model="facilities.status" value="Disable" />
            <label for="disable">Disable</label>

            <br>
            Sort Key:
            <input type="text" id="key" class="key" v-model="facilities.sortKey"/><br>
            Description:
            <input type="text" id="description" class="description" v-model="facilities.description"/><br>
            Facility admin email:
            <input type="email" id="email" class="adminEmail" v-model="facilities.email"/><br>
            Custom HTML:
            <textarea id="url" name="url" rows="4" cols="50" v-model="facilities.html"></textarea><br>
            Capacity:
            <input type="text" name="capacity" class="capacity" v-model="facilities.capacity"/><br>
            Facility status:
            <textarea id="facStat" name="facStat" rows="4" cols="50" v-model="facilities.facilityStat"></textarea><br>
            Officers in charge:
            <input type="text" id="inCharge" class="inCharge"  v-model="facilities.inCharger"/><br>
            <button type="button" class="btn btn-outline-danger"  @click="$router.push('/area')">&laquo; Back</button>
            <button type="submit" @click="edit()" class="btn btn-success">Change</button> -->
    <!-- </div> 
    </form>  -->
</template>

<script setup>
import HeaderComponent from '../components/TheHeader.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const areaChangeConfirmed = ref(false);

//const facilities = ref([]);
const area = route.params.area;
const areas = ref([]);
const fetchEquipmentAreas = async () => {
    try {
        const response = await fetch('/api/equipment/areas');
        if (response.ok) {
            const results = await response.json();
            console.log("jame", results)
            areas.value = results;
        } else {
            console.error('Error fetching equipment areas:', response.status);
        }
    } catch (error) {
        console.error('Error fetching equipment areas:', error);
    }
};
const facilities = ref({


    area: '',
    name: '',
    status: '',
    description: '',
    capacity: '',
    facilityStat: '',
    inCharger: '',
    areaChangeConfirmed: 'deny',
});
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


const originalArea = ref('');
const confirmAreaChange = () => {
    if (facilities.value.area !== originalArea.value) {
        let userInput = prompt('Please type "confirm" to change the area.');

        userInput = userInput ? userInput.trim().toLowerCase() : '';

        if (userInput === 'confirm') {
            areaChangeConfirmed.value = true;
        } else {
            alert('You must type "confirm" to proceed with changing the area.');
            facilities.value.area = originalArea.value; 
            areaChangeConfirmed.value = false;
        }
    } else {
        areaChangeConfirmed.value = true;
    }
};


const getData = async () => {
    console.log(route.params.id)
    const response = await fetch(`/api/Area/${area}/editArea/` + route.params.id);
    const json = await response.json();
    console.log(json);
    facilities.value = json;
    originalArea.value = facilities.value.area;

}

onMounted(async () => {
    getData();
    fetchEquipmentAreas();
    fetchAdmins();
}
);
import { useRouter } from 'vue-router';
const router = useRouter();


const edit = async () => {
    try {
        const response = await fetch(`/api/area/:area/editArea/${facilities.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(facilities.value)
        });
        const json = await response.json();
        console.log(json);
        alert('Facility updated successfully.');
    } catch (error) {
        console.error('Error updating facility:', error);
        alert(`Error updating facility: ${error.message}`);
    }
};

const updateFacility = async () => {
    if (facilities.value.area !== originalArea.value && !areaChangeConfirmed.value) {
        console.log("super test",facilities.value.area , originalArea.value)
    alert('Area change not confirmed.');
    return;
  }

  const payload = {
    ...facilities.value,
    originalArea: originalArea.value,
    areaChangeConfirmed: areaChangeConfirmed.value ? 'confirm' : 'deny',
  };

  try {
    const response = await fetch(`/api/area/${facilities.value.area}/editArea/${facilities.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    alert('Facility updated successfully.');
    areaChangeConfirmed.value = false; 
    originalArea.value = facilities.value.area; 
    router.push(`/Area/${area}`)
  } catch (error) {
    console.error('Error updating facility:', error);
    alert(`Error updating facility: ${error.message}`);
  }
};


// const BackToMain =  async() => {
//     { return window.history.length == 1 }
// }

// const editArea = async () => {
//         // post the booking to the backend
//         const response = await fetch('/api/editArea/' + route.params.id, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(facilities.value)
//         });
//         // convert the response to json
//         const json = await response.json();
//         // log the json
//         console.log(json);
//         // alert the user
//         alert(JSON.stringify(json));
// }

// const goBack = async()=>{
//     try{

//     }catch(error){
//         console.error("Fault");
//     }
// }
</script>
