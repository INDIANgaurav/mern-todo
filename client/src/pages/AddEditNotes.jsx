import  { useState } from "react";
import TagInput from "../components/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../utils/axiosinstance";
import toast from 'react-hot-toast';
const AddEditNotes = ({ noteData, type, onClose, getAllNotes  }) => {
  const [title, setTitle] = useState(noteData?.title ||"");
  const [content, setContent] = useState( noteData?.content ||"");
  const [tags, setTags] = useState( noteData?.tags||[]);
  const [error, setError] = useState( noteData?.error || null);
 

 
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        toast.success("Note Added Successfully")
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };


  const editNote = async () => {
    const noteId = noteData._id 
    console.log(noteId)
 
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId , {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        toast.success("Note Update Successfully")
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!tags) {
      setError("At least one tag is required");
      return;
    }
    if (!content) {
      setError("Content is required");
      return;
    }
    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div  >

    <div className="relative  ">
       
      <button
        className="w-10  h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500 "
        onClick={onClose}
        >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none
          "
          placeholder="Go To Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label"></label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-200 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
          ></textarea>
      </div>
      <div className="mt-4">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500 text-xs pt-4 "> {error}</p>}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
        >
        {type === "edit" ? "Edit" : "Add"}
       
      </button>
    </div>
        </div>
  );
};

export default AddEditNotes;
