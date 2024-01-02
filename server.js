import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'

const HOSTNAME = '127.0.0.1'
const PORT = 3000

// This root template is a simple HTML wrapper, it could just as well
// be a function that you call.
const TEMPLATE = await readFile('./index.html', 'utf8')

// This is the SSR part that uses the server-bundled code to generate
// the static HTML with pre-set state. You'd bundle it in your server code.
import App from './build/server.js'

// For the generated HTML, load all the data you need. You need it
// to generate the view and also to pass back to rehydrate the application.
const loadData = async (req) => {
	return { now: Date.now(), active: Math.random() > 0.5 }
}

const buildPage = (req, data) => {
}

const server = createServer((req, res) => {
	if (req.url === '/client.js') {
		readFile('./build/client.js', 'utf8').then(string => {
			res.statusCode = 200
			res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
			res.end(string)
		})
	} else {
		loadData(req).then(data => {
			res.statusCode = 200
			res.setHeader('Content-Type', 'text/html')
			// We generate the output HTML based on the loaded data
			const { html, css, head } = App.render(data)
			const out = TEMPLATE
				// Here we do some simple search/replace, but we
				// would probably instead have some function to
				// wrap all this up cleaner.
				.replace("'%%data%%'", JSON.stringify(data))
				.replace('<!--%%body%%-->', html)
				.replace('<!--%%head%%-->', [
					`<style>${css?.code || ''}</style>`,
					head,
				].filter(Boolean).join('\n'))
			// And then pipe it out.
			res.end(out)
		})
	}
})

server.listen(PORT, HOSTNAME, () => {
	console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})
