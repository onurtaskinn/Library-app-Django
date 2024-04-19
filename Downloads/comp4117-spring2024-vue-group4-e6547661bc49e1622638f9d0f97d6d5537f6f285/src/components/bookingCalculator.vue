<template>
  <vue-cal
    xsmall
      :time="false"
      hide-view-selector
      :transitions="false"
      today-button
      :disable-days="arrayHolidays"
      :selected-date="internalSelectedDate"
      active-view="month"
      hide-weekends
      :disable-views="['years', 'year', 'week', 'day']"
      :min-date="minDate"

      @cell-focus="updateDate"
      @cell-click="updateDate"
      class="vuecal--date-picker"
      style="width: 200px;height: 200px">
  </vue-cal>
</template>



<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { useRouter } from 'vue-router';
import { holidayService } from '../service/holidayService';
import { systemParametersService } from '../service/systemParametersService';

const emit = defineEmits(['update:selectedDate']);
const holidays = ref([]);
const arrayHolidays = ref([]);
const internalSelectedDate = ref(setDefaultDate());
const router = useRouter();



onMounted(async () => {



  holidays.value = await holidayService.getAll();
  arrayHolidays.value = extractHolidayDates(holidays.value);
  internalSelectedDate.value = setDefaultDate();
  emit('update:selectedDate', internalSelectedDate.value);

  // router.push({
    
  //   query: {  }
  // });
});

const minDate = setDefaultDate();



function setDefaultDate() {
  let today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000; // Convert offset to milliseconds
  
  // Function to check if the date is a holiday
  function isHoliday(date) {

    const dateString = new Date(date - timezoneOffset).toISOString().slice(0, 10);
    return arrayHolidays.value.includes(dateString);
  }
  
  // Ensure the date is not a weekend or a holiday
  while (today.getDay() === 0 || today.getDay() === 6 || isHoliday(today)) {
    today.setDate(today.getDate() + 1); // Move to the next day
  }
  console.log("Default non-holiday weekday is ", today.toISOString().slice(0, 10));

  return new Date(today - timezoneOffset).toISOString().slice(0, 10);
}
function updateDate(date) {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000; // convert offset to milliseconds
  internalSelectedDate.value = new Date(date - timezoneOffset).toISOString().slice(0, 10);
  emit('update:selectedDate', new Date(date - timezoneOffset).toISOString().slice(0, 10));
}

function extractHolidayDates(holidays) {
  return holidays.map(holiday => holiday.date);
}

watch(() => internalSelectedDate.value, (newVal) => {
  emit('update:selectedDate', newVal);
});
</script>
<style>
</style>