export const passwordResetEmailTemplate = (resetLink) => `
  <h1>Password Reset Request</h1>
  <p>Click the link below to reset your password:</p>
  <a href="${resetLink}">Reset Password</a>
`;
