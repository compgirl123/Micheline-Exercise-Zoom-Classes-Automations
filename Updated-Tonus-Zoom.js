function getThursday(d) {
  var d = new Date();
  if(d.getDay() == 4){
    d.setDate(d.getDate());
  }
  else{
    d.setDate(d.getDate() + (((4 + 7 - d.getDay()) % 7) || 7));
  }
  
  //d.setDate(d.getDate() + (((4 + 7 - d.getDay()) % 7) || 7));
  Logger.log(d);
  return d;
}

function getFriday(d) {
  var d = new Date();
  d.setDate(d.getDate() + (((5 + 7 - d.getDay()) % 7) || 7));
  Logger.log(d);
  return d;
}

function getCalendarZoomEvent(){
  // look at calendar and get event info.
  // getting my email's calendar and events
  var clau_calendar = CalendarApp.getCalendarById("clauisawesome@gmail.com"); 
  var thurs_date_object = getThursday(new Date()).toString(); // Ex: Thurs oct 7
  var fri_date_object = getFriday(new Date()).toString(); // Ex: Fri oct 8
  var thurs_date = thurs_date_object.split(" ");
  var fri_date = fri_date_object.split(" ");
  var events = clau_calendar.getEvents(new Date(thurs_date[1] + " "+ thurs_date[2] + " "+ thurs_date[3]), new Date(fri_date[1] + " "+ fri_date[2] + " "+ fri_date[3]));
  //var testevent = clau_calendar.getEvents(new Date("Nov 4 2021"), new Date("Nov 5 2021"));
  var zoom_meeting = [];
  
  for (var event = 0; event < events.length;event++){
    if (events[event].getTitle() == "Micheline Zoom Tonus"){
      var meeting_link = events[event].getDescription().split("Meeting")[1];
      var split1 = events[event].getDescription().split("Meeting ID:")[1];
      var meetingid = split1.split("Passcode:")[0].trim(); 
      var split3 = events[event].getDescription().split("Passcode:")[1];
      var password = split3.split("One tap mobile")[0].trim();
      zoom_meeting.push(meetingid,password,meeting_link);
    }
  }
  
  return zoom_meeting;
  // search for thursday, get info
  // send to people according to that, remove api calls. 
  // copy/ paste recording link weekly on the google sheets to be sent to clients. 
}

function sendMeetingDetailsUsers(){
  // Send meeting details to selected users in excel sheet
  var email_details = getCalendarZoomEvent();
  Logger.log(email_details);
  var zumba_clients_emails = [];
  var last_row_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getLastRow();

  for(var x=2;x<last_row_number-1;x++){
     zumba_clients_emails.push(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(x, 2).getValue());
  }
  zumba_clients_emails= zumba_clients_emails.filter(Boolean);
  zumba_clients_emails.push('clauisawesome@gmail.com');
  Logger.log(zumba_clients_emails);
  
  var client_emails_string = zumba_clients_emails.join(); 
  var recipientsTO = client_emails_string; // only uncomment when I want to actually send an email
  //var recipientsTO = "clauisawesome@gmail.com"; // only uncomment when I want to actually send an email
  var email_subject = "Micheline Thursday / Jeudi Tonus Totale 🏋️ Zoom Workout";
  var email_body_fr = "<!DOCTYPE html><html><body><h1>Micheline Zoom Tonus Class</h1><p>Bonjour la Gang de Tonus Totale,<br><br> Je m'appelle Claudia Feochari\
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
                              +email_details[0]+ "<br> Password: " +email_details[1]+"<br>" + "Lien:" + email_details[2] +
                              "<br> Merci beaucoup et je vous vois Jeudi 😍,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------";
  
  var email_body_en = "<br><br>Hi Everyone,<br><br>I'm Claudia Feochari, Micheline's daughter and Zoom Tonus Total with Micheline IT Manager. I am emailing you\
                              to remind you that a Tonus Total class is going to occur in the living room this Thursday at 17:30pm. You can come on to the meeting at\
                              17:15pm. For the Toning class, you will need weights if you have if not 2 water bottles filled up with water will do. You will also need\
                              a chair, a mat if you have if not a towel so you can do the ab workouts on the floor. <br>We would highly appreciate a 6$ donation for this\
                              week as we are giving you the real full 1 hour Tonus Total experience with Zoom Pro. If you decide to partake in Zumba at 5:30pm on Fridays,\
                              the price is 12$ which includes both classes Tonus Total as well as Zumba.<br>Please e-transfer the money to:\
                              <br> claudia.f.feochari@hotmail.com<br>For the e-transfer for tonus ONLY, please use the password TONUS1 with all capital letters.<br>\
                              If you decide to use both Tonus and Zumba, please use the password ZUMBA with all capital letters. If that does not work, please use\
                              the password ZUMBAZUMBA.<br>Please let me know if you are having issues with the e-transfer, I have provided live assistance for someone\
                              before so feel free to email me if you are having difficulties as I am willing to provide live assistance in the form of a Zoom call for this.\
                             .<br>Here are the details for Thursday’s Meeting: <br>"+"Meeting Id: "+email_details[0]+ "<br> Password: " +email_details[1]+"<br>" +
                              "Meeting Link:" + email_details[2] +
                              "<br> Thank you and see you Thursday 😍,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------"+ 
                              "</p></body></html>";
  var email_subject_christmas = "Micheline Thursday Tonus Totale 🏋️ Zoom Workout";
  
 /* 
 CHRISTMAS SPECIAL!!!
 var email_body_not_payed_fr =   "<!DOCTYPE html><html><body><h1>Micheline Zoom Tonus Class Christmas Schedule 🎄</h1><p>Bonjour les filles, alors juste un petit rappel que demain soir a 5:30 on a le. cours de Tonus.\
                               J'ai envoye le courriel maintenant pour demain. N'oubliez pas que le cours est demain et PAS JEUDI car c'est la veille de noel ce jeudi. La meme chose la semaine\
                               prochaine, le tonus est lundi a 5:30 car jeudi est la veille de nouvelle annee. Merci ❤ et a demain,"+"<br>"+"Claudia Feochari"+"<br></p></body></html>";
  var email_body_not_payed_en =   "<!DOCTYPE html><html><body><h1>Micheline Zoom Tonus Class Christmas Schedule 🎄</h1><p>Hi girls! Just a small reminder that the Tonus class will be taking place tomorrow evening at 5:30 PM\
                               and not Thursday at 5:30PM since it is Christmas Eve.  The same thing applies next week , the class will be Monday too since Thursday is New years eve. \
                               Thank you ❤ and see you tomorrow"+"<br>"+"Claudia Feochari"+"<br></p></body></html>";*/

 
  var email = email_body_fr + email_body_en;
  Logger.log(email);
  
  MailApp.sendEmail({
    to: recipientsTO,
    subject: email_subject, // usually use this but for christmas we wont
    htmlBody: email, // usually use this but for christmas we wont
  });
  
}

function getEmailsForRecording(){
  // Rename this function to something more appropriate
  // Search Gmail for email title related to recording.
  // Log the subject lines of up to the first 50 emails in your Inbox

  var threads = GmailApp.getInboxThreads(0, 10);
  var message = "";
  for (var i = 0; i < threads.length; i++) {
    var test = threads[i].getFirstMessageSubject().split("Cloud Recording");
    Logger.log(test.length);
    if(test.length == 2){
      message = GmailApp.getInboxThreads(i, 1)[0].getMessages()[0].getPlainBody(); // retrieves message with cloud recording subject. 
    }
    // Cloud Recording - claudia-france feochari's Personal Meeting Room is now available
    // if contains above, then take that and look inside the email to get info.
    // Take that info and send recording to users ( go to the function below)
  }
  var split1 = message.split("Copy the link below to share this recording with viewers:")[1];
  var recording_link = split1.split(" ")[0];
  return recording_link;
}


function getEmailsForRecordingSend(){
  /*Sends the meeting recording to the pink hilighted recipients */
  var zumba_clients_emails = [];
  var recordingsArray = [];
  var emailsRecording = [];
  var fri_date_object = getThursday(new Date()); // Ex: Fri oct 8
  Logger.log(fri_date_object);
  var last_column_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getLastColumn();
  var last_row_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getLastRow();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nextFriDate = 0;
  var dateposition = 0;
  for(var y=4;y<last_column_number;y++){
    var date_col = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1,y).getValue();
    if(date_col.getMonth() == fri_date_object.getMonth()){ 
      if(date_col.getDate() == fri_date_object.getDate()){
        var dateposition = y;
      }
  }
  }

  var thisFriDate = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(2,dateposition).getValue(); // remove -2 here
  Logger.log(thisFriDate);
  for(var x=2;x<last_row_number-17;x++){
      var backColor= SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(x, dateposition).getBackground().toString();
      if(backColor=="#ff00ff"){
        recordingsArray.push(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(x, 2).getValue());
        Logger.log(recordingsArray);
      }
  }
  
  /*for (var x=0;x<recordingsArray.length;x++){
    //var recordingEmailstoSend = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(recordingsArray[x],2).getValue().toString();
    emailsRecording.push(recordingEmailstoSend);
  }*/
  var emailsRecording = recordingsArray.filter(Boolean);
  Logger.log("HAHA"+ emailsRecording);
  var zumba_clients_emails = emailsRecording.join();
  Logger.log("ICI"+zumba_clients_emails);
  return zumba_clients_emails;
}

function sendRecordingToUsers(){
  // Send recording details to selected users in excel sheet
  var recording_link = getEmailsForRecording();
  var emailsToSend = getEmailsForRecordingSend();
  
  var recipientsTO = emailsToSend;
  Logger.log("HERE"+ emailsToSend);
  
  var email_subject = "Micheline Thursday / Jeudi Tonus Totale 🏋️ Recording";
  
  var email_body_tonus = "";
  
  var email_body_fr = "<!DOCTYPE html><html><body><h1>Micheline Zoom Tonus Class</h1><p>Bonjour les amis,<br><br> Je vous envois le lien pour l'enregistrement\
                                du cours de Tonus ce soir. Un petit rappel que vous avez 7 jours pour visioner cet enregistrement. Svp envoyez moi un courriel apres d'avoir vu le video.<br>\
                                Voici le lien:<br>\
                                Lien:" +recording_link +
                                "<br> Merci beaucoup et bonne semaine,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------";
  
  var email_body_en = "<br><br>Hi Everyone,<br><br> I am sending you the link for tonight's Tonus recording. Just a small reminder that you have exactly 7 days\
                                 to view this recording before it gets deleted. Please send me a recording when you watch the video.<br>\
                                 Here is the link: <br>\
                                 Lien:" +recording_link  +
                              "<br> Thank you and have a nice week,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------"+ 
                              "</p></body></html>";
  
  var email_not_payed = email_body_fr + email_body_en;
  
  // UNCOMMENT BELOW FOR AUTOMATION
 MailApp.sendEmail({
    to: recipientsTO,
    subject: email_subject,
    htmlBody: email_not_payed
  });
}



