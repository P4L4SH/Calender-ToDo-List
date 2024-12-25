import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Trash2, Edit2, Check, X, Save, CircleCheck } from 'lucide-react';

const TodoApp = () => {
  // Initialize state with console logs to track state changes
  const [tasks, setTasks] = useState(() => {
    console.log('Initializing tasks state');
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Debug log for state changes
  useEffect(() => {
    console.log('Current tasks:', tasks);
    console.log('Selected date:', selectedDate);
  }, [tasks, selectedDate]);

  // Separate function for adding tasks
  const addNewTask = () => {
    console.log('Attempting to add new task:', inputValue);
    
    if (inputValue.trim() === '') {
      console.log('Empty input, returning');
      return false;
    }

    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      date: selectedDate,
    };

    console.log('Creating new task:', newTask);

    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      console.log('Updated tasks:', updatedTasks);
      return updatedTasks;
    });

    setInputValue('');
    return true;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    addNewTask();
  };

  // Button click handler
  const handleAddClick = () => {
    console.log('Add button clicked');
    addNewTask();
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    console.log('Deleting task:', taskId);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Toggle task completion
  const handleToggleComplete = (taskId) => {
    console.log('Toggling completion for task:', taskId);
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Start editing task
  const handleStartEdit = (task) => {
    console.log('Starting edit for task:', task.id);
    setEditingId(task.id);
    setEditValue(task.text);
  };

  // Save edited task
  const handleSaveEdit = (taskId) => {
    console.log('Saving edit for task:', taskId);
    if (editValue.trim() === '') return;
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, text: editValue.trim() } : task
      )
    );
    setEditingId(null);
    setEditValue('');
  };

  // Filter tasks for selected date
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    const selected = new Date(selectedDate);
    return taskDate.toDateString() === selected.toDateString();
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Calendar Section */}
          <div className="md:col-span-5 p-6 border-r border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Date
            </h2>
            <div className="calendar-container">
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
          </div>

          {/* Todo List Section */}
          <div className="md:col-span-7 p-6">
            <h2 className="text-xl font-semibold mb-4">
              Tasks for {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>

            {/* Add Task Form */}
            <form 
              onSubmit={handleSubmit} 
              className="flex gap-2 mb-6"
            >
              <input
                type="text"
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add new task..."
              />
              <button 
                type="button"
                onClick={handleAddClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Task
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No tasks scheduled for this date
                </p>
              ) : (
                filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {editingId === task.id ? (
                      <div className="flex items-center gap-2 flex-grow">
                        <input
                          type="text"
                          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`flex-grow ${
                            task.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {task.text}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleComplete(task.id)}
                            className={`p-2 rounded-md ${
                              task.completed 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            <CircleCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;