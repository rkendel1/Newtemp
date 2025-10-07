"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.generateId = exports.formatCurrency = exports.formatDate = exports.cn = void 0;
// Generic utility functions
var cn = function () {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return classes.filter(Boolean).join(' ');
};
exports.cn = cn;
var formatDate = function (date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
exports.formatDate = formatDate;
var formatCurrency = function (amount, currency) {
    if (currency === void 0) { currency = 'USD'; }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
var generateId = function () {
    return Math.random().toString(36).substr(2, 9);
};
exports.generateId = generateId;
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
