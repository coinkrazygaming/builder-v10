import { RequestHandler } from "express";

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
  content: any; // Template structure/components
}

const mockTemplates: Template[] = [
  {
    id: "modern-landing",
    name: "Modern Landing Page",
    description: "A sleek, modern landing page perfect for SaaS companies",
    category: "Landing Pages",
    tags: ["modern", "saas", "clean", "responsive"],
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    previewUrl: "/preview/modern-landing",
    isPremium: false,
    rating: 4.8,
    downloads: 1240,
    views: 5670,
    author: "DesignCorp",
    createdAt: "2024-01-15",
    featured: true,
    content: {
      components: [
        {
          id: "hero-1",
          type: "hero",
          props: {
            title: "Build Amazing Websites",
            subtitle: "Create stunning web experiences with our visual builder",
            ctaText: "Get Started",
            backgroundImage:
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
          },
        },
        {
          id: "features-1",
          type: "features",
          props: {
            title: "Why Choose Us",
            features: [
              {
                title: "Easy to Use",
                description: "Drag and drop interface",
                icon: "code",
              },
              {
                title: "High Quality",
                description: "Professional designs",
                icon: "star",
              },
              {
                title: "Fast Performance",
                description: "Optimized for speed",
                icon: "zap",
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: "ecommerce-store",
    name: "E-commerce Store",
    description: "Complete e-commerce template with shopping cart and checkout",
    category: "E-commerce",
    tags: ["ecommerce", "shop", "cart", "product"],
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    previewUrl: "/preview/ecommerce-store",
    isPremium: true,
    rating: 4.9,
    downloads: 890,
    views: 3420,
    author: "ShopDesigns",
    createdAt: "2024-01-12",
    featured: true,
    content: {
      components: [
        {
          id: "header-1",
          type: "header",
          props: {
            logo: "Store Logo",
            navigation: ["Home", "Products", "About", "Contact"],
            cartIcon: true,
          },
        },
        {
          id: "product-grid-1",
          type: "product-grid",
          props: {
            title: "Featured Products",
            products: [
              { id: 1, name: "Product 1", price: "$99", image: "product1.jpg" },
              {
                id: 2,
                name: "Product 2",
                price: "$149",
                image: "product2.jpg",
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: "portfolio-showcase",
    name: "Portfolio Showcase",
    description: "Creative portfolio template for designers and developers",
    category: "Portfolio",
    tags: ["portfolio", "creative", "showcase", "minimal"],
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    previewUrl: "/preview/portfolio-showcase",
    isPremium: false,
    rating: 4.7,
    downloads: 2150,
    views: 8920,
    author: "CreativeStudios",
    createdAt: "2024-01-10",
    featured: false,
    content: {
      components: [
        {
          id: "intro-1",
          type: "intro",
          props: {
            name: "John Designer",
            title: "Creative Director",
            bio: "I create beautiful and functional designs that tell stories.",
            avatar: "avatar.jpg",
          },
        },
        {
          id: "portfolio-1",
          type: "portfolio",
          props: {
            title: "My Work",
            projects: [
              {
                id: 1,
                title: "Project 1",
                image: "project1.jpg",
                category: "Web Design",
              },
              {
                id: 2,
                title: "Project 2",
                image: "project2.jpg",
                category: "Branding",
              },
            ],
          },
        },
      ],
    },
  },
];

// GET /api/templates - Get all templates
export const getTemplates: RequestHandler = async (req, res) => {
  try {
    const { category, search, featured, premium, limit, offset } = req.query;

    let filtered = [...mockTemplates];

    // Filter by category
    if (category && category !== "all") {
      filtered = filtered.filter((template) => template.category === category);
    }

    // Filter by search
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm) ||
          template.description.toLowerCase().includes(searchTerm) ||
          template.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }

    // Filter by featured
    if (featured === "true") {
      filtered = filtered.filter((template) => template.featured);
    }

    // Filter by premium
    if (premium === "true") {
      filtered = filtered.filter((template) => template.isPremium);
    } else if (premium === "false") {
      filtered = filtered.filter((template) => !template.isPremium);
    }

    // Apply pagination
    const limitNum = parseInt(limit as string) || 20;
    const offsetNum = parseInt(offset as string) || 0;
    const paginated = filtered.slice(offsetNum, offsetNum + limitNum);

    res.json({
      templates: paginated,
      total: filtered.length,
      categories: [
        "Landing Pages",
        "E-commerce",
        "Portfolio",
        "Blog",
        "Restaurant",
        "Corporate",
      ],
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

// GET /api/templates/:id - Get template by ID
export const getTemplate: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const template = mockTemplates.find((t) => t.id === id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Increment views
    template.views += 1;

    res.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ error: "Failed to fetch template" });
  }
};

// POST /api/templates/:id/use - Use template to create project
export const useTemplate: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, projectDescription } = req.body;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    const template = mockTemplates.find((t) => t.id === id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Create new project based on template
    const newProject = {
      id: `project-${Date.now()}`,
      name: projectName || `${template.name} Project`,
      description: projectDescription || `Project based on ${template.name}`,
      status: "draft",
      templateId: template.id,
      templateName: template.name,
      content: template.content,
      ownerId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Increment downloads
    template.downloads += 1;

    res.status(201).json({
      project: newProject,
      message: "Project created successfully from template",
    });
  } catch (error) {
    console.error("Error using template:", error);
    res.status(500).json({ error: "Failed to create project from template" });
  }
};

// GET /api/templates/categories - Get template categories
export const getTemplateCategories: RequestHandler = async (req, res) => {
  try {
    const categories = [
      { id: "all", name: "All", count: mockTemplates.length },
      {
        id: "Landing Pages",
        name: "Landing Pages",
        count: mockTemplates.filter((t) => t.category === "Landing Pages")
          .length,
      },
      {
        id: "E-commerce",
        name: "E-commerce",
        count: mockTemplates.filter((t) => t.category === "E-commerce").length,
      },
      {
        id: "Portfolio",
        name: "Portfolio",
        count: mockTemplates.filter((t) => t.category === "Portfolio").length,
      },
      {
        id: "Blog",
        name: "Blog",
        count: mockTemplates.filter((t) => t.category === "Blog").length,
      },
      {
        id: "Restaurant",
        name: "Restaurant",
        count: mockTemplates.filter((t) => t.category === "Restaurant").length,
      },
      {
        id: "Corporate",
        name: "Corporate",
        count: mockTemplates.filter((t) => t.category === "Corporate").length,
      },
    ];

    res.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST /api/templates/:id/rate - Rate a template
export const rateTemplate: RequestHandler = async (req, res) => {
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

    const template = mockTemplates.find((t) => t.id === id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // In a real implementation, you'd store individual ratings and calculate average
    // For now, we'll just acknowledge the rating
    res.json({
      message: "Template rated successfully",
      currentRating: template.rating,
    });
  } catch (error) {
    console.error("Error rating template:", error);
    res.status(500).json({ error: "Failed to rate template" });
  }
};
