<script setup>
import { ref, onMounted } from 'vue';
import HeaderComponent from '../components/TheHeader.vue';

const students = ref([]);

const fetchStudents = async () => {
    try {
        const response = await fetch('/api/untrained');
        const json = await response.json();
        students.value = json;
        console.log(students);
    } catch (error) {
        console.error("Error fetching students:", error);
    }
};
const currentPage = ref(1);

const isPaginated = ref(true);
const perPage = ref(10);
const isPaginationSimple = ref(false);
const paginationPosition = ref("bottom");
const defaultSortDirection = ref("asc");
const sortIcon = ref("arrow-up");
const sortIconSize = ref("small");


onMounted(() => {
    fetchStudents();
});
</script>

<template>
    <HeaderComponent />
    <div class="container mt-4">
        <!-- <h2 class="mb-4">Students with Expired Equipment Training</h2> -->
        <div class="card">
            <div class="card-header">
                <h2>Students with Expired Equipment Training</h2>
            </div>
            <div class="card-body">
                <o-table
    v-model:current-page="currentPage"
    :data="students"
    :paginated="isPaginated"
    :per-page="perPage"
    :pagination-simple="isPaginationSimple"
    :pagination-position="paginationPosition"
    :default-sort-direction="defaultSortDirection"
    :sort-icon="sortIcon"
    :sort-icon-size="sortIconSize"
    default-sort="ssoid">
    
    <o-table-column
      field="ssoid"
      label="Student ID"
      width="100"
      sortable>
      <template #default="{ row }">
        {{ row.ssoid }}
      </template>
    </o-table-column>

    <o-table-column
      field="name"
      label="Name"
      width="100"
      sortable>
      <template #default="{ row }">
        {{ row.name }}
      </template>
    </o-table-column>

    <o-table-column
      field="expiredTraining"
      label="Expired Training"
      width="200">
      <template #default="{ row }">
        <ul>
          <li v-for="equipment in row.expiredEquipment" :key="equipment.name">
            {{ equipment.name }} - Expired on: {{ equipment.expires }}
          </li>
        </ul>
      </template>
    </o-table-column>

  </o-table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 800px;
    margin: auto;
}

.mt-4 {
    margin-top: 1.5rem;
}

.mb-4 {
    margin-bottom: 1.5rem;
}

.card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
}

.table {
    margin-bottom: 0;
}

.card-header {
    background-color: rgb(243, 91, 91);
}
</style>