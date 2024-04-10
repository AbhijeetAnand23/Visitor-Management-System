const SearchResult = ({ user, onSelect }) => {
  return <div onClick={onSelect}>{user.Name}</div>;
};

export default SearchResult;
