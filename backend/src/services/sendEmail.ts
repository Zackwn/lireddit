import nodemailer from 'nodemailer'

export async function sendMail(to: string, text: string) {
  // let testAccount = await nodemailer.createTestAccount();
  // console.log(`Account pass: ${testAccount.pass}\nAccount user: ${testAccount.user}`)

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'chzlc5gtvlac3gxm@ethereal.email',
      pass: 'WyqBStQBWqxKmuBw8h',
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject: "Change Passoword",
    html: text
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}