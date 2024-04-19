<template>
    <div>Login successful, redirecting...</div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  console.log("ttttttttttttttttttttttttttttttttttttttttttttttt");
  onMounted(() => {
    const router = useRouter();
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    
    localStorage.setItem('token', token);

    //1
  if (window.location.search.includes('token=')) {
    const token = new URLSearchParams(window.location.search).get('token');
    localStorage.setItem('token', token);
    
    //console.log("decode,")
  }
  else{
      console.error("no token!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  }

  //2
  if (window.location.search.includes('token2=')) {
    const token2 = new URLSearchParams(window.location.search).get('token2');
    localStorage.setItem('token2', token2);
    console.log(token2);
    //console.log("decode,")
  }
  else{
      console.error("no token!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  }


    if (token) {
     // localStorage.setItem('userToken', token);
      router.push('/profile');
    } else {
      console.error('No token found in URL query parameters.');
      //router.push('/qweView'); 
    }
  });
  </script>
  