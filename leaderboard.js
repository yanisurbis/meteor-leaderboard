// autopublish - sync all our db with user db
// insecure - inserting data into the db

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
  Meteor.subscribe('thePlayers')

  console.log("Hello client");

  // old way of doing stuff
  Template.leaderboard.helpers({
    'player': function(){
      return PlayersList.find({}, {sort: {score: 1, name: 1}});
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
    },
    'showSelectedPlayer': function() {
      var selectedPlayer = Session.get('selectedPlayer')
      return PlayersList.findOne(selectedPlayer)
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
      Meteor.call('modifyPlayerScore', selectedPlayer, 5)
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, -5)
    },
    'click .remove': function() {
      var question = "Do you really want to delete player?";
      var remove = confirm(question);

      if (remove) {
        var selectedPlayer = Session.get('selectedPlayer');
        Meteor.call('removePlayerData', selectedPlayer);
      }
    }
  })

  // working with events
  Template.addPlayerForm.events({
    // for both pressing 'return' and click event
    'submit form': function(event) {
      event.preventDefault()
      // alternative is 'return false'
      // learn more about DOM in JS
      var playerNameVar = event.target.playerName.value
      var playerScoreVar = event.target.playerScore.value
      event.target.playerScore.value = ""
      event.target.playerName.value = ""

      var currentUserId = Meteor.userId();

      Meteor.call('insertPlayerData', playerNameVar, playerScoreVar);
    }
  });
}




if(Meteor.isServer){
  console.log("Hello server");

  Meteor.publish('thePlayers', function(){
    // currently logged-in user (? Meteor.userId())
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId})
  });

  // secure way to insert data into the db
  Meteor.methods({
    'insertPlayerData': function(playerNameVar, playerScoreVar){
      // currently logged-in user
      var currentUserId = Meteor.userId()
      PlayersList.insert({
          name: playerNameVar,
          score: playerScoreVar,
          createdBy: currentUserId
      })
    },
    'removePlayerData': function(selectedPlayer){
      var currentUserId = Meteor.userId();
      PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});
    },
    'modifyPlayerScore': function(selectedPlayer, scoreValue){
      var currentUserId = Meteor.userId();
      PlayersList.update( {_id: selectedPlayer, createdBy: currentUserId},
                          {$inc: {score: scoreValue} });
    }
  })
}
