<template>
  <div>
    <Calendar @selectTimeslot="handleTimeslotSelection" />
    <!-- Implement Calendar component where users can click and drag to select a timeslot -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Calendar from '../components/TheCalendar.vue'; // Assume this is a custom component you'll create for calendar functionality

const router = useRouter();
const selectedTimeslot = ref(null);

function handleTimeslotSelection(timeslot) {
  selectedTimeslot.value = timeslot;
  router.push({ name: 'BookingDetails', query: { timeslot: JSON.stringify(timeslot) } });
}
</script>
