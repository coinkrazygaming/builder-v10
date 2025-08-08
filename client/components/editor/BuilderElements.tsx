import { Type, Image, Layout, Square, Circle, Link as LinkIcon } from "lucide-react";

export interface BuilderElement {
  id: string;
  type: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  defaultProps: Record<string, any>;
  defaultStyle: Record<string, any>;
  canHaveChildren: boolean;
  allowedChildren?: string[];
  template: React.ComponentType<any>;
}

// Component templates
export const TextTemplate = ({ children, style, ...props }: any) => (
  <div style={style} {...props}>
    {children || "Text content"}
  </div>
);

export const HeadingTemplate = ({ children, style, level = 1, ...props }: any) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag style={style} {...props}>
      {children || `Heading ${level}`}
    </Tag>
  );
};

export const ImageTemplate = ({ src, alt, style, ...props }: any) => (
  <img
    src={src || "https://via.placeholder.com/300x200"}
    alt={alt || "Image"}
    style={{ maxWidth: "100%", height: "auto", ...style }}
    {...props}
  />
);

export const ButtonTemplate = ({ children, style, variant = "primary", ...props }: any) => (
  <button
    style={{
      padding: "12px 24px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      backgroundColor: variant === "primary" ? "#8b5cf6" : "#6b7280",
      color: "white",
      fontWeight: "500",
      ...style,
    }}
    {...props}
  >
    {children || "Button"}
  </button>
);

export const ContainerTemplate = ({ children, style, ...props }: any) => (
  <div
    style={{
      padding: "16px",
      minHeight: "100px",
      border: "2px dashed #e5e7eb",
      borderRadius: "8px",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const LinkTemplate = ({ children, href, style, ...props }: any) => (
  <a
    href={href || "#"}
    style={{
      color: "#8b5cf6",
      textDecoration: "underline",
      ...style,
    }}
    {...props}
  >
    {children || "Link text"}
  </a>
);

export const FlexTemplate = ({ children, style, direction = "row", ...props }: any) => (
  <div
    style={{
      display: "flex",
      flexDirection: direction,
      gap: "16px",
      padding: "16px",
      border: "2px dashed #e5e7eb",
      borderRadius: "8px",
      minHeight: "100px",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const GridTemplate = ({ children, style, columns = 2, ...props }: any) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: "16px",
      padding: "16px",
      border: "2px dashed #e5e7eb",
      borderRadius: "8px",
      minHeight: "100px",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// Available builder elements
export const builderElements: BuilderElement[] = [
  {
    id: "text",
    type: "text",
    name: "Text",
    icon: <Type className="w-4 h-4" />,
    category: "Basic",
    canHaveChildren: false,
    defaultProps: {
      children: "Enter your text here",
    },
    defaultStyle: {
      fontSize: "16px",
      color: "#1f2937",
      lineHeight: "1.5",
    },
    template: TextTemplate,
  },
  {
    id: "heading",
    type: "heading",
    name: "Heading",
    icon: <Type className="w-4 h-4" />,
    category: "Basic",
    canHaveChildren: false,
    defaultProps: {
      children: "Your heading here",
      level: 1,
    },
    defaultStyle: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "16px",
    },
    template: HeadingTemplate,
  },
  {
    id: "image",
    type: "image",
    name: "Image",
    icon: <Image className="w-4 h-4" />,
    category: "Basic",
    canHaveChildren: false,
    defaultProps: {
      src: "https://via.placeholder.com/300x200",
      alt: "Image",
    },
    defaultStyle: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "8px",
    },
    template: ImageTemplate,
  },
  {
    id: "button",
    type: "button",
    name: "Button",
    icon: <Square className="w-4 h-4" />,
    category: "Basic",
    canHaveChildren: false,
    defaultProps: {
      children: "Click me",
      variant: "primary",
    },
    defaultStyle: {
      padding: "12px 24px",
      borderRadius: "6px",
      backgroundColor: "#8b5cf6",
      color: "white",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
    },
    template: ButtonTemplate,
  },
  {
    id: "link",
    type: "link",
    name: "Link",
    icon: <LinkIcon className="w-4 h-4" />,
    category: "Basic",
    canHaveChildren: false,
    defaultProps: {
      children: "Link text",
      href: "#",
    },
    defaultStyle: {
      color: "#8b5cf6",
      textDecoration: "underline",
    },
    template: LinkTemplate,
  },
  {
    id: "container",
    type: "container",
    name: "Container",
    icon: <Square className="w-4 h-4" />,
    category: "Layout",
    canHaveChildren: true,
    defaultProps: {},
    defaultStyle: {
      padding: "16px",
      minHeight: "100px",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
    },
    template: ContainerTemplate,
  },
  {
    id: "flex",
    type: "flex",
    name: "Flex Container",
    icon: <Layout className="w-4 h-4" />,
    category: "Layout",
    canHaveChildren: true,
    defaultProps: {
      direction: "row",
    },
    defaultStyle: {
      display: "flex",
      gap: "16px",
      padding: "16px",
      minHeight: "100px",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
    },
    template: FlexTemplate,
  },
  {
    id: "grid",
    type: "grid",
    name: "Grid Container",
    icon: <Layout className="w-4 h-4" />,
    category: "Layout",
    canHaveChildren: true,
    defaultProps: {
      columns: 2,
    },
    defaultStyle: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px",
      padding: "16px",
      minHeight: "100px",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
    },
    template: GridTemplate,
  },
];

export const getElementByType = (type: string): BuilderElement | undefined => {
  return builderElements.find((element) => element.type === type);
};

export const getElementsByCategory = (category: string): BuilderElement[] => {
  return builderElements.filter((element) => element.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(builderElements.map((element) => element.category)));
};
