import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  builderElements,
  getAllCategories,
  getElementsByCategory,
  type BuilderElement,
} from "./BuilderElements";
import { cn } from "@/lib/utils";

interface DraggableElementProps {
  element: BuilderElement;
}

function DraggableElement({ element }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sidebar-${element.id}`,
      data: {
        type: "sidebar-element",
        element,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-800 cursor-grab active:cursor-grabbing",
        "hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
        {element.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {element.name}
        </p>
      </div>
    </div>
  );
}

interface ElementsCategoryProps {
  category: string;
  elements: BuilderElement[];
}

function ElementsCategory({ category, elements }: ElementsCategoryProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="text-xs">
          {category}
        </Badge>
        <Separator className="flex-1" />
      </div>
      <div className="space-y-2">
        {elements.map((element) => (
          <DraggableElement key={element.id} element={element} />
        ))}
      </div>
    </div>
  );
}

export function ElementsSidebar() {
  const categories = getAllCategories();

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Elements</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Drag elements to the canvas
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryElements = getElementsByCategory(category);
            return (
              <ElementsCategory
                key={category}
                category={category}
                elements={categoryElements}
              />
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
