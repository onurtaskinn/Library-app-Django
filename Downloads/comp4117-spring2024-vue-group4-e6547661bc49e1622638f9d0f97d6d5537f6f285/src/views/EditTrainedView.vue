<script setup>
import { ref, reactive, onMounted } from 'vue';
import HeaderComponent from '../components/TheHeader.vue';

const isLoading = ref(false);
const searchQuery = ref('');
const students = ref([]);

const totalPages = ref(0);
//const totalRecords = ref(0);

const trainingDate = ref('');
const selectedStudent = reactive({
  _id: null,
  ssoid: '',
  name: '',
  trained: []
});
const isPaginated = ref(true);
const isPaginationSimple = ref(false);
const paginationPosition = ref("bottom");
const sortIcon = ref("arrow-up");
const sortIconSize = ref("small");
const defaultSortDirection = ref("asc");
const currentPage = ref(1);
const perPage = ref(10);
const data = students;
const allEquipments = ['FESEM', 'ES', 'XPS'];

const isTrainedOnEquipment = (student, equipmentName) => {
  return student.trained && student.trained.some(equip => equip.equipment === equipmentName);
};

const isStudentTrained = (student) => {
  return student.trained && student.trained.length > 0;
};

const getTrainingExpiry = (student, equipmentName) => {
  const training = student.trained.find(equipment => equipment.equipment === equipmentName);
  return training ? training.expires : 'N/A';
};

const getTrainingDate = (student, equipmentName) => {
  const training = student.trained.find(equipment => equipment.equipment === equipmentName);
  return training ? training.trainedDate : 'N/A';
};

const fetchStudents = async () => {
  let url = `/api/allStudent`;
  if (searchQuery.value) {
    url += `&ssoid=${searchQuery.value}`;
  }

  try {
    const response = await fetch(url);
    const { results } = await response.json();
    students.value = results;
    console.log("student:", students.value)
  } catch (error) {
    console.error("Error fetching students:", error);
    students.value = [];
  }
};

const addTraining = async (ssoid, equipmentName, trainedDate) => {
  const newExpirationDate = new Date(trainedDate);
  newExpirationDate.setDate(newExpirationDate.getDate() + 90);
  const expires = newExpirationDate.toISOString().split('T')[0];

  try {
    isLoading.value = true;
    const response = await fetch(`/api/student/train/${ssoid}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equipmentName, trainedDate }),
    });
    isLoading.value = false;
    if (response.ok) {
      console.log("New training added successfully");

      const newTraining = { equipment: equipmentName, trainedDate, expires };
      if (!selectedStudent.trained) {
        selectedStudent.trained = [newTraining];
      } else {
        selectedStudent.trained.push(newTraining);
        selectedStudent.trained = [...selectedStudent.trained];
      }

    } else {
      throw new Error('Failed to add new training');
    }
  } catch (error) {
    console.error("Error adding new training:", error);
  }
};



const approveTraining = async (ssoid, equipmentName) => {
  const newExpirationDate = new Date();
  newExpirationDate.setDate(newExpirationDate.getDate() + 90);
  const expires = newExpirationDate.toISOString().split('T')[0];

  try {
    const response = await fetch(`/api/student/train/${ssoid}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equipmentName, expires }),
    });

    if (response.ok) {
      console.log("Training approved successfully");
      const trainingIndex = selectedStudent.trained.findIndex(equip => equip.equipment === equipmentName);
      if (trainingIndex !== -1) {
        selectedStudent.trained[trainingIndex].expires = expires;
      }
      selectedStudent.trained = [...selectedStudent.trained];

    } else {
      throw new Error('Failed to approve training');
    }
  } catch (error) {
    console.error("Error approving training:", error);
  }
};


const removeTraining = async (ssoid, equipmentName) => {
  try {
    isLoading.value = true;
    const response = await fetch(`/api/student/train/${ssoid}/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equipmentName }),
    });
    isLoading.value = false;
    if (response.ok) {
      console.log("Training removed successfully");
      const trainingIndex = selectedStudent.trained.findIndex(equip => equip.equipment === equipmentName);
      if (trainingIndex !== -1) {

        selectedStudent.trained.splice(trainingIndex, 1);
        selectedStudent.trained = [...selectedStudent.trained];
      }
      fetchStudents();
    } else {
      throw new Error('Failed to remove training');
    }

  } catch (error) {
    console.error("Error removing training:", error);
  }
};



const selectStudent = (student) => {
  selectedStudent._id = student._id;
  selectedStudent.ssoid = student.ssoid;
  selectedStudent.name = student.name;
  selectedStudent.trained = student.trained || [];
};

const banStudent = async (ssoid) => {
  try {
    const response = await fetch(`/api/student/${ssoid}/ban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("why", response);
    if (response.ok) {
      console.log("Student banned successfully");
      fetchStudents();
    } else {
      throw new Error('Failed to ban student');
    }
  } catch (error) {
    console.error("Error banning student:", error);
  }
};

const unbanStudent = async (ssoid) => {
  try {
    const response = await fetch(`/api/student/${ssoid}/unban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      console.log("Student unbanned successfully");
      fetchStudents();
    } else {
      throw new Error('Failed to unban student');
    }
  } catch (error) {
    console.error("Error unbanning student:", error);
  }
};


// onMounted(fetchStudents);
const changePage = (offset) => {
  const newPage = currentPage.value + offset;
  if (newPage < 1 || newPage > totalPages.value) {
    return;
  }
  currentPage.value = newPage;
  fetchStudents();
};
onMounted(() => {
  fetchStudents();

});
</script>

<template>
  <HeaderComponent />
  <br>
  <div class="container">


    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="admin-approve-students">
            <div class="card-header">
              <h2>Edit Trained Students</h2>
            </div>
            <br>
            <div class="search-container">

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search"
                viewBox="0 0 16 16">
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>

              <input type="text" v-model="searchQuery" placeholder="Search by Student ID" @input="fetchStudents">
            </div>
            <br>
            <section>


              <p><b>Page:</b> {{ currentPage }}</p>

              <o-table v-model:current-page="currentPage" :data="data" :paginated="isPaginated" :per-page="perPage"
                :pagination-simple="isPaginationSimple" :pagination-position="paginationPosition"
                :default-sort-direction="defaultSortDirection" :sort-icon="sortIcon" :sort-icon-size="sortIconSize"
                default-sort="ssoid">
                <o-table-column v-slot="{ row }" field="ssoid" label="Student ID" width="40" sortable numeric>
                  {{ row.ssoid }}
                </o-table-column>
                <o-table-column v-slot="props" field="Student Name" label="Student Name" width="40" sortable numeric>
                  {{ props.row.name }}
                </o-table-column>
                <o-table-column v-slot="{ row }" field="name" label="Student Name" width="100" sortable>
                  {{ row.name }}
                </o-table-column>

                <o-table-column v-slot="{ row }" field="trained" label="Status" width="80" sortable>
                  {{ isStudentTrained(row) ? 'Trained' : 'Pending' }}
                </o-table-column>

                <o-table-column v-slot="{ row }" field="actions" label="Actions" width="200">
                  <button class="btn-ban" v-if="!row.ban" @click="banStudent(row.ssoid)">Ban</button>
                  <button class="btn-ban" v-else @click="unbanStudent(row.ssoid)">Unban</button>
                  <button class="button" @click="selectStudent(row)" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">View training details</button>
                </o-table-column>

              </o-table>
            </section>


            <!-- modal pop up -->

            <div v-if="selectedStudent._id" class="training-details">
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <a type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></a>
                    <h3 class="modal-title" id="exampleModalLabel">Training Details for {{ selectedStudent.name }}</h3>
                    <table class="table">
                      <div v-if="isLoading" class="loading-container">
                        <div class="loader"></div>
                        <div class="loading-text">Loading...</div>
                      </div>
                      <div v-else>
                        <thead>
                          <tr>
                            <th>Equipment</th>
                            <th>Trained On</th>
                            <th>Expires On</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>

                          <tr v-for="equipment in allEquipments" :key="equipment">
                            <td>{{ equipment }}</td>
                            <td v-if="isTrainedOnEquipment(selectedStudent, equipment)">
                              {{ getTrainingDate(selectedStudent, equipment) }}
                            </td>
                            <td v-else>
                              No Trained Record
                            </td>
                            <td v-if="isTrainedOnEquipment(selectedStudent, equipment)">
                              {{ getTrainingExpiry(selectedStudent, equipment) }}
                            </td>
                            <td v-else>
                              No Trained Record
                            </td>
                            <td>
                              <button v-if="isTrainedOnEquipment(selectedStudent, equipment)"
                                @click="approveTraining(selectedStudent._id, equipment)">
                                Renew Training
                              </button>
                              <button v-if="isTrainedOnEquipment(selectedStudent, equipment)"
                                @click="removeTraining(selectedStudent._id, equipment)">
                                Remove Training
                              </button>
                              <div v-else>
                                <input type="date" v-model="trainingDate" :min="minDate">
                                <button @click="addTraining(selectedStudent._id, equipment, trainingDate)"
                                  :disabled="!trainingDate">
                                  Add Training
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </div>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <!-- modal pop up -->


          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
}

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;

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

.btn-ban {
  cursor: pointer;
  background-color: #dc3545;
  /* Red */
  border: 1px solid #dc3545;
  /* Red border */
  color: white;
  /* Keep text color white for contrast */
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 100px;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  border-radius: 12px;
}

.btn-ban:hover {
  background-color: white;
  /* White background on hover */
  color: #dc3545;
  /* Red text on hover */
  border: 1px solid #dc3545;
  /* Red border on hover */
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

.loading-container {
  display: flex;
  align-items: center;
  /* This aligns items vertically in the center */
  justify-content: center;
  /* This aligns items horizontally in the center */
  flex-direction: column;
  /* This stacks the spinner and the text on top of each other */
  min-height: 100px;
  /* Adjust as needed */
}

.loader {
  border: 16px solid #f3f3f3;
  /* Light grey */
  border-top: 16px solid #3498db;
  /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

.loading-text {
  margin-top: 20px;
  /* Adjust the space between the loader and the text */
  font-size: 1.5em;
  /* Adjust font size as needed */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>