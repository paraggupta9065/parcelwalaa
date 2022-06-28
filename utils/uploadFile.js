
var gcloud = require('gcloud');


uploadImage = async (path) => {
    var storage = gcloud.storage({
        projectId: '<projectID>',
        keyFilename: 'service-account-credentials.json'
    });

    var bucket = storage.bucket('<projectID>.appspot.com');
    console.log(bucket);
}