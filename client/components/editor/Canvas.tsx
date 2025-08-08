import React, { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { 
  useSortable,
  CSS,
} from "@dnd-kit/sortable";
import { getElementByType } from "./BuilderElements";
import { useAppStore } from "@shared/store";
import { cn } from "@/lib/utils";

export interface CanvasElement {
  id: string;
  type: string;
  props: Record<string, any>;
  style: Record<string, any>;
  children?: CanvasElement[];
  parentId?: string;
}

interface CanvasProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  className?: string;
}

interface SortableElementProps {
  element: CanvasElement;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onElementsChange: (elements: CanvasElement[]) => void;
  allElements: CanvasElement[];
}

function SortableElement({ 
  element, 
  onSelect, 
  isSelected, 
  onElementsChange,
  allElements 
}: SortableElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: element.id,
    data: {
      type: "canvas-element",
      element,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const elementConfig = getElementByType(element.type);
  if (!elementConfig) return null;

  const Template = elementConfig.template;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const handleChildrenChange = useCallback((newChildren: CanvasElement[]) => {
    const updateElement = (elements: CanvasElement[]): CanvasElement[] => {
      return elements.map(el => {
        if (el.id === element.id) {
          return { ...el, children: newChildren };
        }
        if (el.children) {
          return { ...el, children: updateElement(el.children) };
        }
        return el;
      });
    };
    onElementsChange(updateElement(allElements));
  }, [element.id, onElementsChange, allElements]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        "relative group cursor-pointer",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      )}
    >
      {/* Selection overlay */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none transition-all duration-200",
          isSelected 
            ? "bg-blue-500/10 border-2 border-blue-500" 
            : "group-hover:bg-blue-500/5 group-hover:border border-blue-300"
        )}
      />
      
      {/* Element label */}
      {(isSelected || isDragging) && (
        <div className="absolute -top-6 left-0 z-10 bg-blue-500 text-white px-2 py-1 text-xs rounded font-medium">
          {elementConfig.name}
        </div>
      )}

      <Template 
        {...element.props} 
        style={element.style}
      >
        {elementConfig.canHaveChildren && element.children && (
          <Canvas 
            elements={element.children} 
            onElementsChange={handleChildrenChange}
            className="min-h-[50px]"
          />
        )}
      </Template>
    </div>
  );
}

export function Canvas({ elements, onElementsChange, className }: CanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { selectedElement, setSelectedElement } = useAppStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = elements.findIndex(el => el.id === active.id);
      const newIndex = elements.findIndex(el => el.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newElements = arrayMove(elements, oldIndex, newIndex);
        onElementsChange(newElements);
      }
    }

    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // Handle dropping new elements from the sidebar
    if (active.data.current?.type === "sidebar-element") {
      // This will be handled by the parent component
      return;
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div 
        className={cn(
          "min-h-full p-4 bg-white dark:bg-gray-800",
          "border-2 border-dashed border-gray-300 dark:border-gray-600",
          "rounded-lg transition-colors",
          className
        )}
        onClick={handleCanvasClick}
      >
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Drop elements here</p>
              <p className="text-sm">Drag components from the sidebar to start building</p>
            </div>
          </div>
        ) : (
          <SortableContext 
            items={elements.map(el => el.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {elements.map((element) => (
                <SortableElement
                  key={element.id}
                  element={element}
                  onSelect={setSelectedElement}
                  isSelected={selectedElement === element.id}
                  onElementsChange={onElementsChange}
                  allElements={elements}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="opacity-50">
            {/* Render a preview of the dragged element */}
            <div className="bg-blue-100 border-2 border-blue-300 rounded p-2">
              Dragging element...
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
