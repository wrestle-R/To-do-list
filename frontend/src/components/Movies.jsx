import React, { useState, useContext, useEffect  } from 'react';
import {useNavigate} from 'react-router-dom'
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { UserContext } from '../../context/userContext';
import axios from "axios";
import { toast } from "react-hot-toast";

const Movies = () => {
    const { user } = useContext(UserContext);
    const [genre, setGenre] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [genres, setGenres] = useState([]);
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [newMovies, setNewMovies] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    
    const navigate = useNavigate()
    // Existing functions remain unchanged
    const formatName = (fullName) => {
        if (!fullName) return "";
        const firstName = fullName.trim().split(" ")[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    };
    
    const nickname = user?.fullName ? formatName(user.fullName) : "Your";

    // Keep all existing fetch, add, and delete functions unchanged
    const fetchData = async () => {
        
        setIsLoading(true);
        try {
            // Fetch genres for the logged-in user
            const genresResponse = await axios.get(`/api/genres/${user.id}`);
            const fetchedGenres = genresResponse.data;
            setGenres(fetchedGenres);
    
            const moviesData = {};
            for (const genre of fetchedGenres) {
                // Fetch movies for each genre of the logged-in user
                const moviesResponse = await axios.get(`/api/movies/${user.id}/${genre._id}`);
                moviesData[genre._id] = moviesResponse.data;
            }
            setMoviesByGenre(moviesData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load movies and genres");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
    }, [user?.id]); // Re-fetch when userId changes
    
    const addGenre = async (e) => {
        e.preventDefault();
        if (!genre) {
            toast.error("Please enter a genre.");
            return;
        }
        try {
            const response = await axios.post('/api/genre', { 
                genre,
                userId: user.id // Correctly send userId
            });
            const { error, message } = response.data;
            if (error) {
                toast.error(error);
            } else {
                toast.success(message || "Genre added successfully!");
                fetchData();
                setGenre("");
            }
        } catch (error) {
            console.error("Error during genre addition:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };
    
    const addMovie = async (genreId) => {
        const movieTitle = newMovies[genreId];
        if (!movieTitle) {
            toast.error("Please enter a movie title.");
            return;
        }
        try {
            const response = await axios.post('/api/movie', { 
                movie: movieTitle,
                genreId,
                userId: user.id // Correctly send userId
            });
            const { error, message } = response.data;
            if (error) {
                toast.error(error);
            } else {
                toast.success(message || "Movie added successfully!");
                fetchData();
                setNewMovies(prev => ({
                    ...prev,
                    [genreId]: ''
                }));
            }
        } catch (error) {
            console.error("Error during movie addition:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };
    
    const handleDeleteMovie = async (movieId) => {
        try {
            // Correct `user._id` in delete request
            await axios.delete(`/api/movie/${user.id}/${movieId}`);
            toast.success("Movie deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Error deleting movie:", error);
            toast.error("Failed to delete movie");
        }
    };
    
    const deleteGenre = async (genreId) => {
        try {
            // Correct `user._id` in delete request
            await axios.delete(`/api/genre/${user.id}/${genreId}`);
            toast.success("Genre deleted successfully!");
            fetchData();
        } catch (error) {
            console.error("Error deleting genre:", error);
            toast.error("Failed to delete genre");
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
            {/* Enhanced Sidebar */}
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

            {/* Enhanced Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isExpanded ? "ml-80" : "ml-12"}`}>
                <div className="p-8 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Enhanced Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                {nickname}'s Movie Watchlist
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Organize and track your favorite movies by genre
                            </p>
                        </div>

                        {/* Enhanced Genre Form */}
                        <div className="mb-12">
                            <form onSubmit={addGenre} className="bg-white p-6 rounded-xl shadow-sm max-w-md mx-auto border border-slate-200">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Add New Genre
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={genre}
                                        placeholder="Type your genre here..."
                                        onChange={(e) => setGenre(e.target.value)}
                                        className="flex-1 p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Add Genre
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-4 text-slate-600">Loading your movies...</p>
                            </div>
                        ) : (
                            // Enhanced Genre Grid with Auto-height Rows
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                                {genres.map((genreItem) => (
                                    <motion.div
                                        key={genreItem._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col h-full"
                                    >
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    {genreItem.name}
                                                </h3>
                                                <button 
                                                    className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                                    onClick={() => deleteGenre(genreItem._id)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                            
                                            <div className="mb-4">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newMovies[genreItem._id] || ''}
                                                        onChange={(e) => setNewMovies(prev => ({
                                                            ...prev,
                                                            [genreItem._id]: e.target.value
                                                        }))}
                                                        placeholder="Add movie to this genre..."
                                                        className="flex-1 p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    />
                                                    <button
                                                        onClick={() => addMovie(genreItem._id)}
                                                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2 flex-1">
                                                {moviesByGenre[genreItem._id]?.map((movie) => (
                                                    <div
                                                        key={movie._id}
                                                        className="flex justify-between items-center p-2 bg-slate-50 rounded-md group hover:bg-slate-100 transition-colors"
                                                    >
                                                        <span className="text-slate-600 text-sm">{movie.title}</span>
                                                        <button
                                                            className="text-red-500 opacity-100 hover:text-red-600"
                                                            onClick={() => handleDeleteMovie(movie._id)}
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

export default Movies;