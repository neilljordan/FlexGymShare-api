const express = require('express');
const knex = require('../knex');

const router = express.Router();

const sellerPercentage = 0.2; // the percentage the seller gets of the order total

// create an account balance (credit) transaction record in the DB and return the result
function createBalanceCreditTransaction(userId, orderId, orderAmount) {
  return new Promise((resolve, reject) => {
    const creditAmount = orderAmount * sellerPercentage;
    knex('transaction')
      .insert({
        date: new Date(),
        amount: creditAmount, // convert back to dollars and make negative
        transaction_type_id: 4, // creating a Used Credit credit type
        user_id: userId,
        order_id: orderId,
        charge_code: null,
        description: 'Earned statement credit for Flex Pass sale',
        status: 'earned',
      })
      .returning('id')
      .then((rows) => {
        resolve(rows);
      })
      .catch(err => reject(Error(`Unable to create earned credit transaction record: ${err}`)));
  });
}

router.get('/orders', (req, res, next) => {
  knex('order')
    .leftJoin('pass_type', 'pass_type.id', 'order.pass_type_id')
    .leftJoin('user', 'user.id', 'order.user_id')
    .leftJoin('order_type', 'order_type.id', 'order.order_type_id')
    .select('order.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'order_type.name as order_type_name')
    .orderBy('order.id')
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/orders/user/:id', (req, res, next) => {
  const userId = req.params.id;
  knex('order')
    .leftJoin('pass_type', 'pass_type.id', 'order.pass_type_id')
    .leftJoin('user', 'user.id', 'order.user_id')
    .leftJoin('order_type', 'order_type.id', 'order.order_type_id')
    .select('order.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'order_type.name as order_type_name')
    .orderBy('order.id')
    .where('order.user_id', userId)
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      next(err);
    });
});

// get orders for a particular gym
router.get('/orders/gym/:gym_id', (req, res, next) => {
  const gymId = req.params.gym_id;
  knex('order')
    .leftJoin('pass_type', 'pass_type.id', 'order.pass_type_id')
    .leftJoin('user', 'user.id', 'order.user_id')
    .leftJoin('order_type', 'order_type.id', 'order.order_type_id')
    .select('order.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'order_type.name as order_type_name')
    .orderBy('order.id')
    .where('order.gym_id', gymId)
    .then((rows) => {
      res.json(rows);
    })
    .catch(err => next(err));
});

router.get('/orders/:id', (req, res, next) => {
  const orderId = req.params.id;
  knex('order')
    .leftJoin('pass_type', 'pass_type.id', 'order.pass_type_id')
    .leftJoin('user', 'user.id', 'order.user_id')
    .leftJoin('order_type', 'order_type.id', 'order.order_type_id')
    .select('order.*', 'pass_type.name as pass_name', 'user.first_name as user_first_name', 'user.last_name as user_last_name', 'user.email as user_email', 'order_type.name as order_type_name')
    .orderBy('order.id')
    .where('order.id', orderId)
    .then((orders) => {
      res.json(orders[0]);
    })
    .catch(err => next(err));
});

router.post('/orders', (req, res, next) => {
  const {
    date,
    amount,
    user_id,
    gym_id,
    pass_type_id,
  } = req.body;

  const cartAmount = parseFloat(amount);
  let listerId = null;

  // link the order to an existing listing (if available)
  knex('listing')
    .first('listing.id', 'listing.lister_id')
    .leftJoin('public.order', 'public.order.listing_id', 'listing.id')
    .where('listing.gym_id', gym_id)
    .andWhere('listing.date', date)
    .whereNull('public.order.id')
    .orderBy('listing.created_at')
    .then((listingRows) => {
      console.log(listingRows);
      listerId = (listingRows !== undefined) ? listingRows.lister_id : null;
      knex('order')
        .insert({
          date,
          amount: cartAmount,
          user_id,
          gym_id,
          pass_type_id,
          order_type_id: 1, // buy a pass
          listing_id: (listingRows !== undefined) ? listingRows.id : null, // use the listing if available
        })
        .returning('*')
        .then((orderRows) => {
          res.json(orderRows[0]);
          return orderRows[0].id;
        })
        .then((orderId) => {
          createBalanceCreditTransaction(listerId, orderId, cartAmount);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.delete('/orders/:id', (req, res, next) => {
  const orderId = req.params.id;
  knex('order')
    .del()
    .where('order.id', orderId)
    .then((rows) => {
      res.json(rows); // returs the number of rows deleted
    })
    .catch(err => next(err));
});

module.exports = router;
