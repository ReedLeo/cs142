'use strict';

class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
    }

    static getMonthName(month) {
        const monthsName = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthsName[month];
    }

    static isLeapYear(year) {
        return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
    }

    static getDaysOfMonth(year, month) {
        const daysInMonths = [
            [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // common year
            [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // leap year
        ];
        const isLeap = DatePicker.isLeapYear(year) ? 1 : 0;
        return daysInMonths[isLeap][month];
    }

    static getPrevOrNextMonDays(date, type) {
        const curYear = date.getFullYear();
        const curMonth = date.getMonth();
        if (type === 'prev') {
            const prevMonth = (curMonth === 0) ? 11 : (curMonth - 1);
            const prevYear = (prevMonth === 11) ? (curYear - 1) : curYear;
            return {
                year: prevYear,
                month: prevMonth,
                days: DatePicker.getDaysOfMonth(prevYear, prevMonth)
            };
        } else {
            const nextMonth = (curMonth === 11) ? 0 : (curMonth + 1);
            const nextYear = (nextMonth === 0) ? (curYear + 1) : curYear;
            return {
                year: nextYear,
                month: nextMonth,
                days: DatePicker.getDaysOfMonth(nextYear, nextMonth)
            };
        }
    }

    static generateCalendar(date) {
        const curYear = date.getFullYear();
        const curMonth = date.getMonth(); // 0-11
        const curMonDays = DatePicker.getDaysOfMonth(curYear, curMonth);
        const { year: prevYear, month: prevMon, days: prevMonDays } = DatePicker.getPrevOrNextMonDays(date, 'prev');
        const { year: nextYear, month: nextMon } = DatePicker.getPrevOrNextMonDays(date, 'next');
        const fisrtDayInWeekOfCurMon = new Date(`${curYear}/${curMonth + 1}/1`).getDay();
        const lastDayInWeekOfCurMon = new Date(`${curYear}/${curMonth + 1}/${curMonDays}`).getDay();

        // number of previous month's days to fill.
        const numOfPrefixDays = fisrtDayInWeekOfCurMon;

        // number of next month's days to fill.
        const numOfPostfixDays = 6 - lastDayInWeekOfCurMon;

        const fullCalendar = [];

        // fill the previous month's days.
        for (let i = 0; i < numOfPrefixDays; ++i) {
            fullCalendar.push({
                year: prevYear,
                month: prevMon,
                day: prevMonDays - numOfPrefixDays + 1 + i,
                isCurMon: false
            });
        }

        // fill the current month's days.
        for (let i = 1; i <= curMonDays; ++i) {
            fullCalendar.push({
                year: curYear,
                month: curMonth,
                day: i,
                isCurMon: true
            });
        }

        // fill the next month's days.
        for (let i = 1; i <= numOfPostfixDays; ++i) {
            fullCalendar.push({
                year: nextYear,
                month: nextMon,
                day: i,
                isCurMon: false
            });
        }

        return fullCalendar;
    }

    static renderCalendarHeader(target, date) {
        const year = date.getFullYear();
        const monthIdx = date.getMonth(); // 0-11
        target.textContent = `${DatePicker.getMonthName(monthIdx)} ${year}`;
    }

    renderCalendarTable(target, date) {
        const curYear = date.getFullYear();
        const curMonth = date.getMonth();
        const curDate = date.getDate();

        const frag = document.createDocumentFragment();
        this.fullCalenderDays = DatePicker.generateCalendar(date);
        target.textContent = "";
        this.fullCalenderDays.forEach((dayInfo) => {
            const isActive = [
                dayInfo.year === curYear,
                dayInfo.month === curMonth,
                dayInfo.day === curDate,
                dayInfo.isCurMon
            ].every(Boolean);

            const li = document.createElement("li");
            const div = document.createElement("div");
            li.className = `date flex-center${dayInfo.isCurMon ? '' : ' light'}`;
            if (isActive) {
                this.activeCell = li;
                li.className += ' active';
            }
            div.className = 'date-num flex-center';
            div.textContent = dayInfo.day;
            li.appendChild(div);
            frag.appendChild(li);
        });

        target.appendChild(frag);
    }

    renderCalendar(date) {
        const calHeader = document.getElementById(`cal-header-${this.id}`);
        DatePicker.renderCalendarHeader(calHeader, date);

        const calTable = document.getElementById(`content-${this.id}`);
        this.renderCalendarTable(calTable, date);
        
        Array.from(calTable.children).forEach((singleDay) => {
            if (singleDay.classList.contains("light") === false) {
                singleDay.addEventListener('click', () => {
                    this.callback(this.id, { 
                        month: date.getMonth() + 1, 
                        day: singleDay.textContent, 
                        year: date.getFullYear() 
                    });
                    if (singleDay !== this.activeCell) {
                        singleDay.className += ' active';
                        this.activeCell.classList.remove('active');
                        this.activeCell = singleDay;
                    }
                });
            }
        });
    }

    changeMonth(type) {
        const curYear = this.date.getFullYear();
        const curMonth = this.date.getMonth();
        let newYear = 1970;
        let newMonth = 0;

        if (type === 'prev') {
            newMonth = (curMonth === 0) ? 11 : (curMonth - 1);
            newYear = (newMonth === 11) ? (curYear - 1) : curYear;
        } else {
            newMonth = (curMonth === 11) ? 0 : (curMonth + 1);
            newYear = (newMonth === 0) ? (curYear + 1) : curYear;
        }

        this.date = new Date(`${newYear}/${newMonth + 1}/1`);
        this.render(this.date);
    }

    /* 
        1. The calendar must display the days of the selected month in a grid with one line
           for each week and one column for each day of the week.

        2. Weeks run from Sunday on the left to Saturday on the right. The calendar must 
           contain a header row displaying abbreviations for the days of the week, 
           such as "Su", "Mo", etc.

        3. Each day of the month is displayed as a number.

        4. Some weeks when displayed in the date picker may contain days not in 
           the selected month. These days should be displayed as the number in 
           their respective month, but in a dimmed fashion to indicate they are 
           not part of the current month.

        5. All weeks displayed should contain at least one day belonging to the current 
           month. Most months will display 5 weeks, but some months may display 4 or 6 
           depending on the days. The number of rows in your calendar should not be fixed.

        6. The calendar must display the name of the month and year at the top of the calendar. 
           In addition, it must display controls such as "<" and ">" that can be clicked to change 
           the calendar's display to the previous or next month.

        7. Clicking on a valid day of the current month should invoke the callback specified 
           on the constructor with the arguments described above. Clicking on days belonging 
           to months other than the current month should not invoke the callback.
    */
    render(date) {
        this.date = date;

        this.callback(this.id, { 
            month: date.getMonth() + 1, 
            day: date.getDate(), 
            year: date.getFullYear() 
        });

        const datePicker = document.getElementById(this.id);
        datePicker.innerHTML = `
            <div class="calendar" id="calendar-${this.id}">
                <div class="title" id="title-${this.id}">
                    <button class="prev-btn" id="prev-${this.id}"><</button>
                    <span class="cal-header" id="cal-header-${this.id}">Test Cal Header</span>
                    <button class="next-btn" id="next-${this.id}">></button>
                </div>
                <div class="week-header" id="week-header-${this.id}">
                    <li>Sun</li>
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                </div>
                <div class="content" id="content-${this.id}">

                </div>
            </div>
        `;

        this.renderCalendar(date);
        document.getElementById(`prev-${this.id}`).addEventListener('click', () => {
            this.changeMonth('prev');
        });
        document.getElementById(`next-${this.id}`).addEventListener('click', () => {
            this.changeMonth('next');
        });
    }
}