<script setup>
import { ref, reactive, onMounted } from 'vue';
import HeaderComponent from '../components/TheHeader.vue';

const searchQuery = ref('');
const admins = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const totalRecords = ref(0);
const newAdminData = reactive({ ssoid: '', name: '', email: '', password: '' });

const fetchAdmin = async () => {
  const url = `/api/management/?page=${currentPage.value}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch booking history');
    const { results, page, totalPages: total, totalRecords: totalRecs } = await response.json();
    admins.value = results;
    currentPage.value = page;
    totalPages.value = total;
    totalRecords.value = totalRecs;
    console.log("admins", admins.value);
  } catch (error) {
    console.error('Error fetching booking history:', error.message);
  }
};

const selectedAdmin = reactive({
  _id: null,
  stuID: '',
  name: '',
  trained: []
});

const selectAdmin = (admin) => {
  selectedAdmin._id = admin._id;
  selectedAdmin.ssoid = admin.ssoid;
  selectedAdmin.name = admin.name;
  selectedAdmin.edit = admin.edit || [];
};

const addAdmin = async () => {
  if (newAdminData.ssoid && newAdminData.name && newAdminData.email) {
    try {
      const response = await fetch('/api/management/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ssoid: newAdminData.ssoid,
          name: newAdminData.name,
          email: newAdminData.email
        }),
      });
      if (response.ok) {
        console.log('Admin added successfully');
        fetchAdmin();
        newAdminData.ssoid = '';
        newAdminData.name = '';
        newAdminData.email = '';
      } else {
        const error = await response.json();
        console.error('Failed to add admin1:', error.message);
      }
    } catch (error) {
      console.error('Failed to add admin2:', error);
    }
  } else {
    console.error('All fields are required.');
  }
};


const removeAdmin = async (ssoid) => {
  try {
    const response = await fetch(`/api/management/${ssoid}/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      // If the deletion is successful, remove the staff member from the admins array
      admins.value = admins.value.filter((admin) => admin.ssoid !== ssoid);
    } else {
      // Handle any error response
      console.error('Failed to remove admin:', response.statusText);
    }
  } catch (error) {
    console.error('Error removing admin:', error);
  }
};

const changePage = (offset) => {
  const newPage = currentPage.value + offset;
  if (newPage < 1 || newPage > totalPages.value) {
    return;
  }
  currentPage.value = newPage;
  fetchAdmin();
};

onMounted(() => {
  fetchAdmin();
});
</script>

<template>
  <HeaderComponent />
  <br>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <h2 class="mb-4">In Charge Management</h2>
        <div class="card">
          <div class="add-admin">

            <br>
            <form class="form">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="staffnum">Staff ssoid:</label>
                    <input type="text" class="form-control" id="staffnum" v-model="newAdminData.ssoid"
                      placeholder="Enter Staff Number" required>
                  </div>
                  <div class="form-group">
                    <label for="adminName">Name:</label>
                    <input type="text" class="form-control" id="adminName" v-model="newAdminData.name"
                      placeholder="Enter Admin's Name" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="adminEmail">Email:</label>
                    <input type="email" class="form-control" id="adminEmail" v-model="newAdminData.email"
                      placeholder="Enter Admin's Email" required>
                  </div>
                  <div class="form-group">
                    <label for="adminPassword">Password:</label>
                    <input type="password" class="form-control" id="adminPassword" v-model="newAdminData.password"
                      placeholder="Enter Admin's Password" required>
                  </div>
                </div>
              </div>

              <button type="button" class="button" @click="addAdmin">Add Admin</button>
            </form>

            <!-- <form style="display: flex; align-items: center;">
              <div style="display: flex; align-items: center;">
                <label for="staffnum" style="margin-right: 10px;">Number</label>
                <input type="staffnum" class="form-control" id="staffnum" v-model="admins.ssoid"
                  placeholder="Enter Staff Number" required>
              </div>
              <button type="button" class="btn btn-primary" style="margin-left: 10px;" @click="addAdmin">Add
                Admin</button>
            </form> -->
            <hr>
            <div class="search-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search"
                viewBox="0 0 16 16" style="margin-right: 5px">
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              <input type="text" v-model="searchQuery" style="width: 200px;" placeholder="Search by Staff Number" @input="fetchAdmin">
            </div>
            <br>

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

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Staff number</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="admin in admins" :key="admin._id" @click="selectAdmin(admin)">
                  <td class="bg-light">{{ admin.name }}</td>
                  <td class="bg-light">{{ admin.ssoid }}</td>
                  <td class="bg-light">
                    <button class="btn-remove" @click="removeAdmin(admin.ssoid)">Remove</button>
                  </td>
                </tr>
              </tbody>

            </table>
            <br>
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

.btn-remove {
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

.btn-remove:hover {
  background-color: white; /* White background on hover */
  color: #dc3545; /* Red text on hover */
  border: 1px solid #dc3545; /* Red border on hover */
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

.form-select {
  margin-right: 10px;
}

.form {
  margin: 2%;
  text-align: left;
}



.card-header {
  background-color: rgb(213, 244, 245);
}

.search-container {
  justify-content: center;
  
}
</style>