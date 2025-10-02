import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- PWA / Head Meta Tags Component ---
const PwaMetaTags = () => {
    useEffect(() => {
        document.title = "منظم المهام الأسبوعي";
        const setMeta = (name, content) => { let element = document.querySelector(`meta[name=${name}]`) || document.createElement('meta'); element.name = name; element.content = content; document.head.appendChild(element); };
        const setLink = (rel, href) => { let element = document.querySelector(`link[rel=${rel}]`) || document.createElement('link'); element.rel = rel; element.href = href; document.head.appendChild(element); };
        setMeta('theme-color', '#3b82f6');
        setMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
        setMeta('apple-mobile-web-app-title', 'منظم المهام');
        setLink('manifest', '/manifest.json'); 
        setLink('apple-touch-icon', '/icon-192x192.png');
    }, []);
    return null;
};

// --- الإعدادات والثوابت ---
const TASK_COLORS = { 'عمل': 'bg-blue-500', 'دراسة': 'bg-green-500', 'صحة': 'bg-purple-500', 'شخصي': 'bg-yellow-500', 'متنوع': 'bg-pink-500' };
const TASK_COLOR_NAMES = Object.keys(TASK_COLORS);
const HOUR_HEIGHT_IN_REM = 4;

// --- الأيقونات (SVG) ---
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>);
const ResetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const MoonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);
const SparklesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 2zM5.105 5.105a.75.75 0 011.06 0l2.475 2.475a.75.75 0 01-1.06 1.06L5.105 6.165a.75.75 0 010-1.06zm9.79 0a.75.75 0 010 1.06l-2.475 2.475a.75.75 0 01-1.06-1.06l2.475-2.475a.75.75 0 011.06 0zM10 18a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 18zM6.165 14.895a.75.75 0 010-1.06l2.475-2.475a.75.75 0 011.06 1.06L7.225 14.895a.75.75 0 01-1.06 0zM14.895 13.835a.75.75 0 011.06 0l2.475 2.475a.75.75 0 01-1.06 1.06L14.895 14.895a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 012 10zm14.5 0a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>);
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>);
const InstallIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => { const totalMinutes = i * 15; const hours = Math.floor(totalMinutes / 60); const minutes = totalMinutes % 60; const label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; const value = hours + minutes / 60; return { label, value }; });
const durationOptions = [ { label: '15 دقيقة', value: 0.25 }, { label: '30 دقيقة', value: 0.5 }, { label: '45 دقيقة', value: 0.75 }, { label: 'ساعة واحدة', value: 1 }, { label: 'ساعة و 30 دقيقة', value: 1.5 }, { label: 'ساعتان', value: 2 }, { label: '3 ساعات', value: 3 }, { label: '4 ساعات', value: 4 }, ];

const sanitizeTasks = (tasks) => {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter(task => task && typeof task.id !== 'undefined').map(task => ({
        id: task.id,
        title: task.title || '',
        description: task.description || '',
        day: typeof task.day === 'number' && task.day >= 0 && task.day <= 6 ? task.day : 0,
        startHour: typeof task.startHour === 'number' && !isNaN(task.startHour) ? task.startHour : 8,
        duration: typeof task.duration === 'number' && !isNaN(task.duration) ? task.duration : 1,
        progress: typeof task.progress === 'number' ? task.progress : 0,
        color: TASK_COLOR_NAMES.includes(task.color) ? task.color : TASK_COLOR_NAMES[0],
    }));
};

export default function App() {
    const [tasks, setTasks] = useState(() => {
        try {
            const storedTasks = localStorage.getItem('tasks');
            const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
            return sanitizeTasks(parsedTasks);
        } catch (error) { console.error("Failed to load tasks", error); return []; }
    });

    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [view, setView] = useState(() => window.innerWidth < 768 ? 'daily' : 'weekly');
    const [currentDay, setCurrentDay] = useState(new Date().getDay());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [tooltip, setTooltip] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [installPrompt, setInstallPrompt] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    
    const gridRef = useRef(null);
    const interactionRef = useRef({ type: null, task: null });
    const longPressTimerRef = useRef(null);
    const today = new Date().getDay();

    useEffect(() => { try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (error) { console.error("Failed to save tasks", error); } }, [tasks]);
    useEffect(() => { if (theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); try { localStorage.setItem('theme', theme); } catch (error) { console.error("Failed to save theme", error); } }, [theme]);
    
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        const handleInstallPrompt = (e) => { e.preventDefault(); setInstallPrompt(e); };
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);
        if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/service-worker.js').then(reg => console.log('SW registered.')).catch(err => console.log('SW registration failed: ', err)); }); }
        return () => { clearInterval(timer); window.removeEventListener('beforeinstallprompt', handleInstallPrompt); };
    }, []);
    
    const handleInstallClick = () => { if (!installPrompt) return; installPrompt.prompt(); };

    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const openModal = (task = null, day, hour) => { setEditingTask(task || { id: Date.now(), title: '', description: '', day: day ?? (view === 'daily' ? currentDay : 0), startHour: hour ?? 8, duration: 1, color: TASK_COLOR_NAMES[0], progress: 0 }); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingTask(null); };
    const saveTask = (task) => { setTasks(prev => { const existing = prev.find(t => t.id === task.id); if (existing) return prev.map(t => t.id === task.id ? task : t); return [...prev, task]; }); closeModal(); };
    const deleteTask = (taskId) => { setTasks(prev => prev.filter(t => t.id !== taskId)); closeModal(); };
    const resetTasks = () => { if (window.confirm('هل أنت متأكد من أنك تريد حذف جميع المهام؟')) setTasks([]); };
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const generateSmartDescription = async () => {
        if (!editingTask?.title) { alert("الرجاء إدخال عنوان للمهمة أولاً."); return; }
        setIsGenerating(true);
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const systemPrompt = "You are a helpful productivity assistant. Your goal is to help users flesh out their tasks. You must respond in Arabic.";
        const userQuery = `Based on the task title, generate a short, helpful description. If complex, break it into 2-3 simple steps with bullet points. Be concise and actionable. Task Title: "${editingTask.title}"`;
        const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] }, };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API call failed: ${response.status}`);
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText) setEditingTask(prev => ({ ...prev, description: generatedText }));
            else { console.error("No content in API response", result); alert("حدث خطأ أثناء إنشاء الوصف."); }
        } catch (error) { console.error("Error calling Gemini API:", error); alert("حدث خطأ بالاتصال بالخادم.");
        } finally { setIsGenerating(false); }
    };
    
    const updateTaskPosition = useCallback((e) => {
        const event = e.touches ? e.touches[0] : e;
        if (!interactionRef.current.task || !gridRef.current) return;
        const gridRect = gridRef.current.getBoundingClientRect();
        const y = event.clientY - gridRect.top;
        const x = event.clientX - gridRect.left;
        const hourHeight = gridRect.height / 24;
        const currentHour = Math.round((y / hourHeight) * 4) / 4;
        const taskToUpdate = interactionRef.current.task;

        if (interactionRef.current.type === 'move') {
            const dayWidth = gridRect.width / (view === 'weekly' ? 7 : 1);
            const currentDayIndex = Math.max(0, Math.min(6, Math.floor((gridRect.width - x) / dayWidth)));
            const targetDay = view === 'weekly' ? currentDayIndex : currentDay;
            const snappedHour = Math.max(0, Math.min(24 - taskToUpdate.duration, currentHour));
            setTasks(prevTasks => prevTasks.map(t => t.id === taskToUpdate.id ? { ...t, startHour: snappedHour, day: targetDay } : t));
        } else if (interactionRef.current.type === 'resize') {
            const newEndHour = Math.max(taskToUpdate.startHour + 0.25, currentHour + 0.25);
            const newDuration = Math.round((newEndHour - taskToUpdate.startHour) * 4) / 4;
            const finalDuration = Math.max(0.25, Math.min(24 - taskToUpdate.startHour, newDuration));
            setTasks(prevTasks => prevTasks.map(t => t.id === taskToUpdate.id ? { ...t, duration: finalDuration } : t));
        }
    }, [view, currentDay]);

    const endInteraction = useCallback(() => {
        document.removeEventListener('mousemove', updateTaskPosition);
        document.removeEventListener('mouseup', endInteraction);
        document.removeEventListener('touchmove', updateTaskPosition);
        document.removeEventListener('touchend', endInteraction);
        interactionRef.current = { type: null, task: null };
    }, [updateTaskPosition]);

    const startInteraction = (e, task, type) => {
        e.stopPropagation();
        interactionRef.current = { type, task };
        document.addEventListener('mousemove', updateTaskPosition);
        document.addEventListener('mouseup', endInteraction);
        document.addEventListener('touchmove', updateTaskPosition);
        document.addEventListener('touchend', endInteraction);
    };

    const handleLongPressStart = (e, task, type) => {
        longPressTimerRef.current = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate(50);
            startInteraction(e, task, type);
        }, 300);
    };

    const handleLongPressEnd = () => {
        clearTimeout(longPressTimerRef.current);
    };
    
    const showTooltip = (e, task) => setTooltip({ content: ( <div><h3 className="font-bold">{task.title}</h3><p className="text-sm whitespace-pre-wrap">{task.description}</p><p className="text-xs mt-1">التقدم: {task.progress}%</p></div> ), x: e.clientX, y: e.clientY });
    const hideTooltip = () => setTooltip(null);
    
    const currentTimePosition = (currentTime.getHours() + currentTime.getMinutes() / 60) * HOUR_HEIGHT_IN_REM;

    return (
        <div dir="rtl" className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <PwaMetaTags />
            <header className="flex items-center justify-between p-2 md:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20">
                <h1 className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">منظم المهام</h1>
                <div className="flex items-center gap-1 md:gap-3">
                    {installPrompt && (<button onClick={handleInstallClick} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><InstallIcon /></button>)}
                    <button onClick={() => openModal(null)} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-transform transform hover:scale-110"><PlusIcon /></button>
                    <button onClick={resetTasks} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><ResetIcon /></button>
                    <div className="hidden sm:flex bg-gray-200 dark:bg-gray-700 p-1 rounded-full gap-1">
                        <button onClick={() => setView('weekly')} className={`px-3 py-1 text-sm rounded-full ${view === 'weekly' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}>أسبوعي</button>
                        <button onClick={() => setView('daily')} className={`px-3 py-1 text-sm rounded-full ${view === 'daily' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}>يومي</button>
                    </div>
                     <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{theme === 'light' ? <MoonIcon /> : <SunIcon />}</button>
                </div>
            </header>

            <div className="sm:hidden bg-gray-100 dark:bg-gray-800 p-2 flex justify-center border-b border-gray-200 dark:border-gray-700">
                 <select onChange={(e) => setCurrentDay(parseInt(e.target.value))} value={currentDay} className="bg-white dark:bg-gray-700 rounded-full px-4 py-1 shadow text-sm">
                     {days.map((day, i) => <option key={i} value={i}>{day}</option>)}
                 </select>
            </div>

            <main className="flex-grow p-1 sm:p-2 md:p-4 overflow-hidden">
                <div className="relative flex h-full">
                    <div className="w-12 md:w-16 flex-shrink-0">
                         <div className="h-10"></div>
                         {hours.map(hour => (<div key={hour} className="h-16 flex items-start justify-center text-xs text-gray-500 dark:text-gray-400 pt-1">{hour}</div>))}
                    </div>
                    
                    <div className="flex-grow overflow-x-auto relative">
                        <div ref={gridRef} className="grid md:min-w-[700px]" style={{ gridTemplateColumns: view === 'weekly' ? 'repeat(7, 1fr)' : '1fr' }}>
                            {(view === 'weekly' ? days : [days[currentDay]]).map((day, dayIndex) => {
                                const actualDayIndex = view === 'weekly' ? dayIndex : currentDay;
                                const isToday = actualDayIndex === today;
                                return (
                                    <div key={day} className={`relative border-l border-gray-100 dark:border-gray-800 ${isToday ? 'bg-blue-50/50 dark:bg-gray-800/50' : ''}`}>
                                        <div className={`sticky top-0 z-10 text-center font-semibold py-2 h-10 border-b border-gray-200 dark:border-gray-700 text-sm md:text-base ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>{day}</div>
                                        <div className="relative">
                                            {hours.map((_, hourIndex) => (<div key={hourIndex} onDoubleClick={() => openModal(null, actualDayIndex, hourIndex)} className="relative h-16 border-t border-dashed border-gray-200 dark:border-gray-600 hover:bg-blue-100/50 dark:hover:bg-gray-700/50">
                                                <div className="absolute top-1/4 w-full border-b border-dashed border-gray-200/50 dark:border-gray-700/50"></div>
                                                <div className="absolute top-1/2 w-full border-b border-dashed border-gray-200/75 dark:border-gray-700/75"></div>
                                                <div className="absolute top-3/4 w-full border-b border-dashed border-gray-200/50 dark:border-gray-700/50"></div>
                                            </div>))}
                                            {tasks.filter(t => t && t.day === actualDayIndex).map(task => (
                                                <div key={task.id} 
                                                    onDoubleClick={(e) => { e.stopPropagation(); openModal(task); }} 
                                                    onMouseDown={(e) => startInteraction(e, task, 'move')} 
                                                    onTouchStart={(e) => handleLongPressStart(e, task, 'move')}
                                                    onTouchMove={handleLongPressEnd}
                                                    onTouchEnd={handleLongPressEnd}
                                                    onMouseMove={(e) => showTooltip(e, task)} 
                                                    onMouseLeave={hideTooltip}
                                                    className={`${TASK_COLORS[task.color]} absolute right-0 left-0 mx-1 rounded-lg p-2 text-white shadow-md cursor-pointer select-none transition-all duration-100 ease-in-out overflow-hidden group`}
                                                    style={{ top: `${task.startHour * HOUR_HEIGHT_IN_REM}rem`, height: `${task.duration * HOUR_HEIGHT_IN_REM}rem` }}>
                                                    <div className="flex flex-col h-full"><p className="font-bold text-sm truncate">{task.title}</p><p className="text-xs truncate opacity-80 whitespace-pre-wrap">{task.description}</p><div className="mt-auto pt-2"><div className="w-full bg-white/20 rounded-full h-1.5"><div className="bg-white rounded-full h-1.5" style={{ width: `${task.progress}%` }}></div></div></div></div>
                                                    <div 
                                                        onMouseDown={(e) => startInteraction(e, task, 'resize')} 
                                                        onTouchStart={(e) => handleLongPressStart(e, task, 'resize')}
                                                        onTouchMove={handleLongPressEnd}
                                                        onTouchEnd={handleLongPressEnd}
                                                        className="absolute bottom-0 left-0 w-full h-6 cursor-ns-resize flex items-end justify-center opacity-75 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <div className="w-8 h-1 bg-white/50 rounded-full"></div>
                                                    </div>
                                                </div>
                                            ))}
                                            {isToday && view !== 'weekly' && (
                                                <div className="absolute top-0 right-0 left-0 pointer-events-none z-10" style={{ transform: `translateY(${currentTimePosition}rem)` }}>
                                                    <div className="relative h-px bg-red-500">
                                                        <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
            
            {tooltip && ( <div className="hidden md:block fixed z-50 p-2 text-sm bg-gray-900 text-white rounded-md shadow-lg pointer-events-none max-w-xs" style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}>{tooltip.content}</div> )}
            
            {isModalOpen && ( 
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-30 backdrop-blur-sm" onClick={closeModal}>
                    <div dir="rtl" className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg m-4 transform transition-all" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6">{editingTask?.title ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); saveTask(editingTask); }}>
                            <div className="space-y-5">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label><input type="text" value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500" required /></div>
                                <div><div className="flex justify-between items-center mb-1"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label><button type="button" onClick={generateSmartDescription} disabled={isGenerating || !editingTask?.title} className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">{isGenerating ? ( <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>جارٍ الإنشاء...</span></> ) : ( <><SparklesIcon className="h-4 w-4" /><span>اقتراح ذكي</span></> )}</button></div><textarea value={editingTask.description} onChange={e => setEditingTask({...editingTask, description: e.target.value})} rows="3" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اليوم</label><div className="absolute inset-y-0 right-3 flex items-center pt-5 pointer-events-none"><CalendarIcon/></div><select value={editingTask.day} onChange={e => setEditingTask({...editingTask, day: parseInt(e.target.value)})} className="pl-3 pr-10 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none">{days.map((day, i) => <option key={i} value={i}>{day}</option>)}</select></div>
                                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">النوع</label><div className="flex items-center gap-2 mt-2 pt-1">{TASK_COLOR_NAMES.map(name => (<div key={name} onClick={() => setEditingTask({...editingTask, color: name})} className={`w-8 h-8 rounded-full cursor-pointer transition-transform transform hover:scale-110 ${TASK_COLORS[name]} ${editingTask.color === name ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-blue-500' : ''}`}></div>))}</div></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وقت البدء</label><div className="absolute inset-y-0 right-3 flex items-center pt-5 pointer-events-none"><ClockIcon/></div><select value={editingTask.startHour} onChange={e => setEditingTask({...editingTask, startHour: parseFloat(e.target.value)})} className="pl-3 pr-10 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none">{timeSlots.map(slot => <option key={slot.value} value={slot.value}>{slot.label}</option>)}</select></div>
                                    <div className="relative"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المدة</label><div className="absolute inset-y-0 right-3 flex items-center pt-5 pointer-events-none"><ClockIcon/></div><select value={editingTask.duration} onChange={e => setEditingTask({...editingTask, duration: parseFloat(e.target.value)})} className="pl-3 pr-10 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none">{durationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                                </div>
                                <div><label className="block text-sm font-medium mb-2">التقدم ({editingTask.progress || 0}%)</label><input type="range" min="0" max="100" value={editingTask.progress || 0} onChange={e => setEditingTask({...editingTask, progress: parseInt(e.target.value) || 0})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600" /></div>
                            </div>
                            <div className="mt-8 flex justify-between items-center">
                                <div>
                                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">حفظ</button>
                                    <button type="button" onClick={closeModal} className="mr-3 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">إلغاء</button>
                                </div>
                                {editingTask?.title && (<button type="button" onClick={() => deleteTask(editingTask.id)} className="inline-flex justify-center rounded-md border border-transparent bg-red-100 dark:bg-red-900/50 py-2 px-4 text-sm font-medium text-red-700 dark:text-red-300 shadow-sm hover:bg-red-200 dark:hover:bg-red-900/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">حذف المهمة</button>)}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}