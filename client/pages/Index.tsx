import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Palette, 
  Code, 
  Users, 
  Globe, 
  Layers,
  MousePointer,
  Eye,
  GitBranch,
  Smartphone,
  ArrowRight,
  Star,
  Check
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BuilderClone
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/templates" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Templates
            </Link>
            <Link to="/components" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Components
            </Link>
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Pricing
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            Production-Ready Visual Builder
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            Build Websites Visually
            <br />
            Ship Code Instantly
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            The most powerful visual development platform. Create, collaborate, and deploy 
            production-ready websites with our drag-and-drop editor, real-time collaboration, 
            and enterprise-grade infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/dashboard">
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MousePointer className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Visual Editor Preview</p>
                    <Button asChild className="mt-4">
                      <Link to="/editor/1">Try the Editor</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Professional tools for modern web development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MousePointer className="w-8 h-8" />,
                title: "Drag & Drop Editor",
                description: "Intuitive visual builder with real-time preview and responsive design tools."
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Code Integration",
                description: "Seamlessly switch between visual and code editing with 2-way sync."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Real-time Collaboration",
                description: "Work together in real-time with team members across the globe."
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: "Design System",
                description: "Built-in component library with customizable design tokens."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Deployment",
                description: "Deploy to CDN edge locations worldwide for lightning-fast loading."
              },
              {
                icon: <GitBranch className="w-8 h-8" />,
                title: "Version Control",
                description: "Complete version history with branching and merge capabilities."
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile-First",
                description: "Responsive design tools with mobile, tablet, and desktop previews."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Performance",
                description: "Optimized code generation for maximum speed and SEO performance."
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Live Preview",
                description: "See changes instantly with hot reload and real-time rendering."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the plan that fits your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for personal projects and learning",
                features: [
                  "1 project",
                  "5 pages per project", 
                  "Basic components",
                  "Community support"
                ]
              },
              {
                name: "Pro",
                price: "$29",
                period: "/month",
                description: "For professional developers and small teams",
                features: [
                  "Unlimited projects",
                  "Unlimited pages",
                  "Advanced components",
                  "Custom domains",
                  "Team collaboration",
                  "Priority support"
                ],
                popular: true
              },
              {
                name: "Enterprise", 
                price: "$99",
                period: "/month",
                description: "For large teams and organizations",
                features: [
                  "Everything in Pro",
                  "SSO integration",
                  "Advanced permissions",
                  "Custom components",
                  "Dedicated support",
                  "SLA guarantee"
                ]
              }
            ].map((plan, index) => (
              <Card key={index} className={`${plan.popular ? 'ring-2 ring-purple-600 bg-white dark:bg-gray-800' : 'bg-white dark:bg-gray-800'} relative`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.period && <span className="text-lg font-normal text-gray-600 dark:text-gray-300">{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link to="/dashboard">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-50 dark:bg-gray-900 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BuilderClone
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 BuilderClone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
