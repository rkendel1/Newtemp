"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetEmailTemplate = void 0;
var passwordResetEmailTemplate = function (resetLink) { return "\n  <h1>Password Reset Request</h1>\n  <p>Click the link below to reset your password:</p>\n  <a href=\"".concat(resetLink, "\">Reset Password</a>\n"); };
exports.passwordResetEmailTemplate = passwordResetEmailTemplate;
