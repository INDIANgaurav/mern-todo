import { MdAdd } from "react-icons/md";
import NoteCard from "../components/Cards/NoteCard";
import Navbar from "../components/Navbar";
import moment from "moment";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";
import toast from "react-hot-toast";
import EmptyCard from "./EmptyCard";
import addmnoteimg from "/add.png";
import noNoteimg from "/note.png";
// import Toaster from "../components/ToastMessages/Toaster";
const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  // console.log("open add edit modal" , openAddEditModal);
  const [userInfo, setUserInfo] = useState({});
  const [notes, setNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      // console.log(response.data.user.email)
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //get  all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-note");

      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An error occurred while getting notes", error);
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    console.log(noteId);

    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        toast.success("Note Deleted Successfully");

        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An error occurred while getting notes", error);
      }
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    console.log(noteId);

    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned,
        }
      );
      if (response.data && response.data.note) {
        toast.success("Note Update Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <div className="  ">
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto">
        {notes.length > 0 ? (
          <div className="grid   sm:grid-cols-3 gap-4 mt-8 ">
            {notes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={moment(item.createdOn).format("Do MMM YYYY")}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => {
                  updateIsPinned(item);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? noNoteimg : addmnoteimg}
            message={
              isSearch
                ? `Oops! No notes found matching your search`
                : `start creating your first note! click the 'Add' button`
            }
          />
        )}
      </div>

      <button
        className="  sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed  left-[85%] bottom-[5%]"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="  text-[32px] text-white " />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className=" w-[90%]  sm:w-[60%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll "
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          // showToastMsg={showToastMsg}
        />
      </Modal>
    </div>
  );
};

export default Home;
