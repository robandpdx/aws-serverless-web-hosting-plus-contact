'use strict';
exports.handler = (event, context, callback) => {
    
    // Extract the request from the CloudFront event that is sent to Lambda@Edge 
    var request = event.Records[0].cf.request;

    // Extract the URI from the request
    var olduri = request.uri;

    // Match any '/' that occurs at the end of a URI. Replace it with a default index
    var newuri = olduri.replace(/\/$/, '\/index.html');
    // for URLs you want to end without a /, do this...
    //var newuri = newuri.replace(/donate$/, 'donate\/index.html');
    
    if (!newuri.toLowerCase().endsWith(".html") && !newuri.toLowerCase().endsWith(".css")
                                    && !newuri.toLowerCase().endsWith(".js")
                                    && !newuri.toLowerCase().endsWith(".json")
                                    && !newuri.toLowerCase().endsWith(".jpg")
                                    && !newuri.toLowerCase().endsWith(".png")
                                    && !newuri.toLowerCase().endsWith(".svg")
                                    && !newuri.toLowerCase().endsWith(".ico")
                                    && !newuri.toLowerCase().includes(".woff")
                                    && !newuri.toLowerCase().includes(".ttf")
                                    && !newuri.toLowerCase().includes(".txt")
                                    && !newuri.toLowerCase().includes(".xml")
                                    && !newuri.includes("?")) {
        console.log("Adding .html to newuri");
        newuri = newuri + ".html";
    }
    
    // Log the URI as received by CloudFront and the new URI to be used to fetch from origin
    console.log("Old URI: " + olduri);
    console.log("New URI: " + newuri);
    
    // Replace the received URI with the URI that includes the index page
    request.uri = newuri;
    
    // Return to CloudFront
    return callback(null, request);

};
