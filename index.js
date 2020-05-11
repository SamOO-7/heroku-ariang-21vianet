const http = require('http')
const httpProxy = require('http-proxy')
const express = require('express')
const request = require('request')
const httpsrv = require('httpsrv')
const fs = require('fs')
const SECRET = /rpc-secret=(.*)/.exec(
	fs.readFileSync('aria2c.conf', 'utf-8')
)[1]
const ENCODED_SECRET = Buffer.from(SECRET).toString('base64')

const PORT = process.env.PORT || 1234
const app = express()
const proxy = httpProxy.createProxyServer({
	target: 'ws://localhost:6800',
	ws: true
})
const server = http.createServer(app)

// Proxy websocket
server.on('upgrade', (req, socket, head) => {
	proxy.ws(req, socket, head)
})

// Handle normal http traffic
app.use('/jsonrpc', (req, res) => {
	req.pipe(request('http://localhost:6800/jsonrpc')).pipe(res)
})
app.use(
	'/downloads/' + ENCODED_SECRET,
	httpsrv({
		basedir: __dirname + '/downloads'
	})
)
app.use('/ariang', express.static(__dirname + '/ariang'))
app.get('/', (req, res) => {
	res.send(`
<title>SagiriTorrent</title>
<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/vendor/bootstrap/css/bootstrap.min.css">

<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/fonts/font-awesome-4.7.0/css/font-awesome.min.css">

<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/fonts/iconic/css/material-design-iconic-font.min.css">

<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/vendor/animate/animate.css">

<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/vendor/css-hamburgers/hamburgers.min.css">

<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/vendor/animsition/css/animsition.min.css">

<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/vendor/select2/select2.min.css">

<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/vendor/daterangepicker/daterangepicker.css">

<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/css/util.css">
<link rel="stylesheet" type="text/css" href="https://colorlib.com/etc/lf/Login_v9/css/main.css">

<body>
<div class="container-login100" style="background-image: url('https://colorlib.com/etc/lf/Login_v9/images/bg-01.jpg');">
<div class="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
<span class="login100-form-title p-b-37">
SagiriTorrent
</span>
<div class="wrap-input100 validate-input m-b-25" data-validate="Enter password">
<input class="input100" type="password" id="secret" placeholder="password">
<span class="focus-input100"></span>
</div>
<div class="container-login100-form-btn">
<button class="login100-form-btn" id="panel">
Sign In
</button>
</div>
<div class="text-center p-t-57 p-b-20">
<span class="txt1">
Contact me:
</span>
</div>
<div class="flex-c p-b-112">
<a href="https://github.com/sagirisayang" type="_new" class="login100-social-item">
<i class="fa fa-github"></i>
</a>
<a href="http://sagiri.aa.am" type="_new" class="login100-social-item">
<i class="fa fa-globe"></i>
</a>
</div>
<div class="text-center">
Forked from<a href="https://github.com/xinxin8816/heroku-ariang-21vianet" type="_new" class="txt2 hov1">
heroku-ariang21-vianet
</a>
</div>
</form>
</div>
</div>
<div id="dropDownSelect1"></div>
<script>
panel.onclick=function(){
	open('/ariang/#!/settings/rpc/set/wss/'+location.hostname+'/443/jsonrpc/'+btoa(secret.value),'_blank')
}
downloads.onclick=function(){
	open('/downloads/'+btoa(secret.value)+'/')
}
</script>
`)
})
server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

if (process.env.HEROKU_APP_NAME) {
	const readNumUpload = () =>
		new Promise((res, rej) =>
			fs.readFile('numUpload', 'utf-8', (err, text) =>
				err ? rej(err) : res(text)
			)
		)
	const APP_URL = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
	const preventIdling = () => {
		request.post(
			'http://localhost:6800/jsonrpc',
			{
				json: {
					jsonrpc: '2.0',
					method: 'aria2.getGlobalStat',
					id: 'preventIdling',
					params: [`token:${SECRET}`]
				}
			},
			async (err, resp, body) => {
				console.log('preventIdling: getGlobalStat response', body)
				const { numActive, numWaiting } = body.result
				const numUpload = await readNumUpload()
				console.log(
					'preventIdling: numbers',
					numActive,
					numWaiting,
					numUpload
				)
				if (
					parseInt(numActive) +
						parseInt(numWaiting) +
						parseInt(numUpload) >
					0
				) {
					console.log('preventIdling: make request to prevent idling')
					request(APP_URL)
				}
			}
		)
		setTimeout(preventIdling, 5 * 60 * 1000) // 5 min
	}
	preventIdling()
}
