<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";

const credentials = ref({
    name: '',
    studentNum: '',
    trained: '',
    type: '',
    equipment: '',
    date: '',
    timeslot: '' ,
    edit: ''
});
const route = useRoute();
// const router = useRouter();

const getDetail = async () => {
    try {
        const response = await fetch('/fetch-acc-detail', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: route.params.id })
        });
        if (!response.ok) {
            throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        credentials.value = data;
    } catch (error) {
        console.error('Error:', error);
    }
};

onMounted(async () => {
    if (route.params.id) {
        getDetail();
    }
});
</script>

<template>
    <div class="container mt-5">
        <!-- Breadcrumb link -->
        <div class="row">
            <div class="col-8">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb custom-breadcrumb">
                        <li class="breadcrumb-item"><a href="/students/:studentNum">Booking</a></li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>

    <div>
        <h2>Personal Information</h2>
        <table class="table my-2" style="padding-right: 30px; text-align: center;background-color: orange;">
            <tbody style="text-align: left;">
                <tr>
                    <th scope="row">Name </th>
                    <td>{{ credentials.name }}</td>
                </tr>
                <tr>
                    <th scope="row">Student Number </th>
                    <td>{{ credentials.studentNum }}</td>
                </tr>
                <tr>
                    <th scope="row">Trained </th>
                    <td>{{ credentials.trained }}</td>
                </tr>
                <tr>
                    <th scope="row">Type </th>
                    <td>{{ credentials.type }}</td>
                </tr>
            </tbody>
        </table>
        <br><br>

        <h2>Booking History</h2>
        <table class="table my-2" style="padding-right: 30px; text-align: center;background-color: orange;">
            <thead>
                <tr>
                    <th scope="col">Equipment</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time-slot</th>
                    <th scope="col">Edit</th>
                </tr>
            </thead>
            <!-- <tbody>
                <template v-if="Object.keys(credentials.value).length > 0">
                    <tr v-for="(student, index) in credentials.value.bookingHistory" :key="student._id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ student.equipment }}</td>
                        <td>{{ student.date }}</td>
                        <td>{{ student.timeslot }}</td>
                        <td>{{ student.edit }}</td>
                        <td>
                            <div class="d-flex justify-content-around">
                                <a :href="`/students/${student.studentNum}`" class="btn btn-secondary">Edit</a>
                                <button class="btn btn-secondary raised-pink">X</button>
                            </div>
                        </td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="4">No booking history available.</td>
                </tr>
            </tbody> -->
        </table>

    </div>
</template>
