<script lang="ts">
import { onMount } from 'svelte';
export let name: string;

onMount(async () => {
  await test();
  console.log('onMount await test');
});

function test() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

</script>

<h1 class="text-red-600">test component: { name }</h1>
<div class="inline-flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>