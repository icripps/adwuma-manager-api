var http = require("https");

var options = {
    "method": "POST",
    "hostname": "api.pepipost.com",
    "port": null,
    "path": "/v5/mail/send",
    "headers": {
        "api_key": "0c4708615bf45ad69d5bf44d7d189dad",
        "content-type": "application/json"
    }
};

var req = http.request(options, function(res) {
    var chunks = [];

    res.on("data", function(chunk) {
        chunks.push(chunk);
    });

    res.on("end", function() {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

req.write(JSON.stringify({
    from: { email: 'ikedacrippso@pepisandbox.com', name: 'ikedacrippso' },
    subject: 'Your Barcelona flight e-ticket : BCN2118050657714',
    content: [{ type: 'html', value: 'Hello Lionel, Your flight for Barcelona is confirmed.' }],
    personalizations: [{ to: [{ email: 'ikedacrippso@hotmail.com', name: 'Lionel Messi' }] }]
}));
req.end();