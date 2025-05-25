
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

interface MenuChild {
  title: string;
  path: string;
  icon?: LucideIcon;
  show?: boolean;
  children?: MenuChild[];
}

interface SidebarMenuItemProps {
  title: string;
  icon: LucideIcon;
  path?: string;
  children?: MenuChild[];
  show?: boolean;
  level?: number;
}

const SidebarMenuItem = ({ title, icon: Icon, path, children, show, level = 0 }: SidebarMenuItemProps) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (itemPath: string) => location.pathname === itemPath;

  if (show === false) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const marginClass = level === 0 ? "" : level === 1 ? "mr-6" : "mr-12";

  if (children && children.length > 0) {
    const visibleChildren = children.filter(child => child.show !== false);
    
    if (visibleChildren.length === 0 && level > 0) {
      return null;
    }

    return (
      <div className={marginClass}>
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
          <div className="mt-2 space-y-1">
            {visibleChildren.map((child) => (
              <SidebarMenuItem
                key={child.path}
                title={child.title}
                icon={child.icon || Icon}
                path={child.path}
                children={child.children}
                show={child.show}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (path) {
    return (
      <div className={marginClass}>
        <Link
          to={path}
          className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-green-700 transition-colors ${
            isActive(path) ? "bg-green-600" : ""
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{title}</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default SidebarMenuItem;
