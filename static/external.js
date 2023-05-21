function loadCompanyTab(event) {
    console.log('loadCompanyTab');
    var reponse_text = event.target.responseText;
    infos = JSON.parse(event.target.responseText);
    console.log(reponse_text);
    if (JSON.stringify(infos) === '{}') {

    }
    else {
        document.getElementById('logo').src = infos['logo'];
        document.getElementById('symbol').innerHTML = infos['ticker'];
        document.getElementById('company-name').innerHTML = infos['name'];
        document.getElementById('exchange-code').innerHTML = infos['exchange'];
    }
}

function loadPrice(event) {
    console.log('loadPrice');
    var reponse_text = event.target.responseText;
    infos = JSON.parse(event.target.responseText);
    console.log(reponse_text);
    if (JSON.stringify(infos) === '{}') {

    }
    else {
        document.getElementById('last-price').innerHTML = infos['c'];
        document.getElementById('change').innerHTML = `${infos['d']}(${infos['dp']}%)`;
        const date= new Date(infos['t'] * 1e3);
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        dateFormat = date.getHours() + ":" + minutes.substr(-2) + ':' + seconds.substr(-2) + " "+ date.toDateString();
        document.getElementById('timestamp').innerHTML = dateFormat;
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
    requestAPI(`/api/v1/quote?symbol=${token}`, loadPrice);
}

window.onload = function(){
    console.log('window onload')    
}