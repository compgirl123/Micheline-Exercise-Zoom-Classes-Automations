// Function to get next Tuesday's date
function getNextTuesday() {
  const today = new Date();
  const nextTuesday = new Date(today);
  nextTuesday.setDate(today.getDate() + (9 - today.getDay()) % 7);
  return nextTuesday;
}

// Manually translate the month names to French
function getFrenchMonth(monthIndex) {
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  return months[monthIndex];
}

// Format the date as needed for French (day before month)
function formatDateFr(date) {
  const day = date.getDate();
  const month = getFrenchMonth(date.getMonth());
  const year = date.getFullYear();
  //const weekday = getFrenchWeekday(date.getDay());
  return day + " " + month + " " + year;
}

function sendToMultiple() {
  var zumba_clients_emails = [];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2024");
  var last_row_number = sheet.getLastRow();

  Logger.log("Last row number in sheet '2024': " + last_row_number);

  for (var x = 2; x <= last_row_number; x++) {
    var email = sheet.getRange(x, 2).getValue();
    if (email) {
      zumba_clients_emails.push(email);
    }
  }

  zumba_clients_emails.push('clauisawesome@gmail.com');
  zumba_clients_emails.push('michepietracupa@hotmail.com');
  var client_emails_string = zumba_clients_emails.join();

  Logger.log("Collected Emails: " + client_emails_string); // Log collected emails for debugging

  // Get the next Tuesday's date
  const nextTuesdayDate = getNextTuesday();
  const formattedDateFr = nextTuesdayDate;
  const formattedDateEn = nextTuesdayDate.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  var email_subject = "💃 Micheline Zumba au Parc 🌳";

var email_zumba_outdoors_fr = "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif; color: #4A4A4A;'>\
<br/><p style='font-size: 18px;'>Bonjour la Gang de Zumba,</p>\
<p style='font-size: 18px;'>Je m'appelle <strong>Claudia Feochari</strong> et je suis la fille de Micheline et la gérante IT du <span style='color: #E67E22;'>Zumba</span> avec Micheline. Je vous envoie ce courriel pour vous rappeler qu'il y aura un <span style='color: #3498DB;'>Zumba au <strong>Parc Outremont</strong></span> ce <strong>Mardi le " + formatDateFr(formattedDateFr) + " à 18h30 </strong>.</p>\
<p style='font-size: 18px;'>L'adresse du Parc est la suivante:</p>\
<p style='font-size: 18px; font-weight: bold;'>1172, avenue Saint-Viateur (coin de Bloomfield) <br>Montréal (Québec) H2V 1Z1</p>\
<p style='font-size: 18px;'>Le cours aura lieu près de la statue <strong>Gloria Victoribvs</strong>. On apprécie une donation pour ce cours mais vous pouvez donner ce que vous voulez! Le courriel pour le e-transfer : <a href='mailto:claudia.f.feochari@hotmail.com' style='color: #8E44AD;'>claudia.f.feochari@hotmail.com</a>. Vous pouvez également donner de l'argent comptant le jour de la classe. Pour le e-transfer, <strong>SVP</strong> utilisez le mot de passe <strong style='color: #E74C3C;'>ZUMBA</strong> avec toutes les lettres en majuscules. Si cela ne marche pas, utilisez <strong style='color: #E74C3C;'>ZUMBAZUMBA</strong>.</p>\
<p style='font-size: 18px;'></p>\
<br/><p style='font-size: 18px; color: red;'>Important*</p>\
<p style='font-size: 18px;'>Merci beaucoup et je vous vois <span style='color: #E67E22;'>Mardi</span> 😍,</p>\
<p style='font-size: 18px;'><strong>Claudia Feochari</strong></p>\
<br/><p style='font-size: 18px;'>Merci et Zumba L💟VE</p>\
<br><br>-----------------------------------------------------------------------------------------------------------------</body></html>";

var email_zumba_outdoors_en = "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif; color: #4A4A4A;'>\
<br/><p style='font-size: 18px;'>Hello Zumba Gang,</p>\
<p style='font-size: 18px;'>My name is <strong>Claudia Feochari</strong> and I am Micheline's daughter and the IT manager of <span style='color: #E67E22;'>Zumba</span> with Micheline. I am sending you this email to remind you that there will be a <span style='color: #3498DB;'>Zumba at <strong>Outremont Park</strong></span> this <strong>Tuesday " + formattedDateEn + " at 6:30 PM</strong>.</p>\
<p style='font-size: 18px;'>The address of the park is as follows:</p>\
<p style='font-size: 18px; font-weight: bold;'>1172, avenue Saint-Viateur (corner of Bloomfield) <br>Montreal (Quebec) H2V 1Z1</p>\
<p style='font-size: 18px;'>The class will be held near the statue <strong>Gloria Victoribvs</strong>. We appreciate a donation for this class, but you can give what you want! The email for the e-transfer is: <a href='mailto:claudia.f.feochari@hotmail.com' style='color: #8E44AD;'>claudia.f.feochari@hotmail.com</a>. You can also give cash on the day of the class. For the e-transfer, <strong>please</strong> use the password <strong style='color: #E74C3C;'>ZUMBA</strong> with all letters in uppercase. If that doesn't work, use <strong style='color: #E74C3C;'>ZUMBAZUMBA</strong>.</p>\
<p style='font-size: 18px;'></p>\
<br/><p style='font-size: 18px; color: red;'>Important*</p>\
<p style='font-size: 18px;'>Thank you very much and I will see you <span style='color: #E67E22;'>Tuesday</span> 😍,</p>\
<p style='font-size: 18px;'><strong>Claudia Feochari</strong></p>\
<br/><p style='font-size: 18px;'>Merci et Zumba L💟VE</p>\
<br><br>-----------------------------------------------------------------------------------------------------------------</body></html>";

  // Log email content for debugging
  Logger.log("Email content (French): " + email_zumba_outdoors_fr);
  Logger.log("Email content (English): " + email_zumba_outdoors_en);






    var images = "<p style='font-size: 18px; text-align: center;'>\
                    <img src='cid:logo1' alt='Logo 1' style='width: 100%; max-width: 600px;'>\
                  </p>\
                  <p style='font-size: 18px; text-align: center;'>\
                    <img src='cid:logo2' alt='Logo 2' style='width: 100%; max-width: 600px;'>\
                  </p>\
                  <p style='font-size: 18px; text-align: center;'>\
                    <img src='cid:logo3' alt='Logo 3' style='width: 100%; max-width: 600px;'>\
                  </p>";

  var email_body = email_zumba_outdoors_fr + email_zumba_outdoors_en + images;

  var image1 = DriveApp.getFileById("1EwWveW7ndeNUEVbeUAwHxkAU0esXdHZ4").getAs("image/jpeg");
  var image2 = DriveApp.getFileById("10H5OUWy1mGgJbCWmJ5ZGgP1toa9i4h5N").getAs("image/jpeg");
  var image3 = DriveApp.getFileById("1oJ3hi6XyDPyO_AilZ3WaWMFKQWjhI-t9").getAs("image/jpeg");

  var inlineImages = {
    logo1: image1,
    logo2: image2,
    logo3: image3
  };

  MailApp.sendEmail({
    //to: client_emails_string,
    //to: "sofvengy@hotmail.com",
    //to: "michepietracupa@hotmail.com",
    to: "clauisawesome@gmail.com",
    subject: email_subject,
    htmlBody: email_body,
    inlineImages: inlineImages
  });
}
