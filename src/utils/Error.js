function Error({msg}){
  const errMsg = msg || 'Failed to load data, Please try again';
  return(
      <div>
          <h1 className="bg-red-500 m-3 p-2 rounded text-white text-center">{errMsg}</h1>
      </div>
  );
};
export default Error;