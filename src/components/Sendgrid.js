import sgMail from "@sendgrid/mail";

// * Function to send email
const sendEmail = (msg) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error("SendGrid API key is not defined");
    return;
  }

  sgMail.setApiKey(apiKey);
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("Error:", error.response.body.errors);
    });
};

export default sendEmail;
