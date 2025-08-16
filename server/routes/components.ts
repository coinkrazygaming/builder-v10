import { RequestHandler } from "express";

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
  fullCode: string;
  props?: Record<string, any>;
  dependencies?: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
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
    author: "BuilderClone",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    codePreview: `<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
  <div className="container mx-auto text-center">
    <h1 className="text-5xl font-bold mb-4">Build Amazing Websites</h1>
    <p className="text-xl mb-8">Create stunning web experiences with our visual builder</p>
    <Button size="lg">Get Started</Button>
  </div>
</div>`,
    fullCode: `import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Build Amazing Websites</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create stunning web experiences with our visual builder
        </p>
        <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
          Get Started
        </Button>
      </div>
    </div>
  );
}`,
    dependencies: ["@/components/ui/button"],
    props: {
      title: { type: "string", default: "Build Amazing Websites" },
      subtitle: { type: "string", default: "Create stunning web experiences with our visual builder" },
      ctaText: { type: "string", default: "Get Started" },
      gradientFrom: { type: "string", default: "purple-600" },
      gradientTo: { type: "string", default: "blue-600" }
    }
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
    author: "BuilderClone",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
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
    fullCode: `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  ctaText?: string;
  highlighted?: boolean;
}

export default function PricingCard({ 
  title, 
  description, 
  price, 
  features, 
  ctaText = "Choose Plan",
  highlighted = false 
}: PricingCardProps) {
  return (
    <Card className={highlighted ? "border-primary shadow-lg" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{price}</div>
        <ul className="mt-4 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          className={highlighted ? "w-full mt-6" : "w-full mt-6"} 
          variant={highlighted ? "default" : "outline"}
        >
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
}`,
    dependencies: ["@/components/ui/button", "@/components/ui/card"],
    props: {
      title: { type: "string", default: "Pro Plan" },
      description: { type: "string", default: "Perfect for growing businesses" },
      price: { type: "string", default: "$29/mo" },
      features: { type: "array", default: ["Unlimited projects", "Advanced features", "Priority support"] },
      ctaText: { type: "string", default: "Choose Plan" },
      highlighted: { type: "boolean", default: false }
    }
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
    author: "BuilderClone",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
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
    fullCode: `import { LucideIcon } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 1 | 2 | 3 | 4;
  iconColor?: string;
  iconBgColor?: string;
}

export default function FeatureGrid({ 
  features, 
  columns = 3,
  iconColor = "blue-600",
  iconBgColor = "blue-100"
}: FeatureGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={grid grid-cols-1 md:grid-cols-$\{columns} gap-6}>
      {features.map((feature) => (
        <div key={feature.id} className="text-center">
          <div className={w-12 h-12 bg-$\{iconBgColor} rounded-lg flex items-center justify-center mx-auto mb-4}>
            <feature.icon className={w-6 h-6 text-$\{iconColor}} />
          </div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}`,
    dependencies: ["lucide-react"],
    props: {
      features: { type: "array", default: [] },
      columns: { type: "number", default: 3, options: [1, 2, 3, 4] },
      iconColor: { type: "string", default: "blue-600" },
      iconBgColor: { type: "string", default: "blue-100" }
    }
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
    author: "BuilderClone",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
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
    fullCode: `import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  company,
  avatar,
  rating = 5
}: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={w-4 h-4 $\{i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}}
            />
          ))}
        </div>
        <p className="mb-4 italic">"{quote}"</p>
        <div className="flex items-center">
          {avatar ? (
            <img 
              src={avatar} 
              alt={author}
              className="w-10 h-10 rounded-full mr-3 object-cover" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
              <span className="text-gray-500 font-semibold">
                {author.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="font-semibold">{author}</div>
            <div className="text-sm text-gray-500">
              {role}{company && , $\{company}}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}`,
    dependencies: ["@/components/ui/card", "lucide-react"],
    props: {
      quote: { type: "string", default: "This product changed how we work. Amazing!" },
      author: { type: "string", default: "John Smith" },
      role: { type: "string", default: "CEO" },
      company: { type: "string", default: "TechCorp" },
      avatar: { type: "string", default: "" },
      rating: { type: "number", default: 5, min: 1, max: 5 }
    }
  }
];

// GET /api/components - Get all components
export const getComponents: RequestHandler = async (req, res) => {
  try {
    const { category, search, difficulty, premium, limit, offset } = req.query;
    
    let filtered = [...mockComponents];
    
    // Filter by category
    if (category && category !== "all") {
      filtered = filtered.filter(component => component.category === category);
    }
    
    // Filter by search
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filtered = filtered.filter(component => 
        component.name.toLowerCase().includes(searchTerm) ||
        component.description.toLowerCase().includes(searchTerm) ||
        component.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by difficulty
    if (difficulty && difficulty !== "all") {
      filtered = filtered.filter(component => component.difficulty === difficulty);
    }
    
    // Filter by premium
    if (premium === "true") {
      filtered = filtered.filter(component => component.isPremium);
    } else if (premium === "false") {
      filtered = filtered.filter(component => !component.isPremium);
    }
    
    // Apply pagination
    const limitNum = parseInt(limit as string) || 20;
    const offsetNum = parseInt(offset as string) || 0;
    const paginated = filtered.slice(offsetNum, offsetNum + limitNum);
    
    res.json({
      components: paginated,
      total: filtered.length,
      categories: ["Layout", "Cards", "Navigation", "Data", "Forms", "Media"]
    });
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ error: "Failed to fetch components" });
  }
};

// GET /api/components/:id - Get component by ID
export const getComponent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const component = mockComponents.find(c => c.id === id);
    
    if (!component) {
      return res.status(404).json({ error: "Component not found" });
    }
    
    res.json(component);
  } catch (error) {
    console.error("Error fetching component:", error);
    res.status(500).json({ error: "Failed to fetch component" });
  }
};

// POST /api/components/:id/download - Download component code
export const downloadComponent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }
    
    const component = mockComponents.find(c => c.id === id);
    if (!component) {
      return res.status(404).json({ error: "Component not found" });
    }
    
    // Increment downloads
    component.downloads += 1;
    
    res.json({
      code: component.fullCode,
      dependencies: component.dependencies,
      props: component.props,
      message: "Component code downloaded successfully"
    });
  } catch (error) {
    console.error("Error downloading component:", error);
    res.status(500).json({ error: "Failed to download component" });
  }
};

// GET /api/components/categories - Get component categories
export const getComponentCategories: RequestHandler = async (req, res) => {
  try {
    const categories = [
      { id: "all", name: "All", count: mockComponents.length },
      { id: "Layout", name: "Layout", count: mockComponents.filter(c => c.category === "Layout").length },
      { id: "Cards", name: "Cards", count: mockComponents.filter(c => c.category === "Cards").length },
      { id: "Navigation", name: "Navigation", count: mockComponents.filter(c => c.category === "Navigation").length },
      { id: "Data", name: "Data", count: mockComponents.filter(c => c.category === "Data").length },
      { id: "Forms", name: "Forms", count: mockComponents.filter(c => c.category === "Forms").length },
      { id: "Media", name: "Media", count: mockComponents.filter(c => c.category === "Media").length },
    ];
    
    res.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST /api/components/:id/rate - Rate a component
export const rateComponent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    
    const component = mockComponents.find(c => c.id === id);
    if (!component) {
      return res.status(404).json({ error: "Component not found" });
    }
    
    // In a real implementation, you'd store individual ratings and calculate average
    res.json({ 
      message: "Component rated successfully",
      currentRating: component.rating 
    });
  } catch (error) {
    console.error("Error rating component:", error);
    res.status(500).json({ error: "Failed to rate component" });
  }
};
