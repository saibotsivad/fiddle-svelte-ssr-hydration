import App from './App.svelte'

new App({
	target: document.body,
	hydrate: true,
	props: window.appData || {},
})
