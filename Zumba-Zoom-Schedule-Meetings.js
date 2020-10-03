function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  return [year, month, day].join('-');
}

function tonusMeetingScheduler() {
  var first_date_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange(1, 28).getValue();

  var start_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange(1, 28).getValue().toString();
  var start_date = formatDate(start_date_unformatted);
  var last_column_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getLastColumn();

  var end_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange(1, last_column_number).getValue().toString();
  var end_date = formatDate(end_date_unformatted);

  for (var x = 31; x <= last_column_number; x++) {
    var start_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange(1, x).getValue().toString();
    var start_date = formatDate(start_date_unformatted);
    var end_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange(1, last_column_number).getValue().toString();
    var end_date = formatDate(end_date_unformatted);
    var schedule_meeting = {
      "topic": "Micheline Zoom Tonus Meeting",
      "type": 2,
      "start_time": start_date + "T" + "17:15:00",
      "duration": 120,
      "timezone": "America/Montreal",
      "password": "Tonus14",
      "agenda": "Micheline's weekly Zoom Tonus class",
      "recurrence": {
        "type": 2,
        "repeat_interval": 6,
        "weekly_days": "5",
        "end_times": 4
      },
      "settings": {
        "host_video": 1,
        "participant_video": 1,
        "cn_meeting": 0,
        "in_meeting": 0,
        "join_before_host": 0,
        "mute_upon_entry": 1,
        "watermark": 0,
        "use_pmi": 0,
        "approval_type": 0,
        "registration_type": 1,
        "audio": "both",
        "auto_recording": "cloud",
        "enforce_login": "false",
      }
    }


    var create_id = UrlFetchApp.fetch(
      "https://api.zoom.us/v2/users/Fn9nr-XET0aM3-N_uiPn8w/recordings", {
        "method": "POST",
        "muteHttpExceptions": true,
        payload: JSON.stringify(schedule_meeting),
        headers: {
          "Authorization": "Bearer XXXXXXX",
          "Accept-Encoding": "gzip",
          "Api-Version": "alpha",
          "Content-Type": "application/json"
        }
      }
    )
  }
}

function recordingsAutomation() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();


  var formattedDate = formatDate(d);
  var d_plus1 = new Date();
  d_plus1 = d_plus1.setDate(d_plus1.getDate() + 1);
  var formattedDateplus1 = formatDate(d_plus1);
  var query = "https://api.zoom.us/v2/users/Fn9nr-XET0aM3-N_uiPn8w/recordings?from=" + '2020-09-18' + "&to=" + '2020-09-18' + "";

  var create_id_2 = UrlFetchApp.fetch(
    query, {
      "method": "GET",
      "muteHttpExceptions": true,
      headers: {
        "Authorization": "Bearer XXXXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
      }
    }
  )
}

function sendBulkEmails() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  var formattedDate = formatDate(d);
  var grandandtoken = {
    "grant_type": 'refresh_token',
    "refresh_token": 'XXXXXXXXX'
  }
  var create_id_2 = UrlFetchApp.fetch(
    "https://api.zoom.us/v2/users/Fn9nr-XET0aM3-N_uiPn8w/meetings?from=" + formattedDate + "&to=" + '2020-09-18' + "&page_size=15", {
      "method": "GET",
      "muteHttpExceptions": true,
      headers: {
        "Authorization": "Bearer XXXXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
      }
    }
  )

  var meeting_url_arr = [];
  var id_ = "";
  for (var x = 0; x < JSON.parse(create_id_2)["meetings"].length; x++) {
    var mydate = new Date(JSON.parse(create_id_2)["meetings"][x]["start_time"]);
    if (d.getTime() < mydate.getTime()) {
      if (mydate.getDay() == 5.0) {
        // Equal to Friday
        meeting_url_arr.push(mydate);
        id_ = (JSON.parse(create_id_2)["meetings"][x]["id"]).toString();
        meeting_url_arr.push(JSON.parse(create_id_2)["meetings"][x]["join_url"]);
        break;
      }
    }
  }
  Logger.log(meeting_url_arr);
  Logger.log(id_);
  var xe = UrlFetchApp.fetch(
    "https://api.zoom.us/v2/meetings/" + id_, {
      "method": "GET",
      "muteHttpExceptions": true,
      headers: {
        "Authorization": "Bearer XXXXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
      }
    }
  )
  meeting_url_arr.push(JSON.parse(xe)["pmi"]);
  meeting_url_arr.push(JSON.parse(xe)["password"]);
  return meeting_url_arr

}

function sendToMultiple() {
  /* to do: add meeting username and password plz!!! pmi and password above */
  var meeting_url_arr = sendBulkEmails();
  var zumba_clients_emails = [];
  for (var x = 2; x < 29; x++) {
    zumba_clients_emails.push(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange(x, 2).getValue());
  }

  var message = "This is a test of HTML <br><br> Line two";
  var recipientsTO = "email@address.com";
  var email_subject = "Micheline Friday Zumba 💃 Zoom Workout";

  var email_body_not_payed_fr = "<!DOCTYPE html><html><body><h1>Micheline Zoom Zumba Class</h1><p>Bonjour la Gang de Zumba,<br><br> Je m'appelle Claudia Feochari et je\
                              suis la fille de Micheline et la gérante IT du Zoom Zumba avec Micheline. Je vous envois ce courriel pour vous rappeler qu'il y aura un\
                              Zumba Zoom virtuel ce Vendredi à 5:30PM. Vous pouvez aller en ligne a 5:15PM. <br> On apprécie un donation de $4 pour ce cours car on paye\
                              pour le Zoom Pro pour que on peut vous donner un cours complet et de haute qualité d'une heure avec Zoom Pro. Si vous faites le Tonus\
                              Totale la semaine prochaine, le prix est réduit et sera 6$ qui inclut les deux cours pour la semaine prochaine. Envois moi un courriel\
                              si vous êtes intéressé de participer au Tonus la semaine prochaine si vous n’aviez pas faites cela encore.<br>Le courriel pour le\
                              e-transfer de $4  :claudia.f.feochari@hotmail.com<br>Pour le e-transfer, SVP utilise le mot de passe ZUMBA avec tous les lettres en\
                              majuscule. Si cela ne marche pas, utilise ZUMBAZUMBA.<br>Si vous avez des questions concernant le e-transfer, envoyez moi un courriel.\
                              Je pourrais vous donner de l'assistance sur un appel Zoom si vous avez des questions. J'ai fait cela avec quelqu'un déjà, n'hésitez pas\
                              de me contacter par courriel si vous avez des questions.<br>Voici les détails pour le meeting Zoom ce vendredi:<br>"+ "Meeting Id: " +
    meeting_url_arr[2] + "<br> Password: " + meeting_url_arr[3] + "<br>" + meeting_url_arr[0] + "<br>" + meeting_url_arr[1] +
    "<br> Merci beaucoup et je vous vois Vendredi 😍," + "<br>" + "Claudia Feochari" + "<br><br>-----------------------------------------------------------------------------------------------------------------";

  var email_body_not_payed_en = "<br><br>Hi Everyone,<br><br>I'm Claudia Feochari, Micheline's daughter and Zoom Zumba with Micheline IT Manager. I am emailing you to remind\
                              you that a Zumba class is going to occur in the living room this Friday at 5:30PM. You can come on to the meeting at 5:15PM. If you decide to do\
                              the Tonus Totale class next week, the total amount for both classes next week will be 6$. If you haven’t already let me know you were interested\
                              in Tonus Totale next week, please send me an email so I could add you to my list. <br> We would highly appreciate a 4$ donation for this week in\
                              order to cover the cost of using Zoom Pro as we have got it in order to lift the 40 minute limit in order to give you the real full 1hour Zumba\
                              experience. <br>Please e-transfer the $4 to this email address:\ <br> claudia.f.feochari@hotmail.com<br>For the e-transfer, please use the password\
                              ZUMBA with all capital letters. If that does not work, please use the password ZUMBAZUMBA.<br>Please let me know if you are having issues with the e-transfer,\
                              I have provided live assistance for someone last week so feel free to email me if you are having difficulties as I am willing to provide live assistance in the\
                              form of a Zoom call for this.<br>Here are the details for Friday’s Meeting:<br>"+ "Meeting Id: " + meeting_url_arr[2] + "<br> Password: " +
    meeting_url_arr[3] + "<br>" + meeting_url_arr[0] + "<br>" + meeting_url_arr[1] +
    "<br> Thank you and see you Friday for an awesome fun Zumba Class 😍," + "<br>" + "Claudia Feochari" + "<br><br>-----------------------------------------------------------------------------------------------------------------" +
    "</p></body></html>";
  var email_not_payed = email_body_not_payed_fr + email_body_not_payed_en;

  var email_body_payed_fr = "<!DOCTYPE html><html><body><h1>Micheline Zoom Zumba Class</h1><p>Bonjour la Gang de Zumba,<br><br> Je m'appelle Claudia Feochari et je\
                              suis la fille de Micheline et la gérante IT du Zoom Zumba avec Micheline. Je vous envois ce courriel pour vous rappeler qu'il y aura un\
                              Zumba Zoom virtuel ce Vendredi à 5:30PM. Vous pouvez aller en ligne a 5:15PM. <br> On apprécie un donation de $4 pour ce cours car on paye\
                              pour le Zoom Pro pour que on peut vous donner un cours complet et de haute qualité d'une heure avec Zoom Pro. Si vous faites le Tonus\
                              Totale la semaine prochaine, le prix est réduit et sera 6$ qui inclut les deux cours pour la semaine prochaine. Envois moi un courriel\
                              si vous êtes intéressé de participer au Tonus la semaine prochaine si vous n’aviez pas faites cela encore.<br>Le courriel pour le\
                              e-transfer de $4  :claudia.f.feochari@hotmail.com<br>Pour le e-transfer, SVP utilise le mot de passe ZUMBA avec tous les lettres en\
                              majuscule. Si cela ne marche pas, utilise ZUMBAZUMBA.<br>Si vous avez des questions concernant le e-transfer, envoyez moi un courriel.\
                              Je pourrais vous donner de l'assistance sur un appel Zoom si vous avez des questions. J'ai fait cela avec quelqu'un déjà, n'hésitez pas\
                              de me contacter par courriel si vous avez des questions.<br>Voici les détails pour le meeting Zoom ce vendredi:"+ meeting_url_arr[0] + "<br>" + meeting_url_arr[1] +
    "<br> Merci beaucoup et je vous vois Vendredi 😍," + "<br>" + "Claudia Feochari" + "<br></p></body></html>";

  MailApp.sendEmail({
    to: recipientsTO,
    subject: email_subject,
    htmlBody: email_not_payed
  });

}
