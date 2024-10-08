import { useNavigate } from "react-router-dom";
import ProfileInfo from "./Cards/ProfileInfo";
import SearchBar from "./SearchBar";
import { useState } from "react";

const Navbar = ({userInfo , onSearchNote , handleClearSearch}) => {
  // console.log(userInfo.fullName);
  const [searchQuery, setSearchQuery] = useState("");
 
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear()
    navigate("/login");
  };
  const handleSearch = () => {
    if(searchQuery) {
      onSearchNote(searchQuery);
   
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch()
  };
  return (
    <div className=" w-[100%] sm:w-full bg-yellow-100 flex items-center backdrop-blur-sm justify-between gap-6 px-6 py-2 drop-shadow  ">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        onClearSearch={onClearSearch}
        handleSearch={handleSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
