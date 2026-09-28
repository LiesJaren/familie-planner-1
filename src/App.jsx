import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Award, 
  Plus, 
  Trash2, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Users, 
  Wrench, 
  Flame, 
  Volume2, 
  Trophy, 
  Star, 
  Check, 
  BookOpen, 
  Loader2, 
  Bot, 
  RefreshCw, 
  Send, 
  HelpCircle,
  Copy
} from 'lucide-react';

async function callGemini(payload) {
  const apiKey = "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const delays = [1000, 2000, 4000, 8000, 16000];

  for (let attempt = 0; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (attempt < 5) {
        await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
      } else {
        throw new Error("AI momenteel niet bereikbaar.");
      }
    }
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('planning');
  const [activeMember, setActiveMember] = useState('all');

  const [members, setMembers] = useState([
    { 
      id: 'jaren', 
      name: 'Jaren (5j)', 
      role: 'Junior Held 🦖', 
      accentColor: '#00AFFF', 
      cardBg: 'bg-sky-950/70',
      borderClass: 'border-sky-500/50',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
      barColor: 'bg-gradient-to-r from-sky-400 to-cyan-300',
      avatar: '🦖', 
      xp: 265, 
      maxXp: 350,
      level: 3 
    },
    { 
      id: 'birger', 
      name: 'Papa (Birger)', 
      role: 'Techniek & Atelier ⚡', 
      accentColor: '#B100FF', 
      cardBg: 'bg-purple-950/60',
      borderClass: 'border-purple-500/50',
      badgeBg: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
      barColor: 'bg-gradient-to-r from-purple-500 to-indigo-400',
      avatar: '⚡', 
      xp: 520, 
      maxXp: 700,
      level: 5 
    },
    { 
      id: 'mama', 
      name: 'Mama', 
      role: 'Organisatie & Rust 🌸', 
      accentColor: '#FF2EB3', 
      cardBg: 'bg-rose-950/60',
      borderClass: 'border-rose-500/50',
      badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
      barColor: 'bg-gradient-to-r from-rose-500 to-pink-400',
      avatar: '🌸', 
      xp: 430, 
      maxXp: 600,
      level: 4 
    }
  ]);

  const tagStyles = {
    Sport: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', icon: '🏊‍♂️' },
    School: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40', icon: '🔧' },
    Routine: { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/40', icon: '⏰' },
    Gezin: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40', icon: '❤️' },
    Rust: { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/40', icon: '📖' }
  };

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Zwemles & Waterpret',
      subtitle: 'Duikbril & handdoek in de tas',
      time: '16:30 - 17:30',
      day: 'Vandaag',
      memberId: 'jaren',
      location: 'Zwembad Oostende',
      tag: 'Sport',
      done: false
    },
    {
      id: 2,
      title: 'VTI Praktijkles Voorbereiden',
      subtitle: 'Veiligheid & meetgereedschap klaarleggen',
      time: '18:00 - 18:45',
      day: 'Vandaag',
      memberId: 'birger',
      location: 'Atelier / Werkplaats',
      tag: 'School',
      done: true
    },
    {
      id: 3,
      title: 'Voorleesverhaaltje (Tip de Muis & Smurfen)',
      subtitle: 'Gezellig rustmoment voor bedtijd',
      time: '19:30 - 19:50',
      day: 'Vandaag',
      memberId: 'jaren',
      location: 'Slaapkamer',
      tag: 'Rust',
      done: false
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 101,
      title: 'Zwemtas zelf inpakken',
      desc: 'Zwembroek, handdoek en zwembrilletje',
      memberId: 'jaren',
      xp: 30,
      completed: false,
      category: 'Zelfstandig'
    },
    {
      id: 102,
      title: 'Rainbow Friends speelgoed in de bak',
      desc: 'Slaapkamer netjes maken voor het slapengaan',
      memberId: 'jaren',
      xp: 25,
      completed: true,
      category: 'Opruimen'
    },
    {
      id: 103,
      title: 'Tandenpoets-kampioen (2 min poetsen)',
      desc: 'Glanzende witte tanden!',
      memberId: 'jaren',
      xp: 20,
      completed: false,
      category: 'Routine'
    }
  ]);

  const [notificationPermission, setNotificationPermission] = useState('default');
  const [toastMessage, setToastMessage] = useState(null);
  const [notificationLog, setNotificationLog] = useState([
    { id: 1, text: 'Zwemles start over 45 min! Vergeet de duikbril niet.', time: '15:45' },
    { id: 2, text: 'Jaren heeft +25 XP verdiend met opruimen! ⭐', time: '14:20' }
  ]);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventTag, setNewEventTag] = useState('Sport');
  const [newEventMember, setNewEventMember] = useState('jaren');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState('tasks');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [selectedStoryTheme, setSelectedStoryTheme] = useState('Dinosaurus Avontuur');
  const [storyOutput, setStoryOutput] = useState('');
  const [generatedTasksPreview, setGeneratedTasksPreview] = useState([]);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(' Gekopieerd naar klembord!');
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showToast('⚠️ Geen notificatiesteun in deze browser.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        showToast(' Meldingen ingeschakeld!');
        sendLocalNotification('Familieplanner Actief', 'Notificaties en herinneringen staan paraat.');
      } else {
        showToast('❌ Notificaties geweigerd.');
      }
    } catch {
      showToast('Kon notificaties niet activeren.');
    }
  };

  const sendLocalNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png'
        });
      } catch (e) {}
    }
    const logItem = {
      id: Date.now(),
      text: `${title} - ${body}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotificationLog(prev => [logItem, ...prev]);
    showToast(`🔔 ${title}`);
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const nextState = !task.completed;
        if (nextState) {
          setMembers(mList => mList.map(m => {
            if (m.id === task.memberId) {
              return { ...m, xp: m.xp + task.xp };
            }
            return m;
          }));
          showToast(`🌟 +${task.xp} XP verdiend! Knap gedaan!`);
          sendLocalNotification('Taak Voltooid! ⭐', `${task.title} (+${task.xp} XP)`);
        }
        return { ...task, completed: nextState };
      }
      return task;
    }));
  };

  const toggleEvent = (id) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, done: !ev.done } : ev));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newItem = {
      id: Date.now(),
      title: newEventTitle,
      subtitle: 'Gezinsactiviteit',
      time: newEventTime || '16:00',
      day: 'Vandaag',
      memberId: newEventMember,
      location: 'Thuis / Oostende',
      tag: newEventTag,
      done: false
    };
    setEvents([...events, newItem]);
    setNewEventTitle('');
    setNewEventTime('');
    showToast(' Afspraak toegevoegd!');
  };

  const handleGenerateAiTasks = async (topic) => {
    const targetTopic = topic || aiCustomPrompt || 'Ochtendroutine voor school';
    setAiLoading(true);
    setAiError(null);
    setGeneratedTasksPreview([]);

    const payload = {
      contents: [{
        parts: [{
          text: `Bedenk 3 speelse taken voor Jaren (5j) rond thema: "${targetTopic}".`
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              desc: { type: "STRING" },
              xp: { type: "INTEGER" },
              category: { type: "STRING" }
            },
            required: ["title", "desc", "xp", "category"]
          }
        }
      }
    };

    try {
      const data = await callGemini(payload);
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        setGeneratedTasksPreview(JSON.parse(rawText));
      }
    } catch (err) {
      setAiError("Fout bij genereren taken.");
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAiTasks = () => {
    if (generatedTasksPreview.length === 0) return;
    const newItems = generatedTasksPreview.map((item, idx) => ({
      id: Date.now() + idx,
      title: item.title,
      desc: item.desc,
      memberId: 'jaren',
      xp: item.xp || 20,
      completed: false,
      category: item.category || 'AI Routine'
    }));
    setTasks(prev => [...prev, ...newItems]);
    setGeneratedTasksPreview([]);
    showToast(`🎯 ${newItems.length} AI-taken toegevoegd!`);
    setActiveTab('taken');
  };

  const handleGenerateStory = async () => {
    setAiLoading(true);
    setAiError(null);
    setStoryOutput('');

    const payload = {
      contents: [{
        parts: [{
          text: `Schrijf een kort voorleesverhaaltje voor Jaren (5j). Thema: "${selectedStoryTheme}". Wensen: "${aiCustomPrompt || 'avontuur en slapengaan'}".`
        }]
      }]
    };

    try {
      const data = await callGemini(payload);
      const storyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (storyText) setStoryOutput(storyText);
    } catch (err) {
      setAiError("Kon verhaaltje niet genereren.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateNotification = async () => {
    setAiLoading(true);
    setAiError(null);

    const payload = {
      contents: [{
        parts: [{
          text: `Genereer één vrolijke korte notificatie voor het gezin (Jaren 5j en Papa).`
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            body: { type: "STRING" }
          },
          required: ["title", "body"]
        }
      }
    };

    try {
      const data = await callGemini(payload);
      const resText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resText) {
        const notif = JSON.parse(resText);
        sendLocalNotification(notif.title, notif.body);
      }
    } catch (err) {
      setAiError("Kon melding niet genereren.");
    } finally {
      setAiLoading(false);
    }
  };

  const getMember = (id) => members.find(m => m.id === id) || { name: 'Iedereen', avatar: '👥', accentColor: '#00AFFF' };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 sm:pb-0">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 border-2 border-[#00AFFF] text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold">
          <Sparkles className="w-4 h-4 text-[#FF2EB3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="bg-slate-900/90 backdrop-blur border-b-2 border-slate-800 sticky top-0 z-30 px-4 py-3 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-700 p-0.5">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  GezinsHub
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Actief
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Gezinsplanning & AI Routine Magie</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('ai')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs flex items-center gap-1.5 border border-purple-400/40"
            >
              <span>✨ AI Magie</span>
            </button>
            <button 
              onClick={() => setActiveTab('notificaties')}
              className="p-2.5 rounded-xl bg-slate-800 border-2 border-slate-700 text-slate-300 relative"
            >
              <Bell className="w-4 h-4" />
              {notificationLog.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF2EB3] rounded-full ring-2 ring-slate-900" />
              )}
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-3.5 grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveMember('all')}
            className={`py-2 px-1 rounded-xl text-xs font-bold border-2 flex flex-col items-center justify-center gap-1 ${
              activeMember === 'all' ? 'bg-slate-800 border-sky-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-lg">👥</span>
            <span>Iedereen</span>
          </button>

          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMember(m.id)}
              className={`py-2 px-2 rounded-xl text-xs font-bold border-2 text-left flex flex-col justify-between ${
                activeMember === m.id ? `${m.cardBg}${m.borderClass} text-white` : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">{m.avatar}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold border ${m.badgeBg}`}>
                  Lvl {m.level}
                </span>
              </div>
              <div className="mt-1">
                <p className="text-[11px] font-bold truncate">{m.name.split(' ')[0]}</p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className={`h-full ${m.barColor}`} style={{ width: `${Math.min(100, Math.round((m.xp / m.maxXp) * 100))}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 space-y-4">
        {activeTab === 'planning' && (
          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-extrabold uppercase text-slate-200">Vandaag op het bord</h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400">
                  {events.filter(e => e.day === 'Vandaag').length} activiteiten
                </span>
              </div>

              <div className="space-y-2.5">
                {events.filter(e => activeMember === 'all' || e.memberId === activeMember).map(event => {
                  const member = getMember(event.memberId);
                  const tagInfo = tagStyles[event.tag] || tagStyles.Gezin;
                  return (
                    <div key={event.id} className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 ${event.done ? 'bg-slate-950/40 border-slate-800 opacity-55' : 'bg-slate-900 border-slate-800'}`}>
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleEvent(event.id)} className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center ${event.done ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black' : 'border-slate-600 bg-slate-800'}`}>
                          {event.done ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold ${event.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>{event.title}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${tagInfo.bg} ${tagInfo.text} ${tagInfo.border}`}>
                              <span>{tagInfo.icon}</span>
                              <span>{event.tag}</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{event.subtitle}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1 text-sky-400 font-bold"><Clock className="w-3 h-3" />{event.time}</span>
                            <span>•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                        <span>{member.avatar}</span>
                        <span className="hidden sm:inline">{member.name.split(' ')[0]}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleAddEvent} className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sky-400">
                <Plus className="w-4 h-4 stroke-[3]" />
                <h3 className="text-xs font-black uppercase text-slate-300">Nieuwe Activiteit Plannen</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="text" placeholder="Wat gaan we doen? (bv. Zwemles)" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className="sm:col-span-2 bg-slate-950 border-2 border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                <input type="text" placeholder="Tijd (bv. 16:30)" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} className="bg-slate-950 border-2 border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <select value={newEventMember} onChange={(e) => setNewEventMember(e.target.value)} className="bg-slate-950 border-2 border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white">
                    {members.map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                  </select>
                  <select value={newEventTag} onChange={(e) => setNewEventTag(e.target.value)} className="bg-slate-950 border-2 border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white">
                    <option value="Sport">Sport (Zwemmen)</option>
                    <option value="School">School / Praktijk</option>
                    <option value="Rust">Rust & Verhaaltje</option>
                    <option value="Routine">Routine</option>
                    <option value="Gezin">Gezin</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-black flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Toevoegen
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'taken' && (
          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-extrabold uppercase text-slate-200">Routines & Uitdagingen</h2>
                </div>
                <span className="text-xs text-slate-400">Klik om XP te verzamelen</span>
              </div>

              <div className="space-y-2.5">
                {tasks.filter(t => activeMember === 'all' || t.memberId === activeMember).map(task => {
                  const member = getMember(task.memberId);
                  return (
                    <div key={task.id} onClick={() => toggleTask(task.id)} className={`cursor-pointer p-3 rounded-2xl border-2 flex items-center justify-between gap-3 ${task.completed ? 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60' : 'bg-slate-900 border-slate-800 text-white'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center ${task.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black' : 'border-slate-600 bg-slate-800'}`}>
                          {task.completed ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                        </div>
                        <div>
                          <p className={`text-xs sm:text-sm font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{task.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{task.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-300" />+{task.xp} XP
                        </span>
                        <span className="text-base">{member.avatar}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setAiMode('tasks')} className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 ${aiMode === 'tasks' ? 'bg-purple-950/80 border-purple-400 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-400'}`}>
                <Award className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-black">✨ Slimme Taken</span>
              </button>
              <button onClick={() => setAiMode('story')} className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 ${aiMode === 'story' ? 'bg-indigo-950/80 border-indigo-400 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-400'}`}>
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-black">✨ Slaapwel Verhaal</span>
              </button>
              <button onClick={() => setAiMode('notification')} className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-center gap-1.5 ${aiMode === 'notification' ? 'bg-rose-950/80 border-rose-400 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-400'}`}>
                <Volume2 className="w-5 h-5 text-rose-400" />
                <span className="text-xs font-black">✨ Live Motivaties</span>
              </button>
            </div>

            {aiMode === 'tasks' && (
              <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {['🏊‍♂️ Zwemles Voorbereiden', '🌅 Ochtendroutine School', '🧹 Speelgoed Opruim-Missie'].map((preset) => (
                    <button key={preset} type="button" onClick={() => handleGenerateAiTasks(preset)} className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                      {preset}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Of typ een eigen thema..." value={aiCustomPrompt} onChange={(e) => setAiCustomPrompt(e.target.value)} className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                  <button onClick={() => handleGenerateAiTasks()} disabled={aiLoading} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-black text-xs">
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>✨ Genereer</span>}
                  </button>
                </div>
                {generatedTasksPreview.length > 0 && (
                  <div className="border-t-2 border-slate-800 pt-3 space-y-2">
                    <button onClick={acceptAiTasks} className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Alles toevoegen
                    </button>
                    {generatedTasksPreview.map((item, index) => (
                      <div key={index} className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{item.title}</p>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300">+{item.xp} XP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {aiMode === 'story' && (
              <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 space-y-3">
                <div className="flex gap-2">
                  <input type="text" placeholder="Wensen voor het verhaaltje..." value={aiCustomPrompt} onChange={(e) => setAiCustomPrompt(e.target.value)} className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                  <button onClick={handleGenerateStory} disabled={aiLoading} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs">
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>✨ Vertel</span>}
                  </button>
                </div>
                {storyOutput && (
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500/40">
                    <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line">{storyOutput}</p>
                  </div>
                )}
              </div>
            )}

            {aiMode === 'notification' && (
              <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 text-center space-y-3">
                <button onClick={handleGenerateNotification} disabled={aiLoading} className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-black text-xs mx-auto">
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>✨ Verras Gezin met AI Melding</span>}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notificaties' && (
          <div className="bg-slate-900/90 rounded-2xl border-2 border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-bold">Status: {notificationPermission}</span>
              {notificationPermission !== 'granted' && (
                <button onClick={requestNotificationPermission} className="px-3 py-1 bg-sky-500 text-slate-950 text-xs font-bold rounded-lg">Inschakelen</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => sendLocalNotification('🏊‍♂️ Zwemles over 30 min!', 'Zwemtas alvast klaargezet?')} className="p-3 rounded-xl bg-slate-800 text-left text-xs text-white font-bold">Herinnering Zwemles</button>
              <button onClick={() => sendLocalNotification('⭐ Badge Ontgrendeld!', 'Jaren heeft +50 XP bonus!')} className="p-3 rounded-xl bg-slate-800 text-left text-xs text-white font-bold">XP Beloning</button>
            </div>
          </div>
        )}
      </main>

      <nav className="bg-slate-900/95 backdrop-blur border-t-2 border-slate-800 sticky bottom-0 z-30 px-2 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button onClick={() => setActiveTab('planning')} className={`flex flex-col items-center py-2 rounded-xl ${activeTab === 'planning' ? 'text-sky-400 bg-sky-500/15 font-black' : 'text-slate-400'}`}>
            <Calendar className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Planning</span>
          </button>
          <button onClick={() => setActiveTab('taken')} className={`flex flex-col items-center py-2 rounded-xl ${activeTab === 'taken' ? 'text-amber-300 bg-amber-500/15 font-black' : 'text-slate-400'}`}>
            <Trophy className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Taken</span>
          </button>
          <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center py-2 rounded-xl ${activeTab === 'ai' ? 'text-purple-300 bg-purple-500/20 font-black' : 'text-slate-400'}`}>
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">AI Magie</span>
          </button>
          <button onClick={() => setActiveTab('notificaties')} className={`flex flex-col items-center py-2 rounded-xl ${activeTab === 'notificaties' ? 'text-rose-300 bg-rose-500/15 font-black' : 'text-slate-400'}`}>
            <Bell className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Meldingen</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
