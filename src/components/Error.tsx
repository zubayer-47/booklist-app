export default function Error({ error }: { error: string }) {
  const handleRefresh = () => {
    localStorage.setItem("persist_page", "1");
    localStorage.setItem("persist_search", "");
    localStorage.setItem("persist_genre", "");

    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-10 justify-center items-center h-96">
      <h1 className="text-rose-500 text-2xl font-bold">
        {error || "Something went wrong!"}
      </h1>
      <button
        type="button"
        onClick={handleRefresh}
        className="bg-indigo-500 py-3 px-5 rounded-lg text-gray-50 font-semibold"
      >
        Refresh
      </button>
    </div>
  );
}
