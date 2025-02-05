export function getConfirmationTemplate(domain: string, token: string): string {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h1>Email Confirmation</h1>
        <p>Hello! To confirm your email address, please click the following link:</p>
        <p><a href="${confirmLink}" style="color: #007bff;">Confirm Email</a></p>
        <p>This link is valid for 1 hour. If you did not request confirmation, please ignore this message.</p>
      </body>
    </html>
  `;
}
