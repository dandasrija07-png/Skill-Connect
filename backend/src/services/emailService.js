export const sendEmail = async ({ to, subject, html }) => {
  // Safe mock email dispatcher for development & staging
  console.log(`📧 [Email Simulation] To: ${to} | Subject: ${subject}`);
  return { success: true, messageId: `mock-${Date.now()}` };
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;
  return sendEmail({
    to: email,
    subject: "Reset your SkillConnect password",
    html: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
  });
};

