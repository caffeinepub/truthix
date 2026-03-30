import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Question = {
    id : Nat;
    text : Text;
    category : Text;
    difficulty : Nat;
  };

  type GameSession = {
    sessionId : Nat;
    mode : Text;
    truthScore : Nat;
    timestamp : Time.Time;
  };

  module GameSession {
    public func compareByScore(session1 : GameSession, session2 : GameSession) : Order.Order {
      Nat.compare(session2.truthScore, session1.truthScore);
    };
  };

  let gameSessions = Map.empty<Nat, GameSession>();
  var nextSessionId = 1;

  let questions = [
    // Kids
    { id = 1; text = "Do you believe in fairies?"; category = "kids"; difficulty = 1 },
    { id = 2; text = "Have you ever eaten a bug?"; category = "kids"; difficulty = 1 },
    { id = 3; text = "What's your favorite cartoon character?"; category = "kids"; difficulty = 1 },
    // Teen
    { id = 4; text = "Have you ever cheated on a test?"; category = "teen"; difficulty = 2 },
    { id = 5; text = "What's your biggest fear?"; category = "teen"; difficulty = 2 },
    { id = 6; text = "Have you ever lied to your parents?"; category = "teen"; difficulty = 2 },
    // Young
    { id = 7; text = "What's the craziest thing you've done at a party?"; category = "young"; difficulty = 3 },
    { id = 8; text = "Have you ever had a one-night stand?"; category = "young"; difficulty = 3 },
    { id = 9; text = "What's your biggest regret?"; category = "young"; difficulty = 3 },
    // Party
    { id = 10; text = "What's your go-to dance move?"; category = "party"; difficulty = 4 },
    { id = 11; text = "Have you ever kissed someone at a party?"; category = "party"; difficulty = 4 },
    { id = 12; text = "What's the most embarrassing thing you've done while drunk?"; category = "party"; difficulty = 4 },
    // Professional
    { id = 13; text = "Have you ever lied on your resume?"; category = "professional"; difficulty = 5 },
    { id = 14; text = "What's your biggest mistake at work?"; category = "professional"; difficulty = 5 },
    { id = 15; text = "Have you ever gossiped about a coworker?"; category = "professional"; difficulty = 5 },
    // Intimate
    { id = 16; text = "What's your biggest turn-on?"; category = "intimate"; difficulty = 6 },
    { id = 17; text = "Have you ever had a crush on a friend's partner?"; category = "intimate"; difficulty = 6 },
    { id = 18; text = "What's your most embarrassing sexual experience?"; category = "intimate"; difficulty = 6 },
  ];

  public query ({ caller }) func getQuestions(category : Text) : async [Question] {
    questions.filter(func(q) { q.category == category });
  };

  public shared ({ caller }) func saveSession(mode : Text, score : Nat) : async Nat {
    let sessionId = nextSessionId;
    nextSessionId += 1;

    let session : GameSession = {
      sessionId;
      mode;
      truthScore = score;
      timestamp = Time.now();
    };

    gameSessions.add(sessionId, session);
    sessionId;
  };

  public query ({ caller }) func getTopScores() : async [GameSession] {
    let allSessions = gameSessions.values().toArray();
    let sortedSessions = allSessions.sort(GameSession.compareByScore);
    sortedSessions.sliceToArray(0, Nat.min(10, sortedSessions.size()));
  };

  public query ({ caller }) func getQuestionById(id : Nat) : async Question {
    let filtered = questions.filter(func(q) { q.id == id });
    if (filtered.isEmpty()) { Runtime.trap("Question with id " # id.toText() # " does not exist") };
    filtered[0];
  };
};
