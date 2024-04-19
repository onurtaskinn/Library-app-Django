<template>

  <vue-cal
    style="width: 100%;"
    :disable-views="['years', 'year', 'month', 'week']"
    active-view="day"
    :selected-date="selectedDate"
    :split-days="labels"
    :time-from="5 * 60"
    :events="updatedBookings"
    :timeFrom ="bookingForm * 60"
    :timeTo = "bookingTo * 60"
    :time-cell-height="80"
    :editable-events="{ title: false, drag: false, resize: true, delete: true, create: true }"
    :snap-to-time="60"
    sticky-split-labels
    :on-event-create="onEventCreate"
    @event-drag-create="showEventCreationDialog = true">
    >
    <template #time-cell="{ hours,minutes }">
    <div :class="{ 'vuecal__time-cell-line': true, hours: !minutes }">
      <strong v-if="!minutes" style="font-size: 15px">{{ hours }}</strong>
    </div>
  </template>
  
  </vue-cal>
  <w-dialog v-model="showEventCreationDialog" persistent maxWidth="420px">
    <w-card>
      <w-card-title>
        <w-input v-model="selectedEvent.startTime" placeholder="Start Time" />
<w-input v-model="selectedEvent.endTime" placeholder="End Time" />
      </w-card-title>
      <w-card-text>
        <w-textarea v-model="selectedEvent.content" placeholder="Requirement" />
        
        <div class="flex justify-space-between">
          <w-button @click="cancelEventCreation">Cancel</w-button>
          <w-button @click="closeCreationDialog">Save</w-button>
        </div>
      </w-card-text>
    </w-card>
  </w-dialog>
</template>

<script setup>
import { ref , computed , watch , onMounted} from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { systemParametersService } from '../service/systemParametersService';
const selectedEvent = ref(null)
const showEventCreationDialog = ref(false)

let deleteEventFunction = ref(() => {}) // Assuming it might be set dynamically


// Methods
function onEventCreate(event, qwe) {
  const NewStartTime = formatDate(event.start);
  selectedEvent.value = {
    ...selectedEvent.value, // Preserve other properties
    startTime: NewStartTime, // Capture the start time immediately
    split: event.split
    
  };
  
  // Update endTime after a delay
  setTimeout(() => {
    const NewEndTime = formatDate(event.end);
    selectedEvent.value = {
      ...selectedEvent.value, // Preserve current state, including the immediately set startTime
      endTime: NewEndTime // Delayed update for endTime
    };
    console.log("show",event);
  }, 1000); 
  
  deleteEventFunction.value = qwe; 
  
  
  return event
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: 'short', // "Mon" for Monday
    year: 'numeric', // 4 digit year
    month: 'short', // "Mar" for March
    day: 'numeric', // 2 digit day
    hour: '2-digit', // 2 digit hour
    minute: '2-digit', // 2 digit minute
    timeZone: 'Asia/Hong_Kong', // specify the timezone
    hour12: false // use 24 hour format
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}


function cancelEventCreation() {
  showEventCreationDialog.value = false
  deleteEventFunction.value()
}

function closeCreationDialog() {
  showEventCreationDialog.value = false
  
  
  router.push({
    path: '/bookings', // or path: '/details' if you prefer
    query: { startTime: selectedEvent.value.startTime, endTime: selectedEvent.value.endTime, split: selectedEvent.value.split, date: props.selectedDate }
  });
}




 

 
const props = defineProps({
  selectedDate: String,
  labels: Array,
  updatedBookings: Array
});
 
const bookingSystemParameter= ref();
const bookingForm = ref();
const bookingTo = ref();

onMounted(async () => {
  
  bookingSystemParameter.value = await systemParametersService.getByConditions({_id:"65ed9d7187c53aaf2a78506c"});
  bookingForm.value = parseInt(bookingSystemParameter.value.value1);
  bookingTo.value = parseInt(bookingSystemParameter.value.value2);

});


</script>

<style>
.booked{
  background-color: red;
}
.pending{
  background-color: rgb(255, 134, 134);

}
.approved{
  background-color: rgb(60, 179, 113);
}
</style>