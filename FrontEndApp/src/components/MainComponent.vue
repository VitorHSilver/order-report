<script setup>
import { ref,onMounted } from 'vue'


let ipcRenderer;
onMounted(() => {
    if (typeof window !== 'undefined' && window.electron) {
        ipcRenderer = window.electron.ipcRenderer;
    } else {
     console.log('erro', error)
        console.error('ipcRenderer is not defined');
    }
});

const showSpinner = ref(false);
const quantity = ref(0)
const currentIndex = ref(0);
const itemList = ref([])

function toggleSpinner(show){
    showSpinner.value = show;
}

const itens = [
      'Carne',
      'Linguiça',
      'Frango',
      'Coracao',
      'Kafta',
      'Queijo qualho',
      'Queijo mussarela',
      'Tulipa',
      'Medalhao carne',
      'Medalhao frango',
      'Medalhao queijo',
      'Medalhao mandioca',
      'Misto',
      'Linguiça apimentada',
 ];

 async function insertName() {
    if (currentIndex.value < itens.length) {
        const item = { name: itens[currentIndex.value], quantity: quantity.value };
        itemList.value.push(item);
        if (ipcRenderer) {
            try {
                const response = await ipcRenderer.invoke('insert-data', item);
                if (!response.success) {
                    console.error('Error inserting data:', response.error);
                }
            } catch (error) {
                console.error('Error inserting data:', error);
            }
        } else {
            console.error('ipcRenderer is not defined');
        }
        currentIndex.value++;
        quantity.value = ''; // Reset the quantity input
    }
}

function reloadPage(){
     window.location.reload();
}

</script>

<template>
<!--index.html-->
     <body class="">
          <main class=" grid grid-cols-2 items-center">
               <section class="ml-4">
                    <form id="form" @submit.prevent="insertName" action="#">
                         <div clas>
                              <h1 class="text-lg text-gray-900 italic flex justify-center flex-wrap pt-10">
                                   <p class="">Insira as quantidades de espeto vendido abaixo:</p>
                              </h1>
                              <div class="text-3xl font-semibold"></div>
                              <div class="hover:border-t border-customBlue w-[32rem] my-0 mx-auto"></div>
                         </div>

                         <div class="flex flex-col mb-4">
                              <div class="flex mt-8 mb-8 justify-around">
                                   <label id="input-insert" for="input-insert" class="text-3xl font-semibold truncate"
                                        > {{ currentIndex < itens.length ? itens[currentIndex] : 'Todos os itens já foram adicionados' }}</label
                                   >
                                   <input
                                        class="w-20 rounded-md text-center default:ring-1 border border-black"
                                        type="number"
                                        v-model="quantity"
                                        :disabled="currentIndex >= itens.length"
                                   />
                              </div>
                              <div class="flex justify-evenly">
                                   <button
                                        id="submitButton"
                                        type="submit"
                                        class="bg-success uppercase  text-white text-base px-4 p-3 rounded-md flex items-center gap-2 transition ease-in hover:scale-110 hover:bg-green-950 duration-150 shadow-md"
                                        @click="toggleSpinner(true); "
                                   >
                                        Gravar
                                        <span
                                             id="loadingSpinner"
                                             :class="{'hidden': showSpinner, 'animate-spin': showSpinner}"
                                             class="hidden size-4 rounded-full border-4 border-white border-r-transparent animate-spin"

                                        >
                                        </span>
                                   </button>
                                   <button
                                   id="buttonReset"
                                        type="reset"
                                        class="bg-update uppercase text-gray-100 text-base px-4 rounded-md transition ease-in hover:scale-110 hover:bg-blue-900 duration-150 shadow-md"
                                        @click="reloadPage"
                                   >
                                        Limpar
                                   </button>
                                   <span id="error" class="hidden"></span>
                              </div>
                         </div>
                    </form>
               </section>
               <!-- Mostrar os ultimos dados inseridos no banco -->
               <section class="justify-center items-center">
                    <div class="flex justify-center">
                         <div class="m-4 w-full bg-white border border-blue-800 shadow-2xl rounded-lg p-2">
                              <h1 class="flex justify-center font-semibold text-2xl w-full mb-2">
                                   Dados recentemente inseridos!
                              </h1>
                              <ul id="itemList" class="grid grid-cols-4 gap-2 justify-around items-start h-96">
                                  <li class="grid grid-flow-col-4  "
                                   v-for="(item, index) in itemList" :key="index">{{ item.name }}: {{ item.quantity }}</li>
                              </ul>
                         </div>
                    </div>
               </section>
          </main>
     </body>
</template>

<style scoped>
#submitButton{
    background-color: #125029;
}

</style>