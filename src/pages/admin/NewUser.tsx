
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '@/components/forms/UserForm';

const NewUser: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate('/admin/users');
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <UserForm
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default NewUser;
