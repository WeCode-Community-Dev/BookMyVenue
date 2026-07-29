export const emailLayout = (title: string, subtitle: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
<tr>
<td align="center">

<table width="480" cellpadding="0" cellspacing="0"
style="background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">

<tr>
<td style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:32px 40px;text-align:center;">

<div style="display:inline-block;width:48px;height:48px;background:rgba(255,255,255,.15);border-radius:12px;line-height:48px;font-size:24px;font-weight:bold;color:#fff;margin-bottom:12px;">
B
</div>

<h1 style="margin:0;color:#fff;font-size:22px;">
BookMyVenue
</h1>

<p style="margin-top:8px;color:#ffffffb3;font-size:13px;">
${subtitle}
</p>

</td>
</tr>

<tr>
<td style="padding:36px 40px;">
${content}
</td>
</tr>

<tr>
<td style="background:#0f172a;padding:20px;text-align:center;border-top:1px solid #1e293b;">
<p style="margin:0;color:#64748b;font-size:12px;">
© ${new Date().getFullYear()} BookMyVenue. All rights reserved.
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
