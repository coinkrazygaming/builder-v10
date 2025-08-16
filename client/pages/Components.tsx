import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Copy, 
  Code, 
  Play, 
  Download, 
  Star, 
  Heart,
  Eye,
  MousePointer,
  Layers,
  Type,
  Image,
  BarChart,
  Calendar,
  Mail,
  User,
  Settings,
  ShoppingCart,
  Navigation,
  Grid3X3,
  List,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  isPremium: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  rating: number;
  downloads: number;
  codePreview: string;
  component: React.ReactNode;
  props?: Record<string, any>;
}

const mockComponents: Component[] = [
  {
    id: "hero-section",
    name: "Hero Section",
    description: "Modern hero section with gradient background and call-to-action",
    category: "Layout",
    tags: ["hero", "landing", "gradient", "cta"],
    isPremium: false,
    difficulty: "beginner",
    rating: 4.8,
    downloads: 2340,
    codePreview: `<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
  <div className="container mx-auto text-center">
    <h1 className="text-5xl font-bold mb-4">Build Amazing Websites</h1>
    <p className="text-xl mb-8">Create stunning web experiences with our visual builder</p>
    <Button size="lg">Get Started</Button>
  </div>
</div>`,
    component: (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 rounded-lg">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold mb-2">Build Amazing Websites</h1>
          <p className="text-sm mb-4 opacity-90">Create stunning web experiences</p>
          <Button size="sm" variant="secondary">Get Started</Button>
        </div>
      </div>
    ),
  },
  {
    id: "pricing-card",
    name: "Pricing Card",
    description: "Clean pricing card with features list and call-to-action",
    category: "Cards",
    tags: ["pricing", "card", "features", "cta"],
    isPremium: false,
    difficulty: "beginner",
    rating: 4.7,
    downloads: 1890,
    codePreview: `<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Pro Plan</CardTitle>
    <CardDescription>Perfect for growing businesses</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">$29/mo</div>
    <ul className="mt-4 space-y-2">
      <li>✓ Unlimited projects</li>
      <li>✓ Advanced features</li>
      <li>✓ Priority support</li>
    </ul>
    <Button className="w-full mt-6">Choose Plan</Button>
  </CardContent>
</Card>`,
    component: (
      <Card className="max-w-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Pro Plan</CardTitle>
          <CardDescription className="text-sm">Perfect for growing businesses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">$29/mo</div>
          <ul className="text-sm space-y-1">
            <li>✓ Unlimited projects</li>
            <li>✓ Advanced features</li>
            <li>✓ Priority support</li>
          </ul>
          <Button className="w-full" size="sm">Choose Plan</Button>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "feature-grid",
    name: "Feature Grid",
    description: "Responsive grid layout showcasing product features",
    category: "Layout",
    tags: ["features", "grid", "icons", "responsive"],
    isPremium: false,
    difficulty: "intermediate",
    rating: 4.9,
    downloads: 1650,
    codePreview: `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {features.map((feature) => (
    <div key={feature.id} className="text-center">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <feature.icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="font-semibold mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  ))}
</div>`,
    component: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Code, title: "Easy to Use", desc: "Drag and drop interface" },
          { icon: Star, title: "High Quality", desc: "Professional designs" },
          { icon: Heart, title: "Loved by Users", desc: "5-star ratings" },
        ].map((feature, i) => (
          <div key={i} className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <feature.icon className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "testimonial-card",
    name: "Testimonial Card",
    description: "Customer testimonial with avatar and rating",
    category: "Cards",
    tags: ["testimonial", "review", "customer", "rating"],
    isPremium: true,
    difficulty: "beginner",
    rating: 4.6,
    downloads: 980,
    codePreview: `<Card>
  <CardContent className="pt-6">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="mb-4">"This product changed how we work. Amazing!"</p>
    <div className="flex items-center">
      <img src="/avatar.jpg" className="w-10 h-10 rounded-full mr-3" />
      <div>
        <div className="font-semibold">John Smith</div>
        <div className="text-sm text-gray-500">CEO, TechCorp</div>
      </div>
    </div>
  </CardContent>
</Card>`,
    component: (
      <Card className="max-w-xs">
        <CardContent className="pt-6">
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-sm mb-3">"This product changed how we work. Amazing!"</p>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
            <div>
              <div className="font-semibold text-sm">John Smith</div>
              <div className="text-xs text-gray-500">CEO, TechCorp</div>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "navigation-bar",
    name: "Navigation Bar",
    description: "Responsive navigation with mobile menu",
    category: "Navigation",
    tags: ["navbar", "navigation", "menu", "responsive"],
    isPremium: true,
    difficulty: "advanced",
    rating: 4.8,
    downloads: 2100,
    codePreview: `<nav className="bg-white shadow-sm border-b">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center">
        <div className="font-bold text-xl">Logo</div>
      </div>
      <div className="hidden md:flex space-x-8">
        <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Services</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
      </div>
      <Button>Get Started</Button>
    </div>
  </div>
</nav>`,
    component: (
      <nav className="bg-white shadow-sm border-b rounded-lg">
        <div className="px-4">
          <div className="flex justify-between items-center h-12">
            <div className="font-bold text-lg">Logo</div>
            <div className="hidden md:flex space-x-4 text-sm">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Services</a>
            </div>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </nav>
    ),
  },
  {
    id: "stats-section",
    name: "Stats Section",
    description: "Statistics display with animated counters",
    category: "Data",
    tags: ["stats", "numbers", "counters", "metrics"],
    isPremium: false,
    difficulty: "intermediate",
    rating: 4.5,
    downloads: 1420,
    codePreview: `<div className="bg-gray-50 py-16">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {stat.value}
          </div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</div>`,
    component: (
      <div className="bg-gray-50 py-8 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          {[
            { value: "10K+", label: "Users" },
            { value: "500+", label: "Projects" },
            { value: "99%", label: "Uptime" },
            { value: "24/7", label: "Support" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const categories = [
  { id: "all", name: "All", icon: Grid3X3 },
  { id: "Layout", name: "Layout", icon: Layers },
  { id: "Cards", name: "Cards", icon: MousePointer },
  { id: "Navigation", name: "Navigation", icon: Navigation },
  { id: "Data", name: "Data", icon: BarChart },
  { id: "Forms", name: "Forms", icon: Type },
  { id: "Media", name: "Media", icon: Image },
];

export default function Components() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredComponents = useMemo(() => {
    return mockComponents.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
      const matchesDifficulty = difficultyFilter === "all" || component.difficulty === difficultyFilter;
      const matchesPremium = !showPremiumOnly || component.isPremium;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesPremium;
    });
  }, [searchQuery, selectedCategory, difficultyFilter, showPremiumOnly]);

  const copyCode = async (code: string, componentId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(componentId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Components</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Copy and paste components to build your website faster
              </p>
            </div>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "preview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("preview")}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "code" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("code")}
                >
                  <Code className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                className={cn(showPremiumOnly && "bg-purple-50 border-purple-200")}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showPremiumOnly ? "Show All" : "Premium Only"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Components</span>
                  <span className="font-medium">{mockComponents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Free Components</span>
                  <span className="font-medium">{mockComponents.filter(c => !c.isPremium).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Components</span>
                  <span className="font-medium">{mockComponents.filter(c => c.isPremium).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                {filteredComponents.length} components found
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredComponents.map((component) => (
                <Card key={component.id} className="group hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg">{component.name}</CardTitle>
                          {component.isPremium && (
                            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">
                              Premium
                            </Badge>
                          )}
                          <Badge className={getDifficultyColor(component.difficulty)}>
                            {component.difficulty}
                          </Badge>
                        </div>
                        <CardDescription>{component.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCode(component.codePreview, component.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedCode === component.id ? (
                          <>✓ Copied</>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {component.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent>
                    {viewMode === "preview" ? (
                      <div className="border rounded-lg p-4 bg-white min-h-[200px] flex items-center justify-center">
                        {component.component}
                      </div>
                    ) : (
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                          <code>{component.codePreview}</code>
                        </pre>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyCode(component.codePreview, component.id)}
                        >
                          {copiedCode === component.id ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{component.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{component.downloads.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm">
                          <Code className="w-4 h-4 mr-1" />
                          Use Component
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredComponents.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No components found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search criteria or browse different categories
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
