import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Eye, Download, Play, Filter, Grid3X3, List, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  previewUrl: string;
  isPremium: boolean;
  rating: number;
  downloads: number;
  views: number;
  author: string;
  createdAt: string;
  featured: boolean;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Modern Landing Page",
    description: "A sleek, modern landing page perfect for SaaS companies",
    category: "Landing Pages",
    tags: ["modern", "saas", "clean", "responsive"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    previewUrl: "/preview/modern-landing",
    isPremium: false,
    rating: 4.8,
    downloads: 1240,
    views: 5670,
    author: "DesignCorp",
    createdAt: "2024-01-15",
    featured: true,
  },
  {
    id: "2",
    name: "E-commerce Store",
    description: "Complete e-commerce template with shopping cart and checkout",
    category: "E-commerce",
    tags: ["ecommerce", "shop", "cart", "product"],
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    previewUrl: "/preview/ecommerce-store",
    isPremium: true,
    rating: 4.9,
    downloads: 890,
    views: 3420,
    author: "ShopDesigns",
    createdAt: "2024-01-12",
    featured: true,
  },
  {
    id: "3",
    name: "Portfolio Showcase",
    description: "Creative portfolio template for designers and developers",
    category: "Portfolio",
    tags: ["portfolio", "creative", "showcase", "minimal"],
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    previewUrl: "/preview/portfolio-showcase",
    isPremium: false,
    rating: 4.7,
    downloads: 2150,
    views: 8920,
    author: "CreativeStudios",
    createdAt: "2024-01-10",
    featured: false,
  },
  {
    id: "4",
    name: "Blog & Magazine",
    description: "Professional blog template with article layouts",
    category: "Blog",
    tags: ["blog", "magazine", "articles", "content"],
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop",
    previewUrl: "/preview/blog-magazine",
    isPremium: false,
    rating: 4.6,
    downloads: 1680,
    views: 4230,
    author: "BlogMasters",
    createdAt: "2024-01-08",
    featured: false,
  },
  {
    id: "5",
    name: "Restaurant Menu",
    description: "Elegant restaurant template with menu and reservation system",
    category: "Restaurant",
    tags: ["restaurant", "menu", "food", "reservation"],
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    previewUrl: "/preview/restaurant-menu",
    isPremium: true,
    rating: 4.8,
    downloads: 720,
    views: 2890,
    author: "FoodDesigns",
    createdAt: "2024-01-05",
    featured: false,
  },
  {
    id: "6",
    name: "Corporate Website",
    description: "Professional corporate template for businesses",
    category: "Corporate",
    tags: ["corporate", "business", "professional", "company"],
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    previewUrl: "/preview/corporate-website",
    isPremium: false,
    rating: 4.5,
    downloads: 1950,
    views: 6780,
    author: "CorpTemplates",
    createdAt: "2024-01-03",
    featured: false,
  },
];

const categories = ["All", "Landing Pages", "E-commerce", "Portfolio", "Blog", "Restaurant", "Corporate"];

export default function Templates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTemplates = useMemo(() => {
    let filtered = mockTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
      const matchesPremium = !showPremiumOnly || template.isPremium;
      
      return matchesSearch && matchesCategory && matchesPremium;
    });

    // Sort templates
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, showPremiumOnly]);

  const handleUseTemplate = (template: Template) => {
    // Create a new project with this template
    const projectId = `project-${Date.now()}`;
    navigate(`/editor/${projectId}?template=${template.id}`);
  };

  const TemplateCard = ({ template }: { template: Template }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {template.isPremium && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600">
            Premium
          </Badge>
        )}
        {template.featured && (
          <Badge className="absolute top-2 right-2 bg-amber-500">
            Featured
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" asChild>
              <Link to={template.previewUrl} target="_blank">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Link>
            </Button>
            <Button size="sm" onClick={() => handleUseTemplate(template)}>
              <Play className="w-4 h-4 mr-1" />
              Use Template
            </Button>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{template.name}</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{template.rating}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{template.downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{template.views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <span>by {template.author}</span>
          <span>{new Date(template.createdAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );

  const TemplateListItem = ({ template }: { template: Template }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-32 h-24 object-cover rounded-l-lg"
        />
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold">{template.name}</h3>
                {template.isPremium && (
                  <Badge className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                    Premium
                  </Badge>
                )}
                {template.featured && (
                  <Badge className="text-xs bg-amber-500">Featured</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {template.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating}</span>
                </div>
                <span>{template.downloads.toLocaleString()} downloads</span>
                <span>by {template.author}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <Button size="sm" asChild>
                <Link to={template.previewUrl} target="_blank">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Link>
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleUseTemplate(template)}>
                <Play className="w-4 h-4 mr-1" />
                Use Template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Templates</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Choose from our collection of professionally designed templates
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
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

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
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="free">Free</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                {filteredTemplates.length} templates found
              </p>
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

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <TemplateListItem key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="featured" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.filter(t => t.featured).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="free" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.filter(t => !t.isPremium).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="premium" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.filter(t => t.isPremium).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria or browse different categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
