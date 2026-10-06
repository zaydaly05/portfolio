/**
 * Earlier built-in versions of sections whose defaults were improved. If the database still holds
 * one of these exactly (the owner never edited it), it is upgraded to the current default.
 * Edited content never matches, so it is never overwritten.
 */
module.exports = {
  faq: [
    [
        {
          "question": "🟢 Is {firstName} available for immediate hire or internship?",
          "answer": "Yes! {firstName} is actively open for Software Engineering internships, full-stack roles (Spring Boot, React, C#, Flutter), and collaborative projects."
        },
        {
          "question": "⚡ What is {firstName}'s typical response time?",
          "answer": "{firstName} typically responds within 2 to 6 hours for email inquiries and direct WhatsApp messages."
        },
        {
          "question": "🌍 Where is {firstName} located & is remote work supported?",
          "answer": "Based in Maadi, Cairo, Egypt (Cairo Local Time UTC+3). {firstName} is fully equipped for remote, hybrid, or on-site positions."
        },
        {
          "question": "📄 How can recruiters review official credentials?",
          "answer": "Click View CV in the header navigation or open the Experience & CV page to preview the LaTeX PDF resume."
        }
      ]
  ]
};
