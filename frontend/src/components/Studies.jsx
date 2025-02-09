import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Check, Calendar } from 'lucide-react';
import { UserContext } from '../../context/userContext';
import axios from "axios";
import { toast } from "react-hot-toast";


const Studies = () => {
    const { user } = useContext(UserContext);
    const [subject, setSubject] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [topicsBySubject, setTopicsBySubject] = useState({});
    const [newTopics, setNewTopics] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);
    const [dueDates, setDueDates] = useState({});
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const navigate = useNavigate();

    const formatName = (fullName) => {
        if (!fullName) return "";
        const firstName = fullName.trim().split(" ")[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    };
    
    const nickname = user?.fullName ? formatName(user.fullName) : "Your";

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const subjectsResponse = await axios.get(`/api/subjects/${user.id}`);
            const fetchedSubjects = subjectsResponse.data;
            setSubjects(fetchedSubjects);
    
            const topicsData = {};
            for (const subject of fetchedSubjects) {
                const topicsResponse = await axios.get(`/api/topics/${user.id}/${subject._id}`);
                topicsData[subject._id] = topicsResponse.data;
            }
            setTopicsBySubject(topicsData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load subjects and topics");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
    }, [user?.id]);
    
    const addSubject = async (e) => {
        e.preventDefault();
        if (!subject) {
            toast.error("Please enter a subject.");
            return;
        }
        try {
            const response = await axios.post('/api/subject', { 
                subject,
                userId: user.id
            });
            const { error, message } = response.data;
            if (error) {
                toast.error(error);
            } else {
                toast.success(message || "Subject added successfully!");
                fetchData();
                setSubject("");
            }
        } catch (error) {
            console.error("Error during subject addition:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };
    
    const addTopic = async (subjectId) => {
        const topicTitle = newTopics[subjectId];
        const dueDate = dueDates[subjectId];
        
        if (!topicTitle) {
            toast.error("Please enter a topic title.");
            return;
        }
        try {
            const response = await axios.post('/api/topic', { 
                topic: topicTitle,
                subjectId,
                userId: user.id,
                dueDate,
                completed: false
            });
            const { error, message } = response.data;
            if (error) {
                toast.error(error);
            } else {
                toast.success(message || "Topic added successfully!");
                fetchData();
                setNewTopics(prev => ({
                    ...prev,
                    [subjectId]: ''
                }));
                setDueDates(prev => ({
                    ...prev,
                    [subjectId]: ''
                }));
            }
        } catch (error) {
            console.error("Error during topic addition:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };
    
    const toggleTopicCompletion = async (topicId, currentStatus) => {
        try {
            await axios.patch(`/api/topic/${user.id}/${topicId}`, {
                completed: !currentStatus
            });
            fetchData();
        } catch (error) {
            console.error("Error updating topic:", error);
            toast.error("Failed to update topic status");
        }
    };
    
    const deleteTopic = async (topicId) => {
        try {
            await axios.delete(`/api/topic/${user.id}/${topicId}`);
            toast.success("Topic deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Error deleting topic:", error);
            toast.error("Failed to delete topic");
        }
    };
    
    const deleteSubject = async (subjectId) => {
        try {
            await axios.delete(`/api/subject/${user.id}/${subjectId}`);
            toast.success("Subject deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Error deleting subject:", error);
            toast.error("Failed to delete subject");
        }
    };

    
    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/task/${taskId}/${user.id}`);

            toast.success("Task deleted successfully!");
            fetchTasks(); // Refresh the list after deletion
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };
    
    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask) return toast.error("Enter a task");
    
        try {
            const response = await axios.post('/api/task', {
                userId: user.id,
                title: newTask
            });
            toast.success(response.data.message);
            setNewTask('');
            fetchTasks();
        } catch (error) {
            toast.error("Failed to add task");
        }
    };
    
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/tasks/${user.id}`);
            setTasks(response.data);
        } catch (error) {
            toast.error("Failed to load tasks");
        }
    };
    
    
    // Fetch tasks when the component mounts
    useEffect(() => {
        if (user?.id) {
            fetchTasks();
        }
    }, [user?.id]);


    useEffect(() => {
        if (!isLoading && user == null) {
            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    
    return (
        <div className="flex min-h-screen w-full bg-slate-50">
            {/* Sidebar remains similar, just updated text */}
            <aside className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ease-in-out bg-white border-r border-slate-200 shadow-lg ${
                            isExpanded ? "w-80" : "w-12"
                        }`}>
                            <div className="h-full flex flex-col relative">
                                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
                                    <div className={`transition-opacity duration-300 ${
                                        isExpanded ? "opacity-100" : "opacity-0"
                                    }`}>
                                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Dashboard
                                        </span>
                                    </div>
                                </div>
            
                                {isExpanded && (
                                    <div className="p-4 space-y-4">
                                        <div className="mb-6">
                                            <form onSubmit={addTask}>
                                            <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                <input
                                                    type="text"
                                                    value={newTask}
                                                    onChange={(e) => setNewTask(e.target.value)}
                                                    placeholder="Add new item..."
                                                    className="flex-1 bg-transparent focus:outline-none text-sm"
                                                />
                                                <button
                                                type='submit'
                                                className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            </form>
                                            
                                        </div>
            
                                        {tasks.map((task) => (
                                            <motion.div
                                                key={task._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center group"
                                            >
                                                <span className="text-slate-600 text-sm">{task.title}</span>
                                                <button onClick={() => deleteTask(task._id)}  className="text-red-500 group-hover:opacity-100 transition-opacity hover:text-red-600">
                                                    <X size={16}  />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
            
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="absolute top-1/2 -right-4 w-8 h-12 bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 rounded-r-lg transition-colors"
                                >
                                    {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                </button>
                            </div>
                        </aside>

            <main className={`flex-1 transition-all duration-300 ${isExpanded ? "ml-80" : "ml-12"}`}>
                <div className="p-8 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                                {nickname}'s Study Planner
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Organize your studies by subject and track your progress
                            </p>
                        </div>

                        {/* Subject Form */}
                        <div className="mb-12">
                            <form onSubmit={addSubject} className="bg-white p-6 rounded-xl shadow-sm max-w-md mx-auto border border-slate-200">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Add New Subject
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={subject}
                                        placeholder="Enter subject name..."
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="flex-1 p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Add Subject
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-slate-600">Loading your study plan...</p>
                            </div>
                        ) : (
                             // Subject Grid
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                                {subjects.map((subjectItem) => (
                                    <motion.div
                                        key={subjectItem._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col h-full"
                                    >
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    {subjectItem.name}
                                                </h3>
                                                <button 
                                                    className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                                    onClick={() => deleteSubject(subjectItem._id)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <div className="mb-4 space-y-2">
                                                <input
                                                    type="text"
                                                    value={newTopics[subjectItem._id] || ''}
                                                    onChange={(e) => setNewTopics(prev => ({
                                                        ...prev,
                                                        [subjectItem._id]: e.target.value
                                                    }))}
                                                    placeholder="Add topic or task..."
                                                    className="w-[85%] p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                                
                                                <button
                                                    type='submit'
                                                    onClick={() => addTopic(subjectItem._id)}
                                                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <div className="space-y-2 flex-1">
                                                {topicsBySubject[subjectItem._id]?.map((topic) => (
                                                    <div
                                                        key={topic._id}
                                                        className="flex justify-between items-center p-2 rounded-md group hover:bg-slate-100 transition-colors bg-slate-50"
                                                    >
                                                        <span className="text-sm text-slate-700">
                                                            {topic.title}
                                                        </span>
                                                        <button
                                                            className="text-red-500 hover:text-red-600"
                                                            onClick={() => deleteTopic(topic._id)}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Studies;