<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
//import { v4 as uuidv4 } from 'uuid';

//  location.assign('https://hkbu.jp.auth0.com/authorize?response_type=code&client_id=dxiOZbTWeGFhW4ScsQrV6rpR1IWO8VJw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback')

const credentials = ref({
    studentNum: '',
    password: ''
});
const router = useRouter();

const login = async () => {
    try {
        // fetch
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials.value)
        });

        // response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        // save token to local storage
        localStorage.setItem('token', data.token);

        //login.apply()
        router.push('/management')
    } catch (error) {
        alert(error);
    }
}
</script>
<template>
    <div class="container">
        <div class="square"></div>
        <div class="login-container">
            <form @submit.prevent="login">
                <h2 class="text-center mb-4">Login</h2>

                <!-- <div class="mb-3">
                    <label>Email </label>
                    <input type="text" class="form-control form-control-lg" v-model="credentials.email"
                        placeholder="Email">
                </div>
                <div class="mb-3">
                    <label>Password </label>
                    <input type="password" class="form-control form-control-lg" v-model="credentials.password"
                        placeholder="Password">
                </div> -->
                <div class="center">
                    <a href="https://hkbu.jp.auth0.com/authorize?response_type=code&client_id=dxiOZbTWeGFhW4ScsQrV6rpR1IWO8VJw&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback" class="btn btn-dark btn-lg btn-block">Login</a>
                </div>
            </form>
        </div>
    </div>
</template>

<style>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.square {
    position: absolute;
    width: 500px;
    height: 400px;
    background-color: #eeeeee;
    border-radius: 15px;
    z-index: -1;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.login-container {
    width: 300px;
}

.center{
    text-align: center;
}
</style>