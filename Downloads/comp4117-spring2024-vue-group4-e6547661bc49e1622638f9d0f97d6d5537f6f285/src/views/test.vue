<template>
  <div >
    <h1>This is an about page</h1>
  </div>
  {{ areas }}
</template>
<script setup>
import { ref ,onMounted, watch ,computed   } from 'vue'

import { areasService } from '../service/areasService'

const areas = ref([]);

onMounted(async () => {
  areas.value = await areasService.getAll();
  console.log(areas.value);
});
</script>
<style>

</style>