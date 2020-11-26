document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', ()=>compose_email(""));
  document.querySelector('#submit-button').addEventListener('click', send_email);
  
  // By default, load the inbox
  load_mailbox('inbox');
  
});

function compose_email(mail) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#detailed-mail-view').style.display = 'none';
  
  console.log("HELP");
  if(mail===""){
    console.log("empty");
    // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  }
  else{
    console.log("not empty");
    //fill data
    document.querySelector('#compose-recipients').value = mail.sender;
    document.querySelector('#compose-subject').value = `Re: ${mail.subject}`;
    document.querySelector('#compose-body').value = `On ${mail.timestamp} ${mail.sender} wrote: \n ${mail.body}`;
  }
  
}

function view_mail(mailid){
  // Show the mail and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#detailed-mail-view').style.display = 'block';
  //clearing container
  const node = document.querySelector('#detailed-mail-view');
  while(node.firstChild){
    document.querySelector('#detailed-mail-view').removeChild(node.lastChild);
    console.log("im TRYING");
  }
  console.log("try harder");
  fetch(`/emails/${mailid}`,{
    method: 'GET',
  })
  .then(response => response.json())
  .then(email => {
      // Print emails

      // ... do something else with emails ...


      //mark as read
      

      //display mail
      const replybutton = document.createElement('button')
      replybutton.innerHTML='Reply'
      const mailunit = document.createElement('div')
      mailunit.className= "mailunit"
      const sender = document.createElement('p')
      sender.className="sender"
      const body = document.createElement('p')
      body.className="body"
      const timestamp = document.createElement('p')
      timestamp.className="timestamp"
      sender.innerHTML = email.sender
      body.innerHTML = email.body
      timestamp.innerHTML = email.timestamp
      mailunit.append(sender,body,timestamp, replybutton);
      if (email.read == true){
        mailunit.style.backgroundColor="lightgray";
      }
      replybutton.addEventListener('click', () => {
        compose_email(email);
      });
      
      console.log(mailunit)
      document.querySelector('#detailed-mail-view').append(mailunit);
      });
        
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#detailed-mail-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  fetch(`/emails/${mailbox}`,{
    method: 'GET',
  })
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      emails.forEach(email => {
        console.log(email.archived== false)
        
        const mailunit = document.createElement('div')
        mailunit.className= "mailunit"
        const sender = document.createElement('p')
        sender.className="sender"
        const body = document.createElement('p')
        body.className="body"
        const timestamp = document.createElement('p')
        timestamp.className="timestamp"
        sender.innerHTML = email.sender
        body.innerHTML = email.body
        timestamp.innerHTML = email.timestamp
        if(mailbox!=='sent'){
          const archivebutton = document.createElement('button')
          if (email.archived== false){
            archivebutton.innerHTML='Archive';
            archivebutton.addEventListener('click', () => {
              event.stopPropagation();
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: true
                })
              }).then(()=>load_mailbox('inbox'))
            });
          }
          else{
            archivebutton.innerHTML='Unarchive';
            archivebutton.addEventListener('click', () => {
              event.stopPropagation();
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: false
                })
              }).then(()=>load_mailbox('inbox'))
            });
          }
          mailunit.append(sender,body,timestamp,archivebutton)
        }
        else{
          mailunit.append(sender,body,timestamp);
        }
        
        if (email.read == true){
          mailunit.style.backgroundColor="lightgray";
        }
        mailunit.addEventListener('click', () => {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
          }).then(()=>view_mail(email.id))
        });
        
        console.log(mailunit)
        document.querySelector('#emails-view').append(mailunit);
      });
        


  });

}

function send_email(){
  console.log("WORKS");
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  }).then(()=>load_mailbox('sent'));
  // .then(response => response.json())
  // .then(result => {
  //     console.log(result);
  //     event.preventDefault();
  //     load_mailbox('sent');
  // });
  
}