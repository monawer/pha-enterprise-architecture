
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin } from "lucide-react";

interface Branch {
  id: string;
  branch_name: string;
  branch_code?: string;
  branch_location?: string;
  created_at: string;
}

interface BranchCardMobileProps {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

const BranchCardMobile: React.FC<BranchCardMobileProps> = ({ branch, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border border-gray-100 shadow-sm p-4 bg-white mb-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-saudi-green-900">{branch.branch_name}</div>
          {branch.branch_code && (
            <div className="text-xs text-gray-400 mt-1">رمز: {branch.branch_code}</div>
          )}
          {branch.branch_location && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3 ml-1" /> {branch.branch_location}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(branch)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(branch)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchCardMobile;
