'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  task: string;
  status: 'completed' | 'in_progress' | 'pending';
  avatar?: string;
}

interface TeamCollaborationProps {
  teamMembers?: TeamMember[];
}

const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alexandra Deff',
    email: 'a.deff@easypicsy.com',
    task: 'Event Photography Setup',
    status: 'completed',
  },
  {
    id: '2', 
    name: 'Edwin Adenike',
    email: 'e.adenike@easypicsy.com',
    task: 'Booth Maintenance Check',
    status: 'in_progress',
  },
  {
    id: '3',
    name: 'Isaac Oluwatemiloru',
    email: 'i.oluwat@easypicsy.com',
    task: 'Client Equipment Delivery',
    status: 'pending',
  },
  {
    id: '4',
    name: 'David Oshodi',
    email: 'd.oshodi@easypicsy.com',
    task: 'Props & Backdrop Setup',
    status: 'in_progress',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'in_progress':
      return 'bg-easy-yellow/20 text-dash-orange';
    case 'pending':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

export function TeamCollaboration({ teamMembers = defaultTeamMembers }: TeamCollaborationProps) {
  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">Team Collaboration</CardTitle>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-dash-gray/10 transition-colors group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-dash-orange to-easy-yellow rounded-full flex items-center justify-center">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-dash-navy group-hover:text-dash-navy/80 truncate">
                    {member.name}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {getStatusText(member.status)}
                  </span>
                </div>
                <p className="text-sm text-dash-navy/70 truncate mt-1">
                  Working on: {member.task}
                </p>
                <p className="text-xs text-dash-navy/50 truncate">
                  {member.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}