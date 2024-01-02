<script>
	import { onMount } from 'svelte'
	import Toggle from './Toggle.svelte'
	export let active = false
	export let now = 0
	onMount(() => {
		const interval = setInterval(() => {
			now = Date.now()
		}, 1000)
		return () => clearInterval(interval)
	})
</script>

<h1>App time is <em>{now}</em></h1>

<Toggle bind:isOn={active} />

<button on:click={() => active = !active}>Toggle!</button>
