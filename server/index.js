require("dotenv").config();

const { connectDb } = require("./connection");

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const bcrypt = require("bcrypt");
const { authenticate } = require("./utilities");
const User = require("./models/User");
const Note = require("./models/Note");

connectDb();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("your data ->", fullName, email, password);
  // validate inputs
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // check if email is already taken
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({ message: "Email is already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // create a new user
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    message: "User created successfully",
    user,
    accessToken,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({
      message: "All fields are required",
    });
  const userInfo = await User.findOne({ email });
  if (!userInfo)
    return res.status(401).json({ message: "Invalid credentials" });
  const isPasswordMatch = await bcrypt.compare(password, userInfo.password);
  if (!isPasswordMatch)
    return res.status(401).json({ message: "Invalid credentials" });
  const accessToken = jwt.sign(
    { user: userInfo },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );
  console.log("your accessToken is here ->", accessToken);
  return res
    .status(200)
    .json({ message: "Login Successful", accessToken, email });
});

app.get("/get-user", authenticate, async (req, res) => {
  const { user } = req.user;
  try {
    const userInfo = await User.findById({ _id: user._id });
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: userInfo,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal error", error });
  }
});
app.post("/add-note", authenticate, async (req, res) => {
  console.log("i am here");
  const { title, content, tags } = req.body;
  const { user } = req.user;
  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }
  if (!content) {
    return res.status(400).json({ message: "content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    console.log("your user id is ->", note.userId);
    await note.save();
    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.put("/edit-note/:noteId", authenticate, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({ message: "No changes provided" });
  }
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();
    return res.json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/get-note/", authenticate, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    if (!notes) {
      return res.status(404).json({ message: "Notes not found" });
    }
console.log(notes)
    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.delete("/delete-note/:noteId", authenticate, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    await note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.put("/update-note-pinned/:noteId", authenticate, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.isPinned = isPinned || false;

    await note.save();
    return res.json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/search-notes/", authenticate, async (req, res) => {
const {user} = req.user;
const {query} = req.query;

if(!query) {
  return res.status(400).json({message: "Search query is required"});
}
try {
  const matchingNotes = await Note.find({
    userId : user._id ,
    $or:[
      {title: {$regex : new RegExp(query , "i")}} ,
      {content: {$regex : new RegExp(query , "i")}}
    ]
  })
return res.json({
  success: true,
  message: "Search results retrieved successfully",
  notes: matchingNotes
})


} catch (error) {
  return res.status(500).json({
    success: false,
    message: "Internal Server Error"
  })
}



})
app.listen(3000, () => console.log("server started on port 3000"));

module.exports = app;
