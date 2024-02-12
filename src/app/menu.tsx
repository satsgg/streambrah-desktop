export default function Menu() {
  return (
    <div className="flex flex-col w-1/6">
      <div className="flex justify-between px-4 py-2">
        <p>Menu</p>
        <p>{"<-"}</p>
      </div>
      <div className="flex justify-between px-4 py-2">
        <p>Dashboard</p>
      </div>
      <div className="flex justify-between px-4 py-2">
        <p>Settings</p>
      </div>
      <div className="flex justify-between px-4 py-2">
        <p>Widgets</p>
      </div>
      <div className="flex justify-between px-4 py-2">
        <p>Integrations</p>
        <p>v</p>
      </div>
    </div>
  );
}
