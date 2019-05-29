let address = document.URL
let url = new URL(address)
let pathnameArray = url.pathname.split("/").slice(1)
pathnameArray.push(url.search)

//-----------------------------------------------------------------------------------------------------------------------------------

var get_release_list_from_api = new Promise( function (resolve) {
    let response = ""
    let request = new XMLHttpRequest();
    var downloads = []
    get_versions = 'https://api.github.com/repos' + url.pathname + "?&page=1&per_page=10"
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            response = JSON.parse(request.responseText);
            for (i = 0; i < response.length; ++i) {
                version = response[i]['name']
                assets_json = response[i]['assets']
                for (j = 0; j < assets_json.length; ++j) {
                    entry = assets_json[j];
                    build = {
                        'version' : version,
                        'name': assets_json[j]['name'] ,
                        'download': assets_json[j]['download_count']
                    }
                    downloads.push(build)
                }
            }
            resolve(downloads)
        }
    };
    request.open('GET', get_versions);
    request.send();
}
);

//-----------------------------------------------------------------------------------------------------------------------------------

function get_release_list_from_page(){
    let versions = []
    let releases = document.querySelectorAll('.release-entry')

    for (i = 0, len = releases.length; i < len+1; i++) {
        assets = releases[i].getElementsByClassName('d-flex flex-justify-between py-1 py-md-2 Box-body px-2')
        version = releases[i].getElementsByClassName('d-block mb-1').item(0).innerText.substr(1)

        for (j = 0, len = assets.length; j < len; j++) {
            asset_name = assets[j].getElementsByClassName('pl-2 flex-auto min-width-0 text-bold').item(0).innerText
            asset_size = assets[j].getElementsByClassName('text-gray flex-shrink-0').item(1).innerText
            app = {
                'version' : version,
                'asset_name': asset_name,
                'asset_size': asset_size
            }
            versions.push(app)
        }
    }

    return versions
}

//-----------------------------------------------------------------------------------------------------------------------------------

function add_download_multi_releases(){
    
}

//-----------------------------------------------------------------------------------------------------------------------------------

var add_download_field = function(website_versions) {
    get_release_list_from_api.then(function (fulfilled){
        downloads = fulfilled
        for (i = 0; i < website_versions.length; i++){
            website_versions[i].asset_size = website_versions[i].asset_size + " (" + downloads[i].download + ")"
        }
        console.log(website_versions)

        add_download_multi_releases(website_versions)
    })
    .catch(function () {
        console.log("Error");
    });
}

if (pathnameArray[3] === "") {

    website_versions = get_release_list_from_page()
    add_download_field(website_versions)
    
} else if (pathnameArray[3] === "tag") {
    get_release_by_tag()
} else {
    get_release_list_after()
}