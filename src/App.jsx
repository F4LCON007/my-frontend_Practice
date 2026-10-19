import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loadNotes = async () => {
    const r = await fetch(`${API}/api/note`, { credentials: "include" });
    if (r.ok) setNotes((await r.json()).notes);
  };

  useEffect(() => {
    fetch(`${API}/api/me`, { credentials: "include" }).then(async (r) => {
      if (r.ok) {
        setUser((await r.json()).user);
        loadNotes();
      }
    });
  }, []);

  const login = async () => {
    const r = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (r.ok) {
      setError("");
      const me = await fetch(`${API}/api/me`, { credentials: "include" });
      setUser((await me.json()).user);
      loadNotes();
    } else {
      const errData = await r.json();
      setError(errData.message || "Login failed");
    }
  };

  const addNote = async () => {
    await fetch(`${API}/api/note`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    loadNotes();
  };

  if (!user)
    return (
      <div style={{ padding: "20px" }}>
        <h2>Login</h2>
        <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <br /><br />
        <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
        <br /><br />
        <button onClick={login}>Login</button>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Hello {user.username}</h2>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map((n) => (
          <li key={n._id}>{n.text}</li>
        ))}
      </ul>
    </div>
  );
}