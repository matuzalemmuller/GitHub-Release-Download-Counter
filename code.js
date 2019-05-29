let address = document.URL
let url = new URL(address)
let pathnameArray = url.pathname.split("/").slice(1)
let download_icon = String.fromCodePoint(0x2B07);

//-----------------------------------------------------------------------------------------------------------------------------------

var get_first_ten_releases_from_api = new Promise(function (resolve, reject) {
    let response = ""
    let request = new XMLHttpRequest();
    let downloads = []

    get_versions = 'https://api.github.com/repos' + url.pathname +
                   "?&page=1&per_page=10"
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
            var reason = new Error("Status error retrieving releases from API: "
                                   + request.status);
            reject(reason)
        }
    };
    request.open('GET', get_versions);
    request.send();
});

//-----------------------------------------------------------------------------------------------------------------------------------

function add_download_count_first_page(download) {
    let releases = document.querySelectorAll('.release-entry')

    for (i = 0, len = releases.length; i < len + 1; i++) {
        assets = releases[i]
                .getElementsByClassName('d-flex flex-justify-between py-1 \
                                        py-md-2 Box-body px-2')

        for (j = 0, len = assets.length; j < len; j++) {
            asset_size = assets[j]
                         .getElementsByClassName('text-gray flex-shrink-0')
                         .item(1).innerText
            assets[j].getElementsByClassName('text-gray flex-shrink-0')
                     .item(1).innerText = asset_size +
                                         " (" + download.shift() + " " +
                                         download_icon + ")"
        }
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

function get_release_from_api(tag){
    return new Promise(function (resolve,reject) {
        let response = ""
        let request = new XMLHttpRequest();
        let downloads = []

        get_versions = 'https://api.github.com/repos' + url.pathname +
                       "/tags/" + tag.slice(1)
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                response = JSON.parse(request.responseText);
                assets_json = response['assets']                   
                for (j = 0; j < assets_json.length; ++j) {
                    downloads.push(assets_json[j]['download_count'])
                }
                resolve(downloads)
            } else if (request.status != 200 && request.status != 0) {
                var reason = new Error("Status error retrieving releases \
                                       from API: " + request.status);
                reject(reason)
            }
        };
        request.open('GET', get_versions);
        request.send();
    });        
}

//-----------------------------------------------------------------------------------------------------------------------------------

var get_release = function(tag, i){
    get_release_from_api(tag).then(function (fulfilled) {
        releases = document.querySelectorAll('.release-entry')

        assets = releases[i]
                .getElementsByClassName('d-flex flex-justify-between \
                                        py-1 py-md-2 Box-body px-2')
        tag = releases[i].getElementsByClassName('d-block mb-1')
              .item(0).innerText

        size = fulfilled.slice(0)
        for (j = 0; j < assets.length; j++) {
            assets[j].getElementsByClassName('text-gray flex-shrink-0')
                     .item(1).innerText += " (" + size.shift() + " " +
                     download_icon + ")"
        }
    })
        .catch(function (error) {
            console.log(error.message);
        });

}

//-----------------------------------------------------------------------------------------------------------------------------------

function next_page(){
    let releases = document.querySelectorAll('.release-entry')

    for (i = 0; i < releases.length; i++) {
        tag = releases[i].getElementsByClassName('d-block mb-1')
                         .item(0).innerText
        get_release(tag, i)
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

function tag_page(){
    console.log("tag")
}

//-----------------------------------------------------------------------------------------------------------------------------------

var first_page = function () {
    get_first_ten_releases_from_api.then(function (fulfilled) {
        add_download_count_first_page(fulfilled)
    })
        .catch(function (error) {
            console.log(error.message);
        });
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (pathnameArray[3] === "tag") {
    tag_page()
} else if (url.search === "") {
    first_page()
} else {
    next_page()
}