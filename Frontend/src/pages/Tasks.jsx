import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { taskService } from '../services/task.service';
import TaskCard from '../components/tasks/TaskCard';
import TaskFormModal from '../components/tasks/TaskFormModal';
import TaskDetailsModal from '../components/tasks/TaskDetailsModal';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const COLUMN_TYPES = ['TODO', 'IN_PROGRESS', 'DONE'];

const COLUMN_TITLES = {
  TODO: 'Cần làm',
  IN_PROGRESS: 'Đang thực hiện',
  DONE: 'Hoàn thành'
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      // Ensure data is an array
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Tải công việc thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic update
    const taskId = draggableId;
    const newStatus = destination.droppableId;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const originalTask = tasks[taskIndex];
    if (originalTask.status === newStatus) return;

    const newTasks = [...tasks];
    newTasks[taskIndex] = { ...originalTask, status: newStatus };
    setTasks(newTasks);

    try {
      await taskService.updateTask(taskId, { ...originalTask, status: newStatus });
      toast.success('Đã cập nhật công việc');
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật trạng thái thất bại');
      setTasks(tasks); // revert
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success('Tạo công việc thành công');
      setIsFormOpen(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error('Tạo công việc thất bại');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(selectedTask.id, taskData);
      toast.success('Cập nhật công việc thành công');
      setIsFormOpen(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật công việc thất bại');
    }
  };

  const openEditForm = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(false);
    setIsFormOpen(true);
  };

  const openDetails = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Bảng Công Việc</h1>
          <p className="text-secondary-500 mt-1">Quản lý luồng công việc của bạn</p>
        </div>
        <button
          onClick={() => { setSelectedTask(null); setIsFormOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Công việc mới
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex h-full gap-6 min-w-max pb-4">
            {COLUMN_TYPES.map((status) => {
              const columnTasks = tasks.filter((t) => {
                if (status === 'TODO') {
                  return t.status === 'TODO' || t.status === 'OVERDUE';
                }
                return t.status === status;
              });
              
              return (
                <div key={status} className="w-80 flex flex-col max-h-full">
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <h3 className="font-semibold text-secondary-700 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'TODO' ? 'bg-blue-500' :
                        status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      {COLUMN_TITLES[status]}
                      <span className="bg-secondary-200 text-secondary-600 text-xs px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </h3>
                  </div>
                  
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto p-3 rounded-2xl transition-colors ${
                          snapshot.isDraggingOver ? 'bg-primary-50' : 'bg-secondary-100/50'
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            onClick={openDetails}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {isFormOpen && (
        <TaskFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          initialData={selectedTask}
        />
      )}

      {isDetailsOpen && selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            fetchTasks(); // Refresh in case subtasks/tags changed
          }}
          onRefresh={fetchTasks}
          onEdit={() => openEditForm(selectedTask)}
          onDelete={async () => {
            try {
              await taskService.deleteTask(selectedTask.id);
              toast.success('Đã xóa công việc');
              setIsDetailsOpen(false);
              fetchTasks();
            } catch (err) {
              console.error(err);
              toast.error('Xóa công việc thất bại');
            }
          }}
        />
      )}
    </div>
  );
};

export default Tasks;
