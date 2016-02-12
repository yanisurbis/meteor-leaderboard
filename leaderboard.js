console.log('Hello World')

PlayersList = new Mongo.Collection('players')

// we have access to this collection on the client
// insert, update, remove, find

// PlayersList.find()
// PlayersList.find().fetch()
// PlayersList.find({ name: "John" })
// PlayersList.find().count()
// PlayersList.insert({ name: "John", score: 0 })

if(Meteor.isClient){
    console.log("Hello client");

    // old way of doing stuff
    Template.leaderboard.helpers({
      'player': function() {
        return PlayersList.find()
      },
      'numberOfPlayers': function() {
        return PlayersList.find().count()
      },
      'goodmorning': function() {
        return 'GOOD MORNING'
      }
    })
}

if(Meteor.isServer){
    console.log("Hello server");
}
