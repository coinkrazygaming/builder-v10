import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Download,
  Share,
  Globe,
  Clock,
  Users,
  BarChart3,
  TrendingUp,
  Calendar,
  Folder,
  Star,
  Filter,
  Grid3X3,
  List,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  lastModified: string;
  createdAt: string;
  thumbnail?: string;
  domain?: string;
  views: number;
  collaborators: number;
  template?: string;
  tags: string[];
}

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalViews: number;
  totalCollaborators: number;
  monthlyViews: number;
  monthlyGrowth: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Company Landing Page",
    description: "Modern landing page for our SaaS product",
    status: "published",
    lastModified: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-10T14:20:00Z",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
    domain: "company.com",
    views: 12450,
    collaborators: 3,
    template: "Modern Landing",
    tags: ["landing", "saas", "modern"],
  },
  {
    id: "2",
    name: "E-commerce Store",
    description: "Online store for fashion products",
    status: "draft",
    lastModified: "2024-01-14T16:45:00Z",
    createdAt: "2024-01-12T09:15:00Z",
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
    views: 89,
    collaborators: 2,
    template: "E-commerce Store",
    tags: ["ecommerce", "fashion", "shopping"],
  },
  {
    id: "3",
    name: "Portfolio Website",
    description: "Personal portfolio for a graphic designer",
    status: "published",
    lastModified: "2024-01-13T12:20:00Z",
    createdAt: "2024-01-08T11:30:00Z",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    domain: "designer-portfolio.com",
    views: 3420,
    collaborators: 1,
    template: "Portfolio Showcase",
    tags: ["portfolio", "design", "creative"],
  },
  {
    id: "4",
    name: "Blog Website",
    description: "Personal blog about technology and programming",
    status: "published",
    lastModified: "2024-01-12T08:15:00Z",
    createdAt: "2024-01-05T16:45:00Z",
    thumbnail:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&h=200&fit=crop",
    domain: "techblog.com",
    views: 8760,
    collaborators: 1,
    template: "Blog & Magazine",
    tags: ["blog", "tech", "programming"],
  },
];

const mockStats: DashboardStats = {
  totalProjects: 4,
  publishedProjects: 3,
  totalViews: 24719,
  totalCollaborators: 7,
  monthlyViews: 18430,
  monthlyGrowth: 23.5,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published" | "archived"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "modified" | "created" | "name" | "views"
  >("modified");

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "modified":
          return (
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
          );
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "views":
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const createNewProject = () => {
    navigate("/templates");
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="relative">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-40 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
            <Folder className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <Badge
          className={cn(
            "absolute top-2 left-2",
            getStatusColor(project.status),
          )}
        >
          {project.status}
        </Badge>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{project.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{project.collaborators}</span>
            </div>
          </div>
          {project.domain && (
            <div className="flex items-center space-x-1 text-green-600">
              <Globe className="w-4 h-4" />
              <span className="text-xs">{project.domain}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Last modified: {formatDate(project.lastModified)}
        </div>

        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/editor/${project.id}`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" variant="outline">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectListItem = ({ project }: { project: Project }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-gray-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold truncate">{project.name}</h3>
              <Badge className={cn("text-xs", getStatusColor(project.status))}>
                {project.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 truncate mb-2">
              {project.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Modified: {formatDate(project.lastModified)}</span>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{project.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{project.collaborators}</span>
              </div>
              {project.domain && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Globe className="w-3 h-3" />
                  <span>{project.domain}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" onClick={() => navigate(`/editor/${project.id}`)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button size="sm" variant="outline">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your projects and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Projects</CardDescription>
                  <CardTitle className="text-2xl">
                    {mockStats.totalProjects}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600">
                    {mockStats.publishedProjects} published
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Views</CardDescription>
                  <CardTitle className="text-2xl">
                    {mockStats.totalViews.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />+
                    {mockStats.monthlyGrowth}% this month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Collaborators</CardDescription>
                  <CardTitle className="text-2xl">
                    {mockStats.totalCollaborators}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600">
                    Across all projects
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-2xl">
                    {mockStats.monthlyViews.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600">Page views</div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Section */}
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="modified">Last Modified</option>
                    <option value="created">Date Created</option>
                    <option value="name">Name</option>
                    <option value="views">Views</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button onClick={createNewProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>

              <div className="text-gray-600 text-sm">
                {filteredProjects.length} projects found
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No projects found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Get started by creating your first project
                  </p>
                  <Button onClick={createNewProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <ProjectListItem key={project.id} project={project} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Views This Month</CardTitle>
                    <CardDescription>
                      Total page views across all projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {mockStats.monthlyViews.toLocaleString()}
                    </div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+{mockStats.monthlyGrowth}% from last month</span>
                    </div>
                    <Progress value={75} className="mt-4" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Projects</CardTitle>
                    <CardDescription>
                      Projects with the most views this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects
                        .sort((a, b) => b.views - a.views)
                        .slice(0, 3)
                        .map((project, index) => (
                          <div
                            key={project.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                                {index + 1}
                              </div>
                              <span className="font-medium">
                                {project.name}
                              </span>
                            </div>
                            <span className="text-gray-600">
                              {project.views.toLocaleString()} views
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Team Management</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>

              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  Team collaboration features are coming soon! You'll be able to
                  invite team members, assign roles, and collaborate in
                  real-time.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Current Collaborators</CardTitle>
                  <CardDescription>
                    People who have access to your projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No team members yet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
