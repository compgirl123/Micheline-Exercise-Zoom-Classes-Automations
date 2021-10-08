function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(); // CHEAT TO FIX IN 2021

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}

function YoutubeLinkforClass(){
  var youtubeLinks = ["https://youtu.be/cdtnr4Cm7v0","https://youtu.be/6AKBJ-xKZyU"];
  // 15 and 29 of april respectively
}

function tonusMeetingScheduler() {
   var first_date_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1, 28).getValue();

   var start_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1, 28).getValue().toString();
   var start_date = formatDate(start_date_unformatted);
   var last_column_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getLastColumn();

   var end_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1, last_column_number).getValue().toString();
   var end_date = formatDate(end_date_unformatted);

  for(var x=47;x<=last_column_number;x++){
    
  var start_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1, x).getValue().toString();
  var start_date = formatDate(start_date_unformatted);
  Logger.log(start_date);
  var end_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1, last_column_number).getValue().toString();
  var end_date = formatDate(end_date_unformatted);
  //Logger.log(end_date);
  var schedule_meeting = {
    "topic": "Micheline Zoom Tonus Meeting",
    "type": 2,
    "start_time": start_date+"T"+"17:15:00",
    "duration": 120,
    "timezone": "America/Montreal",
    "password": "Tonus14",
    "agenda": "Micheline's weekly Zoom Tonus class",
    "recurrence": {
      "type": 2,
      "repeat_interval": 6,
      "weekly_days": "5",
      "end_times" : 4
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
      "auto_recording": "none",
      "enforce_login": "false",
    }
  }

  Logger.log(schedule_meeting);
   var create_id = UrlFetchApp.fetch(
      "https://api.zoom.us/v2/users/XXXXXX/meetings", {
        "method" : "POST",
        "muteHttpExceptions" : true,
        payload: JSON.stringify(schedule_meeting),
        headers: {
        "Authorization": "Bearer XXXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
            }
        }
    )
  Logger.log(create_id);
}
}

function sendBulkEmails(){
  // get recrodings after today (todo)
  
   var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();  
  var formattedDate = formatDate(d);
  var grandandtoken = { 
    "grant_type": 'refresh_token',
    "refresh_token" : 'XXXXXX'
  }
  //Logger.log(d);
  var create_id_2 = UrlFetchApp.fetch(
      "https://api.zoom.us/v2/users/XXXXXX/meetings?from="+formattedDate+"&to="+'2021-05-27'+"&page_size=30", {
        "method" : "GET",
        "muteHttpExceptions" : true,
        headers: {
        "Authorization": "Bearer XXXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
            }
        }
    )
  Logger.log(create_id_2);
  var meeting_url_arr = [];
  var id_ = "";
  for (var x=0;x<JSON.parse(create_id_2)["meetings"].length;x++)
  {
    var mydate = new Date(JSON.parse(create_id_2)["meetings"][x]["start_time"]);
    if(d.getTime() < mydate.getTime()){
      if(mydate.getDay() == 4.0){
        // Equal to Thursday
        meeting_url_arr.push(mydate);
        meeting_url_arr.push(JSON.parse(create_id_2)["meetings"][x]["join_url"]);
        id_= (JSON.parse(create_id_2)["meetings"][x]["id"]).toString();
        break;
      } 
    }
  }
  
  Logger.log(meeting_url_arr);
  Logger.log(id_);
  var xe = UrlFetchApp.fetch(
      "https://api.zoom.us/v2/meetings/"+id_, {
        "method" : "GET",
        "muteHttpExceptions" : true,
        headers: {
        "Authorization": "Bearer XXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
            }
        }
    )
  Logger.log(xe);
  Logger.log(JSON.parse(xe));
  var join_url = JSON.parse(create_id_2)["meetings"][x]["join_url"];
  var join_url_sliced = (join_url).slice((join_url).lastIndexOf('/') + 1);
  var meeting_id = join_url_sliced.slice(0,(join_url_sliced).indexOf('?'));
 
  meeting_url_arr.push(meeting_id);
  meeting_url_arr.push(JSON.parse(xe)["password"]);
  Logger.log(meeting_url_arr);
  return meeting_url_arr
  
  }

function sendToMultiple() {
  // TO MODIFY!!!
  var meeting_url_arr = sendBulkEmails();
  var zumba_clients_emails = [];
  var last_row_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getLastRow();

  for(var x=2;x<last_row_number-1;x++){
     zumba_clients_emails.push(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(x, 2).getValue());
  }

  zumba_clients_emails= zumba_clients_emails.filter(Boolean)
  zumba_clients_emails.push('clauisawesome@gmail.com');
  // CAREFUL/CAUTION -> Energy contains the actual emails of the clients, BE CAUTIOUS WHEN RUNNING
  var client_emails_string = zumba_clients_emails.join();
  var message = "This is a test of HTML <br><br> Line two";
  var recipientsTO = client_emails_string;
  var email_subject = "Micheline Thursday / Jeudi Tonus Totale 🏋️ Zoom Workout";
  
  var email_body_not_payed_fr = "<!DOCTYPE html><html><body><h1>Micheline Zoom Tonus Class</h1><p>Bonjour la Gang de Tonus Totale,<br><br> Je m'appelle Claudia Feochari\
                                et je suis la fille de Micheline et la gérante IT du Zoom Tonus Totale avec Micheline. Je vous envois ce courriel pour vous rappeler\
                                qu'il y aura un Cours de Tonus Totale Zoom virtuel ce Jeudi à 17:30 pm. Vous pouvez aller en ligne à partir de 17:15 pm.\
                                Vous avez besoin deux poids (2 bouteilles remplit d’eau si vous n’avez pas de poids), une chaise, un tapis ou une serviette pour\
                                faire les abdos au sol.<br> On apprécie un donation de $6 pour ce cours car on donne un cours complet et de haute qualité d'une heure\
                               avec Zoom Pro. Si vous faites le Zumba aussi Vendredi à 5:30pm la même semaine, le prix sera 12$ qui inclut les deux cours.\
                               <br>Le courriel pour le e-transfer : <br> claudia.f.feochari@hotmail.com <br>Pour le e-transfer pour le cours de Tonus Seulement, SVP \
                               utilise le mot de passe TONUS1 avec tous les lettres en majuscule.<br>Si vous faites les deux cours, Tonus et Zumba, SVP utilise le mot\
                               de passe ZUMBA avec tous les lettres en majuscule. Si cela ne marche pas, utilise ZUMBAZUMBA.<br>Si vous avez des questions concernant\
                               le e-transfer, envoyez moi un courriel.\
                              Je pourrais vous donner de l'assistance sur un appel Zoom si vous avez des questions. J'ai fait cela avec quelqu'un déjà, n'hésitez pas\
                              de me contacter par courriel si vous avez des questions.<br>Voici les détails pour le meeting Zoom ce Jeudi:<br>"+"Meeting Id: "
                              +meeting_url_arr[2]+ "<br> Password: " +meeting_url_arr[3]+"<br>" +meeting_url_arr[0] + "<br>" + meeting_url_arr[1] +
                              "<br> Merci beaucoup et je vous vois Jeudi 😍,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------";
  
  var email_body_not_payed_en = "<br><br>Hi Everyone,<br><br>I'm Claudia Feochari, Micheline's daughter and Zoom Tonus Total with Micheline IT Manager. I am emailing you\
                              to remind you that a Tonus Total class is going to occur in the living room this Thursday at 17:30pm. You can come on to the meeting at\
                              17:15pm. For the Toning class, you will need weights if you have if not 2 water bottles filled up with water will do. You will also need\
                              a chair, a mat if you have if not a towel so you can do the ab workouts on the floor. <br>We would highly appreciate a 6$ donation for this\
                              week as we are giving you the real full 1 hour Tonus Total experience with Zoom Pro. If you decide to partake in Zumba at 5:30pm on Fridays,\
                              the price is 12$ which includes both classes Tonus Total as well as Zumba.<br>Please e-transfer the money to:\
                              <br> claudia.f.feochari@hotmail.com<br>For the e-transfer for tonus ONLY, please use the password TONUS1 with all capital letters.<br>\
                              If you decide to use both Tonus and Zumba, please use the password ZUMBA with all capital letters. If that does not work, please use\
                              the password ZUMBAZUMBA.<br>Please let me know if you are having issues with the e-transfer, I have provided live assistance for someone\
                              before so feel free to email me if you are having difficulties as I am willing to provide live assistance in the form of a Zoom call for this.\
                             .<br>Here are the details for Thursday’s Meeting<br>:"+"Meeting Id: "+meeting_url_arr[2]+ "<br> Password: " +meeting_url_arr[3]+"<br>" +
                              meeting_url_arr[0] + "<br>" + meeting_url_arr[1] +
                              "<br> Thank you and see you Thursday 😍,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------"+ 
                              "</p></body></html>";
  var email_subject_christmas = "Micheline Thursday Tonus Totale 🏋️ Zoom Workout";
  var email_not_payed = email_body_not_payed_fr + email_body_not_payed_en;
  
  /*Uncomment when you want to have the atuomation working again*/
  MailApp.sendEmail({
    to: recipientsTO,
    subject: email_subject, // usually use this but for christmas we wont
    htmlBody: email_not_payed, // usually use this but for christmas we wont
  });
}

function getTonusRecordingAndModifySettings(){
   var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();  
  var formattedDate = formatDate(d);
  var getAllRecordings = UrlFetchApp.fetch(
      "https://api.zoom.us/v2/users/XXXXXX/recordings?from="+formattedDate+"&to="+formattedDate, {
        "method" : "GET",
        "muteHttpExceptions" : true,
        headers: {
        "Authorization": "Bearer XXXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
            }
        }
    )
  var parsed_data = JSON.parse(getAllRecordings);
  var raw_date = parsed_data["meetings"][0]["recording_files"][0]["recording_start"];
  var meeting_id = 0;

  if(formattedDate == formatDate(raw_date)){
    Logger.log((parsed_data["meetings"][0]["id"]).toString());
    meeting_id = (parsed_data["meetings"][0]["id"]).toString();
  }
  
  var hi = {
    "viewer_download": false,
    "approval_type": 2,
    "send_email_to_host": true,
    "on_demand": false,
  };

  var changeRecordingSettings = UrlFetchApp.fetch(
    "https://api.zoom.us/v2/meetings/"+ meeting_id +"/recordings/settings", {
        "method" : "PATCH",
        "muteHttpExceptions" : true,
        headers: {
        "Authorization": "Bearer XXXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
            }
        }
    )
 
  var getAllRecordings = UrlFetchApp.fetch(
      "https://api.zoom.us/v2/meetings/"+ meeting_id +"/recordings", {
        "method" : "GET",
        "muteHttpExceptions" : true,
        headers: {
        "Authorization": "Bearer XXXXXX",
        "Accept-Encoding": "gzip",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
            }
        }
    )
  var parsedRecordingInfo = JSON.parse(getAllRecordings);
  var urlToShare = parsedRecordingInfo["share_url"];
  return urlToShare;
}

function getEmailsForRecordingSend(){
  /* Sends the meeting recording to the pink hilighted recipients */
  var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();  
  var formattedDate = formatDate(d);
  var last_column_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getLastColumn();
  var end_date_unformatted = "";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var saveColumnTodayDate = 0;
  for(var x=3;x<=last_column_number;x++){
       end_date_unformatted = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1, x).getValue().toString();
    var formattedColumnDate = formatDate(end_date_unformatted);
    if(formattedColumnDate == formattedDate){
      saveColumnTodayDate = x;
    }
  }
  Logger.log(formattedColumnDate);
  var dend = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1, saveColumnTodayDate).getValue().toString();
  var recordingsArray = [];
  var emailsRecording = [];
  var last_row_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getLastRow();
   for(var x=2;x<last_row_number - 1;x++){
      var backColor= SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(x, saveColumnTodayDate).getBackground().toString();
     if(backColor=="#ff00ff"){
       recordingsArray.push(x);
     }
  }
  
  for (var x=0;x<recordingsArray.length;x++){
    var recordingEmailstoSend = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(recordingsArray[x],2).getValue().toString();
    emailsRecording.push(recordingEmailstoSend);
  }
  emailsRecording = emailsRecording.filter(Boolean)
  var clientEmailsString = emailsRecording.join();
  return clientEmailsString;
}

function sendRecordingEmails(){
  // send email recordings
  /*UNCOMMENT AFTER YOUTUBE LINK HAS BEEN SENT*/
  var emailsToSend = getEmailsForRecordingSend();
  var tonusRecordingLink = getTonusRecordingAndModifySettings();
  //Logger.log(emailsToSend);
  
 //var sendto = "clauisawesome@gmail.com";
  
  var recipientsTO = emailsToSend;
  //var recipientsTO = sendto;
  var email_subject = "Micheline Thursday / Jeudi Tonus Totale 🏋️ Recording";
  
  var email_body_tonus = "";
  
  var email_body_not_payed_fr = "<!DOCTYPE html><html><body><h1>Micheline Zoom Tonus Class</h1><p>Bonjour les amis,<br><br> Je vous envois le lien pour l'enregistrement\
                                du cours de Tonus ce soir. Un petit rappel que vous avez 7 jours pour visioner cet enregistrement. Svp envoyez moi un courriel apres d'avoir vu le video.<br>\
                                Voici le lien:<br>\
                                Lien:" +tonusRecordingLink +
                                "<br> Merci beaucoup et bonne semaine,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------";
  
  var email_body_not_payed_en = "<br><br>Hi Everyone,<br><br> I am sending you the link for tonight's Tonus recording. Just a small reminder that you have exactly 7 days\
                                 to view this recording before it gets deleted. Please send me a recording when you watch the video.<br>\
                                 Here is the link: <br>\
                                 Lien:" +tonusRecordingLink +
                              "<br> Thank you and have a nice week,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------"+ 
                              "</p></body></html>";
  
  var email_not_payed = email_body_not_payed_fr + email_body_not_payed_en;
  
   MailApp.sendEmail({
    to: recipientsTO,
    subject: email_subject,
    htmlBody: email_not_payed
  });
  
}
