var requestDelayDiv;
var dateDiv;
var clockDiv;

var reloadInterval;

var defaultPort = 3000;

var isLocked = false;

var requestMaxDelay = 5;
var requestDelayCount = requestMaxDelay;
var retryTimes = 1;

function setRetryFisrtRequest(){
    retryTimes = 1;
}
function setRequestNoDelay(){
    requestDelayCount = 0;
}

function updateClock(dateTime){
    var hours = dateTime.getHours();
    hours = hours < 10 ? ("0"+hours) : hours; 
    var minutes = dateTime.getMinutes();
    minutes = minutes < 10 ? ("0"+minutes) : minutes; 
    var time = hours+":"+minutes;
    clockDiv.innerHTML = time;
}
function updateDate(dateTime){
    var day = dateTime.getDate();
    day = day < 10 ? ("0"+day) : day; 
    var month = (dateTime.getMonth()+1);
    month = month < 10 ? ("0"+month) : month; 
    var year = dateTime.getFullYear();
    var date =  day+"/"+month+"/"+year;
    dateDiv.innerHTML = date;
}

function updateRequestDelay(){
    requestDelayDiv.innerHTML = "Atualizando em "+requestDelayCount+"s";
}

function changeConnetionStatus(isConnected){
    if(isConnected){
        document.documentElement.style.setProperty('--hostStatus', 'var(--green)');
    }else{
        document.documentElement.style.setProperty('--hostStatus', 'var(--red)');
    }
}

function showError(){
    var content = document.getElementById("content");
    var connectionErrorDiv = document.createElement("div");
    connectionErrorDiv.id = "content";
    connectionErrorDiv.style.display = 'flex';
    connectionErrorDiv.style.flexDirection = 'column';
    connectionErrorDiv.style.justifyContent = 'center';
    connectionErrorDiv.style.alignItems = 'center';

    var errorMensage = document.createElement("h1");
    errorMensage.textContent = "Não foi possível conectar ao servidor!\n"
    var retryContMensage = document.createElement("h2");
    retryContMensage.textContent = "Tentativa "+retryTimes+" de 3.";

    connectionErrorDiv.appendChild(errorMensage);
    connectionErrorDiv.appendChild(retryContMensage);

    content.parentNode.replaceChild(connectionErrorDiv, content);
}

function buildView({view, script}){
    var content = document.getElementById("content");
    var dashboardView = document.createElement("div");
    dashboardView.id = "content";
    dashboardView.innerHTML = view;
    
    var dashboardScript = document.createElement("script");
    dashboardScript.innerHTML = script;

    dashboardView.appendChild(dashboardScript);
    content.parentNode.replaceChild(dashboardView, content);
}

function requestHost(){
    if(isLocked) return;
    isLocked = true;

    var hostIp = document.getElementById("hostIp");
    var host = hostIp.value.replace(/^https?:\/\//, '').replace(/^http?:\/\//, '');

    var addressSplited = host.split(":");
    if(addressSplited[1] == null || addressSplited[1] == undefined){
        addressSplited.push(defaultPort);
    }else if (addressSplited[1] == ""){
        addressSplited[1] = defaultPort;
    }

    var address = addressSplited.join(":");
    hostIp.value = address;

    fetch('http://'+address+'/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na solicitação: ' + response.status);
            }
            return response.json();
        })
        .then(connectionSuccess)
        .catch(connectionError)
        .finally(afterRequestFinish);
}

// Modificar aqui

function connectionError(error){
    changeConnetionStatus(false);
    showError();
    retryTimes += 1;
}

function connectionSuccess(data){
    setRetryFisrtRequest();
    changeConnetionStatus(true);
    buildView(data);
}

function afterRequestFinish(){
    isLocked = false;
    requestDelayCount = requestMaxDelay;
    connectOnHost()
}

function connectOnHost(){
    if(retryTimes > 3) return;
    
    if(requestDelayCount <= 0){
        requestHost();
        return;
    }

    requestDelayCount -= 1;
    setTimeout(() => {
        connectOnHost();
    }, 1000)
    
}

function tryConnect(){
    setRetryFisrtRequest();
    setRequestNoDelay();
    connectOnHost();
}

function onTryConnectPress(){
    tryConnect();
}

function start(){
    setInterval(() => {
        var dateTime = new Date();
        updateClock(dateTime);
        updateDate(dateTime);
        updateRequestDelay()
    }, 100)

    tryConnect();
}

document.addEventListener(
    "webOSLaunch",
    function (inData) {
        requestDelayDiv = document.getElementById("requestDelay");
        dateDiv = document.getElementById("date");
        clockDiv = document.getElementById("clock");

        start();
    },
    true
);