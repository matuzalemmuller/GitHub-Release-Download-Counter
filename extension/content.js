const url = new URL(document.URL)
const pathnameArray = url.pathname.split("/").slice(1)
const download_icon = String.fromCodePoint(0x2B07);

//------------------------------------------------------------------------------
// Gets download count of first 10 releases from API
function get_first_ten_releases_from_api(){
    return new Promise(function (resolve, reject) {
        
        let response = ""
        let request = new XMLHttpRequest();
        let downloads = []

        let get_versions = 'https://api.github.com/repos' + url.pathname +
                        '?&page=1&per_page=10'
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
                msg = "Status error retrieving releases from API: " 
                var reason = new Error(msg + request.status);
                reject(reason)
            }
        };
        request.open('GET', get_versions);
        request.send();
    });
}

//------------------------------------------------------------------------------
// Gets download count of individual release from API
function get_release_from_api(path, tag){
    return new Promise(function (resolve,reject) {
        let response = ""
        let request = new XMLHttpRequest();
        let downloads = []

        let get_versions = 'https://api.github.com/repos' + path +
                           '/tags/' + tag
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                response = JSON.parse(request.responseText);
                assets_json = response['assets']                   
                for (j = 0; j < assets_json.length; ++j) {
                    downloads.push(assets_json[j]['download_count'])
                }
                resolve(downloads)
            } else if (request.status != 200 && request.status != 0) {
                msg = "Status error retrieving releases from API: " 
                var reason = new Error(msg + request.status);
                reject(reason)
            }
        };
        request.open('GET', get_versions);
        request.send();
    });        
}

//------------------------------------------------------------------------------
// Adds download count to assets in main releases page
function add_download_count_first_page(download) {
    let all_releases = document.querySelectorAll('.release-entry')
    let releases = []

    for (k = 0; k < all_releases.length; k++){
        if ( all_releases[k].className.localeCompare('release-entry') == 0 ){
            releases.push(all_releases[k])
        }
    }
    for (i = 0; i < releases.length; i++) {
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

//------------------------------------------------------------------------------
// Adds download count to assets to individual releases
function get_release(tag, i){
    get_release_from_api(url.pathname, tag).then(function (fulfilled) {
        let all_releases = document.querySelectorAll('.release-entry')
        let releases = []
    
        for (k = 0; k < all_releases.length; k++){
            if (all_releases[k].className.localeCompare('release-entry') == 0){
                releases.push(all_releases[k])
            }
        }

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
    }).catch(function (error) {
        console.error("GH Download Counter: " + error.message);
    });
}

//------------------------------------------------------------------------------
// Processes get and add download count to individual release in tag page 
function get_tag(tag){
    path = '/' + pathnameArray[0] +
           '/' + pathnameArray[1] +
           '/' + pathnameArray[2]
    get_release_from_api(path, tag).then(function (fulfilled) {

        assets = document
                .getElementsByClassName('d-flex flex-justify-between \
                                        py-1 py-md-2 Box-body px-2')

        download_count = fulfilled.slice(0)
        for (j = 0; j < assets.length; j++) {
            assets[j].getElementsByClassName('text-gray flex-shrink-0')
                     .item(1).innerText += " (" + download_count.shift() + " " +
                     download_icon + ")"
        }
    }).catch(function (error) {
        console.error("GH Download Counter: " + error.message);
    });
}

//------------------------------------------------------------------------------
// Processes get and add download counts to "next" releases pages
function next_page(){
    let all_releases = document.querySelectorAll('.release-entry')
    let releases = []

    for (k = 0; k < all_releases.length; k++){
        if ( all_releases[k].className.localeCompare('release-entry') == 0 ){
            releases.push(all_releases[k])
        }
    }

    for (i = 0; i < releases.length; i++) {
        if (releases[i].getElementsByClassName('d-block mb-1').item(0)){
            tag = releases[i].getElementsByClassName('d-block mb-1')
                         .item(0).innerText
            get_release(tag.slice(1), i)
        }
    }
}

//------------------------------------------------------------------------------
// Processes get and add download counts to main release page
function first_page() {
    get_first_ten_releases_from_api().then(function (fulfilled) {
        add_download_count_first_page(fulfilled)
    }).catch(function (error) {
        console.error("GH Download Counter: " + error.message);
    });
}

//------------------------------------------------------------------------------
// If repo is not private, add the download count to releases
const pvt=document.getElementsByClassName('Label Label--outline v-align-middle')

if (pvt.length == 0) {
    if (pathnameArray[3] === "tag") {
        get_tag(pathnameArray[4])
    } else if (url.search === "") {
        first_page()
    } else {
        next_page()
    }
}