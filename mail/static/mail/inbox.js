console.log("hehe")
document.addEventListener('DOMContentLoaded', function() {
  console.log("hehe2")
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
  
  if(mail===""){
    // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  }
  else{
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
  }
  fetch(`/emails/${mailid}`,{
    method: 'GET',
  })
  .then(response => response.json())
  .then(email => {
      //display mail

    const card = document.createElement('button')
    card.className='card'
    const cardheader = document.createElement('div')
    cardheader.className= "card-header"
    const cardflexheader = document.createElement('div')
    cardflexheader.className= "d-flex justify-content-between"
    const cardsender = document.createElement('p')
    cardsender.className="card-title"
    const carddate = document.createElement('p')
    carddate.className="card-title"
    const cardbody = document.createElement('div')
    cardbody.className="card-text"
    const cardfooter = document.createElement('div')
    cardfooter.className="card-footer text-muted"

    card.append(cardheader,cardbody,cardfooter)
    cardheader.append(cardflexheader)
    cardflexheader.append(cardsender,carddate)

    // <div class="card">
    //   <h5 class="card-header">Featured</h5>
    //   <div class="card-body">
    //     <h5 class="card-title">Special title treatment</h5>
    //     <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    //     <a href="#" class="btn btn-primary">Go somewhere</a>
    //   </div>
    // </div>




      const replybutton = document.createElement('button')
      replybutton.className="btn btn-sm btn-outline-primary"
      replybutton.innerHTML='Reply'


      // const mailunit = document.createElement('div')
      // mailunit.className= "mailunit"
      // const sender = document.createElement('p')
      // sender.className="sender"
      // const body = document.createElement('p')
      // body.className="body"
      // const timestamp = document.createElement('p')
      // timestamp.className="timestamp"


      cardsender.innerHTML = email.sender
      cardbody.innerHTML = email.body
      carddate.innerHTML = email.timestamp
      
      
      //mailunit.append(sender,body,timestamp, replybutton);


      if (email.read == true){
        cardbody.style.backgroundColor="lightgray";
      }
      replybutton.addEventListener('click', () => {
        compose_email(email);
      });
      

      cardfooter.append(replybutton)
      document.querySelector('#detailed-mail-view').append(card);
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
      emails.forEach(email => {
        
        const card = document.createElement('div')
        card.className='card'
        const cardheader = document.createElement('div')
        cardheader.className= "card-header"
        const cardflexheader = document.createElement('div')
        cardflexheader.className= "d-flex justify-content-between"
        const cardsender = document.createElement('p')
        cardsender.className="card-title"
        const carddate = document.createElement('p')
        carddate.className="card-title"
        const cardtext = document.createElement('p')
        cardtext.className="card-text"
        const cardbody = document.createElement('div')
        cardbody.className="card-body"
        const cardfooter = document.createElement('div')
        cardfooter.className="card-footer text-muted"
    
        card.append(cardheader,cardbody,cardfooter)
        cardbody.append(cardtext)
        cardheader.append(cardflexheader)
        cardflexheader.append(cardsender,carddate)
    


        // const mailunit = document.createElement('div')
        // mailunit.className= "mailunit"
        // const sender = document.createElement('p')
        // sender.className="sender"
        // const body = document.createElement('p')
        // body.className="body"
        // const timestamp = document.createElement('p')
        // timestamp.className="timestamp"


        cardsender.innerHTML = email.sender
        cardtext.innerHTML = email.body
        carddate.innerHTML = email.timestamp


        if(mailbox!=='sent'){
          const archivebutton = document.createElement('button')
          archivebutton.className="btn btn-sm btn-outline-primary"
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
          cardfooter.append(archivebutton)
        }


        // else{
        //   mailunit.append(sender,body,timestamp);
        // }
        
        if (email.read == true){
          cardbody.style.backgroundColor="lightgray";
        }
        card.addEventListener('click', () => {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
          }).then(()=>view_mail(email.id))
        });
        
        document.querySelector('#emails-view').append(card);
      });
  });

}

function send_email(){
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  }).then(()=>load_mailbox('sent'));
  
}