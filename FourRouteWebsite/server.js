var http = require('http')
var fs = require('fs')

var PORT = 8080

var server = http.createServer(handleRequest)

// Start our server
server.listen(PORT, function () {
  // Callback triggered when server is successfully listening. Hurray!
  console.log('Server listening on: http://localhost:' + PORT)
})

// Create a function which handles incoming requests and sends responses
function handleRequest (req, res) {

  // Capture the url the request is made to
  var path = req.url

  if (path === '/') {
    path = '/index.html'
  }

  if (path.indexOf('.html') < 0) {
    path += '.html'
  }


  fs.readFile(__dirname + path , function (err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'})
      return res.end('404 - Not Found')
    }
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(data)
  })
}
