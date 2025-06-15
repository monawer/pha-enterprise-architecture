
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
  rtl?: boolean;
}

const SidebarMenuItem = ({
  title,
  icon: Icon,
  path,
  children,
  show,
  level = 0,
  rtl = false,
}: SidebarMenuItemProps) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (itemPath: string) => location.pathname === itemPath;

  if (show === false) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const marginClass =
    level === 0
      ? ""
      : level === 1
      ? rtl
        ? "ml-6"
        : "mr-6"
      : rtl
      ? "ml-12"
      : "mr-12";

  const flexDirection = rtl ? "flex-row-reverse" : "flex-row";
  const spaceClass = rtl ? "space-x-reverse space-x-3" : "space-x-3";

  if (children && children.length > 0) {
    const visibleChildren = children.filter((child) => child.show !== false);

    if (visibleChildren.length === 0 && level > 0) {
      return null;
    }

    return (
      <div className={marginClass}>
        <button
          onClick={toggleExpanded}
          className={`w-full flex ${flexDirection} items-center justify-between p-3 rounded-lg hover:bg-green-700 transition-colors`}
        >
          <div className={`flex ${flexDirection} ${spaceClass} items-center`}>
            <Icon className="w-5 h-5" />
            <span className="font-medium text-base">{title}</span>
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
                rtl={rtl}
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
          className={`flex ${flexDirection} items-center ${spaceClass} p-3 rounded-lg hover:bg-green-700 transition-colors ${
            isActive(path) ? "bg-green-600" : ""
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium text-base">{title}</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default SidebarMenuItem;
