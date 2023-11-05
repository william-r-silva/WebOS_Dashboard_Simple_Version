var week = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

async function buildCalendar(){
    await showCalendarHeader();

    var date = new Date();
    var monthDays = await getMonthDays(date);

    await showBlanckDaysBefore(date, monthDays);
    await showMonthDays(monthDays);
    await showBlanckDaysAfter(date, monthDays);
}

function showCalendarHeader(){
    return new Promise((resolve) => {
        var calendarDiv = document.getElementById('calendar');

        for(var weekDay of week){
            var dayDiv = document.createElement('div');
            dayDiv.id = weekDay;
            dayDiv.className = weekDay; 
            dayDiv.innerText = weekDay;
            
            calendarDiv.appendChild(dayDiv);
        }
        resolve();
    })
}

function getMonthDays(selectedDate) {
    return new Promise(async (resolve) => {
        var year = selectedDate.getFullYear();
        var month = selectedDate.getMonth()+1;
        var fistDate = new Date(year, month, 1).getDate();
        var lastDate = new Date(year, month+1, 0).getDate();

        var fullMonth = month < 10 ? '0'+month : month;
    
        var monthDays = [];
        for(var i = fistDate; i <= lastDate; i++){
            var day = i < 10 ? '0'+i : i;
            var stringDay = year+'-'+fullMonth+'-'+day;
            var date = new Date(stringDay);

            monthDays.push({
                date: date,
                weekDay: week[date.getDay()],
                events: [{
                    title: 'Teste',
                    time: '20:00'
                }]
            });
        }

        resolve(monthDays);
    });
}

function showBlanckDaysBefore(currentDate, monthDays){
    return new Promise((resolve) => {
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth()+1;

        var getFistDay = week.indexOf(monthDays[0].weekDay);
        var daysCount = 0;
        for(var i = getFistDay-1; i >= 0 ; i--){
            var dayDiv = document.getElementById(week[i]);
            
            var monthDay = document.createElement('div');
            monthDay.className = 'monthDay';
            monthDay.innerText = new Date(year, month, -(daysCount)).getDate();
            daysCount++;
            
            dayDiv.appendChild(monthDay);
        }
        
        resolve();
    })
}
        
function showMonthDays(monthDays){
    return new Promise((resolve) => {
        for(var day of monthDays){
            var dayDiv = document.getElementById(day.weekDay);
    
            var monthDay = document.createElement('div');
            monthDay.className = 'monthDay';
            monthDay.innerText = day.date.getDate();
            
            dayDiv.appendChild(monthDay);
        }

        resolve();
    })
}

function showBlanckDaysAfter(currentDate, monthDays){
    return new Promise((resolve) => {
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth();
        
        var getLastDay = week.indexOf(monthDays[monthDays.length - 1].weekDay);
        var daysCount = 1;
        for(var i = getLastDay+1; i < week.length; i++){
            var dayDiv = document.getElementById(week[i]);
    
            var monthDay = document.createElement('div');
            monthDay.className = 'monthDay';
            monthDay.innerText = new Date(year, month+1, daysCount).getDate();
            daysCount++;
            
            dayDiv.appendChild(monthDay);
        }

        resolve();
    })
}
buildCalendar();