'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Play, Pause, Square, Plus, Edit2, Trash2, Check, X, Clock, Timer } from 'lucide-react'

interface Task {
  id: string
  time: string
  title: string
  notes: string
  isRunning: boolean
  isCompleted: boolean
  progress: number
  elapsedTime: number
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      time: '08:00',
      title: 'Morning Review',
      notes: 'Check emails • Plan day • Review goals',
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
    {
      id: '2',
      time: '09:30',
      title: 'Deep Work Session',
      notes: 'Focus on main project • No distractions',
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
    {
      id: '3',
      time: '12:00',
      title: 'Lunch Break',
      notes: 'Healthy meal • Walk outside',
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
    {
      id: '4',
      time: '14:00',
      title: 'Team Meeting',
      notes: 'Weekly sync • Project updates',
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
    {
      id: '5',
      time: '16:00',
      title: 'Creative Work',
      notes: 'Design • Brainstorm • Prototype',
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
  ])

  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [streak, setStreak] = useState(7)
  const [showTimer, setShowTimer] = useState(true)
  const [timerMode, setTimerMode] = useState<'timer' | 'stopwatch'>('timer')
  const [timerSeconds, setTimerSeconds] = useState(1500) // 25 minutes
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerInitial, setTimerInitial] = useState(1500)
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])

  const [newTask, setNewTask] = useState({ time: '', title: '', notes: '' })

  // Calculate overall progress
  const overallProgress = tasks.length > 0
    ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100)
    : 0

  // Timer intervals
  useEffect(() => {
    let interval: NodeJS.Timeout
    tasks.forEach(task => {
      if (task.isRunning) {
        interval = setInterval(() => {
          setTasks(prev => prev.map(t =>
            t.id === task.id
              ? { ...t, elapsedTime: t.elapsedTime + 1, progress: Math.min(100, t.progress + (100 / 3600)) }
              : t
          ))
        }, 1000)
      }
    })
    return () => clearInterval(interval)
  }, [tasks])

  // Timer/Stopwatch intervals
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerRunning && timerMode === 'timer' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => Math.max(0, prev - 1))
      }, 1000)
    } else if (stopwatchRunning && timerMode === 'stopwatch') {
      interval = setInterval(() => {
        setStopwatchSeconds(prev => prev + 0.01)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [timerRunning, stopwatchRunning, timerMode, timerSeconds])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const formatStopwatch = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, isRunning: !task.isRunning }
        : { ...task, isRunning: false }
    ))
  }

  const completeTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, isCompleted: !task.isCompleted, isRunning: false, progress: task.isCompleted ? task.progress : 100 }
        : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const addTask = () => {
    if (newTask.title && newTask.time) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        time: newTask.time,
        title: newTask.title,
        notes: newTask.notes,
        isRunning: false,
        isCompleted: false,
        progress: 0,
        elapsedTime: 0,
      }])
      setNewTask({ time: '', title: '', notes: '' })
      setIsAddingTask(false)
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-semibold text-gray-900">Today</h1>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingTask(true)}
                className="neumo-flat rounded-full p-3 hover:shadow-apple-lg transition-all"
              >
                <Plus className="w-5 h-5 text-apple-blue" />
              </motion.button>
            </div>
          </div>
          <p className="text-apple-gray-500 text-sm">{currentDate}</p>
        </motion.div>

        {/* Progress Ring & Streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neumo-flat rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#E5E5EA"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#007AFF"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-apple-blue">{overallProgress}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-apple-gray-500 mb-1">Daily Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.isCompleted).length} of {tasks.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-apple-gray-500 mb-1">Streak</p>
              <p className="text-4xl font-semibold text-gray-900">{streak} 🔥</p>
            </div>
          </div>
        </motion.div>

        {/* Timer/Stopwatch Widget */}
        <AnimatePresence>
          {showTimer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="neumo-flat rounded-3xl p-6 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-apple-blue" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {timerMode === 'timer' ? 'Timer' : 'Stopwatch'}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTimerMode(timerMode === 'timer' ? 'stopwatch' : 'timer')
                      setTimerRunning(false)
                      setStopwatchRunning(false)
                    }}
                    className="px-4 py-2 rounded-full text-sm font-medium neumo-flat hover:shadow-apple transition-all"
                  >
                    {timerMode === 'timer' ? 'Stopwatch' : 'Timer'}
                  </button>
                </div>
              </div>

              {timerMode === 'timer' ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#E5E5EA"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#007AFF"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - timerSeconds / timerInitial)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-semibold text-gray-900 tabular-nums">
                        {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="neumo-flat rounded-full p-4 hover:shadow-apple-lg transition-all"
                    >
                      {timerRunning ? (
                        <Pause className="w-6 h-6 text-apple-blue" />
                      ) : (
                        <Play className="w-6 h-6 text-apple-blue" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setTimerRunning(false)
                        setTimerSeconds(timerInitial)
                      }}
                      className="neumo-flat rounded-full p-4 hover:shadow-apple-lg transition-all"
                    >
                      <Square className="w-6 h-6 text-apple-gray-500" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-6">
                    <span className="text-6xl font-semibold text-gray-900 tabular-nums">
                      {formatStopwatch(stopwatchSeconds)}
                    </span>
                  </div>
                  <div className="flex gap-3 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStopwatchRunning(!stopwatchRunning)}
                      className="neumo-flat rounded-full p-4 hover:shadow-apple-lg transition-all"
                    >
                      {stopwatchRunning ? (
                        <Pause className="w-6 h-6 text-apple-blue" />
                      ) : (
                        <Play className="w-6 h-6 text-apple-blue" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (stopwatchRunning) {
                          setLaps([...laps, stopwatchSeconds])
                        } else {
                          setStopwatchSeconds(0)
                          setLaps([])
                        }
                      }}
                      className="neumo-flat rounded-full p-4 hover:shadow-apple-lg transition-all"
                    >
                      <Square className="w-6 h-6 text-apple-gray-500" />
                    </motion.button>
                  </div>
                  {laps.length > 0 && (
                    <div className="w-full max-h-32 overflow-y-auto space-y-2">
                      {laps.map((lap, i) => (
                        <div key={i} className="flex justify-between text-sm text-apple-gray-500 px-4">
                          <span>Lap {i + 1}</span>
                          <span className="tabular-nums">{formatStopwatch(lap)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Task Modal */}
        <AnimatePresence>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsAddingTask(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="neumo-flat rounded-3xl p-8 max-w-md w-full"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add Task</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-apple-gray-500 mb-2 block">Time</label>
                    <input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl neumo-inset text-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-apple-gray-500 mb-2 block">Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task title"
                      className="w-full px-4 py-3 rounded-2xl neumo-inset text-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-apple-gray-500 mb-2 block">Notes</label>
                    <textarea
                      value={newTask.notes}
                      onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                      placeholder="Add notes or subtasks..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl neumo-inset text-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addTask}
                    className="flex-1 py-3 rounded-full bg-apple-blue text-white font-medium hover:shadow-apple-lg transition-all"
                  >
                    Add Task
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingTask(false)}
                    className="flex-1 py-3 rounded-full neumo-flat text-gray-900 font-medium hover:shadow-apple transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Timeline */}
        <div className="space-y-4">
          <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-4">
            {tasks.map((task) => (
              <Reorder.Item key={task.id} value={task}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`neumo-flat rounded-3xl p-6 cursor-grab active:cursor-grabbing transition-all ${
                    task.isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Time */}
                    <div className="flex-shrink-0 w-20">
                      <div className="neumo-flat rounded-xl px-3 py-2 text-center">
                        <p className="text-sm font-semibold text-gray-900">{task.time}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${
                        task.isCompleted ? 'line-through' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-apple-gray-500 mb-3">{task.notes}</p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="h-2 neumo-inset rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            className="h-full bg-apple-blue rounded-full"
                          />
                        </div>
                      </div>

                      {/* Timer Display */}
                      {task.isRunning && (
                        <p className="text-sm text-apple-blue font-medium mb-3 tabular-nums">
                          {formatTime(task.elapsedTime)}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleTask(task.id)}
                          className={`neumo-flat rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                            task.isRunning ? 'text-apple-blue' : 'text-gray-900'
                          }`}
                        >
                          {task.isRunning ? (
                            <>
                              <Pause className="w-4 h-4" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Start
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => completeTask(task.id)}
                          className="neumo-flat rounded-full p-2"
                        >
                          {task.isCompleted ? (
                            <X className="w-4 h-4 text-apple-gray-500" />
                          ) : (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteTask(task.id)}
                          className="neumo-flat rounded-full p-2"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </div>
  )
}
