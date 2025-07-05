const resolveAfter2Seconds = new Promise(resolve => setTimeout(resolve, 2000))
const notify = () => toast.promise(resolveAfter2Seconds, {
  pending: "waiting for the promise to resolve",
  success: "promise resolved successfully",
  error: "promise failed to resolve"
});

return (
  <div>

    <button onClick={notify}>Notify !</button>

  </div>
)
