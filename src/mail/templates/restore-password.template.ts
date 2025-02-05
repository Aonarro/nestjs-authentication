export function getRestorePasswordTemplate(
  domain: string,
  token: string,
): string {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return `
		<html>
			<body style="font-family: Arial, sans-serif; color: #333;">
				<h1>Password Reset</h1>
				<p>Hello! To reset your password, please click the following link:</p>
				<p><a href="${resetLink}" style="color: #007bff;">Reset Password</a></p>
				<p>This link is valid for 1 hour. If you did not request a password reset, please ignore this message.</p>
			</body>
		</html>
	`;
}
