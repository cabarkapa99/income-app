const getCurrentDayMonthYear = function(){

    const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];

    const date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let day = date.getDate();
    let numberOfDays = new Date(year, month, 0).getDate();
    const monthName = months[month - 1]; 

    const godinaInput = document.getElementById('godina');
    godinaInput.value = year;

    const mesecInput = document.getElementById('mesec');
    mesecInput.selectedIndex = month-1;
    
    const danInput = document.getElementById('dan');
    for(let i=1; i<=numberOfDays; i++){
        let option = document.createElement('option');
        let optionText = document.createTextNode(`${i}`);
        option.appendChild(optionText);
        danInput.appendChild(option);
    }

    danInput.selectedIndex = day-1;

        // Add event listeners to the month and year inputs
        godinaInput.addEventListener('change', function() {
            year = parseInt(this.value);
            numberOfDays = new Date(year, month, 0).getDate();
            updateDayOptions();
        });
    
        mesecInput.addEventListener('change', function() {
            month = this.selectedIndex + 1;
            numberOfDays = new Date(year, month, 0).getDate();
            updateDayOptions();
        });
    
        // Function to update the day options
        function updateDayOptions() {
            // Clear the existing options
            while (danInput.firstChild) {
                danInput.removeChild(danInput.firstChild);
            }
    
            // Add the new options
            for(let i=1; i<=numberOfDays; i++){
                let option = document.createElement('option');
                let optionText = document.createTextNode(`${i}`);
                option.appendChild(optionText);
                danInput.appendChild(option);
            }
        }
}

getCurrentDayMonthYear();

const unesiPrihod = async function(){

    let data;

    const unesiBtn = document.getElementById('unesi-podatke');
    const prihod = document.getElementById('prihod');
    const dan = document.getElementById('dan');
    const mesec = document.getElementById('mesec');
    const godina = document.getElementById('godina');
    const checkout = document.getElementById('checkout');
    const chckH3 = document.querySelector('#checkout h3');
    const neBtn = document.querySelector('#checkout #ne-btn');
    const daBtn = document.querySelector('#checkout #da-btn');

    unesiBtn.addEventListener('click', ()=>{
        let datum = dan.value + '.' + mesec.value + '.' + godina.value;
        data = {
            datum: datum,
            prihod: prihod.value,
        }
        chckH3.innerText = `${data.prihod} hiljada, ${data.datum} ?`;
        checkout.classList.toggle('hide');
    })
    neBtn.addEventListener('click', ()=>{
        checkout.classList.toggle('hide');
    })
    daBtn.addEventListener('click', posalji);
    function posalji(){
        daBtn.removeEventListener('click', posalji);
        let url = '/prihodi/dodaj';
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.addEventListener('load', function(){
            if(xhr.status === 200){
                window.location.reload();
            }else{
                chckH3.innerText = "Doslo je do greske! Probajte ponovo."
            }
        })
        xhr.addEventListener('error', ()=>{
            chckH3.innerText = "Doslo je do greske! Probajte ponovo."
        })
        xhr.send(JSON.stringify(data));
    }
}
unesiPrihod();

const dohvatiPodatke = async function(){
    let res = await fetch('/prihodi/dohvati');
    let data = await res.json();
    return data;
}
function prihodZaTekucuKalendarskuGodinu(prihodi){
    const date = new Date();
    const year = date.getFullYear();

    let ukupniPrihod = 0;

    for(const prihod of prihodi){
        let godina = Number.parseInt(prihod.datum.split('.')[2]);
        if(godina === year){
            ukupniPrihod += Number.parseFloat(prihod.prihod);
        }
    }

    // Load google charts
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    // Draw the chart and set the chart values
    function drawChart() {
    var data = google.visualization.arrayToDataTable([
    ['Budget', 'Amount', { role: 'style' }],
    ['primljeno', ukupniPrihod, 'color: #FF6961'],
    ['moze jos da se primi', 6000-ukupniPrihod, 'color: #77DD77'],
    ]);

    // Optional; add a title and set the width and height of the chart
    var options = {
                    'title':'* izrazeno u hiljadama',
                    'colors': ['#FF6961', '#77DD77']
                  };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('6mil-chart'));
    chart.draw(data, options);
    }

}
function prihodiZaPoslednjihGodinuDana(prihodi){    
    let date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    let danasnjiDatum = day + '.' + month + '.' + year;
    let datumPreGodinuDana = day + '.' + month + '.' + (year-1);
    
    let ukupniPrihod = 0;

    for(const prihod of prihodi){ 
        if(uporediDvaDatuma(prihod.datum, datumPreGodinuDana) && uporediDvaDatuma(danasnjiDatum, prihod.datum)){
            ukupniPrihod += Number.parseFloat(prihod.prihod);
        }
    }

        // Load google charts
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
    
        // Draw the chart and set the chart values
        function drawChart() {
        var data = google.visualization.arrayToDataTable([
        ['Budget', 'Amount'],
        ['primljeno', ukupniPrihod],
        ['moze jos da se primi', 8000-ukupniPrihod],
        ]);
    
        // Optional; add a title and set the width and height of the chart
        var options = {
            'title':'* izrazeno u hiljadama',
            'colors': ['#FF6961', '#77DD77']
        };
    
        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('8mil-chart'));
        chart.draw(data, options);
        }

}
function uporediDvaDatuma(a, b){
    let nizA = a.split('.');
    let danA = Number.parseInt(nizA[0]);
    let mesecA = Number.parseInt(nizA[1]);
    let godinaA = Number.parseInt(nizA[2]);

    let nizB = b.split('.');
    let danB = Number.parseInt(nizB[0]);
    let mesecB = Number.parseInt(nizB[1]);
    let godinaB = Number.parseInt(nizB[2]);

    if(godinaA > godinaB){
        return true;
    }else if(godinaA < godinaB){
        return false;
    }else if(mesecA > mesecB){
        return true;
    }else if(mesecA < mesecB){
        return false;
    }else if(danA < danB){
        return false;
    }else{
        return true;
    }
}
function prikaziPrihode(prihodi){
    const bodyTable = document.getElementById('data-body');
    for(const prihod of prihodi){
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td1Text = document.createTextNode(prihod.datum);
        td1.appendChild(td1Text);
        tr.appendChild(td1);
        let td2 = document.createElement('td');
        let prihodNum = Number.parseFloat(prihod.prihod) * 1000;
        let td2Text = document.createTextNode(prihodNum);
        td2.appendChild(td2Text);
        tr.appendChild(td2);
        bodyTable.appendChild(tr);
    }
}
const prikaziPodatke = async function(){
    let prihodi = await dohvatiPodatke();
    console.log(prihodi)
    prihodZaTekucuKalendarskuGodinu(prihodi);
    prihodiZaPoslednjihGodinuDana(prihodi);
    prikaziPrihode(prihodi);
}
prikaziPodatke();

function prikazKartica(){
    const unosBtn = document.getElementById('btn-unos');
    const prikazBtn = document.getElementById('btn-prikaz');
    const prihodBtn = document.getElementById('btn-podaci');
    const inputContainer = document.getElementById('input-container');
    const displayContainer = document.getElementById('display-container');
    const prihodContainer = document.getElementById('data-container');

    unosBtn.addEventListener('click', ()=>{
        displayContainer.classList.add('hide');
        prihodContainer.classList.add('hide');
        inputContainer.classList.remove('hide');
    })
    prikazBtn.addEventListener('click', ()=>{
        inputContainer.classList.add('hide');
        prihodContainer.classList.add('hide');
        displayContainer.classList.remove('hide');
    })
    prihodBtn.addEventListener('click', ()=>{
        inputContainer.classList.add('hide');
        displayContainer.classList.add('hide');
        prihodContainer.classList.remove('hide');
    })
}
prikazKartica();