# BillRift Server
The back-end of the BillRift app

## How to run
- Start the mongo db instance
```
$ mongod
```
- Run the server  
```
$ npm run dev
```

### Models
Group:
  - id : Number,
  - name : String,
  - userIds : Array
  
User:
  - name : String,
  - googleId : String,
  - groupIds: Array

Transaction:  
  - id : Number  
  - userFromId : String  
  - userToId :  String  
  - amount : Number 
  
Balance (Only as contract with application, doesn't have to be implemented as persistent model on backend):
  - from : String
  - to : String
  - amount : Number
  - groupId : Number
  
### Endpoints 
pass in idToken as `authToken=<token>` in header to all of the endpoints to authenticate  
#### Groups
`GET /groups` - Get the list of group objects. --DONE  
`POST /group?name={groupName}` - add a new group to the user --DONE  
`GET /group/:id/balances` - Get the list of balances for a group identified by id. --BLOCKED TOO HARD  
`GET /group/:id/transactions` - Get the list of transactions for a group identified by id. --ZAL INPROGRESS  
`GET /group/:id/users` - Get the lits of users from a group identified by id --DONE  
`POST /group/:id/user?email={email}` - add a user to a group --DONE  
`POST /group/:id/transaction` - add a new transaction to the group. --ZAL INPROGRESS  
#### User
`GET /user` - test API to return all users --DONE  
`POST /user/login` - log in --DONE
