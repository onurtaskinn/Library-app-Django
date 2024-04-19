
<template>
    <HeaderComponent />
    <div class="container mt-4">
        <h2 class="mb-4">System Parameters</h2>
        <div class="toolBar"></div>
        <div class="card" style=" text-align: left; padding:1%; ">
            <div class="card-body" >
                <form>
                    <div v-for="systemParameter in systemParameters" :key="systemParameter._id"> 
                        <div style="font-size: large;">{{systemParameter.name}} ( {{systemParameter.description}} )</div>
                            <div class="form-group row">

                                    <label class="col-sm-2 col-form-label">{{systemParameter.description1}}</label>
                                    <div class="col-sm-10">
                                        <input :type=systemParameter.type1  class="form-control row" id=""  v-model="systemParameter.value1">
                                    </div>

                                    <label v-if="systemParameter.description2"  class="col-sm-2 col-form-label">{{systemParameter.description2}}</label>
                                    <div v-if="systemParameter.description2"  class="col-sm-10">
                                        <input v-if="systemParameter.description2"  type="text"  class="form-control row" id="" v-model="systemParameter.value2">
                                    </div>
                            </div>
                    </div>
                    <div class="buttonBar" style="float: right;padding-right: 5%;">
                        <a class="btn-submit" @click="submitForm">Submit</a>
                    </div>
                </form>

</div>
        </div>
    </div>
</template>


<script setup>
import { ref ,onMounted, watch ,computed   } from 'vue'
import { systemParametersService } from '../service/systemParametersService'
import HeaderComponent from '../components/TheHeader.vue';

const systemParameters = ref([]);

onMounted(async () => {
systemParameters.value = await systemParametersService.getAll();

});


const submitForm = async () => {
  let allFieldsFilled = true;
  console.log("parameter", systemParameters);

  for (let parameter of systemParameters.value) {
    if ((parameter.value1 == null || parameter.value1 == '') || (!parameter.value2 && parameter.description2 != '') ) { 
      allFieldsFilled = false;
      if(!parameter.value1 && parameter.description1 != ''){
        alert("Please Fill " , parameter.description1 , " Record in " , parameter.name)
        break;
      }

      if(!parameter.value2 &&  parameter.description2 !=''){
        alert("Please Fill " , parameter.description2 , " Record in " , parameter.name)
        break;
      }
      
    }
  }

  if (allFieldsFilled) {
    try {
        await systemParametersService.update(systemParameters.value);
      alert('updated');
    } catch (error) {
      console.error('update fail:', error);
      alert('update fail:');
    }
  } else {
    alert('');
  }
};

</script>
<style>
.row{ 
  margin: 2%;
}

.btn-submit {
  cursor: pointer;
  background-color: #007bff; 
  border: 1px solid #007bff; 
  color: white; 
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  border-radius: 12px;
}

.btn-submit:hover {
  background-color: white; 
  color: black;
  border: 1px solid #007bff;
}

</style>