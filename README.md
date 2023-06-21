
npm run dev


# TODO

Need to setup webhooks for Customer delete.
 - When a customer deletes their account, we need to remove the id from OUR DB



Customers can cancel subscriptions any time to prevent further billing but no refunds will be given.


Need to setup subscriptions webhook to update user account
    - onRenew
        - Update sub_end_date


Need a job setup to check OUR db for sub_end_dates and set subscribed=False when SUB has expired.



customer_id
subscribed
sub_end_date