<script lang="ts">
	import Home from './Home.svelte'
	export let name: string;
</script>

<style global>
	@tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<Home {name}></Home>