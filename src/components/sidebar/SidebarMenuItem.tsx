
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

interface MenuChild {
  title: string;
  path: string;
  icon?: LucideIcon;
  show?: boolean;
}

interface SidebarMenuItemProps {
  title: string;
  icon: LucideIcon;
  path?: string;
  children?: MenuChild[];
  show?: boolean;
}

const SidebarMenuItem = ({ title, icon: Icon, path, children, show }: SidebarMenuItemProps) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (itemPath: string) => location.pathname === itemPath;

  if (show === false) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  if (children && children.length > 0) {
    const visibleChildren = children.filter(child => child.show !== false);
    
    if (visibleChildren.length === 0) {
      return null;
    }

    return (
      <div>
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isExpanded && (
          <div className="mr-6 mt-2 space-y-1">
            {visibleChildren.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                className={`flex items-center space-x-2 space-x-reverse p-2 rounded-md text-sm hover:bg-green-700 transition-colors ${
                  isActive(child.path) ? "bg-green-600" : ""
                }`}
              >
                {child.icon && <child.icon className="w-4 h-4" />}
                <span>{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (path) {
    return (
      <Link
        to={path}
        className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-green-700 transition-colors ${
          isActive(path) ? "bg-green-600" : ""
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
      </Link>
    );
  }

  return null;
};

export default SidebarMenuItem;
