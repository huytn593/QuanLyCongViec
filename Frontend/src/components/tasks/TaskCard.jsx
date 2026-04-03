import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, Calendar, MessageSquare, Tag, CheckSquare } from 'lucide-react';

const TaskCard = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`card mb-3 p-4 cursor-pointer hover:border-primary-300 transition-all ${
            snapshot.isDragging ? 'shadow-xl scale-105 border-primary-500 z-50' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-secondary-900 leading-tight">
              {task.title}
            </h4>
            {task.priority && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {task.priority === 'HIGH' ? 'CAO' :
                task.priority === 'MEDIUM' ? 'TRUNG BÌNH' :
                'THẤP'}
              </span>
            )}
          </div>
          
          <p className="text-sm text-secondary-500 mb-4 line-clamp-2">
            {task.description}
          </p>

          {(task.progress > 0 || task.status === 'DONE') && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-semibold text-secondary-400 uppercase tracking-wider">Tiến độ</span>
                <span className="text-[10px] font-bold text-primary-600">{Math.round(task.progress || 0)}%</span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    task.status === 'DONE' ? 'bg-emerald-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${task.progress || 0}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-secondary-500 mt-auto">
            {task.dueDate && (
              <div className={`flex items-center gap-1 font-medium ${
                new Date(task.dueDate) < new Date() && task.status !== 'DONE' 
                  ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded' 
                  : 'text-secondary-600'
              }`}>
                <Calendar size={14} />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            
            {task.progress !== undefined && (
              <div className="flex items-center gap-1">
                <CheckSquare size={14} />
                {Math.round(task.progress)}%
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag size={14} />
                {task.tags.length}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
