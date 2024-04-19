<template>
  <div class="calendar">
    <div v-for="day in days" :key="day" class="day">
      <div class="day-label">{{ day }}</div>
      <div class="timeslots">
        <div v-for="hour in hours" :key="hour" class="timeslot" @mousedown="startSelection(day, hour)"
          @mouseup="endSelection(day, hour)" @mouseenter="onMouseEnter(day, hour)"
          :class="{ 'selected': isTimeslotSelected(day, hour) }">
          {{ hour }}:00
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours
const selectionStart = ref(null);
const selectionEnd = ref(null);

function startSelection(day, hour) {
  selectionStart.value = { day, hour };
}

function endSelection(day, hour) {
  if (selectionStart.value) {
    selectionEnd.value = { day, hour };
    emitSelection();
    resetSelection();
  }
}

function onMouseEnter(day, hour) {
  if (selectionStart.value) {
    selectionEnd.value = { day, hour };
  }
}

function isTimeslotSelected(day, hour) {
  if (!selectionStart.value || !selectionEnd.value) return false;

  const startIndex = days.indexOf(selectionStart.value.day) * 24 + selectionStart.value.hour;
  const endIndex = days.indexOf(selectionEnd.value.day) * 24 + selectionEnd.value.hour;
  const currentIndex = days.indexOf(day) * 24 + hour;

  return currentIndex >= startIndex && currentIndex <= endIndex;
}

function emitSelection() {
  if (!selectionStart.value || !selectionEnd.value) return;

  // Emit the start and end times of the selection
  this.$emit('selectTimeslot', {
    start: `${selectionStart.value.day} at ${selectionStart.value.hour}:00`,
    end: `${selectionEnd.value.day} at ${selectionEnd.value.hour}:00`
  });
}

function resetSelection() {
  selectionStart.value = null;
  selectionEnd.value = null;
}
</script>

<style scoped>
.calendar {
  display: flex;
  user-select: none;
}

.day {
  flex: 1;
  border-right: 1px solid #ddd;
}

.day-label {
  text-align: center;
  background-color: #f0f0f0;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.timeslots {
  display: flex;
  flex-direction: column;
}

.timeslot {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.timeslot.selected {
  background-color: #bde4ff;
}
</style>