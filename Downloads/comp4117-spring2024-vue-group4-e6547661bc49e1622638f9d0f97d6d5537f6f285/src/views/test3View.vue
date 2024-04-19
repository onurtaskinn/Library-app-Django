<template>
    <div class="booking-calendar">
      <vue-cal
        :time-from="timeFrom * 60"
        :time-to="timeTo * 60"
        :events="events"
        @cell-click="onCellClick"
        @event-click="onEventClick"
        @event-dragend="onEventDragEnd"
        @cell-mouse-enter="onCellMouseEnter"
        default-view="week"
        :disable-views="['years', 'year', 'month', 'day']"
        :on-event-create="onEventCreate"
      ></vue-cal>
    </div>
  </template>
  
  <script setup>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import { ref } from 'vue';
  
  const events = ref([]);
  const timeFrom = 8; // Calendar starts at 08:00
  const timeTo = 18; // Calendar ends at 18:00
  
  function onCellClick(event) {
    // Handle cell click event
    // You can create a new booking event here based on the clicked cell's time
    console.log('Cell clicked', event);
  }
  
  function onEventClick(event) {
    // Handle existing event click
    console.log('Event clicked', event);
  }
  
  function onEventDragEnd(event) {
    // Handle the end of an event drag (move or resize)
    console.log('Event drag end', event);
  }
  
  function onCellMouseEnter(event) {
    // Optionally, handle mouse enter on cell for more interactive selections
    console.log('Mouse entered cell', event);
  }
  
  function onEventCreate(event) {
    // Handle new event creation
    console.log('Event created', event);
    events.value.push(event);
  }
  </script>
  
  <style scoped>
  .booking-calendar {
    /* Adjust the calendar styling as needed */
    height: 600px;
  }
  </style>
  