export const handler = async(event) => {

    // Extract the request from the CloudFront event that is sent to Lambda@Edge 
    var request = event.Records[0].cf.request;
    var uri = request.uri;

    // If URI doesn't end with a slash and doesn't look like a file (no extension), redirect to add trailing slash
    if (!uri.endsWith('/') && !uri.includes('.')) {
        console.log('Redirecting to URI with trailing slash:', uri + '/');
        const response = {
            status: '301',
            statusDescription: 'Moved Permanently',
            headers: {
                location: [{
                    key: 'Location',
                    value: uri + '/'
                }]
            }
        };
        return response;
    }

    // Save the original URI for logging
    var olduri = uri;

    // Match any '/' that occurs at the end of a URI. Replace it with a default index
    var newuri = olduri.replace(/\/$/, '\/index.html');
    // for URLs you want to end without a /, do this...
    //var newuri = newuri.replace(/donate$/, 'donate\/index.html');

    if (!newuri.toLowerCase().endsWith(".html") && !newuri.toLowerCase().endsWith(".css")
                                    && !newuri.toLowerCase().endsWith(".css.map")
                                    && !newuri.toLowerCase().endsWith(".js")
                                    && !newuri.toLowerCase().endsWith(".json")
                                    && !newuri.toLowerCase().endsWith(".gif")
                                    && !newuri.toLowerCase().endsWith(".jpg")
                                    && !newuri.toLowerCase().endsWith(".jpeg")
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
    
    request.uri = newuri;
    return request;
};