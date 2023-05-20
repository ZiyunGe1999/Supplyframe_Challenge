function loadCompanyTab(event) {
    console.log('get infos');
    var reponse_text = event.target.responseText;
    infos = JSON.parse(event.target.responseText);
    console.log(reponse_text);
    if (JSON.stringify(infos) === '{}') {

    }
    else {
        console.log(infos['logo']);
        document.getElementById('logo').src = infos['logo'];
        document.getElementById('symbol').innerHTML = infos['ticker'];
        document.getElementById('company-name').innerHTML = infos['name'];
        document.getElementById('exchange-code').innerHTML = infos['exchange'];
    }
}

function requestAPI(url, fun) {
    var XHR = new XMLHttpRequest();

    XHR.addEventListener("load", function (event) {
        fun(event);
    });

    XHR.addEventListener("error", function(event) {
        alert('something went wrong');
    });

    XHR.open("get", url, true);
    XHR.send()
}

function submitSearch() {
    var token = document.getElementById('token').value;
    console.log(`submit search ${token}`);

    requestAPI(`/api/v1/stock/profile2?symbol=${token}`, loadCompanyTab);
}

window.onload = function(){
    console.log('window onload')    
}