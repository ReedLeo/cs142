'use strict';

class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
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
        const weekdayAbbreviations = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        this.callback(this.id, {month:date.getMonth()+1, day:date.getDate(), year:date.getFullYear()});
        let datePicker = window.document.getElementById(this.id);
        
        let week = window.document.createElement("DIV");
        week.className = "week";
        for (const x of weekdayAbbreviations) {
            const li = window.document.createElement("LI");
            li.textContent = x;
            week.appendChild(li);
        }

        datePicker.appendChild(week);
    }
}