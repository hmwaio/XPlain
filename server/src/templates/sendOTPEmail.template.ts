type OTPEmailTemplateProps = {
  otp: string;
  email: string;
};

export const otpEmailTemplate = ({ otp, email }: OTPEmailTemplateProps) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  <body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

    <div style="
      background-color:#f5f7fb;
      padding:40px 20px;
      font-family:Arial, Helvetica, sans-serif;
    ">
      <div style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,0.08);
      ">
        
        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#2563eb,#7c3aed);
          padding:40px 30px;
          text-align:center;
        ">
          <h1 style="
            color:white;
            margin:0;
            font-size:32px;
            font-weight:700;
          ">
            XPlain
          </h1>

          <p style="
            color:rgba(255,255,255,0.9);
            margin-top:10px;
            font-size:16px;
          ">
            Verify your email address
          </p>
        </div>

        <!-- Body -->
        <div style="padding:40px 30px;">
          <h2 style="
            color:#111827;
            margin-top:0;
            font-size:24px;
          ">
            Hello 👋
          </h2>

          <p style="
            color:#4b5563;
            font-size:16px;
            line-height:1.7;
          ">
            We received a request to verify this email address:
          </p>

          <p style="
            font-size:16px;
            font-weight:600;
            color:#111827;
            background:#f3f4f6;
            padding:12px 16px;
            border-radius:12px;
            display:inline-block;
          ">
            ${email}
          </p>

          <p style="
            color:#4b5563;
            font-size:16px;
            margin-top:30px;
          ">
            Use the verification code below to continue:
          </p>

          <!-- OTP Box -->
          <div style="
            background:linear-gradient(135deg,#eff6ff,#f5f3ff);
            border:2px dashed #6366f1;
            border-radius:16px;
            padding:24px;
            text-align:center;
            margin:30px 0;
          ">
            <div style="
              font-size:38px;
              letter-spacing:10px;
              font-weight:700;
              color:#111827;
            ">
              ${otp}
            </div>
          </div>

          <p style="
            color:#ef4444;
            font-size:14px;
            margin-top:10px;
          ">
            ⏳ This OTP expires in 5 minutes.
          </p>

          <p style="
            color:#6b7280;
            font-size:14px;
            margin-top:30px;
            line-height:1.7;
          ">
            If you didn’t request this code, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="
          background:#f9fafb;
          padding:20px;
          text-align:center;
          border-top:1px solid #e5e7eb;
        ">
          <p style="
            margin:0;
            color:#9ca3af;
            font-size:13px;
          ">
            © ${new Date().getFullYear()} XPlain. All rights reserved.
          </p>
        </div>
      </div>
    </div>

  </body>
  </html>
  `;
};
