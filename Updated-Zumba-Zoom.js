function getCalendarZoomEvent(){
    // look at calendar and get event info.
    // getting my email's calendar and events
    var clau_calendar = CalendarApp.getCalendarById("clauisawesome@gmail.com"); 
    var sat_date_object = getSaturday(new Date()).toString(); // Ex: Thurs oct 7
    var fri_date_object = getFriday(new Date()).toString(); // Ex: Fri oct 8
    var sat_date = sat_date_object.split(" ");
    var fri_date = fri_date_object.split(" ");
    var events = clau_calendar.getEvents(new Date(fri_date[1] + " "+ fri_date[2] + " "+ fri_date[3]), new Date(sat_date[1] + " "+ sat_date[2] + " "+ sat_date[3]));
    var zoom_meeting = [];
    
    for (var event = 0; event < events.length;event++){
      Logger.log(events[event].getTitle());
      if (events[event].getTitle() == "Micheline Zoom Zumba"){
        var meeting_link = events[event].getDescription().split("Meeting")[1];
        var split1 = events[event].getDescription().split("Meeting ID:")[1];
        var meetingid = split1.split("Passcode:")[0].trim(); 
        var split3 = events[event].getDescription().split("Passcode:")[1];
        var password = split3.split("One tap mobile")[0].trim();
        zoom_meeting.push(meetingid,password,meeting_link);
      }
    }
    return zoom_meeting;
  }
  
  function getFriday(d) {
    var d = new Date();
    d.setDate(d.getDate() + (((5 + 7 - d.getDay()) % 7) || 7));
    Logger.log(d);
    return d;
  }
  
  function getSaturday(d) {
    var d = new Date();
    d.setDate(d.getDate() + (((6 + 7 - d.getDay()) % 7) || 7));
    Logger.log(d);
    return d;
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
        Logger.log(test);// get cloud recording email
        // TO DO-> FIGURE OUT
        // Get the first message in the first thread of your inbox
        Logger.log(i);
        message = GmailApp.getInboxThreads(i, 1)[0].getMessages()[0].getPlainBody(); // retrieves message with cloud recording subject. 
      }
      // Cloud Recording - claudia-france feochari's Personal Meeting Room is now available
      // if contains above, then take that and look inside the email to get info.
      // Take that info and send recording to users ( go to the function below)
    }
    var split1 = message.split("Copy the link below to share this recording with viewers:")[1];
    var recording_link = split1.split(" ")[0];
    Logger.log(recording_link);
    return recording_link;
    // get link
    // return link
  }
  
  function sendRecordingToUsers(){
    // MODIFY THIS ONE!!!
    // Send recording details to selected users in excel sheet
    var recording_link = getEmailsForRecording(); // rename getEmail();
    var emailsToSend = getEmailsForRecordingSend();
    
    var recipientsTO = emailsToSend;
    
    var email_subject = "Micheline Friday / Vendredi Zumba 💃 Recording";
    
     // REGULAR EMAIL 
    var email_body_fr = "<!DOCTYPE html><html><body><h1>Micheline Zoom Zumba Class</h1><p>Bonjour les Filles,<br><br> Je vous envois le lien pour l'enregistrement\
                                  du cours de Zumba cet apres-midi. Un petit rappel que vous avez 7 jours pour visioner cet enregistrement. Svp envoyez moi un courriel apres d'avoir vu le video.<br>\
                                  Voici le lien:<br>\
                                  Lien:" +recording_link +
                                  "<br> Merci beaucoup et bon weekend,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------";
    
    var email_body_en = "<br><br>Hi Girls,<br><br> I am sending you the link for this evening's Zumba recording. Just a small reminder that you have exactly 7 days\
                                   to view this recording before it gets deleted. Please send me a recording when you watch the video.<br>\
                                   Here is the link: <br>\
                                   Lien:" +recording_link+
                                "<br> Thank you and have a nice weekend,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------"+ 
                                "</p></body></html>";
    
    var email_not_payed = email_body_fr + email_body_en;
    
    // UNCOMMENT BELOW FOR AUTOMATION
   /*MailApp.sendEmail({
      to: recipientsTO,
      subject: email_subject,
      htmlBody: email_not_payed
    });*/
  }
  
  function getEmailsForRecordingSend(){
    /*Sends the meeting recording to the pink hilighted recipients */
    var zumba_clients_emails = [];
    var recordingsArray = [];
    var emailsRecording = [];
    var fri_date_object = getFriday(new Date()); // Ex: Fri oct 8
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
  
    var thisFriDate = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(1,dateposition).getValue(); // remove -2 here
    Logger.log(thisFriDate);
    for(var x=2;x<last_row_number-17;x++){
        var backColor= SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(x, dateposition).getBackground().toString();
        if(backColor=="#ff00ff"){
          recordingsArray.push(x);
        }
    }
    
    for (var x=0;x<recordingsArray.length;x++){
      var recordingEmailstoSend = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(recordingsArray[x],2).getValue().toString();
      emailsRecording.push(recordingEmailstoSend);
    }
    emailsRecording = emailsRecording.filter(Boolean);
    var zumba_clients_emails = emailsRecording.join();
    return zumba_clients_emails;
  }
  
  function sendMeetingDetailsUsers(){
    // Send meeting details to selected users in excel sheet
    var email_details = getCalendarZoomEvent();
    var zumba_clients_emails = [];
    var last_row_number = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getLastRow();
  
    for(var x=2;x<last_row_number-17;x++){
       zumba_clients_emails.push(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("2021").getRange(x, 2).getValue());
    }
    zumba_clients_emails= zumba_clients_emails.filter(Boolean)
    zumba_clients_emails.push('clauisawesome@gmail.com'); // here
  
    var client_emails_string = zumba_clients_emails.join();
    //var recipientsTO = client_emails_string;
    var recipientsTO = "clauisawesome@gmail.com"; // only uncomment when I want to actually send an email
    var email_subject = "Micheline Friday Zumba Zoom Workout"; // Change to Micheline Friday Zumba Zoom Workout
    var email_body_fr = "<!DOCTYPE html><html><body><h1>Micheline Zoom Zumba Class</h1><br/><br/>Bonjour la Gang de Zumba,<br><br> Je m'appelle Claudia Feochari et je\
                                suis la fille de Micheline et la gérante IT du Zoom Zumba avec Micheline. Je vous envois ce courriel pour vous rappeler qu'il y aura un\
                                Zumba Zoom virtuel ce Vendredi à 5:30 PM. Vous pouvez aller en ligne a 5:15PM. <br> On apprécie un donation de $6 pour ce cours car on paye\
                                pour le Zoom Pro pour que on peut vous donner un cours complet et de haute qualité d'une heure avec Zoom Pro. Si vous faites le Tonus\
                                Totale la semaine prochaine, le prix est réduit et sera 12$ qui inclut les deux cours pour la semaine prochaine. Envois moi un courriel\
                                si vous êtes intéressé de participer au Tonus la semaine prochaine si vous n’aviez pas faites cela encore.<br>Le courriel pour le\
                                e-transfer de $6  :claudia.f.feochari@hotmail.com<br>Pour le e-transfer, SVP utilise le mot de passe ZUMBA avec tous les lettres en\
                                majuscule. Si cela ne marche pas, utilise ZUMBAZUMBA.<br>Si vous avez des questions concernant le e-transfer, envoyez moi un courriel.\
                                Je pourrais vous donner de l'assistance sur un appel Zoom si vous avez des questions. J'ai fait cela avec quelqu'un déjà, n'hésitez pas\
                                de me contacter par courriel si vous avez des questions.<br>Voici les détails pour le meeting Zoom ce Vendredi:<br>"+"Meeting Id: "
                                +email_details[0]+ "<br> Password: " +email_details[1]+"<br>" + "Lien:" + email_details[2] +
                                "<br> Merci beaucoup et je vous vois Vendredi 😍,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------";
    
    var email_body_en = "<br><br>Hi Everyone,<br><br>I'm Claudia Feochari, Micheline's daughter and Zoom Zumba with Micheline IT Manager. I am emailing you to remind\
                                you that a Zumba class is going to occur in the living room this Friday at 5:30PM. You can come on to the meeting at 5:15PM. <br>We would highly appreciate a 5$ donation for this\
                                week as we are giving you the real full 1 hour Tonus Total experience with Zoom Pro. If you decide to do\
                                the Tonus Totale class next week, the total amount for both classes next week will be 12$. If you haven’t already let me know you were interested\
                                in Tonus Totale next week, please send me an email so I could add you to my list. <br> We would highly appreciate a 6$ donation for this week in\
                                order to cover the cost of using Zoom Pro as we have got it in order to lift the 40 minute limit in order to give you the real full 1hour Zumba\
                                experience. <br>Please e-transfer the $6 to this email address:\ <br> claudia.f.feochari@hotmail.com<br>For the e-transfer, please use the password\
                                ZUMBA with all capital letters. If that does not work, please use the password ZUMBAZUMBA.<br>Please let me know if you are having issues with the e-transfer,\
                                I have provided live assistance for someone last week so feel free to email me if you are having difficulties as I am willing to provide live assistance in the\
                                form of a Zoom call for this.<br>Here are the details for Friday’s Meeting:<br>" +"Meeting Id: "+email_details[0]+ "<br> Password: " +email_details[1]+"<br>" +
                                "Meeting Link:" + email_details[2] +
                                "<br> Thank you and see you Friday 😍,"+"<br>"+"Claudia Feochari"+"<br><br>-----------------------------------------------------------------------------------------------------------------"+ 
                                "</p></body></html>";
    var email_not_payed = email_body_fr + email_body_en;
    var email_subject_christmas = "Micheline Tuesday Zumba Christmas Schedule 🎄/ Mardi Zoom Zumba Schedule de Noel 🎄";
    
   
    /*var email_christmas_fr =   "<!DOCTYPE html><html><body><h1>Micheline Zoom Zumba Class Christmas Schedule 🎄</h1><p>Bonjour les filles, alors juste un petit rappel que Mardi apres midi le 29 Decembre a 5:30Pm on a le cours de Zumba.\
                                 Merci ❤ et a Mardi,"+"<br>"+"Claudia Feochari"+"<br></p></body></html>";
  
    var email_christmas_en =   "<!DOCTYPE html><html><body><h1>Micheline Zoom Zumba Class Christmas Schedule 🎄</h1><p>Hi girls! Just a small reminder that the Zumba class will be taking place Tuesday afternoon 29 Decembre at 5:30PM.\
                                 Thank you ❤ and see you Tuesday"+"<br>"+"Claudia Feochari"+"<br></p></body></html>";
    
    
    var email_christmas = email_christmas_fr + email_christmas_en + email_not_payed;*/
  
    MailApp.sendEmail({
      to: recipientsTO,
      subject: email_subject, // usually use this but for christmas we wont
      htmlBody: email_not_payed 
    });
    
  }
    
  