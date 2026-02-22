import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  await resend.emails.send({
    from: "YDSXP <onboarding@resend.dev>",
    to: email,
    subject: "YDSXP — Email Doğrulama",
    html: `
      <div style="font-family: monospace; background: #080810; color: #f0f0f8; padding: 40px; border-radius: 12px; max-width: 400px;">
        <h2 style="color: #f59e0b; margin-bottom: 8px;">YDSXP</h2>
        <p style="color: #5a5a7a; margin-bottom: 24px;">Email adresini doğrula</p>
        <div style="background: #0f0f1a; border: 1px solid #252535; border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #f59e0b;">${code}</div>
        </div>
        <p style="color: #5a5a7a; font-size: 13px;">Bu kod 15 dakika geçerlidir. Eğer kayıt olmadıysan bu emaili görmezden gel.</p>
      </div>
    `,
  });
}
