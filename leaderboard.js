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
      return PlayersList.find({}, {sort: {score: -1, name: 1} })
    },
    'numberOfPlayers': function() {
      return PlayersList.find().count();
    },
    'goodmorning': function() {
      return 'GOOD MORNING'
    },
    'selectedClass': function() {
      var playedId = this._id
      var selectedPlayer = Session.get('selectedPlayer')
      if (playedId === selectedPlayer)
        return "selected"
      else
        return ""
    }
  })

  Template.leaderboard.events({
    'click .player': function() {
      // where this binding occurs?
      var playedId = this._id;
      // sessions allow us to store small pieces of data
      // that is not saved to the db
      Session.set('selectedPlayer', playedId)
    },
    'click .increment': function() {
      var selectedPlayer = Session.get('selectedPlayer')
      PlayersList.update(selectedPlayer, {$inc: {score: 5} })
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: -5} });
    }
  })
}




if(Meteor.isServer){
  console.log("Hello server");
}
