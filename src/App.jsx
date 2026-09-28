import { useState } from 'react';
import { Plus, Check, Bell, X } from 'lucide-react';

function App() {
  const [familyMembers] = useState([
    { id: 1, name: 'Jaren', xp: 0 },
    { id: 2, name: 'Papa', xp: 0 },
    { id: 3, name: 'Mama', xp: 0 },
  ]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  // Request notification permission
  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  // Show notification
  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  // Add task
  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      assignedTo: null,
    };
    setTasks([...tasks, task]);
    setNewTask('');
    showNotification('Nieuwe taak toegevoegd', `Taak: ${newTask}`);
  };

  // Complete task and award XP
  const completeTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: true }
          : task
      )
    );
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.assignedTo) {
      const memberId = task.assignedTo;
      setFamilyMembers(
        familyMembers.map((member) =>
          member.id === memberId
            ? { ...member, xp: member.xp + 10 } // Award 10 XP per task
            : member
        )
      );
      showNotification('XP verdiend!', `${familyMembers.find((m) => m.id === memberId).name} heeft 10 XP verdiend!`);
    }
  };

  // Assign task to a family member
  const assignTask = (taskId, memberId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, assignedTo: memberId }
          : task
      )
    );
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">GezinsHub Familieplanner</h1>
        <p className="text-gray-600">Dagelijkse planning met XP-beloningen voor Jaren, Papa en Mama</p>
      </header>

      {/* Notification permission */}
      {notificationPermission === 'default' && (
        <button
          onClick={requestNotificationPermission}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Meldingen inschakelen
        </button>
      )}

      {/* Add task form */}
      <form onSubmit={addTask} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Wat moet er gebeuren?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          <Plus /> Taak toevoegen
        </button>
      </form>

      {/* Tasks list */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between ${
              task.completed ? 'bg-green-50' : 'bg-white'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {!task.completed ? (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="w-5 h-5 border-2 border-gray-500 rounded"
                  />
                ) : (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                <div className="flex-1">
                  <span
                    className={`${task.completed ? 'line-through text-gray-400' : ''} text-lg`}
                  >
                    {task.text}
                  </span>
                  {task.assignedTo && (
                    <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {familyMembers.find((m) => m.id === task.assignedTo)?.name}
                    </span>
                  )}
                </div>
              </div>
              {task.assignedTo === null && (
                <div className="mt-2 flex gap-2">
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => assignTask(task.id, member.id)}
                      className={`px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${
                        task.assignedTo === member.id ? 'bg-blue-500 text-white' : ''
                      }`}
                    >
                      {member.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              {task.assignedTo && (
                <span className="text-xs text-gray-500">
                  XP: {familyMembers.find((m) => m.id === task.assignedTo)?.xp}
                </span>
              )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-4">Geen taken toegevoegd. Voeg een taak toe om te beginnen!</p>
        )}
      </div>

      {/* Family members XP overview */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">XP Overzicht</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="border border-gray-200 rounded-lg p-4 text-center bg-white"
            >
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-2xl font-bold text-blue-600">{member.xp} XP</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-8 text-center text-sm text-gray-500">
        Gemaakt met ❤️ voor de familie
      </footer>
    </div>
  );
}

export default App
