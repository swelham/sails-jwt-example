# sails-jwt-example

A sails.js user management example using JWT for authorisation

# todo

* ~~Registration~~
* ~~Login~~
* ~~Token generation & valiadtion~~
* ~~Password reset~~
* ~~Account locking~~
* Correct the way token expiration is handled (should set the expire time in the token)
* Update the request header to use ```Authorization: Bearer {token}```
* User emails - need to decide how to handle user email address
    * 1 - option to store email as username or separate property
    * 2 - always store email as a property and copy email to username
    * 3 - make emailing optional 
* Code documentation
* Tests
