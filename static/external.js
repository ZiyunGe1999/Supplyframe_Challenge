var pageSize = 4;
var newsData;
var progress_steps = 0;

function loadCompanyTab(event) {
    console.log('loadCompanyTab');
    var reponse_text = event.target.responseText;
    infos = JSON.parse(event.target.responseText);
    console.log(reponse_text);
    if (JSON.stringify(infos) === '{}') {
        document.getElementById('search-alert').style.display = 'block';
    }
    else {
        document.getElementById('logo').src = infos['logo'];
        document.getElementById('symbol').innerHTML = infos['ticker'];
        document.getElementById('company-name').innerHTML = infos['name'];
        document.getElementById('exchange-code').innerHTML = infos['exchange'];
        incrementProgressSteps();
    }
}

function loadPrice(event) {
    console.log('loadPrice');
    var reponse_text = event.target.responseText;
    infos = JSON.parse(event.target.responseText);
    console.log(reponse_text);
    if (infos['c'] === 0) {
        document.getElementById('search-alert').style.display = 'block';
    }
    else {
        document.getElementById('last-price').innerHTML = infos['c'];
        document.getElementById('change').innerHTML = `${infos['d']}(${infos['dp']}%)`;
        if (infos['d'] > 0) {
            document.getElementById('last-price').style.color = "green";
            document.getElementById('change').style.color = "green";
            document.getElementById('change_img').src = '/images/GreenArrowUp.png';
        } else {
            document.getElementById('last-price').style.color = "red";
            document.getElementById('change').style.color = "red";
            document.getElementById('change_img').src = '/images/RedArrowDown.png';
        }
        const date= new Date(infos['t'] * 1e3);
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        dateFormat = date.getHours() + ":" + minutes.substr(-2) + ':' + seconds.substr(-2) + " "+ date.toDateString();
        document.getElementById('timestamp').innerHTML = dateFormat;
        incrementProgressSteps();
    }
}

function loadNewsPage(page) {
    var startIndex = (page - 1) * pageSize;
    var endIndex = startIndex + pageSize;
    var newsItems = newsData.slice(startIndex, endIndex);
  
    var paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = "";
    var newsListContainer = document.getElementById("newsListContainer");
    newsListContainer.innerHTML = '';
    
    var template = document.getElementById('news-template').innerHTML;
    newsItems.forEach((newsItem) => {
        const listItem = document.createElement("div");
        const date= new Date(newsItem['datetime'] * 1e3);
        listItem.innerHTML = template
            .replace("{{title}}", newsItem['headline'])
            .replace("{{date}}", date.toDateString())
            .replace("{{link}}", newsItem['url']);
        newsListContainer.appendChild(listItem);
    });
    generatePagination(page);
}
  
function generatePagination(page) {
    var totalNews = infos.length;
    var totalPages = Math.ceil(totalNews / pageSize);
    var paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = "";
    for (var i = 1; i <= totalPages; i++) {
        var listItem = document.createElement("li");
        listItem.className = "page-item";
        listItem.innerHTML = `
        <a class="page-link" href="#" onclick="loadNewsPage(${i})">${i}</a>
        `;
        if (i === page) {
            listItem.classList.add("active");
        }
        paginationContainer.appendChild(listItem);
    }
}

function loadNews(event) {
    console.log('loadNews');
    var reponse_text = event.target.responseText;
    infos = JSON.parse(event.target.responseText);
    console.log(reponse_text);
    // newsData = infos
    if (JSON.stringify(infos) === '[]') {
        newsData = infos;
        document.getElementById('search-alert').style.display = 'block';
    }
    else {
        if (infos.length > 20) {
            infos.splice(20);
        }
        newsData = infos;
        loadNewsPage(1);
        incrementProgressSteps();
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

async function incrementProgressSteps() {
    progress_steps += 1;
    var process_bar_div = document.getElementById('search-progress-bar-div');
    process_bar_div.style.display = 'block';
    var all_infos_elem = document.getElementById('all-infos');
    all_infos_elem.style.display = 'none';
    var progress_bar = document.getElementById('search-progress-bar');
    progress_bar.innerHTML = `${Math.ceil(100 / 3 * progress_steps)}%`;
    progress_bar.style.width = `${100 / 3 * progress_steps}%`;
    if (progress_steps >= 3) {
        await delay(500);
        process_bar_div.style.display = 'none';
        all_infos_elem.style.display = 'block';
    }
}

function zeroProgressSteps() {
    progress_steps = 0;
    var progress_bar = document.getElementById('search-progress-bar');
    progress_bar.innerHTML = `${100 / 3 * progress_steps}%`;
    progress_bar.style.width = `${100 / 3 * progress_steps}%`;
    document.getElementById('all-infos').style.display = 'none';
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function submitSearch() {
    var token = document.getElementById('token').value;
    console.log(`submit search ${token}`);

    document.getElementById('search-alert').style.display = 'none';
    zeroProgressSteps();

    requestAPI(`/api/v1/stock/profile2?symbol=${token}`, loadCompanyTab);
    await delay(300);
    requestAPI(`/api/v1/quote?symbol=${token}`, loadPrice);
    await delay(300);

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

function takeOverFormSubmit() {
    var form = document.getElementById("search-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        submitSearch();
    });
}

window.onload = function(){
    console.log('window onload')  
    takeOverFormSubmit();  
}

module.exports = {
    transformNumber
};