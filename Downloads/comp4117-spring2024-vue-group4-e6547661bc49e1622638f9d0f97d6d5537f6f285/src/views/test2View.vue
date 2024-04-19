<template>
    <div>
      <h2>Booking Details</h2>
      <p><strong>Timeslot:</strong> {{ timeslot.start }} to {{ timeslot.end }}</p>
      <!-- Add more details form here -->
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const timeslot = ref({ start: '', end: '' });
  
  onMounted(() => {
    if (route.query.timeslot) {
      const selectedTimeslot = JSON.parse(route.query.timeslot);
      timeslot.value = { start: selectedTimeslot.start, end: selectedTimeslot.end };
    }
  });
  </script>
  