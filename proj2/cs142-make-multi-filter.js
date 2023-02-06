"use strict";

function cs142MakeMultiFilter(originalArray) {
    let currentArray = [...originalArray];
    const arrayFilterer = function (filterCriteria, callback) {
        if (typeof filterCriteria !== "function") {
            return currentArray;
        }
        currentArray = currentArray.filter(filterCriteria);
        if (typeof callback === "function") {
            callback.call(originalArray, currentArray);
        }
        return arrayFilterer;
    };
    return arrayFilterer;
}