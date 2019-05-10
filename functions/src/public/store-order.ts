import * as functions from 'firebase-functions';
import { Order } from '../../../shared-models/orders/order.model';
import { adminFirestore } from '../db';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';



// import { PubSub } from '@google-cloud/pubsub';
// const pubSub = new PubSub();

/////// DEPLOYABLE FUNCTIONS ///////

export const saveOrderInFirestore = functions.pubsub.topic('save-order').onPublish( async (message, context) => {
  const db = adminFirestore;

  console.log('Raw message from pubsub', message);
  console.log('Context from pubsub', context);
  const order = message.json as Order;
  console.log('Message converted to order', order);

  const fbRes = await db.collection(FbCollectionPaths.ORDERS).doc().set(order)
    .catch(error => console.log(error));
    console.log('Order stored', fbRes);
    return fbRes;
})

// // Listen for incoming orders from public site
// export const storeOrder = functions.https.onRequest( async (req, res): Promise<any> => {

//   if (req.method === 'PUT') {
//     return res.status(403).send('Forbidden!');
//   }
  
//   console.log('Store order function invoked', req.headers);

//   const orderData: Order = req.body;
//   res.write('Order data successfully received to http handler');

//   req.on('error', (e) => {
//     console.log(`Problem recieving request: ${e}`);
//     res.status(req.statusCode as number).send(e);
//   });

//   // await saveOrderInFirestore(orderData)
//   //   .catch(err => console.log('Error storing in firebase', err));

//   const topic = pubSub.topic('save-order');

//   const topicPublishRes = await topic.publishJSON(orderData).catch(err => console.log('Publish to topic failed', err));
//   console.log('Res from topic publish', topicPublishRes);

//   return res.status(200).send();

// });


