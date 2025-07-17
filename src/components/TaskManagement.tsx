import React, { useState } from 'react';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Check, X, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/hooks/useFirestore';
import { Task } from '@/types/Task';

interface TaskManagementProps {
  currentWeekOffset: number;
  userId: string;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ currentWeekOffset, userId }) => {
  const { data: tasks, addItem: addTask, updateItem: updateTask, deleteItem: deleteTask } = useFirestore<Task>('tasks', userId);
  const [newTask, setNewTask] = useState({ description: '', dueDate: '', assignedTo: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showAddForm, setShowAddForm] = useState(false);

  const getCurrentWeekStart = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    return addDays(weekStart, currentWeekOffset * 7);
  };

  const getWeekDays = () => {
    const weekStart = getCurrentWeekStart();
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const handleAddTask = async () => {
    if (!newTask.description || !newTask.dueDate || !newTask.assignedTo) return;

    try {
      await addTask({
        description: newTask.description,
        dueDate: newTask.dueDate,
        assignedTo: newTask.assignedTo,
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setNewTask({ description: '', dueDate: '', assignedTo: '' });
      setShowAddForm(false);
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className={cn("p-2 border rounded bg-white shadow-sm text-xs", task.completed && "opacity-60")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className={cn("font-medium text-gray-900", task.completed && "line-through")}>
            {task.description}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Assigned to: {task.assignedTo}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleUpdateTask(task.id, { completed: !task.completed })}
            className="h-6 w-6 p-0"
          >
            {task.completed ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingTask(task)}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteTask(task.id)}
            className="h-6 w-6 p-0 text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Weekly Tasks
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="text-xs"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {showAddForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-3">
              <Textarea
                placeholder="Task description (e.g., 'Call ZIM to renew quote#1235')"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal flex-1",
                        !newTask.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(parseISO(newTask.dueDate), "PPP") : "Select due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setNewTask(prev => ({ ...prev, dueDate: format(date, 'yyyy-MM-dd') }));
                        }
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  placeholder="Assigned to"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddTask}>
                  Add Task
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-4">
          {getWeekDays().map(date => {
            const dayTasks = getTasksForDate(date);
            return (
              <div key={date.toISOString()} className="space-y-2">
                <div className="text-center p-2 bg-gray-50 rounded border">
                  <div className="font-semibold text-gray-900 text-sm">
                    {format(date, 'EEE')}
                  </div>
                  <div className="text-lg font-bold text-gray-700">
                    {format(date, 'd')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {dayTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full">
              <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
              <div className="space-y-3">
                <Textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal flex-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(parseISO(editingTask.dueDate), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={parseISO(editingTask.dueDate)}
                        onSelect={(date) => {
                          if (date) {
                            setEditingTask(prev => prev ? { ...prev, dueDate: format(date, 'yyyy-MM-dd') } : null);
                          }
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={editingTask.assignedTo}
                    onChange={(e) => setEditingTask(prev => prev ? { ...prev, assignedTo: e.target.value } : null)}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdateTask(editingTask.id, editingTask)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskManagement;