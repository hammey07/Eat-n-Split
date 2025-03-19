import { use, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState("");
  function handleShowAddForm() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id == friend.id ? null : friend));
    setShowAddFriend(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddForm}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friends
          key={friend.id}
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        ></Friends>
      ))}
    </ul>
  );
}
function Friends({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <>
      <li key={friend.id} className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && <p className="red">You owe €{friend.balance}</p>}
        {friend.balance > 0 && (
          <p className="red">
            {friend.name} owes you €{friend.balance}
          </p>
        )}
        {friend.balance == 0 && <p>You are even</p>}
        <Button onClick={() => onSelectFriend(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const Friend = {
      id,
      name,
      balance: 0,
      image: `${image}?=${id}`,
    };
    onAddFriend(Friend);
    setName("");
    setImage("https://i.pravatar.cc/");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>😊Friend Name</label>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        value={name}
      />
      <label>😊Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Submit</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>🤑 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🤑 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>🤑 {selectedFriend.name}'s expense </label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑Who is paying the bill </label>
      <select onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="firend">{selectedFriend.name}</option>
      </select>
    </form>
  );
}
