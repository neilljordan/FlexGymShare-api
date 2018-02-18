const dripAccount = process.env.DRIP_ACCOUNT;
const dripToken = process.env.DRIP_TOKEN;
const client = require('drip-nodejs')({ token: dripToken, accountId: dripAccount });

exports.createSubscriber = (subscriberInfo) => {
  let payload = {};
  if (subscriberInfo) {
    payload = {
      subscribers: [subscriberInfo],
    };
  }

  client.createUpdateSubscriber(payload)
    .then((response) => {
      console.log(response.body);
    })
    .catch((error) => {
      console.warn(error);
    });
};
