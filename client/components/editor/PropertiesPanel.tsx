import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Copy, Settings } from "lucide-react";
import { getElementByType } from "./BuilderElements";
import type { CanvasElement } from "./Canvas";

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (elementId: string) => void;
  onDuplicateElement: (elementId: string) => void;
}

interface PropertyFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type: "text" | "number" | "color" | "select" | "textarea" | "checkbox";
  options?: { label: string; value: string }[];
  placeholder?: string;
}

function PropertyField({ label, value, onChange, type, options, placeholder }: PropertyFieldProps) {
  const renderField = () => {
    switch (type) {
      case "text":
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={placeholder}
          />
        );
      case "color":
        return (
          <div className="flex space-x-2">
            <Input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );
      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
          />
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {renderField()}
    </div>
  );
}

export function PropertiesPanel({ 
  selectedElement, 
  onUpdateElement, 
  onDeleteElement, 
  onDuplicateElement 
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No element selected</p>
          <p className="text-sm mt-1">Click on an element to edit its properties</p>
        </div>
      </Card>
    );
  }

  const elementConfig = getElementByType(selectedElement.type);
  if (!elementConfig) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="font-medium">Unknown element type</p>
          <p className="text-sm mt-1">{selectedElement.type}</p>
        </div>
      </Card>
    );
  }

  const updateProperty = (key: string, value: any) => {
    onUpdateElement(selectedElement.id, {
      props: { ...selectedElement.props, [key]: value }
    });
  };

  const updateStyle = (key: string, value: any) => {
    onUpdateElement(selectedElement.id, {
      style: { ...selectedElement.style, [key]: value }
    });
  };

  const getPropertyFields = () => {
    const fields: Array<{
      key: string;
      label: string;
      type: PropertyFieldProps['type'];
      options?: PropertyFieldProps['options'];
      placeholder?: string;
      section: 'content' | 'style';
    }> = [];

    // Content properties based on element type
    switch (selectedElement.type) {
      case "text":
      case "heading":
        fields.push({
          key: "children",
          label: "Text Content",
          type: "textarea",
          placeholder: "Enter text...",
          section: "content"
        });
        break;
      case "image":
        fields.push(
          {
            key: "src",
            label: "Image URL",
            type: "text",
            placeholder: "https://example.com/image.jpg",
            section: "content"
          },
          {
            key: "alt",
            label: "Alt Text",
            type: "text",
            placeholder: "Image description",
            section: "content"
          }
        );
        break;
      case "button":
        fields.push(
          {
            key: "children",
            label: "Button Text",
            type: "text",
            placeholder: "Click me",
            section: "content"
          },
          {
            key: "variant",
            label: "Variant",
            type: "select",
            options: [
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Outline", value: "outline" }
            ],
            section: "content"
          }
        );
        break;
      case "link":
        fields.push(
          {
            key: "children",
            label: "Link Text",
            type: "text",
            placeholder: "Link text",
            section: "content"
          },
          {
            key: "href",
            label: "URL",
            type: "text",
            placeholder: "https://example.com",
            section: "content"
          }
        );
        break;
    }

    // Common style properties
    fields.push(
      {
        key: "fontSize",
        label: "Font Size",
        type: "text",
        placeholder: "16px",
        section: "style"
      },
      {
        key: "color",
        label: "Text Color",
        type: "color",
        section: "style"
      },
      {
        key: "backgroundColor",
        label: "Background Color",
        type: "color",
        section: "style"
      },
      {
        key: "padding",
        label: "Padding",
        type: "text",
        placeholder: "16px",
        section: "style"
      },
      {
        key: "margin",
        label: "Margin",
        type: "text",
        placeholder: "16px",
        section: "style"
      },
      {
        key: "borderRadius",
        label: "Border Radius",
        type: "text",
        placeholder: "8px",
        section: "style"
      },
      {
        key: "border",
        label: "Border",
        type: "text",
        placeholder: "1px solid #ccc",
        section: "style"
      }
    );

    return fields;
  };

  const propertyFields = getPropertyFields();
  const contentFields = propertyFields.filter(f => f.section === "content");
  const styleFields = propertyFields.filter(f => f.section === "style");

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Properties</h3>
          <Badge variant="outline">{elementConfig.name}</Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicateElement(selectedElement.id)}
            className="flex-1"
          >
            <Copy className="w-3 h-3 mr-1" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteElement(selectedElement.id)}
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Content Properties */}
          {contentFields.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  Content
                </Badge>
                <Separator className="flex-1" />
              </div>
              {contentFields.map((field) => (
                <PropertyField
                  key={field.key}
                  label={field.label}
                  value={selectedElement.props[field.key]}
                  onChange={(value) => updateProperty(field.key, value)}
                  type={field.type}
                  options={field.options}
                  placeholder={field.placeholder}
                />
              ))}
            </div>
          )}

          {/* Style Properties */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Style
              </Badge>
              <Separator className="flex-1" />
            </div>
            {styleFields.map((field) => (
              <PropertyField
                key={field.key}
                label={field.label}
                value={selectedElement.style[field.key]}
                onChange={(value) => updateStyle(field.key, value)}
                type={field.type}
                options={field.options}
                placeholder={field.placeholder}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
