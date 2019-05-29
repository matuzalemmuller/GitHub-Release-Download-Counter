let address = document.URL
let url = new URL(address)
let pathnameArray = url.pathname.split("/").slice(1)
pathnameArray.push(url.search)

//-----------------------------------------------------------------------------------------------------------------------------------

var get_first_page = new Promise(function (resolve, reject) {
    let response = ""
    let request = new XMLHttpRequest();
    let downloads = []

    get_versions = 'https://api.github.com/repos' + url.pathname + "?&page=1&per_page=10"
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            response = JSON.parse(request.responseText);
            for (i = 0; i < response.length; ++i) {
                version = response[i]['name']
                assets_json = response[i]['assets']
                for (j = 0; j < assets_json.length; ++j) {
                    downloads.push(assets_json[j]['download_count'])
                }
            }
            resolve(downloads)
        } else if (request.status != 200 && request.status != 0) {
            var reason = new Error("Status error retrieving releases from API: " + request.status);
            reject(reason)
        }
    };
    request.open('GET', get_versions);
    request.send();
});

//-----------------------------------------------------------------------------------------------------------------------------------

function change_release_list(download) {
    let releases = document.querySelectorAll('.release-entry')

    for (i = 0, len = releases.length; i < len + 1; i++) {
        assets = releases[i].getElementsByClassName('d-flex flex-justify-between py-1 py-md-2 Box-body px-2')

        for (j = 0, len = assets.length; j < len; j++) {
            asset_size = assets[j].getElementsByClassName('text-gray flex-shrink-0').item(1).innerText
            assets[j].getElementsByClassName('text-gray flex-shrink-0').item(1).innerText = asset_size + " (" + download.shift() + ")"
        }
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

var first_page = function () {
    get_first_page.then(function (fulfilled) {
        change_release_list(fulfilled)
    })
        .catch(function (error) {
            console.log(error.message);
        });
}

//-----------------------------------------------------------------------------------------------------------------------------------

function get_release_by_tag(){
    console.log("tag")
}

//-----------------------------------------------------------------------------------------------------------------------------------

function pagination(){
    console.log("page")
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (pathnameArray[3] === "tag") {
    get_release_by_tag()
} else if (pathnameArray[3] === "") {
    first_page()
} else {
    pagination()
}