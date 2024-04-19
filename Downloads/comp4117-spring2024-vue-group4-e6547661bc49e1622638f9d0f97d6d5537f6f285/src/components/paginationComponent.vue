<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <span class="page-link" @click.prevent="changePage(currentPage - 1)">Previous</span>
      </li>
      <li class="page-item" v-for="n in totalPages" :key="n" :class="{ active: n === currentPage }">
        <span class="page-link" @click.prevent="changePage(n)">{{ n }}</span>
      </li>
      <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
        <span class="page-link" @click.prevent="changePage(currentPage + 1)">Next</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: Number,
  totalPages: Number,
});

const emit = defineEmits(['update:currentPage']);

function changePage(page) {
  console.log("fd");
  if (page < 1 || page > props.totalPages) return;
  emit('update:currentPage', page);
}
</script>