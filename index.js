const express = require('express');
const paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox',
  'client_id': 'Ae99AZ_1g7IKPvnqxYc1hLtamZVaJ3_7paiirj2QI-e16Z1FJrjlfDDvDjr_dUEElCB-TIzC4DBhrRTe',
  'client_secret': 'EK_pW8VuZGeXTGD7iL9o48mAjKVpp4nBEDP1Jn4rz1CA07iETRirHJb6lp6Jj5T9IDNUGbdk01OukFlc'
});
const app = express();

app.post('/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Red Sox Hat",
                  "sku": "001",
                  "price": "25.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "25.00"
          },
          "description": "Hat for the best team ever"
      }]
  };
  app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "25.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.send('Success');
      }
  });
  });
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                
                res.redirect(payment.links[i].href);
              }
            }
        }
      });
      
      });
  app.get('/cancel', (req, res) => res.send('Cancelled'));


app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(3000, () => console.log(`Server Started on 3000`));

