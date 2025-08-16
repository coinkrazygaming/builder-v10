import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Type,
  Image,
  Square,
  Circle,
  Navigation,
  Layout,
  BarChart3,
  Calendar,
  Mail,
  User,
  Settings,
  ShoppingCart,
  Star,
  Heart,
  MessageCircle,
  Play,
  Download,
  Share,
  Eye,
  MousePointer,
  Layers,
  Grid3X3,
  Heading,
  AlignLeft,
  Link,
  Table,
  List,
  Quote,
  Code,
  Video,
  Music,
  Map,
  Phone,
  Send,
  CheckSquare,
  Slider,
  ToggleLeft,
  Calendar as CalendarIcon,
  Clock,
  Zap,
  Shield,
  Award,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ElementType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  description: string;
  isPremium?: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  defaultProps: Record<string, any>;
  defaultStyle: Record<string, any>;
  canHaveChildren?: boolean;
  tags: string[];
}

const elementTypes: ElementType[] = [
  // Basic Elements
  {
    id: "heading",
    name: "Heading",
    icon: Heading,
    category: "Basic",
    description: "Text heading with different sizes",
    difficulty: "beginner",
    defaultProps: { children: "Your Heading Here", level: 2 },
    defaultStyle: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" },
    tags: ["text", "title", "h1", "h2", "h3"]
  },
  {
    id: "text",
    name: "Text",
    icon: Type,
    category: "Basic",
    description: "Plain text paragraph",
    difficulty: "beginner",
    defaultProps: { children: "Your text content here." },
    defaultStyle: { fontSize: "16px", lineHeight: "1.6", marginBottom: "16px" },
    tags: ["paragraph", "content", "body"]
  },
  {
    id: "button",
    name: "Button",
    icon: MousePointer,
    category: "Basic",
    description: "Interactive button element",
    difficulty: "beginner",
    defaultProps: { children: "Click Me", variant: "primary" },
    defaultStyle: { 
      padding: "12px 24px", 
      backgroundColor: "#3b82f6", 
      color: "white", 
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500"
    },
    tags: ["cta", "action", "click", "submit"]
  },
  {
    id: "image",
    name: "Image",
    icon: Image,
    category: "Basic",
    description: "Image with alt text",
    difficulty: "beginner",
    defaultProps: { 
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
      alt: "Placeholder image"
    },
    defaultStyle: { width: "100%", height: "auto", borderRadius: "8px" },
    tags: ["media", "visual", "photo", "picture"]
  },
  {
    id: "link",
    name: "Link",
    icon: Link,
    category: "Basic",
    description: "Clickable link element",
    difficulty: "beginner",
    defaultProps: { children: "Click here", href: "#" },
    defaultStyle: { color: "#3b82f6", textDecoration: "underline" },
    tags: ["navigation", "url", "anchor", "href"]
  },

  // Layout Elements
  {
    id: "container",
    name: "Container",
    icon: Square,
    category: "Layout",
    description: "Flexible container for other elements",
    difficulty: "beginner",
    canHaveChildren: true,
    defaultProps: {},
    defaultStyle: { 
      padding: "20px",
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      border: "2px dashed #cbd5e1",
      minHeight: "100px"
    },
    tags: ["wrapper", "box", "section", "div"]
  },
  {
    id: "flexbox",
    name: "Flex Container",
    icon: Layout,
    category: "Layout",
    description: "Flexbox layout container",
    difficulty: "intermediate",
    canHaveChildren: true,
    defaultProps: { direction: "row", justify: "flex-start", align: "flex-start" },
    defaultStyle: { 
      display: "flex",
      gap: "16px",
      padding: "16px",
      border: "2px dashed #cbd5e1",
      minHeight: "80px"
    },
    tags: ["flex", "row", "column", "layout", "responsive"]
  },
  {
    id: "grid",
    name: "Grid Container",
    icon: Grid3X3,
    category: "Layout",
    description: "CSS Grid layout container",
    difficulty: "intermediate",
    canHaveChildren: true,
    defaultProps: { columns: 3, gap: 16 },
    defaultStyle: { 
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      padding: "16px",
      border: "2px dashed #cbd5e1",
      minHeight: "120px"
    },
    tags: ["grid", "columns", "rows", "layout", "responsive"]
  },

  // Navigation Elements
  {
    id: "navbar",
    name: "Navigation Bar",
    icon: Navigation,
    category: "Navigation",
    description: "Responsive navigation bar",
    difficulty: "intermediate",
    isPremium: true,
    defaultProps: { 
      brand: "Logo",
      links: ["Home", "About", "Services", "Contact"],
      ctaText: "Get Started"
    },
    defaultStyle: { 
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      backgroundColor: "white",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    },
    tags: ["nav", "menu", "header", "links", "responsive"]
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    icon: Navigation,
    category: "Navigation",
    description: "Breadcrumb navigation trail",
    difficulty: "beginner",
    defaultProps: { 
      items: [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "Current Page" }
      ]
    },
    defaultStyle: { 
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "16px"
    },
    tags: ["navigation", "trail", "path", "hierarchy"]
  },

  // Form Elements
  {
    id: "input",
    name: "Input Field",
    icon: Type,
    category: "Forms",
    description: "Text input field",
    difficulty: "beginner",
    defaultProps: { 
      type: "text",
      placeholder: "Enter text...",
      label: "Input Label"
    },
    defaultStyle: { 
      width: "100%",
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "16px"
    },
    tags: ["form", "field", "text", "input", "user-input"]
  },
  {
    id: "textarea",
    name: "Text Area",
    icon: AlignLeft,
    category: "Forms",
    description: "Multi-line text input",
    difficulty: "beginner",
    defaultProps: { 
      placeholder: "Enter your message...",
      rows: 4,
      label: "Message"
    },
    defaultStyle: { 
      width: "100%",
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "16px",
      resize: "vertical"
    },
    tags: ["form", "textarea", "multiline", "message", "comments"]
  },
  {
    id: "checkbox",
    name: "Checkbox",
    icon: CheckSquare,
    category: "Forms",
    description: "Checkbox input for selections",
    difficulty: "beginner",
    defaultProps: { 
      label: "Check this option",
      checked: false
    },
    defaultStyle: { 
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "16px"
    },
    tags: ["form", "checkbox", "selection", "boolean", "option"]
  },

  // Media Elements
  {
    id: "video",
    name: "Video Player",
    icon: Video,
    category: "Media",
    description: "Video player component",
    difficulty: "intermediate",
    isPremium: true,
    defaultProps: { 
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      controls: true,
      autoplay: false
    },
    defaultStyle: { 
      width: "100%",
      height: "auto",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    },
    tags: ["media", "video", "player", "streaming", "embed"]
  },
  {
    id: "audio",
    name: "Audio Player",
    icon: Music,
    category: "Media",
    description: "Audio player component",
    difficulty: "intermediate",
    defaultProps: { 
      src: "audio.mp3",
      controls: true
    },
    defaultStyle: { 
      width: "100%",
      height: "40px"
    },
    tags: ["media", "audio", "music", "sound", "player"]
  },

  // Data Display
  {
    id: "table",
    name: "Data Table",
    icon: Table,
    category: "Data",
    description: "Responsive data table",
    difficulty: "intermediate",
    isPremium: true,
    defaultProps: { 
      headers: ["Name", "Email", "Role"],
      rows: [
        ["John Doe", "john@example.com", "Admin"],
        ["Jane Smith", "jane@example.com", "User"]
      ]
    },
    defaultStyle: { 
      width: "100%",
      borderCollapse: "collapse",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      overflow: "hidden"
    },
    tags: ["data", "table", "rows", "columns", "spreadsheet"]
  },
  {
    id: "chart",
    name: "Chart",
    icon: BarChart3,
    category: "Data",
    description: "Data visualization chart",
    difficulty: "advanced",
    isPremium: true,
    defaultProps: { 
      type: "bar",
      data: [
        { label: "Jan", value: 100 },
        { label: "Feb", value: 150 },
        { label: "Mar", value: 120 }
      ]
    },
    defaultStyle: { 
      width: "100%",
      height: "300px",
      padding: "16px",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "1px solid #e2e8f0"
    },
    tags: ["data", "chart", "graph", "analytics", "visualization"]
  },

  // Interactive Elements
  {
    id: "slider",
    name: "Slider",
    icon: Slider,
    category: "Interactive",
    description: "Range slider input",
    difficulty: "intermediate",
    defaultProps: { 
      min: 0,
      max: 100,
      value: 50,
      label: "Slider"
    },
    defaultStyle: { 
      width: "100%",
      margin: "16px 0"
    },
    tags: ["form", "slider", "range", "input", "interactive"]
  },
  {
    id: "toggle",
    name: "Toggle Switch",
    icon: ToggleLeft,
    category: "Interactive",
    description: "Toggle switch component",
    difficulty: "beginner",
    defaultProps: { 
      label: "Enable feature",
      checked: false
    },
    defaultStyle: { 
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    tags: ["form", "toggle", "switch", "boolean", "on-off"]
  }
];

const categories = [
  { id: "all", name: "All Elements", icon: Layers },
  { id: "Basic", name: "Basic", icon: Type },
  { id: "Layout", name: "Layout", icon: Layout },
  { id: "Navigation", name: "Navigation", icon: Navigation },
  { id: "Forms", name: "Forms", icon: Settings },
  { id: "Media", name: "Media", icon: Image },
  { id: "Data", name: "Data", icon: BarChart3 },
  { id: "Interactive", name: "Interactive", icon: MousePointer },
];

function DraggableElement({ element }: { element: ElementType }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: {
      type: "sidebar-element",
      element: element,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const Icon = element.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative p-3 border rounded-lg cursor-grab hover:shadow-md transition-all duration-200",
        isDragging ? "opacity-50 scale-105 shadow-lg" : "hover:border-blue-300 hover:bg-blue-50"
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          "w-8 h-8 rounded-md flex items-center justify-center",
          element.isPremium ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "bg-gray-100 text-gray-600"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-sm truncate">{element.name}</p>
            {element.isPremium && (
              <Badge className="text-xs bg-gradient-to-r from-purple-500 to-blue-500">
                Pro
              </Badge>
            )}
            {element.difficulty && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  element.difficulty === "beginner" && "bg-green-100 text-green-700",
                  element.difficulty === "intermediate" && "bg-yellow-100 text-yellow-700",
                  element.difficulty === "advanced" && "bg-red-100 text-red-700"
                )}
              >
                {element.difficulty}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{element.description}</p>
        </div>
      </div>
      
      {/* Drag indicator */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
      </div>
    </div>
  );
}

export default function EnhancedElementsSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredElements = elementTypes.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         element.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         element.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || element.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-3">Elements</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 m-2">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="Basic" className="text-xs">Basic</TabsTrigger>
          <TabsTrigger value="Layout" className="text-xs">Layout</TabsTrigger>
          <TabsTrigger value="Forms" className="text-xs">Forms</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1 pb-4">
            {/* Quick Categories */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {categories.slice(1, 5).map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="h-8 text-xs"
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Elements List */}
            <div className="space-y-2">
              {filteredElements.map((element) => (
                <DraggableElement key={element.id} element={element} />
              ))}
            </div>

            {filteredElements.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No elements found</p>
                <p className="text-xs text-gray-400">Try adjusting your search</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Tabs>

      <div className="p-4 border-t bg-gray-50 dark:bg-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-300">
          <p className="mb-1">{filteredElements.length} elements available</p>
          <p>Drag elements to the canvas to add them</p>
        </div>
      </div>
    </div>
  );
}
