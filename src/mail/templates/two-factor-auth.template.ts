export function getTwoFactorAuthTemplate(
  domain: string,
  token: string,
): string {
  const verifyLink = `${domain}/auth/verify?token=${token}`;

  return `
		<html>
			<body style="font-family: Arial, sans-serif; color: #333;">
				<h1>Two-Factor Authentication</h1>
				<p>Hello! To complete your login, please click the following link to verify your identity:</p>
				<p><a href="${verifyLink}" style="color: #007bff;">Verify Identity</a></p>
				<p>This link is valid for 10 minutes. If you did not request this, please ignore this message.</p>
			</body>
		</html>
	`;
}
