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

function loadNews(event) {
    console.log('loadNews');
    var reponse_text = event.target.responseText;
    infos = JSON.parse(event.target.responseText);
    console.log(reponse_text);
    if (JSON.stringify(infos) === '{}') {

    }
    else {
        var newsList = document.getElementById("news-list");
        fetch("news_template.html")
        .then((response) => response.text())
        .then((template) => {
            infos.forEach((newsItem) => {
                const listItem = document.createElement("li");
                const date= new Date(newsItem['datetime'] * 1e3);
                listItem.innerHTML = template
                  .replace("{{title}}", newsItem['headline'])
                  .replace("{{date}}", date.toDateString())
                  .replace("{{link}}", newsItem['url']);
                newsList.appendChild(listItem.firstChild);
            });
        })
        .catch((error) => {
            console.error("Failed to load news template:", error);
        });
    }
}

function requestAPI(url, fun) {
    console.log(url);
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

function transformNumber(d) {
    if (d < 10) {
        return '0' + d
    }
    else {
        return d.toString();
    }
}

function submitSearch() {
    var token = document.getElementById('token').value;
    console.log(`submit search ${token}`);

    requestAPI(`/api/v1/stock/profile2?symbol=${token}`, loadCompanyTab);
    requestAPI(`/api/v1/quote?symbol=${token}`, loadPrice);

    var cur_time = Math.round(Date.now().valueOf());
    var seven_days_before = cur_time - (7 * 24 * 60 * 60 * 1000);
    var cur_date = new Date(cur_time);
    var before_date = new Date(seven_days_before);
    console.log(cur_date);
    console.log(before_date);
    var month = transformNumber(cur_date.getMonth() + 1);
    var cur_date_string = cur_date.getFullYear() + '-' + month + '-' + transformNumber(cur_date.getDate());
    month = transformNumber(before_date.getMonth() + 1);
    var before_date_string = before_date.getFullYear() + '-' + month + '-' + transformNumber(before_date.getDate());
    var url = '/api/v1/company-news?symbol=' + token + '&from=' + before_date_string + '&to=' + cur_date_string;
    requestAPI(url, loadNews);
}

window.onload = function(){
    console.log('window onload')    
}