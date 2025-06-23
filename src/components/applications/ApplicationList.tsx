
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApplicationCard from './ApplicationCard';

interface Application {
  id: string;
  name: string;
  description?: string;
  version?: string;
  code?: string;
  app_type?: string;
  app_type_ref?: string;
  app_status?: string;
  status?: string;
  status_ref?: string;
  layer?: string;
  component_id?: string;
  development_technology?: string;
  technology_ref?: string;
  development_type?: string;
  development_type_ref?: string;
  architecture_pattern?: string;
  authentication_type?: string;
  hosting_server?: string;
  app_link?: string;
  using_department?: string;
  using_department_ref?: string;
  owning_department?: string;
  owning_department_ref?: string;
  technical_owner?: string;
  end_user?: string;
  user_count?: number;
  importance?: string;
  developer_entity?: string;
  source_type?: string;
  launch_date?: string;
  initial_cost?: number;
  operational_cost?: number;
  capital_cost?: number;
  operation_type?: string;
  operation_type_ref?: string;
  created_at: string;
  updated_at?: string;
}

interface ApplicationListProps {
  applications: Application[];
  loading: boolean;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  loading,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة التطبيقات ({applications.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">جاري التحميل...</div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationList;
