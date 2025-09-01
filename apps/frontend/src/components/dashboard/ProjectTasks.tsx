'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, Settings } from 'lucide-react';

interface EventTask {
  id: string;
  name: string;
  type: 'development' | 'onboarding' | 'build' | 'optimize' | 'testing';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  description?: string;
}

interface ProjectTasksProps {
  tasks?: EventTask[];
}

const defaultTasks: EventTask[] = [
  {
    id: '1',
    name: 'Develop API Endpoints',
    type: 'development',
    dueDate: 'Nov 26, 2024',
    priority: 'high',
    status: 'pending',
    description: 'Create REST endpoints for event management',
  },
  {
    id: '2',
    name: 'Onboarding Flow',
    type: 'onboarding', 
    dueDate: 'Nov 28, 2024',
    priority: 'medium',
    status: 'pending',
    description: 'Design user onboarding experience',
  },
  {
    id: '3',
    name: 'Build Dashboard',
    type: 'build',
    dueDate: 'Nov 30, 2024', 
    priority: 'high',
    status: 'in_progress',
    description: 'Complete admin dashboard interface',
  },
  {
    id: '4',
    name: 'Optimize Page Load',
    type: 'optimize',
    dueDate: 'Dec 5, 2024',
    priority: 'medium',
    status: 'pending',
    description: 'Improve application performance',
  },
  {
    id: '5',
    name: 'Cross-Browser Testing',
    type: 'testing',
    dueDate: 'Dec 6, 2024',
    priority: 'low',
    status: 'pending',
    description: 'Test compatibility across browsers',
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'development':
      return Settings;
    case 'onboarding':
      return Settings;
    case 'build':
      return Settings;
    case 'optimize':
      return Settings;
    case 'testing':
      return Settings;
    default:
      return Calendar;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'development':
      return 'bg-blue-500';
    case 'onboarding':
      return 'bg-green-500';
    case 'build':
      return 'bg-purple-500';
    case 'optimize':
      return 'bg-orange-500';
    case 'testing':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-orange-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

export function ProjectTasks({ tasks = defaultTasks }: ProjectTasksProps) {
  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">Project</CardTitle>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => {
            const IconComponent = getTypeIcon(task.type);
            return (
              <div
                key={task.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-dash-gray/10 transition-colors group"
              >
                {/* Type Icon */}
                <div className={`w-8 h-8 ${getTypeColor(task.type)} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-dash-navy text-sm group-hover:text-dash-navy/80 truncate">
                      {task.name}
                    </p>
                    <span className={`text-xs font-medium ml-2 ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-dash-navy/60 mb-2 truncate">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-dash-navy/50">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Due date: {task.dueDate}</span>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : task.status === 'in_progress'
                          ? 'bg-easy-yellow/20 text-dash-orange'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {task.status === 'in_progress' ? 'In Progress' : 
                       task.status === 'completed' ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}