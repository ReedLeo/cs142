'use strict';

class DatePicker {
    static daysInMonths = [
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // common year
        [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // leap year
    ];

    static monthsName = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
    }

    isLeapYear(year) {
        return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
    }

    getPrefixDays(date) {
        let firstDayOfCurMonth = new Date(date);
        firstDayOfCurMonth.setDate(1);
        const dayInWeek = firstDayOfCurMonth.getDay(); // 0-6
        const prevMonth = (date.getMonth() > 0) ? (date.getMonth() - 1) : 11;
        const isLeap = this.isLeapYear(date.getFullYear() - (prevMonth === 11 ? 1 : 0));
        const prevMonthTotalDays = DatePicker.daysInMonths[isLeap ? 1 : 0][prevMonth];

        let prefixDays = [];
        for (let i = 0; i < dayInWeek; ++i) {
            prefixDays.push(prevMonthTotalDays - dayInWeek + 1 + i);
        }
        return prefixDays;
    }

    getPostfixDays(date) {
        let lastDayOfCurMonth = new Date(date);
        const month = lastDayOfCurMonth.getMonth();
        const isCurLeap = this.isLeapYear(date.getFullYear());
        const curMonthTotalDays = DatePicker.daysInMonths[isCurLeap ? 1 : 0][month];
        lastDayOfCurMonth.setDate(curMonthTotalDays);
        const dayInWeek = lastDayOfCurMonth.getDay();

        let postfixDays = [];
        for (let i = dayInWeek + 1; i < 7; ++i) {
            postfixDays.push(i - dayInWeek);
        }
        return postfixDays;
    }

    renderCalendarHeader(target, date) {

        const year = date.getFullYear();
        const monthIdx = date.getMonth(); // 0-11
        target.textContent = `${DatePicker.monthsName[monthIdx]} ${year}`;
    }

    renderCalendarTable(target, date) {

        const leapYear = this.isLeapYear(date.getFullYear());

        const month = date.getMonth(); // 0-11
        const totalDaysOfCurMonth = DatePicker.daysInMonths[leapYear ? 1 : 0][month];

        const dayInMonth = date.getDate(); // 1-31

        const prefixDays = this.getPrefixDays(date);
        const postfixDays = this.getPostfixDays(date);

        const calFragment = document.createDocumentFragment();
        let curDay = 1 - prefixDays.length;
        if (prefixDays !== null && prefixDays.length > 0) {
            for (const x of prefixDays) {
                const li = document.createElement("LI");
                li.className = "date flex-center prev-month-days light";

                const div = document.createElement("DIV");
                div.className = "date-num flex-center";
                div.innerHTML = x;
                li.appendChild(div);
                calFragment.appendChild(li);
                ++curDay;
            }

            for (let i = prefixDays.length; i < 7; ++i) {
                const li = document.createElement("LI");
                li.className = "date flex-center cur-month-days";
                if (curDay === dayInMonth) {
                    li.className += " active";
                }
                li.id = `cur-month-day-${curDay}`;
                
                const div = document.createElement("DIV");
                div.className = "date-num flex-center";
                div.innerHTML = curDay;
                li.appendChild(div);
                calFragment.appendChild(li);
                ++curDay;
            }
        }

        for (let row = 1; curDay <= totalDaysOfCurMonth; ++row) {
            for (let col = 0; (col < 7) && (curDay <= totalDaysOfCurMonth); ++col) {
                const li = window.document.createElement("LI");
                li.className = "date flex-center cur-month-days";
                if (curDay === dayInMonth) {
                    li.className += " active";
                }
                li.id = `cur-month-day-${curDay}`;
                
                const div = document.createElement("DIV");
                div.className = "date-num flex-center";
                div.innerHTML = curDay;
                li.appendChild(div);
                calFragment.appendChild(li);
                ++curDay;
            }

            // add the next months' days.
            if (curDay > totalDaysOfCurMonth) {
                for (let x of postfixDays) {
                    let li = window.document.createElement("LI");
                    li.className = "date flex-center nxt-month-days light";
                    li.id = `nxt-month-day-${x}`;

                    const div = document.createElement("DIV");
                    div.className = "date-num flex-center";
                    div.innerHTML = x;
                    li.appendChild(div);
                    calFragment.appendChild(li);
                    ++curDay;
                }
            }
        }
        target.appendChild(calFragment);
    }

    /* 
        1. The calendar must display the days of the selected month in a grid with one line
           for each week and one column for each day of the week.
        2. Weeks run from Sunday on the left to Saturday on the right. The calendar must 
           contain a header row displaying abbreviations for the days of the week, such as "Su", "Mo", etc.
        3. Each day of the month is displayed as a number.
        4. Some weeks when displayed in the date picker may contain days not in the selected month. 
           These days should be displayed as the number in their respective month, but in a dimmed fashion to indicate they are not part of the current month.
        5. All weeks displayed should contain at least one day belonging to the current month. 
           Most months will display 5 weeks, but some months may display 4 or 6 depending on the days. T
           he number of rows in your calendar should not be fixed.
        6. The calendar must display the name of the month and year at the top of the calendar. 
           In addition, it must display controls such as "<" and ">" that can be clicked to change the calendar's display to the previous or next month.
        7. Clicking on a valid day of the current month should invoke the callback specified on the 
           constructor with the arguments described above. Clicking on days belonging to months other 
           than the current month should not invoke the callback.
    */
    render(date) {
        this.callback(this.id, { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() });
        let datePicker = window.document.getElementById(this.id);

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

        const calHeader = window.document.getElementById(`cal-header-${this.id}`);
        this.renderCalendarHeader(calHeader, date);

        const calTable = window.document.getElementById(`content-${this.id}`);
        this.renderCalendarTable(calTable, date);

    }
}